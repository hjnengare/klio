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
      className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4"
    >
      <h2 className="text-sm font-bold text-charcoal mb-3 font-urbanist">About This Event</h2>
      <p className="text-sm text-charcoal/70 leading-relaxed font-urbanist">
        {event.description || "Join us for an amazing experience! This event promises to be unforgettable with great company, beautiful surroundings, and memorable moments. Don't miss out on this special opportunity to connect with like-minded people and create lasting memories."}
      </p>
    </motion.div>
  );
}
