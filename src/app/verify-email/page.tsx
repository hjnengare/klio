"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Mail, CheckCircle, ExternalLink, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const { user, resendVerificationEmail } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

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
      // Use Supabase's built-in resend verification email functionality
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
    // Open Gmail in a new tab
    window.open('https://mail.google.com', '_blank');
  };

  const handleRefreshUser = async () => {
    setIsChecking(true);
    try {
      // Refresh the user data to check for email verification status
      // Supabase will automatically update the user's email_confirmed_at when they click the verification link
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Checking verification status... If you\'ve verified your email, the page will refresh automatically.', 'info');
      
      // Auto-refresh to check for updated verification status
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render if user is not logged in or email is verified
  if (!user || user.email_verified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/home"
            className="inline-flex items-center gap-2 text-charcoal hover:text-charcoal/80 transition-colors duration-300 group"
          >
            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-charcoal/10 group-hover:shadow-md transition-all duration-300">
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="font-sf text-sm font-500">Back to Home</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-charcoal/10 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center shadow-sm">
            <Mail className="w-10 h-10 text-amber-600" />
          </div>

          {/* Title */}
                <h1 className="font-sf text-2xl font-700 text-charcoal mb-3">
                  Check Your Email
                </h1>

                {/* Description */}
                <p className="font-sf text-base text-charcoal/70 mb-6 leading-relaxed">
                  We've sent a confirmation email to
                </p>

                <div className="bg-sage/5 rounded-lg p-4 mb-6 border border-sage/20">
                  <p className="font-sf text-lg font-600 text-charcoal">
                    {user.email}
                  </p>
                </div>

                <p className="font-sf text-sm text-charcoal/70 mb-8 leading-relaxed">
                  Please verify your email to unlock full app features like posting reviews and appearing on leaderboards. The verification link will redirect you back to the app automatically.
                </p>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-sage/5 to-coral/5 rounded-lg p-6 mb-8 text-left border border-sage/10">
            <h3 className="font-sf text-base font-600 text-charcoal mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-sage" />
              What you'll unlock:
            </h3>
            <ul className="space-y-3 text-sm text-charcoal/70">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage rounded-full flex-shrink-0"></div>
                <span>Post reviews and share your experiences</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage rounded-full flex-shrink-0"></div>
                <span>Save your favorite local businesses</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage rounded-full flex-shrink-0"></div>
                <span>Join the community leaderboard</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage rounded-full flex-shrink-0"></div>
                <span>Secure account recovery options</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Open Gmail Button */}
            <button
              onClick={handleOpenGmail}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-sf text-base font-600 py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
            >
              <Mail className="w-5 h-5" />
              <span>Open Gmail</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="bg-white border border-sage/30 text-sage font-sf text-sm font-600 py-3 px-4 rounded-lg hover:bg-sage/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Email</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRefreshUser}
                disabled={isChecking}
                className="bg-white border border-charcoal/20 text-charcoal font-sf text-sm font-600 py-3 px-4 rounded-lg hover:bg-charcoal/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>I've Verified</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-charcoal/10">
            <p className="font-sf text-xs text-charcoal/50 mb-2">
              <strong>Can't find the email?</strong>
            </p>
            <ul className="font-sf text-xs text-charcoal/50 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes and try resending</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="font-sf text-xs text-charcoal/40">
            Having trouble? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
