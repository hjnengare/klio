"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import EventCard from "../components/EventCard/EventCard";
import Footer from "../components/Footer/Footer";
import { EVENTS_AND_SPECIALS, Event } from "../data/eventsData";
import { useToast } from "../contexts/ToastContext";

// lucide-react icons
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function EventsSpecialsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "event" | "special">("all");
  const { showToast } = useToast();

  // Filter events based on selected type
  const filteredEvents = EVENTS_AND_SPECIALS.filter((event) => {
    if (selectedFilter === "all") return true;
    return event.type === selectedFilter;
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: "all" | "event" | "special") => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleBookmark = (event: Event) => {
    showToast(`${event.title} saved to your bookmarks!`, "success");
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-white via-coral/[0.02] to-white relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-coral/3 via-transparent to-sage/3" />
        {/* Premium gradient overlay for glassy effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,116,105,0.03),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(116,145,118,0.025),transparent_50%)]" />
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-coral/20 hover:to-coral/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-coral/20 mr-2 sm:mr-4">
                <ArrowLeft
                  className="text-charcoal/70 group-hover:text-coral transition-colors duration-300"
                  size={22}
                />
              </div>
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-urbanist text-base sm:text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-coral via-coral/90 to-charcoal transition-all duration-300 group-hover:from-coral/90 group-hover:to-coral relative"
              >
                Events & Specials
              </motion.h1>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main content with proper spacing */}
      <div className="pb-6 relative z-10">
        {/* Filter tabs */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-6 pb-4">
          <div className="max-w-[1300px] mx-auto">
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-urbanist font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
                  selectedFilter === "all"
                    ? "bg-coral text-white shadow-lg"
                    : "bg-off-white text-charcoal/70 hover:bg-coral/10 hover:text-coral border border-charcoal/20"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("event")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-urbanist font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
                  selectedFilter === "event"
                    ? "bg-coral text-white shadow-lg"
                    : "bg-off-white text-charcoal/70 hover:bg-coral/10 hover:text-coral border border-charcoal/20"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => handleFilterChange("special")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-urbanist font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
                  selectedFilter === "special"
                    ? "bg-coral text-white shadow-lg"
                    : "bg-off-white text-charcoal/70 hover:bg-coral/10 hover:text-coral border border-charcoal/20"
                }`}
              >
                Specials
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-2">
          <div className="max-w-[1300px] mx-auto">
            <p className="font-urbanist text-sm text-charcoal/60">
              Showing {currentEvents.length}{" "}
              {selectedFilter === "all"
                ? "events & specials"
                : selectedFilter === "event"
                ? "events"
                : "specials"}
            </p>
          </div>
        </div>

        {/* Main events grid */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-[1300px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {currentEvents.map((event) => (
                <div key={event.id} className="animate-fade-in-up list-none relative group">
                  <EventCard event={event} />
                  {/* Bookmark button - always visible on mobile, hover on desktop */}
                  <button
                    onClick={() => handleBookmark(event)}
                    className="absolute top-2 right-2 w-10 h-10 bg-off-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-off-white active:scale-95 sm:hover:scale-110 z-20"
                    aria-label="Bookmark event"
                    title="Bookmark"
                  >
                    <Bookmark className="text-coral" size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8 sm:mt-12 flex-wrap">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-coral/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous page"
                  title="Previous"
                >
                  <ChevronLeft className="text-charcoal/70" size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-urbanist font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
                      currentPage === page
                        ? "bg-coral text-white shadow-lg"
                        : "border border-charcoal/20 text-charcoal/70 hover:bg-coral/5"
                    }`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-coral/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next page"
                  title="Next"
                >
                  <ChevronRight className="text-charcoal/70" size={20} />
                </button>
              </div>
            )}

            {currentEvents.length === 0 && (
              <div className="text-center py-12 sm:py-16 px-4">
                <Calendar className="text-charcoal/20 mx-auto mb-4" size={64} />
                <h3 className="font-urbanist font-700 text-lg sm:text-xl text-charcoal/60 mb-2">
                  No {selectedFilter === "event" ? "events" : "specials"} found
                </h3>
                <p className="font-urbanist text-sm sm:text-base text-charcoal/40">
                  Check back later for new {selectedFilter === "event" ? "events" : "specials"}!
                </p>
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
