'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export type IconButtonVariant = 'default' | 'sage' | 'coral' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: 'bg-charcoal/5 hover:bg-sage/10 border-charcoal/5 hover:border-sage/20',
  sage: 'bg-sage/10 hover:bg-sage/20 border-sage/20 hover:border-sage/30 text-sage',
  coral: 'bg-coral/10 hover:bg-coral/20 border-coral/20 hover:border-coral/30 text-coral',
  ghost: 'bg-transparent hover:bg-charcoal/5 border-transparent',
};

const sizeStyles: Record<IconButtonSize, { button: string; icon: number }> = {
  sm: { button: 'w-8 h-8', icon: 16 },
  md: { button: 'w-10 h-10', icon: 20 },
  lg: { button: 'w-12 h-12', icon: 24 },
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  ariaLabel,
  className = '',
  disabled = false,
}) => {
  const { button: buttonSize, icon: iconSize } = sizeStyles[size];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`
        ${buttonSize}
        ${variantStyles[variant]}
        rounded-full flex items-center justify-center
        transition-all duration-200 border
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Icon size={iconSize} />
    </button>
  );
};
