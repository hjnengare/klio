/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // KLIO Design System Colors - Primary Brand Colors
        sage: {
          50: 'hsl(148, 20%, 95%)',
          100: 'hsl(148, 20%, 88%)',
          200: 'hsl(148, 20%, 75%)',
          300: 'hsl(148, 20%, 60%)',
          400: 'hsl(148, 20%, 45%)',
          500: 'hsl(148, 20%, 38%)', // Main sage
          600: 'hsl(148, 20%, 30%)',
          700: 'hsl(148, 20%, 22%)',
          800: 'hsl(148, 20%, 15%)',
          900: 'hsl(148, 20%, 8%)',
        },
        coral: {
          50: 'hsl(16, 100%, 95%)',
          100: 'hsl(16, 100%, 88%)',
          200: 'hsl(16, 100%, 80%)',
          300: 'hsl(16, 100%, 72%)',
          400: 'hsl(16, 100%, 66%)',
          500: 'hsl(16, 100%, 60%)', // Main coral
          600: 'hsl(16, 90%, 54%)',
          700: 'hsl(16, 80%, 48%)',
          800: 'hsl(16, 70%, 42%)',
          900: 'hsl(16, 60%, 36%)',
        },
        charcoal: {
          50: 'hsl(0, 0%, 95%)',
          100: 'hsl(0, 0%, 88%)',
          200: 'hsl(0, 0%, 75%)',
          300: 'hsl(0, 0%, 60%)',
          400: 'hsl(0, 0%, 45%)',
          500: 'hsl(0, 0%, 25%)', // Main charcoal
          600: 'hsl(0, 0%, 20%)',
          700: 'hsl(0, 0%, 15%)',
          800: 'hsl(0, 0%, 10%)',
          900: 'hsl(0, 0%, 5%)',
        },
        'off-white': {
          50: 'hsl(0, 0%, 100%)',
          100: '#f2e3da', // Main off-white
          200: 'hsl(25, 25%, 92%)',
          300: 'hsl(25, 25%, 88%)',
          400: 'hsl(25, 25%, 84%)',
          500: 'hsl(25, 25%, 80%)',
        },
        
        // Semantic colors
        success: {
          50: 'hsl(142, 76%, 95%)',
          100: 'hsl(142, 76%, 88%)',
          500: 'hsl(142, 76%, 36%)',
          600: 'hsl(142, 76%, 30%)',
        },
        error: {
          50: 'hsl(0, 86%, 95%)',
          100: 'hsl(0, 86%, 88%)',
          500: 'hsl(0, 86%, 59%)',
          600: 'hsl(0, 86%, 53%)',
        },
        warning: {
          50: 'hsl(38, 92%, 95%)',
          100: 'hsl(38, 92%, 88%)',
          500: 'hsl(38, 92%, 50%)',
          600: 'hsl(38, 92%, 44%)',
        },
        info: {
          50: 'hsl(198, 93%, 95%)',
          100: 'hsl(198, 93%, 88%)',
          500: 'hsl(198, 93%, 60%)',
          600: 'hsl(198, 93%, 54%)',
        },

        // Instagram blue for verified badge
        'blue-500': '#3b82f6',

        // Legacy colors (for compatibility during migration)
        'hoockers-green': '#749176',
        'hoockers-green-20': 'rgba(116, 145, 118, 0.2)',
        'pale-spring-bud': 'hsl(60, 68%, 85%)',
        'spanish-gray': 'hsl(0, 0%, 61%)',
        'light-gray': 'hsl(0, 0%, 80%)',
        'cultured-1': 'hsl(0, 0%, 97%)',
        'cultured-2': 'hsl(60, 6%, 93%)',
        'gray-web': 'hsl(0, 0%, 49%)',
        'white-30': 'hsl(0, 0%, 100%, 0.3)',
        'black-70': 'hsla(0, 0%, 0%, 0.7)',
        'black-50': 'hsla(0, 0%, 0%, 0.5)',
        'black-15': 'hsla(0, 0%, 0%, 0.15)',
        'black-10': 'hsla(0, 0%, 0%, 0.1)',
        'black-5': 'hsla(0, 0%, 0%, 0.05)',
        black: 'hsl(0, 0%, 0%)',
        white: 'hsl(0, 0%, 100%)',
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      fontSize: {
        // Legacy numbered scale (for gradual migration)
        1: '4.8rem',
        2: '4rem',
        3: '3.4rem',
        4: '2.4rem',
        5: '2rem',
        6: '1.8rem',
        7: '1.5rem',
        8: '1.4rem',
        9: '1.3rem',

        // Mobile-first responsive typography scale
        // [fontSize, { lineHeight, letterSpacing }]
        xs: ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.01em' }],   // 10px
        sm: ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.005em' }],  // 12px
        base: ['0.875rem', { lineHeight: '1.6' }],                          // 14px
        lg: ['1rem', { lineHeight: '1.55' }],                               // 16px
        xl: ['1.125rem', { lineHeight: '1.45' }],                           // 18px
        '2xl': ['1.25rem', { lineHeight: '1.35' }],                         // 20px
        '3xl': ['1.5rem', { lineHeight: '1.25' }],                          // 24px
        '4xl': ['1.875rem', { lineHeight: '1.2' }],                         // 30px
        '5xl': ['2.25rem', { lineHeight: '1.1' }],                          // 36px
        '6xl': ['3rem', { lineHeight: '1.05' }],                            // 48px
        '7xl': ['3.75rem', { lineHeight: '1' }],                            // 60px
      },
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
      },
      spacing: {
        section: '35px',
      },
      boxShadow: {
        1: '0 8px 16px hsla(0, 0%, 0%, 0.15)',
        2: '0 4px 10px hsla(0, 0%, 0%, 0.05)',
      },
      borderRadius: {
        3: '3px',
        6: '6px',
      },
      transitionTimingFunction: {
        'cubic-in': 'cubic-bezier(0.51, 0.03, 0.64, 0.28)',
        'cubic-out': 'cubic-bezier(0.33, 0.85, 0.4, 0.96)',
      },
      transitionDuration: {
        1: '250ms',
        2: '500ms',
      },
      backgroundImage: {
        gradient: 'linear-gradient(to right, transparent 50%, hsla(0, 0%, 100%, 0.3) 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      // Safe area utilities for iOS/Android device compatibility
      padding: {
        safe: 'max(1rem, env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
}