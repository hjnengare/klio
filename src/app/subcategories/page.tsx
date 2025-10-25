"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOnboarding } from "../contexts/OnboardingContext";
import { useToast } from "../contexts/ToastContext";
import OnboardingLayout from "../components/Onboarding/OnboardingLayout";
import OnboardingCard from "../components/Onboarding/OnboardingCard";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import SubcategoryStyles from "../components/Subcategories/SubcategoryStyles";
import SubcategoryHeader from "../components/Subcategories/SubcategoryHeader";
import SubcategorySelection from "../components/Subcategories/SubcategorySelection";
import SubcategoryGrid from "../components/Subcategories/SubcategoryGrid";
import SubcategoryActions from "../components/Subcategories/SubcategoryActions";


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
        // If no interests selected, redirect to deal-breakers
        router.push('/deal-breakers');
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

  const handleSkip = async () => {
    try {
      await handleNext();
    } catch (error) {
      console.error("Error skipping subcategories:", error);
    }
  };

  return (
    <>
      <SubcategoryStyles />
      <OnboardingLayout step={2} backHref="/interests">
        <SubcategoryHeader />

        <OnboardingCard className="rounded-lg border border-white/30 shadow-sm bg-off-white px-5 sm:px-7 md:px-9 py-5 sm:py-7 md:py-8 enter-fade">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-4">
              <p className="text-sm font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          <SubcategorySelection selectedCount={selectedSubcategories?.length || 0}>
            <SubcategoryGrid
              groupedSubcategories={groupedSubcategories}
              selectedSubcategories={selectedSubcategories}
              onToggle={handleSubcategoryToggle}
              subcategories={subcategories}
              loading={loading}
            />
          </SubcategorySelection>

          <SubcategoryActions
            canProceed={canProceed}
            isNavigating={isNavigating}
            isLoading={isLoading}
            selectedCount={selectedSubcategories?.length || 0}
            onContinue={handleNext}
            onSkip={handleSkip}
          />
        </OnboardingCard>
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
