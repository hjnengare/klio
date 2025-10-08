"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import Footer from "../components/Footer/Footer";
import { TRENDING_BUSINESSES } from "../data/businessData";

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
    <div className="min-h-dvh  bg-white   relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className=" bg-white  /80 backdrop-blur-xl border-b border-charcoal/10 px-3 sm:px-4 py-4 sm:py-6 shadow-sm relative z-10"
      >
        <div className="flex items-center justify-between max-w-[1300px] mx-auto">
          {/* Back button */}
          <Link href="/home" className="group flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-2 sm:mr-4">
              <ion-icon name="arrow-back" class="text-lg sm:text-xl text-charcoal/70 group-hover:text-sage transition-colors duration-300" />
            </div>
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-sf text-base sm:text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative"
            >
              For You
            </motion.h1>
          </Link>
        </div>
      </motion.header>

      {/* Main content with proper spacing */}
      <div className="pb-6 relative z-10">
        {/* Results count */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-6 pb-2">
          <div className="max-w-[1300px] mx-auto">
            <p className="font-sf text-sm text-charcoal/60">
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
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-sage/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous page"
                >
                  <ion-icon name="chevron-back" class="text-lg text-charcoal/70" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-sf font-600 text-sm transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-sage text-white'
                        : 'border border-charcoal/20 text-charcoal/70 hover:bg-sage/5'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-sage/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next page"
                >
                  <ion-icon name="chevron-forward" class="text-lg text-charcoal/70" />
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
