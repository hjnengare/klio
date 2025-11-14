// src/components/EventDetail/EventDescription.tsx
"use client";

import { motion } from "framer-motion";
import { Event } from "../../data/eventsData";

interface EventDescriptionProps {
  event: Event;
}

export default function EventDescription({ event }: EventDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-lg p-4"
    >
      <h2
        className="text-base font-semibold text-charcoal mb-3"
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
      >
        About This Event
      </h2>
      <p
        className="text-sm text-charcoal/70 leading-relaxed"
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
      >
        {event.description || "Join us for an amazing experience! This event promises to be unforgettable with great company, beautiful surroundings, and memorable moments. Don't miss out on this special opportunity to connect with like-minded people and create lasting memories."}
      </p>
    </motion.div>
  );
}
