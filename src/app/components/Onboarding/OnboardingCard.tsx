"use client";

import { ReactNode } from "react";

interface OnboardingCardProps {
  children: ReactNode;
  className?: string;
}

export default function OnboardingCard({ children, className = "" }: OnboardingCardProps) {
  return (
    <div
      className={`
        bg-card-bg rounded-lg sm:rounded-lg px-4 sm:px-6 md:px-8 py-4 md:py-6 mb-2 relative overflow-visible
        border border-white/50 backdrop-blur-lg
        shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        transition-shadow duration-300
        onboarding-card ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
