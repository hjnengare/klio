"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const { user } = useAuth();

  // Load saved items from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedItems");
      if (saved) {
        try {
          setSavedItems(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing saved items:", error);
          setSavedItems([]);
        }
      }
    }
  }, []);

  // Save to localStorage whenever savedItems changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedItems", JSON.stringify(savedItems));
    }
  }, [savedItems]);

  const addSavedItem = (itemId: string) => {
    setSavedItems(prev => {
      if (!prev.includes(itemId)) {
        return [...prev, itemId];
      }
      return prev;
    });
  };

  const removeSavedItem = (itemId: string) => {
    setSavedItems(prev => prev.filter(id => id !== itemId));
  };

  const isItemSaved = (itemId: string) => {
    return savedItems.includes(itemId);
  };

  const toggleSavedItem = (itemId: string) => {
    if (isItemSaved(itemId)) {
      removeSavedItem(itemId);
    } else {
      addSavedItem(itemId);
    }
  };

  const savedCount = savedItems.length;

  const value: SavedItemsContextType = {
    savedItems,
    savedCount,
    addSavedItem,
    removeSavedItem,
    isItemSaved,
    toggleSavedItem,
  };

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
