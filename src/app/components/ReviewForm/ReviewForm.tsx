"use client";

import BusinessInfo from "./BusinessInfo";
import BusinessCarousel from "./BusinessCarousel";
import RatingSelector from "./RatingSelector";
import TagSelector from "./TagSelector";
import ReviewTextForm from "./ReviewTextForm";
import ReviewSubmitButton from "./ReviewSubmitButton";
import dynamic from "next/dynamic";

const ImageUpload = dynamic(() => import("./ImageUpload"), {
  ssr: false,
});

interface ReviewFormProps {
  businessName: string;
  businessRating: number;
  businessImages: string[];
  overallRating: number;
  selectedTags: string[];
  reviewText: string;
  reviewTitle: string;
  selectedImages: File[];
  isFormValid: boolean;
  availableTags: string[];
  onRatingChange: (rating: number) => void;
  onTagToggle: (tag: string) => void;
  onTitleChange: (title: string) => void;
  onTextChange: (text: string) => void;
  onImagesChange: (images: File[]) => void;
  onSubmit: () => void;
}

export default function ReviewForm({
  businessName,
  businessRating,
  businessImages,
  overallRating,
  selectedTags,
  reviewText,
  reviewTitle,
  selectedImages,
  isFormValid,
  availableTags,
  onRatingChange,
  onTagToggle,
  onTitleChange,
  onTextChange,
  onImagesChange,
  onSubmit,
}: ReviewFormProps) {
  return (
    <div className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 ring-1 ring-white/20 rounded-lg p-0 md:p-8 mb-0 md:mb-8 relative overflow-hidden flex flex-col shadow-lg shadow-sage/20">
      {/* Subtle glows */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-lg" />

      <div className="relative z-10 flex-1 flex flex-col">
        <BusinessInfo businessName={businessName} businessRating={businessRating} />
        <BusinessCarousel businessName={businessName} businessImages={businessImages} />
        <RatingSelector overallRating={overallRating} onRatingChange={onRatingChange} />
        <TagSelector
          selectedTags={selectedTags}
          onTagToggle={onTagToggle}
          availableTags={availableTags}
        />
        <ReviewTextForm
          reviewTitle={reviewTitle}
          reviewText={reviewText}
          onTitleChange={onTitleChange}
          onTextChange={onTextChange}
        />

        {/* Image Upload */}
        <div className="mb-3 px-4">
          <h3 className="text-sm font-bold text-charcoal mb-3 text-center md:text-left">
            Add Photos (Optional)
          </h3>
          <ImageUpload onImagesChange={onImagesChange} maxImages={5} disabled={false} />
        </div>

        <ReviewSubmitButton isFormValid={isFormValid} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
