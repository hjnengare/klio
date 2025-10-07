"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Smile, Sparkles, Check, ArrowRight, CheckCircle } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext"; // Disabled for UI/UX design
import { useReducedMotion } from "../utils/useReducedMotion";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";

// Additional CSS animations for complete page
const completeStyles = `
  @keyframes float {
    0% { transform: translateY(0) scale(.95); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translateY(-40%) scale(1); }
    90% { opacity: 1; }
    100% { transform: translateY(-90%) scale(.95); opacity: 0; }
  }
  .float-anim { animation: float 4s ease-in-out infinite; }
  .float-anim.delay-400 { animation-delay: .4s; }
  .float-anim.delay-800 { animation-delay: .8s; }

  @media (prefers-reduced-motion: reduce) {
    .float-anim { animation: none !important; }
  }
`;

/** ---------- Shared font (SF Pro) ---------- */
const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
} as const;

export default function CompletePage() {
  // const { updateUser, user } = useAuth(); // Disabled for UI/UX design
  const user = { id: "dummy-user-id" }; // Dummy user for UI/UX design
  const updateUser = () => {}; // Dummy function for UI/UX design
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Rain confetti effect on mount (respect reduced motion)
    if (!reducedMotion) {
      let cancelled = false;
      const duration = 2 * 1000; // 2 seconds
      const end = Date.now() + duration;

      (function frame() {
        if (cancelled) return;

        // left side
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
        });
        // right side
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      return () => {
        cancelled = true;
      };
    }
  }, [updateUser, reducedMotion]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: completeStyles }} />
      <OnboardingLayout
        step={4}
        showProgress={false}
        // Symmetry with other onboarding screens
        className="min-h-[100dvh] bg-gradient-to-b from-[#faeee8] to-[#f7e3db] flex flex-col"
      >
        <div
          className="text-center animate-fade-in-up flex-1 flex flex-col justify-center px-4"
          style={
            {
              // CSS variables for consistent design tokens
              "--coral": "hsl(16, 100%, 66%)",
              "--sage": "hsl(148, 20%, 38%)",
              "--charcoal": "hsl(0, 0%, 25%)",
              "--off-white": "hsl(0, 0%, 98%)",
              ...sf,
            } as React.CSSProperties
          }
        >
          {/* Headline & subhead */}
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-4 tracking-tight leading-snug"
            aria-live="polite"
          >
            You&apos;re all set!
          </h1>
          <p className="text-base md:text-lg font-normal text-charcoal/70 mb-4 leading-relaxed">
            Time to discover what&apos;s out there.
          </p>

          {/* Small moving graphic */}
          <div className="relative mx-auto mb-4 h-28 w-full max-w-[420px]" aria-hidden="true">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute bottom-0 left-[15%] w-14 h-14 rounded-full bg-white  /90 border-2 border-coral flex items-center justify-center float-anim shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <Smile className="w-5 h-5 text-charcoal" aria-hidden="true" />
              </div>
              <div className="absolute bottom-0 left-[45%] w-14 h-14 rounded-full bg-white  /90 border-2 border-sage flex items-center justify-center float-anim delay-400 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <Sparkles className="w-5 h-5 text-charcoal" aria-hidden="true" />
              </div>
              <div className="absolute bottom-0 left-[75%] w-14 h-14 rounded-full bg-white  /90 border-2 border-coral flex items-center justify-center float-anim delay-800 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <Check className="w-5 h-5 text-charcoal" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* CTA — premium gradient + soft lift to match other screens */}
          <div>
            <Link
              href="/home"
              data-testid="onboarding-complete-cta"
              aria-label="Go to Home"
              className="group inline-flex items-center justify-center w-full sm:w-auto text-white text-sm font-semibold py-4 px-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
              style={sf}
            >
              <span
                className="
                  relative z-10
                  bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)]
                  shadow-[0_10px_40px_rgba(125,155,118,0.25),0_4px_12px_rgba(0,0,0,0.08)]
                  px-6 py-3 rounded-full
                  group-hover:-translate-y-0.5
                  group-hover:shadow-[0_20px_60px_rgba(125,155,118,0.35),0_8px_24px_rgba(0,0,0,0.12)]
                  transition-all duration-300
                  flex items-center
                "
              >
                Continue to Home
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </span>
              {/* hover coral sheen, consistent with other CTAs */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Completion indicator */}
          <div className="mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 border border-sage/30 rounded-full">
              <CheckCircle className="w-4 h-4 text-sage" />
              <span className="text-xs font-semibold text-sage" style={sf}>
                Setup Complete
              </span>
            </div>
          </div>
        </div>
      </OnboardingLayout>
    </>
  );
}
