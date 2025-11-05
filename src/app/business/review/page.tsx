"use client";

import { useRouter } from "next/navigation";
import { Star } from "react-feather";
import ReviewHeader from "../../components/ReviewForm/ReviewHeader";
import ReviewForm from "../../components/ReviewForm/ReviewForm";
import ReviewSidebar from "../../components/ReviewForm/ReviewSidebar";
import BusinessCarousel from "../../components/ReviewForm/BusinessCarousel";
import ReviewStyles from "../../components/ReviewForm/ReviewStyles";
import Footer from "../../components/Footer/Footer";
import { useReviewForm } from "../../hooks/useReviewForm";


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
  const businessInfo = {
    name: businessName,
    phone: "+44 20 1234 5678",
    website: "www.example.com",
    address: "123 Main Street, Cape Town, South Africa",
    email: "info@example.com",
    category: "Restaurant",
    location: "Cape Town",
  };
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
      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromTop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-slide-in-top {
          animation: slideInFromTop 0.5s ease-out forwards;
        }
        
        .animate-delay-100 { animation-delay: 0.1s; opacity: 0; }
        .animate-delay-200 { animation-delay: 0.2s; opacity: 0; }
        .animate-delay-300 { animation-delay: 0.3s; opacity: 0; }
      `}} />
      
      {/* SF Pro Font Setup */}
      <style jsx global>{`
        .font-urbanist {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", "Helvetica Neue", Helvetica, Arial, system-ui,
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }
      `}</style>
      <ReviewStyles />

      <div
        className="min-h-dvh bg-off-white relative overflow-hidden font-urbanist"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        <ReviewHeader businessInfo={businessInfo} />

        <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
          <div className="py-1 pt-20">
            <main className="relative font-sf-pro pt-4 sm:pt-6" id="main-content" role="main" aria-label="Write review content">
              <div className="container mx-auto max-w-[1300px] px-3 sm:px-4 md:px-6 relative z-10">
                <div className="pt-2 pb-12 sm:pb-16 md:pb-20">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* MAIN: Form */}
                      <div className="lg:col-span-8 animate-fade-in-up">
                        {/* Business Info and Carousel - visible on mobile only */}
                        <div className="md:hidden space-y-4 mb-6">
                          <div className="text-center px-4">
                            <h2 className="text-sm font-bold text-charcoal mb-2">{businessName}</h2>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="flex items-center space-x-1 bg-gradient-to-br from-amber-400 to-amber-600 px-3 py-1.5 rounded-full">
                                <Star size={16} className="text-white" style={{ fill: "currentColor" }} />
                                <span className="text-sm font-600 text-white">
                                  {businessRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <BusinessCarousel businessName={businessName} businessImages={businessImages} />
                        </div>
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
                      </div>

                      {/* SIDEBAR */}
                      <aside className="lg:col-span-4 animate-fade-in-up animate-delay-200">
                        <ReviewSidebar otherReviews={otherReviews} />
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
