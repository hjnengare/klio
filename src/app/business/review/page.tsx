"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Star,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Tags,
  Pencil,
  Edit3,
  Camera,
  ArrowRight,
  Heart,
  Calendar,
  MapPin,
} from "lucide-react";

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

// ---------------- Frosty helpers + typography ----------------
const frostyHeader =
  `
  fixed top-0 left-0 right-0 z-50
  backdrop-blur-xl supports-[backdrop-filter]:bg-transparent
  relative
  before:content-[''] before:absolute before:inset-0 before:pointer-events-none
  before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.76),rgba(255,255,255,0.58))]
`.replace(/\s+/g, " ");

const frostyPanel =
  `
  relative overflow-hidden rounded-2xl
  border border-black/5
  backdrop-blur-xl supports-[backdrop-filter]:bg-transparent
  before:content-[''] before:absolute before:inset-0 before:pointer-events-none
  before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.62))]
`.replace(/\s+/g, " ");

// Mobile-first CSS with proper typography scale and safe areas
const styles = `
  .text-body { font-size: 1rem; line-height: 1.5; }
  .text-body-lg { font-size: 1.125rem; line-height: 1.5; }
  .text-heading-sm { font-size: 1.25rem; line-height: 1.4; }
  .text-heading-md { font-size: 1.5rem; line-height: 1.3; }
  .text-heading-lg { font-size: 1.875rem; line-height: 1.2; }

  .btn-press:active { transform: scale(0.98); transition: transform 0.1s ease; }
  .btn-target { min-height: 44px; min-width: 44px; touch-action: manipulation; }
  .input-mobile { font-size: 1rem !important; min-height: 48px; touch-action: manipulation; }

  .card-mobile { border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
  @media (min-width: 768px) {
    .card-mobile { border: 1px solid rgba(116, 145, 118, 0.1); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); }
  }
`;

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
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? businessImages.length - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === businessImages.length - 1 ? 0 : prev + 1));
  };
  const handleDotClick = (index: number) => setCurrentImageIndex(index);

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNextImage();
    if (isRightSwipe) handlePrevImage();
  };

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
        .font-sf {
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
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="min-h-dvh bg-off-white relative overflow-hidden font-sf">
        {/* Subtle background tint */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.02]" />
        </div>

        {/* Floating elements (unchanged) */}
        <FloatingElements />

        {/* ---------------- Header (FROSTY) ---------------- */}
        <header className={frostyHeader + "px-4 py-4 shadow-md"}>
          <div className="flex items-center max-w-7xl mx-auto">
            <Link href="/home" className="group flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 z-10 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-3 md:mr-4">
                <ArrowLeft className="text-charcoal/70 group-hover:text-sage transition-colors duration-300" size={22} />
              </div>
              <h1 className="text-base md:text-xl font-700 text-transparent z-10 bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage">
                Write a Review
              </h1>
            </Link>
          </div>
        </header>

        {/* ---------------- Main content ---------------- */}
        <div className="relative z-10 bg-off-white pt-24">
          <div className="w-full max-w-7xl mx-auto px-0 md:px-4 py-4 md:py-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* MAIN: Form */}
              <div className="lg:col-span-8">
                <div className="bg-off-white border md:border border-sage/10 rounded-2xl p-0 md:p-8 mb-0 md:mb-8 relative overflow-hidden flex flex-col shadow-lg">
                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Business Header */}
                    <div className="mb-4 md:mb-6 text-center px-4">
                      <h2 className="text-xl md:text-3xl font-700 text-charcoal mb-2">{businessName}</h2>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex items-center space-x-1 bg-gradient-to-br from-amber-400 to-amber-600 px-3 py-1.5 rounded-full">
                          <Star size={14} className="text-white" style={{ fill: "currentColor" }} />
                          <span className="text-sm md:text-base font-700 text-white">
                            {businessRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Images Carousel */}
                    <div className="mb-6 md:mb-8 -mx-4 md:-mx-8 relative">
                      <div
                        className="relative overflow-hidden rounded-none md:rounded-2xl"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                      >
                        <div
                          className="flex transition-transform duration-500 ease-out"
                          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                          {businessImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="w-full flex-shrink-0 aspect-[4/3] md:aspect-[16/9] bg-sage/10 relative"
                            >
                              <Image
                                src={img}
                                alt={`${businessName} photo ${idx + 1}`}
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1100px"
                                quality={90}
                                priority={idx === 0}
                                onError={() => setImageError((prev) => ({ ...prev, [idx]: true }))}
                              />
                              {imageError[idx] && (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-sage/5">
                                  <ImageIcon size={64} className="text-sage" />
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
                          <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={22} />
                        </button>

                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal/70 hover:bg-charcoal/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                          aria-label="Next image"
                        >
                          <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={22} />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-3 md:top-4 right-3 md:right-4 px-3 py-1.5 rounded-full bg-charcoal/70 backdrop-blur-sm z-10">
                          <span className="text-xs md:text-sm font-500 text-white">
                            {currentImageIndex + 1} / {businessImages.length}
                          </span>
                        </div>
                      </div>

                      {/* Dots */}
                      <div className="flex items-center justify-center space-x-2 mt-4 px-4">
                        {businessImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            className={`transition-all duration-300 ${idx === currentImageIndex
                                ? "w-8 h-2 bg-sage rounded-full"
                                : "w-2 h-2 bg-sage/30 rounded-full hover:bg-sage/50"
                              }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Overall Rating */}
                    <div className="mb-6 md:mb-8 px-4">
                      <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
                        Overall rating
                      </h3>
                      <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= overallRating;
                          return (
                            <button
                              key={star}
                              onClick={() => handleStarClick(star)}
                              className="p-1 md:p-2 focus:outline-none transition-all duration-300 rounded-full hover:bg-amber-50"
                              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                            >
                              <Star
                                size={32}
                                className={active ? "text-amber-500" : "text-gray-400"}
                                style={{ fill: active ? "currentColor" : "none" }}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-center text-sm font-400 text-charcoal/60">Tap to select rating</p>
                    </div>

                    {/* Quick Tags */}
                    <div className="mb-6 md:mb-8 px-4">
                      <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
                        Choose up to 4 quick tags
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {["Trustworthy", "On Time", "Friendly", "Good Value"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`
                              px-4 md:px-6 py-3 md:py-4 rounded-full border-2 transition-all duration-300 text-sm font-600 btn-target
                              ${selectedTags.includes(tag)
                                ? "bg-sage border-sage text-white shadow-lg"
                                : "bg-off-white backdrop-blur-sm border-sage/20 text-charcoal hover:border-sage hover:bg-sage/10"
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
                      <h3 className="text-base md:text-lg font-600 text-charcoal mb-3 text-center md:text-left">
                        Review Title (Optional)
                      </h3>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Summarize your experience in a few words..."
                        className="w-full bg-off-white backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 text-body md:text-lg font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 input-mobile"
                      />
                    </div>

                    {/* Review Text */}
                    <div className="mb-6 md:mb-8 px-4">
                      <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
                        Tell us about your experience
                      </h3>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts and help other locals..."
                        rows={4}
                        className="w-full bg-off-white backdrop-blur-sm border border-sage/20 rounded-6 px-4 md:px-6 py-3 md:py-4 text-body md:text-xl font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 resize-none flex-1 min-h-[120px] md:min-h-0 input-mobile"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-6 md:mb-8 px-4">
                      <h3 className="text-base md:text-xl font-600 text-charcoal mb-3 md:mb-4 text-center md:text-left">
                        Add Photos (Optional)
                      </h3>
                      <ImageUpload onImagesChange={setSelectedImages} maxImages={5} disabled={false} />
                    </div>

                    {/* Submit Button */}
                    <div className="px-4">
                      <button
                        onClick={handleSubmitReview}
                        className={`w-full py-4 px-6 rounded-lg text-base md:text-lg font-600 transition-all duration-300 relative overflow-hidden btn-target btn-press ${isFormValid
                            ? "bg-gradient-to-r from-sage to-sage/90 text-white focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2 group hover:shadow-1"
                            : "bg-charcoal/20 text-charcoal/40 cursor-not-allowed"
                          }`}
                        disabled={!isFormValid}
                      >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          <span>Submit Review</span>
                          {isFormValid && <ArrowRight size={18} />}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------ SIDEBAR ------------ */}
              <aside className="lg:col-span-4">
                {/* Desktop: FIXED frosty panel */}
                <div className={`hidden lg:block lg:fixed right-[max(1rem,calc((100vw-80rem)/2))] top-24 w-[360px] max-h-[calc(100vh-7rem)] overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent`}>
                  <div className={frostyPanel}>
                    <div className="relative z-[1]">
                      <h3 className="text-lg font-700 text-charcoal px-3 pt-3 pb-2 sticky top-0">
                        What others are saying
                      </h3>
                      <div className="px-3 pb-3 space-y-3">
                        {otherReviews.map((r) => (
                          <div key={r.id} className="rounded-xl border border-black/5 p-3 bg-off-white/70">
                            <div className="flex gap-3">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-sage/10">
                                {r.user.avatar ? (
                                  <Image
                                    src={r.user.avatar}
                                    alt={`${r.user.name} avatar`}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                    quality={85}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sage">•</div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-700 text-charcoal truncate">{r.user.name}</p>
                                  <div className="flex items-center gap-1">
                                    <Star size={14} className="text-amber-500" style={{ fill: "currentColor" }} />
                                    <span className="text-xs text-charcoal/70">{r.rating}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-charcoal/50 mt-0.5">
                                  {r.user.location && (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin size={12} />
                                      {r.user.location}
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar size={12} />
                                    {r.date}
                                  </span>
                                </div>
                                <p className="text-sm text-charcoal/80 mt-2 line-clamp-3">{r.text}</p>
                                {r.image && (
                                  <div className="relative mt-3 w-full h-24 rounded-md overflow-hidden">
                                    <Image
                                      src={r.image}
                                      alt={`${r.business} photo`}
                                      fill
                                      className="object-cover"
                                      sizes="360px"
                                      quality={85}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-charcoal/60 mt-3">
                                  <Heart size={14} />
                                  <span className="text-xs">{r.likes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet horizontal list */}
                <div className="lg:hidden mt-6">
                  <h3 className="text-base font-700 text-charcoal px-4">What others are saying</h3>
                  <div className="mt-3 overflow-x-auto hide-scrollbar">
                    <ul className="flex gap-3 px-4 pb-2">
                      {otherReviews.map((r) => (
                        <li key={r.id} className="min-w-[260px] max-w-[280px] bg-off-white border border-sage/10 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-sage/10">
                              {r.user.avatar ? (
                                <Image
                                  src={r.user.avatar}
                                  alt={`${r.user.name} avatar`}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  quality={85}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sage">•</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-700 text-charcoal truncate">{r.user.name}</p>
                              <div className="flex items-center gap-1 text-xs text-charcoal/60">
                                <Star size={12} className="text-amber-500" style={{ fill: "currentColor" }} />
                                <span>{r.rating}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-charcoal/80 mt-2 line-clamp-3">{r.text}</p>

                          {r.image && (
                            <div className="relative mt-3 w-full h-24 rounded-md overflow-hidden">
                              <Image
                                src={r.image}
                                alt={`${r.business} photo`}
                                fill
                                className="object-cover"
                                sizes="260px"
                                quality={85}
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-charcoal/60 mt-3">
                            <Heart size={14} />
                            <span className="text-xs">{r.likes}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
