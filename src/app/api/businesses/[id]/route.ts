import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/businesses/[id]
 * Fetches a single business by ID with stats and reviews
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const supabase = await getServerSupabase();

    // Fetch business with stats
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select(`
        *,
        business_stats (
          total_reviews,
          average_rating,
          rating_distribution,
          percentiles
        )
      `)
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      if (businessError?.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
      throw businessError || new Error('Business not found');
    }

    // Fetch reviews for the business (limit to 20 for the profile page)
    // Note: Since there's no direct FK between reviews and review_images/profiles, we fetch them separately
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (reviewsError) {
      console.error('[API] Error fetching reviews:', reviewsError);
    }

    // Fetch review images separately
    let reviewImagesMap: Record<string, any[]> = {};
    if (reviews && reviews.length > 0) {
      const reviewIds = reviews.map((r: any) => r.id);
      const { data: reviewImages, error: imagesError } = await supabase
        .from('review_images')
        .select('id, review_id, image_url, storage_path, alt_text')
        .in('review_id', reviewIds);

      if (imagesError) {
        console.error('[API] Error fetching review images:', imagesError);
      } else if (reviewImages) {
        // Group images by review_id
        reviewImages.forEach((img: any) => {
          if (!reviewImagesMap[img.review_id]) {
            reviewImagesMap[img.review_id] = [];
          }
          reviewImagesMap[img.review_id].push(img);
        });
      }
    }

    // Fetch profiles for the review authors
    let reviewsWithProfiles = [];
    if (reviews && reviews.length > 0) {
      const userIds = [...new Set(reviews.map((r: any) => r.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('[API] Error fetching profiles:', profilesError);
      }

      // Join reviews with profiles and images
      reviewsWithProfiles = reviews.map((review: any) => {
        const profile = profiles?.find((p: any) => p.user_id === review.user_id);
        const images = reviewImagesMap[review.id] || [];
        return {
          ...review,
          profiles: profile || null,
          review_images: images,
        };
      });
    }

    // Transform the data for the frontend
    const stats = business.business_stats?.[0];
    const response = {
      ...business,
      stats: stats || undefined,
      reviews: (reviewsWithProfiles || []).map((review: any) => {
        // Handle profiles - it might be an array or object depending on join type
        const profile = Array.isArray(review.profiles) ? review.profiles[0] : review.profiles;
        return {
          id: review.id,
          author: profile?.display_name || 'Anonymous',
          rating: review.rating,
          text: review.content || review.title || '',
          date: new Date(review.created_at).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          }),
          tags: review.tags || [],
          profileImage: profile?.avatar_url || '',
          reviewImages: review.review_images?.map((img: any) => {
            // Use image_url if available, otherwise construct from storage_path
            if (img.image_url) return img.image_url;
            if (img.storage_path) {
              // Construct public URL from storage path
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
              return `${supabaseUrl}/storage/v1/object/public/review-images/${img.storage_path}`;
            }
            return null;
          }).filter(Boolean) || [],
          helpfulCount: review.helpful_count || 0,
        };
      }),
      // Format images array for carousel - filter out empty strings and null values
      images: (() => {
        const imageList: string[] = [];
        if (business.uploaded_image && business.uploaded_image.trim() !== '') {
          imageList.push(business.uploaded_image);
        }
        if (business.image_url && business.image_url.trim() !== '' && !imageList.includes(business.image_url)) {
          imageList.push(business.image_url);
        }
        return imageList.filter(img => img && img.trim() !== '');
      })(),
      // Calculate metrics from percentiles if available
      trust: stats?.percentiles?.service || 85,
      punctuality: stats?.percentiles?.price || 85,
      friendliness: stats?.percentiles?.ambience || 85,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[API] Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business', details: error.message },
      { status: 500 }
    );
  }
}

