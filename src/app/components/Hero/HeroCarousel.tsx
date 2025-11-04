// src/components/Hero/HeroCarousel.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useUserInterests } from "../../hooks/useUserInterests";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  description: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "1",
    image: "/hero/restaurant_cpt.jpg",
    title: "Find the Best Restaurants",
    description: "Discover top-rated dining experiences, from cozy cafes to fine dining establishments in your area",
  },
  {
    id: "2",
    image: "/hero/Cover-for-Street-Food-In-Cape-Town.webp",
    title: "Explore Local Dining",
    description: "Connect with verified restaurants and dining experiences recommended by your community",
  },
  {
    id: "3",
    image: "/hero/full-body-massage_lwj4_460x@2x.webp",
    title: "Beauty & Wellness",
    description: "Explore salons, spas, gyms, and wellness centers that prioritize your health and happiness",
  },
  {
    id: "4",
    image: "/hero/hiking-trails-cape-town.webp",
    title: "Outdoors & Adventure",
    description: "Discover amazing outdoor experiences and adventures in your area",
  },
  {
    id: "5",
    image: "/hero/views.jpg",
    title: "Discover Local Gems",
    description: "Explore the best that your community has to offer",
  },
];

const FONT_STACK = '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

interface HeroCarouselProps {
  userInterests?: string[]; // Optional prop for backward compatibility
}

export default function HeroCarousel({ userInterests: propInterests }: HeroCarouselProps) {
  // Fetch user's interests from database (unique to each user)
  const dbInterests = useUserInterests();
  // Use database interests if available, otherwise fall back to prop interests
  const userInterests = dbInterests.length > 0 ? dbInterests : (propInterests || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const currentIndexRef = useRef(currentIndex);

  // Generate slides based on user interests
  const generateSlidesFromInterests = (interests: string[]): HeroSlide[] => {
    const interestToSlides: { [key: string]: HeroSlide[] } = {
      'food-drink': [
        {
          id: "food-1",
          image: "/hero/restaurant_cpt.jpg",
          title: "Find the Best Restaurants",
          description: "Discover top-rated dining experiences, from cozy cafes to fine dining establishments in your area",
        },
        {
          id: "food-2",
          image: "/hero/Cover-for-Street-Food-In-Cape-Town.webp",
          title: "Street Food Adventures",
          description: "Explore authentic street food and local culinary experiences",
        },
        {
          id: "food-3",
          image: "/hero/v-and-a-waterfront-restaurants.webp",
          title: "Local Food Gems",
          description: "Discover hidden culinary treasures and authentic flavors recommended by your community",
        },
      ],
      'beauty-wellness': [
        {
          id: "beauty-1",
          image: "/hero/full-body-massage_lwj4_460x@2x.webp",
          title: "Beauty & Wellness",
          description: "Explore salons, spas, gyms, and wellness centers that prioritize your health and happiness",
        },
        {
          id: "beauty-2",
          image: "/hero/practice-gallery-23.jpg",
          title: "Self-Care Made Easy",
          description: "Find trusted professionals for your beauty and wellness needs",
        },
        {
          id: "beauty-3",
          image: "/hero/wheelchair+and+nurse.webp",
          title: "Holistic Wellness",
          description: "Discover comprehensive wellness services for your mind and body",
        },
      ],
      'professional-services': [
        {
          id: "prof-1",
          image: "/hero/Construction-Cost-South-Africa-1024x585.jpg",
          title: "Professional Services",
          description: "Connect with lawyers, accountants, consultants, and other professionals you can trust",
        },
        {
          id: "prof-2",
          image: "/hero/plumbing-cost-per-square-meter-south-africa-1024x585.jpeg",
          title: "Expert Guidance",
          description: "Find qualified professionals for your business and personal needs",
        },
        {
          id: "prof-3",
          image: "/hero/DSC_3122.jpg",
          title: "Trusted Professionals",
          description: "Work with verified experts for all your service needs",
        },
      ],
      'outdoors-adventure': [
        {
          id: "outdoor-1",
          image: "/hero/hiking-trails-cape-town.webp",
          title: "Outdoors & Adventure",
          description: "Discover amazing outdoor experiences and adventures in your area",
        },
        {
          id: "outdoor-2",
          image: "/hero/cpt_table_mountain.jpg",
          title: "Explore Nature",
          description: "Find outdoor activities and adventures that match your interests",
        },
        {
          id: "outdoor-3",
          image: "/hero/table_mountain.jpeg",
          title: "Mountain Adventures",
          description: "Experience breathtaking views and outdoor excursions",
        },
        {
          id: "outdoor-4",
          image: "/hero/views.jpg",
          title: "Scenic Experiences",
          description: "Discover beautiful landscapes and outdoor destinations",
        },
      ],
      'experiences-entertainment': [
        {
          id: "ent-1",
          image: "/hero/Bo-Kaap_Cape_Town_South_Africa.jpg",
          title: "Entertainment & Experiences",
          description: "Discover exciting events, entertainment venues, and unique experiences near you",
        },
        {
          id: "ent-2",
          image: "/hero/v-and-a-waterfront-restaurants.webp",
          title: "Unforgettable Moments",
          description: "Explore places and experiences that create lasting memories",
        },
        {
          id: "ent-3",
          image: "/hero/26ac876911e042cd87c6e6be20135d73.jpg",
          title: "Unique Experiences",
          description: "Find one-of-a-kind entertainment and memorable experiences",
        },
      ],
      'arts-culture': [
        {
          id: "arts-1",
          image: "/hero/Old_Drill_Hall,_Darling_Street,_Cape_town.jpeg",
          title: "Arts & Culture",
          description: "Immerse yourself in local arts, culture, and historical landmarks",
        },
        {
          id: "arts-2",
          image: "/hero/Cape-Towns-Centra-Library_70-years_exterior.jpg",
          title: "Cultural Heritage",
          description: "Explore museums, galleries, and cultural institutions in your community",
        },
        {
          id: "arts-3",
          image: "/hero/a1-2.jpg",
          title: "Artistic Expressions",
          description: "Discover local art, culture, and creative experiences",
        },
      ],
      'family-pets': [
        {
          id: "family-1",
          image: "/hero/garden-services-9.jpg",
          title: "Family & Pets",
          description: "Find family-friendly places and pet services that everyone will love",
        },
        {
          id: "family-2",
          image: "/hero/wheelchair+and+nurse.webp",
          title: "Family Care",
          description: "Discover trusted services for your family and beloved pets",
        },
        {
          id: "family-3",
          image: "/hero/views.jpg",
          title: "Family Adventures",
          description: "Explore family-friendly destinations and activities",
        },
      ],
      'shopping-lifestyle': [
        {
          id: "shop-1",
          image: "/hero/v-and-a-waterfront-restaurants.webp",
          title: "Shopping & Lifestyle",
          description: "Explore the best shopping destinations and lifestyle experiences",
        },
        {
          id: "shop-2",
          image: "/hero/Bo-Kaap_Cape_Town_South_Africa.jpg",
          title: "Lifestyle Experiences",
          description: "Discover shops, boutiques, and lifestyle services tailored to you",
        },
        {
          id: "shop-3",
          image: "/hero/pexels-pixabay-159711-new-2-e1751302518691.jpg",
          title: "Lifestyle Destinations",
          description: "Find unique shopping and lifestyle experiences in your area",
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
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % slides.length;
      currentIndexRef.current = newIndex;
      return newIndex;
    });
  }, [slides.length]);
  const prev = useCallback(() => {
    setProgress(0); // Reset progress when going back
    setCurrentIndex((prev) => {
      const newIndex = (prev - 1 + slides.length) % slides.length;
      currentIndexRef.current = newIndex;
      return newIndex;
    });
  }, [slides.length]);

  // Update ref when currentIndex changes
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

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
        // Use the ref version of next to avoid dependency issues
        setCurrentIndex((prev) => {
          const newIndex = (prev + 1) % slides.length;
          currentIndexRef.current = newIndex;
          return newIndex;
        });
        setProgress(0);
      }
    }, interval);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    };
  }, [prefersReduced, paused, currentIndex, slides.length]);

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
      <div className="relative w-full px-0 mt-6">
        <section
          ref={containerRef as React.RefObject<HTMLElement>}
          className="relative min-h-[80vh] sm:min-h-[80vh] md:min-h-[90vh] w-full overflow-hidden outline-none rounded-none"
          aria-label="Hero carousel"
          tabIndex={0}
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
                     className="text-off-white leading-[1.1] mb-6 sm:mb-6 font-extrabold tracking-tight whitespace-normal lg:whitespace-nowrap"
                     style={{
                       fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                       fontSize: "clamp(2.5rem, 6vw, 2rem)",
                       fontWeight: 800,
                     }}
                   >
                     {slide.title}
                   </h1>
           <p
             className="text-off-white/90 leading-relaxed mb-8 whitespace-normal lg:whitespace-nowrap lg:max-w-none"
             style={{
              fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              fontWeight: 600,
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
      <div className="absolute bottom-12 left-0 right-0 z-30 px-8 flex items-center gap-3">
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
