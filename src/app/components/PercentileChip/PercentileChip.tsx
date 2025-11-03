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

  // Render icon based on label with specific colors
  const renderIcon = () => {
    const baseClasses = "w-3 h-3 flex-shrink-0";

    switch (label.toLowerCase()) {
      case 'speed':
        return (
          <Zap 
            className={`${baseClasses} text-amber-500`} 
            fill="currentColor" 
          />
        );
      case 'hospitality':
        return (
          <Heart 
            className={`${baseClasses} text-pink-500`} 
            fill="currentColor" 
          />
        );
      case 'quality':
        return (
          <Star 
            className={`${baseClasses} text-amber-500`} 
            fill="currentColor" 
          />
        );
      default:
        return <CheckCircle className={`${baseClasses} text-charcoal`} />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-md border border-white/30 backdrop-blur-md transition-all duration-200 hover:shadow-md hover:scale-105 ${
      isPlaceholder 
        ? 'bg-white/90 border-white/20 opacity-50' 
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
