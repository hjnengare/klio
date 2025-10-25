'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  iconColor = 'text-coral',
  className = '',
}) => {
  return (
    <div className={`text-center p-4 bg-white/30 rounded-lg hover:bg-white/40 transition-all duration-200 ${className}`}>
      <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-white/60">
        <Icon
          className={`${iconColor} w-6 h-6`}
          strokeWidth={2.5}
          style={{ fill: iconColor.includes('coral') || iconColor.includes('sage') ? 'currentColor' : 'none' }}
        />
      </div>
      <span className="font-urbanist text-lg font-700 text-charcoal leading-tight block mb-1">
        {value}
      </span>
      <span className="text-xs font-400 text-charcoal/70 leading-tight block">
        {label}
      </span>
    </div>
  );
};
