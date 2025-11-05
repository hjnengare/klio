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
    <div className="bg-gradient-to-br bg-off-white backdrop-blur-md border border-sage/10 rounded-2xl p-0 md:p-8 mb-0 md:mb-8 relative overflow-hidden flex flex-col shadow-lg py-4 md:py-6 border border-white/30">
      {/* Subtle glows - similar to review cards */}
      <span className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-sage/10 blur-lg" />
      <span className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-coral/10 blur-lg" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="hidden md:block">
          <BusinessInfo businessName={businessName} businessRating={businessRating} />
          <BusinessCarousel businessName={businessName} businessImages={businessImages} />
        </div>
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
