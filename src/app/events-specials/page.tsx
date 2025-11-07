"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer/Footer";
import EventsPageHeader from "../components/EventsPage/EventsPageHeader";
import FilterTabs from "../components/EventsPage/FilterTabs";
import ResultsCount from "../components/EventsPage/ResultsCount";
import EventsGrid from "../components/EventsPage/EventsGrid";
import Pagination from "../components/EventsPage/Pagination";
import EmptyState from "../components/EventsPage/EmptyState";
import { EVENTS_AND_SPECIALS, Event } from "../data/eventsData";
import { useToast } from "../contexts/ToastContext";
import { Calendar } from "react-feather";

const ITEMS_PER_PAGE = 5;

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
    <div className="min-h-dvh bg-off-white">
      {/* Header */}
      <EventsPageHeader />

      <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
        <div className="py-1 pt-20">
          {/* Hero Section */}
          <section className="relative z-10 pb-6 sm:pb-8 md:pb-12">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
              {/* Breadcrumb */}
              <nav className="px-2 sm:px-4 py-4" aria-label="Breadcrumb">
                <ol className="flex items-center gap-1 text-sm text-charcoal/60">
                  <li>
                    <Link href="/home" className="hover:text-charcoal transition-colors" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                      Home
                    </Link>
                  </li>
                  <li className="text-charcoal/40">/</li>
                  <li className="text-charcoal font-medium" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>Events & Specials</li>
                </ol>
              </nav>

              {/* Header Section */}
              <div className="mb-6 sm:mb-8 text-center px-2 sm:px-4 pb-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm border border-white/30">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-charcoal" />
                </div>
                <h2 className="font-urbanist text-lg sm:text-xl md:text-2xl font-600 text-charcoal mb-2">
                  Events & Specials
                </h2>
                <p className="font-urbanist text-charcoal/70 text-xs sm:text-sm max-w-md mx-auto px-2">
                  Discover exciting events and special offers from local businesses
                </p>
              </div>
            </div>
          </section>

          {/* Main Content Section */}
          <section
            className="relative pb-12 sm:pb-16 md:pb-20"
            style={{
              fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
          >
            <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
              <div className="pt-4">
                {/* Filter tabs */}
                <FilterTabs
                  selectedFilter={selectedFilter}
                  onFilterChange={handleFilterChange}
                />

                {/* Results count */}
                <ResultsCount count={currentEvents.length} filterType={selectedFilter} />

                {/* Main events grid */}
                {currentEvents.length > 0 ? (
                  <>
                    <EventsGrid events={currentEvents} onBookmark={handleBookmark} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </>
                ) : (
                  <EmptyState filterType={selectedFilter} />
                )}
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}
