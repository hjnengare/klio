import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../../lib/supabase/server';
import { fetchCapeTownBusinesses } from '../../../lib/services/overpassService';
import { mapOSMToBusiness, generateInitialStats } from '../../../lib/utils/osmToBusinessMapper';

export const dynamic = 'force-dynamic';
export const maxDuration = 180; // Overpass API can be slow (3 minutes)

/**
 * POST /api/businesses/seed
 * Seeds businesses from Overpass API into the database
 */
export async function POST(req: Request) {
  try {
    const supabase = await getServerSupabase();
    
    // Check if user is authenticated (optional - remove if you want public seeding)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Optional: restrict to admin users only
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 50; // Default to 50 businesses
    const category = body.category || undefined;
    const dryRun = body.dryRun === true; // Don't actually insert if true
    
    console.log(`[SEED] Fetching ${limit} businesses from Overpass API...`);
    
    // Fetch businesses from Overpass API
    const osmBusinesses = await fetchCapeTownBusinesses(limit, category);
    
    if (osmBusinesses.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No businesses found in Cape Town',
        count: 0,
      });
    }
    
    console.log(`[SEED] Fetched ${osmBusinesses.length} businesses from Overpass API`);
    
    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: 'Dry run - no businesses inserted',
        count: osmBusinesses.length,
        businesses: osmBusinesses.map(b => ({
          name: b.name,
          category: b.category,
          location: b.address,
        })),
      });
    }
    
    // Helper function to generate unique slug with UUID
    const generateUniqueSlug = (name: string, sourceId: string): string => {
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Generate UUID v4 style hex (32 chars, split into 4 parts for readability)
      const uuidHex = Array.from({ length: 32 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // Use shorter UUID portion (8 chars) + source_id hash for uniqueness
      const shortId = uuidHex.substring(0, 8);
      const sourceHash = sourceId.replace(/[^a-z0-9]/gi, '').substring(0, 8);
      
      return `${baseSlug}-${sourceHash}-${shortId}`;
    };

    // Map OSM businesses to our Business format
    const businessesToInsert = osmBusinesses.map(osmBusiness => {
      const businessData = mapOSMToBusiness(osmBusiness);
      
      // Generate source and source_id for idempotent upserts
      const source = 'overpass';
      const source_id = osmBusiness.id; // e.g., "osm-node-123" or "osm-way-456"
      
      // Generate unique slug with UUID to prevent collisions
      const slug = generateUniqueSlug(businessData.name, source_id);
      
      return {
        ...businessData,
        slug,
        source,
        source_id,
        status: 'active',
        // Don't set id - let database generate UUID
        // Don't set created_at/updated_at - let database handle timestamps
      };
    });
    
    // Insert businesses into database
    // Try upsert with source+source_id first, fallback to slug, then simple insert
    let insertedBusinesses: any[] = [];
    let insertError: any = null;
    
    // Try 1: Upsert with source+source_id
    const { data: data1, error: error1 } = await supabase
      .from('businesses')
      .upsert(businessesToInsert, {
        onConflict: 'source,source_id',
        ignoreDuplicates: false,
      })
      .select();
    
    if (!error1 && data1) {
      insertedBusinesses = data1;
      console.log(`[SEED] Inserted ${insertedBusinesses.length} businesses using source+source_id`);
    } else {
      console.log('[SEED] source+source_id upsert failed, trying slug fallback...', error1?.message);
      
      // Try 2: Upsert with slug
      const { data: data2, error: error2 } = await supabase
        .from('businesses')
        .upsert(businessesToInsert, {
          onConflict: 'slug',
          ignoreDuplicates: false,
        })
        .select();
      
      if (!error2 && data2) {
        insertedBusinesses = data2;
        console.log(`[SEED] Inserted ${insertedBusinesses.length} businesses using slug`);
      } else {
        console.log('[SEED] slug upsert failed, trying simple insert...', error2?.message);
        
        // Try 3: Simple insert (may create duplicates but ensures data gets in)
        const { data: data3, error: error3 } = await supabase
          .from('businesses')
          .insert(businessesToInsert)
          .select();
        
        if (error3) {
          insertError = error3;
          console.error('[SEED] All insert methods failed:', error3);
        } else if (data3) {
          insertedBusinesses = data3;
          console.log(`[SEED] Inserted ${insertedBusinesses.length} businesses using simple insert`);
        }
      }
    }
    
    if (insertError) {
      return NextResponse.json(
        { 
          error: 'Failed to insert businesses', 
          details: insertError.message,
        },
        { status: 500 }
      );
    }
    
    if (!insertedBusinesses || insertedBusinesses.length === 0) {
      return NextResponse.json(
        { 
          error: 'No businesses were inserted', 
          message: 'Check database connection and schema',
        },
        { status: 500 }
      );
    }
    
    console.log(`[SEED] Successfully inserted ${insertedBusinesses.length} businesses`);
    
    // Create initial stats for each business
    const statsToInsert = (insertedBusinesses || []).map(business => {
      const stats = generateInitialStats();
      return {
        business_id: business.id,
        ...stats,
        updated_at: new Date().toISOString(),
      };
    });
    
    if (statsToInsert.length > 0) {
      const { error: statsError } = await supabase
        .from('business_stats')
        .upsert(statsToInsert, {
          onConflict: 'business_id',
        });
      
      if (statsError) {
        console.error('[SEED] Error inserting business stats:', statsError);
        // Don't fail the request if stats insertion fails
      } else {
        console.log(`[SEED] Inserted stats for ${statsToInsert.length} businesses`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedBusinesses?.length || 0} businesses`,
      count: insertedBusinesses?.length || 0,
      businesses: insertedBusinesses?.map(b => ({
        id: b.id,
        name: b.name,
        category: b.category,
        location: b.location,
      })),
    });
  } catch (error: any) {
    console.error('[SEED] Error seeding businesses:', error);
    return NextResponse.json(
      { error: 'Failed to seed businesses', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/businesses/seed
 * Preview businesses that would be seeded (dry run)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || undefined;
    
    console.log(`[SEED PREVIEW] Fetching ${limit} businesses from Overpass API...`);
    
    // Fetch businesses from Overpass API
    const osmBusinesses = await fetchCapeTownBusinesses(limit, category);
    
    return NextResponse.json({
      success: true,
      message: `Found ${osmBusinesses.length} businesses (preview)`,
      count: osmBusinesses.length,
      businesses: osmBusinesses.map(b => ({
        name: b.name,
        category: b.category,
        address: b.address,
        phone: b.phone,
        website: b.website,
        latitude: b.latitude,
        longitude: b.longitude,
      })),
    });
  } catch (error: any) {
    console.error('[SEED PREVIEW] Error:', error);
    return NextResponse.json(
      { error: 'Failed to preview businesses', details: error.message },
      { status: 500 }
    );
  }
}

