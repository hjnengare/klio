"use client";

import { Zap, Heart, Star, CheckCircle } from "react-feather";
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

  // Handle placeholder (0 value) with grayed out style
  const isPlaceholder = value === 0;

  // Render icon based on label with coral stroke
  const renderIcon = () => {
    const baseClasses = "w-3 h-3 flex-shrink-0 text-coral";

    switch (label.toLowerCase()) {
      case 'speed':
        return (
          <Zap 
            className={baseClasses}
            fill="currentColor" 
          />
        );
      case 'hospitality':
        return (
          <Heart 
            className={baseClasses}
            fill="currentColor" 
          />
        );
      case 'quality':
        return (
          <Star 
            className={baseClasses}
            fill="currentColor" 
          />
        );
      default:
        return <CheckCircle className={baseClasses} />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-md border border-white/30 transition-all duration-200 hover:shadow-md hover:scale-105 ${
      isPlaceholder 
        ? 'bg-white/90 border-white/20' 
        : 'bg-white/90 border-white/30'
    }`}>
      {renderIcon()}
      <span className={`text-xs font-600 whitespace-nowrap ${
        isPlaceholder ? 'text-charcoal/40' : 'text-charcoal'
      }`}>
        {isPlaceholder ? '—' : `${value}%`}
      </span>
    </div>
  );
}

export default memo(PercentileChip);
