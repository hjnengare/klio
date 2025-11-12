"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import FilterTabs from "../components/EventsPage/FilterTabs";
import ResultsCount from "../components/EventsPage/ResultsCount";
import EventsGrid from "../components/EventsPage/EventsGrid";
import Pagination from "../components/EventsPage/Pagination";
import EmptyState from "../components/EventsPage/EmptyState";
import SearchInput from "../components/SearchInput/SearchInput";
import { EVENTS_AND_SPECIALS, Event } from "../data/eventsData";
import { useToast } from "../contexts/ToastContext";
import { ChevronUp, Search } from "react-feather";

const ITEMS_PER_PAGE = 12;

export default function EventsSpecialsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "event" | "special">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { showToast } = useToast();

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return EVENTS_AND_SPECIALS.filter((event) => {
      const matchesFilter = selectedFilter === "all" || event.type === selectedFilter;
      const matchesQuery =
        query.length === 0 ||
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [selectedFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));

  const currentEvents = useMemo(() => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 240);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterChange = (filter: "all" | "event" | "special") => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleBookmark = (event: Event) => {
    showToast(`${event.title} saved to your bookmarks!`, "success");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh bg-off-white">
      <Header
        showSearch={false}
        backgroundClassName="bg-navbar-bg/90"
        topPosition="top-0"
        reducedPadding
        whiteText
      />

      <main
        className="bg-off-white pt-20 sm:pt-24 pb-28"
        style={{
          fontFamily:
            '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10">
          <nav className="py-4 px-2 sm:px-4" aria-label="Breadcrumb">
                <ol className="flex items-center gap-1 text-sm text-charcoal/60">
                  <li>
                <Link
                  href="/home"
                  className="hover:text-charcoal transition-colors"
                  style={{
                    fontFamily:
                      '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                    fontWeight: 600,
                  }}
                >
                      Home
                    </Link>
                  </li>
                  <li className="text-charcoal/40">/</li>
              <li
                className="text-charcoal font-medium"
                style={{
                  fontFamily:
                    '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                  fontWeight: 600,
                }}
              >
                Events & Specials
              </li>
                </ol>
              </nav>

          <div className="py-4 relative">
            <SearchInput
              variant="header"
              placeholder="Search events and limited-time offers..."
              mobilePlaceholder="Search events & specials..."
              onSearch={handleSearch}
              showFilter={false}
            />
            <button
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-charcoal/60 hover:text-charcoal transition-colors z-10"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-5 h-5" strokeWidth={2} />
            </button>
                </div>

          <div className="py-4 flex flex-col gap-4">
            <FilterTabs selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />
            <ResultsCount count={filteredEvents.length} filterType={selectedFilter} />
            </div>

          <div className="py-4">
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
      </main>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-navbar-bg/90 hover:bg-navbar-bg backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
      )}

          <Footer />
    </div>
  );
}
