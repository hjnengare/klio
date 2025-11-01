"use client";

import { useState, useMemo } from "react";

interface UseReviewFormReturn {
  overallRating: number;
  selectedTags: string[];
  reviewText: string;
  reviewTitle: string;
  selectedImages: File[];
  isFormValid: boolean;
  handleStarClick: (rating: number) => void;
  handleTagToggle: (tag: string) => void;
  setReviewText: (text: string) => void;
  setReviewTitle: (title: string) => void;
  setSelectedImages: (images: File[]) => void;
  resetForm: () => void;
}

export function useReviewForm(): UseReviewFormReturn {
  const [overallRating, setOverallRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleStarClick = (rating: number) => {
    setOverallRating(rating);
  };

  const isFormValid = useMemo(() => {
    return overallRating > 0 && reviewText.trim().length > 0;
  }, [overallRating, reviewText]);

  const resetForm = () => {
    setOverallRating(0);
    setSelectedTags([]);
    setReviewText("");
    setReviewTitle("");
    setSelectedImages([]);
  };

  return {
    overallRating,
    selectedTags,
    reviewText,
    reviewTitle,
    selectedImages,
    isFormValid,
    handleStarClick,
    handleTagToggle,
    setReviewText,
    setReviewTitle,
    setSelectedImages,
    resetForm,
  };
}
