"use client";

import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

export function useScrollReveal({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  className = 'scroll-reveal'
}: ScrollRevealOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if screen is medium or larger (768px+)
    const isLargeScreen = () => window.innerWidth >= 768;

    if (!isLargeScreen()) {
      // On small screens, immediately show content without animation
      element.classList.add('reveal');
      return;
    }

    // Add the initial class only on larger screens
    element.classList.add(className);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('reveal');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, className]);

  return elementRef;
}

export function useScrollRevealMultiple({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  staggerDelay = 100
}: ScrollRevealOptions & { staggerDelay?: number } = {}) {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-scroll-reveal]');

    // Check if screen is medium or larger (768px+)
    const isLargeScreen = () => window.innerWidth >= 768;

    if (!isLargeScreen()) {
      // On small screens, immediately show all content without animation
      elements.forEach((element) => {
        element.classList.add('reveal');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('reveal');
            }, index * staggerDelay);

            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('reveal');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, staggerDelay]);
}

// Legacy export for backward compatibility
export default useScrollReveal;