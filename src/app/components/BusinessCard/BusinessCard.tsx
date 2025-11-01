// src/components/BusinessCard/BusinessCard.tsx
"use client";

import React, { useMemo, useState, useEffect, memo } from "react";
// Removed framer-motion for performance
import { useRouter } from "next/navigation";
import { ImageOff, Star, Edit, Heart, Share2, MapPin, Bookmark } from "lucide-react";
import Stars from "../Stars/Stars";
import PercentileChip from "../PercentileChip/PercentileChip";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import OptimizedImage from "../Performance/OptimizedImage";
import { useSavedItems } from "../../contexts/SavedItemsContext";
import { getCategoryPng, isPngIcon } from "../../utils/categoryToPngMapping";

type Percentiles = {
  service: number;
  price: number;
  ambience: number;
};

type Business = {
  id: string;
  name: string;
  image?: string; // Legacy field - can be PNG or uploaded image
  image_url?: string; // Alternative image field for API compatibility
  uploaded_image?: string; // Business uploaded custom image (preferred)
  uploadedImage?: string; // Alternative field name
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

  const [imgError, setImgError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Preload the review route
  const reviewRoute = useMemo(() => `/business/review`, []);

  useEffect(() => {
    router.prefetch(reviewRoute);
  }, [router, reviewRoute]);

  const handleCardClick = () => {
    router.push(`/business/${business.id}`);
  };

  const handleWriteReview = () => router.push(reviewRoute);
  const handleBookmark = () => {
    console.log("Bookmark clicked:", business.name, "ID:", business.id);
    toggleSavedItem(business.id);
  };
  const handleShare = () => console.log("Share clicked:", business.name);

  // Image fallback logic with edge case handling
  const getDisplayImage = useMemo(() => {
    // Priority 1: Check for uploaded business image (not a PNG icon)
    const uploadedImage = business.uploaded_image || business.uploadedImage;
    if (uploadedImage && 
        typeof uploadedImage === 'string' && 
        uploadedImage.trim() !== '' &&
        !isPngIcon(uploadedImage) &&
        !uploadedImage.includes('/png/')) {
      return { image: uploadedImage, isPng: false };
    }

    // Priority 2: Check image_url (API compatibility)
    if (business.image_url && 
        typeof business.image_url === 'string' && 
        business.image_url.trim() !== '' &&
        !isPngIcon(business.image_url)) {
      return { image: business.image_url, isPng: false };
    }

    // Priority 3: Check legacy image field (if not a PNG)
    if (business.image && 
        typeof business.image === 'string' && 
        business.image.trim() !== '' &&
        !isPngIcon(business.image)) {
      return { image: business.image, isPng: false };
    }

    // Priority 4: Fallback to PNG based on category
    const categoryPng = getCategoryPng(business.category);
    return { image: categoryPng, isPng: true };
  }, [business.uploaded_image, business.uploadedImage, business.image_url, business.image, business.category]);

  const displayImage = getDisplayImage.image;
  const isImagePng = getDisplayImage.isPng;
  const displayAlt = business.alt || business.name;
  const displayRating =
    (typeof business.totalRating === "number" && business.totalRating) ||
    (typeof business.rating === "number" && business.rating) ||
    (typeof business?.stats?.average_rating === "number" && business.stats.average_rating) ||
    0;

  // Handle image error - fallback to PNG if uploaded image fails
  const handleImageError = () => {
    if (!usingFallback && !isImagePng) {
      // If uploaded image fails, try category PNG
      setUsingFallback(true);
      setImgError(false); // Reset to try fallback
    } else {
      // PNG also failed or we're already using fallback
      setImgError(true);
    }
  };

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
          className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg overflow-hidden group cursor-pointer w-full md:w-auto h-[720px] md:h-auto flex flex-col border border-white/50 backdrop-blur-md ring-1 ring-white/20 shadow-sm hover:shadow-lg transition-all duration-300"
          style={{
            "--width": "540",
            "--height": "720",
            maxWidth: "540px"
          } as React.CSSProperties}
        >
        {/* MEDIA */}
        <div
          className="relative overflow-hidden rounded-t-lg flex-[2] md:flex-initial z-10 cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="relative w-full h-[540px] md:h-[220px]">
            {!imgError && displayImage ? (
              isImagePng || displayImage.includes('/png/') || displayImage.endsWith('.png') || usingFallback ? (
                // Display PNG files as icons with page background
                <div className="w-full h-[540px] md:h-[220px] flex items-center justify-center bg-off-white/90 rounded-t-lg">
                  <OptimizedImage
                    src={usingFallback ? getCategoryPng(business.category) : displayImage}
                    alt={displayAlt}
                    width={540}
                    height={720}
                    sizes="(max-width: 768px) 540px, 320px"
                    className="w-28 h-28 md:w-28 md:h-28 object-contain"
                    priority={false}
                    quality={85}
                    onError={handleImageError}
                  />
                </div>
              ) : (
                // Regular full image for uploaded business images
                <OptimizedImage
                  src={displayImage}
                  alt={displayAlt}
                  width={540}
                  height={720}
                  sizes="(max-width: 768px) 540px, 320px"
                  className="w-full h-[540px] md:h-[220px] object-cover rounded-t-lg"
                  priority={false}
                  quality={85}
                  onError={handleImageError}
                />
              )
            ) : (
              // Final fallback - show icon placeholder
              <div className="w-full h-[540px] md:h-[220px] flex items-center justify-center bg-off-white/90 rounded-t-lg">
                <div className="w-28 h-28 md:w-28 md:h-28 flex items-center justify-center">
                  <OptimizedImage
                    src={getCategoryPng(business.category)}
                    alt={displayAlt}
                    width={128}
                    height={128}
                    sizes="128px"
                    className="w-full h-full object-contain"
                    priority={false}
                    quality={85}
                    onError={() => {
                      // Even PNG fallback failed
                      setImgError(true);
                    }}
                  />
                </div>
              </div>
            )}
            {/* Show error icon only if all fallbacks failed */}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-sage/10 text-sage rounded-t-lg">
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
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold">
                {Number(displayRating).toFixed(1)}
              </span>
            </span>
          )}

          {/* actions - desktop only (slide-in on hover) */}
          <div
            className="hidden md:flex absolute pt-2 right-2 top-1/2 -translate-y-1/2 z-20 flex-col gap-2 transition-all duration-300 ease-out translate-x-12 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
          >
            <button
              className="w-10 h-10 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30 hover:bg-white transition-colors"
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
              className="w-10 h-10 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30 hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              aria-label={`${isItemSaved(business.id) ? 'Remove from saved' : 'Save'} ${business.name}`}
              title={isItemSaved(business.id) ? 'Remove from saved' : 'Save'}
            >
              <Bookmark
                className={`w-4 h-4 ${isItemSaved(business.id) ? 'text-sage fill-sage' : 'text-primary'}`}
              />
            </button>
            <button
              className="w-10 h-10 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30 hover:bg-white transition-colors"
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
        <div className="px-4 pt-4 pb-6 relative flex-shrink-0 z-10 bg-card-bg">
          <div className="mb-2 cursor-pointer" onClick={handleCardClick}>
            <h3 className="text-sm font-600 text-charcoal group-hover:text-charcoal/80 transition-colors duration-300 text-center font-urbanist truncate">
              {business.name}
            </h3>
          </div>

          <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-charcoal/70 font-urbanist cursor-pointer" onClick={handleCardClick}>
            <span>{business.category}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-charcoal/60" />
              <span>{business.location}</span>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-center gap-2 cursor-pointer" onClick={handleCardClick}>
            <Stars value={displayRating} color="amber-400" />
            <p className="text-xs font-600 leading-none text-charcoal font-urbanist">
              {business.reviews}
            </p>
            <p className="text-xs leading-none text-charcoal/60 font-urbanist">reviews</p>
          </div>

          {business.percentiles && (
            <div className="flex items-center justify-center gap-2 mb-4 cursor-pointer" onClick={handleCardClick}>
              <PercentileChip label="speed" value={business.percentiles.service} />
              <PercentileChip label="hospitality" value={business.percentiles.price} />
              <PercentileChip label="quality" value={business.percentiles.ambience} />
            </div>
          )}

          {/* Mobile actions - always visible on card */}
          <div className="flex md:hidden items-center justify-center gap-3 mt-3">
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-br from-sage to-sage/90 text-white rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage/40 border border-sage/50 shadow-sm hover:shadow-md transition-all active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                handleWriteReview();
              }}
              aria-label={`Write a review for ${business.name}`}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>
            <button
              className="w-9 h-9 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30 shadow-sm hover:shadow-md transition-all active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              aria-label={`${isItemSaved(business.id) ? 'Remove from saved' : 'Save'} ${business.name}`}
            >
              <Bookmark
                className={`w-4 h-4 ${isItemSaved(business.id) ? 'text-sage fill-sage' : 'text-charcoal'}`}
              />
            </button>
            <button
              className="w-9 h-9 bg-gradient-to-br from-off-white via-white to-off-white/95 backdrop-blur-xl rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage/40 border border-white/60 ring-1 ring-white/30 shadow-sm hover:shadow-md transition-all active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              aria-label={`Share ${business.name}`}
            >
              <Share2 className="w-4 h-4 text-charcoal" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default memo(BusinessCard);
export type { Business };
