// src/components/EventsPage/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "react-feather";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8 sm:mt-12 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-navbar-bg border border-charcoal/20 flex items-center justify-center hover:bg-navbar-bg/80 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous page"
        title="Previous"
      >
        <ChevronLeft className="text-white" size={20} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-navbar-bg font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
            currentPage === page
              ? "bg-sage text-white shadow-lg"
              : "border border-charcoal/20 text-white hover:bg-navbar-bg/80"
          }`}
          style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-navbar-bg border border-charcoal/20 flex items-center justify-center hover:bg-navbar-bg/80 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next page"
        title="Next"
      >
        <ChevronRight className="text-white" size={20} />
      </button>
    </div>
  );
}
