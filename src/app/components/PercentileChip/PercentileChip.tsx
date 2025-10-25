"use client";

import { Zap, Heart, Star, CheckCircle } from "lucide-react";
import { memo } from "react";

interface PercentileChipProps {
  label: string;
  value: number;
}

function PercentileChip({ label, value }: PercentileChipProps) {
  // Debug logging
  console.log('PercentileChip Debug:', {
    label,
    value,
    labelLowerCase: label.toLowerCase()
  });

  // Render icon based on label with inline fill styles for better visibility
  const renderIcon = () => {
    const iconClasses = "w-3 h-3 text-charcoal flex-shrink-0";

    switch (label.toLowerCase()) {
      case 'speed':
        return <Zap className={iconClasses} fill="currentColor" />;
      case 'hospitality':
        return <Heart className={iconClasses} fill="currentColor" />;
      case 'quality':
        return <Star className={iconClasses} fill="currentColor" />;
      default:
        return <CheckCircle className={iconClasses} />;
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/40 px-3 py-1.5 shadow-sm border border-white/40 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105">
      {renderIcon()}
      <span className="text-xs font-600 text-charcoal whitespace-nowrap">{value}%</span>
    </div>
  );
}

export default memo(PercentileChip);
