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
      <h2
        className="text-base font-semibold text-charcoal mb-4"
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
      >
        Event Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
            <Calendar className="text-navbar-bg" size={18} />
          </div>
          <div>
            <p
              className="text-sm sm:text-xs text-charcoal/60"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.005em' }}
            >
              Date
            </p>
            <p
              className="text-sm font-semibold text-charcoal"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
            >
              {event.startDate}
            </p>
            {event.endDate && (
              <p
                className="text-sm sm:text-xs text-charcoal/60"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.005em' }}
              >
                to {event.endDate}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
            <Clock className="text-navbar-bg" size={18} />
          </div>
          <div>
            <p
              className="text-sm sm:text-xs text-charcoal/60"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.005em' }}
            >
              Duration
            </p>
            <p
              className="text-sm font-semibold text-charcoal"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
            >
              2-3 hours
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
            <Users className="text-navbar-bg" size={18} />
          </div>
          <div>
            <p
              className="text-sm sm:text-xs text-charcoal/60"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.005em' }}
            >
              Capacity
            </p>
            <p
              className="text-sm font-semibold text-charcoal"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
            >
              Up to 20 people
            </p>
          </div>
        </div>

        {event.price && (
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
              <span className="text-navbar-bg font-bold text-base">£</span>
            </div>
            <div>
              <p
                className="text-sm sm:text-xs text-charcoal/60"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.005em' }}
              >
                Price
              </p>
              <p
                className="text-sm font-semibold text-charcoal"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}
              >
                {event.price}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
