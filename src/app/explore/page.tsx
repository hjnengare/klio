"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import ExploreHeader from "../components/Explore/ExploreHeader";
import { ChevronLeft, ChevronRight, Search } from "react-feather";
import { useBusinesses } from "../hooks/useBusinesses";

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

const ITEMS_PER_PAGE = 12;

export default function ExplorePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'total_rating' | 'created_at' | 'name'>('total_rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch businesses from API with filters
  const { businesses, loading, error } = useBusinesses({
    limit: 100, // Fetch more for filtering/pagination
    category: selectedCategory,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  // Filter businesses by search query
  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return businesses;
    const query = searchQuery.toLowerCase().trim();
    return businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        business.location.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query)
    );
  }, [businesses, searchQuery]);

  const totalPages = useMemo(() => Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE), [filteredBusinesses.length]);
  const currentBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredBusinesses.slice(startIndex, endIndex);
  }, [filteredBusinesses, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  // Get unique categories from businesses
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(businesses.map((b) => b.category))).sort();
    return uniqueCategories;
  }, [businesses]);

  return (
    <div className="min-h-dvh bg-off-white">
      <ExploreHeader />

      <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
        <div className="py-1 pt-20 pb-12 sm:pb-16 md:pb-20">
          {/* Search and Filters */}
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-charcoal/10 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral/50 transition-all duration-200"
                style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 500 }}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || undefined)}
                className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-charcoal/10 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral/50 transition-all duration-200 text-sm"
                style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 500 }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'total_rating' | 'created_at' | 'name')}
                className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-charcoal/10 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral/50 transition-all duration-200 text-sm"
                style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 500 }}
              >
                <option value="total_rating">Highest Rated</option>
                <option value="created_at">Newest</option>
                <option value="name">Name (A-Z)</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-charcoal/10 hover:bg-white focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral/50 transition-all duration-200 text-sm"
                style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 500 }}
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 sm:px-6 md:px-8 pb-2">
            <div className="max-w-[1300px] mx-auto">
              {loading ? (
                <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                  Loading businesses...
                </p>
              ) : error ? (
                <p className="text-sm text-orange-600" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                  Error: {error}
                </p>
              ) : (
                <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                  Showing {currentBusinesses.length} of {filteredBusinesses.length} businesses
                  {searchQuery && ` matching "${searchQuery}"`}
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              )}
            </div>
          </div>

          {/* Business grid */}
          {!loading && !error && (
            <div className="px-4 sm:px-6 md:px-8">
              <div className="max-w-[1300px] mx-auto">
                {currentBusinesses.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                          className="w-10 h-10 rounded-full bg-navbar-bg border border-charcoal/20 flex items-center justify-center hover:bg-navbar-bg/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                          aria-label="Previous page"
                          title="Previous"
                        >
                          <ChevronLeft className="text-charcoal/70" size={20} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}
                            className={`w-10 h-10 rounded-full bg-navbar-bg font-600 text-sm transition-all duration-200 ${
                              currentPage === page
                                ? "bg-coral text-white shadow-lg"
                                : "border border-charcoal/20 text-charcoal/70 hover:bg-navbar-bg/80"
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
                          <ChevronRight className="text-charcoal/70" size={20} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>
                      No businesses found{searchQuery ? ` matching "${searchQuery}"` : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

