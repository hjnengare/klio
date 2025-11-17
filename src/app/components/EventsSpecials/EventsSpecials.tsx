// src/components/EventsSpecials/EventsSpecials.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "react-feather";
import EventCard from "../EventCard/EventCard";
import { Event } from "../../data/eventsData";
import ScrollableSection from "../ScrollableSection/ScrollableSection";

export default function EventsSpecials({
  title = "Events & Specials",
  events,
  cta = "See More",
  href = "/events-specials",
}: {
  title?: string;
  events: Event[];
  cta?: string;
  href?: string;
}) {
  const router = useRouter();

  if (!events || events.length === 0) return null;

  return (
    <section
      className="relative m-0 w-full"
      aria-label={title}
      data-section
      style={{
        fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      <div className="mx-auto w-full max-w-[2000px] relative z-10 px-2">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2
            className="text-h2 font-semibold text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default"
            style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
          >
            {title}
          </h2>

          <button
            onClick={() => router.push(href)}
            className="group inline-flex items-center gap-1 text-body-sm font-semibold text-navbar-bg/90 transition-all duration-300 hover:text-sage focus:outline-none rounded-full px-4 py-2 -mx-2 relative overflow-hidden"
            aria-label={`${cta}: ${title}`}
            style={{ fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 600 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5 text-navbar-bg/90 group-hover:text-sage">
              {cta}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 text-navbar-bg/90 group-hover:text-sage" />
          </button>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {events.slice(0, 4).map((event) => (
              <div key={event.id} className="list-none flex">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
