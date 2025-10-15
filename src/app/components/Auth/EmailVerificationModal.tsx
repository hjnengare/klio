"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Mail, X, CheckCircle, Loader2 } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string; // The action that requires email verification
}

export default function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  action = "continue" 
}: EmailVerificationModalProps) {
  const { user, resendVerificationEmail } = useAuth();
  const { showToast } = useToast();
  const [isResending, setIsResending] = useState(false);

  if (!isOpen || !user) return null;

  const handleResendVerification = async () => {
    if (!user.email) return;

    setIsResending(true);
    try {
      const success = await resendVerificationEmail(user.email);
      
      if (success) {
        showToast('Verification email sent! Check your inbox.', 'success');
      }
    } catch (error) {
      showToast('Failed to resend verification email. Please try again.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-charcoal/10 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-sf text-lg font-700 text-charcoal">
                Verify Your Email
              </h3>
              <p className="font-sf text-xs text-charcoal/60">
                Required to {action}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-charcoal/5 flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-4 h-4 text-charcoal/60" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="font-sf text-sm text-charcoal/70 mb-4 leading-relaxed">
            We've sent a verification link to <span className="font-600 text-charcoal">{user.email}</span>. 
            Please check your email and click the link to verify your account.
          </p>

          {/* Benefits */}
          <div className="bg-sage/5 rounded-lg p-4 mb-4">
            <h4 className="font-sf text-sm font-600 text-charcoal mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sage" />
              What you'll unlock:
            </h4>
            <ul className="space-y-1 text-xs text-charcoal/70">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sage rounded-full"></div>
                Post reviews and share experiences
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sage rounded-full"></div>
                Save favorite businesses
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sage rounded-full"></div>
                Join community leaderboard
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-charcoal/20 text-charcoal/70 font-sf text-sm font-500 rounded-lg hover:bg-charcoal/5 transition-colors duration-200"
            >
              I'll verify later
            </button>
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="flex-1 bg-sage text-white font-sf text-sm font-600 py-2.5 px-4 rounded-lg hover:bg-sage/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend Email
                </>
              )}
            </button>
          </div>

          {/* Help Text */}
          <p className="font-sf text-xs text-charcoal/50 mt-3 text-center">
            Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
}
