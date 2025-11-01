// src/components/EventDetail/EventActionCard.tsx
"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function EventActionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4 sticky top-24"
    >
      <h3 className="text-sm font-bold text-charcoal mb-3 font-urbanist">Join This Event</h3>

      <div className="space-y-3">
        <button className="w-full bg-charcoal text-white font-600 font-urbanist py-3 px-5 rounded-full transition-all duration-300 hover:bg-charcoal/90 hover:shadow-lg text-sm">
          Reserve Your Spot
        </button>

        <button className="w-full bg-white/40 text-charcoal font-600 font-urbanist py-3 px-5 rounded-full transition-all duration-300 hover:bg-charcoal hover:text-white hover:shadow-lg text-sm">
          Contact Organizer
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-charcoal/10">
        <h4 className="text-sm font-semibold text-charcoal/80 mb-2.5 font-urbanist">Share Event</h4>
        <div className="flex gap-2">
          <button className="flex-1 bg-white/30 hover:bg-coral text-charcoal/70 hover:text-white py-2 px-3 rounded-full transition-all duration-200 shadow-sm">
            <Facebook size={16} className="mx-auto" />
          </button>
          <button className="flex-1 bg-white/30 hover:bg-sage text-charcoal/70 hover:text-white py-2 px-3 rounded-full transition-all duration-200 shadow-sm">
            <Instagram size={16} className="mx-auto" />
          </button>
          <button className="flex-1 bg-white/30 hover:bg-charcoal text-charcoal/70 hover:text-white py-2 px-3 rounded-full transition-all duration-200 shadow-sm">
            <Twitter size={16} className="mx-auto" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
