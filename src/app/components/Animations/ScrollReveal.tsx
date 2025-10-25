"use client";

import { ReactNode, useState, useEffect } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 700,
  distance = 50,
  direction = "up",
  className = "",
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
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
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, delay, isVisible, threshold]);

  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case "up": return "translate-y-8";
        case "down": return "-translate-y-8";
        case "left": return "translate-x-8";
        case "right": return "-translate-x-8";
        default: return "translate-y-8";
      }
    }
    return "translate-x-0 translate-y-0";
  };

  return (
    <div
      ref={setRef}
      className={`transition-all ease-out ${getTransformClass()} ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
