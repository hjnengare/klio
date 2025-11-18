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
  const displayPriceRange = priceRange || price_range || '$$';

  return (
    <Link
      href={`/business/${id}`}
      className="group block bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg overflow-hidden border border-white/50 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image Section - Smaller */}
      <div className="relative h-32 sm:h-36 overflow-hidden bg-gradient-to-br from-off-white/95 to-off-white/85">
        {isImagePng ? (
          <div className="w-full h-full flex items-center justify-center">
            <OptimizedImage
              src={displayImage}
              alt={name}
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              priority={false}
              quality={90}
            />
          </div>
        ) : (
          <OptimizedImage
            src={displayImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            quality={85}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Verified badge - Smaller */}
        {verified && (
          <div className="absolute top-2 left-2 z-10 scale-75 origin-top-left">
            <VerifiedBadge />
          </div>
        )}
        
        {/* Rating badge - Smaller */}
        {displayRating > 0 && (
          <div className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-0.5 rounded-full bg-off-white/95 backdrop-blur-sm px-2 py-0.5 text-charcoal border border-white/30">
            <Star className="w-2.5 h-2.5 text-coral fill-coral" aria-hidden />
            <span className="text-[10px] font-semibold text-charcoal" style={{ 
              fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
              fontWeight: 600
            }}>
              {Number(displayRating).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content Section - Compact */}
      <div className="p-3 space-y-1.5">
        {/* Business Name */}
        <h3
          className="text-sm font-bold text-charcoal line-clamp-1 group-hover:text-navbar-bg/90 transition-colors duration-300"
          style={{
            fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            fontWeight: 700,
          }}
        >
          {name}
        </h3>

        {/* Category and Location - Compact */}
        <div className="flex items-center gap-1.5 text-[11px] text-charcoal/60" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          <span className="truncate">{category}</span>
          <span aria-hidden className="text-charcoal/40">·</span>
          <div className="flex items-center gap-0.5 min-w-0">
            <MapPin className="w-2.5 h-2.5 text-navbar-bg/70 flex-shrink-0" strokeWidth={2.5} />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Reviews and Price Range - Compact */}
        <div className="flex items-center justify-between pt-0.5">
          {displayReviews > 0 ? (
            <span className="text-[11px] text-charcoal/60" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              {displayReviews} {displayReviews === 1 ? 'review' : 'reviews'}
            </span>
          ) : (
            <span className="text-[11px] text-charcoal/40 italic" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              No reviews
            </span>
          )}
          {displayPriceRange && (
            <span className="text-[11px] font-semibold text-charcoal/70" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              {displayPriceRange}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

