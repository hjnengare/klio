import { NextResponse } from "next/server";
import { getServerSupabase } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Update the user's metadata to mark account as deactivated
    // We'll use the user metadata to track deactivation status
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        deactivated_at: new Date().toISOString(),
        is_deactivated: true
      }
    });

    if (updateError) {
      console.error('Error deactivating account:', updateError);
      return NextResponse.json(
        { error: 'Failed to deactivate account. Please contact support.' },
        { status: 500 }
      );
    }

    // Optionally, update profiles table to mark as deactivated
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      // Don't fail the request if profile update fails
    }

    // Sign out the user after deactivation
    await supabase.auth.signOut();

    return NextResponse.json({ 
      success: true,
      message: 'Account deactivated successfully. You can reactivate by logging in again.'
    });
  } catch (error) {
    console.error('Error in deactivate account:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate account' },
      { status: 500 }
    );
  }
}

