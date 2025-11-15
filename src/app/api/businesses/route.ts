import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

// Type for the RPC response
interface BusinessRPCResult {
  id: string;
  name: string;
  description: string | null;
  category: string;
  location: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  uploaded_image: string | null;
  verified: boolean;
  price_range: string;
  badge: string | null;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  total_reviews: number;
  average_rating: number;
  percentiles: Record<string, number> | null;
  distance_km: number | null;
  cursor_id: string;
  cursor_created_at: string;
}

// Mapping of interests to subcategories
const INTEREST_TO_SUBCATEGORIES: Record<string, string[]> = {
  'food-drink': ['restaurants', 'cafes', 'bars', 'fast-food', 'fine-dining'],
  'beauty-wellness': ['gyms', 'spas', 'salons', 'wellness', 'nail-salons'],
  'professional-services': ['education-learning', 'transport-travel', 'finance-insurance', 'plumbers', 'electricians', 'legal-services'],
  'outdoors-adventure': ['hiking', 'cycling', 'water-sports', 'camping'],
  'experiences-entertainment': ['events-festivals', 'sports-recreation', 'nightlife', 'comedy-clubs'],
  'arts-culture': ['museums', 'galleries', 'theaters', 'concerts'],
  'family-pets': ['family-activities', 'pet-services', 'childcare', 'veterinarians'],
  'shopping-lifestyle': ['fashion', 'electronics', 'home-decor', 'books'],
};

export async function GET(req: Request) {
  try {
    const requestUrl = req?.url ?? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/businesses`;
    const { searchParams } = new URL(requestUrl);

    // Pagination parameters - use cursor-based (keyset) pagination
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const cursorId = searchParams.get('cursor_id') || null;
    const cursorCreatedAt = searchParams.get('cursor_created_at') || null;

    // Filter parameters
    const category = searchParams.get('category') || null;
    const badge = searchParams.get('badge') || null;
    const verified = searchParams.get('verified') === 'true' ? true : null;
    const priceRange = searchParams.get('price_range') || null;
    const location = searchParams.get('location') || null;
    const minRating = searchParams.get('min_rating') ? parseFloat(searchParams.get('min_rating')!) : null;

    // Interest-based filtering
    const interestIds = searchParams.get('interest_ids')
      ? searchParams.get('interest_ids')!.split(',').filter(id => id.trim())
      : null;
    
    // Map interests to subcategories
    let subcategoriesToFilter: string[] = [];
    if (interestIds && interestIds.length > 0) {
      for (const interestId of interestIds) {
        const subcats = INTEREST_TO_SUBCATEGORIES[interestId];
        if (subcats) {
          subcategoriesToFilter.push(...subcats);
        }
      }
    }
    console.log('[BUSINESSES API] Mapped interests to subcategories:', {
      interests: interestIds,
      subcategories: subcategoriesToFilter,
    });

    // Search parameters
    const search = searchParams.get('search') || null;

    // Sorting parameters
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Location-based parameters
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 10;

    const supabase = await getServerSupabase();

    // Try to use the optimized RPC function for listing, fallback to regular query
    let businesses: BusinessRPCResult[] | null = null;
    let error: any = null;

    // Check if RPC function exists, if not fallback to regular query
    try {
      const { data, error: rpcError } = await supabase.rpc('list_businesses_optimized', {
        p_limit: limit,
        p_cursor_id: cursorId,
        p_cursor_created_at: cursorCreatedAt,
        p_category: category,
        p_location: location,
        p_verified: verified,
        p_price_range: priceRange,
        p_badge: badge,
        p_min_rating: minRating,
        p_search: search,
        p_latitude: lat,
        p_longitude: lng,
        p_radius_km: radius,
        p_sort_by: sortBy,
        p_sort_order: sortOrder,
      });

      if (rpcError && rpcError.code === '42883') {
        // RPC function doesn't exist, use fallback
        console.log('[BUSINESSES API] RPC function not found, using fallback query');
        throw new Error('RPC not found');
      }

      businesses = data as BusinessRPCResult[];
      error = rpcError;
    } catch (rpcError: any) {
      // Fallback to regular query if RPC doesn't exist
      console.log('[BUSINESSES API] Using fallback query method');
      
      let query = supabase
        .from('businesses')
        .select(`
          id, name, description, category, location, address, 
          phone, email, website, image_url, uploaded_image,
          verified, price_range, badge, slug, created_at, updated_at,
          business_stats (
            total_reviews, average_rating, percentiles
          )
        `)
        .eq('status', 'active');

      // Apply filters
      if (category) query = query.eq('category', category);
      // Interest-based filtering: filter by subcategories mapped from interests
      else if (subcategoriesToFilter && subcategoriesToFilter.length > 0) {
        console.log('[BUSINESSES API] Filtering by mapped subcategories:', subcategoriesToFilter);
        query = query.in('category', subcategoriesToFilter);
      }
      
      if (badge) query = query.eq('badge', badge);
      if (verified !== null) query = query.eq('verified', verified);
      if (priceRange) query = query.eq('price_range', priceRange);
      if (location) query = query.ilike('location', `%${location}%`);
      if (search) {
        query = query.textSearch('search_vector', search, {
          type: 'websearch',
          config: 'english'
        });
      }

      // Cursor pagination
      if (cursorId && cursorCreatedAt) {
        if (sortOrder === 'desc') {
          query = query.lt('created_at', cursorCreatedAt);
        } else {
          query = query.gt('created_at', cursorCreatedAt);
        }
      }

      // Sorting - use random order when filtering by interests, otherwise use specified sort
      if (interestIds && interestIds.length > 0) {
        console.log('[BUSINESSES API] Using random sort for interest-filtered results');
        // Supabase doesn't have native random, so we'll randomize client-side after fetch
        query = query.limit(limit * 2); // Fetch extra to randomize from
      } else {
        // Default sorting for non-interest queries
        if (sortBy === 'total_rating') {
          query = query.order('total_reviews', { ascending: sortOrder === 'asc' });
        } else {
          query = query.order('created_at', { ascending: sortOrder === 'asc' });
        }
        query = query.limit(limit);
      }

      const { data: fallbackData, error: fallbackError } = await query;
      
      if (fallbackError) {
        console.error('[BUSINESSES API] Fallback query error:', fallbackError);
        return NextResponse.json(
          { 
            error: 'Failed to fetch businesses',
            details: fallbackError.message,
            hint: fallbackError.hint,
            code: fallbackError.code,
          },
          { status: 500 }
        );
      }

      // Transform fallback data to match RPC format
      let transformedFallbackData = (fallbackData || []).map((b: any) => ({
        ...b,
        latitude: null,
        longitude: null,
        total_reviews: b.business_stats?.[0]?.total_reviews || 0,
        average_rating: b.business_stats?.[0]?.average_rating || 0,
        percentiles: b.business_stats?.[0]?.percentiles || null,
        distance_km: null,
        cursor_id: b.id,
        cursor_created_at: b.created_at,
      }));

      // Randomize results when filtering by interests
      if (interestIds && interestIds.length > 0 && transformedFallbackData.length > 0) {
        console.log('[BUSINESSES API] Randomizing results for interest filter');
        // Fisher-Yates shuffle algorithm
        for (let i = transformedFallbackData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [transformedFallbackData[i], transformedFallbackData[j]] = [transformedFallbackData[j], transformedFallbackData[i]];
        }
        // Return only the requested limit after randomizing
        transformedFallbackData = transformedFallbackData.slice(0, limit);
      }

      businesses = transformedFallbackData;
    }

    if (error) {
      console.error('[BUSINESSES API] Error fetching businesses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch businesses', details: error.message },
        { status: 500 }
      );
    }

    const typedBusinesses = (businesses || []) as BusinessRPCResult[];

    console.log(`[BUSINESSES API] Successfully fetched ${typedBusinesses.length} businesses`);
    console.log('[BUSINESSES API] Query params:', {
      category, badge, verified, priceRange, location, search,
      sortBy, sortOrder, limit, cursorId
    });

    // Transform database format to BusinessCard component format
    // Only select fields needed for card display (not full business data)
    const transformedBusinesses = typedBusinesses.map(business => {
      const hasRating = business.average_rating && business.average_rating > 0;
      const hasReviews = business.total_reviews && business.total_reviews > 0;
      const shouldShowBadge = business.verified && business.badge;
      
      return {
        // Card essentials only
        id: business.id,
        name: business.name,
        image: business.image_url || business.uploaded_image,
        category: business.category,
        location: business.location,
        rating: hasRating ? Math.round(business.average_rating * 2) / 2 : undefined,
        totalRating: hasRating ? business.average_rating : undefined,
        reviews: hasReviews ? business.total_reviews : 0,
        badge: shouldShowBadge ? business.badge : undefined,
        href: `/business/${business.id}`,
        verified: business.verified || false,
        priceRange: business.price_range || '$$',
        distance: business.distance_km,
        hasRating,
        // Percentiles for detail view (optional)
        percentiles: business.percentiles ? {
          service: business.percentiles.service || 85,
          price: business.percentiles.price || 85,
          ambience: business.percentiles.ambience || 85,
        } : undefined,
      };
    });

    // Get cursor for next page from last item
    const nextCursor = typedBusinesses.length > 0 
      ? {
          cursor_id: typedBusinesses[typedBusinesses.length - 1].cursor_id,
          cursor_created_at: typedBusinesses[typedBusinesses.length - 1].cursor_created_at,
        }
      : null;

    const hasMore = typedBusinesses.length === limit;

    const response = NextResponse.json({
      data: transformedBusinesses,
      meta: {
        count: transformedBusinesses.length,
        limit,
        hasMore,
        nextCursor,
      }
    });

    // Add Cache-Control headers for better performance
    // Cache for 5 minutes on client, 1 hour on CDN with stale-while-revalidate
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=7200'
    );

    // Add ETag for conditional requests
    const etag = `W/"businesses-${Date.now()}"`;
    response.headers.set('ETag', etag);

    // Add Vary header to cache by query params
    response.headers.set('Vary', 'Accept-Encoding');

    return response;

  } catch (error) {
    console.error('Error in businesses API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for trending/top businesses (uses materialized views)
export async function HEAD(req: Request) {
  try {
    const requestUrl = req?.url ?? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/businesses`;
    const { searchParams } = new URL(requestUrl);
    const type = searchParams.get('type'); // 'trending', 'top', 'new'
    const category = searchParams.get('category') || null;
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const supabase = await getServerSupabase();

    let data, error;

    // Use pre-computed materialized views for fast access
    switch (type) {
      case 'trending':
        ({ data, error } = await supabase.rpc('get_trending_businesses', {
          p_limit: limit,
          p_category: category,
        }));
        break;

      case 'top':
        ({ data, error } = await supabase.rpc('get_top_rated_businesses', {
          p_limit: limit,
          p_category: category,
        }));
        break;

      case 'new':
        ({ data, error } = await supabase.rpc('get_new_businesses', {
          p_limit: limit,
          p_category: category,
        }));
        break;

      default:
        // Fall back to regular listing
        return GET(req);
    }

    if (error) {
      console.error('[BUSINESSES API] Error fetching special list:', error);
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      );
    }

    // Transform to card format
    const transformedBusinesses = (data || []).map((business: any) => ({
      id: business.id,
      name: business.name,
      image: business.image_url || business.uploaded_image,
      category: business.category,
      location: business.location,
      rating: business.average_rating > 0 ? Math.round(business.average_rating * 2) / 2 : undefined,
      totalRating: business.average_rating > 0 ? business.average_rating : undefined,
      reviews: business.total_reviews || 0,
      badge: business.verified && business.badge ? business.badge : undefined,
      href: `/business/${business.id}`,
      verified: business.verified || false,
      priceRange: business.price_range || '$$',
      hasRating: business.average_rating > 0,
      percentiles: business.percentiles,
    }));

    const response = NextResponse.json({
      data: transformedBusinesses,
      meta: {
        count: transformedBusinesses.length,
        type,
        category,
      }
    });

    // Cache aggressively for trending/top lists (15 minutes)
    // These are refreshed by cron so can be cached longer
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=900, stale-while-revalidate=1800'
    );

    return response;

  } catch (error) {
    console.error('Error in special businesses list API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
