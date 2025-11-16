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
import BusinessRowSkeleton from "../components/BusinessRow/BusinessRowSkeleton";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import {
  FEATURED_REVIEWS,
  TOP_REVIEWERS,
} from "../data/communityHighlightsData";
import { useOnboarding } from "../contexts/OnboardingContext";
import { useBusinesses, useForYouBusinesses, useTrendingBusinesses } from "../hooks/useBusinesses";
import { useRoutePrefetch } from "../hooks/useRoutePrefetch";

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
  const { businesses: allBusinesses } = useBusinesses({ limit: 200, sortBy: "total_rating", sortOrder: "desc", feedStrategy: "mixed" });

  const featuredByCategory = (() => {
    if (!allBusinesses || allBusinesses.length === 0) return [];

    const byCategory = new Map<string, any>();

    const getDisplayRating = (b: any) =>
      (typeof b.totalRating === "number" && b.totalRating) ||
      (typeof b.rating === "number" && b.rating) ||
      (typeof b?.stats?.average_rating === "number" && b.stats.average_rating) ||
      0;

    const getReviews = (b: any) =>
      (typeof b.reviews === "number" && b.reviews) ||
      (typeof b.total_reviews === "number" && b.total_reviews) ||
      0;

    const toTitle = (value?: string) =>
      (value || "Business")
        .toString()
        .split(/[-_]/)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");

    for (const b of allBusinesses) {
      const cat = (b.category || "Business") as string;
      const existing = byCategory.get(cat);
      if (!existing || getDisplayRating(b) > getDisplayRating(existing)) {
        byCategory.set(cat, b);
      }
    }

    const results = Array.from(byCategory.entries()).map(([cat, b]) => {
      const rating = getDisplayRating(b);
      const reviews = getReviews(b);
      const categoryLabel = toTitle(b.subInterestLabel || cat);
      return {
        id: b.id,
        name: b.name,
        image: b.image || b.image_url || b.uploaded_image || b.uploadedImage || "",
        alt: b.alt || b.name,
        category: b.category || "Business",
        location: b.location || b.address || "Cape Town",
        rating: rating > 0 ? 5 : 0,
        totalRating: rating,
        reviews,
        badge: "featured" as const,
        href: `/business/${b.id}`,
        monthAchievement: `Featured ${categoryLabel}`,
        verified: Boolean(b.verified),
      };
    });

    results.sort((a, b) => b.totalRating - a.totalRating || b.reviews - a.reviews);
    return results;
  })();
  useRoutePrefetch([
    "/for-you",
    "/trending",
    "/discover/reviews",
    "/events-specials",
    "/explore",
    "/write-review",
    "/saved",
  ]);
  const hasForYouBusinesses = forYouBusinesses.length > 0;
  const hasTrendingBusinesses = trendingBusinesses.length > 0;
  const hasInterestSelections = selectedInterests.length > 0;
  
  return (
    <div className="min-h-dvh bg-off-white" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <div className="relative">
        <PromoBar />

        <HeroCarousel />
      </div>

      <div className="bg-off-white">
        <div className="pb-12 sm:pb-16 md:pb-20">
          {/* No scroll-reveal wrappers; simple static rendering */}
          {forYouLoading && <BusinessRowSkeleton title="For You" />}
          {!forYouLoading && hasForYouBusinesses && (
            <MemoizedBusinessRow title="For You" businesses={forYouBusinesses} cta="See More" href="/for-you" />
          )}
          {!forYouLoading && !hasForYouBusinesses && !forYouError && (
            <div className="mx-auto w-full max-w-[2000px] px-2 py-4 text-sm text-charcoal/70">
              {hasInterestSelections
                ? "We’re curating businesses for you based on your interests. Check back shortly."
                : "We’re gathering recommendations for you. Once you pick a few interests, this row will instantly feel more personalized."}
            </div>
          )}
          {forYouError && !forYouLoading && (
            <div className="mx-auto w-full max-w-[2000px] px-2 py-4 text-sm text-coral">
              Couldn’t load personalized picks right now. We’ll retry in the background.
            </div>
          )}

          {trendingLoading && <BusinessRowSkeleton title="Trending Now" />}
          {!trendingLoading && hasTrendingBusinesses && (
            <MemoizedBusinessRow title="Trending Now" businesses={trendingBusinesses} cta="See More" href="/trending" />
          )}
          {trendingError && !trendingLoading && (
            <div className="mx-auto w-full max-w-[2000px] px-2 py-4 text-sm text-coral">
              Trending businesses are still loading. Refresh to try again.
            </div>
          )}

          <EventsSpecials events={EVENTS_AND_SPECIALS.slice(0, 5)} />

          <CommunityHighlights
            reviews={FEATURED_REVIEWS}
            topReviewers={TOP_REVIEWERS}
            businessesOfTheMonth={featuredByCategory}
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











