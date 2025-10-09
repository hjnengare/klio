// src/components/Header/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User, X, Search } from "lucide-react";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";
import { lockBodyScroll } from "../../utils/lockBodyScroll";

const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
} as const;

export default function Header({ showSearch = true }: { showSearch?: boolean }) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const openFilters = () => {
    if (isFilterVisible) return;
    setIsFilterVisible(true);
    // small delay so CSS can mount before animating open
    setTimeout(() => setIsFilterOpen(true), 10);
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
    setTimeout(() => setIsFilterVisible(false), 150);
  };

  const handleApplyFilters = (f: FilterState) => {
    console.log("filters:", f);
  };

  // Lock body scroll when mobile menu is open (with padding to avoid width shift)
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const unlock = lockBodyScroll();
    return unlock;
  }, [isMobileMenuOpen]);

  // Close search when clicking outside of the search area
  useEffect(() => {
    if (!showSearchBar) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target as Node)) {
        setShowSearchBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchBar]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-[#f8f6f4] backdrop-blur-md transition-all duration-300"
        style={sf}
      >
        <div className="max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          {/* Top row */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/home" className="group flex-shrink-0" aria-label="KLIO Home">
              <span className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal">
                KLIO
              </span>
            </Link>

            {/* Spacer to push nav and icons to the right */}
            <div className="flex-1" />

            {/* Desktop nav - positioned on the right */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {["home", "all", "saved", "leaderboard"].map((route) => (
                <Link
                  key={route}
                  href={`/${route}`}
                  className="capitalize px-3 lg:px-4 py-2 rounded-full text-sm font-semibold text-charcoal/80 hover:text-sage hover:bg-sage/10 transition-colors"
                >
                  {route === "all" ? "Explore" : route}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearchBar((p) => !p)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-charcoal/80 hover:text-sage hover:bg-sage/10 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-sage/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-charcoal/80" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-[5px]">
                    <span className="w-5 h-[2px] bg-charcoal/80 rounded-full" />
                    <span className="w-6 h-[2px] bg-charcoal/80 rounded-full" />
                    <span className="w-5 h-[2px] bg-charcoal/80 rounded-full" />
                  </div>
                )}
              </button>

              {/* Profile */}
              <Link
                href="/profile"
                className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-charcoal hover:text-sage hover:border-sage/40 transition-all"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Search Input Section — transforms without shifting layout */}
          {showSearch && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showSearchBar ? "max-h-20 opacity-100 mt-3 sm:mt-4" : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <div ref={searchWrapRef}>
                <SearchInput
                  variant="header"
                  placeholder="Discover exceptional local experiences, premium dining, and hidden gems..."
                  mobilePlaceholder="Search places, coffee, yoga…"
                  onSearch={(q) => console.log("search:", q)}
                  onFilterClick={openFilters}
                  onFocusOpenFilters={openFilters}
                  showFilter
                />
              </div>
              {/* Gentle breathing room below the input (incl. iOS safe area) */}
              <div className="pb-3 sm:pb-4" style={{ paddingBottom: "calc(0.5rem + var(--safe-bottom))" }} />
            </div>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-[#f4ece7] z-[100] shadow-2xl transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal/10">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal">
              KLIO
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[5px] text-charcoal/70 hover:bg-sage/10 group"
              aria-label="Close menu"
            >
              <span className="w-5 h-[2px] bg-charcoal/70 rounded-full group-hover:bg-sage" />
              <span className="w-6 h-[2px] bg-charcoal/70 rounded-full group-hover:bg-sage" />
              <span className="w-5 h-[2px] bg-charcoal/70 rounded-full group-hover:bg-sage" />
            </button>
          </div>

          <nav className="flex flex-col py-4 px-4">
            {["home", "all", "saved", "leaderboard"].map((route) => (
              <Link
                key={route}
                href={`/${route}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-charcoal/80 hover:text-sage hover:bg-sage/5 transition-colors"
              >
                {route === "all" ? "Explore" : route.charAt(0).toUpperCase() + route.slice(1)}
              </Link>
            ))}
            <div className="h-px bg-charcoal/10 my-4 mx-4" />
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-charcoal/80 hover:text-sage hover:bg-sage/5 flex items-center gap-3 transition-all duration-200"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </nav>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        isVisible={isFilterVisible}
        onClose={closeFilters}
        onApplyFilters={handleApplyFilters}
        anchorRef={searchWrapRef}
      />
    </>
  );
}
