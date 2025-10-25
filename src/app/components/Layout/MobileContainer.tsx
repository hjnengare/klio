"use client";

import { useEffect, useState } from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
}

export default function MobileContainer({
  children,
  className = '',
  fullScreen = false
}: MobileContainerProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect iOS and mobile
    const userAgent = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
    const isMobileDevice = window.innerWidth <= 768;

    setIsIOS(isIOSDevice);
    setIsMobile(isMobileDevice);
  }, []);

  // Build dynamic classes based on device type
  const containerClasses = [
    className,
    isMobile ? 'mobile-vh-fix mobile-scroll-container' : '',
    isIOS ? 'ios-minimal-ui' : '',
    fullScreen && isMobile ? 'ios-fullscreen' : '',
    'mobile-interaction', // Always add mobile interaction optimizations
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}
