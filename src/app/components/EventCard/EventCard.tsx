"use client";

import { Event } from "../../data/eventsData";
import EventBanner from "./EventBanner";
import EventContent from "./EventContent";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <li
      className="snap-start snap-always flex-shrink-0"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <Link href={`/event/${event.id}`} className="block group">
        <article className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-[20px] overflow-hidden cursor-pointer w-[calc(100vw-4rem)] sm:w-[252px] md:w-[270px] lg:w-[288px] flex flex-col border border-white/50 backdrop-blur-md ring-1 ring-white/20 shadow-sm hover:shadow-lg transition-all duration-300">
          <EventBanner
            image={event.image}
            alt={event.alt}
            icon={event.icon}
            title={event.title}
            rating={event.rating}
            startDate={event.startDate}
            endDate={event.endDate}
          />

          <EventContent
            title={event.title}
            location={event.location}
            description={event.description}
            href={event.href}
          />
        </article>
      </Link>
    </li>
  );
}
