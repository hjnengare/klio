"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";

// Null fallback for animation components (graceful degradation)
const NullFallback = () => null;

// Dynamic FloatingElements with no SSR and minimal loading state
export const DynamicFloatingElements = dynamic(
  () => import("./FloatingElements"),
  {
    ssr: false, // No SSR for animations
    loading: null, // No loading state needed for decorative elements
  }
);

// Dynamic PremiumHover with fallback to regular div
export const DynamicPremiumHover = dynamic(
  () => import("./PremiumHover"),
  {
    ssr: false,
    loading: NullFallback,
  }
);

// PremiumButton component removed - not needed

// Dynamic MagneticButton with fallback to regular button
export const DynamicMagneticButton = dynamic(
  () => import("./MagneticButton"),
  {
    ssr: false,
    loading: null,
  }
);

// Dynamic PageTransition for route changes
export const DynamicPageTransition = dynamic(
  () => import("./PageTransition"),
  {
    ssr: false,
    loading: ({ children }: { children: React.ReactNode }) => (
      <div className="min-h-screen">{children}</div>
    ),
  }
);

// Dynamic FadeInUp with intersection observer
export const DynamicFadeInUp = dynamic(
  () => import("./OptimizedFadeInUp"),
  {
    ssr: false,
    loading: ({ children }: { children: React.ReactNode }) => (
      <div className="opacity-0 animate-fade-in">{children}</div>
    ),
  }
);

// Export all dynamic animations
export {
  DynamicFloatingElements as FloatingElements,
  DynamicPremiumHover as PremiumHover,
  DynamicPremiumButton as PremiumButton,
  DynamicMagneticButton as MagneticButton,
  DynamicPageTransition as PageTransition,
  DynamicFadeInUp as FadeInUp,
};