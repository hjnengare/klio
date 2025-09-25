"use client";

import React, { useEffect, useState, useRef } from 'react';

// Progressive Enhancement Wrapper
interface ProgressiveEnhancementProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  enableJavaScript?: boolean;
  testFeature?: () => boolean;
}

export const ProgressiveEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  children,
  fallback,
  enableJavaScript = true,
  testFeature,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (!enableJavaScript) {
      setIsSupported(false);
      return;
    }

    if (testFeature) {
      setIsSupported(testFeature());
    } else {
      setIsSupported(true);
    }
  }, [enableJavaScript, testFeature]);

  if (!isClient) {
    // Server-side render fallback
    return <>{fallback}</>;
  }

  return isSupported ? <>{children}</> : <>{fallback}</>;
};

// No-JavaScript Fallback
export const NoJSFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <noscript>
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            margin: '20px',
            textAlign: 'center',
            color: '#856404',
          }}
        >
          <h2>JavaScript Required</h2>
          <p>
            This application requires JavaScript to function properly. Please enable JavaScript in your browser settings and refresh the page.
          </p>
          <details style={{ marginTop: '16px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              How to enable JavaScript
            </summary>
            <div style={{ marginTop: '12px', fontSize: '14px' }}>
              <h4>Chrome:</h4>
              <ol>
                <li>Click the three dots menu → Settings</li>
                <li>Advanced → Privacy and security → Site settings</li>
                <li>JavaScript → Allow (recommended)</li>
              </ol>

              <h4>Firefox:</h4>
              <ol>
                <li>Type "about:config" in address bar</li>
                <li>Search for "javascript.enabled"</li>
                <li>Set to true</li>
              </ol>

              <h4>Safari:</h4>
              <ol>
                <li>Safari menu → Preferences</li>
                <li>Security tab</li>
                <li>Check "Enable JavaScript"</li>
              </ol>
            </div>
          </details>
        </div>
      </noscript>
      {children}
    </>
  );
};

// Extreme Font Size Support
interface ExtremeFontSizeWrapperProps {
  children: React.ReactNode;
  maxScale?: number;
  minScale?: number;
}

export const ExtremeFontSizeWrapper: React.FC<ExtremeFontSizeWrapperProps> = ({
  children,
  maxScale = 3,
  minScale = 0.5,
}) => {
  const [fontScale, setFontScale] = useState(1);
  const [isExtreme, setIsExtreme] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detectFontSize = () => {
      if (!containerRef.current) return;

      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: absolute;
        visibility: hidden;
        font-size: 16px;
        width: auto;
        height: auto;
      `;
      testElement.textContent = 'Test';
      document.body.appendChild(testElement);

      const baseFontSize = testElement.offsetHeight;
      document.body.removeChild(testElement);

      const currentFontSize = parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
      );

      const scale = currentFontSize / 16; // 16px is standard
      setFontScale(scale);

      const extreme = scale > maxScale || scale < minScale;
      setIsExtreme(extreme);

      if (extreme) {
        console.warn(`Extreme font size detected: ${Math.round(scale * 100)}%`);

        // Apply emergency scaling
        if (containerRef.current) {
          containerRef.current.style.transform = `scale(${1 / Math.max(scale / maxScale, 1)})`;
          containerRef.current.style.transformOrigin = 'top left';
        }
      }
    };

    detectFontSize();

    // Listen for font size changes
    const mediaQuery = window.matchMedia('(min-resolution: 0.001dpcm)');
    mediaQuery.addListener(detectFontSize);

    return () => {
      mediaQuery.removeListener(detectFontSize);
    };
  }, [maxScale, minScale]);

  return (
    <div ref={containerRef} className={`font-scale-wrapper ${isExtreme ? 'extreme-font' : ''}`}>
      {isExtreme && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1e3a8a',
            color: 'white',
            padding: '12px',
            textAlign: 'center',
            zIndex: 10000,
            fontSize: '14px',
          }}
        >
          ⚠️ Extreme font size detected ({Math.round(fontScale * 100)}%). Layout may be adjusted for readability.
          <button
            onClick={() => {
              document.documentElement.style.fontSize = '16px';
              window.location.reload();
            }}
            style={{
              marginLeft: '12px',
              padding: '4px 8px',
              backgroundColor: 'white',
              color: '#1e3a8a',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            Reset Font Size
          </button>
        </div>
      )}

      <style jsx>{`
        .extreme-font {
          /* Emergency responsive adjustments */
          max-width: 100vw;
          overflow-x: auto;
        }

        .extreme-font * {
          /* Prevent text from becoming unreadable */
          max-width: 100%;
          word-wrap: break-word;
          hyphens: auto;
        }

        .extreme-font button,
        .extreme-font input,
        .extreme-font select {
          /* Ensure interactive elements remain usable */
          min-height: 44px;
          min-width: 44px;
        }

        .extreme-font img {
          /* Prevent images from breaking layout */
          max-width: 100%;
          height: auto;
        }
      `}</style>

      {children}
    </div>
  );
};

// Extreme Zoom Support
export const ExtremeZoomWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isExtremeZoom, setIsExtremeZoom] = useState(false);

  useEffect(() => {
    const detectZoom = () => {
      const zoom = window.devicePixelRatio || 1;
      const browserZoom = window.outerWidth / window.innerWidth;
      const totalZoom = zoom * browserZoom;

      setZoomLevel(totalZoom);
      setIsExtremeZoom(totalZoom > 3 || totalZoom < 0.5);

      if (totalZoom > 3) {
        // Extreme zoom in - simplify layout
        document.body.classList.add('extreme-zoom-in');
        document.body.classList.remove('extreme-zoom-out');
      } else if (totalZoom < 0.5) {
        // Extreme zoom out - compact layout
        document.body.classList.add('extreme-zoom-out');
        document.body.classList.remove('extreme-zoom-in');
      } else {
        document.body.classList.remove('extreme-zoom-in', 'extreme-zoom-out');
      }
    };

    detectZoom();
    window.addEventListener('resize', detectZoom);

    return () => {
      window.removeEventListener('resize', detectZoom);
      document.body.classList.remove('extreme-zoom-in', 'extreme-zoom-out');
    };
  }, []);

  return (
    <>
      {isExtremeZoom && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#374151',
            color: 'white',
            padding: '8px',
            textAlign: 'center',
            zIndex: 9999,
            fontSize: '12px',
          }}
        >
          {zoomLevel > 3 ? '🔍 High zoom detected - simplified layout' : '🔍 Low zoom detected - compact layout'}
        </div>
      )}

      <style jsx global>{`
        /* Extreme zoom in styles */
        .extreme-zoom-in {
          font-size: 18px !important;
          line-height: 1.6 !important;
        }

        .extreme-zoom-in * {
          margin: 8px 0 !important;
          padding: 8px !important;
        }

        .extreme-zoom-in .container {
          max-width: 100% !important;
          padding: 16px !important;
        }

        .extreme-zoom-in .grid {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }

        .extreme-zoom-in .flex {
          flex-direction: column !important;
          gap: 8px !important;
        }

        /* Extreme zoom out styles */
        .extreme-zoom-out {
          font-size: 12px !important;
          line-height: 1.3 !important;
        }

        .extreme-zoom-out * {
          margin: 2px 0 !important;
          padding: 4px !important;
        }

        .extreme-zoom-out .container {
          max-width: 1400px !important;
        }

        .extreme-zoom-out button {
          min-height: 24px !important;
          padding: 2px 8px !important;
        }
      `}</style>

      {children}
    </>
  );
};

// Image Block Fallback
export const ImageBlockFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imagesBlocked, setImagesBlocked] = useState(false);

  useEffect(() => {
    // Test if images are being blocked
    const testImage = new Image();
    testImage.onload = () => setImagesBlocked(false);
    testImage.onerror = () => setImagesBlocked(true);
    testImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    // Fallback after timeout
    const timeout = setTimeout(() => setImagesBlocked(true), 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {imagesBlocked && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '8px',
            textAlign: 'center',
            zIndex: 9998,
            fontSize: '14px',
          }}
        >
          📷 Images appear to be blocked. Some content may not display correctly.
        </div>
      )}

      <style jsx global>{`
        /* Fallback styles when images are blocked */
        img {
          background: linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
                      linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
                      linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }

        img::after {
          content: "🖼️ Image not loaded";
          display: block;
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>

      {children}
    </>
  );
};

// Animation Disable Fallback
export const AnimationDisableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [motionReduced, setMotionReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMotionReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <>
      {motionReduced && (
        <style jsx global>{`
          /* Completely disable all animations and transitions */
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }

          /* Remove motion-based effects */
          .animate-spin,
          .animate-pulse,
          .animate-bounce {
            animation: none !important;
          }

          /* Static alternatives for animated elements */
          .loading-spinner {
            border: 2px solid #e5e7eb;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            /* Remove animation, keep visual indicator */
          }

          .loading-dots::after {
            content: "...";
            /* Static dots instead of animated */
          }
        `}</style>
      )}
      {children}
    </>
  );
};

// Master Nuclear Fallback Wrapper
interface NuclearFallbackProps {
  children: React.ReactNode;
  enableAll?: boolean;
  enableJavaScriptFallback?: boolean;
  enableFontSizeFallback?: boolean;
  enableZoomFallback?: boolean;
  enableImageFallback?: boolean;
  enableAnimationFallback?: boolean;
}

export const NuclearFallback: React.FC<NuclearFallbackProps> = ({
  children,
  enableAll = true,
  enableJavaScriptFallback = true,
  enableFontSizeFallback = true,
  enableZoomFallback = true,
  enableImageFallback = true,
  enableAnimationFallback = true,
}) => {
  let wrappedChildren = <>{children}</>;

  if (enableAll || enableAnimationFallback) {
    wrappedChildren = (
      <AnimationDisableWrapper>
        {wrappedChildren}
      </AnimationDisableWrapper>
    );
  }

  if (enableAll || enableImageFallback) {
    wrappedChildren = (
      <ImageBlockFallback>
        {wrappedChildren}
      </ImageBlockFallback>
    );
  }

  if (enableAll || enableZoomFallback) {
    wrappedChildren = (
      <ExtremeZoomWrapper>
        {wrappedChildren}
      </ExtremeZoomWrapper>
    );
  }

  if (enableAll || enableFontSizeFallback) {
    wrappedChildren = (
      <ExtremeFontSizeWrapper>
        {wrappedChildren}
      </ExtremeFontSizeWrapper>
    );
  }

  if (enableAll || enableJavaScriptFallback) {
    wrappedChildren = (
      <NoJSFallback>
        {wrappedChildren}
      </NoJSFallback>
    );
  }

  return (
    <>
      {wrappedChildren}

      {/* Global emergency styles */}
      <style jsx global>{`
        /* Emergency reset styles */
        .emergency-mode * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          max-width: 100%;
          word-wrap: break-word;
        }

        .emergency-mode {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #000;
          background: #fff;
        }

        /* High contrast fallback */
        @media (prefers-contrast: high) {
          * {
            border-color: #000 !important;
            color: #000 !important;
            background-color: #fff !important;
          }

          button, input, select, textarea {
            border: 2px solid #000 !important;
          }
        }

        /* Print-friendly fallback */
        @media print {
          * {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};