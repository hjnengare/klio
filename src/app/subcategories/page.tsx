"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
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

// Demo data for subcategories
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
      { id: "wine-bars", label: "Wine Bars", interest_id: "food-drink" }
    ]
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
      { id: "libraries", label: "Libraries", interest_id: "arts-culture" }
    ]
  }
};

// Detect reduced motion preference
const prefersReduced = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Prevent hydration mismatch: true only after first client render */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function SubcategoriesContent() {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const router = useRouter();
  // const { user } = useAuth(); // Disabled for UI/UX design
  const user = { id: 'dummy-user-id' }; // Dummy user for UI/UX design
  const { showToast } = useToast();
  const { selectedSubInterests, setSelectedSubInterests, loadSubInterests, subInterests, isLoading: contextLoading } = useOnboarding();
  const isLoading = false; // Disabled for UI/UX design

  // State
  const [isNavigating, setIsNavigating] = useState(false); // Disabled for UI/UX design
  const [isOnline, setIsOnline] = useState(true);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [hasLoadedSubcategories, setHasLoadedSubcategories] = useState(false);

  // Constants for min/max selection
  const MIN_SELECTIONS = 3;
  const MAX_SELECTIONS = 12;

  // Get selected interests from URL (no user profile for UI/UX design)
  const selectedInterests = useMemo(() => {
    const fromUrl = searchParams?.get("interests")?.split(",").filter(Boolean) || [];
    return fromUrl; // Only use URL params for UI/UX design
  }, [searchParams]);


  // Route protection disabled for UI/UX design
  // useEffect(() => {
  //   if (mounted && !user) {
  //     router.replace('/login?redirect=/subcategories');
  //   }
  // }, [mounted, user, router]);

  // Offline detection
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Load subcategories based on selected interests
  useEffect(() => {
    if (!hasLoadedSubcategories) {
      setHasLoadedSubcategories(true);
      // Load subcategories filtered by selectedInterests (or all if empty)
      loadSubInterests(selectedInterests);
    }
  }, [selectedInterests, hasLoadedSubcategories, loadSubInterests]);

  /* -------- User starts with fresh selection --------*/
  // Note: User always starts with no subcategories pre-selected
  // This ensures a clean slate for each visit to the subcategories page

  // Use demo data for subcategories
  const groupedSubcategories: GroupedSubcategories = DEMO_SUBCATEGORIES;

  // Animation trigger helper
  const triggerMicroBounce = useCallback((id: string) => {
    if (prefersReduced) return;

    setAnimatingIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setAnimatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  // Handle subcategory toggle
  const handleSubcategoryToggle = useCallback(async (subcategoryId: string) => {
    const isCurrentlySelected = selectedSubInterests.includes(subcategoryId);

    // Trigger micro-bounce animation
    triggerMicroBounce(subcategoryId);

    // If trying to select but already at max, prevent with feedback
    if (!isCurrentlySelected && selectedSubInterests.length >= MAX_SELECTIONS) {
      showToast(`Maximum ${MAX_SELECTIONS} subcategories allowed`, 'warning', 2000);
      // Add visual shake effect
      const button = document.querySelector(`[data-subcategory-id="${subcategoryId}"]`);
      if (button) {
        button.classList.add('animate-shake');
        setTimeout(() => button.classList.remove('animate-shake'), 400);
      }
      return;
    }

    // Calculate new selection
    const newSelection = isCurrentlySelected
      ? selectedSubInterests.filter(id => id !== subcategoryId)
      : [...selectedSubInterests, subcategoryId];

    // Optimistic update
    setSelectedSubInterests(newSelection);

    // Show contextual feedback
    if (!isCurrentlySelected) {
      if (newSelection.length === MIN_SELECTIONS) {
        showToast('🎉 Great! You can continue now', 'sage', 2000);
      } else if (newSelection.length === MAX_SELECTIONS) {
        showToast('✨ Perfect selection!', 'sage', 2000);
      }
    }

    // Save to API
    try {
      const response = await fetch('/api/user/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: newSelection }),
      });

      if (!response.ok) {
        showToast('Failed to save subcategories', 'error', 3000);
      }
    } catch (error) {
      console.error('Error saving subcategories:', error);
      showToast('Failed to save subcategories', 'error', 3000);
    }
  }, [selectedSubInterests, setSelectedSubInterests, showToast, triggerMicroBounce]);

  // Check if user can proceed
  const canProceed = useMemo(() => {
    return selectedSubInterests.length >= MIN_SELECTIONS && !isNavigating && !!user;
  }, [selectedSubInterests.length, isNavigating, user]);

  // Handle next step
  const handleNext = useCallback(async () => {
    if (!canProceed || isLoading) return;
    // setIsNavigating(true); // Disabled for UI/UX design

    try {
      // Show success message
      showToast(`Moving to next step with ${selectedSubInterests.length} subcategories!`, 'success', 2000);

      // Navigate to next step
      router.push('/deal-breakers');
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      // setIsNavigating(false); // Disabled for UI/UX design
      showToast('Failed to proceed. Please try again.', 'error', 3000);
    }
  }, [canProceed, isLoading, selectedSubInterests.length, router, showToast]);

  // Don't render anything if not authenticated
  if (!user) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-urbanist text-base text-charcoal/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Hydration-safe selections
  const hydratedSelected = mounted ? selectedSubInterests : [];

  return (
    <OnboardingLayout backHref="/interests" step={2}>
      {/* Offline indicator with safe area support */}
      {!isOnline && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 safe-area-top">
          <div className="bg-orange-100 border border-orange-200 rounded-full px-3 py-1 flex items-center gap-2 animate-fade-in-up delay-100">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="font-urbanist text-xs font-600 text-orange-700">Offline</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center animate-fade-in-up mb-4">
        <div className="inline-block relative mb-2">
          <h2 className="font-urbanist text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-2 text-center leading-snug px-2 tracking-[0.01em]">
            Tell us more!
          </h2>
        </div>
        <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
          Pick at least {MIN_SELECTIONS} across any sections to personalize your experience
        </p>
      </div>

      <OnboardingCard className="animate-fade-in-up delay-200">

              {/* Selection Counter */}
              <div className="text-center mb-4">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3 transition-colors duration-300 ${hydratedSelected.length >= MIN_SELECTIONS
              ? 'bg-sage/10 border border-sage/30'
              : 'bg-sage/10 border border-sage/20'
              }`}>
              <span
                className={`font-urbanist text-sm font-600 ${hydratedSelected.length >= MIN_SELECTIONS ? 'text-sage' : 'text-sage'
                  }`}
                aria-live="polite"
                aria-atomic="true"
              >
                {hydratedSelected.length} of {MIN_SELECTIONS}-{MAX_SELECTIONS} selected
              </span>
              {hydratedSelected.length >= MIN_SELECTIONS && (
                <ion-icon name="checkmark-circle" style={{ color: "hsl(148, 20%, 38%)" }} size="small" />
              )}
            </div>
            <p
              className="font-urbanist text-xs text-charcoal/60"
              aria-live="polite"
            >
              {hydratedSelected.length < MIN_SELECTIONS
                ? `Select ${MIN_SELECTIONS - hydratedSelected.length} more to continue`
                : hydratedSelected.length === MAX_SELECTIONS
                  ? "Perfect! You've selected the maximum"
                  : "Great! You can continue or select more"
              }
            </p>
          </div>

              {/* Sections: subheading + 3-per-row animated pills */}
              <div className="space-y-4 mb-4">
                {Object.entries(groupedSubcategories).map(([interestId, section], sectionIndex) => (
                  <section key={interestId} className="animate-fade-in-up" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                    <h3 className="font-urbanist text-base md:text-lg font-600 text-charcoal mb-3 px-1">
                      {section.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {section.items.map((subcategory, idx) => {
                        const isSelected = hydratedSelected.includes(subcategory.id);
                        const isDisabled = !isSelected && hydratedSelected.length >= MAX_SELECTIONS;

                        return (
                          <button
                            key={subcategory.id}
                            data-subcategory-id={subcategory.id}
                            onClick={() => handleSubcategoryToggle(subcategory.id)}
                            disabled={isDisabled}
                            aria-pressed={isSelected}
                            aria-label={`${subcategory.label}${isSelected ? ' (selected)' : isDisabled ? ' (maximum reached)' : ''}`}
                            className={`
                                  relative w-full py-2 md:py-3 px-2 md:px-3
                                  font-urbanist text-xs font-600 text-center
                                  transition-all duration-200 ease-out
                                  min-h-[44px] touch-target-large
                                  rounded-full
                                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                                  disabled:cursor-not-allowed disabled:opacity-60
                                  mobile-interaction
                                  active:scale-[0.98] md:active:scale-[1.0]
                                  ${animatingIds.has(subcategory.id) ? 'animate-micro-bounce' : ''}

                                  ${isSelected
                                ? "bg-coral border-coral text-white md:shadow-md"
                                : isDisabled
                                  ? "bg-gray-100 border-2 border-gray-200 text-gray-400"
                                  : "bg-off-white border-2 border-sage text-charcoal hover:bg-sage hover:border-sage hover:text-white hover:scale-[1.02]"
                              }
  `}
                            style={{ animationDelay: `${(idx % 3) * 50}ms` }}
                          >
                            <span className="truncate">{subcategory.label}</span>

                            {isSelected && (
                              <div className="absolute top-1 right-1">
                                <ion-icon
                                  name="checkmark-circle"
                                  size="small"
                                  className="md:drop-shadow-sm"
                                />
                              </div>
                            )}
                          </button>

                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-3">
                    {/* Next Button */}
                    <button
                      className={`
                        group block w-full text-white font-urbanist text-sm font-600 py-3 px-6 rounded-full md:shadow-lg transition-all duration-300 relative text-center
                        min-h-[48px] touch-target-large mobile-interaction
                        active:scale-[0.98] md:active:scale-[1.0]
                        ${canProceed
                          ? "bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 md:hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
                          : "bg-off-white text-charcoal/40 cursor-not-allowed"
                        }
                      `}
                  onClick={handleNext}
                  disabled={!canProceed}
                  aria-label={`Continue with ${hydratedSelected.length} selected subcategories`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {(isNavigating || isLoading) && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
                    <ion-icon name="arrow-forward" size="small" />
                  </span>
                      {canProceed && (
                        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </button>

                    {/* Skip Option */}
                    <div className="text-center">
                <Link
                  href="/deal-breakers"
                  className="inline-block font-urbanist text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
                  aria-label="Skip subcategory selection for now"
                >
                  Skip for now
                </Link>
                      <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto">
                        {hydratedSelected.length < MIN_SELECTIONS ? (
                          <span>We'll suggest popular options instead</span>
                        ) : (
                          <span>You can always update your preferences later</span>
                        )}
                      </div>
                    </div>
                  </div>
      </OnboardingCard>
    </OnboardingLayout>
  );
}

export default function SubcategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-urbanist text-base text-charcoal/70">Loading subcategories...</p>
        </div>
      </div>
    }>
      <SubcategoriesContent />
    </Suspense>
  );
}