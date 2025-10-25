import { supabase } from '../supabase';
import type { Review, ReviewWithUser, ReviewFormData, ReviewImage } from '../types/database';

export class ReviewService {
  static async getReviewsForBusiness(businessId: string, limit: number = 10): Promise<ReviewWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users (
            id,
            name,
            avatar_url
          ),
          review_images (
            id,
            image_url,
            alt_text
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  static async createReview(reviewData: ReviewFormData, userId: string): Promise<Review | null> {
    try {
      // First, create the review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          business_id: reviewData.business_id,
          user_id: userId,
          rating: reviewData.rating,
          title: reviewData.title || null,
          content: reviewData.content,
          tags: reviewData.tags,
          helpful_count: 0
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      // If there are images, upload them
      if (reviewData.images && reviewData.images.length > 0) {
        await this.uploadReviewImages(review.id, reviewData.images);
      }

      // Update business stats
      await this.updateBusinessStats(reviewData.business_id);

      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  static async uploadReviewImages(reviewId: string, images: File[]): Promise<ReviewImage[]> {
    const uploadedImages: ReviewImage[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const fileExt = image.name.split('.').pop();
      const fileName = `${reviewId}_${i}.${fileExt}`;
      const filePath = `review-images/${fileName}`;

      try {
        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(filePath, image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(filePath);

        // Save image record to database
        const { data: imageRecord, error: dbError } = await supabase
          .from('review_images')
          .insert({
            review_id: reviewId,
            image_url: publicUrl,
            alt_text: `Review image ${i + 1}`
          })
          .select()
          .single();

        if (dbError) {
          console.error('Error saving image record:', dbError);
          continue;
        }

        uploadedImages.push(imageRecord);
      } catch (error) {
        console.error('Error processing image upload:', error);
        continue;
      }
    }

    return uploadedImages;
  }

  static async updateBusinessStats(businessId: string): Promise<void> {
    try {
      // Get all reviews for the business
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('business_id', businessId);

      if (reviewsError) throw reviewsError;

      if (!reviews || reviews.length === 0) return;

      // Calculate stats
      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;

      // Calculate rating distribution
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });

      // Calculate percentiles (simplified - in real app you'd compare against all businesses)
      const percentiles = {
        service: Math.min(95, Math.round(averageRating * 20)), // Mock calculation
        price: Math.min(90, Math.round((averageRating - 0.2) * 20)), // Mock calculation
        ambience: Math.min(93, Math.round((averageRating + 0.1) * 20)) // Mock calculation
      };

      // Upsert business stats
      const { error: statsError } = await supabase
        .from('business_stats')
        .upsert({
          business_id: businessId,
          total_reviews: totalReviews,
          average_rating: parseFloat(averageRating.toFixed(1)),
          rating_distribution: ratingDistribution,
          percentiles
        });

      if (statsError) throw statsError;
    } catch (error) {
      console.error('Error updating business stats:', error);
    }
  }

  static async getRecentReviews(limit: number = 10): Promise<ReviewWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users (
            id,
            name,
            avatar_url
          ),
          business:businesses (
            id,
            name,
            category
          ),
          review_images (
            id,
            image_url,
            alt_text
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      return [];
    }
  }

  static async likeReview(reviewId: string, userId: string): Promise<boolean> {
    try {
      // Check if user already liked this review
      const { data: existingLike } = await supabase
        .from('review_likes')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userId);

        if (error) throw error;

        // Decrement helpful count
        await this.updateReviewHelpfulCount(reviewId, -1);
        return false; // Unliked
      } else {
        // Add like
        const { error } = await supabase
          .from('review_likes')
          .insert({
            review_id: reviewId,
            user_id: userId
          });

        if (error) throw error;

        // Increment helpful count
        await this.updateReviewHelpfulCount(reviewId, 1);
        return true; // Liked
      }
    } catch (error) {
      console.error('Error toggling review like:', error);
      throw error;
    }
  }

  private static async updateReviewHelpfulCount(reviewId: string, increment: number): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_review_helpful_count', {
        review_id: reviewId,
        increment_by: increment
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  }

  static async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    try {
      // First, check if the review belongs to the user
      const { data: review, error: fetchError } = await supabase
        .from('reviews')
        .select('user_id, business_id')
        .eq('id', reviewId)
        .single();

      if (fetchError || !review) {
        return false;
      }

      if (review.user_id !== userId) {
        throw new Error('Unauthorized: Cannot delete another user\'s review');
      }

      // Delete review images from storage
      const { data: images } = await supabase
        .from('review_images')
        .select('image_url')
        .eq('review_id', reviewId);

      if (images) {
        for (const image of images) {
          const filePath = image.image_url.split('/').pop();
          if (filePath) {
            await supabase.storage
              .from('review-images')
              .remove([`review-images/${filePath}`]);
          }
        }
      }

      // Delete the review (this will cascade delete related records)
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (deleteError) throw deleteError;

      // Update business stats
      await this.updateBusinessStats(review.business_id);

      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}
