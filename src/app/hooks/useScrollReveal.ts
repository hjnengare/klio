"use client";

import { useEffect, useRef } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Scroll reveal hook that animates elements when they enter the viewport
 * Only runs once per page load by default
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    once = true,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    // Create IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            
            // If once is true, stop observing after first reveal
            if (once && observerRef.current) {
              observerRef.current.unobserve(entry.target);
              observedElementsRef.current.delete(entry.target);
            }
          } else if (!once) {
            // If not once, remove active class when element leaves viewport
            entry.target.classList.remove("active");
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Function to observe all sections
    const observeSections = () => {
      const sections = document.querySelectorAll("[data-section]");
      sections.forEach((section) => {
        if (!observedElementsRef.current.has(section) && observerRef.current) {
          observerRef.current.observe(section);
          observedElementsRef.current.add(section);
        }
      });
    };

    // Initial observation - use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      observeSections();
    }, 0);

    // Also observe on any dynamic content changes
    const mutationObserver = new MutationObserver(() => {
      observeSections();
    });

    // Observe the document body for new sections
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      mutationObserver.disconnect();
      if (observerRef.current) {
        observedElementsRef.current.forEach((element) => {
          observerRef.current?.unobserve(element);
        });
        observerRef.current.disconnect();
        observedElementsRef.current.clear();
      }
    };
  }, [threshold, rootMargin, once]);

  return null;
}
