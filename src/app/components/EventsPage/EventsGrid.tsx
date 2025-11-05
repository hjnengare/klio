// src/components/EventsPage/EventsGrid.tsx
"use client";

import EventCard from "../EventCard/EventCard";
import { Event } from "../../data/eventsData";

interface EventsGridProps {
  events: Event[];
  onBookmark: (event: Event) => void;
}

export default function EventsGrid({ events, onBookmark }: EventsGridProps) {
  return (
    <div>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-2 lg:gap-3">
          {events.map((event) => (
            <div key={event.id} className="animate-fade-in-up list-none relative group">
              <EventCard event={event} onBookmark={onBookmark} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
