"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAuth?: boolean;
  requiresOnboarding?: boolean;
  allowedOnboardingSteps?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiresAuth = true,
  requiresOnboarding = false,
  allowedOnboardingSteps = [],
  redirectTo
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    console.log('ProtectedRoute: Checking route protection', {
      requiresAuth,
      user_exists: !!user,
      user_email: user?.email,
      email_verified: user?.email_verified,
      onboarding_step: user?.profile?.onboarding_step,
      onboarding_complete: user?.profile?.onboarding_complete
    });

    // If authentication is required and user is not logged in
    if (requiresAuth && !user) {
      console.log('ProtectedRoute: No user, redirecting to login');
      router.push(redirectTo || '/login');
      return;
    }

    // If user is logged in but route doesn't require auth (e.g., login/register pages)
    if (!requiresAuth && user) {
      console.log('ProtectedRoute: User on non-auth route, checking redirects');
      
      // Check if user is coming from successful email verification
      const emailVerified = searchParams.get('email_verified') === 'true';
      const verified = searchParams.get('verified') === '1';
      
      if (user.profile?.onboarding_complete) {
        console.log('ProtectedRoute: Onboarding complete, redirecting to home');
        router.push('/home');
      } else if (!user.email_verified && !emailVerified && !verified) {
        console.log('ProtectedRoute: Email not verified, redirecting to verify-email');
        router.push('/verify-email');
      } else {
        console.log('ProtectedRoute: Email verified, redirecting to onboarding step');
        // User is verified, redirect to appropriate onboarding step
        if (user.profile?.onboarding_step === 'start') {
          console.log('ProtectedRoute: Redirecting to interests');
          router.push('/interests');
        } else {
          console.log('ProtectedRoute: Redirecting to', user.profile?.onboarding_step);
          router.push(`/${user.profile?.onboarding_step}`);
        }
      }
      return;
    }

    // If onboarding is required but user hasn't completed it
    if (requiresOnboarding && user && !user.profile?.onboarding_complete) {
      // Check if current step is allowed
      if (allowedOnboardingSteps.length > 0 && !allowedOnboardingSteps.includes(user.profile?.onboarding_step || '')) {
        router.push(`/${user.profile?.onboarding_step}`);
        return;
      }
    }

    // If user has completed onboarding but is trying to access onboarding pages
    if (user && user.profile?.onboarding_complete && allowedOnboardingSteps.length > 0) {
      router.push('/home');
      return;
    }
  }, [user, isLoading, router, requiresAuth, requiresOnboarding, allowedOnboardingSteps, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-urbanist text-base text-charcoal/70">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication checks pass, render children
  return <>{children}</>;
}

// Convenience wrapper components
export function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiresAuth={false}>
      {children}
    </ProtectedRoute>
  );
}

export function PrivateRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiresAuth={true}>
      {children}
    </ProtectedRoute>
  );
}

export function OnboardingRoute({
  children,
  step
}: {
  children: ReactNode;
  step: string;
}) {
  return (
    <ProtectedRoute
      requiresAuth={true}
      requiresOnboarding={true}
      allowedOnboardingSteps={[step]}
    >
      {children}
    </ProtectedRoute>
  );
}
