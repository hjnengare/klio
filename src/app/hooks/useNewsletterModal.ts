"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollDirection } from "./useScrollDirection";

interface UseNewsletterModalOptions {
  threshold?: number; // Minimum scroll position to trigger
  scrollUpAmount?: number; // Minimum pixels scrolled up to trigger
}

export function useNewsletterModal({
  threshold = 300,
  scrollUpAmount = 100,
}: UseNewsletterModalOptions = {}) {
  const [showModal, setShowModal] = useState(false);
  const { scrollY, isScrollingUp } = useScrollDirection({ threshold: 50 });
  const hasShownModal = useRef(false);
  const scrollStartY = useRef(0);

  useEffect(() => {
    // Don't show if already shown
    if (hasShownModal.current) return;

    // User must have scrolled down past threshold first
    if (scrollY < threshold) {
      scrollStartY.current = scrollY;
      return;
    }

    // Track when user starts scrolling up
    if (isScrollingUp && scrollStartY.current === 0) {
      scrollStartY.current = scrollY;
    }

    // If scrolling up and has scrolled up enough, show modal
    if (
      isScrollingUp &&
      scrollStartY.current > 0 &&
      scrollStartY.current - scrollY >= scrollUpAmount
    ) {
      setShowModal(true);
      hasShownModal.current = true;
      scrollStartY.current = 0;
    }

    // Reset scroll start if user scrolls down again
    if (!isScrollingUp) {
      scrollStartY.current = 0;
    }
  }, [scrollY, isScrollingUp, threshold, scrollUpAmount]);

  const closeModal = () => {
    setShowModal(false);
  };

  const resetModal = () => {
    hasShownModal.current = false;
    setShowModal(false);
  };

  return { showModal, closeModal, resetModal };
}
