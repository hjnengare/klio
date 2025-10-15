"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Mail, X, Loader2 } from 'lucide-react';

interface EmailVerificationBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export default function EmailVerificationBanner({ onDismiss, className = "" }: EmailVerificationBannerProps) {
  const { user, resendVerificationEmail } = useAuth();
  const { showToast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if user is verified or dismissed
  if (!user || user.email_verified || isDismissed) {
    return null;
  }

  const handleResend = async () => {
    if (!user.email) return;

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

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <p className="font-sf text-sm font-600 text-amber-800 mb-1">
            Email Verification Required
          </p>
          <p className="font-sf text-sm text-amber-700 mb-3">
            We've sent a confirmation email to <span className="font-600">{user.email}</span>. 
            Please verify to post reviews and appear on leaderboards.
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-sf text-sm font-600 text-amber-800 hover:text-amber-900 underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend'
              )}
            </button>
            
            <span className="text-amber-600">•</span>
            
            <a
              href="/verify-email"
              className="font-sf text-sm font-600 text-amber-800 hover:text-amber-900 underline"
            >
              Go to verification page
            </a>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-amber-600 hover:text-amber-700 transition-colors flex-shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
