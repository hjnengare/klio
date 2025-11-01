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
          <section className="relative z-10 pt-2 pb-6 sm:pb-8 md:pb-12">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
              {/* Breadcrumb */}
              <nav className="px-2 sm:px-4 pt-3 sm:pt-4 pb-1" aria-label="Breadcrumb">
                <ol className="flex items-center gap-1 text-sm text-charcoal/60">
                  <li>
                    <Link href="/home" className="hover:text-charcoal transition-colors font-urbanist">
                      Home
                    </Link>
                  </li>
                  <li className="text-charcoal/40">/</li>
                  <li className="text-charcoal font-medium font-urbanist">Events & Specials</li>
                </ol>
              </nav>

              {/* Main Headline */}
              <h1 className="text-sm font-bold text-charcoal mb-1 text-center font-urbanist">
                Events & Specials
              </h1>

              {/* Sub-headline */}
              <p className="text-xs text-charcoal/70 text-center max-w-2xl mx-auto font-urbanist leading-relaxed">
                Discover exciting events and exclusive specials happening near you
              </p>
            </div>
          </section>

          {/* Main Content Section */}
          <section
            className="relative pb-12 sm:pb-16 md:pb-20"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
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
