import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../../lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/reviews/[id]
 * Edit a review
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await getServerSupabase();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to edit a review' },
        { status: 401 }
      );
    }

    // Check if review exists and user owns it
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, user_id, business_id')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own reviews' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { rating, title, content, tags } = body;

    // Validate rating if provided
    if (rating !== undefined) {
      if (Number.isNaN(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
    }

    // Validate content if provided
    if (content !== undefined && (!content || content.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Review content cannot be empty' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (rating !== undefined) {
      updateData.rating = rating;
    }
    if (title !== undefined) {
      updateData.title = title || null;
    }
    if (content !== undefined) {
      updateData.content = content.trim();
    }
    if (tags !== undefined) {
      updateData.tags = tags;
    }

    // Update the review
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        profile:profiles!reviews_user_id_fkey (
          user_id,
          display_name,
          avatar_url
        ),
        review_images (
          id,
          image_url,
          alt_text
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating review:', updateError);
      return NextResponse.json(
        { error: 'Failed to update review', details: updateError.message },
        { status: 500 }
      );
    }

    // Update business stats if rating changed
    if (rating !== undefined) {
      const { error: statsError } = await supabase.rpc('update_business_stats', {
        p_business_id: review.business_id
      });

      if (statsError) {
        console.error('Error updating business stats via RPC:', statsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview,
    });

  } catch (error) {
    console.error('Error in edit review API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reviews/[id]
 * Delete a review
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await getServerSupabase();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a review' },
        { status: 401 }
      );
    }

    // Check if review exists and user owns it
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, user_id, business_id')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    const businessId = review.business_id;

    // Get all review images before deletion
    const { data: reviewImages } = await supabase
      .from('review_images')
      .select('storage_path')
      .eq('review_id', id);

    // Delete images from storage
    if (reviewImages && reviewImages.length > 0) {
      const filePaths = reviewImages.map(img => img.storage_path);
      
      for (const filePath of filePaths) {
        const { error: deleteError } = await supabase.storage
          .from('review_images')
          .remove([filePath]);

        if (deleteError) {
          console.error('Error deleting review image from storage:', deleteError);
        }
      }
    }

    // Delete review images records (should cascade, but explicit delete is safer)
    const { error: imagesDeleteError } = await supabase
      .from('review_images')
      .delete()
      .eq('review_id', id);

    if (imagesDeleteError) {
      console.error('Error deleting review images:', imagesDeleteError);
    }

    // Delete helpful votes (should cascade, but explicit delete is safer)
    const { error: votesDeleteError } = await supabase
      .from('review_helpful_votes')
      .delete()
      .eq('review_id', id);

    if (votesDeleteError) {
      console.error('Error deleting helpful votes:', votesDeleteError);
    }

    // Delete the review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting review:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete review', details: deleteError.message },
        { status: 500 }
      );
    }

    // Update business stats
    const { error: statsError } = await supabase.rpc('update_business_stats', {
      p_business_id: businessId
    });

    if (statsError) {
      console.error('Error updating business stats via RPC:', statsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });

  } catch (error) {
    console.error('Error in delete review API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

