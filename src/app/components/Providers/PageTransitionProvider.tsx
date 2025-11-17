"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionContextType {
  isTransitioning: boolean;
  setTransitioning: (value: boolean) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}

interface PageTransitionProviderProps {
  children: ReactNode;
}

export default function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Handle route changes with optimized transitions
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      return;
    }

    setIsTransitioning(true);
    const transitionTimeout = window.setTimeout(() => {
      setDisplayChildren(children);
      requestAnimationFrame(() => setIsTransitioning(false));
    }, 90); // faster transitions

    return () => {
      window.clearTimeout(transitionTimeout);
    };
  }, [children, pathname]);

  const value = {
    isTransitioning,
    setTransitioning: setIsTransitioning,
  };

  return (
    <PageTransitionContext.Provider value={value}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ 
            duration: 0.12,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="min-h-screen"
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
