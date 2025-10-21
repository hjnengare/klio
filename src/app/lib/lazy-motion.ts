/**
 * Lazy loading utilities for Framer Motion
 * Import this instead of framer-motion directly for better performance
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy load framer-motion components
export const motion = {
  div: dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: true }),
  button: dynamic(() => import('framer-motion').then((mod) => mod.motion.button), { ssr: true }),
  h1: dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), { ssr: true }),
  section: dynamic(() => import('framer-motion').then((mod) => mod.motion.section), { ssr: true }),
  header: dynamic(() => import('framer-motion').then((mod) => mod.motion.header), { ssr: true }),
  nav: dynamic(() => import('framer-motion').then((mod) => mod.motion.nav), { ssr: true }),
};

// Lazy load AnimatePresence
export const AnimatePresence = dynamic(() => import('framer-motion').then((mod) => mod.AnimatePresence), { ssr: false });

// Lazy load useAnimation hook
export const useAnimation = () => {
  const [hook, setHook] = useState<any>(null);
  
  useEffect(() => {
    import('framer-motion').then((mod) => {
      setHook(() => mod.useAnimation);
    });
  }, []);
  
  return hook;
};

// Lazy load confetti
export const loadConfetti = async () => {
  const confetti = await import('canvas-confetti');
  return confetti.default;
};

