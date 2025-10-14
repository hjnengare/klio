// src/components/BusinessOfTheMonthCard/BusinessOfTheMonthCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageOff, Star, Edit, Bookmark, Share2 } from "lucide-react";
import Stars from "../Stars/Stars";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import { BusinessOfTheMonth } from "../../data/communityHighlightsData";

export default function BusinessOfTheMonthCard({ business }: { business: BusinessOfTheMonth }) {
  const idForSnap = useMemo(() => `business-month-${business.id}`, [business.id]);
  const [imgError, setImgError] = useState(false);

  const displayImage = business.image || (business as any).image_url || "";
  const displayAlt = business.alt || business.name;
  const displayTotal = typeof business.totalRating === "number" ? business.totalRating : (business as any).rating || 0;

  const badgeStyle = (badge: string) => {
    switch (badge) {
      case "winner":
        return "bg-gradient-to-r from-amber-500 to-yellow-600 text-white";
      case "runner-up":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      case "featured":
        return "bg-gradient-to-r from-sage to-sage/80 text-white";
      default:
        return "bg-sage/10 text-sage";
    }
  };

  const badgeIcon = (badge: string) => {
    switch (badge) {
      case "winner":
        return "🏆";
      case "runner-up":
        return "🥈";
      case "featured":
        return "⭐";
      default:
        return "";
    }
  };

  return (
    <li
      id={idForSnap}
      className="snap-start w-[100vw] sm:w-[320px] flex-shrink-0"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div 
        className="bg-white rounded-[12px] overflow-hidden shadow-sm transition-all duration-300 group cursor-pointer h-[70vh] sm:h-auto flex flex-col border border-charcoal/10"
        style={{ "--width": "540", "--height": "720" } as React.CSSProperties}
      >
        {/* Media */}
        <div className="relative overflow-hidden rounded-t-[12px] flex-1 sm:flex-initial">
          {!imgError && displayImage ? (
            <Image
              src={displayImage}
              alt={displayAlt}
              width={400}
              height={320}
              className="h-full sm:h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-[12px]"
              priority={false}
              loading="lazy"
              quality={85}
              onError={() => setImgError(true)}
              sizes="(max-width: 640px) 100vw, 320px"
            />
          ) : (
            <div className="h-full sm:h-[200px] w-full flex items-center justify-center bg-sage/10 text-sage rounded-t-[12px]">
              <ImageOff className="w-12 h-12 md:w-16 md:h-16 text-sage/70" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Shimmer */}
          <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 group-hover:left-full transition-all duration-700 ease-out pointer-events-none" />

          {/* Achievement badge */}
          <div className="absolute left-2 bottom-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold shadow-sm ${badgeStyle(
                business.badge
              )}`}
              aria-label={`${business.monthAchievement} ${business.badge}`}
              title={`${business.monthAchievement} — ${business.badge}`}
            >
              <span>{badgeIcon(business.badge)}</span>
              <span className="drop-shadow-sm">{business.monthAchievement}</span>
            </span>
          </div>

          {/* Verified */}
          {business.verified && (
            <div className="absolute left-2 top-2 z-10">
              <VerifiedBadge />
            </div>
          )}

          {/* Numeric rating */}
          <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-[8px] bg-white/85 backdrop-blur-sm px-2 py-1 text-charcoal shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 drop-shadow-sm" />
            <span className="text-sm font-semibold">{Number(displayTotal).toFixed(1)}</span>
          </span>

          {/* Actions (desktop only) */}
          <div className="hidden sm:flex absolute right-2 bottom-2 z-20 flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Link
              href="/business/review"
              className="w-8 h-8 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              aria-label="Write a review"
              title="Write a review"
            >
              <Edit className="w-4 h-4 md:w-5 md:h-5 text-charcoal" />
            </Link>
            <button
              className="w-8 h-8 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              aria-label="Save"
              title="Save"
            >
              <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-charcoal" />
            </button>
            <button
              className="w-8 h-8 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              aria-label="Share"
              title="Share"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5 text-charcoal" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 relative flex-shrink-0">
          <div className="mb-1">
            <h3 className="text-base md:text-lg font-semibold text-charcoal tracking-tight transition-colors duration-200 group-hover:text-sage">
              <Link href={business.href || "#"} className="hover:underline decoration-2 underline-offset-2">
                {business.name}
              </Link>
            </h3>
          </div>

          <p className="mb-3 text-sm font-medium text-charcoal/70 transition-colors duration-200 group-hover:text-charcoal/80">
            {business.category} • {business.location}
          </p>

          <div className="mb-4 flex items-center gap-2">
            <Stars value={business.rating} />
            <p className="text-sm text-charcoal/70 transition-colors duration-200">
              {business.reviews} reviews
            </p>
          </div>

          {/* Month chip (dynamic if you prefer) */}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-coral/10 text-coral text-xs font-semibold">
              {business.monthLabel || "September Winner"}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
