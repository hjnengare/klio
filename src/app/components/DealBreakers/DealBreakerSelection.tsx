"use client";

import { CheckCircle } from "lucide-react";

interface DealBreaker {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface DealBreakerSelectionProps {
  selectedCount: number;
  children: React.ReactNode;
}

export default function DealBreakerSelection({ selectedCount, children }: DealBreakerSelectionProps) {
  const sf = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  };

  return (
    <div className="text-center mb-4">
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-2 bg-sage/10 border border-sage/20">
        <span className="text-sm font-semibold text-sage" style={sf}>
          {selectedCount} selected
        </span>
        {selectedCount > 0 && (
          <CheckCircle className="w-4 h-4 text-sage" />
        )}
      </div>
      <p className="text-xs text-charcoal/60" style={sf}>
        {selectedCount === 0
          ? "Select at least one deal-breaker to continue"
          : "Great! Select more or complete setup"}
      </p>
      {children}
    </div>
  );
}
