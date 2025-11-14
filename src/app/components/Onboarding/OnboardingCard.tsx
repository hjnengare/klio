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
        bg-card-bg rounded-2xl sm:rounded-2xl px-2 md:px-4 py-4 md:py-6 mb-2 relative overflow-visible
        border border-white/50 backdrop-blur-lg
        shadow-md hover:shadow-lg
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
