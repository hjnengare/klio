"use client";

import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useCallback, useState } from 'react';
import { AuthService } from '../lib/auth';

export function useEmailVerification() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>('');

  const isEmailVerified = user?.email_verified ?? false;
  const userEmail = user?.email;

  const requireEmailVerification = useCallback((action: string) => {
    setPendingAction(action);
    setShowModal(true);
    return false;
  }, []);

  const resendVerificationEmail = useCallback(async (): Promise<boolean> => {
    if (!userEmail) {
      showToast('No email address found. Please log in again.', 'error');
      return false;
    }

    try {
      const { error } = await AuthService.resendVerificationEmail(userEmail);
      
      if (error) {
        showToast(error.message, 'error');
        return false;
      } else {
        showToast('Verification email sent! Check your inbox.', 'success');
        return true;
      }
    } catch (error) {
      showToast('Failed to resend verification email. Please try again.', 'error');
      return false;
    }
  }, [userEmail, showToast]);

  const checkEmailVerification = useCallback((action: string): boolean => {
    if (!isEmailVerified) {
      requireEmailVerification(action);
      return false;
    }
    return true;
  }, [isEmailVerified, requireEmailVerification]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setPendingAction('');
  }, []);

  return {
    isEmailVerified,
    userEmail,
    requireEmailVerification,
    resendVerificationEmail,
    checkEmailVerification,
    showModal,
    pendingAction,
    closeModal,
  };
}
