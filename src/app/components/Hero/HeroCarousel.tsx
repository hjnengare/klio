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

const FONT_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", system-ui, sans-serif';

interface HeroCarouselProps {
  userInterests?: string[];
}

export default function HeroCarousel({ userInterests = [] }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
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
    setProgress(0); // Reset progress when advancing
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);
  const prev = useCallback(() => {
    setProgress(0); // Reset progress when going back
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Progress animation for each slide
  useEffect(() => {
    if (prefersReduced || paused) {
      // Clear progress timer when paused
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
      return;
    }

    // Reset progress when slide changes
    setProgress(0);

    // Animate progress from 0 to 100 over 5 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const totalDuration = 5000; // 5 seconds per slide
    const steps = totalDuration / interval;
    let currentStep = 0;

    progressRef.current = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      // When progress reaches 100%, advance to next slide
      if (newProgress >= 100) {
        if (progressRef.current) {
          clearInterval(progressRef.current);
          progressRef.current = null;
        }
        next();
      }
    }, interval);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    };
  }, [prefersReduced, paused, currentIndex, next]);

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
    setProgress(0); // Reset progress when manually navigating
    setPaused(true);
  };

  return (
    <>
      <div className="relative w-full px-0 md:px-4 pt-4 mt-12">
        <section
          ref={containerRef as React.RefObject<HTMLElement>}
          className="relative min-h-[80vh] sm:min-h-[80vh] w-full overflow-hidden outline-none rounded-none md:rounded-2xl"
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
          className={`absolute inset-0 w-auto h-auto overflow-hidden transition-opacity duration-700 will-change-transform ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
           {/* Full Background Image - All Screen Sizes */}
           <div className="absolute inset-0">
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
             <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
           </div>

           {/* Content - Text Left Aligned */}
           <div className="absolute inset-0 z-20 flex items-center pt-16 pb-12">
             <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
               <div className="max-w-lg sm:max-w-lg lg:max-w-2xl xl:max-w-3xl">
                 {/* Text Content */}
                 <div className="relative">
                  <h1
                     className="text-off-white leading-[1.1] mb-6 sm:mb-6 font-bold tracking-tight whitespace-normal lg:whitespace-nowrap"
                     style={{
                       fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", system-ui, sans-serif',
                       fontSize: "clamp(2.5rem, 6vw, 2rem)",
                     }}
                   >
                     {slide.title}
                   </h1>
           <p
             className="text-off-white/90 leading-relaxed mb-8 whitespace-normal lg:whitespace-nowrap lg:max-w-none"
             style={{
              fontSize: "clamp(1rem, 2vw, 0.875rem)",
               maxWidth: "60ch",
               textWrap: "pretty" as React.CSSProperties["textWrap"],
               hyphens: "none" as React.CSSProperties["hyphens"],
               wordBreak: "normal" as React.CSSProperties["wordBreak"],
             }}
           >
                     {slide.description}
                   </p>
                 </div>
               </div>
             </div>
           </div>
        </div>
      ))}

      {/* Carousel Progress Bar and Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-30 px-8 flex items-center gap-4">
        {/* Progress Bar */}
        <div className="flex-1 h-[3px] bg-white/30 relative overflow-hidden rounded-full">
          <div
            className="absolute left-0 top-0 h-full bg-white transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Pause/Play Button */}
        <button
          onClick={() => setPaused(!paused)}
          className="w-8 h-8 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={paused ? "Play carousel" : "Pause carousel"}
        >
          {paused ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <div className="flex items-center justify-center gap-[2px]">
              <span className="w-[3px] h-4 bg-white rounded-full" />
              <span className="w-[3px] h-4 bg-white rounded-full" />
            </div>
          )}
        </button>
      </div>

      {/* Accessible live region (announces slide title) */}
      <div className="sr-only" aria-live="polite">
        {slides[currentIndex]?.title}
      </div>
        </section>
      </div>
    </>
  );
}
