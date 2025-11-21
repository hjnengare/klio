import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await getServerSupabase();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const business_id = formData.get('business_id')?.toString();
    const rating = parseInt(formData.get('rating')?.toString() ?? '0', 10);
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const tags = formData.getAll('tags').map(tag => tag.toString());
    const imageFiles = formData
      .getAll('images')
      .filter((file): file is File => file instanceof File && file.size > 0);

    // Validate required fields
    if (!business_id) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    if (!rating || Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Review content is required' },
        { status: 400 }
      );
    }

    // Check if business exists
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('id', business_id)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this business
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('business_id', business_id)
      .eq('user_id', user.id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this business' },
        { status: 400 }
      );
    }

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        business_id,
        user_id: user.id,
        rating,
        title: title || null,
        content: content.trim(),
        tags,
        helpful_count: 0,
      })
      .select(`
        *,
        profile:profiles!reviews_user_id_fkey (
          user_id,
          display_name,
          username,
          avatar_url
        )
      `)
      .single();

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      return NextResponse.json(
        { error: 'Failed to create review', details: reviewError.message },
        { status: 500 }
      );
    }

    // Handle image uploads if provided
    if (imageFiles.length > 0) {
      const uploadedImages = [];
      
      for (let i = 0; i < Math.min(imageFiles.length, 5); i++) {
        const imageFile = imageFiles[i];

        try {
          const fileExt = imageFile.name.split('.').pop() || 'jpg';
          const filePath = `${review.id}/${Date.now()}_${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('review_images')
            .upload(filePath, imageFile, {
              contentType: imageFile.type,
            });

          if (uploadError) {
            console.error('Error uploading review image:', uploadError);
            continue;
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from('review_images').getPublicUrl(filePath);

          const { data: imageRecord, error: imageError } = await supabase
            .from('review_images')
            .insert({
              review_id: review.id,
              storage_path: filePath,
              image_url: publicUrl,
              alt_text: imageFile.name || `Review image ${i + 1}`,
            })
            .select()
            .single();

          if (!imageError && imageRecord) {
            uploadedImages.push(imageRecord);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          // Continue with other images even if one fails
        }
      }
    }

    // Update business stats using RPC function (if it exists) or manual calculation
    const { error: statsError } = await supabase.rpc('update_business_stats', {
      p_business_id: business_id
    });

    if (statsError) {
      console.error('Error updating business stats via RPC:', statsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      review,
    });

  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await getServerSupabase();
    const { searchParams } = new URL(req.url);
    
    const businessId = searchParams.get('business_id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Optimize: Select only necessary fields for faster queries
    let query = supabase
      .from('reviews')
      .select(`
        id,
        user_id,
        business_id,
        rating,
        content,
        title,
        tags,
        created_at,
        helpful_count,
        profile:profiles!reviews_user_id_fkey (
          user_id,
          display_name,
          username,
          avatar_url
        ),
        review_images (
          review_id,
          image_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reviews: reviews || [],
      count: reviews?.length || 0,
    });

  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

