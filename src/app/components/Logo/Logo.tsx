// src/app/components/Logo/Logo.tsx
"use client";

import React from "react";

interface LogoProps {
  variant?: "default" | "mobile" | "footer" | "onboarding";
  className?: string;
  showDomain?: boolean;
}

export default function Logo({
  variant = "default",
  className = "",
  showDomain = true
}: LogoProps) {
  // Size configurations for different variants
  const sizeClasses = {
    default: "text-2xl lg:text-4xl",
    mobile: "text-2xl",
    footer: "text-lg lg:text-base",
    onboarding: "text-3xl md:text-3xl lg:text-4xl"
  };

  const domainSizeClasses = {
    default: "text-sm lg:text-base",
    mobile: "text-sm",
    footer: "text-xs lg:text-sm",
    onboarding: "text-xs md:text-sm"
  };

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span
        className={`font-bold py-2 px-1 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal drop-shadow-sm ${sizeClasses[variant]}`}
        style={{ fontFamily: '"Dancing Script", cursive' }}
      >
        sayso
      </span>
      
    </div>
  );
}
