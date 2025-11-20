import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../../../lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/reviews/[id]/helpful
 * Toggle helpful vote on a review
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await getServerSupabase();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to vote on reviews' },
        { status: 401 }
      );
    }

    // Check if review exists
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, helpful_count')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user has already voted
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('review_helpful_votes')
      .select('review_id, user_id')
      .eq('review_id', id)
      .eq('user_id', user.id)
      .single();

    if (voteCheckError && voteCheckError.code !== 'PGRST116') {
      // PGRST116 = not found, which is fine
      console.error('Error checking existing vote:', voteCheckError);
      return NextResponse.json(
        { error: 'Failed to check vote status' },
        { status: 500 }
      );
    }

    const hasVoted = !!existingVote;
    let newHelpfulCount = review.helpful_count;

    if (hasVoted) {
      // Remove vote - delete from review_helpful_votes
      const { error: deleteError } = await supabase
        .from('review_helpful_votes')
        .delete()
        .eq('review_id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error removing vote:', deleteError);
        return NextResponse.json(
          { error: 'Failed to remove vote' },
          { status: 500 }
        );
      }

      // Decrement helpful_count (ensure it doesn't go below 0)
      newHelpfulCount = Math.max(0, review.helpful_count - 1);
    } else {
      // Add vote - insert into review_helpful_votes
      const { error: insertError } = await supabase
        .from('review_helpful_votes')
        .insert({
          review_id: id,
          user_id: user.id,
        });

      if (insertError) {
        console.error('Error adding vote:', insertError);
        return NextResponse.json(
          { error: 'Failed to add vote', details: insertError.message },
          { status: 500 }
        );
      }

      // Increment helpful_count
      newHelpfulCount = review.helpful_count + 1;
    }

    // Update helpful_count in reviews table
    const { error: updateError } = await supabase
      .from('reviews')
      .update({ helpful_count: newHelpfulCount })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating helpful count:', updateError);
      return NextResponse.json(
        { error: 'Failed to update helpful count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      has_voted: !hasVoted, // Toggled state
      helpful_count: newHelpfulCount,
      message: hasVoted ? 'Vote removed successfully' : 'Vote added successfully',
    });

  } catch (error) {
    console.error('Error in helpful vote toggle API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reviews/[id]/helpful
 * Get helpful vote status for current user
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await getServerSupabase();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to check vote status' },
        { status: 401 }
      );
    }

    // Check if review exists
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, helpful_count')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user has voted
    const { data: vote, error: voteError } = await supabase
      .from('review_helpful_votes')
      .select('review_id, user_id')
      .eq('review_id', id)
      .eq('user_id', user.id)
      .single();

    if (voteError && voteError.code !== 'PGRST116') {
      // PGRST116 = not found, which is fine
      console.error('Error checking vote:', voteError);
      return NextResponse.json(
        { error: 'Failed to check vote status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      has_voted: !!vote,
      helpful_count: review.helpful_count,
    });

  } catch (error) {
    console.error('Error in helpful vote status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

