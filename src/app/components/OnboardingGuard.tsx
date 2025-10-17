"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { ONBOARDING_STEPS, OnboardingStep } from "../contexts/onboarding-steps";
// Simple loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-off-white">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
  </div>
);

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Memoize expensive calculations
  const isOnboardingRoute = useMemo(() =>
    ONBOARDING_STEPS.some(step => pathname === step.path || pathname.startsWith(step.path)),
    [pathname]
  );

  const currentStep = useMemo(() =>
    ONBOARDING_STEPS.find(step => pathname === step.path),
    [pathname]
  );

  // Simplified navigation logic to fix registration loop
  const handleNavigation = useCallback(() => {
    if (isLoading) return;

    // Skip guard for non-onboarding routes
    if (!isOnboardingRoute) return;

    // If user is already onboarded and trying to access onboarding steps, redirect to home
    if (user?.profile?.onboarding_complete && pathname !== "/complete") {
      router.replace("/home");
      return;
    }

    // If no user and trying to access protected steps, redirect to start
    if (!user && pathname !== "/onboarding" && pathname !== "/register" && pathname !== "/login") {
      router.replace("/onboarding");
      return;
    }

    // For registration flow - check email verification first
    if (user && pathname === "/interests") {
      // User must have verified email to access interests
      if (!user.email_verified) {
        router.replace("/verify-email");
        return;
      }
      // User is logged in and email verified - allow it
      return;
    }

    // For other steps, check basic requirements
    if (pathname === "/subcategories" && user && (!user.interests || user.interests.length === 0)) {
      router.replace("/interests");
      return;
    }

    if (pathname === "/deal-breakers" && user && (!user.profile?.sub_interests || user.profile.sub_interests.length === 0)) {
      router.replace("/subcategories");
      return;
    }

    // For now, just check if user is authenticated for complete page
    if (pathname === "/complete" && !user) {
      router.replace("/deal-breakers");
      return;
    }
  }, [user, isLoading, pathname, router, isOnboardingRoute]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoading />;
  }

  return <>{children}</>;
}