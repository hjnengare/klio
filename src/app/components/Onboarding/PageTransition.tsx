"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Smooth page transition styles
const transitionStyles = `
  @keyframes pageSlideIn {
    from {
      opacity: 0;
      transform: translateX(100px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @keyframes pageSlideOut {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-100px) scale(0.98);
    }
  }

  .page-transition-enter {
    animation: pageSlideIn 0.6s ease-out forwards;
  }

  .page-transition-exit {
    animation: pageSlideOut 0.3s ease-in forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .page-transition-enter,
    .page-transition-exit {
      animation: none !important;
    }
  }
`;

// Enhanced router with smooth transitions for onboarding pages
export function smoothNavigateToNextStep(router: any, nextPath: string, currentPath: string) {
  // Add exit animation to current page
  const currentPageElement = document.querySelector('.onboarding-enter');
  if (currentPageElement) {
    currentPageElement.classList.add('page-transition-exit');

    // Navigate after exit animation completes
    setTimeout(() => {
      router.push(nextPath);
    }, 300);
  } else {
    // Fallback: navigate immediately if no current page element
    router.push(nextPath);
  }
}

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Track route changes for smooth transitions
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match animation duration

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: transitionStyles }} />
      <div className={`${isTransitioning ? 'page-transition-enter' : ''}`}>
        {children}
      </div>
    </>
  );
}
