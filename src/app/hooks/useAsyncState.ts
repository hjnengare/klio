"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastFetch: number;
  stale: boolean;
}

interface AsyncOptions {
  staleTime?: number; // Time before data is considered stale (ms)
  cacheTime?: number; // Time before data is garbage collected (ms)
  retry?: number; // Number of retry attempts
  retryDelay?: number; // Delay between retries (ms)
  optimisticUpdate?: boolean; // Enable optimistic updates
  abortOnUnmount?: boolean; // Abort requests when component unmounts
  preventRaceConditions?: boolean; // Cancel previous requests when new ones start
  enableOfflineSupport?: boolean; // Cache responses for offline use
}

const defaultOptions: AsyncOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
  retry: 3,
  retryDelay: 1000,
  optimisticUpdate: false,
  abortOnUnmount: true,
  preventRaceConditions: true,
  enableOfflineSupport: true,
};

// Global cache for async requests
const globalCache = new Map<string, AsyncState<any>>();
const activeRequests = new Map<string, AbortController>();

export function useAsyncState<T>(
  key: string,
  asyncFunction: (signal?: AbortSignal) => Promise<T>,
  options: AsyncOptions = {}
) {
  const opts = { ...defaultOptions, ...options };
  const [state, setState] = useState<AsyncState<T>>(() => {
    const cached = globalCache.get(key);
    return cached || {
      data: null,
      loading: false,
      error: null,
      lastFetch: 0,
      stale: true,
    };
  });

  const retryCountRef = useRef(0);
  const optimisticDataRef = useRef<T | null>(null);
  const mountedRef = useRef(true);

  // Check if data is stale
  const isStale = useCallback(() => {
    const now = Date.now();
    return now - state.lastFetch > opts.staleTime!;
  }, [state.lastFetch, opts.staleTime]);

  // Execute async function with error handling and retries
  const execute = useCallback(async (forceRefresh = false): Promise<T | null> => {
    const cacheKey = key;

    // Return cached data if not stale and not forcing refresh
    if (!forceRefresh && !isStale() && state.data) {
      return state.data;
    }

    // Check for existing request to prevent race conditions
    if (opts.preventRaceConditions && activeRequests.has(cacheKey)) {
      activeRequests.get(cacheKey)?.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    activeRequests.set(cacheKey, abortController);

    // Set loading state
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      stale: false,
    }));

    const attemptRequest = async (attempt: number): Promise<T | null> => {
      try {
        const result = await asyncFunction(abortController.signal);

        if (!mountedRef.current) return null;

        // Update state and cache
        const newState: AsyncState<T> = {
          data: result,
          loading: false,
          error: null,
          lastFetch: Date.now(),
          stale: false,
        };

        setState(newState);
        globalCache.set(cacheKey, newState);

        // Clear optimistic data
        optimisticDataRef.current = null;
        retryCountRef.current = 0;

        // Clean up
        activeRequests.delete(cacheKey);

        return result;
      } catch (error) {
        if (!mountedRef.current) return null;

        const isAborted = error instanceof Error && error.name === 'AbortError';

        if (isAborted) {
          return null;
        }

        // Retry logic
        if (attempt < opts.retry! && error instanceof Error) {
          await new Promise(resolve => setTimeout(resolve, opts.retryDelay! * attempt));
          return attemptRequest(attempt + 1);
        }

        // Final error state
        const errorState: AsyncState<T> = {
          ...state,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
          stale: true,
        };

        setState(errorState);

        // Don't cache errors unless offline support is enabled
        if (opts.enableOfflineSupport) {
          globalCache.set(cacheKey, errorState);
        }

        activeRequests.delete(cacheKey);
        retryCountRef.current = 0;

        throw error;
      }
    };

    return attemptRequest(1);
  }, [key, asyncFunction, opts, state, isStale]);

  // Optimistic update function
  const mutate = useCallback((
    updateFunction: (currentData: T | null) => T | Promise<T>,
    options: { optimistic?: boolean; revalidate?: boolean } = {}
  ) => {
    const { optimistic = opts.optimisticUpdate, revalidate = true } = options;

    const performUpdate = async () => {
      try {
        const currentData = optimisticDataRef.current || state.data;
        const newData = await updateFunction(currentData);

        if (optimistic) {
          // Apply optimistic update immediately
          optimisticDataRef.current = newData;
          setState(prev => ({
            ...prev,
            data: newData,
            stale: false,
          }));
        }

        // Revalidate if needed
        if (revalidate) {
          await execute(true);
        } else if (!optimistic) {
          // Apply update without revalidation
          setState(prev => ({
            ...prev,
            data: newData,
            lastFetch: Date.now(),
            stale: false,
          }));
          globalCache.set(key, {
            ...state,
            data: newData,
            lastFetch: Date.now(),
            stale: false,
          });
        }
      } catch (error) {
        // Rollback optimistic update on error
        if (optimistic && optimisticDataRef.current) {
          setState(prev => ({
            ...prev,
            data: state.data,
            error: error instanceof Error ? error : new Error('Mutation failed'),
          }));
          optimisticDataRef.current = null;
        }
        throw error;
      }
    };

    return performUpdate();
  }, [key, state, opts.optimisticUpdate, execute]);

  // Invalidate cache
  const invalidate = useCallback(() => {
    setState(prev => ({ ...prev, stale: true }));
    globalCache.delete(key);
  }, [key]);

  // Refresh data
  const refresh = useCallback(() => execute(true), [execute]);

  // Set up automatic data fetching and cache management
  useEffect(() => {
    mountedRef.current = true;

    // Auto-fetch on mount if no data or data is stale
    if (!state.data || isStale()) {
      execute();
    }

    // Set up cache cleanup
    const cleanupTimer = setTimeout(() => {
      if (globalCache.has(key)) {
        const cached = globalCache.get(key);
        if (cached && Date.now() - cached.lastFetch > opts.cacheTime!) {
          globalCache.delete(key);
        }
      }
    }, opts.cacheTime);

    return () => {
      mountedRef.current = false;
      clearTimeout(cleanupTimer);

      // Abort ongoing requests if configured
      if (opts.abortOnUnmount && activeRequests.has(key)) {
        activeRequests.get(key)?.abort();
        activeRequests.delete(key);
      }
    };
  }, [key, execute, isStale, opts.cacheTime, opts.abortOnUnmount]);

  // Handle browser visibility changes for stale data refetch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isStale()) {
        execute();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [execute, isStale]);

  // Handle network status changes for offline support
  useEffect(() => {
    if (!opts.enableOfflineSupport) return;

    const handleOnline = () => {
      if (state.error && isStale()) {
        execute();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [execute, state.error, isStale, opts.enableOfflineSupport]);

  return {
    ...state,
    isStale: isStale(),
    execute,
    mutate,
    invalidate,
    refresh,
    isLoading: state.loading,
    hasError: !!state.error,
  };
}

// Hook for managing multiple async states
export function useAsyncQueries<T extends Record<string, any>>(
  queries: Record<keyof T, {
    key: string;
    asyncFunction: (signal?: AbortSignal) => Promise<T[keyof T]>;
    options?: AsyncOptions;
  }>
) {
  const results = {} as Record<keyof T, ReturnType<typeof useAsyncState>>;

  Object.entries(queries).forEach(([queryKey, config]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[queryKey as keyof T] = useAsyncState(
      config.key,
      config.asyncFunction,
      config.options
    );
  });

  const isLoading = Object.values(results).some(result => result.loading);
  const hasError = Object.values(results).some(result => result.hasError);
  const isStale = Object.values(results).some(result => result.isStale);

  const refreshAll = useCallback(() => {
    return Promise.all(
      Object.values(results).map(result => result.refresh())
    );
  }, [results]);

  const invalidateAll = useCallback(() => {
    Object.values(results).forEach(result => result.invalidate());
  }, [results]);

  return {
    queries: results,
    isLoading,
    hasError,
    isStale,
    refreshAll,
    invalidateAll,
  };
}

// Hook for optimistic mutations
export function useOptimisticMutation<T, U>(
  mutationFunction: (data: U) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  } = {}
) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (variables: U, optimisticData?: T) => {
    setState({
      data: optimisticData || null,
      loading: true,
      error: null,
    });

    try {
      const result = await mutationFunction(variables);

      setState({
        data: result,
        loading: false,
        error: null,
      });

      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Mutation failed');

      setState({
        data: null,
        loading: false,
        error: errorObj,
      });

      options.onError?.(errorObj);
      throw errorObj;
    } finally {
      options.onSettled?.();
    }
  }, [mutationFunction, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
    isLoading: state.loading,
    hasError: !!state.error,
  };
}