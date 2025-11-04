"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (key: string, loading: boolean) => void;
  registerLoadingKey: (key: string) => void;
  unregisterLoadingKey: (key: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingKeys((prev) => {
      // Only update if the state actually needs to change
      const hasKey = prev.has(key);
      if (loading === hasKey) {
        // State is already correct, return previous to avoid re-render
        return prev;
      }
      
      const next = new Set(prev);
      if (loading) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }, []);

  const registerLoadingKey = useCallback((key: string) => {
    setLoadingKeys((prev) => new Set(prev).add(key));
  }, []);

  const unregisterLoadingKey = useCallback((key: string) => {
    setLoadingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isLoading = loadingKeys.size > 0;

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        registerLoadingKey,
        unregisterLoadingKey,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

