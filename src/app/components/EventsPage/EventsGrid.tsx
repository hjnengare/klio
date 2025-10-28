// src/components/EventsPage/EventsGrid.tsx
"use client";

import { Bookmark } from "lucide-react";
import EventCard from "../EventCard/EventCard";
import { Event } from "../../data/eventsData";

interface EventsGridProps {
  events: Event[];
  onBookmark: (event: Event) => void;
}

export default function EventsGrid({ events, onBookmark }: EventsGridProps) {
  return (
    <div>
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {events.map((event) => (
            <div key={event.id} className="animate-fade-in-up list-none relative group">
              <EventCard event={event} />
              {/* Bookmark button - always visible on mobile, hover on desktop */}
              <button
                onClick={() => onBookmark(event)}
                className="absolute top-2 right-2 w-10 h-10 bg-off-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-off-white active:scale-95 sm:hover:scale-110 z-20"
                aria-label="Bookmark event"
                title="Bookmark"
              >
                <Bookmark className="text-coral" size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
