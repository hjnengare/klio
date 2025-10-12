"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IoArrowBack, IoHome, IoSearch } from "react-icons/io5";
import FloatingElements from "./components/Animations/FloatingElements";
import PremiumHover from "./components/Animations/PremiumHover";

export default function NotFound() {
  return (
    <div
      className="min-h-dvh relative overflow-hidden flex items-center justify-center px-4 py-8"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Frosty floating elements */}
      <FloatingElements />

      <div className="relative z-10 text-center max-w-2xl mx-auto bg-white/60 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-8 py-12">
        {/* 404 Number */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 mb-2 relative">
            404
            <div className="absolute inset-0 text-gray-400/10 blur-2xl -z-10">404</div>
          </h1>

          <motion.div
            className="absolute -top-4 -right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50"
            initial={{ rotate: -15, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <IoSearch className="w-6 h-6 text-gray-600" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
          The page you're looking for seems to have wandered off. Let's get you back on track!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <PremiumHover scale={1.02}>
            <Link
              href="/interests"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-lg rounded-2xl shadow-lg hover:shadow-xl hover:shadow-gray-800/10 transition-all group"
            >
              <IoHome className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              Go Home
            </Link>
          </PremiumHover>

          <PremiumHover scale={1.02}>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-8 bg-white/80 backdrop-blur-md text-gray-800 text-lg rounded-2xl border border-gray-300/50 shadow-sm hover:shadow-md transition-all group"
            >
              <IoArrowBack className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              Go Back
            </button>
          </PremiumHover>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-gray-300/30">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/interests"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Interests
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/subcategories"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Subcategories
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/register"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
