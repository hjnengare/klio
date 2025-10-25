'use client';

import React from 'react';
import { StatsGrid, Stat } from '@/components/molecules/StatsGrid';

export interface ProfileStatsSectionProps {
  stats: Stat[];
  title?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ProfileStatsSection: React.FC<ProfileStatsSectionProps> = ({
  stats,
  title = 'Stats Overview',
  columns = 3,
  className = '',
}) => {
  return (
    <div className={`p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 mb-6 ${className}`}>
      <h2 className="font-urbanist text-base font-600 text-charcoal mb-4">{title}</h2>
      <StatsGrid stats={stats} columns={columns} />
    </div>
  );
};
