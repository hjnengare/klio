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
        <article className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-[20px] overflow-hidden cursor-pointer w-[calc(100vw-4rem)] sm:w-[252px] md:w-[277px] lg:w-[288px] h-[450px] flex flex-col border border-white/50 backdrop-blur-md ring-1 ring-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 min-h-[450px]">
          {/* Top Section: Icon, Title, Description */}
          <div className="relative flex flex-col items-center px-6 pt-12 pb-6 flex-shrink-0 bg-gradient-to-b from-transparent to-card-bg/50">
            {/* Badges - At top corners */}
            <EventBadge startDate={event.startDate} endDate={event.endDate} />
            <RatingBadge rating={event.rating} />
            
            {/* Icon */}
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-off-white/60 border border-white/40 shadow-sm">
              <Image
                src={iconPng}
                alt={event.title}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            
            {/* Title */}
            <h3 
              className="text-lg font-bold text-charcoal mb-3 text-center group-hover:text-charcoal transition-colors duration-300"
            >
              {event.title}
            </h3>
            
            {/* Learn More Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/event/${event.id}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-coral to-coral/90 text-white text-sm font-semibold hover:from-coral/90 hover:to-coral/80 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              style={{
                fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                fontWeight: 600,
              }}
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          
          </div>
          
          {/* Bottom Section: Image */}
          <div className="relative flex-1 min-h-[240px] overflow-hidden px-2 pb-4 flex items-end justify-center">
            {event.image ? (
              <>
                <div className="relative w-full max-w-[220px] aspect-square overflow-hidden rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Image
                    src={event.image}
                    alt={event.alt || event.title}
                    fill
                    sizes="(max-width: 768px) 220px, 220px"
                    className="object-cover rounded-full"
                    priority={false}
                  />
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-charcoal/5 to-transparent opacity-60 rounded-full" />
                </div>
              </>
            ) : (
              <div className="relative w-full max-w-[220px] aspect-square overflow-hidden rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] bg-gradient-to-br from-sage/5 to-sage/10 flex items-center justify-center">
                <Image
                  src={iconPng}
                  alt={event.title}
                  width={128}
                  height={128}
                  className="object-contain opacity-50"
                />
              </div>
            )}
          </div>
        </article>
      </Link>
    </li>
  );
}
