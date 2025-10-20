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
    <div className="p-4 flex-1 flex flex-col">
      {/* Event title */}
      <h3 className="text-lg font-semibold text-charcoal mb-2 line-clamp-2">
        {title}
      </h3>

      {/* Location */}
      <p className="text-sm text-charcoal/60 mb-3 flex items-center">
        <MapPin className="w-4 h-4 text-sage mr-1.5 flex-shrink-0" aria-hidden="true" />
        <span className="truncate">{location}</span>
      </p>

      {/* Description */}
      {description && (
        <p className="text-sm text-charcoal/60 leading-relaxed line-clamp-3">
          {description}
        </p>
      )}
    </div>
  );
}
