// src/components/EventDetail/EventDetailsCard.tsx
"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";
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
      className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 p-6"
    >
      <h2 className="text-2xl font-bold text-charcoal mb-6 font-urbanist">Event Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Calendar className="text-charcoal" size={24} />
          </div>
          <div>
            <p className="text-sm text-charcoal/60 font-urbanist">Date</p>
            <p className="font-semibold text-charcoal font-urbanist">{event.startDate}</p>
            {event.endDate && (
              <p className="text-sm text-charcoal/70 font-urbanist">to {event.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Clock className="text-charcoal" size={24} />
          </div>
          <div>
            <p className="text-sm text-charcoal/60 font-urbanist">Duration</p>
            <p className="font-semibold text-charcoal font-urbanist">2-3 hours</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
            <Users className="text-charcoal" size={24} />
          </div>
          <div>
            <p className="text-sm text-charcoal/60 font-urbanist">Capacity</p>
            <p className="font-semibold text-charcoal font-urbanist">Up to 20 people</p>
          </div>
        </div>

        {event.price && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-charcoal font-bold text-lg">£</span>
            </div>
            <div>
              <p className="text-sm text-charcoal/60 font-urbanist">Price</p>
              <p className="font-semibold text-charcoal font-urbanist">{event.price}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
