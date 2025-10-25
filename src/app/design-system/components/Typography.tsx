/**
 * TYPOGRAPHY COMPONENT - BLABBR DESIGN SYSTEM
 *
 * Standardized typography component with consistent styling
 * Implements the design system typography scale and variants
 */

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../utils/cn';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'strong' | 'em';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Typography variant */
  variant?:
    | 'display-lg' | 'display-md'
    | 'heading-lg' | 'heading-md' | 'heading-sm'
    | 'body-lg' | 'body-md' | 'body-sm'
    | 'footnote' | 'caption';

  /** HTML element to render */
  as?: TypographyElement;

  /** Text color variant */
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'success' | 'warning' | 'error' | 'sage' | 'coral';

  /** Font weight override */
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';

  /** Text decoration */
  decoration?: 'none' | 'underline' | 'line-through';

  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  /** Truncate text with ellipsis */
  truncate?: boolean;

  /** Apply responsive font sizes */
  responsive?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Typography content */
  children: ReactNode;
}

// =============================================================================
// STYLE VARIANTS
// =============================================================================

const typographyVariants = {
  base: [
    'font-primary',
    'transition-colors duration-normal',
  ],

  variants: {
    'display-lg': 'text-display-lg font-bold',
    'display-md': 'text-display-md font-bold',
    'heading-lg': 'text-heading-lg font-semibold',
    'heading-md': 'text-heading-md font-semibold',
    'heading-sm': 'text-heading-sm font-medium',
    'body-lg': 'text-body-lg font-regular',
    'body-md': 'text-body-md font-regular',
    'body-sm': 'text-body-sm font-regular',
    'footnote': 'text-footnote font-regular',
    'caption': 'text-caption font-medium',
  },

  colors: {
    primary: 'text-charcoal-500',
    secondary: 'text-charcoal-400',
    muted: 'text-charcoal-300',
    inverse: 'text-off-white-100',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
    sage: 'text-sage-500',
    coral: 'text-coral-500',
  },

  weights: {
    light: 'font-light',
    regular: 'font-regular',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  },

  alignments: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  },

  decorations: {
    none: 'no-underline',
    underline: 'underline decoration-2 underline-offset-2',
    'line-through': 'line-through',
  },

  transforms: {
    none: 'normal-case',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
  },

  truncate: 'truncate',
} as const;

// =============================================================================
// DEFAULT ELEMENTS FOR VARIANTS
// =============================================================================

const defaultElements: Record<NonNullable<TypographyProps['variant']>, TypographyElement> = {
  'display-lg': 'h1',
  'display-md': 'h2',
  'heading-lg': 'h3',
  'heading-md': 'h4',
  'heading-sm': 'h5',
  'body-lg': 'p',
  'body-md': 'p',
  'body-sm': 'p',
  'footnote': 'span',
  'caption': 'span',
} as const;

// =============================================================================
// TYPOGRAPHY COMPONENT
// =============================================================================

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body-md',
      as,
      color = 'primary',
      weight,
      align,
      decoration,
      transform,
      truncate = false,
      responsive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Determine the HTML element to render
    const Element = (as || defaultElements[variant]) as keyof JSX.IntrinsicElements;

    // Build typography classes
    const typographyClasses = cn(
      typographyVariants.base,
      typographyVariants.variants[variant],
      typographyVariants.colors[color],
      weight && typographyVariants.weights[weight],
      align && typographyVariants.alignments[align],
      decoration && typographyVariants.decorations[decoration],
      transform && typographyVariants.transforms[transform],
      truncate && typographyVariants.truncate,
      responsive && 'md:text-' + variant.replace(/^(.*)-(.*)$/, '$1-$2-desktop'),
      className
    );

    return (
      <Element
        ref={ref as any}
        className={typographyClasses}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Typography.displayName = 'Typography';

// =============================================================================
// SEMANTIC TYPOGRAPHY COMPONENTS
// =============================================================================

export const Heading = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ level = 1, ...props }, ref) => {
    const variantMap = {
      1: 'display-lg' as const,
      2: 'display-md' as const,
      3: 'heading-lg' as const,
      4: 'heading-md' as const,
      5: 'heading-sm' as const,
      6: 'heading-sm' as const,
    };

    const elementMap = {
      1: 'h1' as const,
      2: 'h2' as const,
      3: 'h3' as const,
      4: 'h4' as const,
      5: 'h5' as const,
      6: 'h6' as const,
    };

    return (
      <Typography
        ref={ref}
        variant={variantMap[level]}
        as={elementMap[level]}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export const Text = forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'> & { size?: 'sm' | 'md' | 'lg' }>(
  ({ size = 'md', as = 'p', ...props }, ref) => {
    const variantMap = {
      sm: 'body-sm' as const,
      md: 'body-md' as const,
      lg: 'body-lg' as const,
    };

    return (
      <Typography
        ref={ref}
        variant={variantMap[size]}
        as={as}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export const Caption = forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography
      ref={ref}
      variant="caption"
      as="span"
      color="muted"
      {...props}
    />
  )
);
Caption.displayName = 'Caption';

export const Footnote = forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography
      ref={ref}
      variant="footnote"
      as="span"
      color="secondary"
      {...props}
    />
  )
);
Footnote.displayName = 'Footnote';

// =============================================================================
// EXPORTS
// =============================================================================

export default Typography;
export type { TypographyProps };
