// src/components/Header/Header.tsx  (only the parts that change)
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";
import { useHideOnScroll } from "../../hooks/useHideOnScroll";

export default function Header({ showSearch = true }) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  // No hide/show behavior - header stays visible
  // const { visible } = useHideOnScroll({
  //   topSafe: 80,
  //   hysteresis: 28,
  //   throttleMs: 60,
  //   forceShow: isMobileMenuOpen
  // });

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
    ["person", "options", "search", "menu", "close"].forEach((n) => {
      const el = document.createElement("ion-icon");
      el.name = n; el.style.display = "none";
      document.body.appendChild(el);
      setTimeout(() => document.body.contains(el) && document.body.removeChild(el), 100);
    });

    // Track scroll position for header background
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-mobile-menu]') && !target.closest('[data-hamburger]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          {/* row 1 */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/home" className="group flex-shrink-0">
              <span className={`font-urbanist text-xl lg:text-2xl font-700 ${
                isScrolled
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal'
                  : 'text-white'
              }`}>
                KLIO
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                href="/home"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Home
              </Link>

              <Link
                href="/all"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Explore
              </Link>

              <Link
                href="/saved"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Saved
              </Link>

              <Link
                href="/leaderboard"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Leaderboard
              </Link>

              <Link
                href="/write-review"
                className={`px-3 lg:px-4 py-2 rounded-full font-urbanist text-sm font-600 ${
                  isScrolled
                    ? 'text-charcoal/70 hover:text-sage hover:bg-sage/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Write Review
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Hamburger Menu Button - Mobile Only */}
              <button
                data-hamburger
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[5px] group ${
                  isScrolled
                    ? 'hover:bg-sage/10'
                    : 'hover:bg-white/10'
                }`}
                aria-label="Toggle menu"
              >
                <span className={`h-[2px] rounded-full ${
                  isMobileMenuOpen ? 'w-0 opacity-0' : 'w-5'
                } ${
                  isScrolled
                    ? 'bg-charcoal/70 group-hover:bg-sage'
                    : 'bg-white group-hover:bg-white/80'
                }`} />
                <span className={`w-6 h-[2px] rounded-full ${
                  isScrolled
                    ? 'bg-charcoal/70 group-hover:bg-sage'
                    : 'bg-white group-hover:bg-white/80'
                }`} />
                <span className={`h-[2px] rounded-full ${
                  isMobileMenuOpen ? 'w-0 opacity-0' : 'w-5'
                } ${
                  isScrolled
                    ? 'bg-charcoal/70 group-hover:bg-sage'
                    : 'bg-white group-hover:bg-white/80'
                }`} />
              </button>

              {/* Profile Icon - Desktop */}
              <Link
                href="/profile"
                className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center transition-all duration-200 ${
                  isScrolled
                    ? 'bg-charcoal/10 border border-charcoal/20 text-charcoal hover:bg-charcoal/20'
                    : 'bg-white/20 backdrop-blur-sm border border-white/40 text-white hover:text-white'
                }`}
                aria-label="Profile"
              >
                <ion-icon
                  name="person-outline"
                  className="text-xl"
                />
              </Link>
            </div>
          </div>

          {/* row 2: search (anchor wrapper) */}
          {showSearch && (
            <div
              ref={searchWrapRef}
              className={`mt-3 sm:mt-4 transition-all duration-300 overflow-hidden ${
                isScrolled
                  ? 'max-h-0 opacity-0 mt-0'
                  : 'max-h-20 opacity-100'
              }`}
            >
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in Panel */}
      <div
        data-mobile-menu
        className={`fixed top-0 right-0 h-full w-full bg-white z-[100] shadow-2xl transform md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal/10">
            <span className="font-urbanist text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal">
              KLIO
            </span>
            {/* Premium Hamburger Icon - 3 lines */}
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

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col py-4 px-4">
            <Link
              href="/home"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-urbanist text-base font-600 text-charcoal/70 hover:text-sage hover:bg-sage/5"
            >
              Home
            </Link>

            <Link
              href="/all"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-urbanist text-base font-600 text-charcoal/70 hover:text-sage hover:bg-sage/5"
            >
              Explore
            </Link>

            <Link
              href="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-urbanist text-base font-600 text-charcoal/70 hover:text-sage hover:bg-sage/5"
            >
              Saved
            </Link>

            <Link
              href="/leaderboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-urbanist text-base font-600 text-charcoal/70 hover:text-sage hover:bg-sage/5"
            >
              Leaderboard
            </Link>

            <Link
              href="/write-review"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-urbanist text-base font-600 text-charcoal/70 hover:text-sage hover:bg-sage/5"
            >
              Write Review
            </Link>

            {/* Divider */}
            <div className="h-px bg-charcoal/10 my-4 mx-4" />

            {/* Profile Link in Mobile Menu */}
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-urbanist text-base font-600 text-charcoal/70 hover:text-sage hover:bg-sage/5 transition-all duration-200 flex items-center gap-3"
            >
              <ion-icon name="person-outline" className="text-xl" />
              Profile
            </Link>
          </nav>
        </div>
      </div>

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
