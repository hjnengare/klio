"use client";

import { useEffect } from 'react';

export function useAddressBarHide() {
  useEffect(() => {
    // Function to hide address bar on scroll down
    let lastScrollY = window.scrollY;
    let ticking = false;

    const hideAddressBar = () => {
      const currentScrollY = window.scrollY;

      // Only apply on mobile devices
      if (window.innerWidth <= 768) {
        // Scroll down and not at top
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Use scrollTo to trigger address bar hiding behavior
          window.scrollTo(0, currentScrollY + 1);
          setTimeout(() => {
            window.scrollTo(0, currentScrollY);
          }, 1);
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(hideAddressBar);
        ticking = true;
      }
    };

    const handleScroll = () => {
      requestTick();
    };

    // Initial trigger to hide address bar
    setTimeout(() => {
      if (window.innerWidth <= 768 && window.scrollY === 0) {
        window.scrollTo(0, 1);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 1);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}