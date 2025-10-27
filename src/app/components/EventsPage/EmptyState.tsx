// src/components/EventsPage/EmptyState.tsx
"use client";

import { Calendar } from "lucide-react";

interface EmptyStateProps {
  filterType: "all" | "event" | "special";
}

export default function EmptyState({ filterType }: EmptyStateProps) {
  const getEmptyMessage = () => {
    switch (filterType) {
      case "event":
        return {
          title: "No events found",
          description: "Check back later for new events!",
        };
      case "special":
        return {
          title: "No specials found",
          description: "Check back later for new specials!",
        };
      default:
        return {
          title: "No events or specials found",
          description: "Check back later for new events and specials!",
        };
    }
  };

  const { title, description } = getEmptyMessage();

  return (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Calendar className="w-7 h-7 text-charcoal" />
      </div>
      <h3 className="font-urbanist font-700 text-lg sm:text-xl text-charcoal/60 mb-2">
        {title}
      </h3>
      <p className="font-urbanist text-sm sm:text-base text-charcoal/40">
        {description}
      </p>
    </div>
  );
}
