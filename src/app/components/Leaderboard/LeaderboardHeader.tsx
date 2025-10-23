"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LeaderboardHeader() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
      className="bg-navbar-bg/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-charcoal/10"
    >
      <div className="relative z-[1] max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Back button */}
          <Link href="/home" className="group flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center border border-charcoal/5 hover:border-sage/20 mr-2 sm:mr-4"
            >
              <ArrowLeft className="text-lg sm:text-xl text-charcoal/70 group-hover:text-sage transition-colors duration-300" />
            </motion.div>
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
              className="font-sf text-sm font-700 text-white transition-all duration-300 group-hover:text-white/80 relative"
            >
              Community Highlights
            </motion.h1>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
