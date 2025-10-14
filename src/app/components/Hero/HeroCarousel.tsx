// src/components/Hero/HeroCarousel.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  description: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=85",
    title: "Discover Local Experiences",
    description: "Explore authentic reviews and find the perfect spots curated by your community",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=85",
    title: "Share Your Story",
    description: "Connect with others through honest reviews and meaningful recommendations",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85",
    title: "Build Trust Together",
    description: "Join a community that values authenticity and real experiences",
  },
];

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // respect reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);
  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // autoplay (paused on reduced motion / hover / focus / tab hidden)
  useEffect(() => {
    if (prefersReduced || paused) return;

    const start = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(next, 5000);
    };
    const stop = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };

    start();
    return stop;
  }, [prefersReduced, paused, next]);

  // pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setPaused(true);
        next();
      } else if (e.key === "ArrowLeft") {
        setPaused(true);
        prev();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // swipe gestures (mobile)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let deltaX = 0;
    const threshold = 40;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      deltaX = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      deltaX = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
      if (Math.abs(deltaX) > threshold) {
        setPaused(true);
        if (deltaX < 0) next();
        else prev();
      }
      startX = 0;
      deltaX = 0;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setPaused(true);
  };

  return (
    <section
      ref={containerRef as React.RefObject<HTMLElement>}
      className="relative min-h-[100vh] w-full overflow-hidden outline-none"
      aria-label="Hero carousel"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{ fontFamily: FONT_STACK }}
    >
      {/* Liquid Glass Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-sage/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/5 mix-blend-overlay pointer-events-none" />
      {/* Slides */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden={index !== currentIndex}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 will-change-transform ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              quality={85}
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Liquid Glass Overlays for premium depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-sage/10 pointer-events-none" />
          <div className="absolute inset-0 backdrop-blur-[0.5px] bg-white/5 mix-blend-overlay pointer-events-none" />

          {/* Content */}
          <div className="relative z-20 h-full flex items-center pt-[112px] sm:pt-[128px] pb-20">
            <div className="container mx-auto max-w-[1300px] px-4 sm:px-6">
              <div className="max-w-[800px] relative">
                {/* Glass Content Container */}
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/20">
                  {/* Subtle Glass Texture */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.3)_0%,_transparent_50%)] rounded-3xl" />
                  
                  <div className="relative z-10">
                    <h1
                      className="text-white leading-[1.1] mb-4 sm:mb-6 font-bold tracking-tight drop-shadow-2xl"
                      style={{
                        fontSize: "clamp(2.4rem, 5vw, 4.75rem)",
                        maxWidth: "13ch",
                        textWrap: "balance" as any,
                      }}
                    >
                      {slide.title}
                    </h1>
                    <p
                      className="text-white/95 leading-relaxed drop-shadow-lg"
                      style={{
                        fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                        maxWidth: "60ch",
                        textWrap: "pretty" as any,
                      }}
                    >
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Indicators */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {HERO_SLIDES.map((slide, index) => {
          const active = index === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm ${
                active 
                  ? "bg-white/90 w-8 shadow-lg shadow-white/20" 
                  : "bg-white/40 hover:bg-white/60 w-2 hover:shadow-md hover:shadow-white/10"
              }`}
              role="tab"
              aria-selected={active}
              aria-label={`Slide ${index + 1}: ${slide.title}`}
            />
          );
        })}
      </div>

      {/* Accessible live region (announces slide title) */}
      <div className="sr-only" aria-live="polite">
        {HERO_SLIDES[currentIndex].title}
      </div>
    </section>
  );
}
