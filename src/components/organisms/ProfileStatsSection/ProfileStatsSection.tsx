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
    <div className={`p-6 sm:p-8 bg-card-bg border border-white/50 rounded-2xl shadow-sm mb-6 ${className}`}>
      <h2 className="font-urbanist text-sm font-bold text-charcoal mb-4">{title}</h2>
      <StatsGrid stats={stats} columns={columns} />
    </div>
  );
};
