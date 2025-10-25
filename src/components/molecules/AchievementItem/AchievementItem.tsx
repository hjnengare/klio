'use client';

import React from 'react';
import { Trophy, CheckCircle } from 'lucide-react';

export interface AchievementItemProps {
  name: string;
  description?: string | null;
  icon?: string;
  earnedAt?: string;
  className?: string;
}

export const AchievementItem: React.FC<AchievementItemProps> = ({
  name,
  description,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 transition-all duration-200 bg-sage/10 border border-sage/20 rounded-xl ${className}`}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage/20">
        <Trophy className="w-5 h-5 text-sage" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-urbanist text-base font-600 text-charcoal">{name}</span>
        {description && (
          <p className="text-sm text-charcoal/60 mt-1">{description}</p>
        )}
      </div>
      <CheckCircle className="text-sage w-5 h-5 flex-shrink-0" />
    </div>
  );
};
