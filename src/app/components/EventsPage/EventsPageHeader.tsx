// src/components/EventsPage/EventsPageHeader.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface EventsPageHeaderProps {
  title?: string;
  backHref?: string;
}

const sf = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
} as const;

export default function EventsPageHeader({
  title = "Events & Specials",
  backHref = "/home",
}: EventsPageHeaderProps) {
  return (
    <>
      {/* Google Fonts for logo and typography */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Italianno&family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&family=Shadows+Into+Light&family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg backdrop-blur-xl shadow-lg shadow-sage/5"
        style={sf}
      >
        <div className="relative z-[1] max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <Link href={backHref} className="group flex items-center">
                             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-coral/20 hover:to-coral/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-coral/20 mr-2 sm:mr-4">
                 <ArrowLeft
                   className="text-white group-hover:text-coral transition-colors duration-300"
                   size={22}
                 />
               </div>
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-sf text-base sm:text-xl font-700 text-white transition-all duration-300 group-hover:text-white/80 relative"
              >
                {title}
              </motion.h1>
            </Link>
          </div>
        </div>
      </motion.header>
    </>
  );
}
