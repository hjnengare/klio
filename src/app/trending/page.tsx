"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import Footer from "../components/Footer/Footer";
import { TRENDING_BUSINESSES } from "../data/businessData";

// ✅ lucide-react icons
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// Use Trending Now businesses (items 10–19 from TRENDING_BUSINESSES)
const trendingBusinesses: Business[] = TRENDING_BUSINESSES.slice(10, 20);
const ITEMS_PER_PAGE = 8;

export default function TrendingPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(trendingBusinesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBusinesses = trendingBusinesses.slice(startIndex, endIndex);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-white via-sage/[0.015] to-white relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
        {/* Premium gradient overlay for glassy effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(116,145,118,0.025),transparent_60%),radial-gradient(ellipse_at_top_right,rgba(214,116,105,0.02),transparent_60%)]" />
      </div>

      {/* Header with spring animation */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg shadow-sm"
      >
        <div className="relative z-[1] max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <Link href="/home" className="group flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-2 sm:mr-3">
                <ArrowLeft
                  size={22}
                  className="text-white group-hover:text-white transition-colors duration-300"
                />
              </div>
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-urbanist text-base sm:text-xl font-700 text-white transition-all duration-300 relative"
              >
                Trending Now
              </motion.h1>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-6 sm:pb-8 md:pb-12">
        <div className="max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="px-2 sm:px-4 pt-3 sm:pt-4 pb-1" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-charcoal/60">
              <li>
                <Link href="/home" className="hover:text-charcoal transition-colors font-urbanist">
                  Home
                </Link>
              </li>
              <li className="text-charcoal/40">/</li>
              <li className="text-charcoal font-medium font-urbanist">Trending Now</li>
            </ol>
          </nav>

          {/* Main Headline */}
          <h1 className="text-sm font-bold text-charcoal mb-1 text-center font-urbanist">
            Trending Now
          </h1>

          {/* Sub-headline */}
          <p className="text-xs text-charcoal/70 text-center max-w-2xl mx-auto font-urbanist leading-relaxed">
            Discover what&apos;s popular and trending in your area right now
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="pb-12 sm:pb-16 md:pb-20 relative z-10">
        {/* Results count */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-2">
          <div className="max-w-[1300px] mx-auto">
            <p className="font-urbanist text-sm text-charcoal/60">
              Showing {currentBusinesses.length} trending businesses
            </p>
          </div>
        </div>

        {/* Business grid */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-[1300px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBusinesses.map((business) => (
                <div key={business.id} className="animate-fade-in-up list-none">
                  <BusinessCard business={business} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-sage/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous page"
                  title="Previous"
                >
                  <ChevronLeft className="text-charcoal/70" size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-urbanist font-600 text-sm transition-all duration-200 ${
                      currentPage === page
                        ? "bg-sage text-white"
                        : "border border-charcoal/20 text-charcoal/70 hover:bg-sage/5"
                    }`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-sage/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next page"
                  title="Next"
                >
                  <ChevronRight className="text-charcoal/70" size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
