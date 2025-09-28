"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "../contexts/AuthContext"; // Disabled for UI/UX design
import { useToast } from "../contexts/ToastContext";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";


interface DealBreaker {
  id: string;
  label: string;
  icon: string; // Ionicon name
}

// Demo data for deal-breakers based on wireframe
const DEMO_DEAL_BREAKERS: DealBreaker[] = [
  { id: "security", label: "Security", icon: "shield-checkmark" },
  { id: "time", label: "Time", icon: "time" },
  { id: "experience", label: "Experience", icon: "happy" },
  { id: "reviews", label: "Reviews", icon: "star" }
];

/** Prevent hydration mismatch: true only after first client render */
function useMounted() {3
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function DealBreakersContent() {
  const mounted = useMounted();
  const [selected, setSelected] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false); // Disabled for UI/UX design
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();
  // const { user } = useAuth(); // Disabled for UI/UX design
  const user = { id: 'dummy-user-id' }; // Dummy user for UI/UX design
  const { showToast } = useToast();

  // Constants for min/max selection
  const MIN_SELECTIONS = 2;
  const MAX_SELECTIONS = 3;

  // Route protection disabled for UI/UX design
  // useEffect(() => {
  //   if (mounted && !user) {
  //     router.replace('/login?redirect=/deal-breakers');
  //   }
  // }, [mounted, user, router]);

  // Animation trigger helper
  const triggerMicroBounce = useCallback((id: string) => {
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

  // Save selections to API
  const saveSelections = useCallback(async (selections: string[]) => {
    try {
      const response = await fetch('/api/user/deal-breakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections })
      });

      if (!response.ok) {
        showToast('Failed to save deal-breakers', 'error', 3000);
      }
    } catch (error) {
      console.error('Error saving deal-breakers:', error);
      showToast('Failed to save deal-breakers', 'error', 3000);
    }
  }, [showToast]);

  // Effect to show contextual feedback when selection changes (only after user interaction)
  useEffect(() => {
    if (hasInteracted && selected.length === MIN_SELECTIONS) {
      showToast('🎉 Great! You can continue now', 'sage', 2000);
    }
  }, [selected.length, showToast, hasInteracted, MIN_SELECTIONS]);

  const handleToggle = useCallback((id: string) => {
    const isCurrentlySelected = selected.includes(id);

    // Mark that user has interacted
    setHasInteracted(true);

    // Trigger micro-bounce animation
    triggerMicroBounce(id);

    // If trying to select but already at max, prevent with feedback
    if (!isCurrentlySelected && selected.length >= MAX_SELECTIONS) {
      showToast(`Maximum ${MAX_SELECTIONS} deal-breakers allowed`, 'warning', 2000);
      return;
    }

    // Calculate new selection first
    const newSelection = isCurrentlySelected
      ? selected.filter(x => x !== id)
      : [...selected, id];

    // Update state
    setSelected(newSelection);

    // Save to API
    saveSelections(newSelection);
  }, [selected, saveSelections, showToast, triggerMicroBounce, MAX_SELECTIONS, MIN_SELECTIONS]);

  const canContinue = useMemo(() =>
    selected.length >= MIN_SELECTIONS && selected.length <= MAX_SELECTIONS && !isNavigating && !!user,
    [selected.length, isNavigating, user, MIN_SELECTIONS, MAX_SELECTIONS]
  );

  const handleNext = useCallback(() => {
    if (!canContinue) return;
    // setIsNavigating(true); // Disabled for UI/UX design

    try {
      showToast(`Moving to final step with ${selected.length} deal-breakers!`, 'success', 2000);
      router.push("/complete");
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      // setIsNavigating(false); // Disabled for UI/UX design
      showToast('Failed to proceed. Please try again.', 'error', 3000);
    }
  }, [canContinue, selected.length, router, showToast]);

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
  const hydratedSelected = mounted ? selected : [];

  return (
    <OnboardingLayout backHref="/subcategories" step={3}>

      {/* Header */}
      <div className="text-center animate-fade-in-up mb-4">
        <div className="inline-block relative mb-2">
          <h2 className="font-urbanist text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-2 text-center leading-snug px-2 tracking-[0.01em]">
            Your deal-breakers
          </h2>
        </div>
        <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
          Pick 2–3 that matter most to you
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

              {/* Deal Breakers Grid */}
              <div className="grid grid-cols-2 gap-6 md:gap-8 mb-4 justify-items-center">
                {DEMO_DEAL_BREAKERS.map((item, index) => {
                  const isSelected = hydratedSelected.includes(item.id);
                  const isDisabled = !isSelected && hydratedSelected.length >= MAX_SELECTIONS;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggle(item.id)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      aria-label={`${item.label} deal-breaker${isSelected ? ' (selected)' : isDisabled ? ' (maximum reached)' : ''}`}
                      className={`
                        relative w-full max-w-[180px] sm:max-w-[200px] aspect-square transition-all duration-500 ease-out
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                        disabled:cursor-not-allowed disabled:opacity-60
                        ${animatingIds.has(item.id) ? 'animate-micro-bounce' : ''}
                        animate-fade-in-up delay-${index * 100}
                      `}
                      style={{ perspective: "1200px" }}
                      suppressHydrationWarning
                    >
                      {/* Flipper */}
                      <div
                        className="relative w-full h-full transition-transform duration-500 ease-out"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isSelected ? "rotateY(180deg)" : "",
                        }}
                      >
                        {/* FRONT (unselected) — SAGE rectangle with label */}
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center bg-sage text-white font-urbanist shadow-lg"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <span className="text-sm sm:text-base font-600 text-center px-4">{item.label}</span>
                        </div>

                        {/* BACK (selected) — CORAL rectangle with icon */}
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-coral shadow-lg"
                          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                        >
                          <ion-icon
                            name={item.icon}
                            style={{ fontSize: "48px", color: "white" }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                {/* Next Button */}
                <button
                  className={`
                    group block w-full text-white font-urbanist text-sm font-600 py-3 px-6 rounded-full shadow-lg transition-all duration-300 relative text-center
                    ${canContinue
                      ? "bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
                      : "bg-off-white text-charcoal/40 cursor-not-allowed"
                    }
                  `}
                  onClick={handleNext}
                  disabled={!canContinue}
                  aria-label={`Continue with ${hydratedSelected.length} selected deal-breakers`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isNavigating && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
                    <ion-icon name="arrow-forward" size="small" />
                  </span>
                  {canContinue && (
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>

                {/* Skip Option */}
                <div className="text-center">
                  <Link
                    href="/complete"
                    className="inline-block font-urbanist text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
                    aria-label="Skip deal-breakers for now"
                  >
                    Skip for now
                  </Link>
                  <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto">
                    {hydratedSelected.length < MIN_SELECTIONS ? (
                      <span>You can set deal-breakers later in your profile</span>
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

export default function DealBreakersPage() {
  return <DealBreakersContent />;
}