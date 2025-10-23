"use client";

import { motion } from "framer-motion";

export default function LeaderboardTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.15 }}
      className="text-center mb-8 sm:mb-12 pt-12"
    >
      <h2 className="font-sf text-lg sm:text-xl md:text-2xl font-700 text-charcoal mb-2 sm:mb-4 px-4">
        Top Contributors This Month
      </h2>
      <p className="font-sf text-sm sm:text-base font-400 text-charcoal/70 max-w-2xl mx-auto px-4">
        Celebrating our community&apos;s most valued reviewers and featured businesses
      </p>
    </motion.div>
  );
}
