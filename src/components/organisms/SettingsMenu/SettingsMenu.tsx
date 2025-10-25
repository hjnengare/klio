'use client';

import React from 'react';
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
    <div className={`p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 mb-12 ${className}`}>
      {title && (
        <h2 className="font-urbanist text-base font-600 text-charcoal mb-4">{title}</h2>
      )}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <SettingsMenuItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
