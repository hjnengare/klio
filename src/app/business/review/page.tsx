"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ReviewHeader from "../../components/ReviewForm/ReviewHeader";
import ReviewForm from "../../components/ReviewForm/ReviewForm";
import ReviewSidebar from "../../components/ReviewForm/ReviewSidebar";
import ReviewStyles from "../../components/ReviewForm/ReviewStyles";
import { useReviewForm } from "../../hooks/useReviewForm";
import PageLoad from "../../components/Animations/PageLoad";

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
  const {
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
  } = useReviewForm();

  // Mock data for design work
  const businessName = "Sample Business";
  const businessImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=1200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&h=1200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1600&h=1200&fit=crop&auto=format",
  ];
  const businessRating = 4.5;
  const quickTags = ["Trustworthy", "On Time", "Friendly", "Good Value"];

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

        <PageLoad variant="fade">
          <ReviewHeader />
        </PageLoad>

        {/* ---------------- Main content ---------------- */}
        <div className="relative z-10 bg-off-white pt-20">
          <div className="w-full max-w-7xl mx-auto px-0 md:px-4 py-4 md:py-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* MAIN: Form */}
              <PageLoad variant="slide" delay={1} className="lg:col-span-8 py-4">
                <ReviewForm
                  businessName={businessName}
                  businessRating={businessRating}
                  businessImages={businessImages}
                  overallRating={overallRating}
                  selectedTags={selectedTags}
                  reviewText={reviewText}
                  reviewTitle={reviewTitle}
                  selectedImages={selectedImages}
                  isFormValid={isFormValid}
                  availableTags={quickTags}
                  onRatingChange={handleStarClick}
                  onTagToggle={handleTagToggle}
                  onTitleChange={setReviewTitle}
                  onTextChange={setReviewText}
                  onImagesChange={setSelectedImages}
                  onSubmit={handleSubmitReview}
                />
              </PageLoad>

              {/* ------------ SIDEBAR ------------ */}
              <PageLoad variant="slide" delay={2} className="lg:col-span-4">
                <aside>
                  <ReviewSidebar otherReviews={otherReviews} />
                </aside>
              </PageLoad>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
