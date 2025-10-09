"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";
import {
  ShieldCheck,
  Clock,
  Smile,
  BadgeDollarSign,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

interface DealBreaker {
  id: string;
  label: string;
  icon: string; // legacy field; mapped below
}

// ✅ Demo data
const DEMO_DEAL_BREAKERS: DealBreaker[] = [
  { id: "trustworthiness", label: "Trustworthiness", icon: "shield-checkmark" },
  { id: "punctuality", label: "Punctuality", icon: "time" },
  { id: "friendliness", label: "Friendliness", icon: "happy" },
  { id: "value-for-money", label: "Value for Money", icon: "cash-outline" },
];

/** ---------- Minimal entrance animations (subtle & accessible) ---------- */
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
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

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

// Map our ids (or legacy icon strings) to lucide icons
const getIconFor = (idOrIcon: string) => {
  switch (idOrIcon) {
    case "trustworthiness":
    case "shield-checkmark":
      return ShieldCheck;
    case "punctuality":
    case "time":
      return Clock;
    case "friendliness":
    case "happy":
      return Smile;
    case "value-for-money":
    case "cash-outline":
      return BadgeDollarSign;
    default:
      return Star;
  }
};

function DealBreakersContent() {
  const mounted = useMounted();
  const [selected, setSelected] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

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
    }
  }, []);

  const handleToggle = useCallback(
    (id: string) => {
      const isCurrentlySelected = selected.includes(id);
      if (!isCurrentlySelected && selected.length >= MAX_SELECTIONS) {
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
      setIsNavigating(true);
      router.push("/complete");
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      setIsNavigating(false);
    }
  }, [canContinue, router]);

  const hydratedSelected = mounted ? selected : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: entranceStyles }} />
      <OnboardingLayout backHref="/subcategories" step={3}>
        {/* Header */}
        <div className="text-center mb-4 pt-4 sm:pt-6 enter-fade" style={{ animationDelay: "0.1s" }}>
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

        {/* Card */}
        <OnboardingCard
          className="rounded-3xl border border-white/30 shadow-sm bg-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8 enter-fade"
          style={{ animationDelay: "0.16s" }}
        >
          {/* Counter */}
          <div className="text-center mb-4 enter-fade" style={{ animationDelay: "0.2s" }}>
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
                <CheckCircle className="w-4 h-4 text-[hsl(148,20%,38%)]" aria-hidden="true" />
              )}
            </div>
          </div>

          {/* Grid (staggered) */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 mb-4 justify-items-center">
            {DEMO_DEAL_BREAKERS.map((item, idx) => {
              const isSelected = hydratedSelected.includes(item.id);
              const isDisabled =
                !isSelected && hydratedSelected.length >= MAX_SELECTIONS;
              const Icon = getIconFor(item.id || item.icon);
              const delay = Math.min(idx, 8) * 0.06 + 0.24; // gentle stagger

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
                    enter-stagger
                    relative w-full max-w-[220px] sm:max-w-[240px] aspect-square
                    transition-transform duration-500 ease-out
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                    disabled:cursor-not-allowed disabled:opacity-60
                  `}
                  style={{ perspective: "1200px", ...(sf as any), animationDelay: `${delay}s` }}
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
                      <span className="text-base sm:text-lg font-semibold text-center px-5">
                        {item.label}
                      </span>
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
                      <Icon className="w-14 h-14 text-white" aria-hidden="true" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="pt-4 space-y-3 enter-fade" style={{ animationDelay: "0.32s" }}>
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
              style={sf}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
    </>
  );
}

export default function DealBreakersPage() {
  return <DealBreakersContent />;
}
