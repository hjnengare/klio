# Business Review Page - Production Readiness Analysis

## Current State (UI/UX Demo Mode)

The [business/review/page.tsx](src/app/business/review/page.tsx) is currently a frontend-only implementation with:
- Mock data for business info and reviews
- Console logging for form submission
- Alert-based confirmation
- No actual API integration
- No data persistence

## Backend Requirements for Production

### 1. API Endpoints Needed

#### a. GET `/api/business/:businessId`
**Purpose**: Fetch business details for the review form
```typescript
Response: {
  id: string;
  name: string;
  rating: number;
  images: string[];
  category: string;
  address: string;
  verified: boolean;
}
```

#### b. POST `/api/reviews`
**Purpose**: Submit a new review
```typescript
Request: {
  businessId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  tags: string[];
  images: File[]; // Requires multipart/form-data
}

Response: {
  success: boolean;
  reviewId: string;
  message: string;
}
```

#### c. GET `/api/reviews/recent?limit=3&exclude=:businessId`
**Purpose**: Fetch recent community reviews for sidebar
```typescript
Response: {
  reviews: Array<{
    id: string;
    user: { name: string; avatar: string; location: string; };
    business: string;
    rating: number;
    text: string;
    date: string;
    likes: number;
    image?: string;
  }>;
}
```

### 2. Data Validation Requirements

#### Frontend Validation (Already Implemented)
- ✅ Rating required (1-5 stars)
- ✅ Review text required (min length check)
- ❌ Add max character limits
- ❌ Add profanity filter
- ❌ Sanitize HTML/XSS protection

#### Backend Validation Needed
```typescript
// Review submission schema
{
  rating: { type: 'number', min: 1, max: 5, required: true },
  title: { type: 'string', maxLength: 100, optional: true },
  content: {
    type: 'string',
    minLength: 10,
    maxLength: 5000,
    required: true
  },
  tags: {
    type: 'array',
    items: 'string',
    maxLength: 4,
    enum: ['Trustworthy', 'On Time', 'Friendly', 'Good Value']
  },
  images: {
    type: 'array',
    maxItems: 5,
    fileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5MB per image'
  }
}
```

### 3. Security Requirements

#### Authentication & Authorization
- [ ] User must be authenticated to submit reviews
- [ ] Verify user owns the session/token
- [ ] Implement rate limiting (max 1 review per business per user)
- [ ] Prevent duplicate reviews from same user
- [ ] Check if user has actually visited the business (optional: geofencing/check-in)

#### Data Security
- [ ] Sanitize all text inputs (XSS prevention)
- [ ] Validate file uploads (type, size, malware scan)
- [ ] Rate limit API calls (prevent spam/DDoS)
- [ ] CSRF token for form submission
- [ ] Content moderation queue for profanity/hate speech

#### Image Upload Security
```typescript
// Image validation requirements
{
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 5 * 1024 * 1024, // 5MB
  maxDimensions: { width: 4096, height: 4096 },
  scanForMalware: true,
  stripMetadata: true // EXIF data privacy
}
```

### 4. Database Schema

#### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  tags TEXT[],
  images JSONB, -- Array of image URLs/keys
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,

  -- Prevent duplicate reviews
  UNIQUE(user_id, business_id)
);

CREATE INDEX idx_reviews_business ON reviews(business_id, status, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);
```

#### Review Images Table
```sql
CREATE TABLE review_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_key TEXT NOT NULL, -- S3/Cloud Storage key
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW(),

  -- Order of images
  display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_review_images ON review_images(review_id, display_order);
```

### 5. File Storage Strategy

#### Recommended: Cloud Storage (AWS S3 / Cloudflare R2 / Vercel Blob)

```typescript
// Upload flow
1. Frontend uploads to signed URL endpoint
2. Backend generates pre-signed URL
3. Frontend uploads directly to cloud storage
4. Frontend confirms upload to backend
5. Backend validates and creates review record

// Benefits:
- Reduces server load
- Faster uploads
- Scalable storage
- CDN integration
- Cost-effective
```

#### Image Processing Pipeline
```typescript
// On upload:
1. Validate file type & size
2. Generate multiple sizes (thumbnail, medium, full)
3. Convert to WebP for optimization
4. Strip EXIF metadata
5. Store in cloud storage
6. Save URLs to database
```

### 6. API Rate Limiting

```typescript
// Recommended limits
{
  reviewSubmission: {
    perUser: '1 per business', // Unique constraint
    perIP: '5 per hour',
    globalPerUser: '10 per day'
  },
  imageUpload: {
    perRequest: 5, // Max 5 images
    perUser: '20 per day'
  }
}
```

### 7. Content Moderation

#### Automated Moderation
- [ ] Profanity filter (library: `bad-words` or API)
- [ ] Spam detection (repeated content, links)
- [ ] Hate speech detection (AI-based or third-party API)
- [ ] Image content moderation (AWS Rekognition, Google Vision API)

#### Manual Moderation Queue
```typescript
// Review statuses
{
  pending: 'Awaiting moderation',
  approved: 'Live on site',
  rejected: 'Violates policy',
  flagged: 'Needs human review'
}
```

### 8. Error Handling

```typescript
// Error responses
{
  400: 'Invalid input data',
  401: 'Not authenticated',
  403: 'Already reviewed this business',
  413: 'Image file too large',
  415: 'Unsupported image format',
  429: 'Too many requests',
  500: 'Server error'
}
```

### 9. Implementation Checklist

#### Phase 1: Basic Backend Integration
- [ ] Create API route `/api/reviews` (POST)
- [ ] Implement basic validation (rating, content)
- [ ] Connect to database (PostgreSQL/Supabase)
- [ ] Add authentication check
- [ ] Return success/error responses

#### Phase 2: Image Upload
- [ ] Set up cloud storage (Vercel Blob/S3)
- [ ] Create signed URL endpoint
- [ ] Implement image validation
- [ ] Add image processing pipeline
- [ ] Store image metadata in DB

#### Phase 3: Security & Validation
- [ ] Add rate limiting middleware
- [ ] Implement CSRF protection
- [ ] Add content sanitization
- [ ] Set up duplicate review check
- [ ] Add profanity filter

#### Phase 4: Content Moderation
- [ ] Create moderation queue
- [ ] Add automated filters
- [ ] Build admin approval interface
- [ ] Implement flagging system

#### Phase 5: Analytics & Monitoring
- [ ] Log review submissions
- [ ] Track review approval rates
- [ ] Monitor API performance
- [ ] Set up error alerting

### 10. Recommended Tech Stack

```typescript
// Backend
{
  framework: 'Next.js API Routes',
  database: 'PostgreSQL (Supabase)',
  auth: 'Supabase Auth / NextAuth.js',
  storage: 'Vercel Blob / Cloudflare R2',
  validation: 'Zod',
  rateLimit: 'upstash/ratelimit',
  imageProcessing: 'sharp',
  moderation: 'OpenAI Moderation API / AWS Rekognition'
}
```

### 11. Frontend Updates Needed

```typescript
// Replace mock submission with real API call
const handleSubmitReview = async () => {
  try {
    setIsSubmitting(true);

    // 1. Upload images first (if any)
    const imageUrls = await uploadImages(selectedImages);

    // 2. Submit review
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        businessId,
        rating: overallRating,
        title: reviewTitle,
        content: reviewText,
        tags: selectedTags,
        images: imageUrls,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit review');
    }

    const data = await response.json();

    // 3. Show success message
    showToast('Review submitted successfully!', 'success');

    // 4. Redirect to business page
    router.push(`/business/${businessId}?reviewId=${data.reviewId}`);

  } catch (error) {
    console.error('Review submission error:', error);
    showToast('Failed to submit review. Please try again.', 'error');
  } finally {
    setIsSubmitting(false);
  }
};
```

### 12. Performance Considerations

- [ ] Implement optimistic UI updates
- [ ] Add loading states during submission
- [ ] Show upload progress for images
- [ ] Cache business data client-side
- [ ] Lazy load sidebar reviews
- [ ] Implement skeleton loaders

### 13. Accessibility & UX Enhancements

- [ ] Add keyboard navigation for star rating
- [ ] Include ARIA labels for all interactive elements
- [ ] Show character count for review text
- [ ] Add auto-save draft functionality
- [ ] Implement unsaved changes warning
- [ ] Add image preview before upload

### 14. Testing Requirements

#### Unit Tests
- [ ] Validation logic
- [ ] Image upload utility functions
- [ ] Error handling

#### Integration Tests
- [ ] API endpoint responses
- [ ] Database operations
- [ ] Authentication flow

#### E2E Tests
- [ ] Complete review submission flow
- [ ] Image upload flow
- [ ] Error scenarios
- [ ] Rate limiting behavior

---

## Next Steps

1. **Immediate**: Set up Supabase database with reviews table
2. **Phase 1**: Create basic API endpoint for review submission
3. **Phase 2**: Implement image upload with Vercel Blob
4. **Phase 3**: Add security measures (auth, rate limiting, validation)
5. **Phase 4**: Build content moderation system
6. **Production**: Deploy with monitoring and analytics

**Estimated Timeline**: 2-3 weeks for full production-ready implementation
