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
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=2560&q=95&auto=format&fit=crop",
    title: "Find the Best Restaurants",
    description: "Discover top-rated dining experiences, from cozy cafes to fine dining establishments in your area",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2560&q=95&auto=format&fit=crop",
    title: "Trusted Healthcare Professionals",
    description: "Connect with verified dentists, doctors, and wellness professionals recommended by your community",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=2560&q=95&auto=format&fit=crop",
    title: "Reliable Home Services",
    description: "Find skilled plumbers, electricians, and contractors for all your home improvement needs",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2560&q=95&auto=format&fit=crop",
    title: "Beauty & Wellness",
    description: "Explore salons, spas, gyms, and wellness centers that prioritize your health and happiness",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=2560&q=95&auto=format&fit=crop",
    title: "Professional Services",
    description: "Connect with lawyers, accountants, consultants, and other professionals you can trust",
  },
];

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

interface HeroCarouselProps {
  userInterests?: string[];
}

export function HeroCarousel({ userInterests = [] }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Generate slides based on user interests
  const generateSlidesFromInterests = (interests: string[]): HeroSlide[] => {
    const interestToSlides: { [key: string]: HeroSlide[] } = {
      'food-drink': [
        {
          id: "food-1",
          image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=2560&q=95&auto=format&fit=crop",
          title: "Find the Best Restaurants",
          description: "Discover top-rated dining experiences, from cozy cafes to fine dining establishments in your area",
        },
        {
          id: "food-2",
          image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=2560&q=95&auto=format&fit=crop",
          title: "Local Food Gems",
          description: "Explore hidden culinary treasures and authentic flavors recommended by your community",
        },
      ],
      'beauty-wellness': [
        {
          id: "beauty-1",
          image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2560&q=95&auto=format&fit=crop",
          title: "Beauty & Wellness",
          description: "Explore salons, spas, gyms, and wellness centers that prioritize your health and happiness",
        },
        {
          id: "beauty-2",
          image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2560&q=95&auto=format&fit=crop",
          title: "Self-Care Made Easy",
          description: "Find trusted professionals for your beauty and wellness needs",
        },
      ],
      'healthcare': [
        {
          id: "health-1",
          image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2560&q=95&auto=format&fit=crop",
          title: "Trusted Healthcare",
          description: "Connect with verified dentists, doctors, and wellness professionals recommended by your community",
        },
        {
          id: "health-2",
          image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=2560&q=95&auto=format&fit=crop",
          title: "Your Health Matters",
          description: "Find healthcare providers you can trust for all your medical needs",
        },
      ],
      'home-services': [
        {
          id: "home-1",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=2560&q=95&auto=format&fit=crop",
          title: "Reliable Home Services",
          description: "Find skilled plumbers, electricians, and contractors for all your home improvement needs",
        },
        {
          id: "home-2",
          image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=2560&q=95&auto=format&fit=crop",
          title: "Professional Contractors",
          description: "Connect with trusted professionals for repairs, renovations, and maintenance",
        },
      ],
      'professional-services': [
        {
          id: "prof-1",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=2560&q=95&auto=format&fit=crop",
          title: "Professional Services",
          description: "Connect with lawyers, accountants, consultants, and other professionals you can trust",
        },
        {
          id: "prof-2",
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2560&q=95&auto=format&fit=crop",
          title: "Expert Guidance",
          description: "Find qualified professionals for your business and personal needs",
        },
      ],
    };

    // If no interests selected, show default slides
    if (interests.length === 0) {
      return HERO_SLIDES;
    }

    // Flatten all slides from selected interests
    const slides: HeroSlide[] = [];
    interests.forEach(interest => {
      if (interestToSlides[interest]) {
        slides.push(...interestToSlides[interest]);
      }
    });

    // If no matching slides found, return default
    return slides.length > 0 ? slides : HERO_SLIDES;
  };

  const slides = generateSlidesFromInterests(userInterests);

  // respect reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);
  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

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
      <div className="absolute inset-0 backdrop-blur-[1px] bg-off-white/5 mix-blend-overlay pointer-events-none" />
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden={index !== currentIndex}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 will-change-transform ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
           {/* Mobile: Background Image */}
           <div className="absolute inset-0 lg:hidden">
             <Image
               src={slide.image}
               alt={slide.title}
               fill
               priority={index === 0}
               quality={100}
               className="object-cover"
               sizes="100vw"
             />
             {/* Overlay for text readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
           </div>

           {/* Content - Split Layout: Text Left, Image Right */}
           <div className="absolute inset-0 z-20 flex items-center pt-20 pb-8 lg:bg-off-white">
             <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
                 {/* Left: Text Content */}
                 <div className="relative">
                   <h1
                     className="text-off-white lg:text-charcoal leading-[1.1] mb-4 sm:mb-6 font-bold tracking-tight"
                     style={{
                       fontSize: "clamp(2.4rem, 5vw, 4.75rem)",
                       maxWidth: "13ch",
                       textWrap: "balance" as React.CSSProperties["textWrap"],
                     }}
                   >
                     {slide.title}
                   </h1>
                   <p
                     className="text-off-white/90 lg:text-charcoal/80 leading-relaxed"
                     style={{
                       fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                       maxWidth: "60ch",
                       textWrap: "pretty" as React.CSSProperties["textWrap"],
                     }}
                   >
                     {slide.description}
                   </p>
                 </div>

                 {/* Right: Carousel Image - Desktop Only */}
                 <div className="hidden lg:block relative p-8">
                   <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
                     <Image
                       src={slide.image}
                       alt={slide.title}
                       fill
                       priority={index === 0}
                       quality={100}
                       className="object-cover"
                       sizes="60vw"
                     />
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
        {slides.map((slide, index) => {
          const active = index === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm ${
                active
                  ? "bg-sage w-8 shadow-lg shadow-sage/30"
                  : "bg-sage/40 hover:bg-sage/60 w-2 hover:shadow-md hover:shadow-sage/20"
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
        {slides[currentIndex]?.title}
      </div>
    </section>
  );
}
