"use client";

import Link from "next/link";
import { ReactNode } from "react";

// Shared CSS animations for all onboarding pages
export const onboardingStyles = `
  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
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
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes microBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes progressPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .onboarding-enter {
    animation: slideInFromRight 0.6s ease-out forwards;
  }
  .onboarding-content {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  .onboarding-card {
    animation: scaleIn 0.6s ease-out forwards;
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .animate-scale-in {
    animation: scaleIn 0.4s ease-out forwards;
  }
  .animate-micro-bounce {
    animation: microBounce 0.3s ease-out;
  }
  .progress-active {
    animation: progressPulse 2s ease-in-out infinite;
  }

  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
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
  showProgress = true
}: OnboardingLayoutProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: onboardingStyles }} />

      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col px-4 py-4 relative overflow-y-auto onboarding-enter">

        {/* Back button */}
        {backHref && (
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 animate-fade-in-up delay-100">
            <Link
              href={backHref}
              className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full"
            >
              <ion-icon name="arrow-back-outline" size="small"></ion-icon>
            </Link>
          </div>
        )}

        {/* Decorative backdrop elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-8 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-sage/30 to-sage/60 rounded-full blur-2xl opacity-100 animate-fade-in-up delay-200" />
          <div className="absolute bottom-1/4 right-8 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-coral/25 to-coral/50 rounded-full blur-2xl opacity-100 animate-fade-in-up delay-300" />
          <div className="absolute top-1/2 left-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-charcoal/15 to-charcoal/30 rounded-full blur-xl opacity-100 animate-fade-in-up delay-400" />
        </div>

        {/* Main content */}
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-4 onboarding-content">
          {children}
        </div>

        {/* Progress indicator */}
        {showProgress && (
          <div className="animate-fade-in-up delay-500">
            <div className="flex justify-center items-center space-x-2 mt-2">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const isActive = index + 1 === step;
                const isCompleted = index + 1 < step;

                return (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-sage progress-active'
                        : isCompleted
                          ? 'bg-sage/60'
                          : 'bg-charcoal/20'
                    }`}
                  />
                );
              })}
            </div>

            <div className="text-center mt-1">
              <p className="font-urbanist text-xs font-400 text-charcoal/50">
                Step {step} of {totalSteps}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}