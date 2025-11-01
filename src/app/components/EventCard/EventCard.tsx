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
        <article className="relative bg-card-bg rounded-lg overflow-hidden cursor-pointer w-[calc(100vw-4rem)] sm:w-[252px] md:w-[270px] lg:w-[288px] h-[480px] flex flex-col border border-white/60 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] min-h-[480px]">
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
