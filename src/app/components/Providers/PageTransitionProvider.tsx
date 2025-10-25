"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  // Handle route changes with optimized transitions
  useEffect(() => {
    const handleRouteChange = () => {
      setIsTransitioning(true);
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        setTimeout(() => {
          setDisplayChildren(children);
          setIsTransitioning(false);
        }, 150); // Reduced transition time
      });
    };

    // Listen for route changes
    const handleBeforeUnload = () => {
      setIsTransitioning(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [children]);

  const value = {
    isTransitioning,
    setTransitioning: setIsTransitioning,
  };

  return (
    <PageTransitionContext.Provider value={value}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.2,
            ease: "easeInOut"
          }}
          className="min-h-screen"
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}