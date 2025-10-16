"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';

// Premium image component with fallbacks and optimization
interface PremiumImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  placeholder?: 'blur' | 'skeleton' | 'color';
  placeholderColor?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: boolean;
  onLoadingComplete?: () => void;
  onError?: () => void;
}

export const PremiumImage: React.FC<PremiumImageProps> = ({
  src,
  alt,
  fallbackSrc,
  placeholder = 'blur',
  placeholderColor = '#f3f4f6',
  aspectRatio,
  objectFit = 'cover',
  priority = false,
  onLoadingComplete,
  onError,
  className = '',
  ...props
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    setImageState('loaded');
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setImageState('error');
      onError?.();
    }
  }, [fallbackSrc, currentSrc, onError]);

  useEffect(() => {
    if (imgRef.current && priority) {
      // Preload high-priority images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, priority]);

  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio || undefined,
    backgroundColor: placeholderColor,
  };

  const imageStyle: React.CSSProperties = {
    objectFit,
    transition: 'opacity 300ms ease-in-out',
    opacity: imageState === 'loaded' ? 1 : 0,
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* Placeholder */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder === 'blur' && (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          {placeholder === 'skeleton' && (
            <div className="w-full h-full">
              <div className="animate-pulse bg-gray-300 h-full w-full rounded"></div>
            </div>
          )}
          {placeholder === 'color' && (
            <div className="w-full h-full" style={{ backgroundColor: placeholderColor }} />
          )}
        </div>
      )}

      {/* Error state */}
      {imageState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full"
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

// Animation coordinator for seamless transitions
interface AnimationCoordinatorProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export const AnimationCoordinator: React.FC<AnimationCoordinatorProps> = ({
  children,
  disabled = false,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const coordinatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      // Disable all animations within this coordinator
      if (coordinatorRef.current) {
        coordinatorRef.current.style.setProperty('--animation-duration', '0ms');
        coordinatorRef.current.style.setProperty('--transition-duration', '0ms');
      }
    } else {
      if (coordinatorRef.current) {
        coordinatorRef.current.style.removeProperty('--animation-duration');
        coordinatorRef.current.style.removeProperty('--transition-duration');
      }
    }
  }, [disabled, prefersReducedMotion]);

  return (
    <div ref={coordinatorRef} className="animation-coordinator">
      {children}
      <style jsx>{`
        .animation-coordinator * {
          animation-duration: var(--animation-duration, inherit);
          transition-duration: var(--transition-duration, inherit);
        }
      `}</style>
    </div>
  );
};

// Cross-browser consistent rendering
interface CrossBrowserWrapperProps {
  children: React.ReactNode;
  enableFontSmoothing?: boolean;
  enableSubpixelAntialiasing?: boolean;
  enableHardwareAcceleration?: boolean;
}

export const CrossBrowserWrapper: React.FC<CrossBrowserWrapperProps> = ({
  children,
  enableFontSmoothing = true,
  enableSubpixelAntialiasing = true,
  enableHardwareAcceleration = true,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const element = wrapperRef.current;

      // Font rendering optimization
      if (enableFontSmoothing) {
        element.style.setProperty('-webkit-font-smoothing', 'antialiased');
        element.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
      }

      if (enableSubpixelAntialiasing) {
        element.style.setProperty('text-rendering', 'optimizeLegibility');
      }

      // Hardware acceleration for smooth animations
      if (enableHardwareAcceleration) {
        element.style.setProperty('transform', 'translateZ(0)');
        element.style.setProperty('will-change', 'transform');
      }

      // Cross-browser box-sizing
      element.style.setProperty('box-sizing', 'border-box');
    }
  }, [enableFontSmoothing, enableSubpixelAntialiasing, enableHardwareAcceleration]);

  return (
    <div ref={wrapperRef} className="cross-browser-wrapper">
      {children}
      <style jsx global>{`
        .cross-browser-wrapper *,
        .cross-browser-wrapper *::before,
        .cross-browser-wrapper *::after {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

// Smooth page transitions
interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down';
  duration?: number;
  isActive?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = 'fade',
  duration = 300,
  isActive = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  const getTransitionClasses = () => {
    const baseClasses = `transition-all ease-out`;
    const durationClass = `duration-${duration}`;

    switch (direction) {
      case 'fade':
        return `${baseClasses} ${durationClass} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      case 'slide-left':
        return `${baseClasses} ${durationClass} ${isVisible ? 'transform translate-x-0' : 'transform translate-x-full'}`;
      case 'slide-right':
        return `${baseClasses} ${durationClass} ${isVisible ? 'transform translate-x-0' : 'transform -translate-x-full'}`;
      case 'slide-up':
        return `${baseClasses} ${durationClass} ${isVisible ? 'transform translate-y-0' : 'transform translate-y-full'}`;
      case 'slide-down':
        return `${baseClasses} ${durationClass} ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}`;
      default:
        return `${baseClasses} ${durationClass}`;
    }
  };

  return (
    <div ref={transitionRef} className={getTransitionClasses()}>
      {children}
    </div>
  );
};

// Premium scroll behavior
interface SmoothScrollProps {
  children: React.ReactNode;
  behavior?: 'smooth' | 'instant' | 'auto';
  threshold?: number;
  rootMargin?: string;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  behavior = 'smooth',
  threshold = 0.1,
  rootMargin = '0px',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    // Set scroll behavior
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = behavior;
    }
  }, [behavior]);

  return (
    <div ref={scrollRef} className="smooth-scroll-container">
      {children}
      <style jsx>{`
        .smooth-scroll-container {
          scroll-behavior: ${behavior};
        }
      `}</style>
    </div>
  );
};

// Layout stability component
interface LayoutStabilityProps {
  children: React.ReactNode;
  reserveSpace?: boolean;
  minHeight?: string;
  aspectRatio?: string;
}

export const LayoutStability: React.FC<LayoutStabilityProps> = ({
  children,
  reserveSpace = true,
  minHeight,
  aspectRatio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (reserveSpace && containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [reserveSpace]);

  const containerStyle: React.CSSProperties = {
    minHeight: minHeight || (reserveSpace && contentHeight > 0 ? `${contentHeight}px` : undefined),
    aspectRatio: aspectRatio || undefined,
  };

  return (
    <div ref={containerRef} style={containerStyle} className="layout-stability-container">
      {children}
    </div>
  );
};

// Premium branded elements
interface BrandedElementProps {
  children: React.ReactNode;
  brand?: 'primary' | 'secondary' | 'accent';
  element?: 'card' | 'section' | 'header' | 'footer';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandedElement: React.FC<BrandedElementProps> = ({
  children,
  brand = 'primary',
  element = 'section',
  elevation = 'none',
}) => {
  const brandClasses = {
    primary: 'border-sage-200 bg-gradient-to-br from-sage-50 to-sage-100',
    secondary: 'border-charcoal-200 bg-gradient-to-br from-charcoal-50 to-charcoal-100',
    accent: 'border-coral-200 bg-gradient-to-br from-coral-50 to-coral-100',
  };

  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const elementClasses = {
    card: 'rounded-lg border p-6',
    section: 'py-12',
    header: 'py-6 border-b',
    footer: 'py-6 border-t',
  };

  return (
    <div className={`
      branded-element
      ${brandClasses[brand]}
      ${elevationClasses[elevation]}
      ${elementClasses[element]}
    `}>
      {children}
    </div>
  );
};

// Master visual continuity provider
interface VisualContinuityProviderProps {
  children: React.ReactNode;
  enableSmoothScrolling?: boolean;
  enableCrossBrowserOptimization?: boolean;
  enableAnimationCoordination?: boolean;
  enableLayoutStability?: boolean;
}

export const VisualContinuityProvider: React.FC<VisualContinuityProviderProps> = ({
  children,
  enableSmoothScrolling = true,
  enableCrossBrowserOptimization = true,
  enableAnimationCoordination = true,
  enableLayoutStability = true,
}) => {
  let wrappedChildren = <>{children}</>;

  if (enableLayoutStability) {
    wrappedChildren = (
      <LayoutStability>
        {wrappedChildren}
      </LayoutStability>
    );
  }

  if (enableAnimationCoordination) {
    wrappedChildren = (
      <AnimationCoordinator>
        {wrappedChildren}
      </AnimationCoordinator>
    );
  }

  if (enableCrossBrowserOptimization) {
    wrappedChildren = (
      <CrossBrowserWrapper>
        {wrappedChildren}
      </CrossBrowserWrapper>
    );
  }

  if (enableSmoothScrolling) {
    wrappedChildren = (
      <SmoothScroll>
        {wrappedChildren}
      </SmoothScroll>
    );
  }

  return (
    <>
      {wrappedChildren}
      <style jsx global>{`
        /* Global visual continuity styles */
        html {
          scroll-behavior: smooth;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* Prevent layout shifts */
        img, video, iframe {
          max-width: 100%;
          height: auto;
        }

        /* Consistent focus states */
        :focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Premium animation easing */
        .premium-ease {
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Smooth transforms */
        .smooth-transform {
          transform: translateZ(0);
          will-change: transform;
        }

        /* Consistent borders */
        .premium-border {
          border-color: rgba(0, 0, 0, 0.12);
        }

        .premium-border-hover:hover {
          border-color: rgba(0, 0, 0, 0.24);
        }
      `}</style>
    </>
  );
};