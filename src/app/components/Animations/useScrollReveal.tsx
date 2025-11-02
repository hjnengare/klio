"use client";

import { useEffect, RefObject } from "react";

/**
 * useScrollReveal Hook - Add scroll-triggered reveal animations using pure CSS
 *
 * Usage:
 * 1. Add the className to your element: "scroll-reveal", "scroll-reveal-left", "scroll-reveal-right", or "scroll-reveal-scale"
 * 2. Call this hook in your component
 *
 * Example:
 * ```tsx
 * import { useRef } from "react";
 * import useScrollReveal from "./useScrollReveal";
 *
 * function MyComponent() {
 *   useScrollReveal(); // Activates all scroll-reveal elements on the page
 *
 *   return (
 *     <div className="scroll-reveal">
 *       This will fade in from bottom when scrolled into view
 *     </div>
 *   );
 * }
 * ```
 *
 * Available CSS classes:
 * - scroll-reveal: Fade in from bottom
 * - scroll-reveal-left: Fade in from left
 * - scroll-reveal-right: Fade in from right
 * - scroll-reveal-scale: Fade in with scale
 *
 * Add stagger delays with: stagger-1 through stagger-6
 */
export default function useScrollReveal(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  useEffect(() => {
    const { threshold = 0.1, rootMargin = "0px 0px -100px 0px" } = options || {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe all scroll-reveal elements
    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale"
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [options]);
}

/**
 * useScrollRevealRef Hook - Add scroll reveal to a specific element using a ref
 *
 * Usage:
 * ```tsx
 * import { useRef } from "react";
 * import { useScrollRevealRef } from "./useScrollReveal";
 *
 * function MyComponent() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   useScrollRevealRef(ref);
 *
 *   return (
 *     <div ref={ref} className="scroll-reveal">
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollRevealRef(
  ref: RefObject<HTMLElement>,
  options?: {
    threshold?: number;
    rootMargin?: string;
  }
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { threshold = 0.1, rootMargin = "0px 0px -100px 0px" } = options || {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
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
      observer.unobserve(element);
    };
  }, [ref, options]);
}
