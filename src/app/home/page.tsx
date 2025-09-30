"use client";

import { memo } from "react";
import Header from "../components/Header/Header";
import { HeroCarousel } from "../components/Hero";
import PromoRow from "../components/PromoRow/PromoRow";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import EventsSpecials from "../components/EventsSpecials/EventsSpecials";
import CommunityHighlights from "../components/CommunityHighlights/CommunityHighlights";
import FeaturedDeal from "../components/FeaturedDeal/FeaturedDeal";
import FloatingElements from "../components/Animations/FloatingElements";
import Footer from "../components/Footer/Footer";
import { useBusinesses, useTrendingBusinesses } from "../hooks/useBusinesses";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import { FEATURED_REVIEWS, TOP_REVIEWERS, BUSINESSES_OF_THE_MONTH } from "../data/communityHighlightsData";

// Memoized BusinessRow component
const MemoizedBusinessRow = memo(BusinessRow);

export default function Home() {
  // Fetch businesses data
  const { businesses: forYouBusinesses } = useBusinesses({ limit: 12 });
  const { businesses: trendingBusinesses } = useTrendingBusinesses(12);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 relative overflow-hidden">
      {/* Header - Transparent at top, overlays hero */}
      <Header showSearch={true} showProfile={true} />

      {/* Hero Section - starts at pixel 0, header overlays it */}
      <HeroCarousel />

      {/* Main content */}
      <div className="relative z-10 bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95">
        {/* Static background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
        </div>

        {/* Floating elements without parallax */}
        <FloatingElements />

        <div className="pt-8 pb-6 relative z-10">
          {/* Promotional highlights */}
          <PromoRow />

          <MemoizedBusinessRow
            title="For You"
            businesses={forYouBusinesses}
            cta="View All"
          />

          <MemoizedBusinessRow
            title="Trending Now"
            businesses={trendingBusinesses}
            cta="View All Trending"
          />

          <EventsSpecials events={EVENTS_AND_SPECIALS} />

          <CommunityHighlights
            reviews={FEATURED_REVIEWS}
            topReviewers={TOP_REVIEWERS}
            businessesOfTheMonth={BUSINESSES_OF_THE_MONTH}
            variant="reviews"
          />

          {/* Featured Deal */}
          <FeaturedDeal />
        </div>

        {/* Footer - only on larger screens */}
        <Footer />
      </div>
    </div>
  );
}