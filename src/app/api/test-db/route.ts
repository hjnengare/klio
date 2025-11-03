// Test endpoint to verify database connection
import { NextResponse } from "next/server";
import { getServerSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await getServerSupabase();
    
    // Test basic connection
    const { data, error, count } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return NextResponse.json({
        connected: false,
        error: error.message,
        code: error.code,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      connected: true,
      businessCount: count || 0,
      message: count === 0 ? 'Database connected but no businesses found. Run seed endpoint.' : `${count} businesses found`,
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
    }, { status: 500 });
  }
}

