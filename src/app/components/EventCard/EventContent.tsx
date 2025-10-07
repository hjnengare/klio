// src/components/EventCard/EventContent.tsx
"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

interface EventContentProps {
  title: string;
  location: string;
  description?: string;
  href?: string;
}

export default function EventContent({ title, location, description, href }: EventContentProps) {
  return (
    <div
      className="p-4 relative flex-1 flex flex-col justify-between"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Top content */}
      <div className="space-y-2">
        {/* Event title */}
        <h3 className="text-base sm:text-lg font-semibold text-charcoal transition-colors duration-200 md:group-hover:text-sage leading-snug line-clamp-2">
          <Link
            href={href || "#"}
            className="md:hover:underline decoration-2 underline-offset-2 focus:outline-none focus:ring-2 focus:ring-sage/30 rounded-sm"
          >
            {title}
          </Link>
        </h3>

        {/* Location */}
        <p className="text-sm font-medium text-charcoal/70 transition-colors duration-200 md:group-hover:text-charcoal/80 flex items-center line-clamp-1">
          <MapPin className="w-4 h-4 text-sage mr-1.5 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </p>
      </div>

      {/* Description (bottom-aligned for balance) */}
      {description && (
        <p className="mt-3 text-sm font-normal text-charcoal/60 leading-relaxed line-clamp-3">
          {description}
        </p>
      )}
    </div>
  );
}
