"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTouchOptimization } from '../../hooks/useTouchOptimization';

// Touch-Optimized Button Component
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  hapticFeedback = true,
  pressAnimation = true,
  className = '',
  onTouchStart,
  onTouchEnd,
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const { isTouchDevice } = useTouchOptimization();

  const triggerHapticFeedback = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    triggerHapticFeedback();
    onTouchStart?.(e);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onTouchEnd?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isTouchDevice && hapticFeedback) {
      triggerHapticFeedback();
    }
    onClick?.(e);
  };

  const sizeStyles = {
    sm: { padding: '10px 16px', fontSize: '14px', minHeight: '40px', minWidth: '40px' },
    md: { padding: '14px 20px', fontSize: '16px', minHeight: '48px', minWidth: '48px' },
    lg: { padding: '18px 24px', fontSize: '18px', minHeight: '56px', minWidth: '56px' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0, 123, 255, 0.25)',
    },
    secondary: {
      backgroundColor: 'white',
      color: '#007bff',
      border: '2px solid #007bff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#007bff',
      border: 'none',
      boxShadow: 'none',
    },
  };

  return (
    <button
      {...props}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      className={`touch-button ${className} ${isPressed && pressAnimation ? 'pressed' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...sizeStyles[size],
        ...variantStyles[variant],
        transform: isPressed && pressAnimation ? 'scale(0.98)' : 'scale(1)',
        ...props.style,
      }}
    >
      {children}

      <style jsx>{`
        .touch-button:active {
          transform: scale(0.96);
        }

        .touch-button:focus {
          outline: 3px solid rgba(0, 123, 255, 0.3);
          outline-offset: 2px;
        }

        .touch-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .touch-button {
            transition: none;
            transform: none !important;
          }
        }
      `}</style>
    </button>
  );
};

// Swipeable Card Component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThreshold?: number;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 100,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleSwipe = (e: CustomEvent) => {
      const { direction, distance } = e.detail;

      if (distance < swipeThreshold) return;

      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    };

    const handleTouchStart = () => {
      setIsSwipeActive(true);
    };

    const handleTouchEnd = () => {
      setIsSwipeActive(false);
      setSwipeOffset({ x: 0, y: 0 });
    };

    card.addEventListener('swipe', handleSwipe as EventListener);
    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchend', handleTouchEnd);

    return () => {
      card.removeEventListener('swipe', handleSwipe as EventListener);
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, swipeThreshold]);

  return (
    <div
      ref={cardRef}
      className={`swipeable-card ${className} ${isSwipeActive ? 'swiping' : ''}`}
      style={{
        transform: `translate(${swipeOffset.x}px, ${swipeOffset.y}px)`,
        transition: isSwipeActive ? 'none' : 'transform 0.3s ease',
        touchAction: 'pan-y',
      }}
    >
      {children}

      <style jsx>{`
        .swipeable-card {
          position: relative;
          will-change: transform;
        }

        .swipeable-card.swiping {
          z-index: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .swipeable-card {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Mobile Pull-to-Refresh Component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshThreshold = 80,
  className = '',
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
      setIsAtTop(true);
    } else {
      setIsAtTop(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isAtTop || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const pullDistance = Math.max(0, currentY - startYRef.current);

    if (pullDistance > 0) {
      setPullDistance(Math.min(pullDistance, refreshThreshold * 1.5));

      // Prevent default scrolling when pulling
      if (pullDistance > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(refreshThreshold);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  const pullProgress = Math.min(pullDistance / refreshThreshold, 1);

  return (
    <div
      ref={containerRef}
      className={`pull-to-refresh ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance * 0.5}px)`,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease' : 'none',
      }}
    >
      {/* Pull indicator */}
      <div
        className="pull-indicator"
        style={{
          position: 'absolute',
          top: `-${refreshThreshold}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          height: `${refreshThreshold}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pullProgress,
          zIndex: 1,
        }}
      >
        <div
          className="pull-spinner"
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid #e0e0e0',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
            transform: `rotate(${pullProgress * 360}deg)`,
          }}
        />
      </div>

      {children}

      <style jsx>{`
        .pull-to-refresh {
          position: relative;
          min-height: 100%;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pull-to-refresh {
            transition: none !important;
            transform: none !important;
          }

          .pull-spinner {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Mobile Tab Bar Component
interface TabBarProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const MobileTabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  const { isTouchDevice } = useTouchOptimization();

  return (
    <div
      className={`mobile-tab-bar ${className}`}
      style={{
        display: 'flex',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        paddingBottom: isTouchDevice ? 'env(safe-area-inset-bottom)' : '0',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 8px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            minHeight: '60px',
            position: 'relative',
            transition: 'all 0.2s ease',
            touchAction: 'manipulation',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              marginBottom: '4px',
              color: activeTab === tab.id ? '#007bff' : '#6c757d',
              transition: 'color 0.2s ease',
            }}
          >
            {tab.icon}
          </div>

          <span
            style={{
              fontSize: '12px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              color: activeTab === tab.id ? '#007bff' : '#6c757d',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </span>

          {tab.badge && tab.badge > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '20%',
                backgroundColor: '#dc3545',
                color: 'white',
                borderRadius: '10px',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {tab.badge > 99 ? '99+' : tab.badge}
            </div>
          )}

          {activeTab === tab.id && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '3px',
                backgroundColor: '#007bff',
                borderRadius: '0 0 3px 3px',
              }}
            />
          )}
        </button>
      ))}

      <style jsx>{`
        .tab-item:active {
          background-color: #f8f9fa;
        }

        .tab-item:focus {
          outline: 3px solid rgba(0, 123, 255, 0.3);
          outline-offset: -3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .tab-item,
          .tab-item * {
            transition: none !important;
          }
        }

        @media (prefers-contrast: high) {
          .mobile-tab-bar {
            border-top: 2px solid;
          }
        }
      `}</style>
    </div>
  );
};

// Mobile Action Sheet Component
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }>;
  cancelLabel?: string;
  title?: string;
}

export const MobileActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  actions,
  cancelLabel = 'Cancel',
  title,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="action-sheet-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        ref={sheetRef}
        className="action-sheet"
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '16px 16px 0 0',
          paddingBottom: 'env(safe-area-inset-bottom)',
          animation: 'slideUp 0.3s ease',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        {title && (
          <div
            style={{
              padding: '20px 16px 0',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '600',
              color: '#666',
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: '16px',
              margin: '0 0 8px 0',
            }}
          >
            {title}
          </div>
        )}

        <div style={{ padding: '8px 0' }}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              disabled={action.disabled}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                fontSize: '16px',
                color: action.destructive ? '#dc3545' : action.disabled ? '#999' : '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: action.disabled ? 'not-allowed' : 'pointer',
                minHeight: '56px',
                touchAction: 'manipulation',
              }}
            >
              {action.icon && (
                <span style={{ fontSize: '20px' }}>{action.icon}</span>
              )}
              {action.label}
            </button>
          ))}
        </div>

        <div
          style={{
            padding: '8px 16px 16px',
            borderTop: '8px solid #f8f9fa',
          }}
        >
          <TouchButton
            variant="secondary"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            {cancelLabel}
          </TouchButton>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .action-sheet button:active {
          background-color: #f8f9fa;
        }

        .action-sheet button:focus {
          outline: 3px solid rgba(0, 123, 255, 0.3);
          outline-offset: -3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .action-sheet-overlay,
          .action-sheet {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};