"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useBusiness } from "../../../hooks/useBusinesses";
import { useReviewSubmission } from "../../../hooks/useReviews";
import { useAuth } from "../../../contexts/AuthContext";

const ImageUpload = dynamic(() => import("../../../components/ReviewForm/ImageUpload"), {
  ssr: false,
});

const FloatingElements = dynamic(() => import("../../../components/Animations/FloatingElements"), {
  ssr: false,
});

// Constants
const MIN_REVIEW_LENGTH = 10;
const MAX_REVIEW_LENGTH = 1000;
const MAX_TAGS = 4;
const DRAFT_STORAGE_KEY = "review_draft_";

export default function WriteReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { business, loading: businessLoading } = useBusiness(undefined, params?.id as string);
  const { submitting, submitReview } = useReviewSubmission();

  const [overallRating, setOverallRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDraftNotification, setShowDraftNotification] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const draftKey = params?.id ? `${DRAFT_STORAGE_KEY}${params.id}` : null;

  // Load draft on mount
  useEffect(() => {
    if (draftKey && typeof window !== 'undefined') {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setOverallRating(parsed.rating || 0);
          setSelectedTags(parsed.tags || []);
          setReviewText(parsed.content || '');
          setReviewTitle(parsed.title || '');
          setShowDraftNotification(true);
          setTimeout(() => setShowDraftNotification(false), 5000);
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, [draftKey]);

  // Save draft to localStorage
  useEffect(() => {
    if (hasUnsavedChanges && draftKey && typeof window !== 'undefined') {
      const draft = {
        rating: overallRating,
        tags: selectedTags,
        content: reviewText,
        title: reviewTitle,
        timestamp: Date.now()
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [overallRating, selectedTags, reviewText, reviewTitle, hasUnsavedChanges, draftKey]);

  // Track unsaved changes
  useEffect(() => {
    if (overallRating > 0 || reviewText || reviewTitle || selectedTags.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [overallRating, reviewText, reviewTitle, selectedTags]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isSubmitting]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, authLoading, router]);

  if (authLoading || businessLoading) {
    return (
      <div className="min-h-dvh bg-off-white  flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-dvh bg-off-white  flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-coral/5" />
        </div>

        <div className="text-center px-4 relative z-10 max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center">
              <ion-icon name="business-outline" style={{ fontSize: '48px', color: 'var(--sage)' }} />
            </div>
          </div>

          <h1 className="font-urbanist text-2xl md:text-3xl font-700 text-charcoal mb-3">
            Business Not Found
          </h1>

          <p className="font-urbanist text-base text-charcoal/60 mb-6">
            {params?.id
              ? "We couldn't find a business with this ID. It may have been removed or doesn't exist."
              : "No business ID was provided."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/home"
              className="inline-flex items-center justify-center space-x-2 bg-sage text-white font-urbanist text-base font-600 py-3 px-6 transition-all hover:bg-sage/90 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2"
            >
              <ion-icon name="home-outline" />
              <span>Go to Home</span>
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center space-x-2 bg-white border border-sage/20 text-charcoal font-urbanist text-base font-600 py-3 px-6 transition-all hover:border-sage hover:bg-sage/5 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2"
            >
              <ion-icon name="arrow-back-outline" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const businessName = business.name;

  const quickTags = [
    "Trustworthy",
    "On Time", 
    "Friendly",
    "Good Value"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      // Enforce max tags limit
      if (prev.length >= MAX_TAGS) {
        setToast({ message: `Maximum ${MAX_TAGS} tags allowed`, type: 'error' });
        setTimeout(() => setToast(null), 3000);
        return prev;
      }
      return [...prev, tag];
    });
  };

  const handleStarClick = (rating: number) => {
    setOverallRating(rating);
    // Haptic feedback for mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStarClick(rating);
    }
  };

  const scrollToError = useCallback(() => {
    if (formRef.current) {
      const firstError = formRef.current.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstError as HTMLElement).focus();
      }
    }
  }, []);

  const handleSubmitReview = async () => {
    if (!business || !user || isSubmitting) return;

    // Validation
    if (overallRating === 0) {
      setToast({ message: 'Please select a rating', type: 'error' });
      scrollToError();
      return;
    }

    if (reviewText.trim().length < MIN_REVIEW_LENGTH) {
      setToast({ message: `Review must be at least ${MIN_REVIEW_LENGTH} characters`, type: 'error' });
      scrollToError();
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await submitReview({
        business_id: business.id,
        rating: overallRating,
        title: reviewTitle.trim() || undefined,
        content: reviewText.trim(),
        tags: selectedTags,
        images: selectedImages.length > 0 ? selectedImages : undefined
      });

      if (success) {
        // Clear draft from localStorage
        if (draftKey) {
          localStorage.removeItem(draftKey);
        }
        setHasUnsavedChanges(false);

        setToast({ message: 'Review submitted successfully!', type: 'success' });

        // Navigate after short delay to show success message
        setTimeout(() => {
          router.push(`/business/${params?.id}`);
        }, 1500);
      } else {
        setToast({ message: 'Failed to submit review. Please try again.', type: 'error' });
        setIsSubmitting(false);
      }
    } catch (error) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  const isFormValid = overallRating > 0 && reviewText.trim().length >= MIN_REVIEW_LENGTH;
  const characterCount = reviewText.length;
  const characterCountColor = characterCount > MAX_REVIEW_LENGTH ? 'text-coral' : characterCount > MAX_REVIEW_LENGTH * 0.9 ? 'text-amber-500' : 'text-charcoal/60';

  return (
    <div className="min-h-dvh bg-off-white  relative overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg backdrop-blur-xl transition-all duration-300 ${
          toast.type === 'success' ? 'bg-sage/90 text-white' : 'bg-coral/90 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <ion-icon name={toast.type === 'success' ? 'checkmark-circle' : 'alert-circle'} style={{ fontSize: '20px' }} />
            <span className="font-urbanist font-500">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Draft Notification */}
      {showDraftNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-amber-500/90 text-white rounded-full shadow-lg backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <ion-icon name="document-text" style={{ fontSize: '20px' }} />
            <span className="font-urbanist font-500">Draft restored</span>
          </div>
        </div>
      )}

      {/* Static background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-coral/5" />
      </div>

      {/* Floating elements */}
      <FloatingElements />

      {/* Header */}
      <header className="relative z-20 bg-off-white  backdrop-blur-xl border-b border-sage/10 px-4 py-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            href={`/business/${params?.id}`}
            className="text-charcoal/60 hover:text-charcoal transition-colors p-2 hover:bg-charcoal/5 rounded-full touch-target-large"
          >
            <ion-icon name="arrow-back-outline" size="small"></ion-icon>
          </Link>
          <h1 className="font-urbanist text-2xl md:text-4xl font-700 text-charcoal">
            Write a Review
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 bg-off-white ">
        <div className="pt-4 pb-3 pb-safe-area-bottom">
          <div className="w-full md:max-w-4xl mx-auto px-4 py-6">
            {/* Review Form */}
            <div ref={formRef} className="bg-white border-0 md:border border-sage/10 p-4 md:p-8 shadow-sm">
              <div className="flex-1 flex flex-col">
                {/* Business Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-sage/20 transition-all">
                      {business.image_url && !imageError ? (
                        <Image
                          src={business.image_url}
                          alt={`${businessName} photo`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          priority
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sage/20 to-sage/10 flex items-center justify-center">
                          <ion-icon name="business" style={{ fontSize: '32px', color: 'var(--sage)' }} />
                        </div>
                      )}
                    </div>

                    {/* Rating badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-2 shadow-lg">
                      <div className="flex items-center space-x-1">
                        <ion-icon name="star" style={{ color: 'white', fontSize: '12px' }} />
                        <span className="font-urbanist text-xs font-700 text-white">
                          {business.stats?.average_rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="font-urbanist text-2xl md:text-3xl font-700 text-charcoal mb-8 text-center">
                  Write a Review for {businessName}
                </h2>

                {/* Overall Rating */}
                <div className="mb-8">
                  <h3 className="font-urbanist text-lg md:text-xl font-600 text-charcoal mb-4 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-coral/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="star" style={{ color: 'var(--coral)', fontSize: '16px' }} />
                    </div>
                    Overall rating<span className="text-coral ml-1">*</span>
                  </h3>
                  <div
                    className="flex items-center justify-center space-x-2 mb-2"
                    role="radiogroup"
                    aria-label="Overall rating"
                    aria-required="true"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onKeyDown={(e) => handleKeyDown(e, star)}
                        className="p-2 focus:outline-none transition-all rounded-full hover:bg-sage/10 focus:ring-2 focus:ring-sage/50 touch-target-large"
                        role="radio"
                        aria-checked={overallRating === star}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        tabIndex={overallRating === star ? 0 : -1}
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
                  <p className="text-center font-urbanist text-sm text-charcoal/60">
                    {overallRating > 0 ? `${overallRating} star${overallRating > 1 ? 's' : ''} selected` : 'Tap to select rating'}
                  </p>
                </div>

                {/* Quick Tags */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-urbanist text-lg md:text-xl font-600 text-charcoal flex items-center">
                      <div className="w-6 h-6 bg-sage/10 rounded-full flex items-center justify-center mr-3">
                        <ion-icon name="pricetags-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                      </div>
                      Choose quick tags
                    </h3>
                    <span className={`font-urbanist text-sm font-500 ${selectedTags.length >= MAX_TAGS ? 'text-coral' : 'text-charcoal/60'}`}>
                      {selectedTags.length}/{MAX_TAGS}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Quick tags">
                    {quickTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`
                          px-6 py-3 rounded-full border-2 transition-all font-urbanist text-sm font-600 touch-target-large
                          ${selectedTags.includes(tag)
                            ? 'bg-sage border-sage text-white'
                            : 'bg-white border-sage/20 text-charcoal hover:border-sage hover:bg-sage/10'
                          }
                          ${selectedTags.length >= MAX_TAGS && !selectedTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}
                          focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2
                        `}
                        aria-pressed={selectedTags.includes(tag)}
                        aria-label={`Tag: ${tag}`}
                        disabled={selectedTags.length >= MAX_TAGS && !selectedTags.includes(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <div className="mb-6">
                  <h3 className="font-urbanist text-lg md:text-xl font-600 text-charcoal mb-3 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-sage/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="pencil-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </div>
                    Review Title (Optional)
                  </h3>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience in a few words..."
                    className="w-full bg-white border border-sage/20 px-6 py-4 font-urbanist text-base text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all disabled:bg-charcoal/5 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-label="Review title"
                  />
                </div>

                {/* Review Text */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-urbanist text-lg md:text-xl font-600 text-charcoal flex items-center">
                      <div className="w-6 h-6 bg-coral/10 rounded-full flex items-center justify-center mr-3">
                        <ion-icon name="create-outline" style={{ color: 'var(--coral)', fontSize: '16px' }} />
                      </div>
                      Tell us about your experience<span className="text-coral ml-1">*</span>
                    </h3>
                    <span className={`font-urbanist text-sm font-500 ${characterCountColor}`}>
                      {characterCount}/{MAX_REVIEW_LENGTH}
                    </span>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_REVIEW_LENGTH) {
                        setReviewText(e.target.value);
                      }
                    }}
                    placeholder="Share your thoughts and help other locals..."
                    rows={4}
                    className={`w-full bg-white border px-6 py-4 font-urbanist text-base text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition-all resize-none min-h-[120px] disabled:bg-charcoal/5 disabled:cursor-not-allowed ${
                      reviewText.length < MIN_REVIEW_LENGTH && reviewText.length > 0
                        ? 'border-amber-500'
                        : reviewText.length > MAX_REVIEW_LENGTH
                        ? 'border-coral'
                        : 'border-sage/20 focus:border-sage'
                    }`}
                    disabled={isSubmitting}
                    aria-required="true"
                    aria-invalid={reviewText.length > 0 && reviewText.length < MIN_REVIEW_LENGTH}
                    aria-describedby="review-text-hint"
                  />
                  <p id="review-text-hint" className="mt-2 text-sm text-charcoal/60 font-urbanist">
                    {reviewText.length === 0
                      ? `Minimum ${MIN_REVIEW_LENGTH} characters required`
                      : reviewText.length < MIN_REVIEW_LENGTH
                      ? `${MIN_REVIEW_LENGTH - reviewText.length} more characters needed`
                      : ''}
                  </p>
                </div>

                {/* Image Upload */}
                <div className="mb-8">
                  <h3 className="font-urbanist text-lg md:text-xl font-600 text-charcoal mb-4 flex items-center justify-center md:justify-start">
                    <div className="w-6 h-6 bg-sage/10 rounded-full flex items-center justify-center mr-3">
                      <ion-icon name="camera-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </div>
                    Add Photos (Optional)
                  </h3>
                  <ImageUpload
                    onImagesChange={setSelectedImages}
                    maxImages={5}
                    disabled={submitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  className={`
                    w-full py-4 px-8 font-urbanist text-lg font-600 transition-all touch-target-large relative overflow-hidden
                    ${isFormValid && !isSubmitting
                      ? 'bg-sage text-white hover:bg-sage/90 active:scale-98 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2'
                      : 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
                    }
                  `}
                  disabled={!isFormValid || isSubmitting}
                  aria-label={isSubmitting ? 'Submitting review' : 'Submit review'}
                  aria-busy={isSubmitting}
                >
                  <span className="flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Review</span>
                        {isFormValid && (
                          <ion-icon name="arrow-forward-outline" />
                        )}
                      </>
                    )}
                  </span>
                </button>

                {/* Validation hint */}
                {!isFormValid && (overallRating === 0 || reviewText.length < MIN_REVIEW_LENGTH) && (
                  <p className="mt-3 text-sm text-center text-charcoal/60 font-urbanist">
                    {overallRating === 0 && reviewText.length < MIN_REVIEW_LENGTH
                      ? 'Please select a rating and write a review'
                      : overallRating === 0
                      ? 'Please select a rating'
                      : `Please write at least ${MIN_REVIEW_LENGTH} characters`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}