// src/components/SearchInput/SearchInput.tsx
"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Search, Sliders } from "react-feather";

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

const SearchInput = forwardRef<HTMLFormElement, SearchInputProps>(
  (
    {
      placeholder = "Search...",
      mobilePlaceholder = "Search...",
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

    // ref is now the form ref

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
      <form onSubmit={handleSubmit} className={`${containerClass} ${className}`} ref={ref}>
        <div className="relative">
          {/* left icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="w-5 h-5 text-charcoal" strokeWidth={2} />
          </div>

          {/* right icon (filters) */}
          {showFilter && onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-charcoal/60 hover:text-sage transition-colors z-10"
              aria-label="Open filters"
            >
              <Sliders className="w-4 h-4" />
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
              w-full bg-off-white border-2 border-charcoal/20 rounded-full
              text-sm placeholder:text-xs placeholder:text-charcoal/50 font-urbanist text-charcoal
              focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20
              hover:border-charcoal/30 transition-all duration-200
              ${showFilter && onFilterClick ? "pl-12 pr-12" : "pl-12 pr-4"}
              ${variant === "header" ? "py-3.5" : "py-3"}
            `}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
            aria-label="Search"
          />
        </div>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
