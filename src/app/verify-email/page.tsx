"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePrefersReducedMotion } from '../utils/hooks/usePrefersReducedMotion';
import { Mail, CheckCircle, Loader2, ExternalLink, ArrowLeft } from 'lucide-react';

const styles = `
  /* Mobile-first typography scale - Body text ≥ 16px */
  .text-body { font-size: 1rem; line-height: 1.5; }
  .text-body-lg { font-size: 1.125rem; line-height: 1.5; }
  .text-heading-sm { font-size: 1.25rem; line-height: 1.4; }
  .text-heading-md { font-size: 1.5rem; line-height: 1.3; }
  .text-heading-lg { font-size: 1.875rem; line-height: 1.2; }

  /* iOS inertia scrolling and prevent double scroll */
  .ios-inertia {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    min-height: 0;
  }

  /* Hide scrollbar */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Button press states - 44-48px targets */
  .btn-press:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .btn-target {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }

  /* Premium button styling */
  .btn-premium {
    position: relative;
    background: linear-gradient(135deg, #7D9B76 0%, #6B8A64 100%);
    box-shadow:
      0 10px 40px rgba(125, 155, 118, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow:
      0 20px 60px rgba(125, 155, 118, 0.35),
      0 8px 24px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-premium:active {
    transform: translateY(0);
  }

  /* Input styling - 16px+ to prevent auto-zoom */
  .input-mobile {
    font-size: 1rem !important;
    min-height: 48px;
    touch-action: manipulation;
  }

  /* Premium card styling with gradient shadow */
  .card-premium {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(125, 155, 118, 0.1);
    box-shadow:
      0 8px 32px rgba(125, 155, 118, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(10px);
  }

  /* Text truncation support */
  .text-truncate {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Full-screen pattern - respects notches */
  .full-screen {
    min-height: 100dvh;
    min-height: 100vh;
  }

  /* Safe area padding */
  .safe-area-full {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: max(1.5rem, env(safe-area-inset-top));
    padding-bottom: max(6rem, env(safe-area-inset-bottom));
  }

  /* Prevent layout jumps */
  .stable-layout {
    contain: layout style;
  }

  /* Fixed aspect ratios for images */
  .aspect-square { aspect-ratio: 1 / 1; }
  .aspect-video { aspect-ratio: 16 / 9; }
  .aspect-photo { aspect-ratio: 4 / 3; }

  /* Carousel patterns for mobile */
  @media (max-width: 768px) {
    .carousel-mobile {
      scroll-snap-type: x mandatory;
      overflow-x: auto;
      display: flex;
    }

    .carousel-item {
      scroll-snap-align: center;
      flex-shrink: 0;
    }
  }

  /* CSS Animations */
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

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation classes */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.8s ease-out forwards;
  }

  .animate-delay-200 {
    animation-delay: 0.2s;
    opacity: 0;
  }

  .animate-delay-400 {
    animation-delay: 0.4s;
    opacity: 0;
  }

  .animate-delay-700 {
    animation-delay: 0.7s;
    opacity: 0;
  }

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in-up,
    .animate-slide-in-left,
    .animate-scale-in {
      animation: none;
      opacity: 1;
    }
    
    .animate-delay-200,
    .animate-delay-400,
    .animate-delay-700 {
      animation-delay: 0s;
      opacity: 1;
    }
  }
`;

export default function VerifyEmailPage() {
  const { user, resendVerificationEmail } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if user is not logged in
  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  // Redirect if email is already verified
  useEffect(() => {
    console.log('VerifyEmail: Checking email verification status', {
      user: user?.email,
      email_verified: user?.email_verified,
      user_exists: !!user
    });
    
    if (user?.email_verified) {
      console.log('VerifyEmail: Email verified successfully!');
      // Show success message briefly before redirecting
      showToast('🎉 You\'re verified! Your account is now secured and ready.', 'success', 3000);
      
      // Redirect to interests after showing success message
      setTimeout(() => {
        router.push('/interests');
      }, 2000);
    }
  }, [user, router]); // Removed showToast from dependencies

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const success = await resendVerificationEmail(user.email);
      if (success) {
        showToast('Verification email sent! Check your inbox and spam folder.', 'success');
      }
    } catch (error) {
      showToast('Failed to resend verification email. Please try again.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenGmail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  const handleRefreshUser = async () => {
    setIsChecking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast('Checking verification status... If you\'ve verified your email, the page will refresh automatically.', 'info');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading if user data is still loading
  if (user === undefined) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="min-h-[100dvh] bg-white flex items-center justify-center ios-inertia hide-scrollbar safe-area-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-sf text-base text-charcoal/70">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // If user is null after loading, redirect to login (handled by useEffect)
  if (!user) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div ref={containerRef} data-reduced={prefersReduced} className="min-h-[100dvh] bg-white flex flex-col relative overflow-hidden ios-inertia hide-scrollbar safe-area-full">
        
        {/* Back button with entrance animation */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 animate-slide-in-left animate-delay-200">
          <Link href="/home" className="text-charcoal hover:text-charcoal/80 transition-colors duration-300 p-2 hover:bg-white/50 rounded-lg block backdrop-blur-sm">
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-12">
          
          {/* Header with premium styling and animations */}
          <div className="text-center mb-4">
            <div className="inline-block relative mb-4 animate-fade-in-up animate-delay-400">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 text-center leading-snug px-2 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                Check Your Email
              </h2>
            </div>
            <p className="text-sm md:text-base font-normal text-charcoal/70 mb-4 leading-relaxed px-2 max-w-lg mx-auto animate-fade-in-up animate-delay-700" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              We've sent a confirmation email to verify your account and unlock full features!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-7 md:p-9 mb-4 relative overflow-hidden border border-white/30 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.06),0_22px_70px_rgba(0,0,0,0.10)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08),0_30px_90px_rgba(0,0,0,0.14)] transition-shadow duration-300 animate-scale-in">
            
            {/* Email Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center shadow-sm">
                <Mail className="w-10 h-10 text-amber-600" />
              </div>
              
              {/* Email Display */}
              <div className="bg-sage/5 rounded-lg p-4 mb-6 border border-sage/20">
                <p className="font-sf text-lg font-600 text-charcoal">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-8">
              <p className="font-sf text-sm text-charcoal/70 mb-6 leading-relaxed">
                Please check your email and click the verification link to activate your account. The link will automatically redirect you back to the app once verified.
              </p>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-sage/5 to-coral/5 rounded-lg p-6 mb-6 text-left border border-sage/10">
                <h3 className="font-sf text-base font-600 text-charcoal mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-sage" />
                  Why verify your email?
                </h3>
                <ul className="font-sf text-sm text-charcoal/80 space-y-2 list-disc pl-5">
                  <li>Unlock full app features (posting, saving, leaderboards)</li>
                  <li>Secure account recovery and password resets</li>
                  <li>Receive important updates and notifications</li>
                  <li>Build trust within the community</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Open Gmail Button */}
              <button
                onClick={handleOpenGmail}
                className="w-full btn-premium text-white font-sf text-sm font-600 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 btn-target btn-press"
              >
                <Mail className="w-4 h-4" />
                Open Gmail
                <ExternalLink className="w-3 h-3" />
              </button>

              {/* Resend Button */}
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-sage text-white font-sf text-sm font-600 py-3 px-4 rounded-xl hover:bg-sage/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-target btn-press"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Resend Verification Email
                  </>
                )}
              </button>

              {/* I've Verified Button */}
              <button
                onClick={handleRefreshUser}
                disabled={isChecking}
                className="w-full bg-charcoal text-white font-sf text-sm font-600 py-3 px-4 rounded-xl hover:bg-charcoal/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-target btn-press"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    I've Verified My Email
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <p className="font-sf text-xs text-charcoal/50 mt-6 text-center">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}