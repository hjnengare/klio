// src/app/components/Logo/Logo.tsx
"use client";

import React from "react";

interface LogoProps {
  variant?: "default" | "mobile" | "footer" | "onboarding";
  className?: string;
  showDomain?: boolean;
  color?: "sage" | "gradient";
}

export default function Logo({
  variant = "default",
  className = "",
  showDomain = true,
  color = "gradient"
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
    footer: "text-sm sm:text-xs lg:text-sm",
    onboarding: "text-sm sm:text-xs md:text-sm"
  };

  const colorClass = color === "sage" 
    ? "text-sage" 
    : "text-transparent bg-clip-text bg-gradient-to-r from-sage via-coral to-sage";

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span
        className={`font-bold py-2 px-1 ${colorClass} drop-shadow-sm ${sizeClasses[variant]}`}
        style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '-0.02em' }}
      >
        sayso
      </span>
      
    </div>
  );
}
