"use client";

import { useEffect, useCallback, useRef } from 'react';

export function useAddressBarHide() {
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const setViewportHeight = useCallback(() => {
    // Set CSS custom property for dynamic viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Set additional viewport variables for better mobile support
    document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--window-width', `${window.innerWidth}px`);
  }, []);

  const detectMobile = useCallback(() => {
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(userAgent) && !/Windows Phone/.test(userAgent);
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    return { isIOS, isAndroid, isMobile, isStandalone };
  }, []);

  const forceAddressBarHide = useCallback(() => {
    const { isMobile, isIOS, isAndroid, isStandalone } = detectMobile();

    if (!isMobile || isStandalone) return;

    // More aggressive address bar hiding
    if (isIOS) {
      // iOS Safari - Multiple techniques for better reliability
      const currentScroll = window.scrollY;

      // Technique 1: Micro scroll to trigger UI hiding
      if (currentScroll === 0) {
        window.scrollTo(0, 1);
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
          setViewportHeight();
        });
      } else {
        // Technique 2: Scroll manipulation during scroll
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (currentScroll < maxScroll - 5) {
          window.scrollTo(0, currentScroll + 1);
          requestAnimationFrame(() => {
            window.scrollTo(0, currentScroll);
            setViewportHeight();
          });
        }
      }

      // Technique 3: Force fullscreen mode
      const body = document.body;
      if (body) {
        body.style.height = '100vh';
        body.style.height = '-webkit-fill-available';
        requestAnimationFrame(() => {
          setViewportHeight();
        });
      }
    } else if (isAndroid) {
      // Android Chrome - Enhanced viewport manipulation
      const metaViewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement;
      if (metaViewport) {
        const currentContent = metaViewport.content;
        // Force minimal-ui mode
        metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover, minimal-ui';

        // Trigger repaint
        document.body.style.transform = 'translateZ(0)';
        requestAnimationFrame(() => {
          document.body.style.transform = '';
          setViewportHeight();

          // Restore original viewport after UI change
          setTimeout(() => {
            metaViewport.content = currentContent;
          }, 500);
        });
      }

      // Additional Android technique: Fullscreen API if available
      if (document.documentElement.requestFullscreen) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          try {
            document.documentElement.requestFullscreen?.();
          } catch (e) {
            // Fallback to viewport manipulation
            setViewportHeight();
          }
        }, 100);
      }
    }
  }, [detectMobile, setViewportHeight]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { isIOS, isAndroid, isMobile, isStandalone } = detectMobile();

    if (!isMobile || isStandalone) return;

    // Set initial viewport height
    setViewportHeight();

    const hideAddressBar = () => {
      const currentScrollY = window.scrollY;

      if (!isMobile || isStandalone) {
        tickingRef.current = false;
        return;
      }

      // Enhanced address bar hiding logic
      const scrollDelta = Math.abs(currentScrollY - lastScrollYRef.current);
      const isScrollingDown = currentScrollY > lastScrollYRef.current;

      if (isIOS) {
        // More aggressive iOS Safari handling
        if (isScrollingDown && currentScrollY > 30) {
          forceAddressBarHide();
        } else if (currentScrollY <= 10) {
          // Force hide when near top
          forceAddressBarHide();
        }

        // Continuous viewport height updates for iOS
        if (scrollDelta > 5) {
          setViewportHeight();
        }
      } else if (isAndroid) {
        // Enhanced Android Chrome behavior
        if (isScrollingDown && currentScrollY > 50 && scrollDelta > 10) {
          forceAddressBarHide();
        } else if (currentScrollY <= 5) {
          // Initial load address bar hide
          forceAddressBarHide();
        }

        // Update viewport on significant scroll changes
        if (scrollDelta > 15) {
          setViewportHeight();
        }
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    };

    const requestTick = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(hideAddressBar);
        tickingRef.current = true;
      }
    };

    const handleScroll = () => {
      clearTimeout(scrollTimeoutRef.current);
      requestTick();

      // Update viewport height on scroll end for better accuracy
      scrollTimeoutRef.current = setTimeout(() => {
        setViewportHeight();
      }, 100);
    };

    const handleResize = () => {
      setViewportHeight();

      // Enhanced address bar hiding on orientation change
      if (isMobile && !isStandalone) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          forceAddressBarHide();
        }, 200);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isMobile && !isStandalone) {
        // Aggressively recalculate viewport and hide address bar when app becomes visible
        setTimeout(() => {
          setViewportHeight();
          forceAddressBarHide();
        }, 50);
      }
    };

    const handleFocus = () => {
      if (isMobile && !isStandalone) {
        // Hide address bar when window gains focus
        setTimeout(() => {
          forceAddressBarHide();
        }, 100);
      }
    };

    const handleTouchStart = () => {
      if (isMobile && !isStandalone) {
        // Immediate viewport update on touch
        setViewportHeight();
      }
    };

    const handleTouchEnd = () => {
      if (isMobile && !isStandalone) {
        // Delayed viewport update after touch
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          setViewportHeight();
          if (window.scrollY <= 10) {
            forceAddressBarHide();
          }
        }, 50);
      }
    };

    // Enhanced initial address bar hiding
    const initialHide = () => {
      if (isMobile && !isStandalone) {
        setViewportHeight();

        // Multiple attempts for better reliability
        forceAddressBarHide();

        setTimeout(() => {
          forceAddressBarHide();
        }, 100);

        setTimeout(() => {
          forceAddressBarHide();
        }, 500);
      }
    };

    // Immediate initial hiding
    initialHide();

    // Delay additional hiding attempts to ensure proper loading
    const initTimer = setTimeout(initialHide, 100);
    const secondInitTimer = setTimeout(initialHide, 300);

    // Enhanced event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus, { passive: true });

    // Enhanced mobile-specific handling
    if (isMobile && !isStandalone) {
      // Touch events for better address bar hiding
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });

      // iOS specific events
      if (isIOS) {
        // Pagehide/pageshow events for better iOS handling
        window.addEventListener('pagehide', setViewportHeight, { passive: true });
        window.addEventListener('pageshow', () => {
          setTimeout(() => {
            setViewportHeight();
            forceAddressBarHide();
          }, 50);
        }, { passive: true });

        // Enhanced iOS touch handling
        window.addEventListener('touchmove', () => {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = setTimeout(setViewportHeight, 50);
        }, { passive: true });
      }

      // Android specific events
      if (isAndroid) {
        // Handle Android keyboard events
        window.addEventListener('keyboardDidShow', setViewportHeight, { passive: true } as any);
        window.addEventListener('keyboardDidHide', () => {
          setTimeout(() => {
            setViewportHeight();
            forceAddressBarHide();
          }, 100);
        }, { passive: true } as any);
      }

      // PWA installation events
      window.addEventListener('beforeinstallprompt', () => {
        setTimeout(initialHide, 100);
      }, { passive: true } as any);

      // Screen orientation change for better mobile experience
      if (screen?.orientation) {
        screen.orientation.addEventListener('change', () => {
          setTimeout(() => {
            setViewportHeight();
            forceAddressBarHide();
          }, 300);
        });
      }
    }

    return () => {
      clearTimeout(initTimer);
      clearTimeout(secondInitTimer);
      clearTimeout(scrollTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);

      if (isMobile && !isStandalone) {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);

        if (isIOS) {
          window.removeEventListener('pagehide', setViewportHeight);
          window.removeEventListener('pageshow', setViewportHeight);
          window.removeEventListener('touchmove', setViewportHeight);
        }

        if (screen?.orientation) {
          screen.orientation.removeEventListener('change', setViewportHeight);
        }
      }
    };
  }, [detectMobile, setViewportHeight, forceAddressBarHide]);
}