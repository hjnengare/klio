"use client";

import { Zap, Heart, Star, CheckCircle } from "react-feather";
import { memo } from "react";

interface PercentileChipProps {
  label: string;
  value: number;
}

function PercentileChip({ label, value }: PercentileChipProps) {
  // Handle placeholder (0 value) with grayed out style
  const isPlaceholder = value === 0;
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  const chipTitle = isPlaceholder
    ? `${formattedLabel} insights coming soon`
    : `${formattedLabel} score: ${value}%`;

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
    <div
      role="button"
      tabIndex={0}
      title={chipTitle}
      aria-label={chipTitle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
        }
      }}
      className="inline-flex items-center gap-1.5 px-4 pt-1">
      {renderIcon()}
      <span className={`text-xs font-600 whitespace-nowrap  ${
        isPlaceholder ? 'text-charcoal/40' : 'text-charcoal'
      }`}>
        {isPlaceholder ? '—' : `${value}%`}
      </span>
    </div>
  );
}

export default memo(PercentileChip);
