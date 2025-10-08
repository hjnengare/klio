"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// import { useAuth } from "../contexts/AuthContext"; // Disabled for UI/UX design
import { useOnboarding } from "../contexts/OnboardingContext";
import { useToast } from "../contexts/ToastContext";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";

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
      { id: "cafes", label: "Cafes", interest_id: "food-drink" },
      { id: "bars", label: "Bars", interest_id: "food-drink" },
      { id: "fast-food", label: "Fast Food", interest_id: "food-drink" },
      { id: "fine-dining", label: "Fine Dining", interest_id: "food-drink" },
      { id: "food-trucks", label: "Food Trucks", interest_id: "food-drink" },
      { id: "bakeries", label: "Bakeries", interest_id: "food-drink" },
      { id: "breweries", label: "Breweries", interest_id: "food-drink" },
      { id: "wine-bars", label: "Wine Bars", interest_id: "food-drink" },
    ],
  },
  "arts-culture": {
    title: "Arts & Culture",
    items: [
      { id: "museums", label: "Museums", interest_id: "arts-culture" },
      { id: "galleries", label: "Galleries", interest_id: "arts-culture" },
      { id: "theaters", label: "Theaters", interest_id: "arts-culture" },
      { id: "concerts", label: "Concerts", interest_id: "arts-culture" },
      { id: "art-studios", label: "Art Studios", interest_id: "arts-culture" },
      { id: "cultural-centers", label: "Cultural Centers", interest_id: "arts-culture" },
      { id: "music-venues", label: "Music Venues", interest_id: "arts-culture" },
      { id: "dance-studios", label: "Dance Studios", interest_id: "arts-culture" },
      { id: "libraries", label: "Libraries", interest_id: "arts-culture" },
    ],
  },
};

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const triggerMicroBounce = useCallback((id: string) => {
    if (prefersReduced) return;
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

      // Feedback disabled for simplicity
      // if (!isCurrentlySelected) {
      //   if (newSelection.length === MIN_SELECTIONS) {
      //     showToast("🎉 Great! You can continue now", "sage", 2000);
      //   } else if (newSelection.length === MAX_SELECTIONS) {
      //     showToast("✨ Perfect selection!", "sage", 2000);
      //   }
      // }

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
      // showToast(`Moving to next step with ${selectedSubInterests.length} subcategories!`, "success", 2000);
      router.push("/deal-breakers");
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      // showToast("Failed to proceed. Please try again.", "error", 3000);
    }
  }, [canProceed, selectedSubInterests.length, router]);

  if (!user) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-urbanist text-base text-charcoal/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const hydratedSelected = mounted ? selectedSubInterests : [];

  return (
    <OnboardingLayout
      backHref="/interests"
      step={2}
      className="min-h-[100dvh] bg-white flex flex-col relative overflow-hidden"
    >
      {!isOnline && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <div className="bg-orange-50/90 border border-orange-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-orange-700" style={sf}>
              Offline
            </span>
          </div>
        </div>
      )}

      <div className="text-center mb-4 pt-4 sm:pt-6">
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

      <OnboardingCard className="rounded-3xl border border-white/30 shadow-sm bg-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8">
        <div className="space-y-4 mb-4">
          {Object.entries(groupedSubcategories).map(([interestId, section]) => (
            <section key={interestId}>
              <h3 className="text-base md:text-lg font-semibold text-charcoal mb-3 px-1" style={sf}>
                {section.title}
              </h3>

              <div className="flex flex-wrap gap-2 md:grid md:grid-cols-3 md:gap-3">
                {section.items.map((subcategory) => {
                  const isSelected = hydratedSelected.includes(subcategory.id);
                  const isDisabled =
                    !isSelected && hydratedSelected.length >= MAX_SELECTIONS;

                  return (
                    <button
                      key={subcategory.id}
                      data-subcategory-id={subcategory.id}
                      onClick={() => handleSubcategoryToggle(subcategory.id)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      className={`
                        relative w-auto md:w-full py-3 md:py-4 px-4
                        text-sm md:text-base font-semibold text-center
                        transition-all duration-200 ease-out
                        min-h-[44px] md:min-h-[52px] rounded-full
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                        disabled:cursor-not-allowed disabled:opacity-60
                        ${animatingIds.has(subcategory.id) ? "animate-micro-bounce" : ""}
                        ${
                          isSelected
                            ? "bg-coral text-white md:shadow-[0_10px_40px_rgba(214,116,105,0.22),0_2px_8px_rgba(0,0,0,0.06)]"
                            : isDisabled
                            ? "bg-charcoal/5 text-charcoal/40"
                            : "bg-sage text-white hover:bg-sage/90"
                        }
                      `}
                      style={sf}
                    >
                      <span className="whitespace-nowrap">{subcategory.label}</span>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <ion-icon name="checkmark-circle" size="small" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`block w-full text-white text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 ${
            canProceed
              ? "bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)]"
              : "bg-white/90 text-charcoal/40 cursor-not-allowed"
          }`}
          style={sf}
        >
          Continue
        </button>
      </OnboardingCard>
    </OnboardingLayout>
  );
}

export default function SubcategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-urbanist text-base text-charcoal/70">Loading subcategories...</p>
          </div>
        </div>
      }
    >
      <SubcategoriesContent />
    </Suspense>
  );
}
