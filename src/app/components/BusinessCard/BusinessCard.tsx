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
  compact = false,
}: {
  business: Business;
  hideStar?: boolean;
  compact?: boolean;
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
      className={`snap-start snap-always flex-shrink-0 ${
        compact ? 'w-auto' : 'w-[100vw] sm:w-auto sm:min-w-[25%] md:min-w-[25%] xl:min-w-[25%]'
      }`}
      style={{
        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        fontWeight: 600,
      }}
    >
      <div
        className={`relative overflow-hidden group cursor-pointer w-full flex flex-col bg-card-bg backdrop-blur-xl border border-white/60 rounded-[12px] hover:shadow-md ${
          compact ? 'h-[640px] md:h-[416px]' : 'md:w-[340px] h-[640px] md:h-[520px]'
        }`}
        style={{
          maxWidth: compact ? "100%" : "540px",
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        } as React.CSSProperties}
      >
        {/* Glass depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0"></div>
        {/* MEDIA - Full bleed with premium overlay */}
        <div
          className="relative overflow-hidden flex-[2.5] md:flex-[2.9] lg:flex-[3] z-10 cursor-pointer bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md border border-sage/10 rounded-t-[12px]"
          onClick={handleCardClick}
        >
          <div className="relative w-full h-full">
            {!imgError && displayImage ? (
              isImagePng || displayImage.includes('/png/') || displayImage.endsWith('.png') || usingFallback ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-off-white/95 to-off-white/85">
                  <OptimizedImage
                    src={usingFallback ? getCategoryPng(business.category) : displayImage}
                    alt={displayAlt}
                    width={320}
                    height={350}
                    sizes="(max-width: 768px) 540px, 340px"
                    className="w-32 h-32 md:w-36 md:h-36 object-contain"
                    priority={false}
                    quality={90}
                    onError={handleImageError}
                  />
                </div>
              ) : (
                <div className="relative w-full h-full overflow-hidden">
                <OptimizedImage
                  src={displayImage}
                  alt={displayAlt}
                    width={340}
                    height={400}
                    sizes="(max-width: 768px) 540px, 340px"
                    className="w-full h-full object-cover"
                  priority={false}
                    quality={90}
                  onError={handleImageError}
                />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100" />
                </div>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-off-white/95 to-off-white/85">
                <div className="w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                  <OptimizedImage
                    src={getCategoryPng(business.category)}
                    alt={displayAlt}
                    width={144}
                    height={144}
                    sizes="144px"
                    className="w-full h-full object-contain opacity-60"
                    priority={false}
                    quality={90}
                    onError={() => setImgError(true)}
                  />
                </div>
              </div>
            )}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-off-white/95 to-off-white/85">
                <Image className="w-16 h-16 text-charcoal/20" />
              </div>
            )}
          </div>

          {/* Premium glass badges */}
          {business.verified && (
            <div className="absolute left-4 top-4 z-20">
              <VerifiedBadge />
            </div>
          )}

          {!hideStar && hasRating && displayRating !== undefined && (
            <div className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-2xl bg-off-white/80 backdrop-blur-xl px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/60">
              <Star className="w-3.5 h-3.5 text-coral fill-coral/90" />
              <span className="text-sm font-semibold text-coral/90" style={{ 
                fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                fontWeight: 600,
                letterSpacing: '-0.01em'
              }}>
                {Number(displayRating).toFixed(1)}
              </span>
            </div>
          )}
          
          {!hideStar && !hasRating && (
            <div className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-white/40 backdrop-blur-xl px-3 py-1.5 border border-gray-200">
              <span className="text-xs font-medium text-charcoal" style={{ 
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif', 
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}>
                New
              </span>
            </div>
          )}

          {/* Premium floating actions - desktop only */}
          <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 py-4 px-4 z-20 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
            <button
              className="w-11 h-11 bg-off-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/60 hover:bg-off-white"
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
              className="w-11 h-11 bg-off-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/60 hover:bg-off-white"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              aria-label={`${isItemSaved(business.id) ? 'Remove from saved' : 'Save'} ${business.name}`}
              title={isItemSaved(business.id) ? 'Remove from saved' : 'Save'}
            >
              <Bookmark
                className={`w-4 h-4 ${isItemSaved(business.id) ? 'text-coral fill-coral' : 'text-charcoal'}`}
              />
            </button>
            <button
              className="w-11 h-11 bg-off-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/60 hover:bg-off-white"
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

        {/* CONTENT - Minimal, premium spacing */}
        <div className="px-8 pt-2 pb-4 relative flex-shrink-0 flex-1 flex flex-col justify-between bg-transparent z-10">
          {/* Mobile info button - top right */}
          <div className="md:hidden absolute top-2 right-2 z-20">
            <div className="relative group">
              <button
                className="w-9 h-9 bg-transparent hover:bg-off-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="More options"
              >
                <svg className="w-5 h-5 text-charcoal/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-32 bg-off-white/95 backdrop-blur-xl border border-off-white/60 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-charcoal hover:bg-sage/10 transition-colors"
                  aria-label={`${isItemSaved(business.id) ? 'Remove from saved' : 'Save'} ${business.name}`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isItemSaved(business.id) ? 'text-coral fill-coral' : 'text-charcoal/60'}`}
                  />
                  <span>{isItemSaved(business.id) ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-charcoal hover:bg-sage/10 transition-colors border-t border-off-white/30"
                  aria-label={`Share ${business.name}`}
                >
                  <Share2 className="w-4 h-4 text-charcoal/60" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            {/* Info Wrapper */}
            <div className="relative overflow-hidden" onClick={handleCardClick}>
              {/* Content - Centered */}
              <div className="flex flex-col items-center text-center relative z-10 space-y-1">
                {/* Business Name - Inside wrapper */}
                <div className="cursor-pointer flex items-center justify-center w-full min-h-[40px]" onClick={handleCardClick}>
                  <h3 className="text-base font-bold text-charcoal group-hover:text-coral text-center line-clamp-2 px-2 tracking-tight" style={{ 
                    fontFamily: '"DM Sans", system-ui, sans-serif', 
                    fontWeight: 700,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                    letterSpacing: '-0.02em'
                  }}>
                    {business.name}
                  </h3>
                </div>
                {/* Category and Location - Combined with bullet separator */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-charcoal/70 cursor-pointer min-h-[20px]" style={{ 
            fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
            fontWeight: 600,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
            letterSpacing: '0.01em'
          }} onClick={handleCardClick}>
            <span className="truncate">{business.category}</span>
          {(business.address || business.location) && (
                    <>
                      <span>·</span>
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-charcoal/60 flex-shrink-0" />
                        <span className="truncate">{business.address || business.location}</span>
            </div>
                    </>
          )}
                </div>

                {/* Reviews - Refined */}
                <div className="flex items-center justify-center gap-2 cursor-pointer min-h-[24px]" onClick={handleCardClick}>
            {hasRating && displayRating !== undefined ? (
              <>
                      <div 
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick();
                        }}
                      >
                        <Stars value={displayRating} color="coral/90" />
                      </div>
                      <p className="text-xs font-600 leading-none text-charcoal" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 600,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                }}>
                  {business.reviews}
                </p>
                      <p className="text-xs leading-none text-charcoal/60" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 600,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                }}>reviews</p>
              </>
            ) : (
                    <>
                      <div 
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick();
                        }}
                      >
                        <Stars value={0} color="coral/90" />
                </div>
                      <span className="text-xs text-charcoal/60" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 500,
                }}>
                  No reviews yet
                      </span>
                    </>
            )}
          </div>

                {/* Percentile chips - Inside wrapper */}
                <div className="flex items-center justify-center gap-2 flex-wrap min-h-[32px] pb-3">
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

              </div>
            </div>
          </div>

          {/* Mobile actions - Minimal */}
          <div className="flex md:hidden items-center justify-center pt-4 border-t border-white/20">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navbar-bg/90 text-white rounded-full hover:bg-navbar-bg/80 shadow-sm min-h-[48px]"
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
              <Edit className="w-5 h-5" />
              <span>Review</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default memo(BusinessCard);
export type { Business };
