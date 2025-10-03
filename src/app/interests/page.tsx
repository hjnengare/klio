"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "../contexts/AuthContext"; // Disabled for UI/UX design
import { useOnboarding } from "../contexts/OnboardingContext";
import { useToast } from "../contexts/ToastContext";
import { usePrefersReducedMotion } from "../utils/hooks/usePrefersReducedMotion";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";



// Reusable Interest Tile Component
interface InterestTileProps {
  id: string;
  name: string;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}

const InterestTile = ({ id, name, selected, disabled, onToggle }: InterestTileProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (disabled && !selected) {
      // Show tooltip feedback for disabled state
      return;
    }

    // Trigger bounce animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 700); // Match animation duration

    onToggle();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled && !selected}
      aria-pressed={selected}
      aria-label={`${name}${selected ? ' (selected)' : disabled ? ' (maximum reached)' : ''}`}
      className={`
        h-12 rounded-6 border-2 font-600 text-sm transition-all duration-200 min-h-[44px]
        focus:outline-none focus:ring-4 focus:ring-sage/25 focus:ring-offset-1
        ${isAnimating ? 'animate-bubbly' : ''}
        ${selected
          ? 'bg-sage border-sage text-white shadow-md'
          : disabled
            ? 'bg-charcoal/5 border-charcoal/20 text-charcoal/40 opacity-50 cursor-not-allowed'
            : 'bg-off-white border-charcoal/20 text-charcoal hover:border-sage hover:bg-sage/5'
        }
      `}
    >
      <span className="truncate px-3">{name}</span>
      {selected && (
        <ion-icon name="checkmark-circle" class="ml-1" style={{ fontSize: '16px' }} />
      )}
    </button>
  );
};


interface Interest {
  id: string;
  name: string;
}

const interestsFallback: Interest[] = [
  { id: "food-drink", name: "Food & Drink" },
  { id: "beauty-wellness", name: "Beauty & Wellness" },
  { id: "home-services", name: "Home & Services" },
  { id: "outdoors-adventure", name: "Outdoors & Adventure" },
  { id: "nightlife-entertainment", name: "Nightlife & Entertainment" },
  { id: "arts-culture", name: "Arts & Culture" },
  { id: "family-pets", name: "Family & Pets" },
  { id: "shopping-lifestyle", name: "Shopping & Lifestyle" },
];

/** Prevent hydration mismatch: true only after first client render */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function InterestsContent() {
  const mounted = useMounted();
  const prefersReduced = usePrefersReducedMotion();

  const [isNavigating, setIsNavigating] = useState(false);
  const [hasPrefetched, setHasPrefetched] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const hasLoadedInterests = useRef(false);
  const offlineQueue = useRef<string[]>([]); // Note: removed unused loading state variables
  const analyticsTracked = useRef({
    impression: false,
    firstSelection: false,
    minimumReached: false
  });

  // const { user } = useAuth(); // Disabled for UI/UX design
  const user = { id: 'dummy-user-id' }; // Dummy user for UI/UX design
  const router = useRouter();
  const { showToast } = useToast();

  // Constants for min/max selection
  const MIN_SELECTIONS = 3;
  const MAX_SELECTIONS = 6;


  // Route protection disabled for UI/UX design
  // useEffect(() => {
  //   if (mounted && !user) {
  //     router.replace('/login?redirect=/interests');
  //   }
  // }, [mounted, user, router]);

  // Authentication check disabled for UI/UX design
  // if (!user) {
  //   return (
  //     <div className="min-h-dvh bg-white/90 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="font-urbanist text-base text-charcoal/70">Checking authentication...</p>
  //       </div>
  //     </div>
  //   );
  // }

  /* -------- Offline detection and queue management -------- */
  useEffect(() => {
    const updateOnlineStatus = () => {
      const wasOffline = !isOnline;
      const nowOnline = navigator.onLine;
      setIsOnline(nowOnline);

      if (wasOffline && nowOnline && offlineQueue.current.length > 0) {
        // Process offline queue when coming back online
        showToast('Back online! Syncing your changes...', 'sage', 2000);
        saveInterests(offlineQueue.current).then(success => {
          if (success) {
            offlineQueue.current = [];
            showToast('All changes synced successfully!', 'sage', 2000);
          }
        });
      } else if (!nowOnline) {
        showToast('Working offline - changes will sync when you\'re back online', 'warning', 4000);
      }
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isOnline, showToast]);

  const {
    interests: availableInterests,
    selectedInterests,
    setSelectedInterests,
    nextStep,
    loadInterests,
    isLoading: onboardingLoading,
    error: onboardingError
  } = useOnboarding();

  /* -------- Load interests on mount (client) -------- */
  useEffect(() => {
    if (!hasLoadedInterests.current && availableInterests.length === 0 && !onboardingLoading) {
      hasLoadedInterests.current = true;
      loadInterests();
    }
  }, [loadInterests, availableInterests.length, onboardingLoading]);

  /* -------- User starts with fresh selection -------- */
  // Note: User always starts with no interests pre-selected
  // This ensures a clean slate for each visit to the interests page

  /* -------- Analytics tracking -------- */
  useEffect(() => {
    if (mounted && !analyticsTracked.current.impression) {
      analyticsTracked.current.impression = true;
      // Track page impression
      console.log('Analytics: Interests page impression');
    }
  }, [mounted]);

  // Animation trigger helper
  const triggerBounce = useCallback((id: string, ms = 700) => {
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
    }, ms); // match .animate-bubbly 0.7s
  }, []);

  // Analytics tracking and prefetching
  useEffect(() => {
    const count = selectedInterests.length;

    if (count === 1 && !analyticsTracked.current.firstSelection) {
      analyticsTracked.current.firstSelection = true;
      console.log('Analytics: First interest selected');
    }

    if (count >= MIN_SELECTIONS && !analyticsTracked.current.minimumReached) {
      analyticsTracked.current.minimumReached = true;
      console.log('Analytics: Minimum selections reached');

      // Performance optimization: prefetch next step
      if (!hasPrefetched) {
        router.prefetch('/subcategories');
        setHasPrefetched(true);
        console.log('Prefetching: /subcategories page prefetched');

        // Warm the route with a lightweight fetch
        fetch('/subcategories', { method: 'GET', cache: 'no-store' }).catch(() => {
          console.log('Route warming failed, but prefetch still works');
        });
      }
    }
  }, [selectedInterests.length, router, hasPrefetched, MIN_SELECTIONS]);

  // Robust save helper with retry logic and offline support
  const saveInterests = useCallback(async (selections: string[], retries = 3): Promise<boolean> => {
    // if (!user) return false; // Disabled for UI/UX design

    // If offline, queue the request
    if (!isOnline) {
      offlineQueue.current = selections;
      console.log('Queued interests for offline sync:', selections);
      return true; // Return true to avoid showing error
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch('/api/user/interests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selections }),
          keepalive: true // survives page navigation
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Interests saved successfully:', result);
          return true;
        }
      } catch (error) {
        console.error(`Save attempt ${attempt} failed:`, error);

        // Check if this is a network error
        const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
        if (isNetworkError) {
          // Queue for offline sync
          offlineQueue.current = selections;
          setIsOnline(false);
          return true; // Don't show error for network issues
        }

        // Exponential backoff: 200ms, 800ms, 1800ms
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 200 * attempt * attempt));
        }
      }
    }
    return false;
  }, [user, isOnline]);

  const handleInterestToggle = useCallback(async (interestId: string) => {
    const isCurrentlySelected = selectedInterests.includes(interestId);

    // Always bounce on click (unless disabled below)
    triggerBounce(interestId);

    // If trying to select but already at max, prevent with feedback
    if (!isCurrentlySelected && selectedInterests.length >= MAX_SELECTIONS) {
      showToast(`Maximum ${MAX_SELECTIONS} interests allowed`, 'warning', 2000);
      // Add visual shake effect to the button
      const button = document.querySelector(`[data-interest-id="${interestId}"]`);
      if (button) {
        button.classList.add('animate-shake');
        setTimeout(() => button.classList.remove('animate-shake'), 600);
      }
      return;
    }

    // Calculate new selection
    const newSelection = isCurrentlySelected
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];

    // Optimistic update
    setSelectedInterests(newSelection);

    // Show contextual feedback
    if (!isCurrentlySelected) {
      if (newSelection.length === MIN_SELECTIONS) {
        showToast('🎉 Great! You can continue now', 'sage', 2000);
      } else if (newSelection.length === MAX_SELECTIONS) {
        showToast('✨ Perfect selection!', 'sage', 2000);
      }
    }

    // Save to API with retry logic
    const saveSuccess = await saveInterests(newSelection);

    if (!saveSuccess) {
      showToast('Failed to save. Your changes are still here - we\'ll retry automatically.', 'error', 4000);
      // Don't revert - keep the optimistic update and let user continue
      // The save will be retried on next interaction or page navigation
    }
  }, [selectedInterests, setSelectedInterests, saveInterests, showToast, triggerBounce]);

  /* -------- Require login for interests selection --------
     User must be authenticated to access this page */
  const REQUIRE_LOGIN = true;

  const canProceed = useMemo(() => {
    const hasMinimumSelection = selectedInterests.length >= MIN_SELECTIONS;
    const hasUser = !!user;
    return hasMinimumSelection && !isNavigating && (REQUIRE_LOGIN ? hasUser : true);
  }, [selectedInterests.length, isNavigating, user, MIN_SELECTIONS]);

  const handleNext = useCallback(async () => {
    if (!canProceed || onboardingLoading) return;
    setIsNavigating(true);

    console.log('Analytics: Next button clicked', { selections: selectedInterests.length });

    try {
      await nextStep(); // your context should navigate
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      setIsNavigating(false);
    }
  }, [canProceed, nextStep, onboardingLoading, selectedInterests.length]);

  const handleSkip = useCallback(async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    console.log('Analytics: Skip button clicked', { selections: selectedInterests.length });

    try {
      // Navigate to subcategories, include any current selections as URL params
      const interestParams = selectedInterests.length > 0
        ? `?interests=${selectedInterests.join(',')}`
        : '';
      router.push(`/subcategories${interestParams}`);
    } catch (error) {
      console.error("Error skipping:", error);
      setIsNavigating(false);
    }
  }, [isNavigating, router, selectedInterests.length]);

  /* -------- Hydration-safe selections --------
     On the server and the very first client render, we render as if nothing is selected
     to avoid className mismatches if your context hydrates from localStorage. */
  const hydratedSelected = mounted ? selectedInterests : [];

  const list = (availableInterests.length > 0 ? availableInterests : interestsFallback);

  return (
    <OnboardingLayout backHref="/register" step={1}>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
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
            What interests you?
          </h2>
        </div>
        <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
          Pick a few things you love and let&apos;s personalize your experience!
        </p>
      </div>

      <OnboardingCard className="animate-fade-in-up delay-200">

              {/* Error */}
              {onboardingError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-4">
                  <p className="font-urbanist text-sm font-600 text-red-600">{onboardingError}</p>
                </div>
              )}

              {/* Selection Counter and Instructions */}
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

              {/* Interests grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 overflow-visible">
                {list.map((interest) => {
                  const isSelected = hydratedSelected.includes(interest.id);
                  const isDisabled = !isSelected && hydratedSelected.length >= MAX_SELECTIONS;

                  return (
                    <button
                      key={interest.id}
                      data-interest-id={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      aria-label={`${interest.name}${isSelected ? ' (selected)' : isDisabled ? ' (maximum reached)' : ''}`}
                      className={`
                            relative z-30 w-[85%] aspect-square rounded-full border-2 transition-all duration-300 ease-out mx-auto min-h-[44px] min-w-[44px] touch-target-large
                            ${isSelected
                          ? "bg-coral border-coral text-white shadow-lg scale-105 interest-selected"
                          : isDisabled
                            ? "bg-charcoal/5 border-charcoal/20 text-charcoal/40 cursor-not-allowed opacity-60"
                            : "bg-sage border-sage text-white hover:bg-sage/90 hover:scale-105 active:scale-95"
                        }
                            focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2
                            disabled:focus:ring-charcoal/20
                          `}
                      // Prevent hydration warnings for class differences if any linger
                      suppressHydrationWarning
                    >
                      {/* Animator wrapper gets the bounce so Tailwind scale on the button doesn't override transform */}
                      <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${animatingIds.has(interest.id) ? 'animate-bubbly' : ''}`}>
                        <span className="font-urbanist text-7 md:text-6 font-600 text-center leading-tight break-words hyphens-auto">
                          {interest.name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <ion-icon name="checkmark-circle" size="small" style={{ color: "white" }} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-4 mb-safe-interaction">
                {/* Next Button */}
                <button
                  className={`
                        group block w-full text-white font-urbanist text-sm md:text-base font-600 py-3.5 md:py-4 px-6 md:px-8 rounded-full shadow-lg transition-all duration-300 relative text-center touch-target-large mobile-button-spacing
                        ${canProceed
                      ? "bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
                      : "bg-charcoal/10 text-charcoal/40 cursor-not-allowed"
                    }
                      `}
                  onClick={handleNext}
                  disabled={!canProceed}
                  aria-label={`Continue with ${hydratedSelected.length} selected interests`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 rounded-full">
                    {(isNavigating || onboardingLoading) && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
                    <ion-icon name="arrow-forward" size="small" />
                  </span>
                  {canProceed && (
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>

                {/* Skip Button with Nudge */}
                <div className="text-center">
                  <Link
                    href="/subcategories"
                    className="inline-block font-urbanist text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
                    aria-label="Skip interest selection for now"
                  >
                    Skip for now
                  </Link>
                  <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto">
                    {hydratedSelected.length < MIN_SELECTIONS ? (
                      <span>We&apos;ll suggest popular local businesses instead</span>
                    ) : (
                      <span>You can always update your interests later in settings</span>
                    )}
                  </div>
                </div>
              </div>
      </OnboardingCard>
    </OnboardingLayout>
  );
}

export default function InterestsPage() {
  return <InterestsContent />;
}
