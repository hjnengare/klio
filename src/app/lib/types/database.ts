export interface User {
  id: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  onboarding_step: string;
  onboarding_complete: boolean;
  interests_count: number;
  last_interests_updated?: string;
  interests?: string[];
  sub_interests?: string[];
  deal_breakers?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserInterest {
  id: string;
  user_id: string;
  interest_id: string;
  created_at: string;
}

export interface AuthUser extends User {
  profile?: Profile;
  interests?: string[];
}

export interface AuthError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  verified: boolean;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  created_at: string;
  updated_at: string;
  owner_id?: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  tags: string[];
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewImage {
  id: string;
  review_id: string;
  image_url: string;
  alt_text?: string;
  created_at: string;
}

export interface BusinessStats {
  business_id: string;
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  percentiles: {
    service: number;
    price: number;
    ambience: number;
  };
}

// Extended types for UI
export interface BusinessWithStats extends Business {
  stats?: BusinessStats;
  distance?: string;
  recent_reviews?: ReviewWithUser[];
}

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    name?: string;
    avatar_url?: string;
  };
  images?: ReviewImage[];
}

export interface ReviewFormData {
  business_id: string;
  rating: number;
  title?: string;
  content: string;
  tags: string[];
  images?: File[];
}

export interface BusinessSearchFilters {
  category?: string;
  location?: string;
  price_range?: string[];
  min_rating?: number;
  verified_only?: boolean;
  within_miles?: number;
}
