// src/components/Header/Header.tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { User, X, Search, LogIn, Briefcase, ChevronDown, Settings } from "react-feather";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";
import { useSavedItems } from "../../contexts/SavedItemsContext";
import Logo from "../Logo/Logo";
import OptimizedLink from "../Navigation/OptimizedLink";

const sf = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
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
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const [isMobileBusinessDropdownOpen, setIsMobileBusinessDropdownOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{left:number; top:number}>({left:0, top:0});
  const [mobileMenuPos, setMobileMenuPos] = useState<{left:number; top:number}>({left:0, top:0});
  const { savedCount } = useSavedItems();

  // Use refs to track state without causing re-renders
  const isFilterVisibleRef = useRef(isFilterVisible);
  const isBusinessDropdownOpenRef = useRef(isBusinessDropdownOpen);
  const isMobileBusinessDropdownOpenRef = useRef(isMobileBusinessDropdownOpen);
  const showSearchBarRef = useRef(showSearchBar);

  // Update refs when state changes
  useEffect(() => {
    isFilterVisibleRef.current = isFilterVisible;
  }, [isFilterVisible]);

  useEffect(() => {
    isBusinessDropdownOpenRef.current = isBusinessDropdownOpen;
  }, [isBusinessDropdownOpen]);

  useEffect(() => {
    isMobileBusinessDropdownOpenRef.current = isMobileBusinessDropdownOpen;
  }, [isMobileBusinessDropdownOpen]);

  useEffect(() => {
    showSearchBarRef.current = showSearchBar;
  }, [showSearchBar]);

  // Anchor for the dropdown FilterModal to hang under
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const businessDropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const mobileBusinessBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll-based header visibility
  useEffect(() => {
    const hideOffset = 100; // Additional 100px to stay visible after scroll starts
    let lastKnownScrollY = window.scrollY;
    let scrollDownStartY: number | null = null;

    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // At the top - always show
      if (currentScrollY <= 10) {
        setIsHeaderVisible(true);
        scrollDownStartY = null;
        lastKnownScrollY = currentScrollY;
        return;
      }

      const isScrollingDown = currentScrollY > lastKnownScrollY;
      const isScrollingUp = currentScrollY < lastKnownScrollY;

      if (isScrollingDown) {
        // Record the position where scrolling down started
        if (scrollDownStartY === null) {
          scrollDownStartY = lastKnownScrollY;
        }

        // Calculate distance scrolled down from start
        const scrolledDistance = currentScrollY - scrollDownStartY;

        // Keep visible for 100px, then hide
        if (scrolledDistance > hideOffset) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      } else if (isScrollingUp) {
        // Immediately show when scrolling up
        setIsHeaderVisible(true);
        scrollDownStartY = null;
      }

      lastKnownScrollY = currentScrollY;
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
  }, []);

  // Close all modals on scroll - memoized with useCallback
  const closeModalsOnScroll = useCallback(() => {
    // Only close if they're actually open to avoid unnecessary state updates
    if (isBusinessDropdownOpenRef.current) {
      setIsBusinessDropdownOpen(false);
    }
    if (isMobileBusinessDropdownOpenRef.current) {
      setIsMobileBusinessDropdownOpen(false);
    }
    if (showSearchBarRef.current) {
      setShowSearchBar(false);
    }
    if (isFilterVisibleRef.current) {
      setIsFilterOpen(false);
      setTimeout(() => setIsFilterVisible(false), 150);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', closeModalsOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', closeModalsOnScroll);
    };
  }, [closeModalsOnScroll]);

  // Close business dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (businessDropdownRef.current && !businessDropdownRef.current.contains(event.target as Node)) {
        setIsBusinessDropdownOpen(false);
      }
    };

    if (isBusinessDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBusinessDropdownOpen]);

  // Measure button position when dropdown opens
  useLayoutEffect(() => {
    if (isBusinessDropdownOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const dropdownWidth = 560; // min-w-[560px]
      const viewportWidth = window.innerWidth;
      const padding = 16; // padding from edge

      // Calculate left position, ensure it doesn't go off screen
      let leftPos = r.left;

      // If dropdown would go off right edge, align to right side of button
      if (leftPos + dropdownWidth > viewportWidth - padding) {
        leftPos = Math.max(padding, r.right - dropdownWidth);
      }

      // Ensure it doesn't go off left edge
      leftPos = Math.max(padding, leftPos);

      setMenuPos({ left: leftPos, top: r.bottom + 8 });
    }
  }, [isBusinessDropdownOpen]);

  // Measure mobile button position when dropdown opens
  useLayoutEffect(() => {
    if (isMobileBusinessDropdownOpen && mobileBusinessBtnRef.current) {
      const r = mobileBusinessBtnRef.current.getBoundingClientRect();
      // Position on the right side, slightly inset from edge
      const dropdownWidth = 320; // Approximate width of dropdown
      setMobileMenuPos({ 
        left: Math.max(16, window.innerWidth - dropdownWidth - 16), 
        top: r.top 
      });
    }
  }, [isMobileBusinessDropdownOpen]);

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

  // Different positioning for home page (frosty variant) vs other pages
  const isHomeVariant = variant === "frosty";
  const headerClassName = isHomeVariant
    ? `absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-off-white backdrop-blur-xl rounded-full shadow-xl transition-all duration-300 w-[96%] max-w-[1700px] ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : ''}`
    : `fixed top-6 left-0 right-0 z-50 bg-off-white backdrop-blur-xl shadow-lg shadow-sage/5 transition-all duration-300 ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`;

  return (
    <>
      <header className={headerClassName} style={sf}>
        <div className={`relative z-[1] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 ${isHomeVariant ? 'py-0' : 'py-0'}`}>
          {/* Top row */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <OptimizedLink href="/home" className="group flex-shrink-0 relative" aria-label="sayso Home">
              <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative scale-[0.64] origin-left">
                <Logo variant="default" className="relative" />
              </div>
            </OptimizedLink>

            {/* Desktop nav - centered */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1 justify-center">
              {["home", "saved", "leaderboard"].map((route) => (
                <OptimizedLink
                  key={route}
                  href={`/${route}`}
                  className="group capitalize px-2 lg:px-3 rounded-full text-xs font-normal text-charcoal/90 hover:text-charcoal/90 transition-all duration-300 relative"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{route.charAt(0).toUpperCase() + route.slice(1)}</span>
                  {route === "saved" && savedCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-sage text-charcoal/90 text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg z-20">
                      {savedCount > 99 ? "99+" : savedCount}
                    </div>
                  )}
                </OptimizedLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* For Businesses Dropdown */}
              <div className="relative hidden md:block" ref={businessDropdownRef}>
                <button
                  ref={btnRef}
                  onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                  className="group capitalize px-3 lg:px-4 py-1 rounded-full text-xs font-normal text-charcoal/90 hover:text-charcoal/90 transition-all duration-300 relative flex items-center gap-1"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 whitespace-nowrap">For Businesses</span>
                  <ChevronDown className={`relative z-10 w-3 h-3 transition-transform duration-200 ${isBusinessDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Portal Dropdown Menu */}
                {isBusinessDropdownOpen &&
                  createPortal(
                    <div
                      className="fixed z-[1000] bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden min-w-[560px] whitespace-normal break-keep"
                      style={{ 
                        left: menuPos.left, 
                        top: menuPos.top,
                        animation: 'fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      }}
                    >
                      {/* header */}
                      <div className="relative flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-charcoal/10 backdrop-blur-xl supports-[backdrop-filter]:bg-transparent shadow-sm transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75),rgba(255,255,255,0.60))] before:backdrop-blur-xl after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:bg-[radial-gradient(600px_350px_at_5%_0%,rgba(232,215,146,0.15),transparent_65%),radial-gradient(550px_320px_at_95%_0%,rgba(209,173,219,0.12),transparent_65%)]">
                        <div className="relative z-10 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-sage" />
                          <h2 className="text-sm md:text-base font-semibold text-charcoal">For Businesses</h2>
                        </div>
                        <button
                          onClick={() => setIsBusinessDropdownOpen(false)}
                          className="relative z-10 w-9 h-9 rounded-full border border-charcoal/10 bg-white/70 hover:bg-sage/10 hover:text-sage text-charcoal/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
                          aria-label="Close menu"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* body */}
                      <div className="px-5 sm:px-6 py-4 space-y-3">
                        <OptimizedLink
                          href="/business/login"
                          onClick={() => setIsBusinessDropdownOpen(false)}
                          className="group block rounded-xl bg-white/70 border border-charcoal/10 p-4 hover:bg-white/90 hover:border-coral/30 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-urbanist font-600 text-charcoal group-hover:text-coral text-sm transition-colors">Business Login</div>
                              <div className="text-xs text-charcoal/60 group-hover:text-coral/80 mt-0.5 transition-colors">Access your business account</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-charcoal/40 rotate-[-90deg] group-hover:text-coral transition-colors" />
                          </div>
                        </OptimizedLink>

                        <OptimizedLink
                          href="/claim-business"
                          onClick={() => setIsBusinessDropdownOpen(false)}
                          className="group block rounded-xl bg-white/70 border border-charcoal/10 p-4 hover:bg-white/90 hover:border-coral/30 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-urbanist font-600 text-charcoal group-hover:text-coral text-sm transition-colors">Claim Business</div>
                              <div className="text-xs text-charcoal/60 group-hover:text-coral/80 mt-0.5 transition-colors">Add your business to our platform</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-charcoal/40 rotate-[-90deg] group-hover:text-coral transition-colors" />
                          </div>
                        </OptimizedLink>

                        <OptimizedLink
                          href="/manage-business"
                          onClick={() => setIsBusinessDropdownOpen(false)}
                          className="group block rounded-xl bg-white/70 border border-charcoal/10 p-4 hover:bg-white/90 hover:border-coral/30 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-urbanist font-600 text-charcoal group-hover:text-coral text-sm transition-colors">Manage Business</div>
                              <div className="text-xs text-charcoal/60 group-hover:text-coral/80 mt-0.5 transition-colors">Update your business listing</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-charcoal/40 rotate-[-90deg] group-hover:text-coral transition-colors" />
                          </div>
                        </OptimizedLink>
                      </div>
                    </div>,
                    document.body
                  )
                }
              </div>

              {/* Search Toggle (manual close/open) */}
              <button
                onClick={() => setShowSearchBar((p) => !p)}
                className="group w-6 h-6 rounded-full flex items-center justify-center text-charcoal/90 hover:text-charcoal/90 transition-all duration-300 relative overflow-hidden"
                aria-label="Toggle search"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-off-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Search className="relative z-10 w-4 h-4" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-6 h-6 rounded-full flex items-center justify-center hover:bg-sage/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-charcoal/90" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-[5px]">
                    <span className="w-4 h-[2px] rounded-full bg-charcoal/90" />
                    <span className="w-4 h-[2px] rounded-full bg-charcoal/90" />
                    <span className="w-2 h-[2px] rounded-full bg-charcoal/90" />
                  </div>
                )}
              </button>

              {/* Profile */}
              <OptimizedLink
                href="/profile"
                className="group hidden md:flex w-6 h-6 rounded-full items-center justify-center text-charcoal/90 hover:text-charcoal/90 transition-all duration-300 relative overflow-hidden"
                aria-label="Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-off-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <User className="relative z-10 w-4 h-4" />
              </OptimizedLink>
            </div>
          </div>
        </div>
      </header>

      {/* Search Input Section — appears below navbar */}
      {showSearch && (
        <div
          className={`fixed left-0 right-0 z-40 bg-transparent transition-all duration-300 ease-out ${
            isHomeVariant 
              ? (showSearchBar ? "top-[calc(6rem+24px)] opacity-100 translate-y-0" : "top-[calc(6rem+24px)] opacity-0 -translate-y-4 pointer-events-none")
              : (showSearchBar ? "top-[64px] opacity-100 translate-y-0" : "top-[64px] opacity-0 -translate-y-4 pointer-events-none")
          }`}
          style={sf}
        >
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 max-w-[1300px]">
            {/* Anchor for the dropdown modal */}
            <div ref={searchWrapRef}>
              <SearchInput
                variant="header"
                placeholder="Discover exceptional local experiences, premium dining, and hidden gems..."
                mobilePlaceholder="Search places, coffee, yoga…"
                onSearch={(q) => console.log("search change:", q)}
                onSubmitQuery={handleSubmitQuery}
                onFilterClick={openFilters}
                onFocusOpenFilters={openFilters}
                showFilter
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-xl z-[10000] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-off-white z-[10001] shadow-lg shadow-sage/10 transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal/10 flex-shrink-0">
            <Logo variant="mobile" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[5px] hover:bg-sage/10 group ${isHomeVariant ? 'text-charcoal' : 'text-charcoal/90'}`}
              aria-label="Close menu"
            >
              <span className="w-5 h-[2px] bg-charcoal/90 rounded-full group-hover:bg-sage" />
              <span className="w-5 h-[2px] bg-charcoal/90 rounded-full group-hover:bg-sage" />
              <span className="w-2.5 h-[2px] bg-charcoal/90 rounded-full group-hover:bg-sage" />
            </button>
          </div>

          <nav className="flex flex-col py-4 px-4 overflow-y-auto flex-1 min-h-0">
            {["home", "saved", "leaderboard"].map((route) => (
              <OptimizedLink
                key={route}
                href={`/${route}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-charcoal hover:text-charcoal hover:bg-sage/5 transition-colors relative"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                <span className="flex items-center justify-between">
                  {route.charAt(0).toUpperCase() + route.slice(1)}
                  {route === "saved" && savedCount > 0 && (
                    <div className="bg-coral text-charcoal/90 text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg">
                      {savedCount > 99 ? "99+" : savedCount}
                    </div>
                  )}
                </span>
              </OptimizedLink>
            ))}
            
            {/* For Businesses Button */}
            <button
              ref={mobileBusinessBtnRef}
              onClick={() => setIsMobileBusinessDropdownOpen(!isMobileBusinessDropdownOpen)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-charcoal/90 hover:text-charcoal/90 hover:bg-sage/5 flex items-center gap-3 transition-all duration-200 text-left"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
            >
              For Businesses
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileBusinessDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="h-px bg-charcoal/10 my-4 mx-4" />
            <OptimizedLink
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-charcoal/90 hover:text-charcoal/90 hover:bg-sage/5 flex items-center gap-3 transition-all duration-200"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
            >
              Profile
            </OptimizedLink>
          </nav>
        </div>
      </div>

      {/* Mobile Business Dropdown Portal */}
      {isMobileBusinessDropdownOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[10002] md:hidden"
              onClick={() => setIsMobileBusinessDropdownOpen(false)}
            />
            {/* Dropdown */}
            <div
              className="fixed z-[10003] bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden w-[calc(100vw-32px)] max-w-[320px] md:hidden"
              style={{ 
                left: `${mobileMenuPos.left}px`, 
                top: `${mobileMenuPos.top + 48}px`,
                right: '16px',
                animation: 'fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              {/* header */}
              <div className="relative flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-charcoal/10 backdrop-blur-xl supports-[backdrop-filter]:bg-transparent shadow-sm transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75),rgba(255,255,255,0.60))] before:backdrop-blur-xl after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:bg-[radial-gradient(600px_350px_at_5%_0%,rgba(232,215,146,0.15),transparent_65%),radial-gradient(550px_320px_at_95%_0%,rgba(209,173,219,0.12),transparent_65%)]">
                <div className="relative z-10 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-sage" />
                  <h2 className="text-sm md:text-base font-semibold text-charcoal">For Businesses</h2>
                </div>
                <button
                  onClick={() => setIsMobileBusinessDropdownOpen(false)}
                  className="relative z-10 w-9 h-9 rounded-full border border-charcoal/10 bg-white/70 hover:bg-sage/10 hover:text-sage text-charcoal/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* body */}
              <div className="px-5 sm:px-6 py-4 space-y-3">
                <OptimizedLink
                  href="/business/login"
                  onClick={() => {
                    setIsMobileBusinessDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group block rounded-xl bg-white/70 border border-charcoal/10 p-4 hover:bg-white/90 hover:border-sage/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-urbanist font-600 text-charcoal text-sm">Business Login</div>
                      <div className="text-xs text-charcoal/60 mt-0.5">Access your business account</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-charcoal/40 rotate-[-90deg] group-hover:text-sage transition-colors" />
                  </div>
                </OptimizedLink>

                <OptimizedLink
                  href="/claim-business"
                  onClick={() => {
                    setIsMobileBusinessDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group block rounded-xl bg-white/70 border border-charcoal/10 p-4 hover:bg-white/90 hover:border-coral/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-urbanist font-600 text-charcoal text-sm">Claim Business</div>
                      <div className="text-xs text-charcoal/60 mt-0.5">Add your business to our platform</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-charcoal/40 rotate-[-90deg] group-hover:text-coral transition-colors" />
                  </div>
                </OptimizedLink>

                <OptimizedLink
                  href="/manage-business"
                  onClick={() => {
                    setIsMobileBusinessDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group block rounded-xl bg-white/70 border border-charcoal/10 p-4 hover:bg-white/90 hover:border-sage/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-urbanist font-600 text-charcoal text-sm">Manage Business</div>
                      <div className="text-xs text-charcoal/60 mt-0.5">Update your business listing</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-charcoal/40 rotate-[-90deg] group-hover:text-sage transition-colors" />
                  </div>
                </OptimizedLink>
              </div>
            </div>
          </>,
          document.body
        )}

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
