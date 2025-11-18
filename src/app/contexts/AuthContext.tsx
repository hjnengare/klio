"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
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
      console.log('AuthContext: Initializing auth...');
      setIsLoading(true);

      try {
        const currentUser = await AuthService.getCurrentUser();
        console.log('AuthContext: Got current user:', currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          has_profile: !!currentUser.profile
        } : null);
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        console.log('AuthContext: Initialization complete, isLoading = false');
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes - MIDDLEWARE HANDLES ROUTING
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state change', { 
        event, 
        user_id: session?.user?.id,
        session_exists: !!session,
        email_confirmed_at: session?.user?.email_confirmed_at
      });
      
      // Optimize for email verification events - update immediately if email is confirmed
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        // Fast path: if email is confirmed in session, optimistically update user
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          console.log('AuthContext: Email verified - fast update', {
            email: currentUser.email,
            email_verified: currentUser.email_verified
          });
          setUser(currentUser);
          setIsLoading(false);
          return;
        }
      }
      
      // Only update user state - middleware handles all routing logic
      if (session?.user) {
        const currentUser = await AuthService.getCurrentUser();
        console.log('AuthContext: User state updated', {
          email: currentUser?.email,
          email_verified: currentUser?.email_verified,
          user_id: currentUser?.id
        });
        setUser(currentUser);
        setIsLoading(false);
      } else {
        console.log('AuthContext: User signed out');
        setUser(null);
        setIsLoading(false);
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

          // Store email in sessionStorage for verify-email page (in case AuthContext state is lost)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('pendingVerificationEmail', authUser.email);
          }

          // Redirect to verify-email page since user won't have a session until email is verified
          console.log('AuthContext: Registration complete, redirecting to verify-email');
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

        // Update avatar_url if provided
        if (userData.profile.avatar_url !== undefined) {
          profileUpdates.avatar_url = userData.profile.avatar_url;
        }

        // Update username if provided
        if (userData.profile.username !== undefined) {
          profileUpdates.username = userData.profile.username;
        }

        // Update display_name if provided
        if (userData.profile.display_name !== undefined) {
          profileUpdates.display_name = userData.profile.display_name;
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

      // Fetch fresh profile data from database to ensure we have the latest avatar_url
      const { data: freshProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching fresh profile:', fetchError);
      }

      // Update local user state with fresh data from database
      const updatedUser = {
        ...user,
        ...userData,
        profile: freshProfile ? { ...user.profile, ...freshProfile } : (userData.profile ? { ...user.profile, ...userData.profile } : user.profile)
      };

      console.log('Updated user state with avatar_url:', updatedUser.profile?.avatar_url);
      setUser(updatedUser);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Update failed';
      setError(message);
      // Re-throw so calling code can handle the error
      throw error;
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

  // Memoize context value to prevent unnecessary re-renders
  const value: AuthContextType = useMemo(() => ({
    user,
    login,
    register,
    logout,
    updateUser,
    resendVerificationEmail,
    isLoading,
    error
  }), [user, isLoading, error]);

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
