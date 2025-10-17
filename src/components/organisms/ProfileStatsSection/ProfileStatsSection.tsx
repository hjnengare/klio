'use client';

import React from 'react';
import { Card } from '@/components/molecules/Card';
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
    <Card variant="glass" padding="md" className={className}>
      <h2 className="font-sf text-lg font-700 text-charcoal mb-4">{title}</h2>
      <StatsGrid stats={stats} columns={columns} />
    </Card>
  );
};
