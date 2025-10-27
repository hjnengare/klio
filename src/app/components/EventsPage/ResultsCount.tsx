// src/components/EventsPage/ResultsCount.tsx
"use client";

interface ResultsCountProps {
  count: number;
  filterType: "all" | "event" | "special";
}

export default function ResultsCount({ count, filterType }: ResultsCountProps) {
  const getFilterText = () => {
    switch (filterType) {
      case "all":
        return "events & specials";
      case "event":
        return "events";
      case "special":
        return "specials";
      default:
        return "items";
    }
  };

  return (
    <div className="pb-2">
      <div className="max-w-[1300px] mx-auto">
        <p className="font-urbanist text-sm text-charcoal/60">
          Showing {count} {getFilterText()}
        </p>
      </div>
    </div>
  );
}
