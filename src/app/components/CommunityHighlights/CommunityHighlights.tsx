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
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >

      <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-urbanist text-sm sm:text-base font-600 text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default">
            {title}
          </h2>

          <button
            onClick={() => router.push(href)}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primary/80 transition-all duration-300 hover:text-sage focus:outline-none focus:ring-2 focus:ring-sage/30 rounded-full px-4 py-2 -mx-2 relative overflow-hidden"
            aria-label={`${cta}: ${title}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5">
              {cta}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Top Reviewers */}
        {topReviewers && topReviewers.length > 0 && (
          <div className="mt-1">
            <div className="mb-0.5 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-urbanist text-sm sm:text-base font-600 text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default">
                Top Reviewers This Month In Claremont
              </h3>
            </div>

            <ScrollableSection className="gap-3">
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
          <div className="mt-3">
            <div className="mb-0.5 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-urbanist text-sm sm:text-base font-600 text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default">
                Businesses of the Month by Category
              </h3>
            </div>

            <div className="mb-2 text-center">
              <div className="inline-flex items-center gap-1.5 bg-coral/15 rounded-full px-3 py-1.5 border border-coral/20 shadow-lg shadow-coral/10">
                <Trophy className="w-3.5 h-3.5 text-coral" />
                <span className="font-semibold text-coral text-xs">
                  September 2025 Winners
                </span>
              </div>
              <p className="mt-1 text-xs text-primary/70">
                Top-rated businesses competing within their categories
              </p>
            </div>

            <ScrollableSection className="list-none gap-3">
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
