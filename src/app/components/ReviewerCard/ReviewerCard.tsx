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
  const [showActions, setShowActions] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if we're on desktop after component mounts
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Handle click outside to close actions on mobile
  useEffect(() => {
    if (!isDesktop && showActions) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(`#${idForSnap}`)) {
          setShowActions(false);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showActions, isDesktop, idForSnap]);

  const toggleActions = () => {
    if (!isDesktop) setShowActions(!showActions);
  };

  if (variant === "reviewer" || reviewer) {
    return (
      <div
        id={idForSnap}
        className="snap-start snap-always w-[100vw] sm:w-[280px] flex-shrink-0"
      >
        <div
          className="bg-white rounded-2xl overflow-hidden shadow-md group cursor-pointer h-[200px] relative border border-charcoal/10"
          onClick={toggleActions}
        >
          {/* Content */}
          <div className="relative z-10 p-4 h-full flex flex-col">
            {/* Header with small profile pic and rating */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {!imgError && reviewerData?.profilePicture ? (
                  <div className="relative">
                    <Image
                      src={reviewerData.profilePicture}
                      alt={reviewerData?.name || "User avatar"}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-md"
                      priority={false}
                      onError={() => setImgError(true)}
                    />
                    {/* Verified badge */}
                    {reviewerData?.badge === "verified" && (
                      <div className="absolute -right-0.5 -top-0.5 z-20">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="text-white" size={12} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-sage/20 text-sage rounded-full border-2 border-white shadow-md">
                    <User className="text-sage/70" size={18} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-sf text-sm font-700 text-charcoal truncate">
                    {reviewerData?.name}
                  </h3>
                  <p className="font-sf text-xs font-600 text-charcoal/60">
                    {reviewerData?.location}
                  </p>
                </div>
              </div>

            </div>

            {/* Stats */}
            <div className="mb-3">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="font-sf font-800 text-lg text-charcoal">
                    {reviewerData?.reviewCount}
                  </div>
                  <div className="font-sf text-xs text-charcoal/60">Reviews</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-1 flex-wrap">
                {reviewerData?.badge && (
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-sf font-600 flex items-center gap-1 ${
                      reviewerData.badge === "top"
                        ? "bg-amber-100 text-amber-700"
                        : reviewerData.badge === "verified"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-sage/10 text-sage"
                    }`}
                  >
                    {reviewerData.badge === "top" ? (
                      <Trophy size={12} />
                    ) : reviewerData.badge === "verified" ? (
                      <Check size={12} />
                    ) : (
                      <MapPin size={12} />
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
                    className={`px-2 py-1 rounded-full text-xs font-sf font-600 flex items-center gap-1 ${
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
                      <Trophy size={12} />
                    ) : reviewerData.trophyBadge === "silver" ? (
                      <Medal size={12} />
                    ) : reviewerData.trophyBadge === "bronze" ? (
                      <Medal size={12} />
                    ) : reviewerData.trophyBadge === "rising-star" ? (
                      <Star size={12} />
                    ) : (
                      <Heart size={12} />
                    )}
                    <span className="sr-only">
                      {reviewerData.trophyBadge}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions - simplified */}
              <div
                className={`flex gap-1 transition-all duration-300 ease-out
                ${
                  isDesktop
                    ? "opacity-0 group-hover:opacity-100"
                    : showActions
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <button
                  className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Follow"
                  title="Follow"
                >
                  <UserPlus className="text-charcoal" size={16} />
                </button>
                <button
                  className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Message"
                  title="Message"
                >
                  <MessageCircle className="text-charcoal" size={16} />
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
    <li className="snap-start snap-always w-[100vw] sm:w-auto sm:min-w-[320px] flex-shrink-0">
      <div
        className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 group cursor-pointer h-[280px] flex flex-col relative overflow-hidden border border-charcoal/10"
        onClick={toggleActions}
      >
        <div className="flex items-start gap-4 mb-4">
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
            <h3 className="font-sf font-700 text-charcoal truncate">
              {review?.reviewer.name}
            </h3>
            <ReviewerStats
              reviewCount={review?.reviewer.reviewCount || 0}
              location={review?.reviewer.location || ""}
            />
          </div>

          {/* Card Actions - mobile: show on click, desktop: show on hover */}
          <div
            className={`absolute right-4 top-4 z-20 flex-col gap-2 transition-all duration-300 ease-out
            ${
              isDesktop
                ? "hidden sm:flex translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                : showActions
                ? "flex translate-x-0 opacity-100"
                : "flex translate-x-12 opacity-0 pointer-events-none"
            }`}
          >
            <button
              className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
              aria-label="Follow"
              title="Follow"
            >
              <UserPlus className="text-charcoal" size={20} />
            </button>
            <button
              className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
              aria-label="Message"
              title="Message"
            >
              <MessageCircle className="text-charcoal" size={20} />
            </button>
            <button
              className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
              aria-label="Share"
              title="Share"
            >
              <Share2 className="text-charcoal" size={20} />
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
