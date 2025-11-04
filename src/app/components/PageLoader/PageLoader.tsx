"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";

export default function PageLoader() {
  const [routeLoading, setRouteLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const pathname = usePathname();
  const { isLoading: contextLoading } = useLoading();
  const { isLoading: authLoading } = useAuth();

  // Handle initial page load/refresh
  useEffect(() => {
    // Check if page is already loaded
    if (document.readyState === 'complete') {
      // Page already loaded, show loader briefly then hide
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Page is still loading, wait for load event
    const handleLoad = () => {
      // Small delay to show loader on refresh
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 800);
      return () => clearTimeout(timer);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Handle route changes
  useEffect(() => {
    setRouteLoading(true);
    
    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Combine all loading states
  const isLoading = initialLoad || routeLoading || contextLoading || authLoading;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-off-white/95 backdrop-blur-sm"
          style={{
            fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="relative w-12 h-12">
              <motion.div
                className="absolute inset-0 border-4 border-sage/20 rounded-full"
              />
              <motion.div
                className="absolute inset-0 border-4 border-sage border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            
            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-medium text-charcoal/70"
              style={{
                fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                fontWeight: 500,
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                letterSpacing: '-0.01em',
              }}
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

