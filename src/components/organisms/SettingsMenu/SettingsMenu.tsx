'use client';

import React from 'react';
import { Card } from '@/components/molecules/Card';
import { SettingsMenuItem, SettingsMenuItemProps } from '@/components/molecules/SettingsMenuItem';

export interface SettingsMenuProps {
  menuItems: SettingsMenuItemProps[];
  title?: string;
  className?: string;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  menuItems,
  title,
  className = '',
}) => {
  return (
    <Card variant="glass" padding="md" className={className}>
      {title && (
        <h2 className="font-sf text-lg font-700 text-charcoal mb-4">{title}</h2>
      )}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <SettingsMenuItem key={index} {...item} />
        ))}
      </div>
    </Card>
  );
};
