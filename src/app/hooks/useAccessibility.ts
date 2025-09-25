"use client";

import { useEffect, useRef, useCallback } from 'react';

interface AccessibilityOptions {
  enableKeyboardNavigation?: boolean;
  enableFocusManagement?: boolean;
  enableScreenReaderSupport?: boolean;
  enableColorContrastValidation?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  announceStateChanges?: boolean;
}

interface FocusableElement extends HTMLElement {
  focus(): void;
  blur(): void;
}

const defaultOptions: AccessibilityOptions = {
  enableKeyboardNavigation: true,
  enableFocusManagement: true,
  enableScreenReaderSupport: true,
  enableColorContrastValidation: true,
  trapFocus: false,
  restoreFocus: true,
  announceStateChanges: true,
};

export function useAccessibility(options: AccessibilityOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  // Get all focusable elements
  const getFocusableElements = useCallback((container: HTMLElement = document.body): FocusableElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'audio[controls]',
      'video[controls]',
      'details summary',
    ].join(',');

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as FocusableElement[];

    return elements.filter(element => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        !element.hasAttribute('aria-hidden') &&
        element.tabIndex !== -1
      );
    });
  }, []);

  // Keyboard navigation handler
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!opts.enableKeyboardNavigation) return;

    const { key, target, shiftKey, ctrlKey, metaKey, altKey } = event;
    const activeElement = target as HTMLElement;

    switch (key) {
      case 'Escape':
        // Close modals, dropdowns, etc.
        const closeButton = document.querySelector('[data-close]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
          event.preventDefault();
        }
        break;

      case 'Tab':
        if (opts.trapFocus && containerRef.current) {
          const focusableElements = getFocusableElements(containerRef.current);
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (shiftKey && activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          } else if (!shiftKey && activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
        break;

      case 'Enter':
      case ' ':
        // Handle button-like elements
        if (activeElement.getAttribute('role') === 'button' && !activeElement.matches('button, input[type="submit"], input[type="button"]')) {
          activeElement.click();
          event.preventDefault();
        }
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        // Handle list navigation
        if (activeElement.getAttribute('role') === 'listbox' || activeElement.closest('[role="listbox"]')) {
          event.preventDefault();
          const isDown = key === 'ArrowDown';
          const listItems = Array.from(activeElement.closest('[role="listbox"]')?.querySelectorAll('[role="option"]') || []) as HTMLElement[];
          const currentIndex = listItems.indexOf(activeElement);

          if (currentIndex !== -1) {
            const nextIndex = isDown ?
              (currentIndex + 1) % listItems.length :
              (currentIndex - 1 + listItems.length) % listItems.length;
            listItems[nextIndex]?.focus();
          }
        }
        break;

      case 'Home':
      case 'End':
        // Navigate to first/last focusable element
        if (ctrlKey || metaKey) {
          event.preventDefault();
          const focusableElements = getFocusableElements();
          if (focusableElements.length > 0) {
            const targetElement = key === 'Home' ? focusableElements[0] : focusableElements[focusableElements.length - 1];
            targetElement.focus();
          }
        }
        break;
    }
  }, [opts.enableKeyboardNavigation, opts.trapFocus, getFocusableElements]);

  // Focus management
  const manageFocus = useCallback((element: HTMLElement | null) => {
    if (!opts.enableFocusManagement) return;

    if (element) {
      // Store previous focus for restoration
      if (opts.restoreFocus && document.activeElement instanceof HTMLElement) {
        previousFocusRef.current = document.activeElement;
      }

      // Focus the element
      element.focus();

      // Scroll into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [opts.enableFocusManagement, opts.restoreFocus]);

  // Restore focus to previously focused element
  const restoreFocus = useCallback(() => {
    if (opts.restoreFocus && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [opts.restoreFocus]);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!opts.enableScreenReaderSupport || !opts.announceStateChanges) return;

    if (!announcementRef.current) {
      // Create announcement area if it doesn't exist
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(announcer);
      announcementRef.current = announcer;
    }

    // Clear previous message and add new one
    announcementRef.current.textContent = '';
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, 100);

    // Clear message after 10 seconds
    setTimeout(() => {
      if (announcementRef.current && announcementRef.current.textContent === message) {
        announcementRef.current.textContent = '';
      }
    }, 10000);
  }, [opts.enableScreenReaderSupport, opts.announceStateChanges]);

  // Color contrast validation
  const validateColorContrast = useCallback((element: HTMLElement): boolean => {
    if (!opts.enableColorContrastValidation) return true;

    try {
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      const color = style.color;
      const fontSize = parseFloat(style.fontSize);

      // Basic contrast checking (simplified)
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        return true; // Skip transparent backgrounds
      }

      // This is a simplified check - in production, use a proper contrast calculation library
      const bgLuminance = getLuminance(backgroundColor);
      const textLuminance = getLuminance(color);
      const contrast = (Math.max(bgLuminance, textLuminance) + 0.05) / (Math.min(bgLuminance, textLuminance) + 0.05);

      // WCAG AA standards: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && style.fontWeight === 'bold');
      const requiredContrast = isLargeText ? 3 : 4.5;

      return contrast >= requiredContrast;
    } catch (error) {
      console.warn('Color contrast validation failed:', error);
      return true;
    }
  }, [opts.enableColorContrastValidation]);

  // Simplified luminance calculation
  const getLuminance = (color: string): number => {
    // This is a very simplified version - use a proper color library in production
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0.5;

    const [r, g, b] = rgb.map(c => {
      const normalized = parseInt(c) / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Skip link functionality
  const createSkipLink = useCallback((targetId: string, text: string = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 4px;
      font-size: 14px;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    return skipLink;
  }, []);

  // ARIA helpers
  const updateAriaLabel = useCallback((element: HTMLElement, label: string) => {
    element.setAttribute('aria-label', label);
  }, []);

  const updateAriaDescription = useCallback((element: HTMLElement, description: string) => {
    element.setAttribute('aria-describedby', description);
  }, []);

  const setAriaExpanded = useCallback((element: HTMLElement, expanded: boolean) => {
    element.setAttribute('aria-expanded', expanded.toString());
  }, []);

  const setAriaSelected = useCallback((element: HTMLElement, selected: boolean) => {
    element.setAttribute('aria-selected', selected.toString());
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.addEventListener('keydown', handleKeyboardNavigation);

    // Add skip link if main content exists
    const mainContent = document.getElementById('main') || document.querySelector('main');
    if (mainContent && !document.querySelector('.skip-link')) {
      const skipLink = createSkipLink('main');
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [handleKeyboardNavigation, createSkipLink]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    manageFocus,
    restoreFocus,
    announce,
    validateColorContrast,
    getFocusableElements,
    updateAriaLabel,
    updateAriaDescription,
    setAriaExpanded,
    setAriaSelected,
    createSkipLink,
  };
}