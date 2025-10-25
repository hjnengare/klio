"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function LeaderboardTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.15 }}
      className="mb-8 text-center"
    >
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/30">
        <Trophy className="w-7 h-7 text-charcoal" />
      </div>
      <h2 className="font-urbanist text-xl font-600 text-charcoal mb-2">
        Top Contributors This Month
      </h2>
      <p className="font-urbanist text-charcoal/70 text-sm max-w-md mx-auto">
        Celebrating our community&apos;s most valued reviewers and featured businesses
      </p>
    </motion.div>
  );
}
