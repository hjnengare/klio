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
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4 font-urbanist">
        {event.title}
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1">
          <Star className="text-yellow-500 fill-current" size={20} />
          <span className="text-lg font-semibold text-charcoal font-urbanist">{event.rating}</span>
        </div>
        <div className="flex items-center gap-2 text-charcoal/70">
          <MapPin size={18} />
          <span className="font-medium font-urbanist">{event.location}</span>
        </div>
      </div>
    </motion.div>
  );
}
