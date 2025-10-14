// src/components/Header/Header.tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { User, X, Search } from "lucide-react";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";

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

  // Anchor for the dropdown FilterModal to hang under
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

  // NEW: when user submits the query (Enter), we close the search bar (and filters if open)
  const handleSubmitQuery = (query: string) => {
    console.log("submit query:", query);
    setShowSearchBar(false);
    if (isFilterVisible) closeFilters();
  };

  const headerClassName =
    variant === "frosty"
      ? "fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/20 shadow-2xl shadow-sage/10 transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-b from-white/40 via-white/30 to-white/20 before:backdrop-blur-2xl after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:bg-[radial-gradient(800px_400px_at_10%_0%,rgba(120,119,198,0.08),transparent_70%),radial-gradient(700px_350px_at_90%_0%,rgba(255,182,193,0.06),transparent_70%)] after:backdrop-blur-sm"
      : "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg shadow-sage/5 transition-all duration-300";

  return (
    <>
      <header className={headerClassName} style={sf}>
        <div className="relative z-[1] max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          {/* Top row */}
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/home" className="group flex-shrink-0 relative" aria-label="KLIO Home">
              <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal drop-shadow-sm">
                KLIO
              </span>
            </Link>

            <div className="flex-1" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {["home", "saved", "leaderboard", "claim-business"].map((route) => (
                <Link
                  key={route}
                  href={`/${route}`}
                  className="group capitalize px-3 lg:px-4 py-2 rounded-full text-sm font-semibold text-charcoal/80 hover:text-sage transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sage/10 to-coral/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-sm bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{route}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Search Toggle (manual close/open) */}
              <button
                onClick={() => setShowSearchBar((p) => !p)}
                className="group w-10 h-10 rounded-full flex items-center justify-center text-charcoal/80 hover:text-sage transition-all duration-300 relative overflow-hidden"
                aria-label="Toggle search"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Search className="relative z-10 w-5 h-5" />
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
                className="group hidden md:flex w-10 h-10 rounded-full items-center justify-center text-charcoal hover:text-sage transition-all duration-300 relative overflow-hidden"
                aria-label="Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage/20 to-coral/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        className={`fixed top-0 right-0 h-full w-full backdrop-blur-2xl bg-white/80 z-[100] shadow-2xl shadow-sage/10 transform md:hidden ${
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
            {["home", "saved", "leaderboard"].map((route) => (
              <Link
                key={route}
                href={`/${route}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-charcoal/80 hover:text-sage hover:bg-sage/5 transition-colors"
              >
                {route.charAt(0).toUpperCase() + route.slice(1)}
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
