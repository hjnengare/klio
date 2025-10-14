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
        bg-white/95 rounded-2xl sm:rounded-3xl px-4 sm:px-6 md:px-8 py-4 md:py-6 mb-2 relative overflow-visible
        border border-white/30 backdrop-blur-lg
        shadow-[0_10px_30px_rgba(0,0,0,0.06),0_22px_70px_rgba(0,0,0,0.10)]
        hover:shadow-[0_12px_36px_rgba(0,0,0,0.08),0_30px_90px_rgba(0,0,0,0.14)]
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