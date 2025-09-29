"use client";

import { useRef, useState, useEffect } from "react";

interface ScrollableSectionProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  arrowColor?: string;
}

export default function ScrollableSection({
  children,
  className = "",
  showArrows = true,
  arrowColor = "text-charcoal/60"
}: ScrollableSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;

    setCanScrollRight(maxScrollLeft > 5);
    setCanScrollLeft(scrollLeft > 5);
    setShowRightArrow(scrollLeft < maxScrollLeft - 10);
    setShowLeftArrow(scrollLeft > 10);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    checkScrollPosition();

    const handleScroll = () => checkScrollPosition();
    const handleResize = () => checkScrollPosition();

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(() => checkScrollPosition());
    observer.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const scrollRight = () => {
    if (!scrollRef.current) return;

    // Enhanced scrolling with premium feel
    const scrollAmount = scrollRef.current.clientWidth * 0.75; // Slightly less aggressive

    // Custom smooth scrolling with enhanced easing
    const start = scrollRef.current.scrollLeft;
    const change = scrollAmount;
    const duration = 600; // Longer duration for premium feel
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutCubic(timeElapsed, start, change, duration);

      if (scrollRef.current) {
        scrollRef.current.scrollLeft = run;
      }

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    // Fallback to native smooth scroll for better compatibility
    try {
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    } catch (e) {
      requestAnimationFrame(animateScroll);
    }
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth * 0.75;

    try {
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    } catch (e) {
      // Fallback scrolling
      scrollRef.current.scrollLeft -= scrollAmount;
    }
  };

  // Easing function for premium scroll feel
  const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  };

  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className={`horizontal-scroll flex snap-x snap-mandatory gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 sm:pb-5 md:pb-6 ${className}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' },
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          // Premium smooth scrolling physics
          WebkitOverflowScrolling: 'touch',
          // Enhanced momentum scrolling for premium feel
          overscrollBehaviorX: 'contain',
          scrollPaddingLeft: '1rem',
          scrollPaddingRight: '1rem',
          // Force GPU acceleration for smoother performance
          transform: 'translateZ(0)',
          willChange: 'scroll-position',
          // Enhanced touch response
          touchAction: 'pan-x',
        }}
      >
        {children}
      </div>

      {showArrows && (
        <>
          {canScrollLeft && showLeftArrow && (
            <button
              onClick={scrollLeft}
              className={`
                scroll-arrow scroll-arrow-left
                absolute left-2 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 sm:w-12 sm:h-12
                bg-white/90 backdrop-blur-sm
                rounded-full shadow-lg border border-sage/20
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:bg-white hover:shadow-xl hover:border-sage/40
                active:scale-95
                ${arrowColor}
              `}
              aria-label="Scroll left"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 arrow-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          {canScrollRight && showRightArrow && (
            <button
              onClick={scrollRight}
              className={`
                scroll-arrow scroll-arrow-right
                absolute right-2 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 sm:w-12 sm:h-12
                bg-white/90 backdrop-blur-sm
                rounded-full shadow-lg border border-sage/20
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:bg-white hover:shadow-xl hover:border-sage/40
                active:scale-95
                ${arrowColor}
              `}
              aria-label="Scroll right"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 arrow-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}