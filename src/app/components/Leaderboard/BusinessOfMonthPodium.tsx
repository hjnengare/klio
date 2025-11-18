"use client";

import { BusinessOfTheMonth } from "../../data/communityHighlightsData";

interface BusinessOfMonthPodiumProps {
  topBusinesses: BusinessOfTheMonth[];
}

export default function BusinessOfMonthPodium({ topBusinesses }: BusinessOfMonthPodiumProps) {
  if (!topBusinesses || topBusinesses.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* Podium display for top 3 businesses */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 px-2">
        {topBusinesses.map((business, index) => {
          const rank = index + 1;
          const height = rank === 1 ? "h-32 sm:h-40" : rank === 2 ? "h-24 sm:h-32" : "h-20 sm:h-28";
          
          return (
            <div
              key={business.id}
              className={`flex-1 max-w-[120px] sm:max-w-[150px] ${height} bg-gradient-to-br from-sage/10 to-sage/5 rounded-t-xl border border-sage/20 flex flex-col items-center justify-end p-2 sm:p-3`}
            >
              <div className="text-center w-full">
                <div className="text-2xl sm:text-3xl font-bold text-sage mb-1" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                  #{rank}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-charcoal truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                  {business.name}
                </div>
                <div className="text-[10px] sm:text-xs text-charcoal/70 mt-1" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                  {business.totalRating?.toFixed(1) || "0.0"} ⭐
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

