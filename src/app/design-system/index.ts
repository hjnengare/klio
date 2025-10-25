/**
 * BLABBR DESIGN SYSTEM
 *
 * Main export file for the design system
 * Single source of truth for all components, tokens, and utilities
 */

// =============================================================================
// DESIGN TOKENS
// =============================================================================

export * from './tokens';

// =============================================================================
// UTILITIES
// =============================================================================

export { cn, clsx, twMerge, default as cnDefault } from './utils/cn';
export type { VariantProps } from './utils/cn';

// =============================================================================
// COMPONENTS
// =============================================================================

// Core Components
export { default as Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { default as Input } from './components/Input';
export type { InputProps } from './components/Input';

export { default as Card } from './components/Card';
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/Card';
export type { CardProps } from './components/Card';

export { default as Typography } from './components/Typography';
export {
  Heading,
  Text,
  Caption,
  Footnote,
} from './components/Typography';
export type { TypographyProps } from './components/Typography';

export { default as Toast } from './components/Toast';
export { ToastContainer } from './components/Toast';
export type { ToastProps, ToastContainerProps } from './components/Toast';

// =============================================================================
// DESIGN SYSTEM VERSION
// =============================================================================

export const VERSION = '1.0.0';

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

export const theme = {
  name: 'Blabbr Design System',
  version: VERSION,
  tokens: {
    colors: 'Design system colors with semantic naming',
    typography: 'Mobile-first typography scale',
    spacing: '4px base grid system',
    shadows: 'Subtle elevation system',
    borderRadius: 'Consistent corner radius',
    transitions: 'Premium easing curves',
  },
  components: [
    'Button',
    'Input',
    'Card',
    'Typography',
    // Add more as they're created
  ],
} as const;
