"use client";

import { useEffect } from "react";

// Critical resources to preload
const CRITICAL_RESOURCES = [
  // Fonts
  "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap",
  "https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  
  // Critical images (if any)
  // Add any critical image URLs here
];

// Preload critical resources
const preloadResource = (url: string, as: string = "style") => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  link.as = as;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
};

// Prefetch non-critical resources
const prefetchResource = (url: string) => {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  document.head.appendChild(link);
};

export default function ResourcePreloader() {
  useEffect(() => {
    // Preload critical resources immediately
    CRITICAL_RESOURCES.forEach(resource => {
      preloadResource(resource);
    });

    // Prefetch non-critical resources after a delay
    const timer = setTimeout(() => {
      // Add any non-critical resources here
      // prefetchResource("/some-non-critical-resource");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
