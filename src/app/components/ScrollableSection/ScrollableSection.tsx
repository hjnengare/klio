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
    const container = scrollRef.current;
    const cardWidth = container.clientWidth * 0.52; // Match the card min-width (52% on sm)
    const gap = 24; // 6 * 4px (gap-6)
    const scrollAmount = cardWidth + gap;
    container.scrollLeft += scrollAmount;
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.clientWidth * 0.52; // Match the card min-width (52% on sm)
    const gap = 24; // 6 * 4px (gap-6)
    const scrollAmount = cardWidth + gap;
    container.scrollLeft -= scrollAmount;
  };

  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className={`horizontal-scroll flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 sm:pb-5 md:pb-6 snap-x snap-mandatory ${className}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
          touchAction: 'pan-x',
          scrollSnapType: 'x mandatory',
        } as React.CSSProperties}
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
                bg-off-white/90 backdrop-blur-sm
                rounded-full shadow-lg border border-sage/20
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:bg-off-white   hover:shadow-xl hover:border-sage/40
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
                bg-off-white/90 backdrop-blur-sm
                rounded-full shadow-lg border border-sage/20
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:bg-off-white   hover:shadow-xl hover:border-sage/40
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