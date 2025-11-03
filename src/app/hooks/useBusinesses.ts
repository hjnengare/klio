/**
 * Hook to fetch businesses from the API
 */

import { useState, useEffect } from 'react';
import { Business } from '../components/BusinessCard/BusinessCard';

export interface UseBusinessesOptions {
  limit?: number;
  category?: string;
  sortBy?: 'total_rating' | 'reviews' | 'created_at' | 'name';
  sortOrder?: 'asc' | 'desc';
  verified?: boolean;
  badge?: string;
  location?: string;
  priceRange?: string;
}

export interface UseBusinessesResult {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch businesses from the API
 */
export function useBusinesses(options: UseBusinessesOptions = {}): UseBusinessesResult {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.category) params.set('category', options.category);
      if (options.sortBy) params.set('sort_by', options.sortBy);
      if (options.sortOrder) params.set('sort_order', options.sortOrder);
      if (options.verified !== undefined) params.set('verified', options.verified.toString());
      if (options.badge) params.set('badge', options.badge);
      if (options.location) params.set('location', options.location);
      if (options.priceRange) params.set('price_range', options.priceRange);

      const response = await fetch(`/api/businesses?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[useBusinesses] API Response:', JSON.stringify(data, null, 2));
      console.log('[useBusinesses] Businesses array:', data.data || []);
      console.log('[useBusinesses] Number of businesses:', data.data?.length || 0);
      setBusinesses(data.data || []);
    } catch (err: any) {
      console.error('Error fetching businesses:', err);
      setError(err.message || 'Failed to fetch businesses');
      setBusinesses([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [
    options.limit,
    options.category,
    options.sortBy,
    options.sortOrder,
    options.verified,
    options.badge,
    options.location,
    options.priceRange,
  ]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinesses,
  };
}

/**
 * Hook to fetch trending businesses (sorted by rating, limited)
 */
export function useTrendingBusinesses(limit: number = 10): UseBusinessesResult {
  return useBusinesses({
    limit,
    sortBy: 'total_rating',
    sortOrder: 'desc',
  });
}

/**
 * Hook to fetch businesses for "For You" section (can be personalized later)
 */
export function useForYouBusinesses(limit: number = 10): UseBusinessesResult {
  return useBusinesses({
    limit,
    sortBy: 'total_rating',
    sortOrder: 'desc',
  });
}

