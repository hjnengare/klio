"use client";

import dynamic from 'next/dynamic';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

// Optimized icon component that only loads what's needed
interface OptimizedIconProps {
  name: string;
  size?: number;
  className?: string;
  fallback?: ReactNode;
}

export function OptimizedIcon({ 
  name, 
  size = 20, 
  className = "", 
  fallback 
}: OptimizedIconProps) {
  // For commonly used icons, we can pre-import them
  const commonIcons = {
    'search': () => import('lucide-react').then(mod => ({ default: mod.Search })),
    'user': () => import('lucide-react').then(mod => ({ default: mod.User })),
    'heart': () => import('lucide-react').then(mod => ({ default: mod.Heart })),
    'star': () => import('lucide-react').then(mod => ({ default: mod.Star })),
    'menu': () => import('lucide-react').then(mod => ({ default: mod.Menu })),
    'x': () => import('lucide-react').then(mod => ({ default: mod.X })),
    'arrow-right': () => import('lucide-react').then(mod => ({ default: mod.ArrowRight })),
    'arrow-left': () => import('lucide-react').then(mod => ({ default: mod.ArrowLeft })),
    'chevron-down': () => import('lucide-react').then(mod => ({ default: mod.ChevronDown })),
    'chevron-up': () => import('lucide-react').then(mod => ({ default: mod.ChevronUp })),
  };

  const IconComponent = dynamic(
    commonIcons[name as keyof typeof commonIcons] || 
    (() => import('lucide-react').then(mod => ({ default: mod[name as keyof typeof mod] as LucideIcon }))),
    {
      ssr: false,
      loading: () => fallback || <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
    }
  );

  return (
    <IconComponent 
      size={size} 
      className={className}
    />
  );
}
