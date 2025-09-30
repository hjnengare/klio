"use client";

import { useState, useEffect, useRef } from "react";
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

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset autoplay timer
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  return (
    <section className="relative min-h-[100vh] sm:min-h-[110vh] w-full overflow-hidden" aria-label="Hero carousel">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
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

          {/* Gradient Overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />

          {/* Content */}
          <div className="relative z-20 h-full flex items-center pt-[112px] sm:pt-[128px] pb-20">
            <div className="container mx-auto max-w-[1300px] px-4 sm:px-6">
              <div className="max-w-[800px]">
                <h1
                  className="font-urbanist font-800 text-white leading-[1.1] mb-6"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 5rem)",
                    maxWidth: "13ch",
                    textWrap: "balance",
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  className="font-urbanist font-400 text-white/90 leading-relaxed"
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                    maxWidth: "60ch",
                    textWrap: "pretty",
                  }}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Indicators */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Slide ${index + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
}