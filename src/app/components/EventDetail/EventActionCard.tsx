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
      className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 p-6 sticky top-24"
    >
      <h3 className="text-xl font-bold text-charcoal mb-4 font-urbanist">Join This Event</h3>

      <div className="space-y-4">
        <button className="w-full bg-charcoal text-white font-600 font-urbanist py-3.5 px-6 rounded-full transition-all duration-300 hover:bg-charcoal/90 hover:shadow-lg">
          Reserve Your Spot
        </button>

        <button className="w-full bg-white/40 text-charcoal font-600 font-urbanist py-3.5 px-6 rounded-full transition-all duration-300 hover:bg-charcoal hover:text-white hover:shadow-lg">
          Contact Organizer
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-charcoal/10">
        <h4 className="font-semibold text-charcoal mb-3 font-urbanist">Share Event</h4>
        <div className="flex gap-3">
          <button className="flex-1 bg-black/0 hover:bg-blue-600 text-charcoal/90 py-2.5 px-4 rounded-full transition-all duration-200 shadow-sm">
            <Facebook size={18} className="mx-auto" />
          </button>
          <button className="flex-1 bg-black/0 hover:bg-pink-600 text-charcoal/90 py-2.5 px-4 rounded-full transition-all duration-200 shadow-sm">
            <Instagram size={18} className="mx-auto" />
          </button>
          <button className="flex-1 bg-black/0 hover:bg-sky-600 text-charcoal/90 py-2.5 px-4 rounded-full transition-all duration-200 shadow-sm">
            <Twitter size={18} className="mx-auto" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
