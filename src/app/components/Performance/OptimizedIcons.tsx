"use client";

import dynamic from 'next/dynamic';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

// Lazy load heavy icon libraries
export const LazyLucideIcon = dynamic(
  () => import('lucide-react'),
  {
    ssr: false,
    loading: () => <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
  }
);

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
    'search': () => import('lucide-react').then(mod => mod.Search),
    'user': () => import('lucide-react').then(mod => mod.User),
    'heart': () => import('lucide-react').then(mod => mod.Heart),
    'star': () => import('lucide-react').then(mod => mod.Star),
    'menu': () => import('lucide-react').then(mod => mod.Menu),
    'x': () => import('lucide-react').then(mod => mod.X),
    'arrow-right': () => import('lucide-react').then(mod => mod.ArrowRight),
    'arrow-left': () => import('lucide-react').then(mod => mod.ArrowLeft),
    'chevron-down': () => import('lucide-react').then(mod => mod.ChevronDown),
    'chevron-up': () => import('lucide-react').then(mod => mod.ChevronUp),
  };

  const IconComponent = dynamic(
    commonIcons[name as keyof typeof commonIcons] || 
    (() => import('lucide-react').then(mod => mod[name as keyof typeof mod] as LucideIcon)),
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

// Pre-load critical icons for better performance
export const CriticalIcons = dynamic(
  () => import('lucide-react').then(mod => ({
    Search: mod.Search,
    User: mod.User,
    Heart: mod.Heart,
    Star: mod.Star,
    Menu: mod.Menu,
    X: mod.X,
  })),
  { ssr: false }
);
