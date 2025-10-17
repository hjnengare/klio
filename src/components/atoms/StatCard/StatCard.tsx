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
    <div className={`text-center px-1 ${className}`}>
      <div className="flex flex-col items-center mb-2">
        <Icon
          className={`${iconColor} w-5 h-5 mb-1`}
          style={{ fill: iconColor.includes('coral') || iconColor.includes('sage') ? 'currentColor' : 'none' }}
        />
        <span className="font-sf text-xl font-700 text-charcoal leading-tight">
          {value}
        </span>
      </div>
      <span className="text-sm font-400 text-charcoal/60 leading-tight">
        {label}
      </span>
    </div>
  );
};
