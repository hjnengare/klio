import { Business } from "../components/BusinessCard/BusinessCard";

// Create a Map for O(1) business lookup instead of array filtering
const BUSINESS_MAP = new Map<string, Business>();

// Initialize the map with business data
const initializeBusinessMap = () => {
  if (BUSINESS_MAP.size === 0) {
    // Import the businesses and populate the map
    const businesses: Business[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "The Green Table",
        image: "/museum.png",
        alt: "The Green Table restaurant",
        category: "Restaurant",
        location: "Downtown",
        rating: 5,
        totalRating: 4.8,
        reviews: 127,
        badge: "Trending",
        href: "/business/550e8400-e29b-41d4-a716-446655440001",
        percentiles: { service: 96, price: 87, ambience: 91 },
        verified: true,
        distance: "0.3 mi",
        priceRange: "$$",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Artisan Coffee Co.",
        image: "/plate.png",
        alt: "Artisan Coffee Co.",
        category: "Coffee Shop",
        location: "Arts District",
        rating: 5,
        totalRating: 4.9,
        reviews: 89,
        href: "/business/550e8400-e29b-41d4-a716-446655440002",
        percentiles: { service: 93, price: 84, ambience: 89 },
        verified: true,
        distance: "0.5 mi",
        priceRange: "$",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Bloom Yoga Studio",
        image: "/restaurant.png",
        alt: "Bloom Yoga Studio",
        category: "Wellness",
        location: "Riverside",
        rating: 5,
        totalRating: 4.7,
        reviews: 156,
        href: "/business/550e8400-e29b-41d4-a716-446655440003",
        percentiles: { service: 95, price: 86, ambience: 90 },
        verified: true,
        distance: "0.8 mi",
        priceRange: "$$",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "Vintage Books & Coffee",
        image: "/car.png",
        alt: "Vintage Books & Coffee",
        category: "Bookstore",
        location: "Historic District",
        rating: 5,
        totalRating: 4.6,
        reviews: 203,
        href: "/business/550e8400-e29b-41d4-a716-446655440004",
        percentiles: { service: 92, price: 88, ambience: 94 },
        verified: true,
        distance: "1.2 mi",
        priceRange: "$",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        name: "Sunset Ceramics",
        image: "/bar.png",
        alt: "Sunset Ceramics",
        category: "Art Studio",
        location: "Arts Quarter",
        rating: 5,
        totalRating: 4.9,
        reviews: 78,
        href: "/business/550e8400-e29b-41d4-a716-446655440005",
        percentiles: { service: 97, price: 85, ambience: 96 },
        verified: true,
        distance: "0.6 mi",
        priceRange: "$$",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        name: "Morning Glory Bakery",
        image: "/cocktail.png",
        alt: "Morning Glory Bakery",
        category: "Bakery",
        location: "Market Square",
        rating: 5,
        totalRating: 4.8,
        reviews: 134,
        href: "/business/550e8400-e29b-41d4-a716-446655440006",
        percentiles: { service: 94, price: 82, ambience: 89 },
        verified: true,
        distance: "0.4 mi",
        priceRange: "$",
      },
    ];

    businesses.forEach(business => {
      BUSINESS_MAP.set(business.id, business);
    });
  }
};

// Initialize the map
initializeBusinessMap();

// Optimized function to get businesses by IDs
export const getBusinessesByIds = (ids: string[]): Business[] => {
  return ids
    .map(id => BUSINESS_MAP.get(id))
    .filter(Boolean) as Business[];
};

// Get all business IDs (for compatibility)
export const getAllBusinessIds = (): string[] => {
  return Array.from(BUSINESS_MAP.keys());
};

// Get business by ID
export const getBusinessById = (id: string): Business | undefined => {
  return BUSINESS_MAP.get(id);
};
