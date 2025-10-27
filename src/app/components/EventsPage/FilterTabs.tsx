// src/components/EventsPage/FilterTabs.tsx
"use client";

interface FilterTabsProps {
  selectedFilter: "all" | "event" | "special";
  onFilterChange: (filter: "all" | "event" | "special") => void;
}

export default function FilterTabs({
  selectedFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="pb-4">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-urbanist font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
              selectedFilter === "all"
                ? "bg-coral text-white shadow-lg"
                : "bg-off-white text-charcoal/70 hover:bg-coral/10 hover:text-coral border border-charcoal/20"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange("event")}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-urbanist font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
              selectedFilter === "event"
                ? "bg-coral text-white shadow-lg"
                : "bg-off-white text-charcoal/70 hover:bg-coral/10 hover:text-coral border border-charcoal/20"
            }`}
          >
            Events
          </button>
          <button
            onClick={() => onFilterChange("special")}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-urbanist font-600 text-sm sm:text-base transition-all duration-200 active:scale-95 ${
              selectedFilter === "special"
                ? "bg-coral text-white shadow-lg"
                : "bg-off-white text-charcoal/70 hover:bg-coral/10 hover:text-coral border border-charcoal/20"
            }`}
          >
            Specials
          </button>
        </div>
      </div>
    </div>
  );
}
