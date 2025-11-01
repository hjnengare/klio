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
      className="bg-navbar-bg/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-charcoal/10"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Back button */}
          <Link href="/home" className="group flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-3">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white transition-colors duration-300" />
            </div>
            <h1 className="font-urbanist text-base sm:text-xl font-700 text-white transition-all duration-300 group-hover:text-white/80 relative">
              Community Highlights
            </h1>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
