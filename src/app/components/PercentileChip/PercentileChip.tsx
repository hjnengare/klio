"use client";

import { Zap, Heart, Star, CheckCircle } from "lucide-react";
import { memo } from "react";

interface PercentileChipProps {
  label: string;
  value: number;
}

const getIconForLabel = (label: string) => {
  switch (label.toLowerCase()) {
    case 'speed':
      return Zap;
    case 'hospitality':
      return Heart;
    case 'quality':
      return Star;
    default:
      return CheckCircle;
  }
};

function PercentileChip({ label, value }: PercentileChipProps) {
  const IconComponent = getIconForLabel(label);

  return (
    <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm border border-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105">
      <IconComponent className="w-3.5 h-3.5 text-sage" />
      <span className="font-sf text-sm font-700 text-sage">{value}%</span>
    </div>
  );
}

export default memo(PercentileChip);