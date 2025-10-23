"use client";

import { CheckCircle } from "lucide-react";

interface SubcategorySelectionProps {
  selectedCount: number;
  children: React.ReactNode;
}

export default function SubcategorySelection({ selectedCount, children }: SubcategorySelectionProps) {
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
          ? "Select at least one subcategory to continue"
          : "Great! Select more or continue"}
      </p>
      {children}
    </div>
  );
}
