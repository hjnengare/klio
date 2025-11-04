"use client";

import { Event } from "../../data/eventsData";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "react-feather";
import { getEventIconPng } from "../../utils/eventIconToPngMapping";
import EventBadge from "./EventBadge";
import RatingBadge from "./RatingBadge";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const iconPng = getEventIconPng(event.icon);
  
  return (
    <li
      className="snap-start snap-always flex-shrink-0"
      style={{
        fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        fontWeight: 600,
      }}
    >
      <Link href={`/event/${event.id}`} className="block group">
        <article className="relative overflow-hidden cursor-pointer w-[calc(100vw-4rem)] sm:w-[252px] md:w-[277px] lg:w-[288px] h-[450px] flex flex-col bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out hover:-translate-y-1">
          {/* MEDIA - Full bleed with premium overlay */}
          <div className="relative overflow-hidden flex-[2] z-10">
            <div className="relative w-full h-full">
              {event.image ? (
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.alt || event.title}
                    fill
                    sizes="(max-width: 768px) 252px, 288px"
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
          <div className="px-6 pt-5 pb-6 relative flex-shrink-0 flex-1 flex flex-col justify-between bg-transparent z-10">
            <div className="flex-1 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm">
                <Image
                  src={iconPng}
                  alt={event.title}
                  width={28}
                  height={28}
                  className="object-contain"
                  priority={false}
                />
              </div>
              
              {/* Title */}
              <h3 
                className="text-base font-bold leading-tight text-charcoal mb-2 text-center group-hover:text-coral transition-colors duration-300 line-clamp-2"
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
                <p className="text-xs text-charcoal/70 leading-relaxed mb-3 text-center line-clamp-2" style={{ 
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', 
                  fontWeight: 400,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}>
                  {event.description}
                </p>
              )}
              
              {/* Learn More Button - Apple-like */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/event/${event.id}`);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-coral text-white text-sm font-medium hover:bg-coral/95 active:scale-[0.98] transition-all duration-200 shadow-[0_2px_8px_rgba(125,15,42,0.25)] hover:shadow-[0_4px_12px_rgba(125,15,42,0.35)]"
                style={{
                  fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                  fontWeight: 500,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  letterSpacing: '-0.01em',
                }}
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
}
