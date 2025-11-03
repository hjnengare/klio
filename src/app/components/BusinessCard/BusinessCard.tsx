"use client";

import React, { useMemo, useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { Image, Star, Edit, Share2, MapPin, Bookmark, Globe, Tag } from "react-feather";
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
  image?: string;
  image_url?: string;
  uploaded_image?: string;
  uploadedImage?: string;
  alt: string;
  category: string;
  location: string;
  rating?: number;
  totalRating?: number;
  reviews: number;
  badge?: string;
  href?: string;
  percentiles?: Percentiles;
  verified?: boolean;
  distance?: string;
  priceRange?: string;
  hasRating?: boolean;
  stats?: {
    average_rating: number;
  };
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  amenity?: string;
  tags?: string[];
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

  const reviewRoute = useMemo(() => `/business/review`, []);

  useEffect(() => {
    router.prefetch(reviewRoute);
  }, [router, reviewRoute]);

  const handleCardClick = () => {
    router.push(`/business/${business.id}`);
  };

  const handleWriteReview = () => router.push(reviewRoute);
  const handleBookmark = () => {
    toggleSavedItem(business.id);
  };
  const handleShare = () => console.log("Share clicked:", business.name);

  // Image fallback logic
  const getDisplayImage = useMemo(() => {
    const uploadedImage = business.uploaded_image || business.uploadedImage;
    if (uploadedImage && 
        typeof uploadedImage === 'string' && 
        uploadedImage.trim() !== '' &&
        !isPngIcon(uploadedImage) &&
        !uploadedImage.includes('/png/')) {
      return { image: uploadedImage, isPng: false };
    }

    if (business.image_url && 
        typeof business.image_url === 'string' && 
        business.image_url.trim() !== '' &&
        !isPngIcon(business.image_url)) {
      return { image: business.image_url, isPng: false };
    }

    if (business.image && 
        typeof business.image === 'string' && 
        business.image.trim() !== '' &&
        !isPngIcon(business.image)) {
      return { image: business.image, isPng: false };
    }

    const categoryPng = getCategoryPng(business.category);
    return { image: categoryPng, isPng: true };
  }, [business.uploaded_image, business.uploadedImage, business.image_url, business.image, business.category]);

  const displayImage = getDisplayImage.image;
  const isImagePng = getDisplayImage.isPng;
  const displayAlt = business.alt || business.name;
  
  const hasRating = business.hasRating !== undefined 
    ? business.hasRating 
    : (business.totalRating !== undefined && business.totalRating > 0) ||
      (business.rating !== undefined && business.rating > 0) ||
      (business?.stats?.average_rating !== undefined && business.stats.average_rating > 0);
  
  const displayRating =
    (typeof business.totalRating === "number" && business.totalRating > 0 && business.totalRating) ||
    (typeof business.rating === "number" && business.rating > 0 && business.rating) ||
    (typeof business?.stats?.average_rating === "number" && business.stats.average_rating > 0 && business.stats.average_rating) ||
    undefined;

  const handleImageError = () => {
    if (!usingFallback && !isImagePng) {
      setUsingFallback(true);
      setImgError(false);
    } else {
      setImgError(true);
    }
  };


  return (
    <li
      id={idForSnap}
      className="snap-start snap-always w-[100vw] sm:w-auto sm:min-w-[25%] md:min-w-[25%] xl:min-w-[25%] flex-shrink-0"
      style={{
        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        fontWeight: 600,
      }}
    >
      <div
        className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-[20px] overflow-hidden group cursor-pointer w-full md:w-[320px] h-[640px] md:h-[450px] flex flex-col border border-white/50 backdrop-blur-md ring-1 ring-white/20 shadow-sm hover:shadow-lg transition-all duration-300"
        style={{
          maxWidth: "540px"
        } as React.CSSProperties}
      >
        {/* MEDIA - More dominant */}
        <div
          className="relative overflow-hidden rounded-t-[20px] flex-[2.5] md:flex-[2] z-10 cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="relative w-full h-full">
            {!imgError && displayImage ? (
              isImagePng || displayImage.includes('/png/') || displayImage.endsWith('.png') || usingFallback ? (
                <div className="w-full h-full flex items-center justify-center bg-off-white/90 rounded-t-[20px]">
                  <OptimizedImage
                    src={usingFallback ? getCategoryPng(business.category) : displayImage}
                    alt={displayAlt}
                    width={320}
                    height={350}
                    sizes="(max-width: 768px) 540px, 320px"
                    className="w-28 h-28 md:w-32 md:h-32 object-contain"
                    priority={false}
                    quality={85}
                    onError={handleImageError}
                  />
                </div>
              ) : (
                <OptimizedImage
                  src={displayImage}
                  alt={displayAlt}
                  width={320}
                  height={350}
                  sizes="(max-width: 768px) 540px, 320px"
                  className="w-full h-full object-cover rounded-t-[20px]"
                  priority={false}
                  quality={85}
                  onError={handleImageError}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-off-white/90 rounded-t-[20px]">
                <div className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                  <OptimizedImage
                    src={getCategoryPng(business.category)}
                    alt={displayAlt}
                    width={128}
                    height={128}
                    sizes="128px"
                    className="w-full h-full object-contain"
                    priority={false}
                    quality={85}
                    onError={() => setImgError(true)}
                  />
                </div>
              </div>
            )}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-sage/10 text-sage rounded-t-[20px]">
                <Image className="w-12 h-12 md:w-16 md:h-16 text-sage/70" />
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
          {!hideStar && hasRating && displayRating !== undefined && (
            <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-xl bg-gradient-to-br from-off-white via-off-white to-off-white/90 backdrop-blur-xl px-3 py-1.5 text-charcoal border border-white/60 ring-1 ring-white/30">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                {Number(displayRating).toFixed(1)}
              </span>
            </span>
          )}
          
          {!hideStar && !hasRating && (
            <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-xl bg-gradient-to-br from-off-white/80 via-off-white/70 to-off-white/60 backdrop-blur-xl px-3 py-1.5 text-charcoal/60 border border-white/40 ring-1 ring-white/20">
              <Star className="w-3.5 h-3.5 text-charcoal/40" />
              <span className="text-xs font-medium" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 500 }}>
                New
              </span>
            </span>
          )}

          {/* actions - desktop only */}
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

        {/* CONTENT - Premium spacing and typography */}
        <div className="px-5 pt-4 pb-1 relative flex-shrink-0 flex-1 flex flex-col justify-start z-10 bg-card-bg">
          {/* Business Name */}
          <div className="cursor-pointer mb-2.5" onClick={handleCardClick}>
            <h3 className="text-base font-normal leading-[1.2] text-charcoal group-hover:text-coral transition-colors duration-300 text-center truncate hover:text-coral" style={{ 
              fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
              fontWeight: 600,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              letterSpacing: '-0.01em',
            
            }}>
              {business.name}
            </h3>
          </div>

          {/* Category */}
          <div className="flex items-center justify-center text-sm leading-[1.3] text-charcoal cursor-pointer mb-2" style={{ 
            fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
            fontWeight: 600,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
            letterSpacing: '0.01em'
          }} onClick={handleCardClick}>
            <span>{business.category}</span>
          </div>

          {/* Address */}
          {(business.address || business.location) && (
            <div className="flex items-center justify-center gap-1.5 text-sm leading-[1.3] text-charcoal/90 cursor-pointer mb-2.5" style={{ 
              fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
              fontWeight: 500,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }} onClick={handleCardClick}>
              <MapPin className="w-3.5 h-3.5 text-charcoal/60 flex-shrink-0" />
              <span className="text-center truncate max-w-full">{business.address || business.location}</span>
            </div>
          )}

          {/* Reviews - Consistent height */}
          <div className="flex items-center justify-center gap-2.5 cursor-pointer group/rating leading-[1.3] mb-2.5 min-h-[20px]" onClick={handleCardClick}>
            {hasRating && displayRating !== undefined ? (
              <>
                <Stars value={displayRating} color="amber-400" />
                <p className="text-sm font-600 leading-none text-charcoal" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 600,
                }}>
                  {business.reviews}
                </p>
                <p className="text-sm leading-none text-charcoal/70" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 600,
                }}>reviews</p>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-[2px] text-[15px] text-charcoal/30">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-[15px] h-[15px] text-charcoal/30" />
                  ))}
                </div>
                <p className="text-sm font-medium text-charcoal/60" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 500,
                }}>
                  No reviews yet
                </p>
              </div>
            )}
          </div>

          {/* Percentile chips - Always visible with consistent spacing */}
          <div className="flex items-center justify-center gap-3 cursor-pointer leading-[1.3] mb-2.5 min-h-[32px]" onClick={handleCardClick}>
            <PercentileChip 
              label="speed" 
              value={business.percentiles?.service || 0} 
            />
            <PercentileChip 
              label="hospitality" 
              value={business.percentiles?.price || 0} 
            />
            <PercentileChip 
              label="quality" 
              value={business.percentiles?.ambience || 0} 
            />
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center justify-center gap-3 mt-3">
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-br from-sage to-sage/90 text-white rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage/40 border border-sage/50 shadow-sm hover:shadow-md transition-all active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                handleWriteReview();
              }}
              aria-label={`Write a review for ${business.name}`}
              style={{ 
                fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                fontWeight: 600,
              }}
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
