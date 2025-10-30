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
    <div className="pt-4 relative flex-shrink-0 z-10 flex flex-col justify-between h-full">
      <div>
        <div>
          <h3 className="text-lg font-bold text-charcoal group-hover:text-coral transition-colors duration-300 text-center font-urbanist line-clamp-1 min-h-[2.5rem]">
            {title}
          </h3>
        </div>

        <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-charcoal/70 font-urbanist">
          <MapPin className="w-3 h-3 text-charcoal/70" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm font-600 text-charcoal/90 leading-relaxed line-clamp-3 text-center font-urbanist min-h-[3.75rem]">
          {description}
        </p>
      )}
    </div>
  );
}
