"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

// Notification Management
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}

interface NotificationOptions {
  maxNotifications?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  enableStacking?: boolean;
  enableQueueing?: boolean;
}

const defaultNotificationOptions: NotificationOptions = {
  maxNotifications: 5,
  defaultDuration: 5000,
  position: 'top-right',
  enableStacking: true,
  enableQueueing: true,
};

export function useNotifications(options: NotificationOptions = {}) {
  const opts = { ...defaultNotificationOptions, ...options };
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [queue, setQueue] = useState<Notification[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
      duration: notification.duration ?? opts.defaultDuration,
    };

    setNotifications(prev => {
      const updatedNotifications = [...prev, newNotification];

      // If exceeding max notifications, handle based on stacking/queueing
      if (updatedNotifications.length > opts.maxNotifications!) {
        if (opts.enableQueueing) {
          // Move excess to queue
          const excess = updatedNotifications.splice(opts.maxNotifications!);
          setQueue(prevQueue => [...prevQueue, ...excess]);
        } else {
          // Remove oldest
          updatedNotifications.shift();
        }
      }

      return updatedNotifications;
    });

    // Auto-remove after duration (if not persistent)
    if (!newNotification.persistent && newNotification.duration! > 0) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);

      timeoutRefs.current.set(id, timeoutId);
    }

    return id;
  }, [opts.maxNotifications, opts.defaultDuration, opts.enableQueueing]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    // Clear timeout
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    // Process queue if queueing is enabled
    if (opts.enableQueueing) {
      setQueue(prevQueue => {
        if (prevQueue.length > 0) {
          const [nextNotification, ...remainingQueue] = prevQueue;
          setNotifications(prev => [...prev, nextNotification]);

          // Set timeout for the queued notification
          if (!nextNotification.persistent && nextNotification.duration! > 0) {
            const timeoutId = setTimeout(() => {
              removeNotification(nextNotification.id);
            }, nextNotification.duration);

            timeoutRefs.current.set(nextNotification.id, timeoutId);
          }

          return remainingQueue;
        }
        return prevQueue;
      });
    }
  }, [opts.enableQueueing]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setQueue([]);

    // Clear all timeouts
    timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current.clear();
  }, []);

  // Shorthand methods
  const success = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'success', title, message });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'error', title, message, persistent: true });
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'warning', title, message });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'info', title, message });
  }, [addNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    queueLength: queue.length,
  };
}

// Modal Management
interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
  options?: {
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    preventBodyScroll?: boolean;
  };
}

export function useModals() {
  const [modals, setModals] = useState<Modal[]>([]);
  const [zIndexBase] = useState(1000);

  const openModal = useCallback((
    component: React.ComponentType<any>,
    props?: any,
    options?: Modal['options']
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const modal: Modal = {
      id,
      component,
      props,
      options: {
        closeOnOverlayClick: true,
        closeOnEscape: true,
        preventBodyScroll: true,
        ...options,
      },
    };

    setModals(prev => [...prev, modal]);

    // Prevent body scroll if enabled
    if (modal.options?.preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    }

    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => {
      const updatedModals = prev.filter(modal => modal.id !== id);

      // Restore body scroll if no more modals with preventBodyScroll
      const hasScrollPrevention = updatedModals.some(
        modal => modal.options?.preventBodyScroll
      );

      if (!hasScrollPrevention) {
        document.body.style.overflow = '';
      }

      return updatedModals;
    });
  }, []);

  const closeTopModal = useCallback(() => {
    setModals(prev => {
      if (prev.length === 0) return prev;

      const updatedModals = prev.slice(0, -1);

      // Restore body scroll if no more modals with preventBodyScroll
      const hasScrollPrevention = updatedModals.some(
        modal => modal.options?.preventBodyScroll
      );

      if (!hasScrollPrevention) {
        document.body.style.overflow = '';
      }

      return updatedModals;
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
    document.body.style.overflow = '';
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modals.length > 0) {
        const topModal = modals[modals.length - 1];
        if (topModal.options?.closeOnEscape) {
          closeTopModal();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modals, closeTopModal]);

  return {
    modals: modals.map((modal, index) => ({
      ...modal,
      zIndex: zIndexBase + index,
    })),
    openModal,
    closeModal,
    closeTopModal,
    closeAllModals,
    hasModals: modals.length > 0,
  };
}

// Animation State Management
interface AnimationState {
  isAnimating: boolean;
  animationId: string | null;
  progress: number;
}

export function useAnimationState() {
  const [animations, setAnimations] = useState<Map<string, AnimationState>>(new Map());
  const animationRefs = useRef<Map<string, number>>(new Map());

  const startAnimation = useCallback((
    id: string,
    duration: number,
    onProgress?: (progress: number) => void,
    onComplete?: () => void
  ) => {
    // Cancel existing animation
    const existingFrameId = animationRefs.current.get(id);
    if (existingFrameId) {
      cancelAnimationFrame(existingFrameId);
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimations(prev => new Map(prev.set(id, {
        isAnimating: progress < 1,
        animationId: id,
        progress,
      })));

      onProgress?.(progress);

      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        animationRefs.current.set(id, frameId);
      } else {
        animationRefs.current.delete(id);
        onComplete?.();
      }
    };

    const frameId = requestAnimationFrame(animate);
    animationRefs.current.set(id, frameId);

    return id;
  }, []);

  const cancelAnimation = useCallback((id: string) => {
    const frameId = animationRefs.current.get(id);
    if (frameId) {
      cancelAnimationFrame(frameId);
      animationRefs.current.delete(id);
    }

    setAnimations(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const getAnimationState = useCallback((id: string): AnimationState | null => {
    return animations.get(id) || null;
  }, [animations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationRefs.current.forEach(frameId => cancelAnimationFrame(frameId));
    };
  }, []);

  return {
    startAnimation,
    cancelAnimation,
    getAnimationState,
    hasActiveAnimations: animations.size > 0,
  };
}

// Debounced State Management
export function useDebouncedState<T>(initialValue: T, delay: number = 300) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  const setValueImmediate = useCallback((newValue: T) => {
    setValue(newValue);
    setDebouncedValue(newValue);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return [debouncedValue, setValue, setValueImmediate] as const;
}

// Throttled State Management
export function useThrottledState<T>(initialValue: T, interval: number = 100) {
  const [value, setValue] = useState<T>(initialValue);
  const [throttledValue, setThrottledValue] = useState<T>(initialValue);
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();

    if (now - lastExecuted.current >= interval) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, interval - (now - lastExecuted.current));
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  return [throttledValue, setValue] as const;
}

// Time-sensitive Content Management
interface TimeStamp {
  timestamp: number;
  refreshInterval?: number;
}

export function useRelativeTime(timestamp: number, refreshInterval: number = 60000) {
  const [relativeTime, setRelativeTime] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();

  const formatRelativeTime = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 30) return `${seconds} seconds ago`;
    return 'Just now';
  }, []);

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelativeTime(formatRelativeTime(timestamp));
    };

    updateRelativeTime();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(updateRelativeTime, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timestamp, refreshInterval, formatRelativeTime]);

  return relativeTime;
}

// Session Management for Stale Tabs
export function useSessionManagement() {
  const [isStale, setIsStale] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();

  const refreshSession = useCallback(() => {
    setLastActivity(Date.now());
    setIsStale(false);

    // Clear existing timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // Set new timeout (30 minutes)
    sessionTimeoutRef.current = setTimeout(() => {
      setIsStale(true);
    }, 30 * 60 * 1000);
  }, []);

  const handleActivity = useCallback(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    // Activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastActivity = Date.now() - lastActivity;
        if (timeSinceLastActivity > 30 * 60 * 1000) {
          setIsStale(true);
        } else {
          refreshSession();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial session
    refreshSession();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [handleActivity, lastActivity, refreshSession]);

  return {
    isStale,
    lastActivity,
    refreshSession,
  };
}
