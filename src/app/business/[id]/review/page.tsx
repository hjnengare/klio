"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, Edit, Star, ChevronUp } from "react-feather";
import Link from "next/link";
import { useReviewForm } from "../../../hooks/useReviewForm";
import { useReviewSubmission } from "../../../hooks/useReviews";
import { PageLoader } from "../../../components/Loader";
import ReviewForm from "../../../components/ReviewForm/ReviewForm";
import BusinessInfoAside from "../../../components/BusinessInfo/BusinessInfoAside";
import { BusinessInfo } from "../../../components/BusinessInfo/BusinessInfoModal";
import SimilarBusinesses from "../../../components/SimilarBusinesses/SimilarBusinesses";
import Footer from "../../../components/Footer/Footer";

// CSS animations matching business profile
const animations = `
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
  
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.96) translateY(-12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
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
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .animate-delay-100 { animation-delay: 0.1s; opacity: 0; }
  .animate-delay-200 { animation-delay: 0.2s; opacity: 0; }
  .animate-delay-300 { animation-delay: 0.3s; opacity: 0; }
`;

// Lazy load BusinessCarousel for mobile
const BusinessCarousel = dynamic(() => import("../../../components/ReviewForm/BusinessCarousel"), {
  ssr: false,
  loading: () => <div className="h-48 bg-off-white/50 rounded-lg animate-pulse" />
});

function WriteReviewContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = (params?.id as string) || searchParams.get('business_id') || searchParams.get('businessId');

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch business data using optimized API route
  useEffect(() => {
    async function fetchBusiness() {
      if (!businessId) {
        setError('No business ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/businesses/${businessId}`, {
          cache: 'no-store'
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Business not found');
          } else {
            throw new Error('Failed to load business');
          }
          return;
        }

        const data = await response.json();
        setBusiness(data);
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Failed to load business information');
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [businessId]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Memoize computed values
  const businessName = useMemo(() => business?.name || "Loading...", [business?.name]);
  
  const isPngPlaceholder = (url: string | null | undefined) => {
    if (!url) return true;
    return url.startsWith('/png/') || url.includes('/png/');
  };
  
  const businessImages = useMemo(() => {
    if (!business) return [];
    const images = business.images || [];
    return images.filter((img: string) => img && !isPngPlaceholder(img));
  }, [business?.images]);

  const businessRating = useMemo(() => 
    business?.stats?.average_rating || business?.business_stats?.[0]?.average_rating || 0,
    [business?.stats?.average_rating, business?.business_stats]
  );

  const businessInfo: BusinessInfo = useMemo(() => ({
    name: businessName,
    description: business?.description || '',
    category: business?.category || '',
    location: business?.location || '',
    address: business?.address || business?.location || '',
    phone: business?.phone || "",
    email: business?.email || "",
    website: business?.website || "",
    price_range: business?.price_range || '$$',
    verified: business?.verified || false,
  }), [businessName, business]);

  const quickTags = ["Trustworthy", "On Time", "Friendly", "Good Value"];

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
      setTimeout(() => {
        router.push(`/business/${businessId}`);
      }, 1500);
    }
  };

  // Loading state
  if (loading) {
    return <PageLoader size="lg" color="sage" text="Loading business..." />;
  }

  // Error state
  if (error || !business) {
    return (
      <div className="min-h-dvh bg-off-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-h1 font-semibold text-charcoal mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            {error || 'Business not found'}
          </h2>
          <p className="text-body text-charcoal/70 mb-6" style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
            {error || "The business you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-sage text-white rounded-full text-body font-semibold hover:bg-sage/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animations }} />
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
      <div
        className="min-h-dvh bg-off-white relative overflow-hidden font-urbanist"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        {/* Fixed Premium Header - matching business profile */}
        <header 
          className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10 animate-slide-in-top"
          role="banner"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-10 2xl:px-16 py-4">
            <nav className="flex items-center justify-between" aria-label="Write review navigation">
              <button
                onClick={() => router.back()}
                className="group flex items-center focus:outline-none rounded-lg px-1 -mx-1"
                aria-label="Go back to previous page"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-2 sm:mr-3" aria-hidden="true">
                  <ArrowLeft className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                </div>
                <h3
                  className="text-body sm:text-h4 font-semibold text-white animate-delay-100 animate-fade-in truncate max-w-[150px] sm:max-w-none"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                >
                  Write a Review
                </h3>
              </button>

            </nav>
          </div>
        </header>

        <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
          <div className="py-1 pt-20 sm:px-4">
            <main className="relative font-sf-pro pt-4 sm:pt-6" id="main-content" role="main" aria-label="Write review content">
              <div className="mx-auto w-full max-w-[2000px] px-3 relative z-10">
                <div className="pt-2 pb-12 sm:pb-16 md:pb-20">
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3 items-start">
                      {/* Main Content Section */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery Section - Separated from form */}
                        <article className="w-full sm:mx-0 flex items-center justify-center" aria-labelledby="business-images-heading">
                          <div className="bg-card-bg backdrop-blur-xl border-0 sm:border border-white/60 rounded-2xl sm:rounded-[20px] shadow-none sm:shadow-lg relative overflow-hidden animate-fade-in-up mx-auto w-full">
                            <div className="relative z-10">
                              {/* Business Info and Carousel */}
                              <div className="flex flex-col px-4 pt-4 pb-4 md:pb-6">
                                <div className="text-center px-4 mb-4">
                                  <h3 className="text-h3 font-semibold text-charcoal mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    {businessName}
                                  </h3>
                                  <div className="flex items-center justify-center space-x-2">
                                    {/* Rating Badge - matching BusinessCard style */}
                                    <div className="inline-flex items-center gap-1 rounded-full bg-off-white/90 px-3 py-1.5 text-charcoal border border-white/30">
                                      <Star className="w-3.5 h-3.5 text-coral fill-coral" aria-hidden />
                                      <span className="text-body-sm font-semibold text-charcoal" style={{ 
                                        fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
                                        fontWeight: 600
                                      }}>
                                        {Number(businessRating).toFixed(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <BusinessCarousel businessName={businessName} businessImages={businessImages} />
                              </div>
                            </div>
                          </div>
                        </article>

                        {/* Review Form Section - Separated from images */}
                        <article className="w-full sm:mx-0 flex items-center justify-center" aria-labelledby="review-form-heading">
                          <div className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-xl border-0 sm:border border-white/60 rounded-2xl sm:rounded-[20px] shadow-none sm:shadow-lg relative overflow-hidden animate-fade-in-up mx-auto w-full">
                            {/* Gradient overlays matching user profile */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-lg"></div>
                            <div className="relative z-10">
                              {/* Review Form */}
                              <div className="p-4 md:p-6">
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
                          </div>
                        </article>
                      </div>

                      {/* Sidebar - Business Info */}
                      <div className="space-y-6">
                        <BusinessInfoAside
                          businessInfo={businessInfo}
                          className="self-start lg:sticky lg:top-28"
                        />
                      </div>
                    </div>

                    {/* Similar Businesses Section */}
                    <div className="lg:col-span-3">
                      <SimilarBusinesses
                        currentBusinessId={businessId}
                        category={business?.category || ""}
                        location={business?.location}
                        limit={6}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-[100] w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sage to-sage/90 hover:from-sage/90 hover:to-sage/80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-sage/30 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </button>
        )}

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

