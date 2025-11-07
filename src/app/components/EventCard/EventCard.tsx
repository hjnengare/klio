"use client";

import { Event } from "../../data/eventsData";
import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "react-feather";
import { getEventIconPng } from "../../utils/eventIconToPngMapping";
import EventBadge from "./EventBadge";
import RatingBadge from "./RatingBadge";

interface EventCardProps {
  event: Event;
  onBookmark?: (event: Event) => void;
}

export default function EventCard({ event, onBookmark }: EventCardProps) {
  const iconPng = getEventIconPng(event.icon);
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(event);
    }
  };
  
  return (
    <li
      className="snap-start snap-always flex-shrink-0"
      style={{
        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        fontWeight: 600,
      }}
    >
      <Link href={`/event/${event.id}`} className="block group">
        <article className="relative overflow-hidden cursor-pointer w-full sm:w-[252px] md:w-[277px] lg:w-[288px] h-[400px] sm:h-[450px] flex flex-col bg-card-bg backdrop-blur-xl border border-white/60 rounded-[12px] shadow-lg hover:shadow-md transition-all duration-500 ease-out hover:-translate-y-1">
          {/* MEDIA - Full bleed with premium overlay */}
          <div className="relative overflow-hidden flex-[2] z-10 rounded-t-[12px]">
            <div className="relative w-full h-full">
              {event.image ? (
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.alt || event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 252px, 288px"
                    className="object-cover"
                    priority={false}
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-off-white/95 to-off-white/85">
                  <div className="w-24 h-24 flex items-center justify-center">
                    <Image
                      src={iconPng}
                      alt={event.title}
                      width={96}
                      height={96}
                      className="object-contain opacity-60"
                      priority={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Premium glass badges */}
            <EventBadge startDate={event.startDate} endDate={event.endDate} />
            <RatingBadge rating={event.rating} />
          </div>

          {/* CONTENT - Minimal, premium spacing */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 relative flex-shrink-0 flex-1 flex flex-col justify-between bg-transparent z-10">
            <div className="flex-1 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full">
                <Image
                  src={iconPng}
                  alt={event.title}
                  width={28}
                  height={28}
                  className="object-contain w-6 h-6 sm:w-7 sm:h-7"
                  priority={false}
                />
              </div>
              
              {/* Title */}
              <h3 
                className="text-sm sm:text-base font-bold leading-tight text-charcoal mb-1.5 sm:mb-2 text-center group-hover:text-coral transition-colors duration-300 line-clamp-2"
                style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 700,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                  letterSpacing: '-0.02em',
                }}
              >
                {event.title}
              </h3>
              
              {/* Description - Apple-like */}
              {event.description && (
                <p className="text-[10px] sm:text-xs font-bold text-charcoal/70 leading-relaxed font-600 text-center line-clamp-2" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 400,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}>
                  {event.description}
                </p>
              )}
            </div>
            
            {/* Bookmark button in info area */}
            {onBookmark && (
              <button
                onClick={handleBookmarkClick}
                className="mt-3 sm:mt-4 w-full min-h-[44px] py-3 sm:py-2 px-4 sm:px-4 bg-off-white/90 backdrop-blur-sm rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-off-white active:scale-95 transition-all duration-200 border border-charcoal/10"
                aria-label="Bookmark event"
                title="Bookmark"
              >
                <Bookmark className="text-coral w-5 h-5 sm:w-[18px] sm:h-[18px]" size={18} />
                <span className="text-sm sm:text-sm font-600 text-coral" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                  Save
                </span>
              </button>
            )}
          </div>
        </article>
      </Link>
    </li>
  );
}
