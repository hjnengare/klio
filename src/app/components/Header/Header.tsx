// src/components/Header/Header.tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { User, X, Search } from "lucide-react";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";
import { useSavedItems } from "../../contexts/SavedItemsContext";

const sf = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
} as const;

export default function Header({
  showSearch = true,
  variant = "white",
}: {
  showSearch?: boolean;
  variant?: "white" | "frosty";
}) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { savedCount } = useSavedItems();

  // Anchor for the dropdown FilterModal to hang under
  const searchWrapRef = useRef<HTMLDivElement>(null);

  // Scroll-based header visibility
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100; // Minimum scroll distance to trigger hide/show
      
      // Don't hide header if we're near the top
      if (currentScrollY < scrollThreshold) {
        setIsHeaderVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsHeaderVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlHeader();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

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

  // NEW: when user submits the query (Enter), we close the search bar (and filters if open)
  const handleSubmitQuery = (query: string) => {
    console.log("submit query:", query);
    setShowSearchBar(false);
    if (isFilterVisible) closeFilters();
  };

  const headerClassName = `fixed top-0 left-0 right-0 z-50 bg-navbar-bg backdrop-blur-xl shadow-lg shadow-sage/5 transition-all duration-300 translate-y-0`;

  return (
    <>
      {/* Google Fonts for logo and typography */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Italianno&family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&family=Shadows+Into+Light&display=swap" rel="stylesheet" />

      <header className={headerClassName} style={sf}>
        <div className="relative z-[1] max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          {/* Top row */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/home" className="group flex-shrink-0 relative" aria-label="KLIO Home">
              <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal drop-shadow-sm" style={{ fontFamily: "'Italianno', cursive" }}>
               sayso
              </span>
            </Link>

            {/* Desktop nav - centered */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1 justify-center">
              {["home", "saved", "leaderboard", "claim-business"].map((route) => (
                <Link
                  key={route}
                  href={`/${route}`}
                  className="group capitalize px-3 lg:px-4 py-2 rounded-full text-sm font-600 text-white hover:text-white transition-all duration-300 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{route}</span>
                  {route === "saved" && savedCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-sage text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg z-20">
                      {savedCount > 99 ? "99+" : savedCount}
                    </div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Search Toggle (manual close/open) */}
              <button
                onClick={() => setShowSearchBar((p) => !p)}
                className="group w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white transition-all duration-300 relative overflow-hidden"
                aria-label="Toggle search"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-off-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Search className="relative z-10 w-5 h-5" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-sage/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-[5px]">
                    <span className="w-5 h-[2px] bg-white rounded-full" />
                    <span className="w-6 h-[2px] bg-white rounded-full" />
                    <span className="w-5 h-[2px] bg-white rounded-full" />
                  </div>
                )}
              </button>

              {/* Profile */}
              <Link
                href="/profile"
                className="group hidden md:flex w-10 h-10 rounded-full items-center justify-center text-white hover:text-white transition-all duration-300 relative overflow-hidden"
                aria-label="Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-off-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <User className="relative z-10 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Search Input Section — stays open until submit or manual toggle */}
          {showSearch && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showSearchBar ? "max-h-20 opacity-100 mt-3 sm:mt-4" : "max-h-0 opacity-0 mt-0"
              }`}
            >
              {/* Anchor for the dropdown modal */}
              <div ref={searchWrapRef}>
                <SearchInput
                  variant="header"
                  placeholder="Discover exceptional local experiences, premium dining, and hidden gems..."
                  mobilePlaceholder="Search places, coffee, yoga…"
                  onSearch={(q) => console.log("search change:", q)}
                  onSubmitQuery={handleSubmitQuery}     // <-- close on Enter/submit
                  onFilterClick={openFilters}
                  onFocusOpenFilters={openFilters}      // anchored modal opens on focus
                  showFilter
                />
              </div>

              <div
                className="pb-3 sm:pb-4"
                style={{ paddingBottom: "calc(0.5rem + var(--safe-bottom))" }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-xl z-[90] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full backdrop-blur-2xl bg-off-white/80 z-[100] shadow-2xl shadow-sage/10 transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal/10">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal" style={{ fontFamily: "'Italianno', cursive" }}>
              sayso
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[5px] text-white hover:bg-sage/10 group"
              aria-label="Close menu"
            >
              <span className="w-5 h-[2px] bg-white rounded-full group-hover:bg-sage" />
              <span className="w-6 h-[2px] bg-white rounded-full group-hover:bg-sage" />
              <span className="w-5 h-[2px] bg-white rounded-full group-hover:bg-sage" />
            </button>
          </div>

          <nav className="flex flex-col py-4 px-4">
            {["home", "saved", "leaderboard"].map((route) => (
              <Link
                key={route}
                href={`/${route}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-600 text-charcoal hover:text-charcoal hover:bg-sage/5 transition-colors relative"
              >
                <span className="flex items-center justify-between">
                  {route.charAt(0).toUpperCase() + route.slice(1)}
                  {route === "saved" && savedCount > 0 && (
                    <div className="bg-coral text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg">
                      {savedCount > 99 ? "99+" : savedCount}
                    </div>
                  )}
                </span>
              </Link>
            ))}
            <div className="h-px bg-charcoal/10 my-4 mx-4" />
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-white hover:text-white hover:bg-sage/5 flex items-center gap-3 transition-all duration-200"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </nav>
        </div>
      </div>

      {/* Anchored Filter Modal */}
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
