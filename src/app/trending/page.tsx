"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import Footer from "../components/Footer/Footer";
import { ArrowLeft, ChevronLeft, ChevronRight } from "react-feather";
import { useTrendingBusinesses } from "../hooks/useBusinesses";

const ITEMS_PER_PAGE = 8;

export default function TrendingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { businesses: trendingBusinesses, loading } = useTrendingBusinesses(50); // Fetch more for pagination

  const totalPages = useMemo(() => Math.ceil(trendingBusinesses.length / ITEMS_PER_PAGE), [trendingBusinesses.length]);
  const currentBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return trendingBusinesses.slice(startIndex, endIndex);
  }, [trendingBusinesses, currentPage]);

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
                className="text-base sm:text-xl font-700 text-white transition-all duration-300 relative"
                style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
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
          <nav className="px-2 sm:px-4 pb-1" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-charcoal/60">
              <li>
                <Link href="/home" className="hover:text-charcoal transition-colors" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                  Home
                </Link>
              </li>
              <li className="text-charcoal/40">/</li>
              <li className="text-charcoal font-medium" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>Trending Now</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Main content */}
      <div className="pb-12 sm:pb-16 md:pb-20 relative z-10">
        {/* Results count */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-2">
          <div className="max-w-[1300px] mx-auto">
            {loading ? (
              <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                Loading trending businesses...
              </p>
            ) : (
              <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                Showing {currentBusinesses.length} of {trendingBusinesses.length} trending businesses
              </p>
            )}
          </div>
        </div>

        {/* Business grid */}
        {!loading && (
          <div className="px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-[1300px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-3">
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
                    className="w-10 h-10 rounded-full bg-navbar-bg/90 border border-charcoal/20 flex items-center justify-center hover:bg-navbar-bg/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    aria-label="Previous page"
                    title="Previous"
                  >
                    <ChevronLeft className="text-white" size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}
                      className={`w-10 h-10 rounded-full bg-navbar-bg font-600 text-sm transition-all duration-200 ${
                        currentPage === page
                          ? "bg-sage text-white shadow-lg"
                          : "border border-charcoal/20 text-white hover:bg-navbar-bg/80"
                      }`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full bg-navbar-bg border border-charcoal/20 flex items-center justify-center hover:bg-navbar-bg/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    aria-label="Next page"
                    title="Next"
                  >
                    <ChevronRight className="text-white" size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
