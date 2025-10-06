// Types reused from your page
export interface UserProfile {
    user_id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    locale: string;
    onboarding_step: string;
    is_top_reviewer: boolean;
    reviews_count: number;
    badges_count: number;
    interests_count: number;
    last_interests_updated: string | null;
    created_at: string;
    updated_at: string;
  }
  export interface UserInterest {
    interest_id: string;
    interests: { id: string; name: string };
  }
  export interface Review {
    id: string;
    business_name: string;
    rating: number;
    review_text: string | null;
    is_featured: boolean;
    created_at: string;
  }
  export interface Achievement {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    category: string;
  }
  export interface UserAchievement {
    achievement_id: string;
    earned_at: string;
    achievements: Achievement;
  }
  
  export const MOCK_PROFILE: UserProfile = {
    user_id: "mock-user-1",
    username: "klio_dev",
    display_name: "KLIO Designer",
    avatar_url: null, // keep null to see your Ion placeholder; set a URL to test images
    locale: "en_US",
    onboarding_step: "complete",
    is_top_reviewer: true,
    reviews_count: 8,
    badges_count: 3,
    interests_count: 4,
    last_interests_updated: new Date().toISOString(),
    created_at: "2024-01-01T12:00:00Z",
    updated_at: new Date().toISOString(),
  };
  
  export const MOCK_INTERESTS: UserInterest[] = [
    { interest_id: "coffee", interests: { id: "coffee", name: "Coffee" } },
    { interest_id: "fine-dining", interests: { id: "fine-dining", name: "Fine Dining" } },
    { interest_id: "nature", interests: { id: "nature", name: "Nature" } },
    { interest_id: "wellness", interests: { id: "wellness", name: "Wellness" } },
  ];
  
  export const MOCK_REVIEWS: Review[] = [
    {
      id: "1",
      business_name: "The Pot Luck Club",
      rating: 5,
      review_text: "Amazing rooftop dining experience with incredible city views!",
      is_featured: true,
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      business_name: "Kirstenbosch Gardens",
      rating: 5,
      review_text: "Perfect place for a weekend picnic and nature walks.",
      is_featured: false,
      created_at: "2024-01-10T14:20:00Z",
    },
    {
      id: "3",
      business_name: "La Colombe Restaurant",
      rating: 4,
      review_text: "Excellent wine selection and beautiful vineyard setting.",
      is_featured: false,
      created_at: "2024-01-05T19:45:00Z",
    },
    {
      id: "4",
      business_name: "V&A Waterfront",
      rating: 4,
      review_text: "Great shopping and entertainment hub with harbor views.",
      is_featured: false,
      created_at: "2023-12-28T16:15:00Z",
    },
    {
      id: "5",
      business_name: "Chapman's Peak Drive",
      rating: 5,
      review_text: "Breathtaking coastal drive - must do when visiting Cape Town!",
      is_featured: true,
      created_at: "2023-12-20T09:30:00Z",
    },
  ];
  
  export const MOCK_ACHIEVEMENTS: UserAchievement[] = [
    {
      achievement_id: "1",
      earned_at: "2024-01-01T12:00:00Z",
      achievements: {
        id: "1",
        name: "Local Explorer",
        description: "Reviewed 5 different businesses in your area",
        icon: "map",
        category: "discovery",
      },
    },
    {
      achievement_id: "2",
      earned_at: "2024-01-10T12:00:00Z",
      achievements: {
        id: "2",
        name: "Top Reviewer",
        description: "Earned featured review status",
        icon: "trophy",
        category: "quality",
      },
    },
    {
      achievement_id: "3",
      earned_at: "2024-01-15T12:00:00Z",
      achievements: {
        id: "3",
        name: "Community Helper",
        description: "Your reviews helped 50+ people discover great places",
        icon: "heart",
        category: "community",
      },
    },
  ];
  