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
    <li className="snap-start w-[calc(50vw-12px)] sm:w-auto sm:min-w-[280px] md:min-w-[300px]">
      <Link href={`/event/${event.id}`} className="block">
        <div className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 rounded-lg overflow-hidden group cursor-pointer h-[320px] flex flex-col border border-white/50 backdrop-blur-md ring-1 ring-white/20 hover:shadow-xl transition-all duration-300">
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
          </div>
      </Link>
    </li>
  );
}
