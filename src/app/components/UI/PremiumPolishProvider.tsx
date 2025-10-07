"use client";

import React from 'react';
import { PremiumPolishProvider as OpticalPolishProvider } from './OpticalAlignment';
import { VisualContinuityProvider } from './VisualContinuity';
import { usePremiumPolish } from '../../hooks/usePremiumPolish';

// Master premium polish configuration
interface PremiumPolishConfig {
  // Optical alignment
  enableOpticalCentering?: boolean;
  enableSpacingValidation?: boolean;
  enableBorderConsistency?: boolean;

  // Visual continuity
  enableSmoothScrolling?: boolean;
  enableCrossBrowserOptimization?: boolean;
  enableAnimationCoordination?: boolean;
  enableLayoutStability?: boolean;

  // Micro-interactions
  enableHapticFeedback?: boolean;
  enableRippleEffects?: boolean;
  enableElevationChanges?: boolean;

  // Development helpers
  showAlignmentGrid?: boolean;
  showPolishReport?: boolean;
  autoFix?: boolean;

  // Performance
  enablePerformanceMonitoring?: boolean;
  enableMemoryOptimization?: boolean;

  // Accessibility
  enableA11yEnhancements?: boolean;
  enableFocusManagement?: boolean;
}

const defaultConfig: PremiumPolishConfig = {
  // Optical alignment
  enableOpticalCentering: true,
  enableSpacingValidation: true,
  enableBorderConsistency: true,

  // Visual continuity
  enableSmoothScrolling: true,
  enableCrossBrowserOptimization: true,
  enableAnimationCoordination: true,
  enableLayoutStability: true,

  // Micro-interactions
  enableHapticFeedback: true,
  enableRippleEffects: true,
  enableElevationChanges: true,

  // Development helpers
  showAlignmentGrid: false,
  showPolishReport: process.env.NODE_ENV === 'development',
  autoFix: false,

  // Performance
  enablePerformanceMonitoring: true,
  enableMemoryOptimization: true,

  // Accessibility
  enableA11yEnhancements: true,
  enableFocusManagement: true,
};

// Premium polish context
const PremiumPolishContext = React.createContext<{
  config: PremiumPolishConfig;
  polishScore: number;
  updateConfig: (updates: Partial<PremiumPolishConfig>) => void;
}>({
  config: defaultConfig,
  polishScore: 100,
  updateConfig: () => {},
});

export const usePremiumPolishContext = () => {
  const context = React.useContext(PremiumPolishContext);
  if (!context) {
    throw new Error('usePremiumPolishContext must be used within PremiumPolishProvider');
  }
  return context;
};

// Main premium polish provider
interface PremiumPolishProviderProps {
  children: React.ReactNode;
  config?: Partial<PremiumPolishConfig>;
}

export const PremiumPolishProvider: React.FC<PremiumPolishProviderProps> = ({
  children,
  config: userConfig = {},
}) => {
  const [config, setConfig] = React.useState<PremiumPolishConfig>({
    ...defaultConfig,
    ...userConfig,
  });

  const { polishReport } = usePremiumPolish({
    enableOpticalCentering: config.enableOpticalCentering,
    enableSpacingValidation: config.enableSpacingValidation,
    enableBorderConsistency: config.enableBorderConsistency,
    autoFix: config.autoFix,
  });

  const updateConfig = React.useCallback((updates: Partial<PremiumPolishConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const contextValue = React.useMemo(() => ({
    config,
    polishScore: polishReport.score,
    updateConfig,
  }), [config, polishReport.score, updateConfig]);

  let wrappedChildren = (
    <PremiumPolishContext.Provider value={contextValue}>
      {children}
    </PremiumPolishContext.Provider>
  );

  // Apply visual continuity wrapper
  wrappedChildren = (
    <VisualContinuityProvider
      enableSmoothScrolling={config.enableSmoothScrolling}
      enableCrossBrowserOptimization={config.enableCrossBrowserOptimization}
      enableAnimationCoordination={config.enableAnimationCoordination}
      enableLayoutStability={config.enableLayoutStability}
    >
      {wrappedChildren}
    </VisualContinuityProvider>
  );

  // Apply optical polish wrapper
  wrappedChildren = (
    <OpticalPolishProvider
      showAlignmentGrid={config.showAlignmentGrid}
      autoFix={config.autoFix}
      enableAllFeatures={true}
    >
      {wrappedChildren}
    </OpticalPolishProvider>
  );

  return (
    <>
      {wrappedChildren}

      {/* Global premium styles */}
      <style jsx global>{`
        /* Premium typography system */
        :root {
          /* Spacing tokens */
          --space-xs: 4px;
          --space-sm: 8px;
          --space-md: 16px;
          --space-lg: 24px;
          --space-xl: 32px;
          --space-2xl: 48px;
          --space-3xl: 64px;
          --space-4xl: 96px;

          /* Border radius tokens */
          --radius-sm: 4px;
          --radius-md: 8px;
          --radius-lg: 12px;
          --radius-xl: 16px;
          --radius-2xl: 24px;
          --radius-full: 9999px;

          /* Elevation tokens */
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

          /* Animation tokens */
          --duration-fast: 150ms;
          --duration-normal: 300ms;
          --duration-slow: 500ms;
          --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
          --ease-in: cubic-bezier(0.4, 0.0, 1, 1);
          --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);

          /* Typography tokens */
          --font-size-xs: 0.75rem;
          --font-size-sm: 0.875rem;
          --font-size-md: 1rem;
          --font-size-lg: 1.125rem;
          --font-size-xl: 1.25rem;
          --font-size-2xl: 1.5rem;
          --font-size-3xl: 1.875rem;
          --font-size-4xl: 2.25rem;

          --line-height-tight: 1.25;
          --line-height-normal: 1.5;
          --line-height-relaxed: 1.75;

          /* Color tokens */
          --color-primary-50: #eff6ff;
          --color-primary-100: #dbeafe;
          --color-primary-500: #3b82f6;
          --color-primary-600: #2563eb;
          --color-primary-700: #1d4ed8;

          --color-gray-50: #f9fafb;
          --color-gray-100: #f3f4f6;
          --color-gray-200: #e5e7eb;
          --color-gray-300: #d1d5db;
          --color-gray-400: #9ca3af;
          --color-gray-500: #6b7280;
          --color-gray-600: #4b5563;
          --color-gray-700: #374151;
          --color-gray-800: #1f2937;
          --color-gray-900: #111827;
        }

        /* Premium reset */
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          line-height: var(--line-height-normal);
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        body {
          background-color: var(--color-gray-50);
          color: var(--color-gray-900);
          font-feature-settings: 'kern' 1;
        }

        /* Premium focus management */
        :focus {
          outline: 2px solid var(--color-primary-500);
          outline-offset: 2px;
          border-radius: var(--radius-sm);
        }

        :focus:not(:focus-visible) {
          outline: none;
        }

        /* Premium button styles */
        button, [role="button"] {
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        button:disabled, [role="button"][aria-disabled="true"] {
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Premium form elements */
        input, textarea, select {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          border-radius: var(--radius-md);
          transition: all var(--duration-normal) var(--ease-out);
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--color-primary-500);
          box-shadow: 0 0 0 2px var(--color-primary-500), 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        /* Premium images */
        img {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-md);
        }

        /* Premium scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--color-gray-100);
          border-radius: var(--radius-full);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--color-gray-300);
          border-radius: var(--radius-full);
          transition: background-color var(--duration-normal) var(--ease-out);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-gray-400);
        }

        /* Premium selection */
        ::selection {
          background-color: var(--color-primary-100);
          color: var(--color-primary-900);
        }

        /* Premium animations */
        @keyframes premium-fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes premium-scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes premium-slide-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Premium utility classes */
        .premium-fade-in {
          animation: premium-fade-in var(--duration-normal) var(--ease-out);
        }

        .premium-scale-in {
          animation: premium-scale-in var(--duration-normal) var(--ease-out);
        }

        .premium-slide-up {
          animation: premium-slide-up var(--duration-normal) var(--ease-out);
        }

        .premium-elevation-sm {
          box-shadow: var(--shadow-sm);
        }

        .premium-elevation-md {
          box-shadow: var(--shadow-md);
        }

        .premium-elevation-lg {
          box-shadow: var(--shadow-lg);
        }

        .premium-elevation-xl {
          box-shadow: var(--shadow-xl);
        }

        .premium-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .premium-gradient {
          background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
        }

        /* Premium responsive design */
        @media (max-width: 640px) {
          :root {
            --space-xs: 2px;
            --space-sm: 4px;
            --space-md: 8px;
            --space-lg: 16px;
            --space-xl: 24px;
            --space-2xl: 32px;
            --space-3xl: 48px;
            --space-4xl: 64px;
          }
        }

        /* Premium print styles */
        @media print {
          *, *::before, *::after {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          a, a:visited {
            text-decoration: underline;
          }

          abbr[title]::after {
            content: " (" attr(title) ")";
          }

          img {
            page-break-inside: avoid;
          }

          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
          }

          p, h1, h2, h3, h4, h5, h6 {
            orphans: 3;
            widows: 3;
          }
        }

        /* Premium reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Premium high contrast */
        @media (prefers-contrast: high) {
          :root {
            --color-gray-50: #ffffff;
            --color-gray-100: #f0f0f0;
            --color-gray-200: #e0e0e0;
            --color-gray-300: #c0c0c0;
            --color-gray-400: #808080;
            --color-gray-500: #606060;
            --color-gray-600: #404040;
            --color-gray-700: #202020;
            --color-gray-800: #101010;
            --color-gray-900: #000000;
          }

          button, input, select, textarea {
            border: 2px solid var(--color-gray-900) !important;
          }
        }
      `}</style>

      {/* Performance monitoring */}
      {config.enablePerformanceMonitoring && process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor />
      )}

      {/* Polish report panel */}
      {config.showPolishReport && process.env.NODE_ENV === 'development' && (
        <PolishReportPanel />
      )}
    </>
  );
};

// Performance monitoring component
const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState<{
    fps: number;
    memoryUsage: number;
    loadTime: number;
  }>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
  });

  React.useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Measure memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      setMetrics(prev => ({ ...prev, memoryUsage }));
    }

    // Measure load time
    const loadTime = Math.round(performance.now());
    setMetrics(prev => ({ ...prev, loadTime }));
  }, []);

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-80 text-white text-xs p-2 rounded font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Load: {metrics.loadTime}ms</div>
    </div>
  );
};

// Polish report panel
const PolishReportPanel: React.FC = () => {
  const { polishScore, config, updateConfig } = usePremiumPolishContext();

  return (
    <div className="fixed bottom-4 left-4 bg-white   border border-gray-300 rounded-lg p-4 shadow-lg text-sm z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Premium Polish</h3>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          polishScore >= 90 ? 'bg-green-100 text-green-800' :
          polishScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {polishScore}/100
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.enableOpticalCentering}
            onChange={(e) => updateConfig({ enableOpticalCentering: e.target.checked })}
            className="mr-2"
          />
          Optical Centering
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.enableSpacingValidation}
            onChange={(e) => updateConfig({ enableSpacingValidation: e.target.checked })}
            className="mr-2"
          />
          Spacing Validation
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.showAlignmentGrid}
            onChange={(e) => updateConfig({ showAlignmentGrid: e.target.checked })}
            className="mr-2"
          />
          Alignment Grid
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.autoFix}
            onChange={(e) => updateConfig({ autoFix: e.target.checked })}
            className="mr-2"
          />
          Auto-fix Issues
        </label>
      </div>
    </div>
  );
};

export default PremiumPolishProvider;