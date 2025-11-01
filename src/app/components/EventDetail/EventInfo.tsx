// src/components/EventDetail/EventInfo.tsx
"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Event } from "../../data/eventsData";

interface EventInfoProps {
  event: Event;
}

export default function EventInfo({ event }: EventInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <h1 className="text-sm font-bold text-charcoal mb-3 font-urbanist">
        {event.title}
      </h1>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <Star className="text-amber-400 fill-amber-400" size={16} />
          <span className="text-sm font-semibold text-charcoal font-urbanist">
            {event.rating}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-charcoal/70">
          <MapPin size={14} />
          <span className="text-xs font-medium font-urbanist">
            {event.location}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
