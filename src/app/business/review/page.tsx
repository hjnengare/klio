"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ReviewHeader from "../../components/ReviewForm/ReviewHeader";
import BusinessInfo from "../../components/ReviewForm/BusinessInfo";
import BusinessCarousel from "../../components/ReviewForm/BusinessCarousel";
import RatingSelector from "../../components/ReviewForm/RatingSelector";
import TagSelector from "../../components/ReviewForm/TagSelector";
import ReviewTextForm from "../../components/ReviewForm/ReviewTextForm";
import ReviewSubmitButton from "../../components/ReviewForm/ReviewSubmitButton";
import ReviewSidebar from "../../components/ReviewForm/ReviewSidebar";
import ReviewStyles from "../../components/ReviewForm/ReviewStyles";

const ImageUpload = dynamic(() => import("../../components/ReviewForm/ImageUpload"), {
  ssr: false,
});

const FloatingElements = dynamic(() => import("../../components/Animations/FloatingElements"), {
  ssr: false,
});

const Footer = dynamic(() => import("../../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});


type SmallReview = {
  id: string;
  user: { name: string; avatar?: string; location?: string };
  business: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
  image?: string;
};

export default function WriteReviewPage() {
  const router = useRouter();

  // Mock data for design work
  const businessName = "Sample Business";
  const businessImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=1200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&h=1200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1600&h=1200&fit=crop&auto=format",
  ];
  const businessRating = 4.5;

  const [overallRating, setOverallRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const otherReviews: SmallReview[] = [
    {
      id: "r1",
      user: {
        name: "Naledi M.",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format",
        location: "Cape Town",
      },
      business: "Bean & Bloom Café",
      rating: 5,
      text: "Latte art on point and the staff are super friendly. Cozy vibe!",
      date: "Sep 18, 2025",
      likes: 23,
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop&auto=format",
    },
    {
      id: "r2",
      user: {
        name: "Alex J.",
        avatar:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&auto=format",
        location: "Sea Point",
      },
      business: "The Pot Luck Club",
      rating: 4,
      text: "Creative small plates and gorgeous views. A little noisy at peak.",
      date: "Sep 10, 2025",
      likes: 11,
    },
    {
      id: "r3",
      user: {
        name: "Sibusiso K.",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format",
        location: "Green Point",
      },
      business: "Chapman's Peak Drive",
      rating: 5,
      text: "Sunset drive is unbeatable. Pack a picnic!",
      date: "Aug 30, 2025",
      likes: 42,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop&auto=format",
    },
  ];


  const quickTags = ["Trustworthy", "On Time", "Friendly", "Good Value"];
  const handleTagToggle = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  const handleStarClick = (rating: number) => setOverallRating(rating);

  const handleSubmitReview = async () => {
    console.log("Review submitted:", {
      rating: overallRating,
      title: reviewTitle,
      content: reviewText,
      tags: selectedTags,
      images: selectedImages,
    });
    alert("Review submitted! (UI/UX Demo Mode)");
    router.push("/home");
  };

  const isFormValid = overallRating > 0 && reviewText.trim().length > 0;

  return (
    <>
      {/* SF Pro + utilities */}
      <style jsx global>{`
        .font-urbanist {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", "Helvetica Neue", Helvetica, Arial, system-ui,
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        html, body {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", system-ui, sans-serif;
        }
      `}</style>
      <ReviewStyles />

      <div className="min-h-dvh bg-off-white relative overflow-hidden font-urbanist">
        {/* Subtle background tint */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.02]" />
        </div>

        {/* Floating elements (unchanged) */}
        <FloatingElements />

        <ReviewHeader />

        {/* ---------------- Main content ---------------- */}
        <div className="relative z-10 bg-off-white pt-20">
          <div className="w-full max-w-7xl mx-auto px-0 md:px-4 py-4 md:py-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* MAIN: Form */}
              <div className="lg:col-span-8">
                <div className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 ring-1 ring-white/20 rounded-lg p-0 md:p-8 mb-0 md:mb-8 relative overflow-hidden flex flex-col shadow-lg shadow-sage/20">
                  {/* subtle glows */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-lg" />
                  <div className="relative z-10 flex-1 flex flex-col">
                    <BusinessInfo businessName={businessName} businessRating={businessRating} />
                    <BusinessCarousel businessName={businessName} businessImages={businessImages} />
                    <RatingSelector overallRating={overallRating} onRatingChange={handleStarClick} />
                    <TagSelector 
                      selectedTags={selectedTags} 
                      onTagToggle={handleTagToggle} 
                      availableTags={quickTags}
                    />
                    <ReviewTextForm 
                      reviewTitle={reviewTitle}
                      reviewText={reviewText}
                      onTitleChange={setReviewTitle}
                      onTextChange={setReviewText}
                    />

                    {/* Image Upload */}
                    <div className="mb-6 md:mb-8 px-4">
                      <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
                        Add Photos (Optional)
                      </h3>
                      <ImageUpload onImagesChange={setSelectedImages} maxImages={5} disabled={false} />
                    </div>

                    <ReviewSubmitButton isFormValid={isFormValid} onSubmit={handleSubmitReview} />
                  </div>
                </div>
              </div>

              {/* ------------ SIDEBAR ------------ */}
              <aside className="lg:col-span-4">
                <ReviewSidebar otherReviews={otherReviews} />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
