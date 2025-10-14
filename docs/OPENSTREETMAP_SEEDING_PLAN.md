# OpenStreetMap Integration - Business & Reviews Seeding Plan

## Overview

This document outlines a comprehensive step-by-step plan to seed the KLIO platform with real business data and reviews using OpenStreetMap (OSM) and related APIs.

## Why OpenStreetMap?

### Advantages
- ✅ **Free & Open**: No API costs, no rate limits for bulk downloads
- ✅ **Rich Data**: POI (Points of Interest) with names, categories, addresses, coordinates
- ✅ **Global Coverage**: Worldwide business data
- ✅ **Community Maintained**: Regularly updated by contributors
- ✅ **Legal**: Open Database License (ODbL) - can use commercially with attribution

### Limitations
- ❌ **No Reviews**: OSM doesn't include user reviews (we'll need to supplement)
- ❌ **Incomplete Data**: Some businesses may lack phone numbers, websites, hours
- ❌ **Data Quality**: Varies by region and contributor activity
- ❌ **No Ratings**: We'll need to generate initial placeholder ratings

---

## Step-by-Step Implementation Plan

### Phase 1: Data Acquisition Strategy

#### Option A: Overpass API (Best for Targeted Queries)
**Use Case**: Fetch specific business categories in specific cities

```bash
# Example: Fetch all restaurants in Cape Town
curl -X POST \
  https://overpass-api.de/api/interpreter \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data=[out:json];
    area["name"="Cape Town"]->.searchArea;
    (
      node["amenity"="restaurant"](area.searchArea);
      way["amenity"="restaurant"](area.searchArea);
    );
    out center;'
```

**Supported Categories**:
```javascript
const osmCategories = {
  // Food & Drink
  'amenity=restaurant': 'Restaurant',
  'amenity=cafe': 'Café',
  'amenity=bar': 'Bar',
  'amenity=pub': 'Pub',
  'amenity=fast_food': 'Fast Food',

  // Services
  'shop=hairdresser': 'Hair Salon',
  'shop=beauty': 'Beauty Salon',
  'amenity=clinic': 'Clinic',
  'amenity=dentist': 'Dentist',

  // Entertainment
  'amenity=cinema': 'Cinema',
  'amenity=theatre': 'Theatre',
  'leisure=fitness_centre': 'Gym',

  // Retail
  'shop=convenience': 'Convenience Store',
  'shop=supermarket': 'Supermarket',
  'shop=clothes': 'Clothing Store',
  'shop=bakery': 'Bakery'
};
```

#### Option B: Geofabrik Downloads (Best for Bulk Data)
**Use Case**: Download entire country/region data

```bash
# Download South Africa OSM data (PBF format - compressed)
wget https://download.geofabrik.de/africa/south-africa-latest.osm.pbf

# Convert to JSON using osmtogeojson
npm install -g osmtogeojson
osmtogeojson south-africa-latest.osm.pbf > south-africa.geojson
```

#### Option C: Nominatim (Best for Geocoding/Search)
**Use Case**: Search businesses by name or address

```javascript
// Example: Search for businesses in Cape Town
const response = await fetch(
  'https://nominatim.openstreetmap.org/search?' +
  new URLSearchParams({
    q: 'restaurant Cape Town',
    format: 'json',
    addressdetails: 1,
    extratags: 1,
    limit: 50
  })
);
```

---

### Phase 2: Database Schema Setup

#### 1. Create Businesses Table

```sql
-- Main businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- OpenStreetMap data
  osm_id BIGINT UNIQUE,
  osm_type VARCHAR(10), -- 'node', 'way', or 'relation'

  -- Basic info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  subcategory VARCHAR(100),

  -- Location
  address TEXT,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(50) DEFAULT 'South Africa',
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,

  -- Contact (may be null from OSM)
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,

  -- Business details
  price_range VARCHAR(10), -- $, $$, $$$, $$$$
  cuisine VARCHAR(100), -- for restaurants
  opening_hours JSONB,

  -- Status
  verified BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,

  -- Metrics (computed)
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- Media
  images JSONB, -- Array of image URLs
  logo_url TEXT,
  cover_image_url TEXT,

  -- Metadata
  source VARCHAR(50) DEFAULT 'openstreetmap',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP,

  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, ''))
  ) STORED
);

-- Indexes
CREATE INDEX idx_businesses_osm ON businesses(osm_id);
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_search ON businesses USING GIN(search_vector);

-- Spatial index for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE businesses ADD COLUMN geom GEOMETRY(Point, 4326);
CREATE INDEX idx_businesses_geom ON businesses USING GIST(geom);
```

#### 2. Create Business Hours Table

```sql
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  opens_at TIME,
  closes_at TIME,
  is_closed BOOLEAN DEFAULT FALSE,

  UNIQUE(business_id, day_of_week)
);

CREATE INDEX idx_business_hours ON business_hours(business_id);
```

#### 3. Create Reviews Table (Seed with Synthetic Data)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  content TEXT NOT NULL,
  tags TEXT[],

  -- Flags
  verified_purchase BOOLEAN DEFAULT FALSE,
  synthetic BOOLEAN DEFAULT FALSE, -- Mark AI-generated reviews

  -- Moderation
  status VARCHAR(20) DEFAULT 'approved', -- pending, approved, rejected

  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Prevent duplicate reviews per user per business
  UNIQUE(user_id, business_id)
);

CREATE INDEX idx_reviews_business ON reviews(business_id, status, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(business_id, rating);
```

---

### Phase 3: Data Extraction & Transformation Pipeline

#### Step 3.1: Set Up Node.js Seeding Script

```bash
# Install dependencies
npm install --save-dev \
  @types/node \
  osmtogeojson \
  @turf/turf \
  slugify \
  axios \
  dotenv \
  @supabase/supabase-js
```

#### Step 3.2: Create Data Fetcher

```typescript
// scripts/seed/osmDataFetcher.ts

import axios from 'axios';

interface OSMNode {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    shop?: string;
    cuisine?: string;
    phone?: string;
    website?: string;
    'addr:street'?: string;
    'addr:city'?: string;
    'addr:postcode'?: string;
    opening_hours?: string;
  };
}

interface OverpassResponse {
  elements: OSMNode[];
}

export class OSMDataFetcher {
  private readonly overpassUrl = 'https://overpass-api.de/api/interpreter';

  /**
   * Fetch businesses in a specific city and category
   */
  async fetchBusinesses(
    city: string,
    categories: string[],
    limit: number = 100
  ): Promise<OSMNode[]> {
    const categoryQuery = categories.map(cat => {
      return `
        node["${cat}"](area.searchArea);
        way["${cat}"](area.searchArea);
      `;
    }).join('\n');

    const query = `
      [out:json][timeout:25];
      area["name"="${city}"]->.searchArea;
      (
        ${categoryQuery}
      );
      out center ${limit};
    `;

    console.log(`Fetching businesses in ${city}...`);

    const response = await axios.post<OverpassResponse>(
      this.overpassUrl,
      `data=${encodeURIComponent(query)}`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    console.log(`Found ${response.data.elements.length} businesses`);
    return response.data.elements;
  }

  /**
   * Fetch businesses in a bounding box (lat/lon rectangle)
   */
  async fetchInBoundingBox(
    south: number,
    west: number,
    north: number,
    east: number,
    categories: string[]
  ): Promise<OSMNode[]> {
    const bbox = `${south},${west},${north},${east}`;

    const categoryQuery = categories.map(cat => {
      return `node["${cat}"](${bbox}); way["${cat}"](${bbox});`;
    }).join('\n');

    const query = `[out:json]; (${categoryQuery}); out center;`;

    const response = await axios.post<OverpassResponse>(
      this.overpassUrl,
      `data=${encodeURIComponent(query)}`
    );

    return response.data.elements;
  }
}
```

#### Step 3.3: Create Data Transformer

```typescript
// scripts/seed/osmTransformer.ts

import slugify from 'slugify';

interface BusinessInsert {
  osm_id: number;
  osm_type: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  address?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  cuisine?: string;
  opening_hours?: any;
  source: string;
}

export class OSMTransformer {

  /**
   * Map OSM category to KLIO category
   */
  private mapCategory(tags: any): { category: string; subcategory?: string } {
    const categoryMap: Record<string, { category: string; subcategory?: string }> = {
      'amenity=restaurant': { category: 'Food & Drink', subcategory: 'Restaurant' },
      'amenity=cafe': { category: 'Food & Drink', subcategory: 'Café' },
      'amenity=bar': { category: 'Food & Drink', subcategory: 'Bar' },
      'amenity=pub': { category: 'Food & Drink', subcategory: 'Pub' },
      'amenity=fast_food': { category: 'Food & Drink', subcategory: 'Fast Food' },
      'shop=hairdresser': { category: 'Beauty & Wellness', subcategory: 'Hair Salon' },
      'shop=beauty': { category: 'Beauty & Wellness', subcategory: 'Beauty Salon' },
      'amenity=clinic': { category: 'Health', subcategory: 'Clinic' },
      'amenity=dentist': { category: 'Health', subcategory: 'Dentist' },
      'leisure=fitness_centre': { category: 'Sports & Recreation', subcategory: 'Gym' },
      'shop=supermarket': { category: 'Shopping', subcategory: 'Supermarket' },
      'shop=bakery': { category: 'Food & Drink', subcategory: 'Bakery' },
    };

    for (const [key, value] of Object.entries(categoryMap)) {
      const [osmKey, osmValue] = key.split('=');
      if (tags[osmKey] === osmValue) {
        return value;
      }
    }

    return { category: 'Other' };
  }

  /**
   * Parse OpenStreetMap opening hours format
   * Example: "Mo-Fr 08:00-18:00; Sa 09:00-14:00"
   */
  private parseOpeningHours(hoursString?: string): any | null {
    if (!hoursString) return null;

    try {
      // Simple parser - can be enhanced with opening_hours.js library
      const hours: any = {};
      const parts = hoursString.split(';');

      parts.forEach(part => {
        const [days, times] = part.trim().split(' ');
        const [open, close] = times.split('-');

        // Map day abbreviations
        const dayMap: Record<string, number[]> = {
          'Mo': [1],
          'Tu': [2],
          'We': [3],
          'Th': [4],
          'Fr': [5],
          'Sa': [6],
          'Su': [0],
          'Mo-Fr': [1, 2, 3, 4, 5],
          'Mo-Su': [0, 1, 2, 3, 4, 5, 6]
        };

        const dayNums = dayMap[days] || [];
        dayNums.forEach(day => {
          hours[day] = { open, close };
        });
      });

      return hours;
    } catch (error) {
      console.error('Failed to parse hours:', hoursString);
      return null;
    }
  }

  /**
   * Transform OSM node to KLIO business format
   */
  transform(node: OSMNode, defaultCity?: string): BusinessInsert | null {
    const tags = node.tags || {};

    // Skip if no name
    if (!tags.name) {
      return null;
    }

    // Determine category
    const { category, subcategory } = this.mapCategory(tags);

    // Generate slug
    const slug = slugify(tags.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    }) + `-${node.id}`;

    // Parse address
    const street = tags['addr:street'];
    const city = tags['addr:city'] || defaultCity;
    const postalCode = tags['addr:postcode'];
    const address = [street, city, postalCode].filter(Boolean).join(', ');

    // Clean phone number
    let phone = tags.phone || tags['contact:phone'];
    if (phone) {
      phone = phone.replace(/\s/g, '').replace(/^\+27/, '0'); // South African format
    }

    // Clean website
    let website = tags.website || tags['contact:website'];
    if (website && !website.startsWith('http')) {
      website = 'https://' + website;
    }

    return {
      osm_id: node.id,
      osm_type: node.type,
      name: tags.name,
      slug,
      category,
      subcategory,
      address: address || undefined,
      street,
      city,
      postal_code: postalCode,
      latitude: node.lat,
      longitude: node.lon,
      phone,
      website,
      cuisine: tags.cuisine,
      opening_hours: this.parseOpeningHours(tags.opening_hours),
      source: 'openstreetmap'
    };
  }

  /**
   * Transform multiple nodes
   */
  transformBatch(nodes: OSMNode[], defaultCity?: string): BusinessInsert[] {
    return nodes
      .map(node => this.transform(node, defaultCity))
      .filter((b): b is BusinessInsert => b !== null);
  }
}
```

#### Step 3.4: Create Database Seeder

```typescript
// scripts/seed/databaseSeeder.ts

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for seeding
);

export class DatabaseSeeder {

  /**
   * Insert businesses in batches to avoid timeouts
   */
  async seedBusinesses(businesses: any[]): Promise<void> {
    const batchSize = 100;
    let inserted = 0;
    let errors = 0;

    console.log(`Seeding ${businesses.length} businesses...`);

    for (let i = 0; i < businesses.length; i += batchSize) {
      const batch = businesses.slice(i, i + batchSize);

      try {
        const { data, error } = await supabase
          .from('businesses')
          .upsert(batch, {
            onConflict: 'osm_id', // Update if exists
            ignoreDuplicates: false
          });

        if (error) {
          console.error(`Batch ${i}-${i + batch.length} error:`, error.message);
          errors += batch.length;
        } else {
          inserted += batch.length;
          console.log(`✓ Inserted batch ${i / batchSize + 1}: ${batch.length} businesses`);
        }

        // Rate limiting: wait 100ms between batches
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Batch ${i}-${i + batch.length} failed:`, error);
        errors += batch.length;
      }
    }

    console.log(`\n✅ Seeding complete: ${inserted} inserted, ${errors} errors`);
  }

  /**
   * Update geom column from lat/lon
   */
  async updateGeometries(): Promise<void> {
    console.log('Updating PostGIS geometries...');

    const { error } = await supabase.rpc('update_business_geometries');

    if (error) {
      console.error('Failed to update geometries:', error);
    } else {
      console.log('✓ Geometries updated');
    }
  }
}
```

---

### Phase 4: Generate Synthetic Reviews

Since OSM doesn't provide reviews, we'll generate realistic placeholder reviews using AI.

#### Step 4.1: Review Generator

```typescript
// scripts/seed/reviewGenerator.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ReviewTemplate {
  rating: number;
  templates: string[];
  tags: string[];
}

export class ReviewGenerator {
  private readonly reviewTemplates: ReviewTemplate[] = [
    {
      rating: 5,
      templates: [
        'Absolutely amazing experience! {detail} The staff were incredibly friendly and the service was top-notch.',
        'Highly recommend! {detail} Will definitely be coming back.',
        'Best {category} in town! {detail} Five stars all the way.',
      ],
      tags: ['Excellent Service', 'Highly Recommended', 'Great Experience']
    },
    {
      rating: 4,
      templates: [
        'Really enjoyed our visit. {detail} Minor room for improvement but overall great.',
        'Solid choice! {detail} Would visit again.',
        'Good experience overall. {detail}',
      ],
      tags: ['Good Value', 'Worth Visiting', 'Pleasant']
    },
    {
      rating: 3,
      templates: [
        'Decent place. {detail} Nothing special but gets the job done.',
        'Average experience. {detail}',
        'It was okay. {detail} Could be better.',
      ],
      tags: ['Average', 'Acceptable']
    }
  ];

  private readonly detailsByCategory: Record<string, string[]> = {
    'Restaurant': [
      'The food was delicious and well-presented.',
      'Great menu variety and fresh ingredients.',
      'Atmosphere was cozy and inviting.',
      'Portions were generous and reasonably priced.'
    ],
    'Café': [
      'Coffee was excellent, perfectly brewed.',
      'Loved the pastries and baked goods.',
      'Great spot for working or catching up with friends.',
      'WiFi was fast and seating comfortable.'
    ],
    'Hair Salon': [
      'My stylist really listened to what I wanted.',
      'Great haircut and very professional.',
      'Clean salon with modern equipment.',
      'Reasonable prices for the quality.'
    ],
    'Gym': [
      'Equipment is well-maintained and modern.',
      'Clean facilities and friendly staff.',
      'Good variety of classes offered.',
      'Convenient hours and location.'
    ]
  };

  /**
   * Generate synthetic reviews for a business
   */
  async generateReviews(
    businessId: string,
    businessName: string,
    category: string,
    count: number = 5
  ): Promise<void> {
    const reviews = [];

    for (let i = 0; i < count; i++) {
      // Random rating (weighted toward positive)
      const ratingWeights = [5, 5, 5, 4, 4, 3]; // Bias toward higher ratings
      const rating = ratingWeights[Math.floor(Math.random() * ratingWeights.length)];

      // Get template for this rating
      const template = this.reviewTemplates.find(t => t.rating === rating);
      if (!template) continue;

      // Random template and detail
      const reviewTemplate = template.templates[Math.floor(Math.random() * template.templates.length)];
      const categoryDetails = this.detailsByCategory[category] || ['Great experience overall.'];
      const detail = categoryDetails[Math.floor(Math.random() * categoryDetails.length)];

      // Generate review text
      const content = reviewTemplate
        .replace('{detail}', detail)
        .replace('{category}', category.toLowerCase());

      // Random tags
      const tags = template.tags
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);

      // Random date in past 6 months
      const daysAgo = Math.floor(Math.random() * 180);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      reviews.push({
        business_id: businessId,
        user_id: await this.getRandomUserId(), // Helper to get synthetic user
        rating,
        content,
        tags,
        synthetic: true,
        status: 'approved',
        created_at: createdAt.toISOString()
      });
    }

    // Insert reviews
    const { error } = await supabase
      .from('reviews')
      .insert(reviews);

    if (error) {
      console.error(`Failed to generate reviews for ${businessName}:`, error.message);
    } else {
      console.log(`✓ Generated ${count} reviews for ${businessName}`);
    }
  }

  /**
   * Get or create synthetic user for reviews
   */
  private async getRandomUserId(): Promise<string> {
    // Create pool of synthetic users
    const syntheticUsernames = [
      'Sarah M.', 'John D.', 'Thabo K.', 'Emma W.', 'David L.',
      'Naledi T.', 'Michael B.', 'Lerato S.', 'Chris P.', 'Zanele N.'
    ];

    // For simplicity, use a fixed UUID format
    // In production, create actual user records
    const username = syntheticUsernames[Math.floor(Math.random() * syntheticUsernames.length)];
    const userId = `synthetic-${username.toLowerCase().replace(/\W/g, '-')}`;

    return userId;
  }

  /**
   * Generate reviews for all businesses without reviews
   */
  async generateAllMissingReviews(reviewsPerBusiness: number = 5): Promise<void> {
    console.log('Generating reviews for businesses without reviews...');

    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, name, category')
      .eq('review_count', 0)
      .limit(100);

    if (error || !businesses) {
      console.error('Failed to fetch businesses:', error);
      return;
    }

    for (const business of businesses) {
      await this.generateReviews(
        business.id,
        business.name,
        business.category,
        reviewsPerBusiness
      );

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('✅ Review generation complete');
  }
}
```

---

### Phase 5: Main Seeding Script

```typescript
// scripts/seed/index.ts

import { OSMDataFetcher } from './osmDataFetcher';
import { OSMTransformer } from './osmTransformer';
import { DatabaseSeeder } from './databaseSeeder';
import { ReviewGenerator } from './reviewGenerator';

async function main() {
  console.log('🌍 KLIO Business Seeding Started\n');

  const fetcher = new OSMDataFetcher();
  const transformer = new OSMTransformer();
  const seeder = new DatabaseSeeder();
  const reviewGen = new ReviewGenerator();

  // Step 1: Define target cities
  const cities = [
    'Cape Town',
    'Johannesburg',
    'Durban',
    'Pretoria'
  ];

  // Step 2: Define business categories to fetch
  const categories = [
    'amenity=restaurant',
    'amenity=cafe',
    'amenity=bar',
    'shop=hairdresser',
    'shop=beauty',
    'leisure=fitness_centre',
    'shop=supermarket'
  ];

  // Step 3: Fetch and seed for each city
  for (const city of cities) {
    console.log(`\n📍 Processing ${city}...`);

    try {
      // Fetch from OSM
      const osmNodes = await fetcher.fetchBusinesses(city, categories, 200);
      console.log(`Found ${osmNodes.length} businesses`);

      // Transform to KLIO format
      const businesses = transformer.transformBatch(osmNodes, city);
      console.log(`Transformed ${businesses.length} valid businesses`);

      // Seed database
      if (businesses.length > 0) {
        await seeder.seedBusinesses(businesses);
      }

      // Rate limit between cities
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`Failed to process ${city}:`, error);
    }
  }

  // Step 4: Update geometries
  await seeder.updateGeometries();

  // Step 5: Generate synthetic reviews
  console.log('\n📝 Generating synthetic reviews...');
  await reviewGen.generateAllMissingReviews(8); // 8 reviews per business

  console.log('\n✅ Seeding Complete!');
}

// Run
main().catch(console.error);
```

---

### Phase 6: Add to package.json

```json
{
  "scripts": {
    "seed:businesses": "tsx scripts/seed/index.ts",
    "seed:reviews": "tsx scripts/seed/reviewGenerator.ts"
  }
}
```

---

### Phase 7: SQL Helper Functions

```sql
-- Function to update PostGIS geometries
CREATE OR REPLACE FUNCTION update_business_geometries()
RETURNS void AS $$
BEGIN
  UPDATE businesses
  SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  WHERE geom IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate business ratings
CREATE OR REPLACE FUNCTION recalculate_business_rating(p_business_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE businesses
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE business_id = p_business_id AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE business_id = p_business_id AND status = 'approved'
    )
  WHERE id = p_business_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update business ratings on new review
CREATE OR REPLACE FUNCTION trigger_update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalculate_business_rating(NEW.business_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_business_rating();
```

---

### Phase 8: Image Seeding (Optional)

Use Unsplash API to fetch category-relevant images:

```typescript
// scripts/seed/imageFetcher.ts

import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function fetchBusinessImages(category: string, count: number = 3): Promise<string[]> {
  const queries: Record<string, string> = {
    'Restaurant': 'restaurant interior',
    'Café': 'cafe coffee shop',
    'Bar': 'bar drinks',
    'Hair Salon': 'hair salon',
    'Gym': 'fitness gym'
  };

  const query = queries[category] || 'business';

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: count,
        orientation: 'landscape'
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    return response.data.results.map((photo: any) => photo.urls.regular);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return [];
  }
}
```

---

### Phase 9: Execution Checklist

#### Pre-Seeding
- [ ] Set up Supabase project
- [ ] Run database migrations (create tables)
- [ ] Install PostGIS extension
- [ ] Create SQL helper functions
- [ ] Set up environment variables (.env)
- [ ] Install npm dependencies

#### Seeding Execution
```bash
# 1. Test with single city first
npm run seed:businesses

# 2. Check database for inserted records
# 3. Generate reviews
npm run seed:reviews

# 4. Verify data quality
# 5. Run full seed for all cities
```

#### Post-Seeding
- [ ] Verify business count in database
- [ ] Check for duplicate OSM IDs
- [ ] Validate coordinates (within expected bounds)
- [ ] Verify review distribution (ratings, dates)
- [ ] Test search functionality
- [ ] Test location-based queries
- [ ] Add sample images for featured businesses

---

### Phase 10: Data Quality & Maintenance

#### Monitoring Queries
```sql
-- Check seeding stats
SELECT
  city,
  category,
  COUNT(*) as business_count,
  AVG(review_count) as avg_reviews,
  AVG(average_rating) as avg_rating
FROM businesses
GROUP BY city, category
ORDER BY city, business_count DESC;

-- Find businesses without reviews
SELECT id, name, city, category
FROM businesses
WHERE review_count = 0
LIMIT 20;

-- Check for incomplete data
SELECT
  COUNT(*) as total,
  COUNT(phone) as with_phone,
  COUNT(website) as with_website,
  COUNT(opening_hours) as with_hours
FROM businesses;
```

#### Regular Updates
```typescript
// Schedule to run weekly to sync new OSM data
// Use cron job or Vercel Cron Jobs
export async function syncOSMData() {
  // 1. Fetch new/updated businesses from OSM
  // 2. Update existing records
  // 3. Add new businesses
  // 4. Mark deleted businesses as inactive
}
```

---

## Attribution Requirements

⚠️ **Important**: OpenStreetMap data requires attribution

### Footer Attribution
```html
<footer>
  <p>
    Business data ©
    <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
    contributors
  </p>
</footer>
```

### About Page
Add detailed attribution on your About page explaining OSM data usage.

---

## Alternative/Supplementary Data Sources

1. **Google Places API** (Paid, but has reviews)
   - Use for businesses missing from OSM
   - Expensive at scale ($17/1000 requests)

2. **Foursquare API** (Freemium)
   - Good for tips/reviews
   - Limited free tier

3. **Yelp Fusion API** (Free for non-commercial)
   - Rich review data
   - US-centric

4. **Manual Business Submissions**
   - Allow businesses to claim/create profiles
   - Verify manually

---

## Expected Results

After seeding:
- **~5,000-10,000** businesses across 4 major SA cities
- **~40,000-80,000** synthetic reviews (8 per business)
- **Geographic distribution** covering major metros
- **Category variety** (restaurants, cafes, salons, gyms, etc.)
- **Realistic rating distribution** (weighted toward 4-5 stars)

---

## Timeline Estimate

- **Week 1**: Database setup + OSM integration
- **Week 2**: Data transformation + seeding scripts
- **Week 3**: Review generation + quality checks
- **Week 4**: Image seeding + final testing

**Total**: 3-4 weeks for production-ready seed data

---

## Next Steps

1. Set up Supabase project
2. Run database migrations
3. Test OSM API connection
4. Start with single city seed
5. Validate data quality
6. Scale to full dataset
