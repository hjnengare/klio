"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const REVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80", // Restaurant
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80", // Coffee
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80", // Yoga
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80", // Cafe
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80", // Restaurant interior
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80", // Food
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=80", // Coffee shop
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80", // Restaurant ambiance
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", // Fine dining
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80", // Breakfast
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80", // Bakery
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80", // Bar
];

export default function MasonryBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Masonry grid */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[2px] auto-rows-[150px] md:auto-rows-[200px]">
        {REVIEW_IMAGES.map((src, index) => (
          <div
            key={index}
            className={`relative overflow-hidden ${
              index % 3 === 0 ? "row-span-2" : "row-span-1"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={index < 6}
              quality={75}
            />
          </div>
        ))}
      </div>

      {/* Glassmorphism overlay with dark tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal/40 via-charcoal/30 to-charcoal/20" />

      {/* Minimal blur for glassmorphism effect */}
      <div className="absolute inset-0 backdrop-blur-[5px]" />
    </div>
  );
}
