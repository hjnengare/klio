/**
 * BLABBR DESIGN SYSTEM - DESIGN TOKENS
 *
 * Single source of truth for all design values
 * Following design system requirements from CLAUDE.md
 */

// =============================================================================
// COLOR SYSTEM
// =============================================================================

export const colors = {
  // Primary brand colors
  primary: {
    sage: {
      50: 'hsl(148, 20%, 95%)',   // Very light sage for backgrounds
      100: 'hsl(148, 20%, 88%)',  // Light sage for hover states
      200: 'hsl(148, 20%, 75%)',  // Medium light sage
      300: 'hsl(148, 20%, 60%)',  // Medium sage
      400: 'hsl(148, 20%, 45%)',  // Default sage
      500: 'hsl(148, 20%, 38%)',  // Main sage (brand primary)
      600: 'hsl(148, 20%, 30%)',  // Dark sage for hover
      700: 'hsl(148, 20%, 22%)',  // Darker sage
      800: 'hsl(148, 20%, 15%)',  // Very dark sage
      900: 'hsl(148, 20%, 8%)',   // Deepest sage
      DEFAULT: 'hsl(148, 20%, 38%)', // Main brand color
    },
    coral: {
      50: 'hsl(16, 100%, 95%)',   // Very light coral for backgrounds
      100: 'hsl(16, 100%, 88%)',  // Light coral for hover states
      200: 'hsl(16, 100%, 80%)',  // Medium light coral
      300: 'hsl(16, 100%, 72%)',  // Medium coral
      400: 'hsl(16, 100%, 66%)',  // Default coral
      500: 'hsl(16, 100%, 60%)',  // Main coral (brand secondary)
      600: 'hsl(16, 90%, 54%)',   // Dark coral for hover
      700: 'hsl(16, 80%, 48%)',   // Darker coral
      800: 'hsl(16, 70%, 42%)',   // Very dark coral
      900: 'hsl(16, 60%, 36%)',   // Deepest coral
      DEFAULT: 'hsl(16, 100%, 66%)', // Secondary brand color
    }
  },

  // Neutral colors
  neutral: {
    charcoal: {
      50: 'hsl(0, 0%, 95%)',      // Very light charcoal
      100: 'hsl(0, 0%, 88%)',     // Light charcoal
      200: 'hsl(0, 0%, 75%)',     // Medium light charcoal
      300: 'hsl(0, 0%, 60%)',     // Medium charcoal
      400: 'hsl(0, 0%, 45%)',     // Default charcoal
      500: 'hsl(0, 0%, 25%)',     // Main charcoal (text)
      600: 'hsl(0, 0%, 20%)',     // Dark charcoal
      700: 'hsl(0, 0%, 15%)',     // Darker charcoal
      800: 'hsl(0, 0%, 10%)',     // Very dark charcoal
      900: 'hsl(0, 0%, 5%)',      // Deepest charcoal
      DEFAULT: 'hsl(0, 0%, 25%)', // Main text color
    },
    'off-white': {
      50: 'hsl(0, 0%, 100%)',     // Pure white
      100: '#f2e3da',             // Main off-white (background) - #f2e3da
      200: 'hsl(25, 25%, 92%)',   // Slightly darker off-white
      300: 'hsl(25, 25%, 88%)',   // Medium off-white
      400: 'hsl(25, 25%, 84%)',   // Darker off-white
      500: 'hsl(25, 25%, 80%)',   // Medium gray
      DEFAULT: '#f2e3da',         // Main background color - #f2e3da
    }
  },

  // Semantic colors
  semantic: {
    success: {
      50: 'hsl(142, 76%, 95%)',
      100: 'hsl(142, 76%, 88%)',
      500: 'hsl(142, 76%, 36%)',
      600: 'hsl(142, 76%, 30%)',
      DEFAULT: 'hsl(142, 76%, 36%)',
    },
    warning: {
      50: 'hsl(38, 92%, 95%)',
      100: 'hsl(38, 92%, 88%)',
      500: 'hsl(38, 92%, 50%)',
      600: 'hsl(38, 92%, 44%)',
      DEFAULT: 'hsl(38, 92%, 50%)',
    },
    error: {
      50: 'hsl(0, 86%, 95%)',
      100: 'hsl(0, 86%, 88%)',
      500: 'hsl(0, 86%, 59%)',
      600: 'hsl(0, 86%, 53%)',
      DEFAULT: 'hsl(0, 86%, 59%)',
    },
    info: {
      50: 'hsl(198, 93%, 95%)',
      100: 'hsl(198, 93%, 88%)',
      500: 'hsl(198, 93%, 60%)',
      600: 'hsl(198, 93%, 54%)',
      DEFAULT: 'hsl(198, 93%, 60%)',
    }
  },

  // Overlay colors
  overlay: {
    light: 'hsla(0, 0%, 100%, 0.9)',
    medium: 'hsla(0, 0%, 100%, 0.7)',
    dark: 'hsla(0, 0%, 0%, 0.6)',
    backdrop: 'hsla(0, 0%, 0%, 0.8)',
  }
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

export const typography = {
  // Font families
  fontFamily: {
    primary: ['sf', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
  },

  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Mobile-first typography scale (as specified in requirements)
  fontSize: {
    // Display sizes
    'display-lg': ['2.125rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 34px - H1 mobile
    'display-md': ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }], // 28px - H2 mobile

    // Heading sizes
    'heading-lg': ['1.375rem', { lineHeight: '1.25', letterSpacing: '0' }],      // 22px - H3 mobile
    'heading-md': ['1.25rem', { lineHeight: '1.3', letterSpacing: '0' }],        // 20px - H4 mobile
    'heading-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0' }],       // 18px - H5 mobile

    // Body sizes
    'body-lg': ['1.0625rem', { lineHeight: '1.6', letterSpacing: '0' }],         // 17px - Body mobile
    'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],              // 16px - Regular body
    'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],    // 14px - Small text

    // Utility sizes
    'footnote': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],   // 13px - Footnote
    'caption': ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.01em' }],     // 12px - Caption

    // Desktop overrides (larger screens)
    'display-lg-desktop': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],   // 48px
    'display-md-desktop': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 40px
    'heading-lg-desktop': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 30px
    'heading-md-desktop': ['1.5rem', { lineHeight: '1.25', letterSpacing: '0' }],       // 24px
  },

  // Line heights
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.6',
    loose: '1.8',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.005em',
    wider: '0.01em',
  }
} as const;

// =============================================================================
// SPACING SYSTEM
// =============================================================================

export const spacing = {
  // Base 4px grid system
  0: '0px',
  0.5: '2px',
  1: '4px',      // 0.25rem - Micro spacing
  2: '8px',      // 0.5rem  - Tight spacing
  3: '12px',     // 0.75rem - Small spacing
  4: '16px',     // 1rem    - Base spacing
  5: '20px',     // 1.25rem - Medium spacing
  6: '24px',     // 1.5rem  - Large spacing
  7: '28px',     // 1.75rem - Extra spacing
  8: '32px',     // 2rem    - Section spacing
  9: '36px',     // 2.25rem - Component spacing
  10: '40px',    // 2.5rem  - Large sections
  12: '48px',    // 3rem    - Hero spacing
  16: '64px',    // 4rem    - Major sections
  20: '80px',    // 5rem    - Page sections
  24: '96px',    // 6rem    - Large sections
  32: '128px',   // 8rem    - Massive spacing

  // Semantic spacing
  container: {
    mobile: '16px',      // Mobile container padding
    tablet: '24px',      // Tablet container padding
    desktop: '32px',     // Desktop container padding
    wide: '40px',        // Wide screen padding
  },

  component: {
    'card-padding': '24px',          // Standard card padding
    'button-padding-x': '24px',      // Button horizontal padding
    'button-padding-y': '12px',      // Button vertical padding
    'input-padding-x': '16px',       // Input horizontal padding
    'input-padding-y': '12px',       // Input vertical padding
  },

  section: {
    mobile: '40px',        // Mobile section spacing
    desktop: '80px',       // Desktop section spacing
  }
} as const;

// =============================================================================
// BORDER RADIUS SYSTEM
// =============================================================================

export const borderRadius = {
  none: '0px',
  xs: '2px',        // Tight radius for small elements
  sm: '4px',        // Small radius for inputs, chips
  md: '6px',        // Medium radius for cards, buttons
  lg: '8px',        // Large radius for modals, panels
  xl: '12px',       // Extra large radius
  '2xl': '16px',    // Default rounded-2xl for main elements
  '3xl': '24px',    // Large rounded elements
  full: '9999px',   // Fully rounded (pills, avatars)

  // Semantic radius
  button: '6px',    // Standard button radius
  card: '6px',      // Standard card radius
  input: '4px',     // Standard input radius
  modal: '8px',     // Standard modal radius
} as const;

// =============================================================================
// SHADOW SYSTEM
// =============================================================================

export const boxShadow = {
  // Subtle shadows
  xs: '0 1px 2px hsla(0, 0%, 0%, 0.05)',
  sm: '0 1px 3px hsla(0, 0%, 0%, 0.1), 0 1px 2px hsla(0, 0%, 0%, 0.06)',
  md: '0 4px 6px hsla(0, 0%, 0%, 0.07), 0 2px 4px hsla(0, 0%, 0%, 0.06)',
  lg: '0 10px 15px hsla(0, 0%, 0%, 0.1), 0 4px 6px hsla(0, 0%, 0%, 0.05)',
  xl: '0 20px 25px hsla(0, 0%, 0%, 0.1), 0 10px 10px hsla(0, 0%, 0%, 0.04)',

  // Branded shadows (using design system colors)
  'sage-sm': '0 4px 10px hsla(148, 20%, 38%, 0.15)',
  'sage-md': '0 8px 16px hsla(148, 20%, 38%, 0.2)',
  'coral-sm': '0 4px 10px hsla(16, 100%, 66%, 0.15)',
  'coral-md': '0 8px 16px hsla(16, 100%, 66%, 0.2)',

  // Interactive shadows
  'hover-subtle': '0 8px 25px hsla(148, 20%, 38%, 0.15)',
  'hover-strong': '0 16px 40px hsla(148, 20%, 38%, 0.25)',

  // Special shadows
  inner: 'inset 0 2px 4px hsla(0, 0%, 0%, 0.06)',
  none: '0 0 0 0 transparent',
} as const;

// =============================================================================
// TRANSITION SYSTEM
// =============================================================================

export const transitions = {
  // Duration
  duration: {
    fastest: '100ms',
    fast: '150ms',
    normal: '200ms',  // Default for most interactions
    slow: '300ms',
    slower: '500ms',
  },

  // Easing functions
  ease: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Premium easing (from current system)
    'premium-in': 'cubic-bezier(0.51, 0.03, 0.64, 0.28)',
    'premium-out': 'cubic-bezier(0.33, 0.85, 0.4, 0.96)',
  },

  // Common transition presets
  preset: {
    'fade': 'opacity 200ms cubic-bezier(0, 0, 0.2, 1)',
    'scale': 'transform 200ms cubic-bezier(0, 0, 0.2, 1)',
    'slide': 'transform 300ms cubic-bezier(0.33, 0.85, 0.4, 0.96)',
    'colors': 'color 150ms cubic-bezier(0, 0, 0.2, 1), background-color 150ms cubic-bezier(0, 0, 0.2, 1), border-color 150ms cubic-bezier(0, 0, 0.2, 1)',
  }
} as const;

// =============================================================================
// BREAKPOINTS SYSTEM
// =============================================================================

export const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet portrait
  lg: '1024px',   // Tablet landscape / Small desktop
  xl: '1280px',   // Desktop
  '2xl': '1536px' // Large desktop
} as const;

// =============================================================================
// Z-INDEX SYSTEM
// =============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  raised: 10,
  dropdown: 1000,
  sticky: 1020,
  overlay: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
  max: 2147483647,
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const components = {
  button: {
    height: {
      sm: '36px',
      md: '44px',  // Minimum touch target
      lg: '52px',
    },
    padding: {
      sm: { x: '12px', y: '6px' },
      md: { x: '24px', y: '12px' },
      lg: { x: '32px', y: '16px' },
    }
  },

  input: {
    height: {
      sm: '36px',
      md: '44px',  // Minimum touch target
      lg: '52px',
    },
    padding: {
      sm: { x: '12px', y: '8px' },
      md: { x: '16px', y: '12px' },
      lg: { x: '20px', y: '16px' },
    }
  },

  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',
    }
  }
} as const;

// =============================================================================
// MOTION SYSTEM
// =============================================================================

export const motion = {
  // Respect user preferences
  respectMotionPreference: true,

  // Animation durations (aligned with transition system)
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },

  // Spring configurations
  spring: {
    gentle: { type: 'spring', stiffness: 120, damping: 20 },
    bouncy: { type: 'spring', stiffness: 300, damping: 30 },
    wobbly: { type: 'spring', stiffness: 180, damping: 12 },
  }
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorTokens = typeof colors;
export type TypographyTokens = typeof typography;
export type SpacingTokens = typeof spacing;
export type BorderRadiusTokens = typeof borderRadius;
export type ShadowTokens = typeof boxShadow;
export type TransitionTokens = typeof transitions;
export type BreakpointTokens = typeof breakpoints;
export type ZIndexTokens = typeof zIndex;
export type ComponentTokens = typeof components;
export type MotionTokens = typeof motion;