"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { Review, Reviewer } from "../../data/communityHighlightsData";
import ProfilePicture from "./ProfilePicture";
import ReviewerStats from "./ReviewerStats";
import ReviewContent from "./ReviewContent";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";

// lucide-react icons
import {
  User,
  Star,
  Check,
  UserPlus,
  MessageCircle,
  Share2,
  MapPin,
  Trophy,
  Medal,
  Heart,
} from "lucide-react";

interface ReviewerCardProps {
  review?: Review;
  reviewer?: Reviewer;
  variant?: "reviewer" | "review";
}

export default function ReviewerCard({
  review,
  reviewer,
  variant = "review",
}: ReviewerCardProps) {
  const reviewerData = reviewer || review?.reviewer;
  const idForSnap = useMemo(
    () => `reviewer-${reviewerData?.id}`,
    [reviewerData?.id]
  );
  const [imgError, setImgError] = useState(false);

  if (variant === "reviewer" || reviewer) {
    return (
      <div
        id={idForSnap}
        className="snap-start snap-always w-[calc(50vw-1rem)] sm:w-[187px] flex-shrink-0"
      >
        <div
          className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg overflow-hidden group cursor-pointer h-[133px] relative border border-white/50 backdrop-blur-md ring-1 ring-white/20"
        >
          {/* Content */}
          <div className="relative z-10 p-2 h-full flex flex-col">
            {/* Header with small profile pic and rating */}
            <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                {!imgError && reviewerData?.profilePicture ? (
                  <div className="relative">
                    <Image
                      src={reviewerData.profilePicture}
                      alt={reviewerData?.name || "User avatar"}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-cover rounded-full border-2 border-white ring-2 ring-white/50"
                      priority={false}
                      onError={() => setImgError(true)}
                    />
                    {/* Verified badge */}
                    {reviewerData?.badge === "verified" && (
                      <div className="absolute -right-0.5 -top-0.5 z-20">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center ring-1 ring-white/50">
                          <Check className="text-white" size={8} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-sage/20 text-sage rounded-full border-2 border-white ring-2 ring-white/50">
                    <User className="text-sage/70" size={14} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-urbanist text-xs font-600 text-charcoal truncate">
                    {reviewerData?.name}
                  </h3>
                  <p className="font-urbanist text-xs text-charcoal/70">
                    {reviewerData?.location}
                  </p>
                </div>
              </div>

            </div>

            {/* Stats */}
            <div className="mb-1">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="font-urbanist font-600 text-xs text-charcoal">
                    {reviewerData?.reviewCount}
                  </div>
                  <div className="font-urbanist text-[10px] text-charcoal/70">Reviews</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-1 flex-wrap">
                {reviewerData?.badge && (
                  <div
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-urbanist font-600 flex items-center gap-0.5 ${
                      reviewerData.badge === "top"
                        ? "bg-amber-100 text-amber-700"
                        : reviewerData.badge === "verified"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-sage/10 text-sage"
                    }`}
                  >
                    {reviewerData.badge === "top" ? (
                      <Trophy size={10} />
                    ) : reviewerData.badge === "verified" ? (
                      <Check size={10} />
                    ) : (
                      <MapPin size={10} />
                    )}
                    <span className="sr-only">
                      {reviewerData.badge === "top"
                        ? "Top"
                        : reviewerData.badge === "verified"
                        ? "Verified"
                        : "Local"}
                    </span>
                  </div>
                )}

                {reviewerData?.trophyBadge && (
                  <div
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-urbanist font-600 flex items-center gap-0.5 ${
                      reviewerData.trophyBadge === "gold"
                        ? "bg-yellow-50 text-yellow-700"
                        : reviewerData.trophyBadge === "silver"
                        ? "bg-gray-50 text-gray-700"
                        : reviewerData.trophyBadge === "bronze"
                        ? "bg-orange-50 text-orange-700"
                        : reviewerData.trophyBadge === "rising-star"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-pink-50 text-pink-700"
                    }`}
                  >
                    {reviewerData.trophyBadge === "gold" ? (
                      <Trophy size={10} />
                    ) : reviewerData.trophyBadge === "silver" ? (
                      <Medal size={10} />
                    ) : reviewerData.trophyBadge === "bronze" ? (
                      <Medal size={10} />
                    ) : reviewerData.trophyBadge === "rising-star" ? (
                      <Star size={10} />
                    ) : (
                      <Heart size={10} />
                    )}
                    <span className="sr-only">
                      {reviewerData.trophyBadge}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions - always visible on mobile, slide-in on desktop */}
              <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 border border-white/60 ring-1 ring-white/30 shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Follow"
                  title="Follow"
                >
                  <UserPlus className="text-primary w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button
                  className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 border border-white/60 ring-1 ring-white/30 shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Message"
                  title="Message"
                >
                  <MessageCircle className="text-primary w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- REVIEW CARD VARIANT ---
  return (
    <li className="w-[calc(50vw-12px)] sm:w-auto sm:min-w-[213px] flex-shrink-0">
      <div
        className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg group cursor-pointer h-[187px] flex flex-col relative overflow-hidden border border-white/50 backdrop-blur-md ring-1 ring-white/20"
      >
        <div className="flex items-start gap-1.5 mb-2 p-2">
          <div className="relative">
            <ProfilePicture
              src={review?.reviewer.profilePicture || ""}
              alt={review?.reviewer.name || ""}
              size="md"
              badge={review?.reviewer.badge}
            />
            {/* Verified badge for profile picture */}
            {review?.reviewer.badge === "verified" && (
              <div className="absolute -right-1 -top-1 z-20">
                <VerifiedBadge />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-urbanist text-xs font-600 text-charcoal truncate">
              {review?.reviewer.name}
            </h3>
            <ReviewerStats
              reviewCount={review?.reviewer.reviewCount || 0}
              location={review?.reviewer.location || ""}
            />
          </div>

          {/* Card Actions - always visible on mobile, slide-in on desktop */}
          <div className="absolute right-2 top-2 md:right-2 md:top-1/2 md:-translate-y-1/2 z-20 flex flex-row md:flex-col gap-1 md:gap-2 transition-all duration-300 ease-out md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
            <button
              className="w-7 h-7 md:w-9 md:h-9 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 border border-white/60 ring-1 ring-white/30 shadow-sm"
              onClick={(e) => e.stopPropagation()}
              aria-label="Follow"
              title="Follow"
            >
              <UserPlus className="text-primary w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button
              className="w-7 h-7 md:w-9 md:h-9 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 border border-white/60 ring-1 ring-white/30 shadow-sm"
              onClick={(e) => e.stopPropagation()}
              aria-label="Message"
              title="Message"
            >
              <MessageCircle className="text-primary w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button
              className="w-7 h-7 md:w-9 md:h-9 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 border border-white/60 ring-1 ring-white/30 shadow-sm"
              onClick={(e) => e.stopPropagation()}
              aria-label="Share"
              title="Share"
            >
              <Share2 className="text-primary w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>

        <ReviewContent
          businessName={review?.businessName || ""}
          businessType={review?.businessType || ""}
          reviewText={review?.reviewText || ""}
          date={review?.date || ""}
          likes={review?.likes || 0}
          images={review?.images}
        />
      </div>
    </li>
  );
}
