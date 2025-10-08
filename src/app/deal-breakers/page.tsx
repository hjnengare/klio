"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useToast } from "../contexts/ToastContext"; // 🔕 toast disabled
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";

interface DealBreaker {
  id: string;
  label: string;
  icon: string; // Ionicon name
}

// ✅ Updated demo data
const DEMO_DEAL_BREAKERS: DealBreaker[] = [
  { id: "trustworthiness", label: "Trustworthiness", icon: "shield-checkmark" },
  { id: "punctuality", label: "Punctuality", icon: "time" },
  { id: "friendliness", label: "Friendliness", icon: "happy" },
  { id: "value-for-money", label: "Value for Money", icon: "cash-outline" },
];

/** ---------- Shared font (SF Pro) ---------- */
const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
};

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function DealBreakersContent() {
  const mounted = useMounted();
  const [selected, setSelected] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  // const { showToast } = useToast(); // 🔕 toast disabled

  const MIN_SELECTIONS = 2;
  const MAX_SELECTIONS = 3;

  const saveSelections = useCallback(async (selections: string[]) => {
    try {
      await fetch("/api/user/deal-breakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selections }),
      });
    } catch (error) {
      console.error("Error saving deal-breakers:", error);
      // showToast("Failed to save deal-breakers", "error", 3000); // 🔕
    }
  }, []);

  const handleToggle = useCallback(
    (id: string) => {
      const isCurrentlySelected = selected.includes(id);

      if (!isCurrentlySelected && selected.length >= MAX_SELECTIONS) {
        // showToast(`Maximum ${MAX_SELECTIONS} deal-breakers allowed`, "warning", 2000); // 🔕
        return;
      }

      const newSelection = isCurrentlySelected
        ? selected.filter((x) => x !== id)
        : [...selected, id];

      setSelected(newSelection);
      saveSelections(newSelection);
    },
    [selected, saveSelections]
  );

  const canContinue = useMemo(
    () =>
      selected.length >= MIN_SELECTIONS &&
      selected.length <= MAX_SELECTIONS &&
      !isNavigating,
    [selected.length, isNavigating]
  );

  const handleNext = useCallback(() => {
    if (!canContinue) return;
    try {
      // showToast(`Moving to final step with ${selected.length} deal-breakers!`, "success", 2000); // 🔕
      router.push("/complete");
    } catch (error) {
      console.error("Error proceeding to next step:", error);
    }
  }, [canContinue, selected.length, router]);

  const hydratedSelected = mounted ? selected : [];

  return (
    <OnboardingLayout backHref="/subcategories" step={3}>
      {/* Header */}
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

      <OnboardingCard className="rounded-3xl border border-white/30 shadow-sm bg-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8">
        {/* Counter */}
        <div className="text-center mb-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3 transition-colors duration-300 ${
              hydratedSelected.length >= MIN_SELECTIONS
                ? "bg-sage/10 border border-sage/30"
                : "bg-sage/10 border border-sage/20"
            }`}
          >
            <span className="text-sm font-semibold text-sage" style={sf}>
              {hydratedSelected.length} of {MIN_SELECTIONS}-{MAX_SELECTIONS} selected
            </span>
            {hydratedSelected.length >= MIN_SELECTIONS && (
              <ion-icon name="checkmark-circle" style={{ color: "hsl(148, 20%, 38%)" }} />
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 md:gap-8 mb-4 justify-items-center">
          {DEMO_DEAL_BREAKERS.map((item) => {
            const isSelected = hydratedSelected.includes(item.id);
            const isDisabled =
              !isSelected && hydratedSelected.length >= MAX_SELECTIONS;

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
                  relative w-full max-w-[220px] sm:max-w-[240px] aspect-square
                  transition-transform duration-500 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-60
                `}
                style={{ perspective: "1200px", ...sf }}
              >
                {/* Flipper */}
                <div
                  className="
                    relative w-full h-full rounded-2xl
                    transition-transform duration-500 ease-out will-change-transform
                    [transform-style:preserve-3d]
                    shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                  "
                  style={{
                    transform: isSelected ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT */}
                  <div
                    className="
                      absolute inset-0 rounded-2xl flex flex-col items-center justify-center
                      bg-sage text-white
                      [backface-visibility:hidden]
                    "
                  >
                    <span className="text-base sm:text-lg font-semibold text-center px-5">{item.label}</span>
                  </div>

                  {/* BACK */}
                  <div
                    className="
                      absolute inset-0 rounded-2xl flex items-center justify-center
                      bg-coral text-white
                      [transform:rotateY(180deg)]
                      [backface-visibility:hidden]
                      shadow-[0_10px_40px_rgba(214,116,105,0.22),0_2px_8px_rgba(0,0,0,0.06)]
                    "
                  >
                    <ion-icon name={item.icon} style={{ fontSize: "56px", color: "white" }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="pt-4 space-y-3">
          <button
            className={`
              group block w-full text-white text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 relative text-center
              ${
                canContinue
                  ? "bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)] shadow-[0_10px_40px_rgba(125,155,118,0.25),0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(125,155,118,0.35),0_8px_24px_rgba(0,0,0,0.12)]"
                  : "bg-white/90 text-charcoal/40 cursor-not-allowed"
              }
            `}
            onClick={handleNext}
            disabled={!canContinue}
            style={sf}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
              <ion-icon name="arrow-forward" />
            </span>
          </button>

          {/* Skip Option */}
          <div className="text-center">
            <Link
              href="/complete"
              className="inline-block text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
              style={sf}
            >
              Skip for now
            </Link>
            <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto" style={sf}>
              <span>You can always update your preferences later</span>
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
