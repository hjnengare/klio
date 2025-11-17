/**
 * Optimized Query Utilities
 * High-level utilities combining caching, parallel execution, and connection pooling
 */

import { getPooledSupabaseClient, createParallelClients } from "../supabase/pool";
import { executeParallelQueries, batchFetchByIds, executeWithRetry } from "./asyncQueries";
import { queryCache } from "../cache/queryCache";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetch business with all related data in parallel
 * Uses caching and parallel queries for optimal performance
 */
export async function fetchBusinessOptimized(
  businessId: string,
  request?: Request,
  useCache: boolean = true
) {
  const cacheKey = queryCache.key('business', { id: businessId });

  // Check cache first
  if (useCache) {
    const cached = queryCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Create parallel clients for independent queries
  const [client1, client2, client3] = await createParallelClients(3);

  // Execute all queries in parallel
  const [businessResult, reviewsResult, statsResult] = await executeParallelQueries([
    // Business data
    async () =>
      executeWithRetry(
        async () => {
          const { data, error } = await client1
            .from('businesses')
            .select('*')
            .eq('id', businessId)
            .single();
          return { data, error };
        }
      ),
    // Reviews
    async () =>
      executeWithRetry(
        async () => {
          const { data, error } = await client2
            .from('reviews')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false })
            .limit(20);
          return { data, error };
        }
      ),
    // Stats
    async () =>
      executeWithRetry(
        async () => {
          const { data, error } = await client3
            .from('business_stats')
            .select('*')
            .eq('business_id', businessId)
            .single();
          return { data, error };
        }
      ),
  ]);

  // Handle errors
  if (businessResult.error || !businessResult.data) {
    throw businessResult.error || new Error('Business not found');
  }

  // Fetch related data if reviews exist
  let reviewsWithProfiles = [];
  if (reviewsResult.data && reviewsResult.data.length > 0) {
    const reviewIds: string[] = reviewsResult.data.map((r: any) => r.id).filter((id): id is string => typeof id === 'string');
    const userIdsArray = reviewsResult.data.map((r: any) => r.user_id).filter((id): id is string => typeof id === 'string');
    const userIds: string[] = Array.from(new Set(userIdsArray));

    // Fetch images and profiles in parallel
    const [imagesResult, profilesResult] = await executeParallelQueries([
      () =>
        batchFetchByIds(client1, 'review_images', reviewIds, 'id, review_id, image_url, storage_path, alt_text'),
      () =>
        batchFetchByIds(client2, 'profiles', userIds, 'user_id, display_name, avatar_url'),
    ]);

    // Combine data
    const imagesMap: Record<string, any[]> = {};
    if (imagesResult.data) {
      imagesResult.data.forEach((img: any) => {
        if (!imagesMap[img.review_id]) {
          imagesMap[img.review_id] = [];
        }
        imagesMap[img.review_id].push(img);
      });
    }

    reviewsWithProfiles = reviewsResult.data.map((review: any) => {
      const profile = profilesResult.data?.find((p: any) => p.user_id === review.user_id);
      const images = imagesMap[review.id] || [];
      return {
        ...review,
        profile,
        images,
      };
    });
  }

  // Combine results
  const result = {
    ...businessResult.data,
    stats: statsResult.data || null,
    reviews: reviewsWithProfiles,
  };

  // Cache result (5 minute TTL for business data)
  if (useCache) {
    queryCache.set(cacheKey, result, 300000);
  }

  return result;
}

/**
 * Fetch multiple businesses in parallel with batching
 */
export async function fetchBusinessesOptimized(
  businessIds: string[],
  request?: Request,
  useCache: boolean = true
) {
  if (businessIds.length === 0) {
    return [];
  }

  // Check cache for each ID
  const uncachedIds: string[] = [];
  const cachedResults: any[] = [];

  if (useCache) {
    for (const id of businessIds) {
      const cacheKey = queryCache.key('business', { id });
      const cached = queryCache.get(cacheKey);
      if (cached) {
        cachedResults.push(cached);
      } else {
        uncachedIds.push(id);
      }
    }
  } else {
    uncachedIds.push(...businessIds);
  }

  // Fetch uncached businesses
  if (uncachedIds.length > 0) {
    const client = request
      ? await getPooledSupabaseClient(request)
      : await getPooledSupabaseClient();

    const result = await batchFetchByIds(client, 'businesses', uncachedIds);

    if (result.data) {
      // Cache each result
      if (useCache) {
        result.data.forEach((business: any) => {
          const cacheKey = queryCache.key('business', { id: business.id });
          queryCache.set(cacheKey, business, 300000);
        });
      }

      cachedResults.push(...result.data);
    }
  }

  return cachedResults;
}

/**
 * Invalidate business cache
 */
export function invalidateBusinessCache(businessId?: string) {
  if (businessId) {
    const cacheKey = queryCache.key('business', { id: businessId });
    queryCache.delete(cacheKey);
  } else {
    // Invalidate all business caches
    queryCache.deleteByPrefix('business:');
  }
}

