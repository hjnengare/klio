"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../lib/supabase/client';
import { AuthService } from '../lib/auth';
import type { AuthUser } from '../lib/types/database';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getBrowserSupabase();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes - SIMPLIFIED APPROACH
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state change', { 
        event, 
        user_id: session?.user?.id,
        session_exists: !!session,
        email_confirmed_at: session?.user?.email_confirmed_at
      });
      
      // Only update user state, don't handle redirects here
      // Let individual pages handle their own redirect logic
      if (session?.user) {
        const currentUser = await AuthService.getCurrentUser();
        console.log('AuthContext: User state updated', {
          email: currentUser?.email,
          email_verified: currentUser?.email_verified,
          user_id: currentUser?.id
        });
        setUser(currentUser);
      } else {
        console.log('AuthContext: User signed out');
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: authUser, error: authError } = await AuthService.signIn({ email, password });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return false;
      }

      if (authUser) {
        setUser(authUser);

        // Redirect based on onboarding status and email verification
        if (authUser.profile?.onboarding_complete) {
          router.push('/home');
        } else if (!authUser.email_verified) {
          // Redirect to email verification if not verified
          router.push('/verify-email');
        } else {
          // Redirect to interests page after login (email verified)
          router.push('/interests');
        }
      }

      setIsLoading(false);
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('AuthContext: Starting registration...');
      
      const { user: authUser, session, error: authError } = await AuthService.signUp({ email, password });

      if (authError) {
        console.log('AuthContext: Registration error', authError);
        // Handle specific error cases
        let errorMessage = authError.message;
        if (authError.message.includes('User already registered') || authError.message.includes('already registered')) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.';
        }
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }

      if (authUser) {
        console.log('AuthContext: Registration successful', {
          email: authUser.email,
          email_verified: authUser.email_verified,
          user_id: authUser.id,
          has_session: !!session,
          session_data: session
        });
        
        // Set user state - this will trigger auth state change
        setUser(authUser);

        // ALWAYS redirect to verify-email page after registration
        // The verify-email page will handle checking if user is already verified
        console.log('AuthContext: Redirecting to verify-email page');
        router.push('/verify-email');
      }

      setIsLoading(false);
      return true;
    } catch (error: unknown) {
      console.log('AuthContext: Registration exception', error);
      const message = error instanceof Error ? error.message : 'Registration failed';
      setError(message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await AuthService.signOut();

      if (signOutError) {
        setError(signOutError.message);
      } else {
        setUser(null);
        router.push('/onboarding');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<AuthUser>): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update user profile in Supabase if profile data is being updated
      if (userData.profile) {
        // Prepare profile updates - only update fields that exist in the profiles table
        const profileUpdates: Record<string, any> = {
          updated_at: new Date().toISOString()
        };

        // Only update onboarding_step if provided
        if (userData.profile.onboarding_step) {
          profileUpdates.onboarding_step = userData.profile.onboarding_step;
        }

        // Update the profiles table with valid fields only
        const { error } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('user_id', user.id);

        if (error) throw error;

        // Handle interests separately using the dedicated API
        if (userData.profile.interests && Array.isArray(userData.profile.interests)) {
          try {
            const response = await fetch('/api/user/interests', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ selections: userData.profile.interests })
            });
            if (!response.ok) {
              console.warn('Failed to update interests:', await response.text());
            }
          } catch (interestError) {
            console.warn('Error updating interests:', interestError);
          }
        }

        // Handle subcategories separately using the dedicated API
        if (userData.profile.sub_interests && Array.isArray(userData.profile.sub_interests)) {
          try {
            const response = await fetch('/api/user/subcategories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subcategories: userData.profile.sub_interests })
            });
            if (!response.ok) {
              console.warn('Failed to update subcategories:', await response.text());
            }
          } catch (subcatError) {
            console.warn('Error updating subcategories:', subcatError);
          }
        }
      }

      // Update local user state
      const updatedUser = {
        ...user,
        ...userData,
        profile: userData.profile ? { ...user.profile, ...userData.profile } : user.profile
      };
      setUser(updatedUser);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Update failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await AuthService.resendVerificationEmail(email);
      
      if (error) {
        setError(error.message);
        return false;
      }

      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to resend verification email';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    resendVerificationEmail,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { AuthUser };