"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react"; // ✅ Lucide icon import

// Shared CSS animations for all onboarding pages
const globalAnimations = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation classes */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.8s ease-out forwards;
  }

  .delay-100 {
    animation-delay: 0.1s;
    opacity: 0;
  }

  .delay-500 {
    animation-delay: 0.5s;
    opacity: 0;
  }

  /* Progress indicator animation */
  .progress-active {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in-up,
    .animate-slide-in-left,
    .animate-scale-in,
    .progress-active {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }

  /* Safe area support */
  .pb-safe-area-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .mb-safe-interaction {
    margin-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .safe-area-container {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: max(1rem, env(safe-area-inset-top));
  }
`;


interface OnboardingLayoutProps {
  children: ReactNode;
  backHref?: string;
  step: number;
  totalSteps?: number;
  showProgress?: boolean;
}

export default function OnboardingLayout({
  children,
  backHref,
  step,
  totalSteps = 4,
  showProgress = true,
}: OnboardingLayoutProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalAnimations }} />
      <div className="min-h-dvh bg-white flex flex-col px-4 py-4 pb-safe-area-bottom relative overflow-y-auto onboarding-enter safe-area-container">
        {/* Back button */}
        {backHref && (
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 animate-fade-in-up delay-100">
            <Link
              href={backHref}
              aria-label="Go back"
              className="text-charcoal hover:text-charcoal/80 transition-colors duration-300 p-2 hover:bg-white/50 rounded-lg block backdrop-blur-sm"
            >
              {/* ✅ Lucide back arrow */}
              <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
            </Link>
          </div>
        )}

        {/* Main content */}
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-4 onboarding-content">
          {children}
        </div>

        {/* Progress indicator */}
        {showProgress && (
          <div className="animate-fade-in-up delay-500 mb-safe-interaction">
            <div className="flex justify-center items-center space-x-2 mt-2">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const isActive = index + 1 === step;
                const isCompleted = index + 1 < step;

                return (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      isActive
                        ? "bg-sage progress-active"
                        : isCompleted
                        ? "bg-sage/60"
                        : "bg-charcoal/20"
                    }`}
                  />
                );
              })}
            </div>

            <div className="text-center mt-1">
              <p className="font-sf text-xs font-400 text-charcoal/50">
                Step {step} of {totalSteps}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
