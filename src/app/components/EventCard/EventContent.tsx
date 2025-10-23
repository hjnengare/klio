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
    <div className="p-4 flex-1 flex flex-col text-center group">
      {/* Event title */}
      <h3 className="text-sm sm:text-base font-600 text-transparent bg-clip-text bg-gradient-to-r from-navbar-bg to-navbar-bg/80 group-hover:from-charcoal group-hover:to-charcoal/80 transition-all duration-300 mb-2 line-clamp-2" style={{ fontFamily: "'Lobster Two', cursive" }}>
        {title}
      </h3>

      {/* Location */}
      <p className="text-sm font-600 text-charcoal/70 mb-3 flex items-center justify-center">
        <MapPin className="w-4 h-4 text-sage mr-1.5 flex-shrink-0" aria-hidden="true" />
        <span className="truncate">{location}</span>
      </p>

      {/* Description */}
      {description && (
        <p className="text-sm font-600 text-charcoal/70 leading-relaxed line-clamp-3">
          {description}
        </p>
      )}
    </div>
  );
}
