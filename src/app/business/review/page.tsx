"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Star } from "react-feather";
import ReviewHeader from "../../components/ReviewForm/ReviewHeader";
import ReviewForm from "../../components/ReviewForm/ReviewForm";
import ReviewSidebar from "../../components/ReviewForm/ReviewSidebar";
import BusinessCarousel from "../../components/ReviewForm/BusinessCarousel";
import ReviewStyles from "../../components/ReviewForm/ReviewStyles";
import Footer from "../../components/Footer/Footer";
import { useReviewForm } from "../../hooks/useReviewForm";
import { useReviewSubmission } from "../../hooks/useReviews";
import { supabase } from "../../lib/supabase";
import { PageLoader } from "../../components/Loader";


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

function WriteReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Support both business_id and businessId for compatibility
  const businessId = searchParams.get('business_id') || searchParams.get('businessId');

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
    resetForm,
  } = useReviewForm();

  const { submitReview, submitting } = useReviewSubmission();

  // State for business data
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch business data
  useEffect(() => {
    async function fetchBusiness() {
      if (!businessId) {
        setError('No business ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('businesses')
          .select(`
            *,
            business_stats (
              total_reviews,
              average_rating
            )
          `)
          .eq('id', businessId)
          .single();

        if (fetchError) throw fetchError;
        
        if (data) {
          setBusiness(data);
        } else {
          setError('Business not found');
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Failed to load business information');
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [businessId]);

  // Use real business data
  const businessName = business?.name || "Loading...";
  
  // Filter out PNG placeholder images (like /png/001-restaurant.png) - these are for cards only
  const isPngPlaceholder = (url: string | null | undefined) => {
    if (!url) return true;
    return url.startsWith('/png/') || url.includes('/png/');
  };
  
  const businessImages = business?.uploaded_image && !isPngPlaceholder(business.uploaded_image)
    ? [business.uploaded_image]
    : business?.image_url && !isPngPlaceholder(business.image_url)
    ? [business.image_url]
    : [];
  const businessRating = business?.business_stats?.[0]?.average_rating || 0;
  const businessInfo = {
    name: businessName,
    phone: business?.phone || "",
    website: business?.website || "",
    address: business?.address || business?.location || "",
    email: business?.email || "",
    category: business?.category || "",
    location: business?.location || "",
  };
  const quickTags = ["Trustworthy", "On Time", "Friendly", "Good Value"];

  // Fetch recent reviews from the same business or other businesses
  // For now, this will be empty and can be populated with real data later
  const otherReviews: SmallReview[] = [];

  const handleSubmitReview = async () => {
    if (!businessId) {
      alert('No business ID provided');
      return;
    }

    if (!isFormValid) {
      alert('Please fill in all required fields');
      return;
    }

    const success = await submitReview({
      business_id: businessId,
      rating: overallRating,
      title: reviewTitle,
      content: reviewText,
      tags: selectedTags,
      images: selectedImages,
    });

    if (success) {
      resetForm();
      // Navigate back to business page or home
      setTimeout(() => {
        router.push(`/business/${businessId}`);
      }, 1500);
    }
  };

  // Show loading state
  if (loading) {
    return <PageLoader size="xl" color="sage" text="Loading business information..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-500 font-urbanist mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-sage text-white rounded-xl hover:bg-sage/80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
              <div className="w-full md:container md:mx-auto md:max-w-[1300px] px-0 md:px-6 relative z-10">
                <div className="pt-2 pb-12 sm:pb-16 md:pb-20">
                  <div className="space-y-6 px-3 sm:px-4 md:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* MAIN: Form */}
                      <div className="lg:col-span-8 animate-fade-in-up">
                        {/* Business Info and Carousel - visible on mobile only */}
                        <div className="md:hidden mb-6 flex flex-col">
                          <div className="text-center px-4 mb-4">
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
                        <div className="lg:border lg:border-sage/10 lg:rounded-2xl lg:shadow-lg lg:p-6">
                          <ReviewForm
                          businessName={businessName}
                          businessRating={businessRating}
                          businessImages={businessImages}
                          overallRating={overallRating}
                          selectedTags={selectedTags}
                          reviewText={reviewText}
                          reviewTitle={reviewTitle}
                          selectedImages={selectedImages}
                          isFormValid={isFormValid && !submitting}
                          availableTags={quickTags}
                          onRatingChange={handleStarClick}
                          onTagToggle={handleTagToggle}
                          onTitleChange={setReviewTitle}
                          onTextChange={setReviewText}
                          onImagesChange={setSelectedImages}
                          onSubmit={handleSubmitReview}
                        />
                        </div>
                      </div>

                      {/* SIDEBAR */}
                      <aside className="lg:col-span-4 animate-fade-in-up animate-delay-200">
                        <ReviewSidebar otherReviews={otherReviews} businessInfo={businessInfo} businessRating={businessRating} />
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

// Wrapper component with Suspense for useSearchParams
export default function WriteReviewPage() {
  return (
    <Suspense fallback={<PageLoader size="xl" color="sage" text="Loading..." />}>
      <WriteReviewContent />
    </Suspense>
  );
}
