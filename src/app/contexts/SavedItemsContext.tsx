"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

interface SavedItemsContextType {
  savedItems: string[];
  savedCount: number;
  addSavedItem: (itemId: string) => void;
  removeSavedItem: (itemId: string) => void;
  isItemSaved: (itemId: string) => boolean;
  toggleSavedItem: (itemId: string) => void;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

interface SavedItemsProviderProps {
  children: ReactNode;
}

export function SavedItemsProvider({ children }: SavedItemsProviderProps) {
  // Dummy saved items for testing
  const DUMMY_SAVED_ITEMS = [
    "550e8400-e29b-41d4-a716-446655440001", // The Green Table
    "550e8400-e29b-41d4-a716-446655440002", // Artisan Coffee Co.
    "550e8400-e29b-41d4-a716-446655440003", // Bloom Yoga Studio
    "550e8400-e29b-41d4-a716-446655440005", // Sunset Ceramics
    "550e8400-e29b-41d4-a716-446655440006", // Morning Glory Bakery
  ];

  const [savedItems, setSavedItems] = useState<string[]>([]);
  const { user } = useAuth();

  // Load saved items from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedItems");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedItems(parsed);
        } catch (error) {
          console.error("Error parsing saved items:", error);
          setSavedItems(DUMMY_SAVED_ITEMS);
        }
      } else {
        // If no saved items in localStorage, use dummy data
        setSavedItems(DUMMY_SAVED_ITEMS);
      }
    }
  }, []);

  // Save to localStorage whenever savedItems changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedItems", JSON.stringify(savedItems));
    }
  }, [savedItems]);

  const addSavedItem = useCallback((itemId: string) => {
    setSavedItems(prev => {
      if (!prev.includes(itemId)) {
        return [...prev, itemId];
      }
      return prev;
    });
  }, []);

  const removeSavedItem = useCallback((itemId: string) => {
    setSavedItems(prev => prev.filter(id => id !== itemId));
  }, []);

  const isItemSaved = useCallback((itemId: string) => {
    return savedItems.includes(itemId);
  }, [savedItems]);

  const toggleSavedItem = useCallback((itemId: string) => {
    if (isItemSaved(itemId)) {
      removeSavedItem(itemId);
    } else {
      addSavedItem(itemId);
    }
  }, [isItemSaved, removeSavedItem, addSavedItem]);

  const savedCount = useMemo(() => savedItems.length, [savedItems]);

  const value: SavedItemsContextType = useMemo(() => ({
    savedItems,
    savedCount,
    addSavedItem,
    removeSavedItem,
    isItemSaved,
    toggleSavedItem,
  }), [savedItems, savedCount, addSavedItem, removeSavedItem, isItemSaved, toggleSavedItem]);

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error("useSavedItems must be used within a SavedItemsProvider");
  }
  return context;
}
