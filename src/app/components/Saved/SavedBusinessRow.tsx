// src/components/Saved/SavedBusinessRow.tsx
"use client";

import { BookmarkCheck } from "lucide-react";
import BusinessCard, { Business } from "../BusinessCard/BusinessCard";
import ScrollableSection from "../ScrollableSection/ScrollableSection";
import { useSavedItems } from "../../contexts/SavedItemsContext";

export default function SavedBusinessRow({
  title,
  businesses,
  showCount = false,
}: {
  title: string;
  businesses: Business[];
  showCount?: boolean;
}) {
  const { savedCount } = useSavedItems();

  if (!businesses || businesses.length === 0) return null;

  return (
    <section
      className="relative"
      aria-label={title}
      data-section
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-urbanist text-sm sm:text-base font-600 text-charcoal hover:text-sage transition-all duration-300 px-3 sm:px-4 py-1 hover:bg-sage/5 rounded-lg cursor-default">
              {title}
            </h2>
            {showCount && savedCount > 0 && (
              <span className="px-3 py-1 bg-sage/10 text-sage text-xs font-600 rounded-full">
                {savedCount}
              </span>
            )}
          </div>
        </div>

        <ScrollableSection>
          <div className="flex gap-3">
            {businesses.map((business) => (
              <div key={business.id} className="list-none relative group">
                <BusinessCard business={business} />
                {/* Saved indicator */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-sage to-sage/80 rounded-full flex items-center justify-center shadow-lg z-10 opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <BookmarkCheck className="w-4 h-4 text-white" fill="white" />
                </div>
              </div>
            ))}
          </div>
        </ScrollableSection>
      </div>
    </section>
  );
}
