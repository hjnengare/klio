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
  { id: "reviews", label: "Reviews", icon: "star" },
];

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

function DealBreakersContent() {
  const mounted = useMounted();
  const [selected, setSelected] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false); // Disabled for UI/UX design
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();
  // const { user } = useAuth(); // Disabled for UI/UX design
  const user = { id: "dummy-user-id" }; // Dummy user for UI/UX design
  const { showToast } = useToast();

  // Constants for min/max selection
  const MIN_SELECTIONS = 2;
  const MAX_SELECTIONS = 3;

  // Animation trigger helper
  const triggerMicroBounce = useCallback((id: string) => {
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
    }, 300);
  }, []);

  // Save selections to API
  const saveSelections = useCallback(
    async (selections: string[]) => {
      try {
        const response = await fetch("/api/user/deal-breakers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selections }),
        });

        if (!response.ok) {
          showToast("Failed to save deal-breakers", "error", 3000);
        }
      } catch (error) {
        console.error("Error saving deal-breakers:", error);
        showToast("Failed to save deal-breakers", "error", 3000);
      }
    },
    [showToast]
  );

  // Contextual feedback (after user interaction only)
  useEffect(() => {
    if (hasInteracted && selected.length === MIN_SELECTIONS) {
      showToast("🎉 Great! You can continue now", "sage", 2000);
    }
  }, [selected.length, showToast, hasInteracted]);

  const handleToggle = useCallback(
    (id: string) => {
      const isCurrentlySelected = selected.includes(id);

      // Mark interaction for toasts
      setHasInteracted(true);

      // Micro-bounce
      triggerMicroBounce(id);

      // Max guard
      if (!isCurrentlySelected && selected.length >= MAX_SELECTIONS) {
        showToast(`Maximum ${MAX_SELECTIONS} deal-breakers allowed`, "warning", 2000);
        return;
      }

      // Compute & set
      const newSelection = isCurrentlySelected
        ? selected.filter((x) => x !== id)
        : [...selected, id];

      setSelected(newSelection);

      // Persist
      saveSelections(newSelection);
    },
    [selected, saveSelections, showToast, triggerMicroBounce]
  );

  const canContinue = useMemo(
    () =>
      selected.length >= MIN_SELECTIONS &&
      selected.length <= MAX_SELECTIONS &&
      !isNavigating &&
      !!user,
    [selected.length, isNavigating, user]
  );

  const handleNext = useCallback(() => {
    if (!canContinue) return;
    // setIsNavigating(true); // (kept disabled for UI/UX)
    try {
      showToast(`Moving to final step with ${selected.length} deal-breakers!`, "success", 2000);
      router.push("/complete");
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      // setIsNavigating(false);
      showToast("Failed to proceed. Please try again.", "error", 3000);
    }
  }, [canContinue, selected.length, router, showToast]);

  // Auth guard (unchanged)
  if (!user) {
    return (
      <div className="min-h-dvh bg-white/90 flex items-center justify-center">
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
      {/* Header — SF Pro + same rhythm as Register/Interests */}
      <div className="text-center mb-4 pt-4 sm:pt-6">
        <div className="inline-block relative mb-2">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 text-center leading-snug px-2 tracking-tight"
            style={sf}
          >
            Your deal-breakers
          </h2>
        </div>
        <p
          className="text-sm md:text-base font-normal text-charcoal/70 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto"
          style={sf}
        >
          Pick 2–3 that matter most to you
        </p>
      </div>

      {/* Card — match the premium gradient/border/shadow */}
      <OnboardingCard className="rounded-3xl border border-white/30 shadow-sm bg-off-white  px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8">
        {/* Selection Counter */}
        <div className="text-center mb-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3 transition-colors duration-300 ${
              hydratedSelected.length >= MIN_SELECTIONS
                ? "bg-sage/10 border border-sage/30"
                : "bg-sage/10 border border-sage/20"
            }`}
          >
            <span className="text-sm font-semibold text-sage" style={sf} aria-live="polite" aria-atomic="true">
              {hydratedSelected.length} of {MIN_SELECTIONS}-{MAX_SELECTIONS} selected
            </span>
            {hydratedSelected.length >= MIN_SELECTIONS && (
              <ion-icon name="checkmark-circle" style={{ color: "hsl(148, 20%, 38%)" }} />
            )}
          </div>
          <p className="text-xs text-charcoal/60" style={sf} aria-live="polite">
            {hydratedSelected.length < MIN_SELECTIONS
              ? `Select ${MIN_SELECTIONS - hydratedSelected.length} more to continue`
              : hydratedSelected.length === MAX_SELECTIONS
              ? "Perfect! You've selected the maximum"
              : "Great! You can continue or select more"}
          </p>
        </div>

        {/* Deal Breakers Grid — same soft depth and interaction tone */}
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
                aria-label={`${item.label} deal-breaker${
                  isSelected ? " (selected)" : isDisabled ? " (maximum reached)" : ""
                }`}
                className={`
                  relative w-full max-w-[180px] sm:max-w-[200px] aspect-square transition-all duration-500 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-60
                  ${animatingIds.has(item.id) ? "animate-micro-bounce" : ""}
                  animate-fade-in-up delay-${index * 100}
                `}
                style={{ perspective: "1200px", ...sf }}
                suppressHydrationWarning
              >
                {/* 3D flipper */}
                <div
                  className="relative w-full h-full transition-transform duration-500 ease-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isSelected ? "rotateY(180deg)" : "",
                  }}
                >
                  {/* FRONT (unselected) — SAGE */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-sage text-white shadow-[0_8px_24px_rgba(125,155,118,0.16)] rounded-2xl"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-sm sm:text-base font-semibold text-center px-4">{item.label}</span>
                  </div>

                  {/* BACK (selected) — CORAL */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-coral text-white shadow-[0_10px_40px_rgba(214,116,105,0.22),0_2px_8px_rgba(0,0,0,0.06)] rounded-2xl"
                    style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                  >
                    <ion-icon name={item.icon} style={{ fontSize: "48px", color: "white" }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions — CTA mirrors the Register/Interests feel */}
        <div className="pt-4 space-y-3">
          <button
            className={`
              group block w-full text-white text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 relative text-center
              ${
                canContinue
                  ? "bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)] shadow-[0_10px_40px_rgba(125,155,118,0.25),0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(125,155,118,0.35),0_8px_24px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
                  : "bg-white/90 text-charcoal/40 cursor-not-allowed"
              }
            `}
            onClick={handleNext}
            disabled={!canContinue}
            aria-label={`Continue with ${hydratedSelected.length} selected deal-breakers`}
            style={sf}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isNavigating && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
              <ion-icon name="arrow-forward" />
            </span>
            {canContinue && (
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>

          {/* Skip Option (kept) */}
          <div className="text-center">
            <Link
              href="/complete"
              className="inline-block text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
              aria-label="Skip deal-breakers for now"
              style={sf}
            >
              Skip for now
            </Link>
            <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto" style={sf}>
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
