"use client";

import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import BusinessOfMonthPodium from "./BusinessOfMonthPodium";
import BusinessLeaderboardItem from "./BusinessLeaderboardItem";
import { BusinessOfTheMonth } from "../../data/communityHighlightsData";

interface BusinessOfMonthLeaderboardProps {
  businesses: BusinessOfTheMonth[];
  showFullLeaderboard: boolean;
  onToggleFullLeaderboard: () => void;
}

function BusinessOfMonthLeaderboard({
  businesses,
  showFullLeaderboard,
  onToggleFullLeaderboard,
}: BusinessOfMonthLeaderboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(businesses.map(b => b.category)));
    return ["all", ...uniqueCategories];
  }, [businesses]);

  // Filter and sort businesses by category and rating
  const sortedBusinesses = useMemo(() => {
    const filtered = selectedCategory === "all"
      ? businesses
      : businesses.filter(b => b.category === selectedCategory);
    return [...filtered].sort((a, b) => b.totalRating - a.totalRating);
  }, [businesses, selectedCategory]);

  // Memoize the business arrays to prevent unnecessary recalculations
  const visibleBusinesses = useMemo(
    () => (showFullLeaderboard ? sortedBusinesses : sortedBusinesses.slice(0, 5)),
    [sortedBusinesses, showFullLeaderboard]
  );

  const hiddenBusinesses = useMemo(() => sortedBusinesses.slice(5), [sortedBusinesses]);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-6 sm:mb-8 px-2">
        <h3 className="font-urbanist text-caption sm:text-body-sm font-600 text-charcoal/70 mb-3 text-center">Filter by Category</h3>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-full">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            const displayName = category === "all" ? "All Categories" : category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-urbanist font-semibold text-caption sm:text-body-sm
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-sage/30
                  whitespace-nowrap flex-shrink-0
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-sage to-sage/90 text-white shadow-md'
                      : 'bg-white/80 text-charcoal/70 hover:text-charcoal hover:bg-white border border-charcoal/20'
                  }
                `}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      </div>

      <BusinessOfMonthPodium topBusinesses={sortedBusinesses.slice(0, 3)} />

      <div className="space-y-2 sm:space-y-3">
        {visibleBusinesses.map((business, index) => (
          <BusinessLeaderboardItem
            key={business.id}
            business={business}
            index={index}
            rank={index + 1}
          />
        ))}

        <AnimatePresence>
          {showFullLeaderboard &&
            hiddenBusinesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <BusinessLeaderboardItem
                  business={business}
                  index={index + 5}
                  rank={index + 6}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {sortedBusinesses.length > 5 && (
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={onToggleFullLeaderboard}
            className="font-urbanist text-body-sm sm:text-body font-700 text-white transition-all duration-300 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-gradient-to-br from-sage to-sage/90 rounded-full flex items-center gap-1.5 sm:gap-2 mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-sage ring-1 ring-white/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {showFullLeaderboard ? (
              <>
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <span>View Full Leaderboard</span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default memo(BusinessOfMonthLeaderboard);
