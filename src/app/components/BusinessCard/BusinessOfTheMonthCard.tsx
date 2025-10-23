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
      className="snap-start snap-always w-[100vw] sm:w-auto sm:min-w-[25%] md:min-w-[25%] xl:min-w-[25%] flex-shrink-0"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div
        className="relative bg-card-bg rounded-[16px] overflow-hidden shadow-md shadow-sage/10 group cursor-pointer h-[70vh] sm:h-auto flex flex-col border border-white/30 transition-all duration-500 hover:shadow-lg hover:shadow-sage/15 hover:border-white/40"
        style={{ "--width": "540", "--height": "720" } as React.CSSProperties}
      >
        {/* Media */}
        <div className="relative overflow-hidden rounded-t-[16px] flex-1 sm:flex-initial z-10">
          {!imgError && displayImage ? (
            <Image
              src={displayImage}
              alt={displayAlt}
              width={400}
              height={320}
              className="h-[500px] md:h-[320px] w-full object-cover transition-transform duration-500 md:group-hover:scale-105 rounded-t-[16px]"
              priority={false}
              loading="lazy"
              quality={85}
              onError={() => setImgError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="h-full sm:h-[320px] md:h-[320px] lg:h-[280px] w-full flex items-center justify-center bg-sage/10 text-sage rounded-t-[16px]">
              <ImageOff className="w-12 h-12 md:w-16 md:h-16 text-sage/70" />
            </div>
          )}


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

          {/* rating badge */}
          <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-[12px] bg-off-white/90 px-3 py-1.5 text-charcoal shadow-lg border border-white/30">
            <Star className="w-3.5 h-3.5 text-navbar-bg fill-navbar-bg" />
            <span className="text-sm font-semibold">
              {Number(displayTotal).toFixed(1)}
            </span>
          </span>

          {/* actions */}
          <div
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 transition-all duration-300 ease-out
              hidden sm:flex translate-x-12 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100`}
          >
            <button
              className="w-10 h-10 bg-off-white/95 rounded-full flex items-center justify-center shadow-lg shadow-sage/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 border border-white/30 hover:shadow-xl hover:shadow-sage/25"
              onClick={(e) => {
                e.stopPropagation();
                // Handle write review
              }}
              aria-label={`Write a review for ${business.name}`}
              title="Write a review"
            >
              <Edit className="w-4 h-4 text-primary" />
            </button>
            <button
              className="w-10 h-10 bg-off-white/95 rounded-full flex items-center justify-center shadow-lg shadow-sage/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 border border-white/30 hover:shadow-xl hover:shadow-sage/25"
              onClick={(e) => {
                e.stopPropagation();
                // Handle bookmark
              }}
              aria-label={`Save ${business.name}`}
              title="Save"
            >
              <Bookmark className="w-4 h-4 text-primary" />
            </button>
            <button
              className="w-10 h-10 bg-off-white/95 rounded-full flex items-center justify-center shadow-lg shadow-sage/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 border border-white/30 hover:shadow-xl hover:shadow-sage/25"
              onClick={(e) => {
                e.stopPropagation();
                // Handle share
              }}
              aria-label={`Share ${business.name}`}
              title="Share"
            >
              <Share2 className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-1 sm:px-4 pt-3 pb-4 relative flex-shrink-0 cursor-pointer z-10">
          <div className="mb-1 text-center">
            <h3 className="text-base sm:text-lg font-600 text-navbar-bg/90 group-hover:text-charcoal transition-colors duration-300 pt-4" style={{ fontFamily: "'Lobster Two', cursive" }}>
                {business.name}
            </h3>
          </div>

          <div className="mb-3 flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-sage/10 px-2.5 py-1 text-xs font-600 text-sage border border-sage/20">
              {business.category}
            </span>
            <span className="text-sm font-600 text-charcoal">
              {business.location}
            </span>
          </div>

          <div className="mb-4 flex items-center justify-center gap-2">
            <Stars value={business.rating} />
            <p className="text-sm font-semibold leading-none text-charcoal">
              {business.reviews}
            </p>
            <p className="text-sm leading-none text-charcoal/60">reviews</p>
          </div>

          {/* Month chip (dynamic if you prefer) */}
          <div className="flex items-center justify-center gap-2">
            <div className="px-2 py-1 rounded-full bg-coral/10 text-coral text-xs font-semibold">
              {(business as any).monthLabel || "September Winner"}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
