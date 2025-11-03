"use client";

import dynamic from 'next/dynamic';
import React from 'react';
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
    'search': () => import('react-feather').then(mod => ({ default: mod.Search })),
    'user': () => import('react-feather').then(mod => ({ default: mod.User })),
    'heart': () => import('react-feather').then(mod => ({ default: mod.Heart })),
    'star': () => import('react-feather').then(mod => ({ default: mod.Star })),
    'menu': () => import('react-feather').then(mod => ({ default: mod.Menu })),
    'x': () => import('react-feather').then(mod => ({ default: mod.X })),
    'arrow-right': () => import('react-feather').then(mod => ({ default: mod.ArrowRight })),
    'arrow-left': () => import('react-feather').then(mod => ({ default: mod.ArrowLeft })),
    'chevron-down': () => import('react-feather').then(mod => ({ default: mod.ChevronDown })),
    'chevron-up': () => import('react-feather').then(mod => ({ default: mod.ChevronUp })),
  };

  const IconComponent = dynamic(
    commonIcons[name as keyof typeof commonIcons] || 
    (() => import('react-feather').then(mod => ({ default: mod[name as keyof typeof mod] as React.ComponentType<React.SVGProps<SVGSVGElement>> }))),
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
