'use client';

import React from 'react';

export type CardVariant = 'default' | 'glass' | 'premium' | 'bordered';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-off-white border border-black/5 shadow-md',
  glass: 'bg-off-white/90 border border-black/5 backdrop-blur-xl shadow-sm',
  premium: 'bg-off-white/95 border border-white/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06),0_22px_70px_rgba(0,0,0,0.10)]',
  bordered: 'bg-off-white border-2 border-light-gray',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5 sm:p-7',
  lg: 'p-6 sm:p-8 md:p-9',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  children,
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const hoverStyles = hoverable || clickable
    ? 'hover:shadow-lg hover:-translate-y-0.5'
    : '';

  const cursorStyle = clickable ? 'cursor-pointer' : '';

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${cursorStyle}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Card sub-components for composition
export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`pb-4 border-b border-light-gray/30 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`pt-4 border-t border-light-gray/30 ${className}`}>
    {children}
  </div>
);
