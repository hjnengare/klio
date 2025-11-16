/**
 * Maps sayso sub-interests (and top-level interests) to branded PNG icons.
 * These assets live under /public/png and are used whenever a business is missing a custom image.
 */

const SUBCATEGORY_ICON_MAP: Record<string, string> = {
  // Food & Drink
  "restaurants": "/png/004-dinner.png",
  "restaurant": "/png/001-restaurant.png",
  "cafes": "/png/002-coffee-cup.png",
  "coffee": "/png/002-coffee-cup.png",
  "coffee-shop": "/png/002-coffee-cup.png",
  "bars": "/png/007-beer-tap.png",
  "cocktail-bar": "/png/003-cocktail.png",
  "wine-bar": "/png/008-wine-bottle.png",
  "fast-food": "/png/031-fast-food.png",
  "fine-dining": "/png/001-restaurant.png",
  "bakery": "/png/006-bakery.png",
  "food-truck": "/png/005-food-truck.png",
  "grocery": "/png/029-grocery-basket.png",
  "market-stall": "/png/030-stall.png",

  // Beauty & Wellness
  "gyms": "/png/014-dumbbell.png",
  "spas": "/png/010-spa.png",
  "salons": "/png/009-salon.png",
  "wellness": "/png/013-body-massage.png",
  "wellness-center": "/png/013-body-massage.png",
  "yoga": "/png/015-yoga.png",
  "pilates": "/png/016-pilates.png",
  "martial-arts": "/png/017-taekwondo.png",
  "barber": "/png/012-barber-pole.png",
  "nail-salons": "/png/011-nail-polish.png",

  // Professional Services
  "education-learning": "/png/044-student.png",
  "transport-travel": "/png/045-transportation.png",
  "finance-insurance": "/png/046-insurance.png",
  "plumbers": "/png/047-plunger.png",
  "electricians": "/png/049-broken-cable.png",
  "legal-services": "/png/050-balance.png",
  "handyman": "/png/048-handyman.png",
  "laundry": "/png/052-washing-machine.png",
  "pest-control": "/png/053-insecticide.png",
  "workshop": "/png/021-workshop.png",

  // Outdoors & Adventure
  "hiking": "/png/054-sign.png",
  "cycling": "/png/033-sport.png",
  "water-sports": "/png/032-swim.png",
  "camping": "/png/036-summer.png",
  "skydiving": "/png/034-skydive.png",
  "tour-guide": "/png/035-tour-guide.png",

  // Experiences & Entertainment
  "events-festivals": "/png/022-party-people.png",
  "sports-recreation": "/png/033-sport.png",
  "nightlife": "/png/041-dj.png",
  "comedy-clubs": "/png/042-mime.png",
  "tickets": "/png/056-ticket.png",

  // Arts & Culture
  "museums": "/png/018-museum.png",
  "galleries": "/png/019-art-gallery.png",
  "theaters": "/png/020-theatre.png",
  "concerts": "/png/040-stage.png",

  // Family & Pets
  "family-activities": "/png/055-home.png",
  "pet-services": "/png/038-pet.png",
  "childcare": "/png/055-home.png",
  "veterinarians": "/png/037-veterinarian.png",
  "dogs": "/png/039-dogs.png",

  // Shopping & Lifestyle
  "fashion": "/png/024-boutique.png",
  "electronics": "/png/digitalization.png",
  "electronics-store": "/png/digitalization.png",
  "electronics-shops": "/png/digitalization.png",
  "electronics-and-gadgets": "/png/digitalization.png",
  "gadgets": "/png/digitalization.png",
  "tech": "/png/digitalization.png",
  "technology": "/png/digitalization.png",
  "digital": "/png/digitalization.png",
  "digital-services": "/png/digitalization.png",
  "phone-repair": "/png/digitalization.png",
  "computer-repair": "/png/digitalization.png",
  "home-decor": "/png/026-house-decoration.png",
  "books": "/png/025-open-book.png",
  "bookstore": "/png/025-open-book.png",
  "gifts": "/png/027-gift.png",
  "value": "/png/028-value.png",
  "shopping-cart": "/png/shopping-cart.png",

  // Interest-level fallbacks (broader groups)
  "food-drink": "/png/004-dinner.png",
  "beauty-wellness": "/png/010-spa.png",
  "professional-services": "/png/046-insurance.png",
  "outdoors-adventure": "/png/036-summer.png",
  "experiences-entertainment": "/png/022-party-people.png",
  "arts-culture": "/png/018-museum.png",
  "family-pets": "/png/055-home.png",
  "shopping-lifestyle": "/png/023-shopping-bag.png",

  // Generic business
  "business": "/png/business-and-trade.png",
  "trade": "/png/business-and-trade.png",
  "business-other": "/png/business-and-trade.png",
  "default": "/png/business-and-trade.png",
};

const DEFAULT_ICON = SUBCATEGORY_ICON_MAP["default"];

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[\s_/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Returns the icon path for a given category or sub-interest slug.
 * Falls back to a star placeholder if we can't match anything.
 */
export function getCategoryPng(category: string | undefined | null): string {
  if (!category || typeof category !== "string") {
    return DEFAULT_ICON;
  }

  const trimmed = category.trim();
  if (!trimmed) {
    return DEFAULT_ICON;
  }

  // Direct match (in case we already have the slug)
  if (SUBCATEGORY_ICON_MAP[trimmed]) {
    return SUBCATEGORY_ICON_MAP[trimmed];
  }

  const slug = normalizeKey(trimmed);
  if (slug && SUBCATEGORY_ICON_MAP[slug]) {
    return SUBCATEGORY_ICON_MAP[slug];
  }

  return DEFAULT_ICON;
}

/**
 * Attempts to resolve the best PNG placeholder given multiple label candidates.
 * Pass in things like subcategory label, month achievement text, category group, etc.
 */
export function getCategoryPngFromLabels(labels: Array<string | undefined | null>): string {
  for (const label of labels) {
    if (!label || typeof label !== "string") continue;
    const direct = SUBCATEGORY_ICON_MAP[label];
    if (direct) return direct;

    const slug = normalizeKey(label);
    if (slug && SUBCATEGORY_ICON_MAP[slug]) {
      return SUBCATEGORY_ICON_MAP[slug];
    }

    // Try extracting common tokens (e.g., "Featured Coffee Shop" -> "coffee-shop")
    const tokens = slug.split("-");
    // Prefer 2-word tokens like coffee-shop, fast-food, etc.
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j <= Math.min(tokens.length, i + 2); j++) {
        const sub = tokens.slice(i, j).join("-");
        if (SUBCATEGORY_ICON_MAP[sub]) return SUBCATEGORY_ICON_MAP[sub];
      }
    }
    // Fallback to any single token
    for (const t of tokens) {
      if (SUBCATEGORY_ICON_MAP[t]) return SUBCATEGORY_ICON_MAP[t];
    }
  }
  return DEFAULT_ICON;
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

