"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

interface TouchOptimizationOptions {
  enableTouchTargetSizing?: boolean;
  enableSwipeGestures?: boolean;
  enableVirtualKeyboardHandling?: boolean;
  enableHoverStateFallbacks?: boolean;
  enableDoubleTapPrevention?: boolean;
  minTouchTargetSize?: number;
  swipeThreshold?: number;
  tapDelay?: number;
}

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

interface TouchEvent {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe';
  element: HTMLElement;
  direction?: SwipeDirection['direction'];
  distance?: number;
  velocity?: number;
}

const defaultOptions: TouchOptimizationOptions = {
  enableTouchTargetSizing: true,
  enableSwipeGestures: true,
  enableVirtualKeyboardHandling: true,
  enableHoverStateFallbacks: true,
  enableDoubleTapPrevention: true,
  minTouchTargetSize: 44, // 44px minimum as per Apple/Google guidelines
  swipeThreshold: 50, // Minimum distance for swipe
  tapDelay: 300, // Delay for distinguishing single/double tap
};

export function useTouchOptimization(options: TouchOptimizationOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [lastTap, setLastTap] = useState<{ time: number; element: HTMLElement | null }>({ time: 0, element: null });

  const touchStartRef = useRef<{ x: number; y: number; time: number; element: HTMLElement | null }>({ x: 0, y: 0, time: 0, element: null });
  const touchMoveRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect touch device capability
  const detectTouchDevice = useCallback(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
    return hasTouch;
  }, []);

  // Handle virtual keyboard detection
  const handleVirtualKeyboard = useCallback(() => {
    if (!opts.enableVirtualKeyboardHandling || typeof window === 'undefined') return;

    const initialViewportHeight = window.innerHeight;
    let currentViewportHeight = window.innerHeight;

    const handleResize = () => {
      currentViewportHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentViewportHeight;

      // If viewport height decreased by more than 150px, assume keyboard is open
      const keyboardThreshold = 150;
      const isKeyboardOpen = heightDifference > keyboardThreshold;

      if (isKeyboardOpen !== keyboardOpen) {
        setKeyboardOpen(isKeyboardOpen);

        // Adjust body class for keyboard state
        if (isKeyboardOpen) {
          document.body.classList.add('keyboard-open');
          document.body.style.height = `${currentViewportHeight}px`;
        } else {
          document.body.classList.remove('keyboard-open');
          document.body.style.height = '';
        }

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('keyboardToggle', {
          detail: { isOpen: isKeyboardOpen, height: heightDifference }
        }));
      }
    };

    const handleVisualViewportChange = () => {
      if ('visualViewport' in window) {
        const visualViewport = window.visualViewport!;
        const heightDifference = window.innerHeight - visualViewport.height;
        const isKeyboardOpen = heightDifference > 150;

        setKeyboardOpen(isKeyboardOpen);

        if (isKeyboardOpen) {
          document.body.style.height = `${visualViewport.height}px`;
          document.body.classList.add('keyboard-open');
        } else {
          document.body.style.height = '';
          document.body.classList.remove('keyboard-open');
        }
      }
    };

    // Use Visual Viewport API if available (better for mobile)
    if ('visualViewport' in window) {
      window.visualViewport!.addEventListener('resize', handleVisualViewportChange);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if ('visualViewport' in window) {
        window.visualViewport!.removeEventListener('resize', handleVisualViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [opts.enableVirtualKeyboardHandling, keyboardOpen]);

  // Optimize touch target sizing
  const optimizeTouchTargets = useCallback(() => {
    if (!opts.enableTouchTargetSizing || !isTouchDevice) return;

    const selectors = [
      'button',
      'a',
      'input[type="button"]',
      'input[type="submit"]',
      'input[type="checkbox"]',
      'input[type="radio"]',
      '[role="button"]',
      '[tabindex]',
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const currentWidth = parseFloat(style.width);
        const currentHeight = parseFloat(style.height);

        if (currentWidth < opts.minTouchTargetSize! || currentHeight < opts.minTouchTargetSize!) {
          element.style.minWidth = `${opts.minTouchTargetSize}px`;
          element.style.minHeight = `${opts.minTouchTargetSize}px`;
          element.style.touchAction = 'manipulation'; // Prevent double-tap zoom
        }
      });
    });
  }, [opts.enableTouchTargetSizing, opts.minTouchTargetSize, isTouchDevice]);

  // Calculate swipe direction and distance
  const calculateSwipe = useCallback((startX: number, startY: number, endX: number, endY: number, timeElapsed: number): SwipeDirection => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / timeElapsed;

    if (distance < opts.swipeThreshold!) {
      return { direction: null, distance: 0, velocity: 0 };
    }

    let direction: SwipeDirection['direction'] = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return { direction, distance, velocity };
  }, [opts.swipeThreshold]);

  // Handle touch start
  const handleTouchStart = useCallback((e: globalThis.TouchEvent) => {
    if (!opts.enableSwipeGestures) return;

    const touch = e.touches[0];
    const target = e.target as HTMLElement;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      element: target,
    };

    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    // Start long press timer
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    longPressTimeoutRef.current = setTimeout(() => {
      // Dispatch long press event
      target.dispatchEvent(new CustomEvent('longpress', {
        detail: { originalEvent: e },
        bubbles: true,
      }));
    }, 500); // 500ms for long press
  }, [opts.enableSwipeGestures]);

  // Handle touch move
  const handleTouchMove = useCallback((e: globalThis.TouchEvent) => {
    if (!opts.enableSwipeGestures) return;

    const touch = e.touches[0];
    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    // Cancel long press if user moves too much
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    }
  }, [opts.enableSwipeGestures]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: globalThis.TouchEvent) => {
    if (!opts.enableSwipeGestures) return;

    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    const endTime = Date.now();
    const timeElapsed = endTime - touchStartRef.current.time;
    const target = touchStartRef.current.element;

    if (!target) return;

    // Calculate swipe
    const swipe = calculateSwipe(
      touchStartRef.current.x,
      touchStartRef.current.y,
      touchMoveRef.current.x,
      touchMoveRef.current.y,
      timeElapsed
    );

    // Handle swipe
    if (swipe.direction && swipe.distance >= opts.swipeThreshold!) {
      target.dispatchEvent(new CustomEvent('swipe', {
        detail: {
          direction: swipe.direction,
          distance: swipe.distance,
          velocity: swipe.velocity,
          originalEvent: e,
        },
        bubbles: true,
      }));
      return;
    }

    // Handle tap events
    if (timeElapsed < opts.tapDelay! && swipe.distance < 10) {
      const now = Date.now();

      // Check for double tap
      if (opts.enableDoubleTapPrevention &&
          now - lastTap.time < opts.tapDelay! &&
          lastTap.element === target) {

        // Double tap detected
        target.dispatchEvent(new CustomEvent('doubletap', {
          detail: { originalEvent: e },
          bubbles: true,
        }));

        setLastTap({ time: 0, element: null });

        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current);
          tapTimeoutRef.current = null;
        }
      } else {
        // Single tap (delayed to check for double tap)
        setLastTap({ time: now, element: target });

        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current);
        }

        tapTimeoutRef.current = setTimeout(() => {
          target.dispatchEvent(new CustomEvent('singletap', {
            detail: { originalEvent: e },
            bubbles: true,
          }));
        }, opts.tapDelay);
      }
    }
  }, [opts.enableSwipeGestures, opts.swipeThreshold, opts.tapDelay, opts.enableDoubleTapPrevention, lastTap, calculateSwipe]);

  // Handle hover state fallbacks for touch devices
  const handleHoverFallbacks = useCallback(() => {
    if (!opts.enableHoverStateFallbacks || !isTouchDevice) return;

    // Add touch-device class to body
    document.body.classList.add('touch-device');

    // Remove hover styles for touch devices
    const style = document.createElement('style');
    style.textContent = `
      @media (hover: none) {
        .hover\\:bg-gray-100:hover {
          background-color: inherit;
        }

        .hover\\:scale-105:hover {
          transform: none;
        }

        .hover\\:shadow-lg:hover {
          box-shadow: inherit;
        }

        /* Add touch-specific active states instead */
        .hover\\:bg-gray-100:active {
          background-color: #f3f4f6;
        }

        .hover\\:scale-105:active {
          transform: scale(1.02);
        }

        .hover\\:shadow-lg:active {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [opts.enableHoverStateFallbacks, isTouchDevice]);

  // Prevent accidental touches
  const preventAccidentalTouches = useCallback(() => {
    if (!isTouchDevice) return;

    // Add spacing between touch targets
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        button + button,
        a + button,
        button + a {
          margin-top: 8px;
        }

        .button-group button + button {
          margin-left: 8px;
          margin-top: 0;
        }

        /* Prevent accidental form submission */
        input[type="submit"],
        button[type="submit"] {
          margin-top: 16px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isTouchDevice]);

  // Focus management for touch inputs
  const manageTouchFocus = useCallback((element: HTMLElement) => {
    if (!isTouchDevice) return;

    // Scroll element into view when focused (for virtual keyboard)
    const handleFocus = () => {
      if (keyboardOpen) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }, 300); // Wait for keyboard animation
      }
    };

    element.addEventListener('focus', handleFocus);

    return () => {
      element.removeEventListener('focus', handleFocus);
    };
  }, [isTouchDevice, keyboardOpen]);

  // Initialize touch optimization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    detectTouchDevice();

    const cleanupKeyboard = handleVirtualKeyboard();
    const cleanupHover = handleHoverFallbacks();
    const cleanupSpacing = preventAccidentalTouches();

    // Set up touch event listeners
    if (opts.enableSwipeGestures) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Optimize touch targets after DOM is ready
    const optimizeTimeout = setTimeout(optimizeTouchTargets, 100);

    // Add global CSS for touch optimization
    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
      /* Improve touch scrolling */
      * {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }

      /* Prevent zoom on input focus (iOS) */
      input, textarea, select {
        font-size: 16px;
      }

      /* Improve tap response */
      button, a, [role="button"] {
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
      }

      /* Keyboard open state */
      body.keyboard-open {
        overflow: hidden;
      }

      body.keyboard-open .fixed-bottom {
        position: absolute;
      }

      /* Touch device specific styles */
      body.touch-device {
        cursor: default;
      }

      body.touch-device button:hover {
        cursor: default;
      }
    `;
    document.head.appendChild(globalStyle);

    return () => {
      clearTimeout(optimizeTimeout);

      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }

      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }

      if (opts.enableSwipeGestures) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }

      document.head.removeChild(globalStyle);

      cleanupKeyboard?.();
      cleanupHover?.();
      cleanupSpacing?.();
    };
  }, [
    detectTouchDevice,
    handleVirtualKeyboard,
    handleHoverFallbacks,
    preventAccidentalTouches,
    optimizeTouchTargets,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    opts.enableSwipeGestures,
  ]);

  return {
    isTouchDevice,
    keyboardOpen,
    manageTouchFocus,
    optimizeTouchTargets,
  };
}
