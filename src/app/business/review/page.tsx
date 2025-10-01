"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

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

// Mobile-first CSS with proper typography scale and safe areas
const styles = `
  /* Mobile-first typography scale - Body text ≥ 16px */
  .text-body { font-size: 1rem; line-height: 1.5; } /* 16px */
  .text-body-lg { font-size: 1.125rem; line-height: 1.5; } /* 18px */
  .text-heading-sm { font-size: 1.25rem; line-height: 1.4; } /* 20px */
  .text-heading-md { font-size: 1.5rem; line-height: 1.3; } /* 24px */
  .text-heading-lg { font-size: 1.875rem; line-height: 1.2; } /* 30px */

  /* Button press states - 44-48px targets */
  .btn-press:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .btn-target {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }

  /* Input styling - 16px+ to prevent auto-zoom */
  .input-mobile {
    font-size: 1rem !important; /* 16px minimum */
    min-height: 48px;
    touch-action: manipulation;
  }

  /* Card styling - border-first, tiny shadow (no heavy blur) */
  .card-mobile {
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 768px) {
    .card-mobile {
      border: 1px solid rgba(116, 145, 118, 0.1);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  }
`;

export default function WriteReviewPage() {
  const router = useRouter();

  // UI/UX DEMO MODE - Mock data for design work
  const businessName = "Sample Business";
  const businessImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&auto=format";
  const businessRating = 4.5;

  const [overallRating, setOverallRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const quickTags = [
    "Trustworthy",
    "On Time",
    "Friendly",
    "Good Value"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleStarClick = (rating: number) => {
    setOverallRating(rating);
  };

  const handleSubmitReview = async () => {
    // UI/UX DEMO MODE - Just show alert
    console.log("Review submitted:", {
      rating: overallRating,
      title: reviewTitle,
      content: reviewText,
      tags: selectedTags,
      images: selectedImages
    });
    alert("Review submitted! (UI/UX Demo Mode)");
    router.push("/home");
  };

  const isFormValid = overallRating > 0 && reviewText.trim().length > 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-dvh bg-white/90 relative overflow-hidden">
        {/* Premium Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sage/10 px-4 py-6 shadow-sm">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Link href="/home" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
              <ion-icon name="arrow-back-outline" size="small"></ion-icon>
            </Link>
            <h1 className="font-urbanist text-2xl md:text-4xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal">
              Write a Review
            </h1>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Main content with background layers */}
        <div className="relative z-10 bg-white/90">
          {/* Static background layers - matches home page */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
          </div>

          {/* Floating elements */}
          <FloatingElements />

          <div className="w-full md:w-3/4 mx-auto px-4 md:px-4 py-6 pb-6 relative z-10">
        {/* Review Form */}
        <div className="bg-white/95 backdrop-blur-lg card-mobile md:shadow-xl border border-sage/5 rounded-6 p-4 md:p-8 mb-0 md:mb-8 relative overflow-hidden min-h-[calc(100vh-200px)] md:min-h-0 flex flex-col">
          <div className="relative z-10 flex-1 flex flex-col">
                {/* Business Profile Picture */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative group">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-sage/20 group-hover:ring-sage/40 transition-all duration-500">
                      <Image
                        src={businessImage}
                        alt={`${businessName} photo`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        priority
                      />
                    </div>

                    {/* Rating badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-2 shadow-lg">
                      <div className="flex items-center space-x-1">
                        <ion-icon name="star" style={{ color: 'white', fontSize: '12px' }} />
                        <span className="font-urbanist text-xs font-700 text-white">
                          {businessRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="font-urbanist text-heading-md md:text-5xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-6 md:mb-8 text-center">
                  Write a Review for {businessName}
                </h2>

                {/* Overall Rating */}
                <div className="mb-8">
                  <h3 className="font-urbanist text-body-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="star" style={{ color: 'var(--coral)', fontSize: '16px' }} />
                    </div>
                    Overall rating
                  </h3>
                  <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="p-1 md:p-2 focus:outline-none transition-all duration-300 rounded-full hover:bg-sage/10"
                      >
                        <ion-icon
                          name={star <= overallRating ? "star" : "star-outline"}
                          style={{
                            color: star <= overallRating ? "var(--sage)" : "#9ca3af",
                            fontSize: "2rem"
                          }}
                        ></ion-icon>
                      </button>
                    ))}
                  </div>
                  <p className="text-center font-urbanist text-sm font-400 text-charcoal/60">
                    Tap to select rating
                  </p>
                </div>

                {/* Quick Tags */}
                <div className="mb-8">
                  <h3 className="font-urbanist text-body-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="pricetags-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </div>
                    Choose up to 4 quick tags
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {quickTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`
                          px-4 md:px-6 py-3 md:py-4 rounded-full border-2 transition-all duration-300 font-urbanist text-sm font-600 btn-target
                          ${selectedTags.includes(tag)
                            ? 'bg-sage border-sage text-white shadow-lg'
                            : 'bg-white/80 backdrop-blur-sm border-sage/20 text-charcoal hover:border-sage hover:bg-sage/10'
                          }
                          focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2
                        `}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <div className="mb-6">
                  <h3 className="font-urbanist text-body-lg md:text-2xl font-600 text-charcoal mb-3 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="pencil-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </div>
                    Review Title (Optional)
                  </h3>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience in a few words..."
                    className="w-full bg-white/80 backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 font-urbanist text-body md:text-lg font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 shadow-2 input-mobile"
                  />
                </div>

                {/* Review Text */}
                <div className="mb-8">
                  <h3 className="font-urbanist text-body-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="create-outline" style={{ color: 'var(--coral)', fontSize: '16px' }} />
                    </div>
                    Tell us about your experience
                  </h3>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts and help other locals..."
                    rows={4}
                    className="w-full bg-white/80 backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 font-urbanist text-body md:text-xl font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 resize-none shadow-2 flex-1 min-h-[120px] md:min-h-0 input-mobile"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-8">
                  <h3 className="font-urbanist text-body-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="camera-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </div>
                    Add Photos (Optional)
                  </h3>
                  <ImageUpload
                    onImagesChange={setSelectedImages}
                    maxImages={5}
                    disabled={false}
                  />
                </div>


                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  className={`
                    w-full py-4 md:py-5 px-6 md:px-8 rounded-6 font-urbanist text-body md:text-2xl font-600 transition-all duration-300 relative overflow-hidden btn-target btn-press
                    ${isFormValid
                      ? 'bg-gradient-to-r from-sage to-sage/90 text-white focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2 group hover:shadow-1'
                      : 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
                    }
                  `}
                  disabled={!isFormValid}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Submit Review</span>
                    {isFormValid && (
                      <ion-icon name="arrow-forward-outline" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}
