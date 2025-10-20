"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { useToast } from "../contexts/ToastContext";
import {
  ShieldCheck,
  Clock,
  Smile,
  BadgeDollarSign,
  CheckCircle,
} from "lucide-react";

interface DealBreaker {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const DEMO_DEAL_BREAKERS: DealBreaker[] = [
  { id: "trustworthiness", label: "Trustworthiness", description: "Reliable and honest service", icon: "shield-checkmark" },
  { id: "punctuality", label: "Punctuality", description: "On-time and respects your schedule", icon: "time" },
  { id: "friendliness", label: "Friendliness", description: "Welcoming and helpful staff", icon: "happy" },
  { id: "value-for-money", label: "Value for Money", description: "Fair pricing and good quality", icon: "cash-outline" },
];

const entranceStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .enter-fade {
    opacity: 0;
    animation: fadeSlideIn 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  .enter-stagger {
    opacity: 0;
    animation: fadeSlideIn 0.6s ease-out forwards;
  }
  @keyframes microBounce {
    0%,100% { transform: scale(1); }
    50%     { transform: scale(1.03); }
  }
  .animate-micro-bounce { animation: microBounce 0.28s ease-out; }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
};

const iconMap = {
  "shield-checkmark": ShieldCheck,
  "time": Clock,
  "happy": Smile,
  "cash-outline": BadgeDollarSign,
};

function DealBreakersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // Get all data from URL parameters
  const interests = useMemo(() => {
    const interestsParam = searchParams.get('interests');
    return interestsParam ? interestsParam.split(',').map(s => s.trim()) : [];
  }, [searchParams]);

  const subcategories = useMemo(() => {
    const subcategoriesParam = searchParams.get('subcategories');
    return subcategoriesParam ? subcategoriesParam.split(',').map(s => s.trim()) : [];
  }, [searchParams]);

  useEffect(() => {
    if (interests.length === 0 && subcategories.length === 0) {
      // No data passed, redirect to start
      router.push('/interests');
      return;
    }
  }, [interests, subcategories, router]);

  // Helper function to get interest_id for a subcategory
  const getInterestIdForSubcategory = useCallback((subcategoryId: string): string => {
    // This is a simplified mapping - you might want to load subcategories from API to get the actual mapping
    // For now, we'll return a default or try to infer from the subcategory ID
    const interestMapping: { [key: string]: string } = {
      'restaurants': 'food-drink',
      'cafes': 'food-drink',
      'bars': 'food-drink',
      'fast-food': 'food-drink',
      'fine-dining': 'food-drink',
      'gyms': 'beauty-wellness',
      'spas': 'beauty-wellness',
      'salons': 'beauty-wellness',
      'wellness': 'beauty-wellness',
      'nail-salons': 'beauty-wellness',
      // Add more mappings as needed
    };
    return interestMapping[subcategoryId] || 'food-drink'; // Default fallback
  }, []);

  const handleDealbreakerToggle = useCallback((dealbreakerId: string) => {
    setSelectedDealbreakers(prev => {
      if (prev.includes(dealbreakerId)) {
        return prev.filter(id => id !== dealbreakerId);
      } else {
        return [...prev, dealbreakerId];
      }
    });
  }, []);

  const handleNext = useCallback(async () => {
    setIsNavigating(true);

    try {
      // Prepare the data
      const requestData = {
        step: 'complete',
        interests: interests,
        subcategories: subcategories.map(subId => ({
          subcategory_id: subId,
          interest_id: getInterestIdForSubcategory(subId)
        })),
        dealbreakers: selectedDealbreakers
      };

      console.log('Sending onboarding data:', requestData);

      // Save ALL onboarding data at once - interests, subcategories, and dealbreakers
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to complete onboarding: ${errorData.error || response.statusText}`);
      }

      router.push('/complete');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      showToast('Failed to complete onboarding', 'error');
      setIsNavigating(false);
    }
  }, [interests, subcategories, selectedDealbreakers, getInterestIdForSubcategory, router, showToast]);

  const canProceed = selectedDealbreakers.length > 0 && !isNavigating;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: entranceStyles }} />
      <OnboardingLayout step={3} backHref="/subcategories">
        <div className="text-center mb-6 pt-4 sm:pt-6 enter-fade">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 tracking-tight"
            style={sf}
          >
            What are your deal-breakers?
          </h2>
          <p
            className="text-sm md:text-base text-charcoal/70 leading-relaxed px-4 max-w-2xl mx-auto"
            style={sf}
          >
            Select what matters most to you in a business
          </p>
        </div>

        <OnboardingCard className="rounded-3xl border border-white/30 shadow-sm bg-off-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8 enter-fade">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-2 bg-sage/10 border border-sage/20">
              <span className="text-sm font-semibold text-sage" style={sf}>
                {selectedDealbreakers.length} selected
              </span>
              {selectedDealbreakers.length > 0 && (
                <CheckCircle className="w-4 h-4 text-sage" />
              )}
            </div>
            <p className="text-xs text-charcoal/60" style={sf}>
              {selectedDealbreakers.length === 0
                ? "Select at least one deal-breaker to continue"
                : "Great! Select more or complete setup"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {DEMO_DEAL_BREAKERS.map((dealbreaker, index) => {
              const isSelected = selectedDealbreakers.includes(dealbreaker.id);
              const IconComponent = iconMap[dealbreaker.icon as keyof typeof iconMap] || CheckCircle;

              return (
                <div
                  key={dealbreaker.id}
                  className={`
                    enter-stagger
                    perspective-1000
                    ${isSelected ? 'scale-105' : 'scale-100'}
                    transition-transform duration-300 ease-out
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`
                      relative w-full h-32 cursor-pointer
                      ${isSelected ? 'flip' : ''}
                    `}
                    onClick={() => handleDealbreakerToggle(dealbreaker.id)}
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s',
                      transform: isSelected ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {/* Front of card - Text only */}
                    <div
                      className={`
                        absolute inset-0 w-full h-full rounded-2xl border-2 p-4 flex flex-col justify-center items-center text-center
                        bg-gradient-to-br from-sage/10 to-sage/5 border-sage/30 hover:border-sage/50
                        transition-all duration-200 hover:shadow-lg
                      `}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <h3 className="text-base font-semibold text-charcoal mb-2" style={sf}>
                        {dealbreaker.label}
                      </h3>
                      <p className="text-xs text-charcoal/60 leading-relaxed px-2" style={sf}>
                        {dealbreaker.description}
                      </p>
                    </div>

                    {/* Back of card - Icon only */}
                    <div
                      className={`
                        absolute inset-0 w-full h-full rounded-2xl border-2 p-4 flex flex-col justify-center items-center text-center
                        bg-gradient-to-br from-coral to-coral/90 border-coral shadow-[0_8px_24px_rgba(214,116,105,0.25)]
                      `}
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 mb-3">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                        <CheckCircle className="h-4 w-4 text-coral" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              className={`
                group block w-full text-white text-sm md:text-base font-semibold py-3.5 md:py-4 px-6 md:px-8 rounded-full transition-all duration-300 relative text-center
                ${canProceed
                  ? "bg-[linear-gradient(135deg,#7D9B76_0%,#6B8A64_100%)] shadow-[0_10px_40px_rgba(125,155,118,0.25),0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(125,155,118,0.35),0_8px_24px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
                  : "bg-charcoal/10 text-charcoal/40 cursor-not-allowed"
                }
              `}
              onClick={handleNext}
              disabled={!canProceed}
              style={sf}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isNavigating && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Complete Setup {selectedDealbreakers.length > 0 && `(${selectedDealbreakers.length} selected)`}
              </span>
              {canProceed && (
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          </div>
        </OnboardingCard>

        {/* Skip for now */}
        <div className="text-center mt-3">
          <Link
            href="/home"
            className="inline-block text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
            aria-label="Skip deal-breakers for now"
            style={sf}
            onClick={(e) => {
              e.preventDefault();
              router.push('/home');
            }}
          >
            Skip for now
          </Link>
        </div>
      </OnboardingLayout>
    </>
  );
}

export default function DealBreakersPage() {
  return (
    <ProtectedRoute requiresAuth={true}>
      <Suspense fallback={
        <OnboardingLayout step={3} backHref="/subcategories">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-charcoal/60">Loading deal-breakers...</div>
          </div>
        </OnboardingLayout>
      }>
        <DealBreakersContent />
      </Suspense>
    </ProtectedRoute>
  );
}
