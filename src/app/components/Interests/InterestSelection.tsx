"use client";

import { CheckCircle } from "lucide-react";

interface InterestSelectionProps {
  selectedCount: number;
  minSelections: number;
  maxSelections: number;
}

export default function InterestSelection({ selectedCount, minSelections, maxSelections }: InterestSelectionProps) {
  const sf = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <div className="text-center mb-4 enter-fade" style={{ animationDelay: "0.1s" }}>
      <div
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3 transition-colors duration-300 ${
          selectedCount >= minSelections
            ? "bg-sage/10 border border-sage/30"
            : "bg-sage/10 border border-sage/20"
        }`}
      >
        <span
          className="text-sm font-semibold text-sage"
          style={sf}
          aria-live="polite"
          aria-atomic="true"
        >
          {selectedCount} of {minSelections}-{maxSelections} selected
        </span>
        {selectedCount >= minSelections && (
          <CheckCircle className="w-4 h-4 text-[hsl(148,20%,38%)]" aria-hidden="true" />
        )}
      </div>
      <p className="text-xs text-charcoal/60" style={sf} aria-live="polite">
        {selectedCount < minSelections
          ? `Select ${minSelections - selectedCount} or more to continue`
          : selectedCount === maxSelections
          ? "Perfect! You've selected the maximum"
          : "Great! You can continue or select more"}
      </p>
    </div>
  );
}
