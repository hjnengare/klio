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
      className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4"
    >
      <h2 className="text-sm font-bold text-charcoal mb-4" style={{ fontFamily: '"Changa One", cursive, sans-serif' }}>Event Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Calendar className="text-charcoal/70" size={18} />
          </div>
          <div>
            <p className="text-xs text-charcoal/50" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>Date</p>
            <p className="text-sm font-semibold text-charcoal" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>{event.startDate}</p>
            {event.endDate && (
              <p className="text-xs text-charcoal/60" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>to {event.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Clock className="text-charcoal/70" size={18} />
          </div>
          <div>
            <p className="text-xs text-charcoal/50" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>Duration</p>
            <p className="text-sm font-semibold text-charcoal" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>2-3 hours</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Users className="text-charcoal/70" size={18} />
          </div>
          <div>
            <p className="text-xs text-charcoal/50" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>Capacity</p>
            <p className="text-sm font-semibold text-charcoal" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>Up to 20 people</p>
          </div>
        </div>

        {event.price && (
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-charcoal/70 font-bold text-base">£</span>
            </div>
            <div>
              <p className="text-xs text-charcoal/50" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>Price</p>
              <p className="text-sm font-semibold text-charcoal" style={{ fontFamily: '"Livvic", sans-serif', fontWeight: 600 }}>{event.price}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
