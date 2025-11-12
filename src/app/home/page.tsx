// ================================
// File: src/app/Home.tsx
// Description: Home page with ALL scroll-reveal removed
// ================================

"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import PromoBar from "../components/PromoBar/PromoBar";
import HeroCarousel from "../components/Hero/HeroCarousel";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import {
  FEATURED_REVIEWS,
  TOP_REVIEWERS,
  BUSINESSES_OF_THE_MONTH,
} from "../data/communityHighlightsData";
import { useOnboarding } from "../contexts/OnboardingContext";
import ToastContainer from "../components/ToastNotification/ToastContainer";
import { useToastNotifications } from "../hooks/useToastNotifications";
import { useForYouBusinesses, useTrendingBusinesses } from "../hooks/useBusinesses";

// Removed any animation / scroll-reveal classes and imports.

const EventsSpecials = dynamic(
  () => import("../components/EventsSpecials/EventsSpecials"),
  {
    loading: () => <div className="h-96 bg-off-white/50" />,
  }
);

const CommunityHighlights = dynamic(
  () => import("../components/CommunityHighlights/CommunityHighlights"),
  {
    loading: () => <div className="h-96 bg-off-white/50" />,
  }
);

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => <div className="h-64 bg-charcoal" />,
});

const MemoizedBusinessRow = memo(BusinessRow);

export default function Home() {
  const { selectedInterests } = useOnboarding();
  const { businesses: forYouBusinesses, loading: forYouLoading, error: forYouError } = useForYouBusinesses(10);
  const { businesses: trendingBusinesses, loading: trendingLoading, error: trendingError } = useTrendingBusinesses(10);
  
  const { notifications, removeNotification } = useToastNotifications({
    interval: 15000, // Show a notification every 15 seconds
    maxToasts: 1,
    enabled: true,
  });

  return (
    <div className="min-h-dvh bg-off-white" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <div className="relative">
        <PromoBar />

        <ToastContainer
          notifications={notifications}
          onRemove={removeNotification}
          position="bottom-left"
          duration={5000}
        />

        <HeroCarousel />
      </div>

      <div className="bg-off-white">
        <div className="pb-12 sm:pb-16 md:pb-20">
          {/* No scroll-reveal wrappers; simple static rendering */}
          {forYouBusinesses.length > 0 && (
            <MemoizedBusinessRow
              title="For You"
              businesses={forYouBusinesses}
              cta="See More"
              href="/for-you"
            />
          )}

          {trendingBusinesses.length > 0 && (
            <MemoizedBusinessRow
              title="Trending Now"
              businesses={trendingBusinesses}
              cta="See More"
              href="/trending"
            />
          )}

          <EventsSpecials events={EVENTS_AND_SPECIALS.slice(0, 5)} />

          <CommunityHighlights
            reviews={FEATURED_REVIEWS}
            topReviewers={TOP_REVIEWERS}
            businessesOfTheMonth={BUSINESSES_OF_THE_MONTH}
            variant="reviews"
          />
        </div>

        <Footer />
      </div>

    </div>
  );
}

// ================================
// File: src/hooks/useScrollReveal.ts
// Description: No-op stub to globally disable scroll reveal without refactors
// ================================

export type ScrollRevealOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * A no-op replacement for any previous scroll-reveal hook.
 * Importing this hook will do nothing, preventing animations.
 */
export function useScrollReveal(_opts?: ScrollRevealOptions) {
  // Intentionally empty — ensures components that call this hook won't throw
  // and will render instantly with no IntersectionObserver created.
  return null;
}

// If you previously had a provider or context for scroll-reveal, consider exporting
// shadowed versions here to avoid breaking imports:
export const ScrollRevealProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>{children}</>
);











