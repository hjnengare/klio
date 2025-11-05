// src/components/EventDetail/EventDetailsCard.tsx
"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "react-feather";
import { Event } from "../../data/eventsData";

interface EventDetailsCardProps {
  event: Event;
}

export default function EventDetailsCard({ event }: EventDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-lg p-4"
    >
      <h2 className="text-sm font-bold text-charcoal mb-4 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Event Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Calendar className="text-charcoal/70" size={18} />
          </div>
          <div>
            <p className="text-xs text-charcoal/50 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Date</p>
            <p className="text-sm font-semibold text-charcoal font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{event.startDate}</p>
            {event.endDate && (
              <p className="text-xs text-charcoal/60 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>to {event.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Clock className="text-charcoal/70" size={18} />
          </div>
          <div>
            <p className="text-xs text-charcoal/50 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Duration</p>
            <p className="text-sm font-semibold text-charcoal font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>2-3 hours</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Users className="text-charcoal/70" size={18} />
          </div>
          <div>
            <p className="text-xs text-charcoal/50 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Capacity</p>
            <p className="text-sm font-semibold text-charcoal font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Up to 20 people</p>
          </div>
        </div>

        {event.price && (
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-charcoal/70 font-bold text-base">£</span>
            </div>
            <div>
              <p className="text-xs text-charcoal/50 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Price</p>
              <p className="text-sm font-semibold text-charcoal font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{event.price}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
