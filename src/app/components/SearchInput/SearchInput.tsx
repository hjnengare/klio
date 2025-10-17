// src/components/SearchInput/SearchInput.tsx
"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  mobilePlaceholder?: string;
  onSearch?: (query: string) => void;           // fires on change
  onSubmitQuery?: (query: string) => void;      // fires on Enter / submit
  onFilterClick?: () => void;
  onFocusOpenFilters?: () => void;
  showFilter?: boolean;
  className?: string;
  variant?: "header" | "page";
}

const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  (
    {
      placeholder = "Discover exceptional local experiences, premium dining, and hidden gems...",
      mobilePlaceholder = "Search places, coffee, yoga…",
      onSearch,
      onSubmitQuery,
      onFilterClick,
      onFocusOpenFilters,
      showFilter = true,
      className = "",
      variant = "header",
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [ph, setPh] = useState(placeholder);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    useEffect(() => {
      const setByViewport = () => {
        setPh(window.innerWidth >= 1024 ? placeholder : mobilePlaceholder);
      };
      setByViewport();
      window.addEventListener("resize", setByViewport);
      return () => window.removeEventListener("resize", setByViewport);
    }, [placeholder, mobilePlaceholder]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      onSearch?.(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmitQuery?.(searchQuery);
    };

    const containerClass =
      variant === "header" ? "w-full" : "relative group w-full sm:w-[90%] md:w-[85%] lg:w-[75%]";

    return (
      <form onSubmit={handleSubmit} className={`${containerClass} ${className}`} ref={containerRef}>
        <div
          className={`
            relative group rounded-full border border-sage bg-off-white/60
            transition-all duration-300
            focus-within:outline-none focus-within:ring-0
          `}
        >
          {/* left icon */}
          <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-charcoal/60 z-10">
            <Search className="w-4 h-4" />
          </div>

          {/* right icon (filters) */}
          {showFilter && onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-charcoal/60 hover:text-sage transition-colors z-10 p-2"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocusCapture={onFocusOpenFilters}
            onTouchStart={onFocusOpenFilters}
            placeholder={ph}
            className={`
              w-full bg-transparent rounded-full
              ${showFilter && onFilterClick ? "pl-12 pr-12 sm:pl-14 sm:pr-12" : "pl-12 pr-4"}
              ${variant === "header" ? "py-3 text-base lg:text-lg" : "py-2 text-sm md:text-base"}
              text-charcoal placeholder-charcoal/40
              outline-none ring-0 focus:ring-0 border-0
            `}
            aria-label="Search"
          />
        </div>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
