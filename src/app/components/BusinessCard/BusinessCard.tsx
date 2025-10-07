// src/components/BusinessCard/BusinessCard.tsx
"use client";

import Image from "next/image";
import React, { useMemo, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
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
      className="snap-start snap-always w-[100vw] sm:w-auto sm:min-w-[52%] md:min-w-[36%] xl:min-w-[22%] flex-shrink-0"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div className="bg-white rounded-[12px] overflow-hidden shadow-sm group cursor-pointer h-[70vh] sm:h-auto flex flex-col border border-charcoal/10 transition-colors">
        {/* MEDIA */}
        <div
          className="relative overflow-hidden rounded-t-[12px] flex-1 sm:flex-initial"
          onClick={(e) => {
            // On mobile: toggle actions. Desktop: navigate to profile
            if (!isDesktop) {
              toggleActions();
            } else {
              handleCardClick();
            }
          }}
        >
          <motion.div
            animate={{ scale: showActions ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative h-full"
          >
            {!imgError ? (
              <Image
                src={displayImage}
                alt={displayAlt}
                width={400}
                height={320}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-full sm:h-[320px] md:h-[320px] lg:h-[280px] w-full object-cover transition-transform duration-500 md:group-hover:scale-105 rounded-t-[12px]"
                priority={false}
                loading="lazy"
                quality={85}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-full sm:h-[320px] md:h-[320px] lg:h-[280px] w-full flex items-center justify-center bg-sage/10 text-sage rounded-t-[12px]">
                <ImageOff className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-sage/70" />
              </div>
            )}
          </motion.div>

          {/* overlay gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

          {/* shimmer effect */}
          <div className="pointer-events-none absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 md:group-hover:left-full transition-all duration-700 ease-out" />

          {/* verified badge */}
          {business.verified && (
            <div className="absolute left-2 top-2 z-20">
              <VerifiedBadge />
            </div>
          )}

          {/* rating badge */}
          {!hideStar && (
            <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-[8px] bg-white/85 backdrop-blur-sm px-2 py-1 text-charcoal shadow-sm">
              <Star className="w-3.5 h-3.5 text-coral fill-coral drop-shadow-sm" />
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
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              onClick={(e) => {
                e.stopPropagation();
                handleWriteReview();
              }}
              aria-label={`Write a review for ${business.name}`}
              title="Write a review"
            >
              <Edit className="w-4 h-4 text-charcoal" />
            </button>
            <button
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              aria-label={`Save ${business.name}`}
              title="Save"
            >
              <Heart className="w-4 h-4 text-charcoal" />
            </button>
            <button
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              aria-label={`Share ${business.name}`}
              title="Share"
            >
              <Share2 className="w-4 h-4 text-charcoal" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 relative flex-shrink-0 cursor-pointer" onClick={handleCardClick}>
          <div className="mb-1">
            <h3 className="text-base md:text-lg font-bold text-charcoal tracking-tight transition-colors duration-200 md:group-hover:text-sage">
              {business.name}
            </h3>
          </div>

          <p className="mb-3 text-sm font-medium text-charcoal/60 transition-colors duration-200 md:group-hover:text-charcoal/70">
            {business.category} · {business.location}
          </p>

          <div className="mb-4 flex items-center gap-2">
            <Stars value={displayRating} />
            <p className="text-sm font-semibold leading-none text-charcoal">
              {business.reviews}
            </p>
            <p className="text-sm leading-none text-charcoal/60">reviews</p>
          </div>

          {business.percentiles && (
            <div className="flex items-center gap-2">
              <PercentileChip label="Speed" value={business.percentiles.service} />
              <PercentileChip label="Hospitality" value={business.percentiles.price} />
              <PercentileChip label="Quality" value={business.percentiles.ambience} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default memo(BusinessCard);
export type { Business };
