"use client";

import { useState } from "react";
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
          {/* Main Content Section */}
          <section
            className="relative"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
          >
            <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
              <div className="pt-8">
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
