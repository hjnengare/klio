"use client";

import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

export function useScrollReveal({
  className = 'scroll-reveal'
}: ScrollRevealOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.classList.remove(className);
    element.classList.add('reveal');
  }, [className]);

  return elementRef;
}

export function useScrollRevealMultiple(): void {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-scroll-reveal]');
    elements.forEach((element) => {
      element.classList.add('reveal');
    });
  }, []);
}

// Legacy export for backward compatibility
export default useScrollReveal;
