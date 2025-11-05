"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "react-feather";

interface BusinessCarouselProps {
  businessName: string;
  businessImages: string[];
}

export default function BusinessCarousel({ businessName, businessImages }: BusinessCarouselProps) {
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? businessImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === businessImages.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => setCurrentImageIndex(index);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNextImage();
    if (isRightSwipe) handlePrevImage();
  };

  return (
    <div className="mb-6 md:mb-8 mx-2 md:mx-0 relative">
      <div
        className="relative overflow-hidden rounded-2xl md:rounded-lg bg-card-bg"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {businessImages.map((img, idx) => (
            <div
              key={idx}
              className="w-full flex-shrink-0 aspect-[4/3] md:aspect-[16/9] bg-sage/10 relative overflow-hidden"
            >
              <Image
                src={img}
                alt={`${businessName} photo ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1100px"
                quality={90}
                priority={idx === 0}
                onError={() => setImageError((prev) => ({ ...prev, [idx]: true }))}
                style={{ objectPosition: 'center' }}
              />
              {imageError[idx] && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-sage/5">
                  <ImageIcon size={64} className="text-sage" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevImage}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal/70 hover:bg-charcoal/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
          aria-label="Previous image"
        >
          <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={22} />
        </button>

        <button
          onClick={handleNextImage}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal/70 hover:bg-charcoal/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
          aria-label="Next image"
        >
          <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={22} />
        </button>

        {/* Image Counter */}
        <div className="absolute top-3 md:top-4 right-3 md:right-4 px-3 py-1.5 rounded-full bg-charcoal/70 backdrop-blur-sm z-10">
          <span className="text-xs md:text-sm font-500 text-white">
            {currentImageIndex + 1} / {businessImages.length}
          </span>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center space-x-2 mt-4 px-4">
        {businessImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`transition-all duration-300 ${idx === currentImageIndex
                ? "w-8 h-2 bg-sage rounded-full"
                : "w-2 h-2 bg-sage/30 rounded-full hover:bg-sage/50"
              }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
