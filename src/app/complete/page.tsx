"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Smile, Star, Check, ArrowRight, CheckCircle } from "react-feather";
import { useAuth } from "../contexts/AuthContext";
import { useReducedMotion } from "../utils/useReducedMotion";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

// 🎨 Apple-like animations - content from different directions
const completeStyles = `
  /* Slide up animation */
  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Slide down animation */
  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Slide left animation */
  @keyframes slideLeft {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Slide right animation */
  @keyframes slideRight {
    0% {
      opacity: 0;
      transform: translateX(-20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Scale reveal animation */
  @keyframes scaleReveal {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Gentle floating animation */
  @keyframes gentleFloat {
    0%, 100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateY(-12px) scale(1.02);
      opacity: 1;
    }
  }

  /* Heading - slides down */
  .animate-heading {
    animation: slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }

  /* Subtitle - slides up */
  .animate-subtitle {
    animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    animation-delay: 0.15s;
  }

  /* Graphics container - scales in */
  .animate-graphics {
    animation: scaleReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    animation-delay: 0.3s;
  }

  /* CTA - slides up from bottom */
  .animate-cta {
    animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    animation-delay: 0.45s;
  }

  /* Badge - slides right */
  .animate-badge {
    animation: slideRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    animation-delay: 0.6s;
  }

  /* Individual floating icons */
  .apple-float {
    animation: gentleFloat 3s ease-in-out infinite;
  }

  .apple-float.delay-400 {
    animation-delay: 0.4s;
  }

  .apple-float.delay-800 {
    animation-delay: 0.8s;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-heading,
    .animate-subtitle,
    .animate-graphics,
    .animate-cta,
    .animate-badge,
    .apple-float {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }

  /* 🔒 Remove browser tap highlight overlay */
  * {
    -webkit-tap-highlight-color: transparent;
  }
`;

/** ---------- Shared fonts ---------- */
const sf = {
  fontFamily:
    'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
} as const;

function CompletePageContent() {
  const { updateUser, user } = useAuth();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // 🎉 Confetti rain effect
    if (!reducedMotion && typeof window !== 'undefined') {
      let cancelled = false;
      
      // Dynamically import canvas-confetti to avoid SSR issues
      import('canvas-confetti').then((confetti) => {
        const duration = 2000; // 2 seconds
        const end = Date.now() + duration;

        (function frame() {
          if (cancelled) return;

          confetti.default({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
          });
          confetti.default({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
          });

          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      });

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
      >
        <div
          className="text-center flex-1 flex flex-col justify-center px-4"
          style={
            {
              "--coral": "hsl(16, 100%, 66%)",
              "--sage": "hsl(148, 20%, 38%)",
              "--charcoal": "hsl(0, 0%, 25%)",
              "--off-white": "hsl(0, 0%, 98%)",
              ...sf,
            } as React.CSSProperties
          }
        >
          {/* Heading */}
          <h1
            className="text-2xl md:text-4xl font-bold text-charcoal mb-4 tracking-tight leading-snug animate-heading"
            aria-live="polite"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
          >
            You&apos;re all set!
          </h1>
          <p className="text-base md:text-lg text-charcoal/70 mb-4 leading-relaxed animate-subtitle" style={{ fontFamily: 'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 400 }}>
            Time to discover what&apos;s out there.
          </p>

          {/* Floating graphics (non-interactive now) */}
          <div className="relative mx-auto mb-4 h-28 w-full max-w-[420px] animate-graphics" aria-hidden="true">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute bottom-0 left-[15%] w-14 h-14 rounded-full bg-off-white/90 border-2 border-coral flex items-center justify-center apple-float shadow-[0_8px_24px_rgba(0,0,0,0.06)] pointer-events-none select-none">
                <Smile className="w-5 h-5 text-charcoal" aria-hidden="true" />
              </div>
              <div className="absolute bottom-0 left-[45%] w-14 h-14 rounded-full bg-off-white/90 border-2 border-sage flex items-center justify-center apple-float delay-400 shadow-[0_8px_24px_rgba(0,0,0,0.06)] pointer-events-none select-none">
                <Star className="w-5 h-5 text-charcoal" aria-hidden="true" />
              </div>
              <div className="absolute bottom-0 left-[75%] w-14 h-14 rounded-full bg-off-white/90 border-2 border-coral flex items-center justify-center apple-float delay-800 shadow-[0_8px_24px_rgba(0,0,0,0.06)] pointer-events-none select-none">
                <Check className="w-5 h-5 text-charcoal" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Continue CTA */}
          <div className="animate-cta">
            <Link
              href="/home"
              data-testid="onboarding-complete-cta"
              aria-label="Go to Home"
              className="group inline-flex items-center justify-center w-full sm:w-auto text-white text-sm font-semibold py-4 px-8 rounded-full transition-all duration-300 focus:outline-none"
              style={{ fontFamily: 'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 600 }}
            >
              <span
                className="
                  relative z-10
                  bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)]
                  shadow-[0_10px_40px_rgba(125,155,118,0.25),0_4px_12px_rgba(0,0,0,0.08)]
                  px-6 py-3 rounded-full
                  group-hover:bg-navbar-bg
                  group-hover:-translate-y-0.5
                  group-hover:shadow-[0_20px_60px_rgba(125,155,118,0.35),0_8px_24px_rgba(0,0,0,0.12)]
                  transition-all duration-300
                  flex items-center
                "
              >
                Continue to Home
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </span>
              
            </Link>
          </div>

          {/* Completion badge */}
          <div className="mt-8 animate-badge">
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

export default function CompletePage() {
  return (
    <ProtectedRoute requiresAuth={true}>
      <CompletePageContent />
    </ProtectedRoute>
  );
}
