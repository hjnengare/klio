"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../lib/auth';
import { useToast } from '../../contexts/ToastContext';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onVerificationRequired?: () => void;
}

export default function EmailVerificationGuard({ 
  children, 
  fallback,
  onVerificationRequired 
}: EmailVerificationGuardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isResending, setIsResending] = useState(false);

  // If user is not logged in, show children (they'll be handled by ProtectedRoute)
  if (!user) {
    return <>{children}</>;
  }

  // If email is verified, show children
  if (user.email_verified) {
    return <>{children}</>;
  }

  // If email is not verified, show verification prompt
  const handleResendVerification = async () => {
    if (!user.email) return;

    setIsResending(true);
    try {
      const { error } = await AuthService.resendVerificationEmail(user.email);
      
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Verification email sent! Check your inbox.', 'success');
      }
    } catch (error) {
      showToast('Failed to resend verification email. Please try again.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/5 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-charcoal/10 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-amber-600" />
          </div>

          {/* Title */}
          <h2 className="font-sf text-xl font-700 text-charcoal mb-3">
            Verify Your Email
          </h2>

          {/* Description */}
          <p className="font-sf text-sm text-charcoal/70 mb-6 leading-relaxed">
            We've sent a verification link to <span className="font-600 text-charcoal">{user.email}</span>. 
            Please check your email and click the link to verify your account.
          </p>

          {/* Benefits */}
          <div className="bg-sage/5 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-sf text-sm font-600 text-charcoal mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sage" />
              What you'll unlock:
            </h3>
            <ul className="space-y-2 text-xs text-charcoal/70">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full"></div>
                Post reviews and share your experiences
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full"></div>
                Save your favorite local businesses
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full"></div>
                Join the community leaderboard
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full"></div>
                Secure account recovery options
              </li>
            </ul>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full bg-sage text-white font-sf text-sm font-600 py-3 px-4 rounded-xl hover:bg-sage/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Help Text */}
          <p className="font-sf text-xs text-charcoal/50 mt-4">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
}
