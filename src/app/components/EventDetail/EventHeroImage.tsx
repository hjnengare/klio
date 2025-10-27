// src/components/EventDetail/EventHeroImage.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Event } from "../../data/eventsData";

interface EventHeroImageProps {
  event: Event;
  isLiked: boolean;
  onLike: () => void;
}

export default function EventHeroImage({
  event,
  isLiked,
  onLike,
}: EventHeroImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg border border-white/50"
    >
      <Image
        src={event.image || "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=500&fit=crop&crop=center"}
        alt={event.alt || event.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Event Type Badge */}
      <div className="absolute top-6 left-6">
        <span className={`px-4 py-2 rounded-full text-sm font-600 font-urbanist backdrop-blur-md border shadow-sm ${
          event.type === "event"
            ? "bg-coral/90 text-white border-coral/50"
            : "bg-sage/90 text-white border-sage/50"
        }`}>
          {event.type === "event" ? "Event" : "Special"}
        </span>
      </div>

      {/* Like Button */}
      <button
        onClick={onLike}
        className={`absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 ${
          isLiked
            ? "bg-red-500/90 text-white border-red-500/50"
            : "bg-white/20 text-white border-white/30 hover:bg-white/30"
        }`}
        aria-label="Like event"
      >
        <Heart className={`mx-auto ${isLiked ? "fill-current" : ""}`} size={20} />
      </button>
    </motion.div>
  );
}
