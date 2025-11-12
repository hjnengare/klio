"use client";

import { useEffect, useState } from "react";

interface OnboardingCarouselProps {
  images?: string[];
  autoPlayInterval?: number;
}

/**
 * OnboardingCarousel Component
 * 
 * A mobile-first, responsive carousel with:
 * - Stationary circular hero background
 * - Dynamic rotating images
 * - Dot indicators for navigation
 * - Auto-rotation (configurable interval)
 */
export default function OnboardingCarousel({
  images = [
    "/onboarding/art.png",
    "/onboarding/barber-chair.png",
    "/onboarding/barber-shop.png",
    "/onboarding/books.png",
    "/onboarding/camping.png",
    "/onboarding/chinese-food.png",
    "/onboarding/doctor.png",
    "/onboarding/drum.png",
    "/onboarding/dumbbell.png",
    "/onboarding/entertainment.png",
    "/onboarding/farmer.png",
    "/onboarding/fast-food.png",
    "/onboarding/flamenco.png",
    "/onboarding/football.png",
    "/onboarding/hiking.png",
    "/onboarding/pets.png",
    "/onboarding/podium.png",
    "/onboarding/swings.png",
    "/onboarding/treadmill-machine.png",
    "/onboarding/veterinary.png",
  ],
  autoPlayInterval = 4000,
}: OnboardingCarouselProps) {
  const [index, setIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [images.length, autoPlayInterval]);

  const goTo = (i: number) => setIndex(i);

  // Calculate which group (dot) the current index belongs to
  const totalDots = 3;
  const imagesPerDot = Math.ceil(images.length / totalDots);
  const currentDot = Math.floor(index / imagesPerDot);
  
  // Handle dot click - go to first image of that group
  const handleDotClick = (dotIndex: number) => {
    goTo(dotIndex * imagesPerDot);
  };

  return (
    <div className="w-full mx-auto max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1600px]">
      <style>{`
        @keyframes appleSlideIn {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes appleFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .carousel-slide {
          animation: appleSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .carousel-container {
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      
      <div className="relative overflow-hidden rounded-lg">
        {/* Stationary circular hero background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-0"
        >
          <div className="rounded-full bg-off-white border-4 border-navbar-bg ring-4 ring-sage shadow-lg w-[220px] h-[220px]" />
        </div>

        {/* Dynamic carousel for images */}
        <div
          className="flex will-change-transform relative z-10 carousel-container"
          style={{ 
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0 flex items-center justify-center py-6 carousel-slide"
              style={{ animationDelay: `${i === index ? '0s' : '0.2s'}` }}
            >
              <img
                src={src}
                alt={`Onboarding slide ${i + 1}`}
                className="mx-auto w-[260px] h-[260px] object-contain drop-shadow-sm"
                decoding="async"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators for slide navigation - 3 dots only */}
      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          {Array.from({ length: totalDots }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              aria-label={`Go to group ${dotIndex + 1}`}
              onClick={() => handleDotClick(dotIndex)}
              className={`rounded-full transition-all duration-300 ${
                dotIndex === currentDot 
                  ? "w-8 h-3 bg-coral shadow-md" 
                  : "w-2.5 h-2.5 bg-charcoal/20 hover:bg-charcoal/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

