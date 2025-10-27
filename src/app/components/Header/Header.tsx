// src/components/Header/Header.tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { User, X, Search, ChevronDown, Store, LogIn } from "lucide-react";
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
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSaysoDropdownOpen, setIsSaysoDropdownOpen] = useState(false);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSaysoDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.sayso-dropdown')) {
          setIsSaysoDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSaysoDropdownOpen]);

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
      <link href="https://fonts.googleapis.com/css2?family=Italianno&family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&family=Shadows+Into+Light&family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <header className={headerClassName} style={sf}>
        <div className="relative z-[1] max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          {/* Top row */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <OptimizedLink href="/home" className="group flex-shrink-0 relative" aria-label="KLIO Home">
              <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Logo variant="default" className="relative" />
            </OptimizedLink>

            {/* Desktop nav - centered */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1 justify-center">
              {["home", "saved", "leaderboard"].map((route) => (
                <OptimizedLink
                  key={route}
                  href={`/${route}`}
                  className="group capitalize px-3 lg:px-4 py-2 rounded-full text-xs font-bold text-white hover:text-white transition-all duration-300 relative"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{route.charAt(0).toUpperCase() + route.slice(1)}</span>
                  {route === "saved" && savedCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-sage text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg z-20">
                      {savedCount > 99 ? "99+" : savedCount}
                    </div>
                  )}
                </OptimizedLink>
              ))}

              {/* For Businesses Dropdown */}
              <div className="relative sayso-dropdown" key="for-businesses-dropdown">
                <button
                  onClick={() => setIsSaysoDropdownOpen(!isSaysoDropdownOpen)}
                  className="group capitalize px-3 lg:px-4 py-2 rounded-full text-xs font-bold text-white hover:text-white transition-all duration-300 relative flex items-center gap-1"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-off-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 whitespace-nowrap">For Businesses</span>
                  <ChevronDown className={`relative z-10 w-3 h-3 transition-transform duration-200 ${isSaysoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isSaysoDropdownOpen && (
                  <div className="absolute top-full left-0 mt-3 w-[350px] bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-xl border border-white/50 rounded-2xl ring-1 ring-white/20 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Decorative gradient blur */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/20 to-transparent rounded-full blur-2xl" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-coral/20 to-transparent rounded-full blur-2xl" />

                    <div className="relative py-3 px-2">
                      <OptimizedLink
                        href="/business/login"
                        onClick={() => setIsSaysoDropdownOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 mx-2 text-sm font-600 font-urbanist text-charcoal hover:bg-white/60 transition-all duration-200 group relative rounded-xl"
                      >
                        <div className="w-11 h-11 bg-gradient-to-br from-sage/20 to-sage/10 rounded-xl flex items-center justify-center group-hover:from-sage/30 group-hover:to-sage/20 transition-all duration-200 shadow-sm">
                          <LogIn className="w-5 h-5 text-sage" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <div className="font-600 text-charcoal">Business Login</div>
                          <div className="text-xs text-charcoal/60 mt-0.5">Access your account</div>
                        </div>
                      </OptimizedLink>

                      <OptimizedLink
                        href="/claim-business"
                        onClick={() => setIsSaysoDropdownOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 mx-2 text-sm font-600 font-urbanist text-charcoal hover:bg-white/60 transition-all duration-200 group relative rounded-xl"
                      >
                        <div className="w-11 h-11 bg-gradient-to-br from-coral/20 to-coral/10 rounded-xl flex items-center justify-center group-hover:from-coral/30 group-hover:to-coral/20 transition-all duration-200 shadow-sm">
                          <Store className="w-5 h-5 text-coral" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <div className="font-600 text-charcoal">Claim Business</div>
                          <div className="text-xs text-charcoal/60 mt-0.5">Add your business</div>
                        </div>
                      </OptimizedLink>

                      <OptimizedLink
                        href="/manage-business"
                        onClick={() => setIsSaysoDropdownOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 mx-2 text-sm font-600 font-urbanist text-charcoal hover:bg-white/60 transition-all duration-200 group relative rounded-xl"
                      >
                        <div className="w-11 h-11 bg-gradient-to-br from-sage/20 to-sage/10 rounded-xl flex items-center justify-center group-hover:from-sage/30 group-hover:to-sage/20 transition-all duration-200 shadow-sm">
                          <Store className="w-5 h-5 text-sage" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <div className="font-600 text-charcoal">Manage Business</div>
                          <div className="text-xs text-charcoal/60 mt-0.5">Update your listing</div>
                        </div>
                      </OptimizedLink>
                    </div>
                  </div>
                )}
              </div>
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
              <OptimizedLink
                href="/profile"
                className="group hidden md:flex w-10 h-10 rounded-full items-center justify-center text-white hover:text-white transition-all duration-300 relative overflow-hidden"
                aria-label="Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-off-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <User className="relative z-10 w-5 h-5" />
              </OptimizedLink>
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
        className={`fixed top-0 right-0 h-full w-full backdrop-blur-lg bg-off-white/80 z-[100] shadow-lg shadow-sage/10 transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal/10">
            <Logo variant="mobile" />
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
                    <div className="bg-coral text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg">
                      {savedCount > 99 ? "99+" : savedCount}
                    </div>
                  )}
                </span>
              </OptimizedLink>
            ))}
            
            {/* For Businesses Section */}
            <div className="px-4 py-2" key="for-businesses-mobile">
              <div className="font-urbanist text-xs font-600 text-charcoal/60 uppercase tracking-wider mb-3 px-2">For Businesses</div>
              <div className="space-y-2">
                <OptimizedLink
                  href="/business/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-600 font-urbanist text-charcoal hover:text-charcoal hover:bg-white/60 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-sage/30 group-hover:to-sage/20 transition-all duration-200 shadow-sm">
                    <LogIn className="w-5 h-5 text-sage" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-600 text-charcoal">Business Login</div>
                    <div className="text-xs text-charcoal/60 mt-0.5">Access your account</div>
                  </div>
                </OptimizedLink>
                <OptimizedLink
                  href="/claim-business"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-600 font-urbanist text-charcoal hover:text-charcoal hover:bg-white/60 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-coral/30 group-hover:to-coral/20 transition-all duration-200 shadow-sm">
                    <Store className="w-5 h-5 text-coral" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-600 text-charcoal">Claim Business</div>
                    <div className="text-xs text-charcoal/60 mt-0.5">Add your business</div>
                  </div>
                </OptimizedLink>
                <OptimizedLink
                  href="/manage-business"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-600 font-urbanist text-charcoal hover:text-charcoal hover:bg-white/60 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-sage/30 group-hover:to-sage/20 transition-all duration-200 shadow-sm">
                    <Store className="w-5 h-5 text-sage" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-600 text-charcoal">Manage Business</div>
                    <div className="text-xs text-charcoal/60 mt-0.5">Update your listing</div>
                  </div>
                </OptimizedLink>
              </div>
            </div>
            <div className="h-px bg-charcoal/10 my-4 mx-4" />
            <OptimizedLink
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-white hover:text-white hover:bg-sage/5 flex items-center gap-3 transition-all duration-200"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
            >
              <User className="w-5 h-5" />
              Profile
            </OptimizedLink>
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
