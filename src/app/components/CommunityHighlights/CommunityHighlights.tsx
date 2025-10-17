// src/components/CommunityHighlights/CommunityHighlights.tsx
"use client";

import { useRouter } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";
import ReviewerCard from "../ReviewerCard/ReviewerCard";
import BusinessOfTheMonthCard from "../BusinessCard/BusinessOfTheMonthCard";
import ScrollableSection from "../ScrollableSection/ScrollableSection";
import {
  Review,
  Reviewer,
  BusinessOfTheMonth,
} from "../../data/communityHighlightsData";

interface CommunityHighlightsProps {
  title?: string;
  reviews: Review[];
  topReviewers: Reviewer[];
  businessesOfTheMonth?: BusinessOfTheMonth[];
  cta?: string;
  href?: string;
  variant?: "reviews" | "reviewers";
}

export default function CommunityHighlights({
  title = "Community Highlights",
  reviews,
  topReviewers,
  businessesOfTheMonth,
  cta = "See Leaderboard",
  href = "/leaderboard",
  variant = "reviews",
}: CommunityHighlightsProps) {
  const router = useRouter();

  if (
    (!topReviewers || topReviewers.length === 0) &&
    (!businessesOfTheMonth || businessesOfTheMonth.length === 0)
  ) {
    return null;
  }

  return (
    <section
      className="relative"
      aria-label={title}
      data-section
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Subtle section decoration (non-interactive) */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-xl" />
      </div>

      <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 md:px-8 relative z-10 py-4">
        {/* Header */}
        <div className="mb-3 sm:mb-5 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="text-xl font-semibold text-charcoal tracking-tight">
            {title}
          </h2>

          <button
            onClick={() => router.push(href)}
            className="group inline-flex items-center gap-1 text-base font-semibold text-charcoal/70 transition-all duration-300 hover:text-sage focus:outline-none focus:ring-2 focus:ring-sage/30 rounded-full px-4 py-2 -mx-2 relative overflow-hidden"
            aria-label={`${cta}: ${title}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5">
              {cta}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Top Reviewers */}
        {topReviewers && topReviewers.length > 0 && (
          <div className="mt-4 sm:mt-5 md:mt-6">
            <div className="mb-2 sm:mb-3 flex flex-wrap items-center justify-between gap-[18px]">
              <h3 className="text-base font-semibold text-charcoal">
                Top Reviewers This Month In Claremont
              </h3>
            </div>

            <ScrollableSection>
              {topReviewers.map((reviewer) => (
                <ReviewerCard
                  key={reviewer.id}
                  reviewer={reviewer}
                  variant="reviewer"
                />
              ))}
            </ScrollableSection>
          </div>
        )}

        {/* Businesses of the Month */}
        {businessesOfTheMonth && businessesOfTheMonth.length > 0 && (
          <div className="mt-4 sm:mt-5 md:mt-6">
            <div className="mb-2 sm:mb-3 flex flex-wrap items-center justify-between gap-[18px]">
              <h3 className="text-base font-semibold text-charcoal">
                Businesses of the Month
              </h3>
            </div>

            <div className="mb-3 sm:mb-4 text-center">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-coral/15 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-coral/20 shadow-lg shadow-coral/10">
                <Trophy className="w-4 h-4 text-coral" />
                <span className="font-semibold text-coral text-sm">
                  September 2025 Winners
                </span>
              </div>
            </div>

            <ScrollableSection className="list-none">
              {businessesOfTheMonth.map((business) => (
                <BusinessOfTheMonthCard
                  key={business.id}
                  business={business}
                />
              ))}
            </ScrollableSection>
          </div>
        )}
      </div>
    </section>
  );
}
