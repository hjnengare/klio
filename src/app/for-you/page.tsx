"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import Footer from "../components/Footer/Footer";
import { TRENDING_BUSINESSES } from "../data/businessData";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// Use For You businesses (first 10 from TRENDING_BUSINESSES)
const forYouBusinesses: Business[] = TRENDING_BUSINESSES.slice(0, 10);
const ITEMS_PER_PAGE = 8;

export default function ForYouPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(forYouBusinesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBusinesses = forYouBusinesses.slice(startIndex, endIndex);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-white via-sage/[0.02] to-white relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
        {/* Premium gradient overlay for glassy effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(116,145,118,0.03),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(214,116,105,0.02),transparent_50%)]" />
      </div>

      {/* Header with spring animation */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="bg-off-white shadow-sm relative z-10"
      >
        <div className="relative z-[1] max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <Link href="/home" className="group flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-2 sm:mr-4">
                <ArrowLeft
                  size={22}
                  className="text-charcoal/70 group-hover:text-sage transition-colors duration-300"
                />
              </div>
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-urbanist text-base sm:text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative"
              >
                For You
              </motion.h1>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main content with proper spacing */}
      <div className="pb-6 relative z-10">
        {/* Results count */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-6 pb-2">
          <div className="max-w-[1300px] mx-auto">
            <p className="font-urbanist text-sm text-charcoal/60">
              Showing {currentBusinesses.length} personalized recommendations
            </p>
          </div>
        </div>

        {/* Main businesses grid */}
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
