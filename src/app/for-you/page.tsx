"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import Footer from "../components/Footer/Footer";
import { ArrowLeft, ChevronLeft, ChevronRight } from "react-feather";
import { useForYouBusinesses } from "../hooks/useBusinesses";
import ToastContainer from "../components/ToastNotification/ToastContainer";
import { useToastNotifications } from "../hooks/useToastNotifications";


const ITEMS_PER_PAGE = 9;

export default function ForYouPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { businesses: forYouBusinesses, loading } = useForYouBusinesses(50); // Fetch more for pagination
  
  const { notifications, removeNotification } = useToastNotifications({
    interval: 15000, // Show a notification every 15 seconds
    maxToasts: 1,
    enabled: true,
  });

  const totalPages = useMemo(() => Math.ceil(forYouBusinesses.length / ITEMS_PER_PAGE), [forYouBusinesses.length]);
  const currentBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return forYouBusinesses.slice(startIndex, endIndex);
  }, [forYouBusinesses, currentPage]);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-white via-sage/[0.02] to-white relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
        {/* Premium gradient overlay for glassy effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(116,145,118,0.03),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(214,116,105,0.02),transparent_50%)]" />
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="bottom-right"
        duration={5000}
      />

      {/* Header with spring animation */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="bg-navbar-bg/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-charcoal/10"
        style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <Link href="/home" className="group flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-3">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white transition-colors duration-300" />
              </div>
              <h1 className="text-base sm:text-xl font-700 text-white transition-all duration-300 group-hover:text-white/80 relative" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                For You
              </h1>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-6 sm:pb-8 md:pb-12">
        <div className="max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="px-2 sm:px-4 pb-2" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-charcoal/60">
              <li>
                <Link href="/home" className="hover:text-charcoal transition-colors" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                  Home
                </Link>
              </li>
              <li className="text-charcoal/40">/</li>
              <li className="text-charcoal font-medium" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>For You</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Main content with proper spacing */}
      <div className="pb-12 sm:pb-16 md:pb-20 relative z-10">
        {/* Results count */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-2">
          <div className="max-w-[1300px] mx-auto">
            {loading ? (
              <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                Loading personalized recommendations...
              </p>
            ) : (
              <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                Showing {currentBusinesses.length} of {forYouBusinesses.length} personalized recommendations
              </p>
            )}
          </div>
        </div>

        {/* Main businesses grid */}
        {!loading && (
          <div className="px-2 md:px-6 lg:px-8">
            <div className="max-w-[1300px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 sm:gap-8">
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
                      className={`w-10 h-10 rounded-full bg-navbar-bg/90 font-600 text-sm transition-all duration-200 ${
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
                    className="w-10 h-10 rounded-full bg-navbar-bg/90 border border-charcoal/20 flex items-center justify-center hover:bg-navbar-bg/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
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
