"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "../contexts/AuthContext"; // Unused
import { useOnboarding } from "../contexts/OnboardingContext";
import { useToast } from "../contexts/ToastContext";
import { usePrefersReducedMotion } from "../utils/hooks/usePrefersReducedMotion";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import EmailVerificationGuard from "../components/Auth/EmailVerificationGuard";
import EmailVerificationBanner from "../components/Auth/EmailVerificationBanner";
import { CheckCircle, ArrowRight } from "lucide-react"; // ✅ replace ion-icons

/** ---------- Local, minimal entrance animations (subtle & accessible) ---------- */
const entranceStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .enter-fade {
    opacity: 0;
    animation: fadeSlideIn 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  /* Stagger helper (inline style sets animation-delay) */
  .enter-stagger { opacity: 0; animation: fadeSlideIn 0.6s ease-out forwards; }

  /* Tiny haptic feedback you referenced earlier */
  @keyframes bubbly {
    0% { transform: translateZ(0) scale(1); }
    40% { transform: translateZ(0) scale(1.05); }
    100% { transform: translateZ(0) scale(1); }
  }
  .animate-bubbly { animation: bubbly 0.35s ease-out; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(2px); }
  }
  .animate-shake { animation: shake 0.35s ease-in-out; }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

/** ---------- Shared font (SF Pro) ---------- */
const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
};

/** Prevent hydration mismatch: true only after first client render */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

interface Interest {
  id: string;
  name: string;
}

// Hardcoded interests - no need for API calls
const INTERESTS: Interest[] = [
  { id: 'food-drink', name: 'Food & Drink' },
  { id: 'beauty-wellness', name: 'Beauty & Wellness' },
  { id: 'professional-services', name: 'Professional Services' },
  { id: 'outdoors-adventure', name: 'Outdoors & Adventure' },
  { id: 'experiences-entertainment', name: 'Entertainment & Experiences' },
  { id: 'arts-culture', name: 'Arts & Culture' },
  { id: 'family-pets', name: 'Family & Pets' },
  { id: 'shopping-lifestyle', name: 'Shopping & Lifestyle' },
];

function InterestsContent() {
  const mounted = useMounted();
  // const prefersReduced = usePrefersReducedMotion(); // Unused

  const [isNavigating, setIsNavigating] = useState(false);
  const [hasPrefetched, setHasPrefetched] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  // Removed hasLoadedInterests - no longer needed with hardcoded interests
  const offlineQueue = useRef<string[]>([]);
  const analyticsTracked = useRef({
    impression: false,
    firstSelection: false,
    minimumReached: false,
  });

  // const { user } = useAuth(); // Disabled for UI/UX design
  const user = { id: "dummy-user-id" }; // Dummy user for UI/UX design
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, showToastOnce } = useToast();

  // Handle verification success from URL flag (backup for direct access)
  useEffect(() => {
    if (searchParams.get('verified') === '1') {
      showToastOnce('email-verified-v1', '🎉 You\'re verified! Your account is now secured and ready.', 'success', 4000);
      
      // Clean the URL flag so refreshes don't retrigger
      const url = new URL(window.location.href);
      url.searchParams.delete('verified');
      router.replace(url.pathname + (url.search ? '?' + url.searchParams.toString() : ''), { scroll: false });
    }
  }, [searchParams, router, showToastOnce]);

  const MIN_SELECTIONS = 3;
  const MAX_SELECTIONS = 6;

  const {
    selectedInterests,
    setSelectedInterests,
    nextStep,
    isLoading: onboardingLoading,
    error: onboardingError,
  } = useOnboarding();

  /** Save interests (unchanged behavior) */
  const saveInterests = useCallback(
    async (selections: string[], retries = 3): Promise<boolean> => {
      if (!isOnline) {
        offlineQueue.current = selections;
        console.log("Queued interests for offline sync:", selections);
        return true;
      }

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch("/api/user/interests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selections }),
            keepalive: true,
          });

          if (response.ok) {
            const result = await response.json();
            console.log("Interests saved successfully:", result);
            return true;
          }
        } catch (error) {
          console.error(`Save attempt ${attempt} failed:`, error);

          const isNetworkError =
            error instanceof TypeError && error.message.includes("fetch");
          if (isNetworkError) {
            offlineQueue.current = selections;
            setIsOnline(false);
            return true;
          }

          if (attempt < retries) {
            await new Promise((resolve) =>
              setTimeout(resolve, 200 * attempt * attempt)
            );
          }
        }
      }
      return false;
    },
    [isOnline]
  );

  /** Online/offline status — same behavior, softer UI */
  useEffect(() => {
    const updateOnlineStatus = () => {
      const wasOffline = !isOnline;
      const nowOnline = navigator.onLine;
      setIsOnline(nowOnline);

      if (wasOffline && nowOnline && offlineQueue.current.length > 0) {
        showToast("Back online! Syncing your changes...", "sage", 2000);
        saveInterests(offlineQueue.current).then((success) => {
          if (success) {
            offlineQueue.current = [];
            showToast("All changes synced successfully!", "sage", 2000);
          }
        });
      } else if (!nowOnline) {
        showToast(
          "Working offline — changes will sync when you're back online",
          "warning",
          4000
        );
      }
    };

    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [isOnline, showToast, saveInterests]);

  // No need to load interests - they're hardcoded

  /** Analytics (unchanged) */
  useEffect(() => {
    if (mounted && !analyticsTracked.current.impression) {
      analyticsTracked.current.impression = true;
      console.log("Analytics: Interests page impression");
    }
  }, [mounted]);

  /** Little bounce helper */
  const triggerBounce = useCallback((id: string, ms = 700) => {
    setAnimatingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setAnimatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, ms);
  }, []);

  /** Prefetch next step once minimum reached (unchanged) */
  useEffect(() => {
    const count = selectedInterests.length;

    if (count === 1 && !analyticsTracked.current.firstSelection) {
      analyticsTracked.current.firstSelection = true;
      console.log("Analytics: First interest selected");
    }

    if (count >= MIN_SELECTIONS && !analyticsTracked.current.minimumReached) {
      analyticsTracked.current.minimumReached = true;
      console.log("Analytics: Minimum selections reached");

      if (!hasPrefetched) {
        router.prefetch("/subcategories");
        setHasPrefetched(true);
        console.log("Prefetching: /subcategories page prefetched");

        fetch("/subcategories", {
          method: "GET",
          cache: "no-store",
        }).catch(() => {
          console.log("Route warming failed, but prefetch still works");
        });
      }
    }
  }, [selectedInterests.length, router, hasPrefetched]);

  /** Toggle with same rules, premium feedback */
  const handleInterestToggle = useCallback(
    async (interestId: string) => {
      const isCurrentlySelected = selectedInterests.includes(interestId);
      triggerBounce(interestId);

      if (!isCurrentlySelected && selectedInterests.length >= MAX_SELECTIONS) {
        showToast(`Maximum ${MAX_SELECTIONS} interests allowed`, "warning", 2000);
        const button = document.querySelector(
          `[data-interest-id="${interestId}"]`
        );
        if (button) {
          button.classList.add("animate-shake");
          setTimeout(() => button.classList.remove("animate-shake"), 600);
        }
        return;
      }

      const newSelection = isCurrentlySelected
        ? selectedInterests.filter((id) => id !== interestId)
        : [...selectedInterests, interestId];

      setSelectedInterests(newSelection);

      if (!isCurrentlySelected) {
        if (newSelection.length === MIN_SELECTIONS) {
          showToast("🎉 Great! You can continue now", "sage", 2000);
        } else if (newSelection.length === MAX_SELECTIONS) {
          showToast("✨ Perfect selection!", "sage", 2000);
        }
      }

      const saveSuccess = await saveInterests(newSelection);

      if (!saveSuccess) {
        showToast(
          "Failed to save. Your changes are still here — we’ll retry automatically.",
          "error",
          4000
        );
      }
    },
    [selectedInterests, setSelectedInterests, saveInterests, showToast, triggerBounce]
  );

  const REQUIRE_LOGIN = true;

  const canProceed = useMemo(() => {
    const hasMinimumSelection = selectedInterests.length >= MIN_SELECTIONS;
    const hasUser = !!user;
    return hasMinimumSelection && !isNavigating && (REQUIRE_LOGIN ? hasUser : true);
  }, [selectedInterests.length, isNavigating, user, REQUIRE_LOGIN]);

  const handleNext = useCallback(async () => {
    if (!canProceed || onboardingLoading) return;
    setIsNavigating(true);

    console.log("Analytics: Next button clicked", {
      selections: selectedInterests.length,
    });

    try {
      await nextStep();
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      setIsNavigating(false);
    }
  }, [canProceed, nextStep, onboardingLoading, selectedInterests.length]);

  const handleSkip = useCallback(async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    console.log("Analytics: Skip button clicked", {
      selections: selectedInterests.length,
    });

    try {
      const interestParams =
        selectedInterests.length > 0
          ? `?interests=${selectedInterests.join(",")}`
          : "";
      router.push(`/subcategories${interestParams}`);
    } catch (error) {
      console.error("Error skipping:", error);
      setIsNavigating(false);
    }
  }, [isNavigating, router, selectedInterests]);

  const hydratedSelected = mounted ? selectedInterests : [];
  const list = INTERESTS; // Use hardcoded interests directly

  return (
    <EmailVerificationGuard>
      {/* Minimal animation styles */}
      <style dangerouslySetInnerHTML={{ __html: entranceStyles }} />

          <OnboardingLayout
            backHref="/register"
            step={1}
          >
            {/* Email Verification Banner */}
            <EmailVerificationBanner className="mb-4" />
        {/* Offline indicator */}
        {!isOnline && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 enter-fade" style={{ animationDelay: "0.1s" }}>
            <div
              className="bg-orange-50/90 border border-orange-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm"
              style={sf}
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-orange-700">Offline</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-4 pt-4 sm:pt-6 enter-fade" style={{ animationDelay: "0.12s" }}>
          <div className="inline-block relative mb-2">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 text-center leading-snug px-2 tracking-tight"
              style={sf}
            >
              What interests you?
            </h2>
          </div>
          <p
            className="text-sm md:text-base font-normal text-charcoal/70 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto"
            style={sf}
          >
            Pick a few things you love and let&apos;s personalise your experience!
          </p>
        </div>

        {/* Card */}
        <OnboardingCard className="rounded-3xl border border-white/30 shadow-sm bg-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8 enter-fade">
          {/* Error */}
          {onboardingError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-4 enter-fade" style={{ animationDelay: "0.22s" }}>
              <p className="text-sm font-semibold text-red-600" style={sf}>
                {onboardingError}
              </p>
            </div>
          )}

          {/* Counter + helper */}
          <div className="text-center mb-4 enter-fade" style={{ animationDelay: "0.22s" }}>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3 transition-colors duration-300 ${
                hydratedSelected.length >= MIN_SELECTIONS
                  ? "bg-sage/10 border border-sage/30"
                  : "bg-sage/10 border border-sage/20"
              }`}
            >
              <span
                className="text-sm font-semibold text-sage"
                style={sf}
                aria-live="polite"
                aria-atomic="true"
              >
                {hydratedSelected.length} of {MIN_SELECTIONS}-{MAX_SELECTIONS} selected
              </span>
              {hydratedSelected.length >= MIN_SELECTIONS && (
                <CheckCircle className="w-4 h-4 text-[hsl(148,20%,38%)]" aria-hidden="true" />
              )}
            </div>
            <p className="text-xs text-charcoal/60" style={sf} aria-live="polite">
              {hydratedSelected.length < MIN_SELECTIONS
                ? `Select ${MIN_SELECTIONS - hydratedSelected.length} or more to continue`
                : hydratedSelected.length === MAX_SELECTIONS
                ? "Perfect! You've selected the maximum"
                : "Great! You can continue or select more"}
            </p>
          </div>

          {/* Interests grid (staggered) */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 overflow-visible">
            {list.map((interest, idx) => {
              const isSelected = hydratedSelected.includes(interest.id);
              const isDisabled = !isSelected && hydratedSelected.length >= MAX_SELECTIONS;
              // gentle stagger up to ~0.5s
              const delay = Math.min(idx, 8) * 0.06 + 0.24;

              return (
                <button
                  key={interest.id}
                  data-interest-id={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  aria-label={`${interest.name}${
                    isSelected ? " (selected)" : isDisabled ? " (maximum reached)" : ""
                  }`}
                  className={`
                    enter-stagger
                    relative z-30 w-[85%] aspect-square rounded-full transition-all duration-300 ease-out mx-auto min-h-[44px] min-w-[44px] touch-target-large
                    focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2
                    ${
                      isSelected
                        ? "bg-coral text-white shadow-[0_10px_40px_rgba(214,116,105,0.22),0_2px_8px_rgba(0,0,0,0.06)] scale-105"
                        : isDisabled
                        ? "bg-charcoal/5 text-charcoal/40 cursor-not-allowed opacity-60"
                        : "bg-sage text-white hover:bg-sage/90 hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(125,155,118,0.16)]"
                    }
                  `}
                  style={{ ...sf, animationDelay: `${delay}s` }}
                  suppressHydrationWarning
                >
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${
                      animatingIds.has(interest.id) ? "animate-bubbly" : ""
                    }`}
                  >
                    <span className="text-[15px] md:text-base font-semibold text-center leading-tight break-words hyphens-auto">
                      {interest.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-4 enter-fade" style={{ animationDelay: "0.3s" }}>
            {/* Continue */}
            <button
              className={`
                group block w-full text-white text-sm md:text-base font-semibold py-3.5 md:py-4 px-6 md:px-8 rounded-full transition-all duration-300 relative text-center touch-target-large
                ${
                  canProceed
                    ? "bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)] shadow-[0_10px_40px_rgba(125,155,118,0.25),0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(125,155,118,0.35),0_8px_24px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
                    : "bg-charcoal/10 text-charcoal/40 cursor-not-allowed"
                }
              `}
              onClick={handleNext}
              disabled={!canProceed}
              aria-label={`Continue with ${hydratedSelected.length} selected interests`}
              style={sf}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 rounded-full">
                {(isNavigating || onboardingLoading) && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
              {canProceed && (
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>

            {/* Skip */}
            <div className="text-center">
              <Link
                href="/subcategories"
                className="inline-block text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
                aria-label="Skip interest selection for now"
                style={sf}
                onClick={(e) => {
                  e.preventDefault();
                  handleSkip();
                }}
              >
                Skip for now
              </Link>
              <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto" style={sf}>
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
    </EmailVerificationGuard>
  );
}

export default function InterestsPage() {
  return (
    <ProtectedRoute requiresAuth={true}>
      <InterestsContent />
    </ProtectedRoute>
  );
}
