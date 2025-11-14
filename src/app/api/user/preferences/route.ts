import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

/**
 * GET /api/user/preferences
 * Fetches the current user's interests, subcategories, and deal-breakers
 * Returns empty arrays if tables don't exist or user has no preferences
 */
export async function GET(req: Request) {
  try {
    const supabase = await getServerSupabase();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[Preferences API] No authenticated user');
      return NextResponse.json(
        {
          interests: [],
          subcategories: [],
          dealbreakers: [],
        },
        { status: 200 }
      );
    }

    console.log('[Preferences API] Fetching preferences for user:', user.id);

    // Fetch user's interests - handle gracefully if table doesn't exist
    let interestIds: string[] = [];
    const { data: interestsData, error: interestsError } = await supabase
      .from('user_interests')
      .select('interest_id')
      .eq('user_id', user.id);

    if (interestsError) {
      console.warn('[Preferences API] Warning fetching interests:', interestsError.message);
      // Don't throw - table might not exist yet
    } else if (interestsData) {
      interestIds = interestsData.map(i => i.interest_id);
    }

    // Fetch user's subcategories
    let subcategoryIds: string[] = [];
    const { data: subcategoriesData, error: subcategoriesError } = await supabase
      .from('user_subcategories')
      .select('subcategory_id')
      .eq('user_id', user.id);

    if (subcategoriesError) {
      console.warn('[Preferences API] Warning fetching subcategories:', subcategoriesError.message);
      // Don't throw - table might not exist yet
    } else if (subcategoriesData) {
      subcategoryIds = subcategoriesData.map(s => s.subcategory_id);
    }

    // Fetch user's deal-breakers
    let dealbreakersIds: string[] = [];
    const { data: dealbreakersData, error: dealbreakersError } = await supabase
      .from('user_dealbreakers')
      .select('dealbreaker_id')
      .eq('user_id', user.id);

    if (dealbreakersError) {
      console.warn('[Preferences API] Warning fetching dealbreakers:', dealbreakersError.message);
      // Don't throw - table might not exist yet
    } else if (dealbreakersData) {
      dealbreakersIds = dealbreakersData.map(d => d.dealbreaker_id);
    }

    // Get the actual names/details for interests
    let interestDetails: any[] = [];
    if (interestIds.length > 0) {
      const { data, error } = await supabase
        .from('interests')
        .select('id, name')
        .in('id', interestIds);

      if (error) {
        console.warn('[Preferences API] Warning fetching interest details:', error.message);
      } else {
        interestDetails = data || [];
      }
    }

    // Get the actual names/details for subcategories
    let subcategoryDetails: any[] = [];
    if (subcategoryIds.length > 0) {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name')
        .in('id', subcategoryIds);

      if (error) {
        console.warn('[Preferences API] Warning fetching subcategory details:', error.message);
      } else {
        subcategoryDetails = data || [];
      }
    }

    // Get the actual names/details for deal-breakers
    let dealbreakersDetails: any[] = [];
    if (dealbreakersIds.length > 0) {
      const { data, error } = await supabase
        .from('dealbreakers')
        .select('id, name')
        .in('id', dealbreakersIds);

      if (error) {
        console.warn('[Preferences API] Warning fetching dealbreaker details:', error.message);
      } else {
        dealbreakersDetails = data || [];
      }
    }

    console.log('[Preferences API] Successfully fetched preferences:', {
      interests: interestDetails.length,
      subcategories: subcategoryDetails.length,
      dealbreakers: dealbreakersDetails.length,
    });

    return NextResponse.json({
      interests: interestDetails || [],
      subcategories: subcategoryDetails || [],
      dealbreakers: dealbreakersDetails || [],
    });
  } catch (error: any) {
    console.error('[Preferences API] Unexpected error:', error);
    // Return empty preferences instead of error to prevent UI breaking
    return NextResponse.json(
      {
        interests: [],
        subcategories: [],
        dealbreakers: [],
      },
      { status: 200 }
    );
  }
}

