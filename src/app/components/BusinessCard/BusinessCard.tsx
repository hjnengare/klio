// src/components/BusinessCard/BusinessCard.tsx
"use client";

import React, { useMemo, useState, useEffect, memo } from "react";
// Removed framer-motion for performance
import { useRouter } from "next/navigation";
import { ImageOff, Star, Edit, Heart, Share2, MapPin } from "lucide-react";
import Stars from "../Stars/Stars";
import PercentileChip from "../PercentileChip/PercentileChip";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import OptimizedImage from "../Performance/OptimizedImage";
import { useSavedItems } from "../../contexts/SavedItemsContext";

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
  const { toggleSavedItem, isItemSaved } = useSavedItems();
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
  const handleBookmark = () => {
    console.log("Bookmark clicked:", business.name, "ID:", business.id);
    toggleSavedItem(business.id);
  };
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
      className="snap-start snap-always w-[100vw] sm:w-auto sm:min-w-[25%] md:min-w-[25%] xl:min-w-[25%] flex-shrink-0"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div
        className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg overflow-hidden group cursor-pointer h-[400px] sm:h-auto flex flex-col border border-white/50 backdrop-blur-md ring-1 ring-white/20"
        style={{ "--width": "540", "--height": "720" } as React.CSSProperties}
      >
        {/* MEDIA */}
        <div
          className="relative overflow-hidden rounded-t-lg flex-1 sm:flex-initial z-10"
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
                // Display PNG files as icons with page background
                <div className="h-[320px] md:h-[220px] w-full flex items-center justify-center bg-off-white/90 rounded-t-lg">
                  <OptimizedImage
                    src={displayImage}
                    alt={displayAlt}
                    width={120}
                    height={120}
                    sizes="120px"
                    className="w-32 h-32 object-contain"
                    priority={false}
                    quality={85}
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                // Regular full image for other businesses
                <OptimizedImage
                  src={displayImage}
                  alt={displayAlt}
                  width={320}
                  height={320}
                  sizes="320px"
                  className="w-full h-[320px] md:h-[220px] object-cover rounded-t-lg"
                  priority={false}
                  quality={85}
                  onError={() => setImgError(true)}
                />
              )
            ) : (
              <div className="h-[320px] md:h-[220px] w-full flex items-center justify-center bg-sage/10 text-sage rounded-t-lg">
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
            <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-xl bg-gradient-to-br from-off-white via-off-white to-off-white/90 backdrop-blur-xl px-3 py-1.5 text-charcoal border border-white/60 ring-1 ring-white/30">
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
              className="w-10 h-10 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30"
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
              className="w-10 h-10 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              aria-label={`${isItemSaved(business.id) ? 'Remove from saved' : 'Save'} ${business.name}`}
              title={isItemSaved(business.id) ? 'Remove from saved' : 'Save'}
            >
              <Heart 
                className={`w-4 h-4 ${isItemSaved(business.id) ? 'text-red-500 fill-red-500' : 'text-primary'}`} 
              />
            </button>
            <button
              className="w-10 h-10 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30"
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
        <div className="px-4 pt-4 pb-6 relative flex-shrink-0 cursor-pointer z-10" onClick={handleCardClick}>
          <div className="mb-2">
            <h3 className="text-sm font-600 text-charcoal group-hover:text-charcoal/80 transition-colors duration-300 text-center font-urbanist truncate">
              {business.name}
            </h3>
          </div>

          <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-charcoal/70 font-urbanist">
            <span>{business.category}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-charcoal/60" />
              <span>{business.location}</span>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-center gap-2">
            <Stars value={displayRating} color="navbar-bg" />
            <p className="text-xs font-600 leading-none text-charcoal font-urbanist">
              {business.reviews}
            </p>
            <p className="text-xs leading-none text-charcoal/60 font-urbanist">reviews</p>
          </div>

          {business.percentiles && (
            <div className="flex items-center justify-center gap-2 mb-2">
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
