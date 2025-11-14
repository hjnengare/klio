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
      className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-lg p-4"
    >
      <h3
        className="text-base font-semibold text-charcoal mb-3"
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
      >
        Contact Information
      </h3>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <Phone className="text-navbar-bg" size={16} />
          <span
            className="text-sm text-charcoal/70"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
          >
            +44 20 1234 5678
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Globe className="text-navbar-bg" size={16} />
          <span
            className="text-sm text-charcoal/70"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
          >
            www.example.com
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <MapPin className="text-navbar-bg" size={16} />
          <span
            className="text-sm text-charcoal/70"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
          >
            {event.location}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
