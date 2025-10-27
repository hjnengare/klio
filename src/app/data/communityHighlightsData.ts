export interface Reviewer {
  id: string;
  name: string;
  profilePicture: string;
  reviewCount: number;
  rating: number;
  badge?: "top" | "verified" | "local";
  trophyBadge?: "gold" | "silver" | "bronze" | "rising-star" | "community-favorite";
  location: string;
}

export interface Review {
  id: string;
  reviewer: Reviewer;
  businessName: string;
  businessType: string;
  rating: number;
  reviewText: string;
  date: string;
  likes: number;
  images?: string[];
}

// Utility function to randomly assign trophy badges
const getRandomTrophyBadge = (): Reviewer['trophyBadge'] | undefined => {
  const trophies: (Reviewer['trophyBadge'])[] = ["gold", "silver", "bronze", "rising-star", "community-favorite"];
  const shouldHaveTrophy = Math.random() > 0.3; // 70% chance of having a trophy

  if (!shouldHaveTrophy) return undefined;

  return trophies[Math.floor(Math.random() * trophies.length)];
};

export const TOP_REVIEWERS: Reviewer[] = [
  {
    id: "1",
    name: "Sarah Chen",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 127,
    rating: 4.8,
    badge: "top",
    trophyBadge: "gold",
    location: "Downtown"
  },
  {
    id: "2",
    name: "Marcus Johnson",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 89,
    rating: 4.7,
    badge: "verified",
    trophyBadge: "community-favorite",
    location: "Midtown"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    reviewCount: 156,
    rating: 4.9,
    badge: "local",
    trophyBadge: "silver",
    location: "Arts District"
  },
  {
    id: "4",
    name: "David Kim",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 73,
    rating: 4.6,
    trophyBadge: "rising-star",
    location: "Westside"
  },
  {
    id: "5",
    name: "Amanda Foster",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 203,
    rating: 4.9,
    badge: "top",
    trophyBadge: "gold",
    location: "Riverside"
  },
  {
    id: "6",
    name: "James Wilson",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 95,
    rating: 4.5,
    badge: "verified",
    trophyBadge: "community-favorite",
    location: "Northside"
  },
  {
    id: "7",
    name: "Priya Patel",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 142,
    rating: 4.8,
    badge: "local",
    trophyBadge: "silver",
    location: "East Village"
  },
  {
    id: "8",
    name: "Alex Thompson",
    profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 68,
    rating: 4.4,
    trophyBadge: "rising-star",
    location: "Southside"
  },
  {
    id: "9",
    name: "Maya Santos",
    profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 178,
    rating: 4.7,
    badge: "top",
    trophyBadge: "bronze",
    location: "Historic District"
  },
  {
    id: "10",
    name: "Ryan O'Connor",
    profilePicture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 84,
    rating: 4.6,
    badge: "verified",
    trophyBadge: "community-favorite",
    location: "University District"
  },
  {
    id: "11",
    name: "Zoe Chen",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 156,
    rating: 4.8,
    badge: "local",
    trophyBadge: "silver",
    location: "Tech Quarter"
  },
  {
    id: "12",
    name: "Carlos Mendez",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    reviewCount: 92,
    rating: 4.5,
    trophyBadge: "rising-star",
    location: "Waterfront"
  }
];

export const FEATURED_REVIEWS: Review[] = [
  {
    id: "1",
    reviewer: TOP_REVIEWERS[0],
    businessName: "The Cozy Corner Cafe",
    businessType: "Coffee Shop",
    rating: 5,
    reviewText: "Absolutely love this hidden gem! The barista remembers my order and the atmosphere is perfect for working. Their lavender latte is to die for!",
    date: "2 days ago",
    likes: 24,
    images: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop"]
  },
  {
    id: "2", 
    reviewer: TOP_REVIEWERS[1],
    businessName: "Mama Rosa's Trattoria",
    businessType: "Italian Restaurant",
    rating: 5,
    reviewText: "Best authentic Italian food outside of Italy! The pasta is made fresh daily and the tiramisu is heavenly. Service is impeccable too.",
    date: "1 week ago",
    likes: 31,
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop"]
  },
  {
    id: "3",
    reviewer: TOP_REVIEWERS[2], 
    businessName: "Sunset Yoga Studio",
    businessType: "Wellness",
    rating: 5,
    reviewText: "This place transformed my wellness journey. The instructors are amazing and the rooftop classes during sunset are magical. Highly recommend!",
    date: "3 days ago", 
    likes: 18
  },
  {
    id: "4",
    reviewer: TOP_REVIEWERS[3],
    businessName: "The Book Nook",
    businessType: "Bookstore",
    rating: 4,
    reviewText: "Charming little bookstore with rare finds and great coffee. The owner is incredibly knowledgeable and always has perfect recommendations.",
    date: "5 days ago",
    likes: 12
  }
];

export interface BusinessOfTheMonth {
  id: string;
  name: string;
  image: string;
  alt: string;
  category: string;
  location: string;
  rating: number;
  totalRating: number;
  reviews: number;
  badge: "winner" | "runner-up" | "featured";
  href?: string;
  monthAchievement: string;
  verified?: boolean;
}

export const BUSINESSES_OF_THE_MONTH: BusinessOfTheMonth[] = [
  // Food & Drink - Coffee
  {
    id: "1",
    name: "Artisan Coffee Roasters",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop&auto=format",
    alt: "Artisan Coffee Roasters interior",
    category: "Food & Drink",
    location: "Arts District",
    rating: 5,
    totalRating: 4.9,
    reviews: 234,
    badge: "winner",
    monthAchievement: "Best Coffee Shop",
    verified: true,
    href: "/business/artisan-coffee"
  },
  // Food & Drink - Restaurant
  {
    id: "2",
    name: "Luna's Garden Bistro",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&auto=format",
    alt: "Luna's Garden Bistro dining area",
    category: "Food & Drink",
    location: "Downtown",
    rating: 5,
    totalRating: 4.8,
    reviews: 189,
    badge: "winner",
    monthAchievement: "Best Restaurant",
    verified: true,
    href: "/business/lunas-garden"
  },
  // Food & Drink - Bakery
  {
    id: "3",
    name: "Sweet Dreams Patisserie",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&auto=format",
    alt: "Sweet Dreams Patisserie",
    category: "Food & Drink",
    location: "French Quarter",
    rating: 5,
    totalRating: 4.9,
    reviews: 412,
    badge: "winner",
    monthAchievement: "Best Bakery",
    href: "/business/sweet-dreams-patisserie",
    verified: true
  },
  // Beauty & Wellness - Yoga
  {
    id: "4",
    name: "Green Valley Yoga Studio",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&auto=format",
    alt: "Green Valley Yoga Studio interior",
    category: "Beauty & Wellness",
    location: "Westside",
    rating: 5,
    totalRating: 4.8,
    reviews: 98,
    badge: "winner",
    monthAchievement: "Best Wellness Center",
    href: "/business/green-valley-yoga",
    verified: true
  },
  // Beauty & Wellness - Fitness
  {
    id: "5",
    name: "Iron & Steel Fitness",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&auto=format",
    alt: "Iron & Steel Fitness gym",
    category: "Beauty & Wellness",
    location: "Industrial Park",
    rating: 5,
    totalRating: 4.7,
    reviews: 176,
    badge: "winner",
    monthAchievement: "Best Gym",
    href: "/business/iron-steel-fitness",
    verified: true
  },
  // Beauty & Wellness - Spa
  {
    id: "6",
    name: "Serenity Day Spa",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop&auto=format",
    alt: "Serenity Day Spa interior",
    category: "Beauty & Wellness",
    location: "Midtown",
    rating: 5,
    totalRating: 4.85,
    reviews: 203,
    badge: "winner",
    monthAchievement: "Best Spa",
    href: "/business/serenity-spa",
    verified: true
  },
  // Arts & Culture - Bookstore
  {
    id: "7",
    name: "The Book & Brew",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&auto=format",
    alt: "The Book & Brew bookstore cafe",
    category: "Arts & Culture",
    location: "University District",
    rating: 5,
    totalRating: 4.7,
    reviews: 156,
    badge: "winner",
    monthAchievement: "Best Bookstore",
    href: "/business/book-and-brew",
    verified: true
  },
  // Arts & Culture - Gallery
  {
    id: "8",
    name: "Modern Canvas Gallery",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=400&fit=crop&auto=format",
    alt: "Modern Canvas Gallery",
    category: "Arts & Culture",
    location: "Arts District",
    rating: 5,
    totalRating: 4.75,
    reviews: 89,
    badge: "winner",
    monthAchievement: "Best Art Gallery",
    href: "/business/modern-canvas",
    verified: true
  },
  // Shopping & Lifestyle - Boutique
  {
    id: "9",
    name: "Urban Threads Boutique",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&auto=format",
    alt: "Urban Threads Boutique",
    category: "Shopping & Lifestyle",
    location: "Downtown",
    rating: 5,
    totalRating: 4.6,
    reviews: 145,
    badge: "winner",
    monthAchievement: "Best Boutique",
    href: "/business/urban-threads",
    verified: true
  },
  // Nightlife & Entertainment - Music Venue
  {
    id: "10",
    name: "The Jazz Corner",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop&auto=format",
    alt: "The Jazz Corner",
    category: "Nightlife & Entertainment",
    location: "Entertainment District",
    rating: 5,
    totalRating: 4.8,
    reviews: 267,
    badge: "winner",
    monthAchievement: "Best Music Venue",
    href: "/business/jazz-corner",
    verified: true
  },
  // Home & Services - Home Improvement
  {
    id: "11",
    name: "Premier Home Solutions",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=400&fit=crop&auto=format",
    alt: "Premier Home Solutions",
    category: "Home & Services",
    location: "Suburban District",
    rating: 5,
    totalRating: 4.65,
    reviews: 178,
    badge: "winner",
    monthAchievement: "Best Home Services",
    href: "/business/premier-home",
    verified: true
  },
  // Outdoors & Adventure - Adventure Sports
  {
    id: "12",
    name: "Mountain Peak Adventures",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop&auto=format",
    alt: "Mountain Peak Adventures",
    category: "Outdoors & Adventure",
    location: "Mountain District",
    rating: 5,
    totalRating: 4.9,
    reviews: 312,
    badge: "winner",
    monthAchievement: "Best Adventure Company",
    href: "/business/mountain-peak",
    verified: true
  },
  // Family & Pets - Pet Services
  {
    id: "13",
    name: "Pawsitive Pet Care",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&auto=format",
    alt: "Pawsitive Pet Care",
    category: "Family & Pets",
    location: "Residential Area",
    rating: 5,
    totalRating: 4.95,
    reviews: 289,
    badge: "winner",
    monthAchievement: "Best Pet Services",
    href: "/business/pawsitive-pet",
    verified: true
  }
];

export type { Review as CommunityReview, Reviewer as CommunityReviewer };
