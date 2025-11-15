"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BusinessCard from "../components/BusinessCard/BusinessCard";
import { useBusinesses } from "../hooks/useBusinesses";
import { Loader } from "../components/Loader";
import SearchInput from "../components/SearchInput/SearchInput";
import FilterModal, { FilterState } from "../components/FilterModal/FilterModal";
import { ChevronLeft, ChevronRight, ChevronUp } from "react-feather";

const ITEMS_PER_PAGE = 12;

export default function ExplorePage() {
  const {
    businesses,
    loading,
    error,
    refetch,
  } = useBusinesses({
    limit: 100,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const totalPages = useMemo(() => Math.ceil(businesses.length / ITEMS_PER_PAGE), [businesses.length]);
  const currentBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return businesses.slice(startIndex, endIndex);
  }, [businesses, currentPage]);

  const totalCount = useMemo(() => businesses.length, [businesses.length]);

  const openFilters = () => {
    if (isFilterVisible) return;
    setIsFilterVisible(true);
    setTimeout(() => setIsFilterOpen(true), 10);
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
    setTimeout(() => setIsFilterVisible(false), 150);
  };

  const handleApplyFilters = (f: FilterState) => {
    console.log("filters:", f);
  };

  const handleSubmitQuery = (query: string) => {
    console.log("submit query:", query);
    if (isFilterVisible) closeFilters();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-dvh bg-off-white">
      <Header
        showSearch={false}
        variant="white"
        backgroundClassName="bg-navbar-bg/90"
        topPosition="top-0"
        reducedPadding={true}
        whiteText={true}
      />

      <main className="pt-20 sm:pt-24 pb-28">
        <div className="mx-auto w-full max-w-[2000px] px-2">
          {/* Breadcrumb */}
          <nav className="px-2" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-charcoal/60">
              <li>
                <Link href="/home" className="hover:text-charcoal transition-colors" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                  Home
                </Link>
              </li>
              <li className="text-charcoal/40">/</li>
              <li className="text-charcoal font-medium" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>Explore</li>
            </ol>
          </nav>

          {/* Search Input at top of main content */}
          <div ref={searchWrapRef} className="py-4">
            <SearchInput
              variant="header"
              placeholder="Discover exceptional local hidden gems..."
              mobilePlaceholder="Search places, coffee, yoga…"
              onSearch={(q) => console.log("search change:", q)}
              onSubmitQuery={handleSubmitQuery}
              onFilterClick={openFilters}
              onFocusOpenFilters={openFilters}
              showFilter
            />
            </div>

          <div className="py-4">
          {loading && (
            <div className="py-24 flex justify-center">
              <Loader size="lg" color="sage" text="Loading businesses..." />
            </div>
          )}

          {!loading && error && (
            <div className="bg-white border border-sage/20 rounded-3xl shadow-sm px-6 py-10 text-center space-y-4">
              <p className="text-charcoal font-600" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                We couldn’t load businesses right now.
              </p>
              <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 500 }}>
                {error}
              </p>
              <button
                onClick={refetch}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-sage text-white hover:bg-sage/90 transition-colors text-sm font-semibold"
                style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {businesses.length === 0 ? (
                <div className="bg-white border border-sage/20 rounded-3xl shadow-sm px-6 py-16 text-center space-y-3">
                  <h2 className="text-lg font-600 text-charcoal" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                    No businesses yet
                  </h2>
                  <p className="text-sm text-charcoal/60 max-w-lg mx-auto" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 500 }}>
                    Try adjusting your filters or check back soon as new businesses join the community.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {currentBusinesses.map((business) => (
                    <div key={business.id} className="list-none">
                        <BusinessCard business={business} compact />
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
                </>
              )}
            </>
          )}
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        isVisible={isFilterVisible}
        onClose={closeFilters}
        onApplyFilters={handleApplyFilters}
        anchorRef={searchWrapRef}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-navbar-bg/90 hover:bg-navbar-bg backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
      )}

      <Footer />
    </div>
  );
}

