import { NextResponse } from "next/server";
import { getServerSupabase } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { step, interests, subcategories, dealbreakers } = await req.json();

    // Save interests
    if (interests && Array.isArray(interests)) {
      const { error } = await supabase.rpc('replace_user_interests', {
        p_user_id: user.id,
        p_interest_ids: interests
      });
      if (error) {
        console.error('Error saving interests:', error);
        throw error;
      }
    }

    // Save subcategories with their parent interest IDs
    if (subcategories && Array.isArray(subcategories)) {
      const subcategoryData = subcategories.map(sub => ({
        subcategory_id: sub.id,
        interest_id: sub.interest_id
      }));
      
      const { error } = await supabase.rpc('replace_user_subcategories', {
        p_user_id: user.id,
        p_subcategory_data: subcategoryData
      });
      if (error) {
        console.error('Error saving subcategories:', error);
        throw error;
      }
    }

    // Save dealbreakers
    if (dealbreakers && Array.isArray(dealbreakers)) {
      const { error } = await supabase.rpc('replace_user_dealbreakers', {
        p_user_id: user.id,
        p_dealbreaker_ids: dealbreakers
      });
      if (error) {
        console.error('Error saving dealbreakers:', error);
        throw error;
      }
    }

    // Update profile step
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        onboarding_step: step,
        onboarding_complete: step === 'complete',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      throw profileError;
    }

    return NextResponse.json({ 
      success: true,
      message: 'Onboarding progress saved successfully'
    });

  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: "Failed to save onboarding progress" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's onboarding data
export async function GET() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's interests
    const { data: interests } = await supabase
      .from('user_interests')
      .select('interest_id')
      .eq('user_id', user.id);

    // Get user's subcategories
    const { data: subcategories } = await supabase
      .from('user_subcategories')
      .select('subcategory_id, interest_id')
      .eq('user_id', user.id);

    // Get user's dealbreakers
    const { data: dealbreakers } = await supabase
      .from('user_dealbreakers')
      .select('dealbreaker_id')
      .eq('user_id', user.id);

    return NextResponse.json({
      interests: interests?.map(i => i.interest_id) || [],
      subcategories: subcategories || [],
      dealbreakers: dealbreakers?.map(d => d.dealbreaker_id) || []
    });

  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding data" },
      { status: 500 }
    );
  }
}
