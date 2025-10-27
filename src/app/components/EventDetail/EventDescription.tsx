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
      className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 p-6"
    >
      <h2 className="text-2xl font-bold text-charcoal mb-4 font-urbanist">About This Event</h2>
      <p className="text-charcoal/80 leading-relaxed font-urbanist">
        {event.description || "Join us for an amazing experience! This event promises to be unforgettable with great company, beautiful surroundings, and memorable moments. Don't miss out on this special opportunity to connect with like-minded people and create lasting memories."}
      </p>
    </motion.div>
  );
}
