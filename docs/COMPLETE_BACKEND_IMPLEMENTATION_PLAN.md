# KLIO - Complete Backend Implementation Plan

## Overview

This document provides a comprehensive, production-ready backend implementation plan for the KLIO platform - a local business discovery and review platform.

---

## Table of Contents

1. [Tech Stack & Architecture](#tech-stack--architecture)
2. [Database Schema (Complete)](#database-schema-complete)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Routes Structure](#api-routes-structure)
5. [File Upload & Storage](#file-upload--storage)
6. [Real-time Features](#real-time-features)
7. [Search & Discovery](#search--discovery)
8. [Notifications System](#notifications-system)
9. [Analytics & Metrics](#analytics--metrics)
10. [Security & Rate Limiting](#security--rate-limiting)
11. [Caching Strategy](#caching-strategy)
12. [Deployment & DevOps](#deployment--devops)
13. [Implementation Timeline](#implementation-timeline)

---

## Tech Stack & Architecture

### Core Stack
```typescript
{
  // Frontend
  framework: 'Next.js 14+ (App Router)',
  language: 'TypeScript',
  styling: 'Tailwind CSS',
  animations: 'Framer Motion',

  // Backend
  api: 'Next.js API Routes',
  runtime: 'Node.js 18+',

  // Database
  primary: 'PostgreSQL (Supabase)',
  orm: 'Prisma / Supabase Client',
  search: 'PostgreSQL Full-Text Search + PostGIS',
  cache: 'Upstash Redis',

  // Authentication
  auth: 'Supabase Auth',
  sessions: 'JWT + Refresh Tokens',

  // Storage
  files: 'Vercel Blob / Cloudflare R2',
  cdn: 'Vercel Edge Network',

  // Real-time
  websockets: 'Supabase Realtime',

  // External APIs
  maps: 'OpenStreetMap + Nominatim',
  email: 'Resend / SendGrid',
  sms: 'Twilio (optional)',

  // DevOps
  hosting: 'Vercel',
  monitoring: 'Vercel Analytics + Sentry',
  logging: 'Axiom / Logtail',
  cicd: 'GitHub Actions'
}
```

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js Frontend - React Components + Framer Motion)      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                      │
│  /api/auth/*      /api/businesses/*    /api/reviews/*       │
│  /api/users/*     /api/search/*        /api/upload/*        │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    ┌─────────┐ ┌────────┐ ┌──────────┐
    │Supabase │ │ Redis  │ │  Vercel  │
    │   DB    │ │ Cache  │ │   Blob   │
    └─────────┘ └────────┘ └──────────┘
          │          │          │
          └──────────┴──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   External APIs     │
          │  (OSM, Email, etc)  │
          └─────────────────────┘
```

---

## Database Schema (Complete)

### Users & Authentication

```sql
-- Users table (managed by Supabase Auth, extended)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,

  -- Contact
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),

  -- Location (optional)
  city VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(50) DEFAULT 'South Africa',

  -- Settings
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  location_sharing BOOLEAN DEFAULT FALSE,

  -- Privacy
  profile_visibility VARCHAR(20) DEFAULT 'public', -- public, friends, private

  -- Gamification
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]'::JSONB,

  -- Stats (computed)
  review_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  helpful_votes_received INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),

  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_business_owner BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active' -- active, suspended, deleted
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_points ON users(points DESC);

-- User preferences (separate for extensibility)
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Interests (for personalized recommendations)
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  favorite_categories TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Deal breakers
  deal_breakers JSONB DEFAULT '[]'::JSONB,

  -- Location preferences
  preferred_radius INTEGER DEFAULT 10, -- km
  preferred_price_range VARCHAR(10), -- $, $$, $$$, $$$$

  -- Language
  language VARCHAR(10) DEFAULT 'en',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Businesses

```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- OSM Integration
  osm_id BIGINT UNIQUE,
  osm_type VARCHAR(10),

  -- Basic Info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(200),

  -- Categories
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  cuisine VARCHAR(100), -- for restaurants

  -- Location
  address TEXT,
  street VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50),
  country VARCHAR(50) DEFAULT 'South Africa',
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  geom GEOMETRY(Point, 4326), -- PostGIS

  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,

  -- Business Details
  price_range VARCHAR(10), -- $, $$, $$$, $$$$
  opening_hours JSONB,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  payment_methods TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Media
  logo_url TEXT,
  cover_image_url TEXT,
  images JSONB DEFAULT '[]'::JSONB,
  menu_url TEXT, -- for restaurants

  -- Status
  verified BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,

  -- Ownership
  owner_id UUID REFERENCES users(id),
  claimed_at TIMESTAMP,

  -- Metrics (computed, updated by triggers)
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  checkin_count INTEGER DEFAULT 0,

  -- SEO
  meta_title VARCHAR(100),
  meta_description VARCHAR(200),

  -- Source
  source VARCHAR(50) DEFAULT 'openstreetmap',

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_osm ON businesses(osm_id) WHERE osm_id IS NOT NULL;
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category ON businesses(category, subcategory);
CREATE INDEX idx_businesses_rating ON businesses(average_rating DESC);
CREATE INDEX idx_businesses_active ON businesses(active, featured);
CREATE INDEX idx_businesses_geom ON businesses USING GIST(geom);
CREATE INDEX idx_businesses_owner ON businesses(owner_id) WHERE owner_id IS NOT NULL;

-- Full-text search
ALTER TABLE businesses ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '') || ' ' ||
      coalesce(city, '')
    )
  ) STORED;

CREATE INDEX idx_businesses_search ON businesses USING GIN(search_vector);

-- Business hours (normalized)
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at TIME,
  closes_at TIME,
  is_closed BOOLEAN DEFAULT FALSE,

  UNIQUE(business_id, day_of_week)
);

CREATE INDEX idx_business_hours ON business_hours(business_id);

-- Business photos (separate for better querying)
CREATE TABLE business_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES users(id),

  -- Metadata
  width INTEGER,
  height INTEGER,
  file_size INTEGER,

  -- Organization
  is_cover BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,

  -- Moderation
  status VARCHAR(20) DEFAULT 'approved',

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_business_photos ON business_photos(business_id, display_order);
CREATE INDEX idx_business_photos_cover ON business_photos(business_id) WHERE is_cover = TRUE;
```

### Reviews & Ratings

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  content TEXT NOT NULL CHECK (char_length(content) >= 10),

  -- Categories (optional detailed ratings)
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
  ambience_rating INTEGER CHECK (ambience_rating >= 1 AND ambience_rating <= 5),

  -- Tags
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Visit info
  visit_date DATE,
  visit_type VARCHAR(50), -- dine_in, takeout, delivery

  -- Flags
  verified_purchase BOOLEAN DEFAULT FALSE,
  synthetic BOOLEAN DEFAULT FALSE,
  edited BOOLEAN DEFAULT FALSE,

  -- Moderation
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, flagged
  moderation_notes TEXT,
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMP,

  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Prevent duplicate reviews
  UNIQUE(user_id, business_id)
);

-- Indexes
CREATE INDEX idx_reviews_business ON reviews(business_id, status, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(business_id, rating);
CREATE INDEX idx_reviews_helpful ON reviews(helpful_count DESC);
CREATE INDEX idx_reviews_status ON reviews(status, created_at DESC);

-- Review photos
CREATE TABLE review_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  caption TEXT,

  -- Metadata
  width INTEGER,
  height INTEGER,
  file_size INTEGER,

  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_review_photos ON review_photos(review_id, display_order);

-- Review helpfulness votes
CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(20) NOT NULL, -- helpful, not_helpful

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(review_id, user_id)
);

CREATE INDEX idx_review_votes ON review_votes(review_id, vote_type);

-- Review comments (replies)
CREATE TABLE review_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,

  -- For business owner responses
  is_owner_response BOOLEAN DEFAULT FALSE,

  status VARCHAR(20) DEFAULT 'approved',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_review_comments ON review_comments(review_id, created_at);
```

### Social Features

```sql
-- User follows
CREATE TABLE user_follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_follows_following ON user_follows(following_id);

-- Saved businesses (bookmarks)
CREATE TABLE saved_businesses (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- Collections/lists
  list_name VARCHAR(100) DEFAULT 'default',
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (user_id, business_id)
);

CREATE INDEX idx_saved_businesses_user ON saved_businesses(user_id, created_at DESC);
CREATE INDEX idx_saved_businesses_business ON saved_businesses(business_id);

-- Check-ins
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- Optional message
  message TEXT,

  -- Location verification
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checkins_user ON checkins(user_id, created_at DESC);
CREATE INDEX idx_checkins_business ON checkins(business_id, created_at DESC);
```

### Notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Type
  type VARCHAR(50) NOT NULL, -- review_reply, follow, mention, business_update

  -- Content
  title VARCHAR(200) NOT NULL,
  message TEXT,

  -- Related entities
  related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  related_business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  related_review_id UUID REFERENCES reviews(id) ON DELETE SET NULL,

  -- Link
  action_url TEXT,

  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);
```

### Analytics

```sql
-- Business views
CREATE TABLE business_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Session info
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,

  -- Referrer
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_business_views_business ON business_views(business_id, created_at DESC);
CREATE INDEX idx_business_views_user ON business_views(user_id, created_at DESC) WHERE user_id IS NOT NULL;

-- Search logs
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  query TEXT NOT NULL,
  filters JSONB,

  result_count INTEGER,
  clicked_result_id UUID,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_search_logs_user ON search_logs(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_search_logs_query ON search_logs(query, created_at DESC);
```

---

## Authentication & Authorization

### Supabase Auth Setup

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/ssr';

export const createClient = () => createClientComponentClient();

// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};

// lib/supabase/middleware.ts
import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Refresh session if expired
  if (session) {
    await supabase.auth.getUser();
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Auth Flows

#### 1. Email/Password Registration

```typescript
// app/api/auth/register/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(50),
  displayName: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, displayName } = registerSchema.parse(body);

    const supabase = createServerClient();

    // 1. Check username availability
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return Response.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // 2. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
        },
      },
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // 3. Create user profile (via trigger or manual insert)
    // This should be handled by a database trigger on auth.users insert

    return Response.json({
      success: true,
      user: data.user,
      message: 'Check your email to confirm your account',
    });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

#### 2. OAuth (Google, Facebook)

```typescript
// app/api/auth/oauth/route.ts
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') as 'google' | 'facebook';

  if (!provider) {
    return Response.json({ error: 'Provider required' }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${request.headers.get('origin')}/auth/callback`,
    },
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.redirect(data.url);
}
```

#### 3. Protected Route Middleware

```typescript
// lib/auth/withAuth.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function withAuth(
  handler: (request: Request, context: { user: User }) => Promise<Response>
) {
  return async (request: Request) => {
    const supabase = createServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, { user });
  };
}

// Usage:
// export const POST = withAuth(async (request, { user }) => {
//   // user is authenticated
// });
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Businesses: Anyone can read active businesses
CREATE POLICY "Anyone can view active businesses"
  ON businesses FOR SELECT
  USING (active = true);

-- Businesses: Only owners can update their businesses
CREATE POLICY "Owners can update their businesses"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id);

-- Reviews: Anyone can read approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (status = 'approved');

-- Reviews: Users can insert their own reviews
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reviews: Users can update their own reviews
CREATE POLICY "Users can update their reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users: Users can read all public profiles
CREATE POLICY "Anyone can view public profiles"
  ON users FOR SELECT
  USING (profile_visibility = 'public' OR id = auth.uid());

-- Users: Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());
```

---

## API Routes Structure

```
src/app/api/
├── auth/
│   ├── register/route.ts          # POST - User registration
│   ├── login/route.ts             # POST - Email/password login
│   ├── logout/route.ts            # POST - Logout
│   ├── oauth/route.ts             # GET - OAuth login
│   ├── callback/route.ts          # GET - OAuth callback
│   ├── reset-password/route.ts    # POST - Request password reset
│   └── verify-email/route.ts      # GET - Verify email
│
├── users/
│   ├── [id]/
│   │   ├── route.ts               # GET - User profile
│   │   ├── reviews/route.ts       # GET - User's reviews
│   │   ├── followers/route.ts     # GET - Followers list
│   │   └── following/route.ts     # GET - Following list
│   ├── me/
│   │   ├── route.ts               # GET/PATCH - Current user profile
│   │   ├── saved/route.ts         # GET - Saved businesses
│   │   └── notifications/route.ts # GET - User notifications
│   └── follow/route.ts            # POST/DELETE - Follow/unfollow
│
├── businesses/
│   ├── route.ts                   # GET - List businesses, POST - Create
│   ├── [id]/
│   │   ├── route.ts               # GET - Business details, PATCH - Update
│   │   ├── reviews/route.ts       # GET - Business reviews
│   │   ├── photos/route.ts        # GET/POST - Business photos
│   │   ├── claim/route.ts         # POST - Claim business
│   │   └── hours/route.ts         # GET/PATCH - Business hours
│   ├── nearby/route.ts            # GET - Nearby businesses (geolocation)
│   ├── trending/route.ts          # GET - Trending businesses
│   └── featured/route.ts          # GET - Featured businesses
│
├── reviews/
│   ├── route.ts                   # POST - Create review
│   ├── [id]/
│   │   ├── route.ts               # GET/PATCH/DELETE - Review CRUD
│   │   ├── vote/route.ts          # POST - Vote helpful/not helpful
│   │   └── comments/route.ts      # GET/POST - Review comments
│   └── recent/route.ts            # GET - Recent community reviews
│
├── search/
│   ├── route.ts                   # GET - Full-text search
│   ├── suggestions/route.ts       # GET - Search autocomplete
│   └── filters/route.ts           # GET - Available filter options
│
├── upload/
│   ├── presigned-url/route.ts     # POST - Generate upload URL
│   └── confirm/route.ts           # POST - Confirm upload complete
│
├── notifications/
│   ├── route.ts                   # GET - List notifications
│   ├── [id]/read/route.ts         # PATCH - Mark as read
│   └── mark-all-read/route.ts     # POST - Mark all as read
│
├── analytics/
│   ├── track-view/route.ts        # POST - Track business view
│   └── track-search/route.ts      # POST - Track search query
│
└── admin/
    ├── businesses/
    │   └── moderate/route.ts      # POST - Approve/reject business
    ├── reviews/
    │   └── moderate/route.ts      # POST - Approve/reject review
    └── users/
        └── [id]/
            ├── suspend/route.ts   # POST - Suspend user
            └── verify/route.ts    # POST - Verify user
```

### Example API Route Implementation

#### GET /api/businesses/[id]

```typescript
// app/api/businesses/[id]/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();

    // Fetch business with related data
    const { data: business, error } = await supabase
      .from('businesses')
      .select(`
        *,
        business_hours(*),
        business_photos(
          id,
          url,
          caption,
          is_cover,
          display_order
        ),
        owner:users!owner_id(
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('id', params.id)
      .eq('active', true)
      .single();

    if (error || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Track view (async, don't await)
    trackBusinessView(params.id, request);

    return NextResponse.json(business);

  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function trackBusinessView(businessId: string, request: Request) {
  // Implementation in analytics section
}
```

#### POST /api/reviews

```typescript
// app/api/reviews/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ratelimit } from '@/lib/ratelimit';

const reviewSchema = z.object({
  businessId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  content: z.string().min(10).max(5000),
  tags: z.array(z.string()).max(4).optional(),
  images: z.array(z.string().url()).max(5).optional(),
  serviceRating: z.number().int().min(1).max(5).optional(),
  priceRating: z.number().int().min(1).max(5).optional(),
  ambienceRating: z.number().int().min(1).max(5).optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    // 1. Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    const identifier = user.id;
    const { success, reset } = await ratelimit.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests', resetAt: reset },
        { status: 429 }
      );
    }

    // 3. Validate input
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // 4. Check if user already reviewed this business
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('business_id', validatedData.businessId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this business' },
        { status: 400 }
      );
    }

    // 5. Create review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        business_id: validatedData.businessId,
        rating: validatedData.rating,
        title: validatedData.title,
        content: validatedData.content,
        tags: validatedData.tags || [],
        service_rating: validatedData.serviceRating,
        price_rating: validatedData.priceRating,
        ambience_rating: validatedData.ambienceRating,
        status: 'pending', // Manual moderation
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating review:', insertError);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    // 6. Upload images if provided
    if (validatedData.images && validatedData.images.length > 0) {
      const photoInserts = validatedData.images.map((url, index) => ({
        review_id: review.id,
        url,
        storage_key: extractStorageKey(url),
        display_order: index,
      }));

      await supabase.from('review_photos').insert(photoInserts);
    }

    // 7. Trigger notifications (async)
    notifyBusinessOwner(validatedData.businessId, review.id);

    // 8. Update business rating (via trigger or manual)
    // This is handled by a database trigger

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted and pending approval',
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractStorageKey(url: string): string {
  // Extract key from Vercel Blob or R2 URL
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').pop() || '';
}

async function notifyBusinessOwner(businessId: string, reviewId: string) {
  // Implementation in notifications section
}
```

#### GET /api/search

```typescript
// app/api/search/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const priceRange = searchParams.get('priceRange');
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '10'); // km

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = createServerClient();

    let queryBuilder = supabase
      .from('businesses')
      .select('*', { count: 'exact' })
      .eq('active', true);

    // Full-text search
    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query);
    }

    // Filters
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (city) {
      queryBuilder = queryBuilder.eq('city', city);
    }

    if (minRating > 0) {
      queryBuilder = queryBuilder.gte('average_rating', minRating);
    }

    if (priceRange) {
      queryBuilder = queryBuilder.eq('price_range', priceRange);
    }

    // Geolocation search
    if (lat && lng) {
      // Use PostGIS distance query
      queryBuilder = queryBuilder.rpc('nearby_businesses', {
        lat,
        lng,
        radius_km: radius,
      });
    }

    // Pagination
    queryBuilder = queryBuilder
      .range(offset, offset + limit - 1)
      .order('average_rating', { ascending: false });

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    // Track search (async)
    trackSearch(query, { category, city, minRating, priceRange });

    return NextResponse.json({
      businesses: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PostGIS function for geolocation search
```

```sql
-- SQL function for nearby businesses
CREATE OR REPLACE FUNCTION nearby_businesses(
  lat DECIMAL,
  lng DECIMAL,
  radius_km INTEGER DEFAULT 10
)
RETURNS SETOF businesses AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM businesses
  WHERE active = true
    AND ST_DWithin(
      geom,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000 -- Convert km to meters
    )
  ORDER BY geom <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326);
END;
$$ LANGUAGE plpgsql;
```

---

## File Upload & Storage

### Vercel Blob Integration

```typescript
// lib/upload/blob.ts
import { put, del } from '@vercel/blob';
import { nanoid } from 'nanoid';

export async function uploadImage(
  file: File,
  folder: 'reviews' | 'businesses' | 'avatars'
): Promise<{ url: string; key: string }> {
  // Generate unique filename
  const extension = file.name.split('.').pop();
  const filename = `${folder}/${nanoid()}.${extension}`;

  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    key: filename,
  };
}

export async function deleteImage(key: string): Promise<void> {
  await del(key);
}
```

### Upload API Route

```typescript
// app/api/upload/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/upload/blob';
import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'reviews';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Process image (resize, optimize)
    const buffer = await file.arrayBuffer();
    const optimizedBuffer = await sharp(Buffer.from(buffer))
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    const optimizedFile = new File([optimizedBuffer], file.name, {
      type: 'image/webp',
    });

    // Upload to Vercel Blob
    const { url, key } = await uploadImage(optimizedFile, folder as any);

    return NextResponse.json({
      success: true,
      url,
      key,
      size: optimizedBuffer.length,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

---

## Real-time Features

### Supabase Realtime

```typescript
// hooks/useRealtimeNotifications.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const supabase = createClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      // Subscribe to notifications
      channel = supabase
        .channel(`user:${userId}:notifications`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev]);

            // Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(payload.new.title, {
                body: payload.new.message,
                icon: '/icon-192x192.png',
              });
            }
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      channel?.unsubscribe();
    };
  }, [userId, supabase]);

  return notifications;
}
```

---

## Security & Rate Limiting

### Rate Limiting with Upstash Redis

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Define rate limiters for different operations
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
  analytics: true,
});

export const reviewRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 d'), // 10 reviews per day
});

export const uploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 uploads per hour
});
```

### Content Sanitization

```typescript
// lib/security/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

export function sanitizeText(text: string): string {
  // Remove any HTML tags
  return text.replace(/<[^>]*>/g, '');
}
```

---

## Caching Strategy

### Redis Caching

```typescript
// lib/cache/redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get<T>(key);

  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

export async function invalidateCache(pattern: string): Promise<void> {
  // Delete all keys matching pattern
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

### Cache Keys Convention

```
business:{id}                    # Business details
business:{id}:reviews            # Business reviews
user:{id}:profile                # User profile
search:{query}:{filters}         # Search results
trending:businesses              # Trending list
nearby:{lat}:{lng}:{radius}      # Nearby businesses
```

---

## Deployment & DevOps

### Environment Variables

```bash
# .env.local (Development)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX...

# Email (Resend)
RESEND_API_KEY=re_...

# External APIs
UNSPLASH_ACCESS_KEY=xxx (optional)
OPENAI_API_KEY=sk-... (for moderation, optional)

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Deployment Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

---

## Implementation Timeline

### Week 1-2: Foundation
- [ ] Set up Supabase project
- [ ] Create database schema (all tables)
- [ ] Set up authentication (email, OAuth)
- [ ] Implement RLS policies
- [ ] Create basic API routes structure

### Week 3-4: Core Features
- [ ] Business CRUD APIs
- [ ] Review submission & moderation
- [ ] User profiles & settings
- [ ] File upload system
- [ ] Search implementation

### Week 5-6: Social & Advanced
- [ ] Follow system
- [ ] Saved businesses
- [ ] Notifications system
- [ ] Real-time updates
- [ ] Analytics tracking

### Week 7-8: Polish & Deploy
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Error monitoring (Sentry)
- [ ] Performance optimization
- [ ] Production deployment
- [ ] OpenStreetMap seeding

---

## Testing Strategy

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Example Test

```typescript
// __tests__/api/reviews.test.ts
import { POST } from '@/app/api/reviews/route';

describe('POST /api/reviews', () => {
  it('should create a review when authenticated', async () => {
    const request = new Request('http://localhost/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessId: 'xxx-xxx-xxx',
        rating: 5,
        content: 'Great experience!',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.review).toBeDefined();
  });

  it('should return 401 when not authenticated', async () => {
    // Test implementation
  });

  it('should return 400 when duplicate review', async () => {
    // Test implementation
  });
});
```

---

## Monitoring & Logging

### Sentry Error Tracking

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

export { Sentry };
```

### Logging Best Practices

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(`[ERROR] ${message}`, error, meta);

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, { extra: meta });
    }
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
};
```

---

## Next Steps

1. **Review this plan** with your team
2. **Set up Supabase project** and configure database
3. **Start with authentication** implementation
4. **Build core API routes** (businesses, reviews, users)
5. **Implement file upload** system
6. **Add OpenStreetMap seeding** scripts
7. **Deploy to Vercel** staging environment
8. **Test thoroughly** before production launch

**Total Timeline**: 8-10 weeks for complete backend implementation

---

## Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [OpenStreetMap API](https://wiki.openstreetmap.org/wiki/API)
- [PostGIS Documentation](https://postgis.net/documentation/)

