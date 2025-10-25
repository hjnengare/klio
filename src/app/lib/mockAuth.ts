// Mock authentication for UI-focused development
import { DUMMY_USER } from './dummyData';

export interface MockAuthUser {
  id: string;
  email: string;
  profile?: {
    onboarding_complete?: boolean;
    onboarding_step?: string;
    interests?: string[];
    sub_interests?: string[];
    deal_breakers?: string[];
  };
}

class MockAuthService {
  private currentUser: MockAuthUser | null = {
    id: DUMMY_USER.id,
    email: DUMMY_USER.email,
    profile: {
      onboarding_complete: DUMMY_USER.onboarding_complete,
      onboarding_step: DUMMY_USER.onboarding_step,
      interests: DUMMY_USER.interests,
      sub_interests: DUMMY_USER.sub_interests,
      deal_breakers: DUMMY_USER.deal_breakers
    }
  };

  async getCurrentUser(): Promise<MockAuthUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.currentUser;
  }

  async signIn({ email, password }: { email: string; password: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('[MOCK AUTH] Sign in attempt:', { email });

    // Always succeed for UI testing
    const user = {
      id: 'mock-user-id',
      email: email,
      profile: {
        onboarding_complete: true,
        onboarding_step: 'completed',
        interests: ['food-drink', 'entertainment'],
        sub_interests: ['restaurants', 'cafes', 'movies'],
        deal_breakers: ['poor-hygiene', 'rude-staff']
      }
    };

    this.currentUser = user;

    return {
      user,
      error: null
    };
  }

  async signUp({ email, password }: { email: string; password: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    console.log('[MOCK AUTH] Sign up attempt:', { email });

    // Always succeed for UI testing
    const user = {
      id: 'mock-user-id',
      email: email,
      profile: {
        onboarding_complete: false,
        onboarding_step: 'interests',
        interests: [],
        sub_interests: [],
        deal_breakers: []
      }
    };

    this.currentUser = user;

    return {
      user,
      error: null
    };
  }

  async signOut() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log('[MOCK AUTH] Sign out');
    this.currentUser = null;

    return {
      error: null
    };
  }

  // Mock auth state change listener
  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Return a mock subscription
    return {
      subscription: {
        unsubscribe: () => {
          console.log('[MOCK AUTH] Unsubscribed from auth changes');
        }
      }
    };
  }
}

export const MockAuth = new MockAuthService();
