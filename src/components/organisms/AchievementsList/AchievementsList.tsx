'use client';

import React from 'react';
import { AchievementItem, AchievementItemProps } from '@/components/molecules/AchievementItem';

export interface AchievementsListProps {
  achievements: AchievementItemProps[];
  title?: string;
  className?: string;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements,
  title = 'Your Achievements',
  className = '',
}) => {
  return (
    <div className={`p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 mb-6 ${className}`}>
      <h2 className="font-urbanist text-base font-600 text-charcoal mb-4">{title}</h2>
      {achievements.length > 0 ? (
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <AchievementItem key={index} {...achievement} />
          ))}
        </div>
      ) : (
        <p className="text-center text-charcoal/60 py-8 text-sm">
          No achievements yet. Keep exploring!
        </p>
      )}
    </div>
  );
};
