// src/components/EventDetail/EventContactInfo.tsx
"use client";

import { motion } from "framer-motion";
import { Phone, Globe, MapPin } from "lucide-react";
import { Event } from "../../data/eventsData";

interface EventContactInfoProps {
  event: Event;
}

export default function EventContactInfo({ event }: EventContactInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 p-6"
    >
      <h3 className="text-xl font-bold text-charcoal mb-4 font-urbanist">Contact Information</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Phone className="text-charcoal" size={18} />
          <span className="text-charcoal/80 font-urbanist">+44 20 1234 5678</span>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="text-charcoal" size={18} />
          <span className="text-charcoal/80 font-urbanist">www.example.com</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="text-charcoal" size={18} />
          <span className="text-charcoal/80 font-urbanist">{event.location}</span>
        </div>
      </div>
    </motion.div>
  );
}
