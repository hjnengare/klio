"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
  const businessImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=400&fit=crop&auto=format"
  ];
  const businessRating = 4.5;
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [overallRating, setOverallRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? businessImages.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === businessImages.length - 1 ? 0 : prev + 1);
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNextImage();
    if (isRightSwipe) handlePrevImage();
  };

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
      <div className="min-h-dvh  bg-white   relative overflow-hidden">
        {/* Static background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-coral/5" />
        </div>

        {/* Floating elements */}
        <FloatingElements />

        {/* Header - matches explore page pattern */}
        <header className="fixed top-0 left-0 right-0 z-50  bg-white  /90 backdrop-blur-md border-b border-sage/10 px-4 py-4">
          <div className="flex items-center max-w-7xl mx-auto">
            <Link href="/home" className="group flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-3 md:mr-4">
                <ion-icon name="arrow-back" class="text-lg md:text-xl text-charcoal/70 group-hover:text-sage transition-colors duration-300" />
              </div>
              <h1 className="font-urbanist text-base md:text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative">
                Write a Review
              </h1>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <div className="relative z-10  bg-white   pt-16 md:pt-20">
          <div className="w-full max-w-4xl mx-auto px-0 md:px-4 py-4 md:py-6 relative z-10">
        {/* Review Form */}
        <div className=" bg-white   backdrop-blur-lg border-0 md:border border-sage/10 rounded-none md:rounded-lg p-0 md:p-8 mb-0 md:mb-8 relative overflow-hidden flex flex-col">
          <div className="relative z-10 flex-1 flex flex-col">
                {/* Business Header */}
                <div className="mb-4 md:mb-6 text-center px-4">
                  <h2 className="font-urbanist text-xl md:text-3xl font-700 text-charcoal mb-2">
                    {businessName}
                  </h2>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center space-x-1 bg-gradient-to-br from-amber-400 to-amber-600 px-3 py-1.5 rounded-full">
                      <ion-icon name="star" style={{ color: 'white', fontSize: '14px' }} />
                      <span className="font-urbanist text-sm md:text-base font-700 text-white">
                        {businessRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Images Carousel */}
                <div className="mb-6 md:mb-8 -mx-4 md:-mx-8 relative">
                  <div
                    className="relative overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    {/* Images Container */}
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    >
                      {businessImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-full flex-shrink-0 aspect-[4/3] md:aspect-[16/9] bg-sage/10"
                        >
                          {!imageError[idx] ? (
                            <Image
                              src={img}
                              alt={`${businessName} photo ${idx + 1}`}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover"
                              onError={() => setImageError(prev => ({ ...prev, [idx]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ion-icon name="image-outline" style={{ fontSize: '64px', color: 'var(--sage)' }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal/70 hover:bg-charcoal/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                      aria-label="Previous image"
                    >
                      <ion-icon name="chevron-back" class="text-xl md:text-2xl text-white group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal/70 hover:bg-charcoal/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                      aria-label="Next image"
                    >
                      <ion-icon name="chevron-forward" class="text-xl md:text-2xl text-white group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-3 md:top-4 right-3 md:right-4 px-3 py-1.5 rounded-full bg-charcoal/70 backdrop-blur-sm z-10">
                      <span className="font-urbanist text-xs md:text-sm font-500 text-white">
                        {currentImageIndex + 1} / {businessImages.length}
                      </span>
                    </div>
                  </div>

                  {/* Carousel Indicators */}
                  <div className="flex items-center justify-center space-x-2 mt-4 px-4">
                    {businessImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={`transition-all duration-300 ${
                          idx === currentImageIndex
                            ? 'w-8 h-2 bg-sage rounded-full'
                            : 'w-2 h-2 bg-sage/30 rounded-full hover:bg-sage/50'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="mb-6 md:mb-8 px-4">
                  <h3 className="font-urbanist text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="star" style={{ color: '#f59e0b', fontSize: '16px' }} />
                    </div>
                    Overall rating
                  </h3>
                  <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="p-1 md:p-2 focus:outline-none transition-all duration-300 rounded-full hover:bg-amber-50"
                      >
                        <ion-icon
                          name={star <= overallRating ? "star" : "star-outline"}
                          style={{
                            color: star <= overallRating ? "#f59e0b" : "#9ca3af",
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
                <div className="mb-6 md:mb-8 px-4">
                  <h3 className="font-urbanist text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
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
                            : ' bg-white   backdrop-blur-sm border-sage/20 text-charcoal hover:border-sage hover:bg-sage/10'
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
                <div className="mb-4 md:mb-6 px-4">
                  <h3 className="font-urbanist text-base md:text-lg font-600 text-charcoal mb-3 flex items-center justify-center md:justify-start">
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
                    className="w-full  bg-white   backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 font-urbanist text-body md:text-lg font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 input-mobile"
                  />
                </div>

                {/* Review Text */}
                <div className="mb-6 md:mb-8 px-4">
                  <h3 className="font-urbanist text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
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
                    className="w-full  bg-white   backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 font-urbanist text-body md:text-xl font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 resize-none flex-1 min-h-[120px] md:min-h-0 input-mobile"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-6 md:mb-8 px-4">
                  <h3 className="font-urbanist text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
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
                <div className="px-4">
                <button
                  onClick={handleSubmitReview}
                  className={`
                    w-full py-4 px-6 rounded-lg font-urbanist text-base md:text-lg font-600 transition-all duration-300 relative overflow-hidden btn-target btn-press
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
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}
