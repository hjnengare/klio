"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { useToast } from "../contexts/ToastContext";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { CheckCircle } from "lucide-react";

/** ----- Minimal entrance animations (subtle & accessible) ----- */
const entranceStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .enter-fade {
    opacity: 0;
    animation: fadeSlideIn 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  .enter-stagger {
    opacity: 0;
    animation: fadeSlideIn 0.6s ease-out forwards;
  }
  @keyframes microBounce {
    0%,100% { transform: scale(1); }
    50%     { transform: scale(1.05); }
  }
  .animate-micro-bounce { animation: microBounce 0.28s ease-out; }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

interface SubcategoryItem {
  id: string;
  label: string;
  interest_id: string;
}
interface GroupedSubcategories {
  [interestId: string]: {
    title: string;
    items: SubcategoryItem[];
  };
}

const DEMO_SUBCATEGORIES: GroupedSubcategories = {
  "food-drink": {
    title: "Food & Drink",
    items: [
      { id: "restaurants", label: "Restaurants", interest_id: "food-drink" },
      { id: "cafes", label: "Cafés", interest_id: "food-drink" },
      { id: "bars", label: "Bars", interest_id: "food-drink" },
      { id: "fast-food", label: "Fast Food", interest_id: "food-drink" },
      { id: "fine-dining", label: "Fine Dining", interest_id: "food-drink" },
      { id: "food-trucks", label: "Food Trucks", interest_id: "food-drink" },
      { id: "bakeries", label: "Bakeries", interest_id: "food-drink" },
      { id: "breweries", label: "Breweries", interest_id: "food-drink" },
      { id: "wine-bars", label: "Wine Bars", interest_id: "food-drink" },
    ],
  },
  "beauty-wellness": {
    title: "Beauty & Wellness",
    items: [
      { id: "hair-salons", label: "Hair Salons", interest_id: "beauty-wellness" },
      { id: "spas", label: "Spas", interest_id: "beauty-wellness" },
      { id: "nail-salons", label: "Nail Salons", interest_id: "beauty-wellness" },
      { id: "barbers", label: "Barbers", interest_id: "beauty-wellness" },
      { id: "massage", label: "Massage Therapy", interest_id: "beauty-wellness" },
      { id: "gyms", label: "Gyms", interest_id: "gyms" },
      { id: "yoga", label: "Yoga", interest_id: "yoga" },
      { id: "pilates", label: "Pilates", interest_id: "pilates" },
      { id: "martial-arts", label: "Martial Arts", interest_id: "martial-arts" },
    ],
  },
  "arts-culture": {
    title: "Arts & Culture",
    items: [
      { id: "museums", label: "Museums", interest_id: "arts-culture" },
      { id: "galleries", label: "Galleries", interest_id: "arts-culture" },
      { id: "theatres", label: "Theatres", interest_id: "arts-culture" },
      { id: "creative-workshops", label: "Creative Workshops", interest_id: "arts-culture" },
      { id: "dance-studios", label: "Dance Studios", interest_id: "arts-culture" },
    ],
  },
  "shopping-lifestyle": {
    title: "Shopping & Lifestyle",
    items: [
      { id: "clothing", label: "Clothing Stores", interest_id: "shopping-lifestyle" },
      { id: "boutiques", label: "Boutiques", interest_id: "shopping-lifestyle" },
      { id: "bookstores", label: "Bookstores", interest_id: "shopping-lifestyle" },
      { id: "home-decor", label: "Home Decor", interest_id: "shopping-lifestyle" },
      { id: "gift-shops", label: "Gift Shops", interest_id: "shopping-lifestyle" },
      { id: "jewellery", label: "Jewellery Stores", interest_id: "shopping-lifestyle" },
      { id: "grocers", label: "Grocery Stores", interest_id: "shopping-lifestyle" },
      { id: "markets", label: "Markets", interest_id: "shopping-lifestyle" },
    ],
  },
  "services-everyday": {
    title: "Professional Services",
    items: [
      { id: "education-learning", label: "Education & Learning", interest_id: "services-everyday" },
      { id: "transport-travel", label: "Transport & Travel", interest_id: "services-everyday" },
      { id: "finance-insurance", label: "Finance & Insurance", interest_id: "services-everyday" },
      { id: "plumbers", label: "Plumbers", interest_id: "services-everyday" },
      { id: "handymen", label: "Handymen", interest_id: "services-everyday" },
      { id: "electricians", label: "Electricians", interest_id: "services-everyday" },
      { id: "legal-services", label: "Legal Services", interest_id: "services-everyday" },
      { id: "cleaning", label: "Cleaning Services", interest_id: "services-everyday" },
      { id: "pest-control", label: "Pest Control", interest_id: "services-everyday" },
      { id: "laundromat", label: "Laundromats", interest_id: "services-everyday" },
    ],
  },
  "digital-work": {
    title: "Digital & Work",
    items: [
      { id: "tech-gadgets", label: "Tech & Gadgets", interest_id: "digital-work" },
      { id: "work-offices", label: "Work & Offices", interest_id: "digital-work" },
    ],
  },
  "experiences-entertainment": {
    title: "Experiences & Entertainment",
    items: [
      { id: "events-festivals", label: "Events & Festivals", interest_id: "experiences-entertainment" },
      { id: "sports-recreation", label: "Sports & Recreation", interest_id: "experiences-entertainment" },
      { id: "nightlife", label: "Nightlife", interest_id: "experiences-entertainment" },
      { id: "comedy-clubs", label: "Comedy Clubs", interest_id: "experiences-entertainment" },
      { id: "escape-rooms", label: "Escape Rooms", interest_id: "experiences-entertainment" },
    ],
  },
  "family & pets": {
    title: "Family & Pets",
    items: [
      { id: "kids-entertainment", label: "Kids Entertainment", interest_id: "family-pets" },
      { id: "family-friendly-activities", label: "Family-Friendly Activities", interest_id: "family-pets" },
      { id: "vets", label: "Vets", interest_id: "family-pets" },
      { id: "pet-grooming-services", label: "Pet-Grooming Services", interest_id: "family-pets" },
      { id: "pet-friendly restaurants", label: "Pet-Friendly Restaurants", interest_id: "family-pets" },
    ],
  },
  "outdoors-adventure": {
    title: "Outdoors & Adventure",
    items: [
      { id: "land-adventures", label: "Land Adventures", interest_id: "outdoors-adventure" },
      { id: "water-activities", label: "Water Activities", interest_id: "outdoors-adventure" },
      { id: "air-extreme-sports", label: "Air & Extreme Sports", interest_id: "outdoors-adventure" },
      { id: "tourism-exploration", label: "Tourism & Exploration", interest_id: "outdoors-adventure" },
    ],
  },
};

const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
};

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function SubcategoriesContent() {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = { id: "dummy-user-id" };
  const { showToast } = useToast();
  const {
    selectedSubInterests,
    setSelectedSubInterests,
    loadSubInterests,
  } = useOnboarding();

  const [isNavigating, setIsNavigating] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [hasLoadedSubcategories, setHasLoadedSubcategories] = useState(false);

  const MIN_SELECTIONS = 3;
  const MAX_SELECTIONS = 12;

  const selectedInterests = useMemo(() => {
    const fromUrl =
      searchParams?.get("interests")?.split(",").filter(Boolean) || [];
    return fromUrl;
  }, [searchParams]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedSubcategories) {
      setHasLoadedSubcategories(true);
      loadSubInterests(selectedInterests);
    }
  }, [selectedInterests, hasLoadedSubcategories, loadSubInterests]);

  const groupedSubcategories: GroupedSubcategories = DEMO_SUBCATEGORIES;

  /** ----- REORDER: match requested sequence ----- */
  const DISPLAY_ORDER = [
    "food-drink",
    "beauty-wellness",
    "professional-services",
    "outdoors-adventure",
    "experiences-entertainment",
    "arts-culture",
    "family-pets",
    "shopping-lifestyle",
  ] as const;

  // Map requested ids to existing keys in DEMO_SUBCATEGORIES
  const KEY_ALIASES: Record<string, string> = {
    "professional-services": "services-everyday",
    "family-pets": "family & pets",
  };

  const orderedSections = useMemo(() => {
    const entries: Array<[string, { title: string; items: SubcategoryItem[] }]> =
      [];
    for (const id of DISPLAY_ORDER) {
      const realKey = KEY_ALIASES[id] ?? id;
      const section = groupedSubcategories[realKey];
      if (section) entries.push([realKey, section]);
    }
    // Append any sections not explicitly ordered (e.g. "digital-work")
    for (const [k, v] of Object.entries(groupedSubcategories)) {
      const alreadyIncluded = entries.find(([key]) => key === k);
      if (!alreadyIncluded) entries.push([k, v]);
    }
    return entries;
  }, [groupedSubcategories]);

  const triggerMicroBounce = useCallback((id: string) => {
    setAnimatingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setAnimatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  const handleSubcategoryToggle = useCallback(
    async (subcategoryId: string) => {
      const isCurrentlySelected = selectedSubInterests.includes(subcategoryId);
      triggerMicroBounce(subcategoryId);

      if (!isCurrentlySelected && selectedSubInterests.length >= MAX_SELECTIONS) {
        // showToast(`Maximum ${MAX_SELECTIONS} subcategories allowed`, "warning", 2000);
        return;
      }

      const newSelection = isCurrentlySelected
        ? selectedSubInterests.filter((id) => id !== subcategoryId)
        : [...selectedSubInterests, subcategoryId];

      setSelectedSubInterests(newSelection);

      try {
        await fetch("/api/user/subcategories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selections: newSelection }),
        });
      } catch (error) {
        console.error("Error saving subcategories:", error);
        // showToast("Failed to save subcategories", "error", 3000);
      }
    },
    [selectedSubInterests, setSelectedSubInterests, triggerMicroBounce]
  );

  const canProceed = useMemo(() => {
    return selectedSubInterests.length >= MIN_SELECTIONS && !isNavigating && !!user;
  }, [selectedSubInterests.length, isNavigating, user]);

  const handleNext = useCallback(async () => {
    if (!canProceed) return;
    try {
      setIsNavigating(true);
      router.push("/deal-breakers");
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      setIsNavigating(false);
    }
  }, [canProceed, router]);

  if (!user) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-sf text-base text-charcoal/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const hydratedSelected = mounted ? selectedSubInterests : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: entranceStyles }} />

      <OnboardingLayout
        backHref="/interests"
        step={2}
        className="min-h-[100dvh] bg-white flex flex-col relative overflow-hidden"
      >
        {/* Offline chip */}
        {!isOnline && (
          <div
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 enter-fade"
            style={{ animationDelay: "0.08s" }}
          >
            <div className="bg-orange-50/90 border border-orange-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-orange-700" style={sf}>
                Offline
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-4 pt-4 sm:pt-6 enter-fade" style={{ animationDelay: "0.1s" }}>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 text-center leading-snug px-2 tracking-tight"
            style={sf}
          >
            Tell us more!
          </h2>
          <p
            className="text-sm md:text-base font-normal text-charcoal/70 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto"
            style={sf}
          >
            Pick at least {MIN_SELECTIONS} across any sections to personalize your experience
          </p>
        </div>

        {/* Card */}
        <OnboardingCard
          className="rounded-3xl border border-white/30 shadow-sm bg-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8 enter-fade"
          style={{ animationDelay: "0.16s" }}
        >
          <div className="space-y-6 mb-4">
            {orderedSections.map(([interestId, section], sIdx) => {
              const sectionDelay = 0.22 + Math.min(sIdx, 8) * 0.08; // gentle per-section stagger
              return (
                <section key={interestId} className="enter-fade" style={{ animationDelay: `${sectionDelay}s` }}>
                  <h3 className="text-base md:text-lg font-semibold text-charcoal mb-3 px-1" style={sf}>
                    {section.title}
                  </h3>

                  {/* GRID: 5+ per row on larger screens */}
                  <div
                    className="
                      grid gap-2 md:gap-3
                      grid-cols-2
                      sm:grid-cols-3
                      md:grid-cols-4
                      lg:grid-cols-5
                      xl:grid-cols-6
                    "
                  >
                    {section.items.map((subcategory, iIdx) => {
                      const isSelected = hydratedSelected.includes(subcategory.id);
                      const isDisabled =
                        !isSelected && hydratedSelected.length >= MAX_SELECTIONS;

                      // chip-level stagger (in addition to section delay)
                      const chipDelay = sectionDelay + Math.min(iIdx, 6) * 0.05;

                      return (
                        <button
                          key={subcategory.id}
                          data-subcategory-id={subcategory.id}
                          onClick={() => handleSubcategoryToggle(subcategory.id)}
                          disabled={isDisabled}
                          aria-pressed={isSelected}
                          className={`
                            enter-stagger
                            relative inline-flex items-center justify-center
                            py-3 md:py-4 px-5 md:px-6
                            text-sm md:text-base font-semibold text-center
                            transition-all duration-200 ease-out
                            min-h-[44px] rounded-full
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                            disabled:cursor-not-allowed disabled:opacity-60
                            w-full
                            ${animatingIds.has(subcategory.id) ? "animate-micro-bounce" : ""}
                            ${
                              isSelected
                                ? "bg-coral text-white md:shadow-[0_10px_40px_rgba(214,116,105,0.22),0_2px_8px_rgba(0,0,0,0.06)]"
                                : isDisabled
                                ? "bg-charcoal/5 text-charcoal/40"
                                : "bg-sage text-white hover:bg-sage/90"
                            }
                          `}
                          style={{ ...(sf as any), animationDelay: `${chipDelay}s` }}
                        >
                          <span className="truncate">{subcategory.label}</span>
                          {isSelected && (
                            <div className="absolute top-1 right-1">
                              <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Continue */}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`enter-fade block w-full text-white text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 ${
              canProceed
                ? "bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)]"
                : "bg-white/90 text-charcoal/40 cursor-not-allowed"
            }`}
            style={{ ...(sf as any), animationDelay: "0.25s" }}
          >
            Continue
          </button>
        </OnboardingCard>
      </OnboardingLayout>
    </>
  );
}

export default function SubcategoriesPage() {
  return (
    <ProtectedRoute requiresAuth={true}>
      <Suspense
        fallback={
          <div className="min-h-dvh bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-sf text-base text-charcoal/70">Loading subcategories...</p>
            </div>
          </div>
        }
      >
        <SubcategoriesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
