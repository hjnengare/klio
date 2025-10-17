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

  // Render icon based on label
  const renderIcon = () => {
    switch (label.toLowerCase()) {
      case 'speed':
        return <Zap className="w-4 h-4 text-red-500" />;
      case 'hospitality':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'quality':
        return <Star className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm border border-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105">
      {renderIcon()}
      <span className="text-sm font-bold text-green-600">{value}%</span>
    </div>
  );
}

export default memo(PercentileChip);