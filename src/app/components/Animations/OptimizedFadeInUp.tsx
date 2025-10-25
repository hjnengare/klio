"use client";

import { ReactNode, useState, useEffect } from "react";

interface OptimizedFadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export default function OptimizedFadeInUp({
  children,
  delay = 0,
  duration = 600,
  distance = 30,
  className = "",
}: OptimizedFadeInUpProps) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          const timer = setTimeout(() => setIsVisible(true), delay);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, delay, isVisible]);

  return (
    <div
      ref={setRef}
      className={`transition-all ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : `opacity-0 translate-y-${distance >= 30 ? "8" : "4"}`
      } ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
