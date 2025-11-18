"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "react-feather";
import { getCategoryPng, isPngIcon } from "../../utils/categoryToPngMapping";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import OptimizedImage from "../Performance/OptimizedImage";

interface SimilarBusinessCardProps {
  id: string;
  name: string;
  image?: string;
  image_url?: string;
  uploaded_image?: string;
  category: string;
  location: string;
  rating?: number;
  totalRating?: number;
  reviews?: number;
  total_reviews?: number;
  verified?: boolean;
  priceRange?: string;
  price_range?: string;
}

export default function SimilarBusinessCard({
  id,
  name,
  image,
  image_url,
  uploaded_image,
  category,
  location,
  rating,
  totalRating,
  reviews,
  total_reviews,
  verified,
  priceRange,
  price_range,
}: SimilarBusinessCardProps) {
  // Determine display image
  const displayImage = uploaded_image || image_url || image || getCategoryPng(category);
  const isImagePng = isPngIcon(displayImage) || displayImage.includes('/png/');
  const displayRating = rating || totalRating || 0;
  const displayReviews = reviews || total_reviews || 0;

  return (
    <Link
      href={`/business/${id}`}
      className="group block bg-gradient-to-br from-off-white/90 via-off-white/85 to-off-white/90 rounded-xl overflow-hidden border border-white/60 backdrop-blur-xl shadow-lg relative transition-transform duration-300 hover:scale-125 hover:z-10"
    >
      {/* Glass depth overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Image Section - Larger */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-off-white/95 to-off-white/85 rounded-t-xl">
        {isImagePng ? (
          <div className="w-full h-full flex items-center justify-center">
            <OptimizedImage
              src={displayImage}
              alt={name}
              width={100}
              height={100}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              priority={false}
              quality={90}
            />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={displayImage}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              quality={85}
            />
          </div>
        )}
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        
        {/* Verified badge */}
        {verified && (
          <div className="absolute top-2.5 left-2.5 z-10 scale-75 origin-top-left">
            <VerifiedBadge />
          </div>
        )}
        
        {/* Rating badge */}
        {displayRating > 0 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-0.5 rounded-full bg-off-white/95 backdrop-blur-md px-2.5 py-1 text-charcoal border border-white/40 shadow-md">
            <Star className="w-3 h-3 text-navbar-bg fill-navbar-bg" aria-hidden strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-charcoal" style={{ 
              fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
              fontWeight: 700
            }}>
              {Number(displayRating).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content Section - Premium */}
      <div className="p-4 space-y-2 relative z-10 bg-gradient-to-b from-transparent to-off-white/30">
        {/* Business Name */}
        <h3
          className="text-sm font-bold text-charcoal line-clamp-1 group-hover:text-navbar-bg transition-colors duration-300"
          style={{
            fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          {name}
        </h3>

        {/* Category and Location - Refined */}
        <div className="flex items-center gap-1.5 text-[11px] text-charcoal/70" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          <span className="truncate font-medium">{category}</span>
          <span aria-hidden className="text-charcoal/40">·</span>
          <div className="flex items-center gap-0.5 min-w-0">
            <MapPin className="w-3 h-3 text-navbar-bg/80 flex-shrink-0" strokeWidth={2.5} />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex items-center pt-1 border-t border-white/30">
          {displayReviews > 0 ? (
            <span className="text-[11px] text-charcoal/70 font-medium" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              {displayReviews} {displayReviews === 1 ? 'review' : 'reviews'}
            </span>
          ) : (
            <span className="text-[11px] text-charcoal/50 italic" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              No reviews
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

