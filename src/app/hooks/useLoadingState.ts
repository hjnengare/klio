"use client";

import { useEffect, useRef } from "react";
import { useLoading } from "../contexts/LoadingContext";

/**
 * Hook to integrate loading states with the global PageLoader
 * Use this in components that fetch data to show the page loader
 */
export function useLoadingState(key: string, isLoading: boolean) {
  const { setLoading } = useLoading();
  const prevLoadingRef = useRef(isLoading);

  useEffect(() => {
    // Only update if the loading state actually changed
    if (prevLoadingRef.current !== isLoading) {
      setLoading(key, isLoading);
      prevLoadingRef.current = isLoading;
    }

    return () => {
      setLoading(key, false);
    };
  }, [key, isLoading, setLoading]);
}

/**
 * Hook for multiple loading states
 */
export function useMultipleLoadingStates(loadingStates: Record<string, boolean>) {
  const { setLoading } = useLoading();
  const prevStatesRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    // Compare current states with previous states to avoid unnecessary updates
    Object.entries(loadingStates).forEach(([key, loading]) => {
      if (prevStatesRef.current[key] !== loading) {
        setLoading(key, loading);
      }
    });

    // Clean up keys that are no longer in the loadingStates
    Object.keys(prevStatesRef.current).forEach((key) => {
      if (!(key in loadingStates)) {
        setLoading(key, false);
      }
    });

    // Update ref for next comparison
    prevStatesRef.current = { ...loadingStates };

    return () => {
      Object.keys(loadingStates).forEach((key) => {
        setLoading(key, false);
      });
    };
  }, [loadingStates, setLoading]);
}

