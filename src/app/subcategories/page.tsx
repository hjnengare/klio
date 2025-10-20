"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOnboarding } from "../contexts/OnboardingContext";
import { useToast } from "../contexts/ToastContext";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { CheckCircle } from "lucide-react";

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
    50%     { transform: scale(1.05); }
  }
  .animate-micro-bounce { animation: microBounce 0.28s ease-out; }

  .pills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .pills-container > button {
    flex: 0 0 auto;
    width: auto;
    min-width: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
};

interface SubcategoryItem {
  id: string;
  label: string;
  interest_id: string;
}

interface GroupedSubcategories {
  [interestId: string]: {
    title: string;
    items: SubcategoryItem[];
  };
}

const INTEREST_TITLES: { [key: string]: string } = {
  'food-drink': 'Food & Drink',
  'beauty-wellness': 'Beauty & Wellness',
  'professional-services': 'Professional Services',
  'outdoors-adventure': 'Outdoors & Adventure',
  'experiences-entertainment': 'Entertainment & Experiences',
  'arts-culture': 'Arts & Culture',
  'family-pets': 'Family & Pets',
  'shopping-lifestyle': 'Shopping & Lifestyle',
};

function SubcategoriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { selectedSubInterests: selectedSubcategories, setSelectedSubInterests: setSelectedSubcategories, isLoading, error } = useOnboarding();

  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const selectedInterests = useMemo(() => {
    const interestsParam = searchParams.get('interests');
    return interestsParam ? interestsParam.split(',').map(s => s.trim()) : [];
  }, [searchParams]);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (selectedInterests.length === 0) {
        router.push('/interests');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/subcategories?interests=${selectedInterests.join(',')}`);

        if (!response.ok) {
          throw new Error('Failed to load subcategories');
        }

        const data = await response.json();
        setSubcategories(data.subcategories || []);
      } catch (error) {
        console.error('Error loading subcategories:', error);
        showToast('Failed to load subcategories', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadSubcategories();
  }, [selectedInterests, router, showToast]);

  const groupedSubcategories = useMemo(() => {
    const grouped: GroupedSubcategories = {};

    subcategories.forEach(sub => {
      if (!grouped[sub.interest_id]) {
        grouped[sub.interest_id] = {
          title: INTEREST_TITLES[sub.interest_id] || sub.interest_id,
          items: []
        };
      }
      grouped[sub.interest_id].items.push(sub);
    });

    return grouped;
  }, [subcategories]);

  const handleSubcategoryToggle = useCallback((subcategoryId: string, interestId: string) => {
    const isSelected = selectedSubcategories.some(s => s.id === subcategoryId);

    if (isSelected) {
      setSelectedSubcategories(prev => prev.filter(s => s.id !== subcategoryId));
    } else {
      setSelectedSubcategories(prev => [...prev, { id: subcategoryId, interest_id: interestId }]);
    }
  }, [selectedSubcategories, setSelectedSubcategories]);

  const handleNext = useCallback(async () => {
    if (!selectedSubcategories || selectedSubcategories.length === 0) return;

    setIsNavigating(true);

    try {
      // Pass both interests and subcategories via URL - NO SAVING
      const interestParams = selectedInterests.length > 0 
        ? `interests=${selectedInterests.join(',')}` 
        : '';
      const subcategoryParams = selectedSubcategories.map(s => s.id).join(',');
      
      const urlParams = [interestParams, `subcategories=${subcategoryParams}`]
        .filter(Boolean)
        .join('&');
      
      router.push(`/deal-breakers?${urlParams}`);
    } catch (error) {
      console.error('Error navigating to deal-breakers:', error);
      showToast('Failed to navigate to next step', 'error');
      setIsNavigating(false);
    }
  }, [selectedSubcategories, selectedInterests, router, showToast]);

  const canProceed = (selectedSubcategories?.length || 0) > 0 && !isNavigating;

  if (loading) {
    return (
      <OnboardingLayout step={2} backHref="/interests">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-charcoal/60">Loading subcategories...</div>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: entranceStyles }} />
      <OnboardingLayout step={2} backHref="/interests">
        <div className="text-center mb-6 pt-4 sm:pt-6 enter-fade">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-2 tracking-tight"
            style={sf}
          >
            Choose your subcategories
          </h2>
          <p
            className="text-sm md:text-base text-charcoal/70 leading-relaxed px-4 max-w-2xl mx-auto"
            style={sf}
          >
            Select specific areas within your interests
          </p>
        </div>

        <OnboardingCard className="rounded-3xl border border-white/30 shadow-sm bg-off-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8 enter-fade">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-4">
              <p className="text-sm font-semibold text-red-600" style={sf}>
                {error}
              </p>
            </div>
          )}

          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-2 bg-sage/10 border border-sage/20">
              <span className="text-sm font-semibold text-sage" style={sf}>
                {selectedSubcategories?.length || 0} selected
              </span>
              {(selectedSubcategories?.length || 0) > 0 && (
                <CheckCircle className="w-4 h-4 text-sage" />
              )}
            </div>
            <p className="text-xs text-charcoal/60" style={sf}>
              {(selectedSubcategories?.length || 0) === 0
                ? "Select at least one subcategory to continue"
                : "Great! Select more or continue"}
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedSubcategories).map(([interestId, group], groupIndex) => (
              <div
                key={interestId}
                className="enter-stagger"
                style={{ animationDelay: `${groupIndex * 0.08}s` }}
              >
                <h3
                  className="text-base md:text-lg font-semibold text-charcoal mb-3"
                  style={sf}
                >
                  {group.title}
                </h3>
                <div className="pills-container">
                  {group.items.map((subcategory) => {
                    const isSelected = selectedSubcategories.some(s => s.id === subcategory.id);

                    return (
                      <button
                        key={subcategory.id}
                        onClick={() => handleSubcategoryToggle(subcategory.id, subcategory.interest_id)}
                        className={`
                          relative flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2
                          ${isSelected
                            ? 'border-coral bg-coral text-white shadow-sm scale-105'
                            : 'border-sage/30 bg-sage/5 text-sage hover:bg-sage/10 hover:border-sage/40 hover:scale-105'
                          }
                        `}
                        style={sf}
                      >
                        <span>{subcategory.label}</span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {subcategories.length === 0 && !loading && (
              <div className="text-center text-charcoal/60 py-8" style={sf}>
                <p>No subcategories found for your selected interests.</p>
              </div>
            )}
          </div>

          <div className="pt-6">
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
                {(isLoading || isNavigating) && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Continue {(selectedSubcategories?.length || 0) > 0 && `(${selectedSubcategories?.length || 0} selected)`}
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
            href="/deal-breakers"
            className="inline-block text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
            aria-label="Skip subcategory selection for now"
            style={sf}
            onClick={(e) => {
              e.preventDefault();
              const interestParams = selectedInterests.length > 0
                ? `?interests=${selectedInterests.join(',')}`
                : '';
              router.push(`/deal-breakers${interestParams}`);
            }}
          >
            Skip for now
          </Link>
        </div>
      </OnboardingLayout>
    </>
  );
}

export default function SubcategoriesPage() {
  return (
    <ProtectedRoute requiresAuth={true}>
      <Suspense fallback={
        <OnboardingLayout step={2} backHref="/interests">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-charcoal/60">Loading subcategories...</div>
          </div>
        </OnboardingLayout>
      }>
        <SubcategoriesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
