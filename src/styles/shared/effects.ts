// Visual effects - shadows, borders, gradients
export const effects = {
  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    'lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    premium: '0 10px 30px rgba(0,0,0,0.06), 0 22px 70px rgba(0,0,0,0.10)',
    premiumHover: '0 12px 36px rgba(0,0,0,0.08), 0 30px 90px rgba(0,0,0,0.14)',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    'lg': '2rem',   // 32px
    'lg': '3rem',   // 48px
    full: '9999px',
  },

  // Gradients
  gradients: {
    sage: 'linear-gradient(135deg, #7D9B76 0%, #6B8A64 100%)',
    coral: 'linear-gradient(135deg, #FF6B6B 0%, #E85555 100%)',
    premium: 'linear-gradient(135deg, #7D9B76 0%, #6B8A64 100%)',
    glass: 'linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(255,255,255,0.60))',
    accent: 'radial-gradient(500px 280px at 10% 0%, rgba(232,215,146,0.12), transparent 65%), radial-gradient(450px 240px at 90% 0%, rgba(209,173,219,0.10), transparent 65%)',
  },

  // Backdrop blur
  blur: {
    none: 'none',
    sm: 'blur(4px)',
    base: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
  },
} as const;

// Common effect classes
export const effectClasses = {
  // Cards
  card: 'rounded-lg border border-black/5 shadow-md',
  cardPremium: 'rounded-lg border border-white/30 backdrop-blur-xl shadow-premium hover:shadow-premiumHover',
  cardGlass: 'rounded-lg border border-black/5 backdrop-blur-xl bg-off-white/90',

  // Buttons
  buttonShadow: 'shadow-md hover:shadow-lg transition-shadow',
  buttonPremium: 'shadow-[0_10px_40px_rgba(125,155,118,0.25)] hover:shadow-[0_20px_60px_rgba(125,155,118,0.35)]',

  // Inputs
  inputFocus: 'focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage',
  inputError: 'focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-red-300',

  // Borders
  border: 'border border-light-gray/50',
  borderTop: 'border-t border-light-gray/30',
  borderBottom: 'border-b border-light-gray/30',
} as const;
