// src/components/EventDetail/EventContactInfo.tsx
"use client";

import { motion } from "framer-motion";
import { Phone, Globe, MapPin } from "react-feather";
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
      className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4"
    >
      <h3 className="text-sm font-bold text-charcoal mb-3 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Contact Information</h3>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <Phone className="text-charcoal/70" size={16} />
          <span className="text-sm text-charcoal/70 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>+44 20 1234 5678</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Globe className="text-charcoal/70" size={16} />
          <span className="text-sm text-charcoal/70 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>www.example.com</span>
        </div>
        <div className="flex items-center gap-2.5">
          <MapPin className="text-charcoal/70" size={16} />
          <span className="text-sm text-charcoal/70 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{event.location}</span>
        </div>
      </div>
    </motion.div>
  );
}
