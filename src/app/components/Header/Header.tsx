// src/components/Header/Header.tsx  (only the parts that change)
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";
import useScrollDirection from "../../hooks/useScrollDirection";

export default function Header({ showSearch = true, showProfile = true }) {
  const { isVisible } = useScrollDirection({ threshold: 100, throttleMs: 16 });

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    ["person", "options", "search"].forEach((n) => {
      const el = document.createElement("ion-icon");
      el.name = n; el.style.display = "none";
      document.body.appendChild(el);
      setTimeout(() => document.body.contains(el) && document.body.removeChild(el), 100);
    });

    // Track scroll position for header background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-off-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          {/* row 1 */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/home" className="group flex-shrink-0">
              <span className={`font-urbanist text-xl lg:text-2xl font-700 relative transition-all duration-300 ${
                isScrolled
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal'
                  : 'text-white'
              }`}>
                KLIO
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sage to-sage/60 group-hover:w-full transition-all duration-300 rounded-full" />
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                href="/home"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 transition-all duration-200 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Home
              </Link>

              <Link
                href="/all"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 transition-all duration-200 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Explore
              </Link>

              <Link
                href="/saved"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 transition-all duration-200 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Saved
              </Link>

              <Link
                href="/leaderboard"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 transition-all duration-200 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Leaderboard
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {showProfile && (
                <Link
                  href="/profile"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    isScrolled
                      ? 'border-charcoal/5 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10'
                      : 'border-white/20 bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <ion-icon name="person" class={`text-base transition-colors duration-300 ${
                    isScrolled ? 'text-charcoal/70' : 'text-white'
                  }`} />
                </Link>
              )}
            </div>
          </div>

          {/* row 2: search (anchor wrapper) */}
          {showSearch && (
            <div ref={searchWrapRef} className="mt-3 sm:mt-4">
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
          )}
        </div>
      </header>

      {/* popover */}
      <FilterModal
        isOpen={isFilterOpen}
        isVisible={isFilterVisible}
        onClose={closeFilters}
        onApplyFilters={handleApplyFilters}
        anchorRef={searchWrapRef}   // <-- anchor under search
      />

      {/* No spacer needed - hero starts at top-0 */}
    </>
  );
}
