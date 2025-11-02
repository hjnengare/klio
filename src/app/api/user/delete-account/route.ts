import { NextResponse } from "next/server";
import { getServerSupabase } from "../../../lib/supabase/server";

export async function DELETE(req: Request) {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First, delete user's avatar from storage
    try {
      const { data: files } = await supabase.storage
        .from('avatars')
        .list(user.id);
      
      if (files && files.length > 0) {
        const pathsToDelete = files.map(file => `${user.id}/${file.name}`);
        await supabase.storage
          .from('avatars')
          .remove(pathsToDelete);
      }
    } catch (storageError) {
      console.error('Error deleting avatar files:', storageError);
      // Continue with account deletion even if storage deletion fails
    }

    // Delete review images from storage
    try {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id);

      if (reviews && reviews.length > 0) {
        const reviewIds = reviews.map(r => r.id);
        const { data: images } = await supabase
          .from('review_images')
          .select('image_url')
          .in('review_id', reviewIds);

        if (images && images.length > 0) {
          const pathsToDelete = images.map(img => {
            // Extract path from full URL
            const urlParts = img.image_url.split('/');
            return urlParts[urlParts.length - 1];
          });
          
          await supabase.storage
            .from('review-images')
            .remove(pathsToDelete);
        }
      }
    } catch (storageError) {
      console.error('Error deleting review images:', storageError);
      // Continue with account deletion even if storage deletion fails
    }

    // Delete the user from auth.users
    // This will cascade delete all related data in profiles, user_interests, reviews, etc.
    const { error } = await supabase.rpc('delete_user_account', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Error deleting account:', error);
      return NextResponse.json(
        { error: 'Failed to delete account. Please contact support.' },
        { status: 500 }
      );
    }

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
