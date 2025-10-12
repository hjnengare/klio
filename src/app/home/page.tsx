"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header/Header";
import { HeroCarousel } from "../components/Hero";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import { TRENDING_BUSINESSES } from "../data/businessData";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import { FEATURED_REVIEWS, TOP_REVIEWERS, BUSINESSES_OF_THE_MONTH } from "../data/communityHighlightsData";

// Dynamic imports for below-the-fold components
const PromoRow = dynamic(() => import("../components/PromoRow/PromoRow"), {
  loading: () => <div className="h-64 sm:h-80  bg-white/50 animate-pulse" />,
});

const EventsSpecials = dynamic(() => import("../components/EventsSpecials/EventsSpecials"), {
  loading: () => <div className="h-96  bg-white/50 animate-pulse" />,
});

const CommunityHighlights = dynamic(() => import("../components/CommunityHighlights/CommunityHighlights"), {
  loading: () => <div className="h-96  bg-white/50 animate-pulse" />,
});

const FeaturedDeal = dynamic(() => import("../components/FeaturedDeal/FeaturedDeal"), {
  loading: () => <div className="h-96  bg-white/50 animate-pulse" />,
});

const FloatingElements = dynamic(() => import("../components/Animations/FloatingElements"), {
  ssr: false,
});

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => <div className="h-64 bg-charcoal" />,
});

// Memoized BusinessRow component
const MemoizedBusinessRow = memo(BusinessRow);

export default function Home() {
  // Use dummy data - 10 items per section
  const forYouBusinesses = TRENDING_BUSINESSES.slice(0, 10);
  const trendingBusinesses = TRENDING_BUSINESSES.slice(10, 20);

  return (
    <div className="min-h-dvh bg-white relative">
      {/* Header - Frosty glass effect at top, overlays hero */}
      <Header showSearch={true} variant="frosty" />

      {/* Hero Section - starts at pixel 0, header overlays it */}
      <div className="animate-fade-in">
        <HeroCarousel />
      </div>

      {/* Main content */}
      <div className="relative z-10 bg-white/90">
      
        <div className="pt-4 pb-3 relative z-10">
         
          <div className="animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
            <MemoizedBusinessRow
              title="For You"
              businesses={forYouBusinesses}
              cta="Explore For You"
              href="/for-you"
            />
          </div>

          <div className="animate-slide-up-stagger" style={{ animationDelay: '0.2s' }}>
            <MemoizedBusinessRow
              title="Trending Now"
              businesses={trendingBusinesses}
              cta="Explore Trending"
              href="/trending"
            />
          </div>

          <div className="animate-slide-up-stagger" style={{ animationDelay: '0.3s' }}>
            <EventsSpecials events={EVENTS_AND_SPECIALS} />
          </div>

          <div className="animate-slide-up-stagger" style={{ animationDelay: '0.4s' }}>
            <CommunityHighlights
              reviews={FEATURED_REVIEWS}
              topReviewers={TOP_REVIEWERS}
              businessesOfTheMonth={BUSINESSES_OF_THE_MONTH}
              variant="reviews"
            />
          </div>
         
        </div>

        {/* Footer - only on larger screens */}
        <Footer />
      </div>
    </div>
  );
}