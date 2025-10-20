// ================================
// File: src/app/Home.tsx
// Description: Home page with ALL scroll-reveal removed
// ================================

"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header/Header";
import { HeroCarousel } from "../components/Hero";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import { TRENDING_BUSINESSES } from "../data/businessData";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import {
  FEATURED_REVIEWS,
  TOP_REVIEWERS,
  BUSINESSES_OF_THE_MONTH,
} from "../data/communityHighlightsData";
import { useOnboarding } from "../contexts/OnboardingContext";
import NewsletterModal from "../components/NewsletterModal/NewsletterModal";
import { useNewsletterModal } from "../hooks/useNewsletterModal";
import ToastContainer from "../components/ToastNotification/ToastContainer";
import { useToastNotifications } from "../hooks/useToastNotifications";

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
  const forYouBusinesses = TRENDING_BUSINESSES.slice(0, 10);
  const trendingBusinesses = TRENDING_BUSINESSES.slice(10, 20);
  const { showModal, closeModal } = useNewsletterModal({
    threshold: 300,
    scrollUpAmount: 100,
  });
  const { notifications, removeNotification } = useToastNotifications({
    interval: 15000, // Show a notification every 15 seconds
    maxToasts: 3,
    enabled: true,
  });

  return (
    <div className="min-h-dvh bg-off-white">
      <Header showSearch={true} variant="frosty" />

      <NewsletterModal isOpen={showModal} onClose={closeModal} />

      <ToastContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="bottom-right"
        duration={5000}
      />

      <HeroCarousel userInterests={selectedInterests} />

      <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
        <div className="py-8">
            {/* No scroll-reveal wrappers; simple static rendering */}
          <div>
            <MemoizedBusinessRow
              title="For You"
              businesses={forYouBusinesses}
              cta="Explore For You"
              href="/for-you"
            />
          </div>

          <div>
            <MemoizedBusinessRow
              title="Trending Now"
              businesses={trendingBusinesses}
              cta="Explore Trending"
              href="/trending"
            />
          </div>

          <div>
            <EventsSpecials events={EVENTS_AND_SPECIALS} />
          </div>

          <div>
            <CommunityHighlights
              reviews={FEATURED_REVIEWS}
              topReviewers={TOP_REVIEWERS}
              businessesOfTheMonth={BUSINESSES_OF_THE_MONTH}
              variant="reviews"
            />
          </div>
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
