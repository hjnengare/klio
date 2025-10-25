"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface LoadingOptimizerProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
  minHeight?: string;
}

export default function LoadingOptimizer({ 
  children, 
  fallback,
  delay = 100,
  minHeight = "200px"
}: LoadingOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Small delay for smooth transition
      setTimeout(() => setShowContent(true), 50);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoading) {
    return (
      <div style={{ minHeight }} className="flex items-center justify-center">
        {fallback || (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage"></div>
            <span className="text-sm text-charcoal/60">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
