// src/components/BusinessCard/BusinessCard.tsx
"use client";

import Image from "next/image";
import React, { useMemo, useState, useEffect, memo } from "react";
// Removed framer-motion for performance
import { useRouter } from "next/navigation";
import { ImageOff, Star, Edit, Heart, Share2 } from "lucide-react";
import Stars from "../Stars/Stars";
import PercentileChip from "../PercentileChip/PercentileChip";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";

type Percentiles = {
  service: number;
  price: number;
  ambience: number;
};

type Business = {
  id: string;
  name: string;
  image: string;
  image_url?: string; // Alternative image field for API compatibility
  alt: string;
  category: string;
  location: string;
  rating: number;
  totalRating: number;
  reviews: number;
  badge?: string;
  href?: string;
  percentiles?: Percentiles;
  verified?: boolean;
  distance?: string;
  priceRange?: string;
  stats?: {
    average_rating: number;
  };
};

function BusinessCard({
  business,
  hideStar = false,
}: {
  business: Business;
  hideStar?: boolean;
}) {
  const router = useRouter();
  const idForSnap = useMemo(() => `business-${business.id}`, [business.id]);

  const [showActions, setShowActions] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Preload the review route
  const reviewRoute = useMemo(() => `/business/review`, []);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 640);
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    router.prefetch(reviewRoute);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, [router, reviewRoute]);

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
    if (!isDesktop) setShowActions((s) => !s);
  };

  const handleCardClick = () => {
    router.push(`/business/${business.id}`);
  };

  const handleWriteReview = () => router.push(reviewRoute);
  const handleBookmark = () => console.log("Bookmark clicked:", business.name);
  const handleShare = () => console.log("Share clicked:", business.name);

  // Fallbacks for image + rating
  const displayImage = business.image_url || business.image;
  const displayAlt = business.alt || business.name;
  const displayRating =
    (typeof business.totalRating === "number" && business.totalRating) ||
    (typeof business.rating === "number" && business.rating) ||
    (typeof business?.stats?.average_rating === "number" && business.stats.average_rating) ||
    0;

  return (
    <li
      id={idForSnap}
      className="snap-start snap-always w-[100vw] sm:w-auto sm:min-w-[28%] md:min-w-[28%] xl:min-w-[28%] flex-shrink-0"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div
        className="relative bg-card-bg rounded-[16px] overflow-hidden shadow-md shadow-sage/10 group cursor-pointer h-[70vh] sm:h-auto flex flex-col border border-white/30 transition-all duration-500 hover:shadow-lg hover:shadow-sage/15 hover:border-white/40"
        style={{ "--width": "540", "--height": "720" } as React.CSSProperties}
      >
        {/* MEDIA */}
        <div
          className="relative overflow-hidden rounded-t-[16px] flex-1 sm:flex-initial z-10"
          onClick={(e) => {
            // On mobile: toggle actions. Desktop: navigate to profile
            if (!isDesktop) {
              toggleActions();
            } else {
              handleCardClick();
            }
          }}
        >
          <div className="relative h-full">
            {!imgError ? (
              displayImage?.endsWith('.png') ? (
                // Display PNG files as icons with white background
                <div className="h-[500px] md:h-[320px] w-full flex items-center justify-center bg-white rounded-t-[16px]">
                  <Image
                    src={displayImage}
                    alt={displayAlt}
                    width={120}
                    height={120}
                    sizes="120px"
                    className="w-32 h-32 object-contain"
                    priority={false}
                    loading="lazy"
                    quality={85}
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                // Regular full image for other businesses
                <Image
                  src={displayImage}
                  alt={displayAlt}
                  width={320}
                  height={320}
                  sizes="320px"
                  className="w-full h-[500px] md:h-[320px] object-cover transition-transform duration-500 rounded-t-[16px]"
                  priority={false}
                  loading="lazy"
                  quality={85}
                  onError={() => setImgError(true)}
                />
              )
            ) : (
              <div className="h-[500px] md:h-[320px] w-full flex items-center justify-center bg-sage/10 text-sage rounded-t-[16px]">
                <ImageOff className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-sage/70" />
              </div>
            )}
          </div>



          {/* verified badge */}
          {business.verified && (
            <div className="absolute left-2 top-2 z-20">
              <VerifiedBadge />
            </div>
          )}

          {/* rating badge */}
          {!hideStar && (
            <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-[12px] bg-off-white/90 backdrop-blur-xl px-3 py-1.5 text-charcoal shadow-lg border border-white/30">
              <Star className="w-3.5 h-3.5 text-navbar-bg fill-navbar-bg" />
              <span className="text-sm font-semibold">
                {Number(displayRating).toFixed(1)}
              </span>
            </span>
          )}

          {/* actions */}
          <div
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 transition-all duration-300 ease-out
              ${
                isDesktop
                  ? "hidden sm:flex translate-x-12 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
                  : showActions
                  ? "flex translate-x-0 opacity-100"
                  : "flex translate-x-12 opacity-0 pointer-events-none"
              }`}
          >
            <button
              className="w-10 h-10 bg-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg shadow-sage/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 border border-white/30 hover:shadow-xl hover:shadow-sage/25"
              onClick={(e) => {
                e.stopPropagation();
                handleWriteReview();
              }}
              aria-label={`Write a review for ${business.name}`}
              title="Write a review"
            >
              <Edit className="w-4 h-4 text-primary" />
            </button>
            <button
              className="w-10 h-10 bg-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg shadow-sage/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 border border-white/30 hover:shadow-xl hover:shadow-sage/25"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              aria-label={`Save ${business.name}`}
              title="Save"
            >
              <Heart className="w-4 h-4 text-primary" />
            </button>
            <button
              className="w-10 h-10 bg-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg shadow-sage/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 border border-white/30 hover:shadow-xl hover:shadow-sage/25"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              aria-label={`Share ${business.name}`}
              title="Share"
            >
              <Share2 className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-3 sm:px-6 pt-3 pb-6 relative flex-shrink-0 cursor-pointer z-10" onClick={handleCardClick}>
          <div className="mb-1">
            <h3 className="text-base sm:text-lg font-600 text-navbar-bg/90 group-hover:text-charcoal transition-colors duration-300 text-center pt-4" style={{ fontFamily: "'Lobster Two', cursive" }}>
              {business.name}
            </h3>
          </div>

          <p className="mb-3 text-sm font-600 text-charcoal transition-colors duration-300 text-center">
            {business.category} · {business.location}
          </p>

          <div className="mb-4 flex items-center justify-center gap-2">
            <Stars value={displayRating} color="navbar-bg" />
            <p className="text-sm font-600 leading-none text-charcoal">
              {business.reviews}
            </p>
            <p className="text-sm font-600 leading-none text-charcoal/60">reviews</p>
          </div>

          {business.percentiles && (
            <div className="flex items-center justify-center gap-2">
              <PercentileChip label="speed" value={business.percentiles.service} />
              <PercentileChip label="hospitality" value={business.percentiles.price} />
              <PercentileChip label="quality" value={business.percentiles.ambience} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default memo(BusinessCard);
export type { Business };
