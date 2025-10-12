"use client";

import { ReactNode } from "react";

interface OnboardingCardProps {
  children: ReactNode;
  className?: string;
}

export default function OnboardingCard({ children, className = "" }: OnboardingCardProps) {
  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl px-4 sm:px-6 md:px-8 py-4 md:py-6 mb-2 relative overflow-visible onboarding-card ${className}`}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}