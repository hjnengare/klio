"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "react-feather";

export default function ReviewHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10 animate-slide-in-top"
      role="banner"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
        <nav className="flex items-center justify-between" aria-label="Write review navigation">
          <Link
            href="/home"
            className="group flex items-center focus:outline-none rounded-lg px-1 -mx-1"
            aria-label="Go back to home"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-2 sm:mr-3" aria-hidden="true">
              <ArrowLeft className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
            </div>
            <h1 className="font-urbanist text-sm sm:text-base font-700 text-white animate-delay-100 animate-fade-in" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              Write a Review
            </h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Reviews Button */}
            <Link
              href="/discover/reviews"
              className="bg-sage/20 hover:bg-sage/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
              aria-label="Discover reviews"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Discover Reviews</span>
            </Link>

            {/* Home Button */}
            <Link
              href="/home"
              className="bg-sage/20 hover:bg-sage/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
              aria-label="Go to home"
            >
              <Home className="w-3 h-3" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
