import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20'))); // Max 50, min 1
    const offset = (page - 1) * limit;

    // Filter parameters
    const category = searchParams.get('category');
    const badge = searchParams.get('badge');
    const verified = searchParams.get('verified');
    const priceRange = searchParams.get('price_range');
    const location = searchParams.get('location');

    // Search parameters
    const search = searchParams.get('search');

    // Sorting parameters
    const sortBy = searchParams.get('sort_by') || 'total_rating';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Location-based parameters
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 10;

    const supabase = await getServerSupabase();

    // Base query - only select active businesses with stats
    let query = supabase
      .from('businesses')
      .select(`
        *,
        business_stats (
          total_reviews,
          average_rating,
          percentiles
        )
      `)
      .eq('status', 'active');

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (badge) {
      query = query.eq('badge', badge);
    }

    if (verified === 'true') {
      query = query.eq('verified', true);
    }

    if (priceRange) {
      query = query.eq('price_range', priceRange);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Full-text search
    if (search) {
      query = query.textSearch('search_vector', search, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Sorting
    // Note: total_rating doesn't exist directly - we'll sort by created_at and then sort results by stats
    const validSortFields = ['created_at', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const ascending = sortOrder === 'asc';

    query = query.order(sortField, { ascending });

    // Add secondary sort for consistency
    if (sortField !== 'created_at') {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: businesses, error } = await query;

    if (error) {
      console.error('[BUSINESSES API] Error fetching businesses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      );
    }

    console.log('[BUSINESSES API] Raw businesses data:', JSON.stringify(businesses, null, 2));
    console.log('[BUSINESSES API] Number of businesses fetched:', businesses?.length || 0);

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    console.log(`[BUSINESSES API] Successfully fetched ${businesses?.length || 0} businesses (page ${page})`);
    console.log('[BUSINESSES API] Query params:', {
      category, badge, verified, priceRange, location, search,
      sortBy: sortField, sortOrder, page, limit
    });

    // Transform database format to BusinessCard component format
    let transformedBusinesses = businesses?.map(business => {
      const stats = business.business_stats?.[0] || null;
      const percentiles = stats?.percentiles || null;
      
      // Determine if business has a rating
      const hasRating = stats?.average_rating && stats.average_rating > 0;
      const hasReviews = stats?.total_reviews && stats.total_reviews > 0;
      
      // Only show badge if business is verified AND has a badge value
      const shouldShowBadge = business.verified && business.badge;
      
      return {
        id: business.id,
        name: business.name,
        image: business.image_url || business.uploaded_image || business.image,
        image_url: business.image_url,
        uploaded_image: business.uploaded_image,
        alt: `${business.name} ${business.category}`,
        category: business.category,
        location: business.location,
        // Handle missing ratings - return null/undefined to indicate no rating yet
        rating: hasRating ? Math.round(stats.average_rating * 2) / 2 : undefined,
        totalRating: hasRating ? stats.average_rating : undefined,
        reviews: hasReviews ? stats.total_reviews : 0,
        // Only include badge if business is verified
        badge: shouldShowBadge ? business.badge : undefined,
        href: `/business/${business.id}`,
        percentiles: percentiles ? {
          service: percentiles.service || 85,
          price: percentiles.price || 85,
          ambience: percentiles.ambience || 85,
        } : undefined,
        verified: business.verified || false,
        distance: undefined, // Can be calculated client-side with geolocation
        priceRange: business.price_range || '$$',
        // Additional fields for enhanced UI
        description: business.description,
        phone: business.phone,
        website: business.website,
        address: business.address,
        // Extract amenity type from category (if category is an amenity like "restaurant", "cafe", etc.)
        amenity: business.category && ['restaurant', 'cafe', 'bar', 'fast_food', 'bakery', 'coffee_shop'].includes(business.category.toLowerCase()) 
          ? business.category 
          : undefined,
        // Create tags from category and other attributes
        tags: (() => {
          const tagList: string[] = [];
          if (business.category) tagList.push(business.category);
          if (business.price_range) tagList.push(business.price_range);
          if (business.verified) tagList.push('Verified');
          return tagList.length > 0 ? tagList : undefined;
        })(),
        // Flag to indicate if rating exists
        hasRating: hasRating,
      };
    }) || [];

    // Post-sort by stats if sortBy was total_rating or reviews
    if (sortBy === 'total_rating' || sortBy === 'reviews') {
      transformedBusinesses.sort((a, b) => {
        if (sortBy === 'total_rating') {
          // Handle undefined ratings - put them at the end
          if (a.totalRating === undefined && b.totalRating === undefined) return 0;
          if (a.totalRating === undefined) return 1; // a goes to end
          if (b.totalRating === undefined) return -1; // b goes to end
          return ascending ? a.totalRating - b.totalRating : b.totalRating - a.totalRating;
        } else if (sortBy === 'reviews') {
          // Handle businesses with 0 reviews - put them at the end when sorting desc
          const aReviews = a.reviews || 0;
          const bReviews = b.reviews || 0;
          if (!ascending && aReviews === 0 && bReviews === 0) return 0;
          if (!ascending && aReviews === 0) return 1; // a goes to end
          if (!ascending && bReviews === 0) return -1; // b goes to end
          return ascending ? aReviews - bReviews : bReviews - aReviews;
        }
        return 0;
      });
    }

    const totalPages = Math.ceil((totalCount || 0) / limit);
    const hasMore = page < totalPages;

    console.log('[BUSINESSES API] Transformed businesses:', JSON.stringify(transformedBusinesses, null, 2));
    console.log('[BUSINESSES API] Response metadata:', {
      count: transformedBusinesses.length,
      totalCount,
      page,
      totalPages,
      hasMore
    });

    return NextResponse.json({
      data: transformedBusinesses,
      meta: {
        count: transformedBusinesses.length,
        totalCount: totalCount || 0,
        page,
        limit,
        totalPages,
        hasMore,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error in businesses API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
