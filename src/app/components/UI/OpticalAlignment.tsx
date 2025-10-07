"use client";

import React, { useEffect, useRef } from 'react';
import { usePremiumPolish } from '../../hooks/usePremiumPolish';

// Optically-centered icon wrapper
interface OpticalIconProps {
  children: React.ReactNode;
  type: 'play' | 'pause' | 'arrow' | 'chevron' | 'triangle' | 'plus' | 'close' | 'check';
  direction?: 'left' | 'right' | 'up' | 'down';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OpticalIcon: React.FC<OpticalIconProps> = ({
  children,
  type,
  direction,
  size = 'md',
  className = '',
}) => {
  const iconRef = useRef<HTMLSpanElement>(null);
  const { optical } = usePremiumPolish();

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.setAttribute('data-icon-type', type);
      if (direction) {
        iconRef.current.setAttribute('data-direction', direction);
      }
      optical.adjustForOpticalCentering(iconRef.current, 'icon');
    }
  }, [type, direction, optical]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <span
      ref={iconRef}
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      data-icon-type={type}
      data-direction={direction}
    >
      {children}
    </span>
  );
};

// Premium button with optical centering
interface OpticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconType?: OpticalIconProps['type'];
}

export const OpticalButton: React.FC<OpticalButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  iconType,
  className = '',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { optical } = usePremiumPolish();

  useEffect(() => {
    if (buttonRef.current) {
      optical.adjustForOpticalCentering(buttonRef.current, 'button');
    }
  }, [optical]);

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  const iconElement = icon && iconType ? (
    <OpticalIcon
      type={iconType}
      size={size === 'lg' ? 'md' : 'sm'}
      className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}
    >
      {icon}
    </OpticalIcon>
  ) : icon ? (
    <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>
      {icon}
    </span>
  ) : null;

  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

// Optically-aligned text component
interface OpticalTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export const OpticalText: React.FC<OpticalTextProps> = ({
  children,
  as: Component = 'p',
  size = 'md',
  weight = 'normal',
  className = '',
}) => {
  const textRef = useRef<HTMLElement>(null);
  const { optical } = usePremiumPolish();

  useEffect(() => {
    if (textRef.current) {
      optical.adjustForOpticalCentering(textRef.current, 'text');
    }
  }, [optical]);

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Component
      ref={textRef as any}
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${className}`}
    >
      {children}
    </Component>
  );
};

// Spacing utility component with design tokens
interface SpacingBoxProps {
  children: React.ReactNode;
  p?: keyof typeof SPACING_TOKENS;
  px?: keyof typeof SPACING_TOKENS;
  py?: keyof typeof SPACING_TOKENS;
  pt?: keyof typeof SPACING_TOKENS;
  pr?: keyof typeof SPACING_TOKENS;
  pb?: keyof typeof SPACING_TOKENS;
  pl?: keyof typeof SPACING_TOKENS;
  m?: keyof typeof SPACING_TOKENS;
  mx?: keyof typeof SPACING_TOKENS;
  my?: keyof typeof SPACING_TOKENS;
  mt?: keyof typeof SPACING_TOKENS;
  mr?: keyof typeof SPACING_TOKENS;
  mb?: keyof typeof SPACING_TOKENS;
  ml?: keyof typeof SPACING_TOKENS;
  className?: string;
}

const SPACING_TOKENS = {
  '0': '0',
  'xs': '1', // 4px
  'sm': '2', // 8px
  'md': '4', // 16px
  'lg': '6', // 24px
  'xl': '8', // 32px
  '2xl': '12', // 48px
  '3xl': '16', // 64px
  '4xl': '24', // 96px
} as const;

export const SpacingBox: React.FC<SpacingBoxProps> = ({
  children,
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
  className = '',
}) => {
  const spacingClasses = [
    p && `p-${SPACING_TOKENS[p]}`,
    px && `px-${SPACING_TOKENS[px]}`,
    py && `py-${SPACING_TOKENS[py]}`,
    pt && `pt-${SPACING_TOKENS[pt]}`,
    pr && `pr-${SPACING_TOKENS[pr]}`,
    pb && `pb-${SPACING_TOKENS[pb]}`,
    pl && `pl-${SPACING_TOKENS[pl]}`,
    m && `m-${SPACING_TOKENS[m]}`,
    mx && `mx-${SPACING_TOKENS[mx]}`,
    my && `my-${SPACING_TOKENS[my]}`,
    mt && `mt-${SPACING_TOKENS[mt]}`,
    mr && `mr-${SPACING_TOKENS[mr]}`,
    mb && `mb-${SPACING_TOKENS[mb]}`,
    ml && `ml-${SPACING_TOKENS[ml]}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={`${spacingClasses} ${className}`}>
      {children}
    </div>
  );
};

// Premium focus ring component
interface FocusRingProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow';
  offset?: boolean;
}

export const FocusRing: React.FC<FocusRingProps> = ({
  children,
  size = 'md',
  color = 'blue',
  offset = true,
}) => {
  const sizeClasses = {
    sm: 'focus:ring-1',
    md: 'focus:ring-2',
    lg: 'focus:ring-4',
  };

  const colorClasses = {
    blue: 'focus:ring-blue-500',
    green: 'focus:ring-green-500',
    red: 'focus:ring-red-500',
    yellow: 'focus:ring-yellow-500',
  };

  const offsetClass = offset ? 'focus:ring-offset-2' : '';
  const ringClasses = `${sizeClasses[size]} ${colorClasses[color]} ${offsetClass} focus:outline-none`;

  return React.cloneElement(children as React.ReactElement, {
    className: `${(children as React.ReactElement).props.className || ''} ${ringClasses}`,
  });
};

// Visual alignment grid for development
interface AlignmentGridProps {
  show?: boolean;
  gridSize?: number;
  color?: string;
  opacity?: number;
}

export const AlignmentGrid: React.FC<AlignmentGridProps> = ({
  show = false,
  gridSize = 8,
  color = '#00ff00',
  opacity = 0.1,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        backgroundImage: `
          linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        opacity,
      }}
    />
  );
};

// Premium polish provider component
interface PremiumPolishProviderProps {
  children: React.ReactNode;
  showAlignmentGrid?: boolean;
  autoFix?: boolean;
  enableAllFeatures?: boolean;
}

export const PremiumPolishProvider: React.FC<PremiumPolishProviderProps> = ({
  children,
  showAlignmentGrid = false,
  autoFix = false,
  enableAllFeatures = true,
}) => {
  const { polishReport } = usePremiumPolish({
    autoFix,
    enableOpticalCentering: enableAllFeatures,
    enableSpacingValidation: enableAllFeatures,
    enableBorderConsistency: enableAllFeatures,
    enableAnimationContinuity: enableAllFeatures,
  });

  return (
    <>
      {children}
      <AlignmentGrid show={showAlignmentGrid} />

      {/* Development polish report */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white   border border-gray-300 rounded-lg p-3 shadow-lg text-xs z-50">
          <div className="font-semibold mb-1">Polish Score: {polishReport.score}/100</div>
          <div className="text-gray-600">Issues: {polishReport.issues}</div>
          {polishReport.recommendations.length > 0 && (
            <div className="mt-2">
              <div className="font-medium">Recommendations:</div>
              <ul className="list-disc list-inside text-gray-600">
                {polishReport.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};