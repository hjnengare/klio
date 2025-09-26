/**
 * Theme utilities for dynamic theme color management
 * Following design system colors: off-white (#FDFCF7) for light, charcoal (#404040) for dark
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_COLORS = {
  light: {
    background: '#FDFCF7',  // off-white
    surface: '#FFFFFF',
    text: '#211e1d',        // charcoal for text
    accent: '#749176',      // sage
    secondary: '#FF7A5C',   // coral
  },
  dark: {
    background: '#404040',  // charcoal
    surface: '#4A4A4A',
    text: '#FDFCF7',       // off-white for text
    accent: '#749176',      // sage
    secondary: '#FF7A5C',   // coral
  },
} as const;

/**
 * Updates the theme-color meta tag dynamically
 * @param isDark - Whether dark mode is active
 */
export const updateThemeColor = (isDark: boolean): void => {
  if (typeof document === 'undefined') return;

  const themeColor = isDark ? THEME_COLORS.dark.background : THEME_COLORS.light.background;

  // Update existing theme-color meta tags
  const metaTags = document.querySelectorAll('meta[name="theme-color"]');
  metaTags.forEach((tag) => {
    const metaTag = tag as HTMLMetaElement;
    if (metaTag.media) {
      // Keep media-specific tags as they are for browser preference detection
      return;
    }
    metaTag.content = themeColor;
  });

  // Add a fallback theme-color meta tag if none exists
  if (metaTags.length === 0) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = themeColor;
    document.head.appendChild(meta);
  }

  // Update CSS custom properties for runtime theme switching
  document.documentElement.style.setProperty('--theme-bg', themeColor);
  document.documentElement.style.setProperty(
    '--theme-surface',
    isDark ? THEME_COLORS.dark.surface : THEME_COLORS.light.surface
  );
  document.documentElement.style.setProperty(
    '--theme-text',
    isDark ? THEME_COLORS.dark.text : THEME_COLORS.light.text
  );
};

/**
 * Detects the current system color scheme preference
 * @returns boolean indicating if dark mode is preferred
 */
export const getSystemPrefersDark = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Sets up a listener for system color scheme changes
 * @param callback - Function to call when system preference changes
 * @returns cleanup function
 */
export const onSystemThemeChange = (callback: (isDark: boolean) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mediaQuery.addEventListener('change', handler);

  return () => mediaQuery.removeEventListener('change', handler);
};

/**
 * Gets the effective theme mode based on user preference and system settings
 * @param userPreference - User's theme preference
 * @returns the effective theme mode
 */
export const getEffectiveTheme = (userPreference: ThemeMode): 'light' | 'dark' => {
  if (userPreference === 'system') {
    return getSystemPrefersDark() ? 'dark' : 'light';
  }
  return userPreference;
};

/**
 * Updates document class and theme color based on theme mode
 * @param mode - The theme mode to apply
 */
export const applyTheme = (mode: ThemeMode): void => {
  const effectiveTheme = getEffectiveTheme(mode);
  const isDark = effectiveTheme === 'dark';

  if (typeof document === 'undefined') return;

  // Update document class for Tailwind dark mode
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);

  // Update theme color
  updateThemeColor(isDark);
};

/**
 * Initializes theme on app load
 * @param initialMode - Initial theme mode preference
 */
export const initializeTheme = (initialMode: ThemeMode = 'system'): void => {
  applyTheme(initialMode);

  // Listen for system theme changes if using system preference
  if (initialMode === 'system') {
    onSystemThemeChange((isDark) => {
      updateThemeColor(isDark);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', !isDark);
      }
    });
  }
};

/**
 * Hook for React components to use theme utilities
 * Returns theme utilities and current state
 */
export const createThemeManager = () => {
  let currentMode: ThemeMode = 'system';
  let listeners: Array<(mode: ThemeMode) => void> = [];

  const setMode = (mode: ThemeMode) => {
    currentMode = mode;
    applyTheme(mode);
    listeners.forEach(listener => listener(mode));
  };

  const subscribe = (listener: (mode: ThemeMode) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const getMode = () => currentMode;
  const getEffectiveMode = () => getEffectiveTheme(currentMode);

  return {
    setMode,
    getMode,
    getEffectiveMode,
    subscribe,
    initialize: () => initializeTheme(currentMode),
  };
};