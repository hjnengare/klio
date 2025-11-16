// src/components/CommunityHighlights/CommunityHighlights.tsx
"use client";

import { useRouter } from "next/navigation";
import { Award, ArrowRight } from "react-feather";
import ReviewerCard from "../ReviewerCard/ReviewerCard";
import BusinessOfTheMonthCard from "../BusinessCard/BusinessOfTheMonthCard";
import ScrollableSection from "../ScrollableSection/ScrollableSection";
import {
  Review,
  Reviewer,
  BusinessOfTheMonth,
} from "../../data/communityHighlightsData";

// Sample review texts for variety
const sampleReviewTexts = [
  "Absolutely love this place! Great atmosphere and amazing service. Will definitely come back!",
  "The best spot in town! Quality is top-notch and the staff is incredibly friendly.",
  "Hidden gem discovered! Food was incredible and the ambiance is perfect for a relaxed evening.",
  "Outstanding experience! Every detail was perfect, from service to quality. Highly recommend!",
  "Wow, just wow! Exceeded all my expectations. This is my new favorite spot in the area.",
  "Incredible find! Great value for money and the atmosphere is unbeatable. Can't wait to return!",
  "Perfect place for a date night! Romantic ambiance, delicious food, and excellent service.",
  "Top tier quality! The attention to detail here is amazing. Will be a regular customer for sure.",
  "Fantastic experience all around! Staff went above and beyond to make our visit memorable.",
  "This place never disappoints! Consistent quality and friendly service every single time.",
  "Amazing spot with great vibes! The perfect blend of quality, service, and atmosphere.",
  "Exceptional! From the moment we walked in, everything was perfect. Must visit!"
];

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
  cta = "See More",
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
      className="relative m-0 w-full"
      aria-label={title}
      data-section
      style={{
        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >

      <div className="mx-auto w-full max-w-[2000px] relative z-10 px-2">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            className="text-sm font-600 text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
          >
            {title}
          </h2>

          <button
            onClick={() => router.push(href)}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-navbar-bg/90 transition-all duration-300 hover:text-sage focus:outline-none rounded-full px-4 py-2 -mx-2 relative overflow-hidden"
            aria-label={`${cta}: ${title}`}
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 600 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5 text-navbar-bg/90 group-hover:text-sage">
              {cta}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 text-navbar-bg/90 group-hover:text-sage" />
          </button>
        </div>

        {/* Top Reviewers */}
        {topReviewers && topReviewers.length > 0 && (
          <div className="mt-1">
            <div className="mb-2 flex justify-center">
              <h3
                className="text-xs font-600 text-charcoal px-4 sm:px-6 py-2 backdrop-blur-md border border-white/50 rounded-full shadow-lg text-center"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
              >
                Top Reviewers This Month In Claremont
              </h3>
            </div>

            <ScrollableSection>
              <div className="flex gap-1 sm:gap-3 py-2">
                {topReviewers.map((reviewer, index) => {
                // Try to find an actual review first, otherwise use sample text
                const actualReview = reviews.find(r => r.reviewer.id === reviewer.id);
                const reviewIndex = parseInt(reviewer.id) % sampleReviewTexts.length;
                const sampleText = sampleReviewTexts[reviewIndex];
                
                return (
                  <div
                    key={reviewer.id}
                    className={`list-none flex-shrink-0 w-[calc(50vw-0.5rem)] sm:w-auto ${
                      index === 1 ? 'pointer-events-none sm:pointer-events-auto' : ''
                    }`}
                  >
                    <ReviewerCard
                      reviewer={reviewer}
                      variant="reviewer"
                      latestReview={actualReview || {
                        id: `${reviewer.id}-latest`,
                        reviewer,
                        businessName: `${reviewer.location} Favorite`,
                        businessType: "Local Business",
                        rating: reviewer.rating,
                        reviewText: sampleText,
                        date: index < 3 ? `${index + 1} days ago` : `${index + 1} weeks ago`,
                        likes: Math.floor((reviewer.reviewCount * 0.3) + 5)
                      }}
                    />
                  </div>
                );
              })}
              </div>
            </ScrollableSection>
          </div>
        )}

        {/* Businesses of the Month */}
        {businessesOfTheMonth && businessesOfTheMonth.length > 0 && (
          <div className="mt-3">
            <div className="mb-2 flex justify-center">
              <h3
                className="text-xs font-600 text-charcoal px-4 sm:px-6 py-2 backdrop-blur-md border border-white/50 rounded-full shadow-lg text-center"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
              >
                Featured Businesses of the Month by Category
              </h3>
            </div>
            <ScrollableSection>
              <div className="flex gap-3 py-2">
                {businessesOfTheMonth.map((business) => (
                  <BusinessOfTheMonthCard
                    key={business.id}
                    business={business}
                  />
                ))}
              </div>
            </ScrollableSection>
          </div>
        )}
      </div>
    </section>
  );
}
