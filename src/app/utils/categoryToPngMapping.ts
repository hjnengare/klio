/**
 * Maps business categories to their corresponding PNG icon files
 * These PNGs are fallback icons when businesses haven't uploaded custom images
 */

const CATEGORY_TO_PNG: Record<string, string> = {
  // Food & Drink
  "Restaurant": "/png/001-restaurant.png",
  "restaurant": "/png/001-restaurant.png",
  "Coffee Shop": "/png/002-coffee-cup.png",
  "coffee shop": "/png/002-coffee-cup.png",
  "Cocktail Bar": "/png/003-cocktail.png",
  "cocktail bar": "/png/003-cocktail.png",
  "Fine Dining": "/png/004-dinner.png",
  "fine dining": "/png/004-dinner.png",
  "Food Truck": "/png/005-food-truck.png",
  "food truck": "/png/005-food-truck.png",
  "Bakery": "/png/006-bakery.png",
  "bakery": "/png/006-bakery.png",
  "Brewery": "/png/007-beer-tap.png",
  "brewery": "/png/007-beer-tap.png",
  "Wine Bar": "/png/008-wine-bottle.png",
  "wine bar": "/png/008-wine-bottle.png",
  "Fast Food": "/png/031-fast-food.png",
  "fast food": "/png/031-fast-food.png",
  "Deli": "/png/001-restaurant.png",
  "deli": "/png/001-restaurant.png",
  
  // Beauty & Wellness
  "Hair Salon": "/png/009-salon.png",
  "hair salon": "/png/009-salon.png",
  "salon": "/png/009-salon.png",
  "Spa": "/png/010-spa.png",
  "spa": "/png/010-spa.png",
  "Wellness": "/png/010-spa.png",
  "wellness": "/png/010-spa.png",
  "Nail Salon": "/png/011-nail-polish.png",
  "nail salon": "/png/011-nail-polish.png",
  "Barber Shop": "/png/012-barber-pole.png",
  "barber shop": "/png/012-barber-pole.png",
  "barbershop": "/png/012-barber-pole.png",
  "Massage": "/png/013-body-massage.png",
  "massage": "/png/013-body-massage.png",
  
  // Fitness
  "Gym": "/png/014-dumbbell.png",
  "gym": "/png/014-dumbbell.png",
  "fitness": "/png/014-dumbbell.png",
  "Yoga Studio": "/png/015-yoga.png",
  "yoga studio": "/png/015-yoga.png",
  "yoga": "/png/015-yoga.png",
  "Pilates Studio": "/png/016-pilates.png",
  "pilates studio": "/png/016-pilates.png",
  "pilates": "/png/016-pilates.png",
  "Martial Arts": "/png/017-taekwondo.png",
  "martial arts": "/png/017-taekwondo.png",
  
  // Arts & Culture
  "Museum": "/png/018-museum.png",
  "museum": "/png/018-museum.png",
  "Art Gallery": "/png/019-art-gallery.png",
  "art gallery": "/png/019-art-gallery.png",
  "Art Studio": "/png/019-art-gallery.png",
  "art studio": "/png/019-art-gallery.png",
  "Theatre": "/png/020-theatre.png",
  "theatre": "/png/020-theatre.png",
  "theater": "/png/020-theatre.png",
  "Workshop": "/png/021-workshop.png",
  "workshop": "/png/021-workshop.png",
  
  // Events & Entertainment
  "Event Venue": "/png/022-party-people.png",
  "event venue": "/png/022-party-people.png",
  "Party": "/png/022-party-people.png",
  "party": "/png/022-party-people.png",
  
  // Shopping
  "Shopping": "/png/023-shopping-bag.png",
  "shopping": "/png/023-shopping-bag.png",
  "Boutique": "/png/024-boutique.png",
  "boutique": "/png/024-boutique.png",
  "Bookstore": "/png/025-open-book.png",
  "bookstore": "/png/025-open-book.png",
  "books": "/png/025-open-book.png",
  "Home Decor": "/png/026-house-decoration.png",
  "home decor": "/png/026-house-decoration.png",
  "Gift Shop": "/png/027-gift.png",
  "gift shop": "/png/027-gift.png",
  "Thrift Store": "/png/028-value.png",
  "thrift store": "/png/028-value.png",
  "Grocery Store": "/png/029-grocery-basket.png",
  "grocery store": "/png/029-grocery-basket.png",
  "grocery": "/png/029-grocery-basket.png",
  "Market Stall": "/png/030-stall.png",
  "market stall": "/png/030-stall.png",
  "stall": "/png/030-stall.png",
};

/**
 * Get the PNG icon path for a given category
 * @param category - The business category (case-insensitive)
 * @returns The PNG icon path or default restaurant icon if category not found
 */
export function getCategoryPng(category: string | undefined | null): string {
  if (!category || typeof category !== 'string') {
    return "/png/001-restaurant.png"; // Default fallback
  }
  
  const normalizedCategory = category.trim();
  
  // Exact match first
  if (CATEGORY_TO_PNG[normalizedCategory]) {
    return CATEGORY_TO_PNG[normalizedCategory];
  }
  
  // Case-insensitive match
  const lowerCategory = normalizedCategory.toLowerCase();
  const match = Object.entries(CATEGORY_TO_PNG).find(([key]) => 
    key.toLowerCase() === lowerCategory
  );
  
  if (match) {
    return match[1];
  }
  
  // Partial match - check if category contains keywords
  const partialMatch = Object.entries(CATEGORY_TO_PNG).find(([key]) => 
    lowerCategory.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCategory)
  );
  
  if (partialMatch) {
    return partialMatch[1];
  }
  
  // Final fallback
  return "/png/001-restaurant.png";
}

/**
 * Check if an image URL is a PNG icon (fallback) or an uploaded image
 * @param imageUrl - The image URL to check
 * @returns true if it's a PNG icon path, false if it's an uploaded image
 */
export function isPngIcon(imageUrl: string | undefined | null): boolean {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }
  
  return imageUrl.includes('/png/') || imageUrl.endsWith('.png');
}

