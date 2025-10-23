"use client";

import { Event } from "../../data/eventsData";
import EventBanner from "./EventBanner";
import EventContent from "./EventContent";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <li className="snap-start w-[100vw] sm:w-auto sm:min-w-[280px] md:min-w-[300px]">
      <div className="bg-card-bg rounded-2xl overflow-hidden shadow-md group cursor-pointer h-[320px] flex flex-col border border-charcoal/10">
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
    </li>
  );
}