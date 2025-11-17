"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { PageLoader } from "../../components/Loader";
import {
    ArrowLeft,
    Briefcase,
    Star,
    Image as ImageIcon,
    Calendar,
    MessageSquare,
    Edit,
    Coffee,
    Music,
    MapPin,
    Clock,
    Heart,
    Share2,
    X,
    ChevronUp,
} from "react-feather";
import { ImageCarousel } from "../../components/Business/ImageCarousel";
import { PremiumReviewCard } from "../../components/Business/PremiumReviewCard";
import { getCategoryPng, isPngIcon } from "../../utils/categoryToPngMapping";
import Footer from "../../components/Footer/Footer";
import { BusinessInfo } from "../../components/BusinessInfo/BusinessInfoModal";
import BusinessInfoAside from "../../components/BusinessInfo/BusinessInfoAside";
import { useAuth } from "../../contexts/AuthContext";

// CSS animations to replace framer-motion
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


export default function BusinessProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const businessId = params?.id as string;
    const [showSpecialsModal, setShowSpecialsModal] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
    const [showScrollTop, setShowScrollTop] = useState(false);


    // Calculate modal position based on button position
    useEffect(() => {
        if (showSpecialsModal && buttonRef.current) {
            const updatePosition = () => {
                if (buttonRef.current) {
                    const buttonRect = buttonRef.current.getBoundingClientRect();
                    setModalPosition({
                        top: buttonRect.bottom + 8, // 8px gap below button
                        right: window.innerWidth - buttonRect.right, // Align right edge with button
                    });
                }
            };

            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [showSpecialsModal]);

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

    // Handle ESC key to close modals
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowSpecialsModal(false);
            }
        };

        if (showSpecialsModal) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showSpecialsModal]);

    // Fetch business data from API
    const [business, setBusiness] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            if (!businessId) {
                setError('Business ID is required');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                
                const response = await fetch(`/api/businesses/${businessId}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Business not found');
                    } else {
                        setError('Failed to load business');
                    }
                    setIsLoading(false);
                    return;
                }

                const data = await response.json();
                setBusiness(data);
            } catch (err: any) {
                console.error('Error fetching business:', err);
                setError('Failed to load business');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusiness();
    }, [businessId]);

    // Loading state
    if (isLoading) {
        return <PageLoader size="lg" color="sage" text="Loading business..." />;
    }

    // Error state
    if (error || !business) {
        return (
            <div className="min-h-dvh bg-off-white flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-coral" />
                    </div>
                    <h2 className="text-h1 font-semibold text-charcoal mb-2" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
                        {error || 'Business not found'}
                    </h2>
                    <p className="text-body text-charcoal/70 mb-6 max-w-[70ch]" style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                        The business you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        href="/home"
                        className="inline-block px-6 py-3 bg-coral text-white rounded-full text-body font-semibold hover:bg-coral/90 transition-colors"
                        style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Check if current user is the business owner
    const isBusinessOwner = user && business.owner_id && user.id === business.owner_id;

    // Prepare image data without using PNG placeholders
    const cleanedGalleryImages = Array.isArray(business.images)
        ? business.images.filter((img: string) => img && img.trim() !== '' && !isPngIcon(img))
        : [];

    const fallbackImageCandidate = [
        business.uploaded_image,
        business.uploadedImage,
        business.image_url,
        business.image,
    ].find((img) => img && img.trim() !== '' && !isPngIcon(img as string));

    const galleryImages = cleanedGalleryImages.length > 0
        ? cleanedGalleryImages
        : (fallbackImageCandidate ? [fallbackImageCandidate] : []);

    // Default values for missing data
    const businessData = {
        id: business.id || businessId,
        name: business.name || 'Unnamed Business',
        description: business.description || `${business.category || 'Business'} located in ${business.location || 'Cape Town'}`,
        category: business.category || 'Business',
        location: business.location || 'Cape Town',
        address: business.address,
        phone: business.phone,
        email: business.email,
        website: business.website,
        price_range: business.price_range || '$$',
        verified: business.verified || false,
        rating: business.stats?.average_rating || 0,
        image: fallbackImageCandidate || '',
        images: galleryImages,
        trust: business.trust || business.stats?.percentiles?.service || 85,
        punctuality: business.punctuality || business.stats?.percentiles?.price || 85,
        friendliness: business.friendliness || business.stats?.percentiles?.ambience || 85,
        specials: [], // TODO: Fetch from events/specials table
        reviews: business.reviews || [],
    };

    const businessInfo: BusinessInfo = {
        name: businessData.name,
        description: businessData.description,
        category: businessData.category,
        location: businessData.location,
        address: businessData.address,
        phone: businessData.phone,
        email: businessData.email,
        website: businessData.website,
        price_range: businessData.price_range,
        verified: businessData.verified,
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: animations }} />
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
            <div
                className="min-h-dvh bg-off-white relative overflow-hidden font-urbanist"
                style={{
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                }}
            >
                {/* Fixed Premium Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10 animate-slide-in-top"
                    role="banner"
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                    }}
                >
                    <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-10 2xl:px-16 py-4">
                        <nav className="flex items-center justify-between" aria-label="Business profile navigation">
                            <button
                                onClick={() => router.back()}
                                className="group flex items-center focus:outline-none rounded-lg px-1 -mx-1"
                                aria-label="Go back to previous page"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-2 sm:mr-3" aria-hidden="true">
                                    <ArrowLeft className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                                </div>
                                <h1
                                    className="text-body font-semibold text-white animate-delay-100 animate-fade-in truncate max-w-[150px] sm:max-w-none"
                                    style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
                                >
                                    {businessData.name}
                                </h1>
                            </button>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Events and Specials Button */}
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={() => setShowSpecialsModal(true)}
                                        className="bg-sage/20 hover:bg-coral/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
                                        aria-label="View events and specials"
                                    >
                                        <Calendar className="w-3 h-3" />
                                        <span className="hidden lg:inline">Events & Specials</span>
                                    </button>
                                </div>

                                {/* Edit Button - Only show to business owner */}
                                {isBusinessOwner && (
                                    <Link
                                        href={`/business/${businessId}/edit`}
                                        className="bg-sage/20 hover:bg-sage/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
                                    >
                                        <Edit className="w-3 h-3" />
                                        <span className="hidden lg:inline">Edit Business</span>
                                    </Link>
                                )}

                                {/* Leave Review Button */}
                                <Link
                                    href={`/business/${businessId}/review`}
                                    prefetch={true}
                                    className="bg-sage/20 hover:bg-coral/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
                                    onMouseEnter={() => router.prefetch(`/business/${businessId}/review`)}
                                >
                                    <Edit className="w-3 h-3" />
                                    <span className="hidden lg:inline">Leave a Review</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </header>

                <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white ">
                    <div className="py-1 pt-20 sm:px-4">
                        <main className="relative font-sf-pro pt-4 sm:pt-6" id="main-content" role="main" aria-label="Business profile content">
                            <div className="mx-auto w-full max-w-[2000px] px-3 relative z-10">
                                <div className="pt-2 pb-12 sm:pb-16 md:pb-20">


                                    <div className="space-y-6">
                                        <div className="grid gap-6 lg:grid-cols-3 items-start">
                                            <div className="lg:col-span-2">
                                                <article className="w-full sm:mx-0 flex items-center justify-center" aria-labelledby="photos-heading">
                                                    <div className="bg-card-bg backdrop-blur-xl border-0 sm:border border-white/60 rounded-2xl sm:rounded-[20px] shadow-none sm:shadow-lg relative overflow-hidden animate-fade-in-up mx-auto w-full">
                                                        <div className="relative z-10">
                                                            <ImageCarousel
                                                                images={businessData.images}
                                                                altBase={businessData.name}
                                                                rating={businessData.rating}
                                                                metrics={[
                                                                    { label: "Trust", value: businessData.trust, color: "sage" },
                                                                    { label: "Punctuality", value: businessData.punctuality, color: "coral" },
                                                                    { label: "Friendliness", value: businessData.friendliness, color: "sage" },
                                                                ]}
                                                            />
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>

                                            <div className="space-y-6">
                                                <BusinessInfoAside
                                                    businessInfo={businessInfo}
                                                    className="self-start lg:sticky lg:top-28"
                                                />
                                            </div>
                                        </div>

                                        <section className="space-y-6" aria-labelledby="reviews-heading">
                                                <div className="flex justify-center">
                                                    <div className="flex flex-col gap-3">
                                                        <h2
                                                            id="reviews-heading"
                                                            className="text-h3 font-semibold text-charcoal border-b border-charcoal/10 pb-2"
                                                            style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
                                                        >
                                                            Community Reviews
                                                        </h2>
                                                    </div>
                                                </div>

                                                {businessData.reviews.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {businessData.reviews.map((review: any, index: number) => (
                                                            <PremiumReviewCard
                                                                key={review.id || index}
                                                                author={review.author}
                                                                rating={review.rating}
                                                                text={review.text}
                                                                date={review.date}
                                                                tags={review.tags}
                                                                highlight={index === 0 ? "Top Reviewer" : "Local Guide"}
                                                                verified={index < 2}
                                                                profileImage={review.profileImage}
                                                                reviewImages={review.reviewImages}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <MessageSquare className="w-8 h-8 text-charcoal/40" />
                                                        </div>
                                                        <h3 className="text-h2 font-semibold text-charcoal mb-2" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
                                                            No reviews yet
                                                        </h3>
                                                        <p className="text-body text-charcoal/70 mb-6 max-w-[70ch] mx-auto text-center" style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                                                            Be the first to review this business!
                                                        </p>
                                                        <Link
                                                            href={`/business/${businessId}/review`}
                                                            prefetch={true}
                                                            className="inline-block px-6 py-3 bg-coral text-white rounded-full text-body font-semibold hover:bg-coral/90 transition-colors"
                                                            style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
                                                            onMouseEnter={() => router.prefetch(`/business/${businessId}/review`)}
                                                        >
                                                            Write First Review
                                                        </Link>
                                                    </div>
                                                )}
                                            </section>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Events and Specials Modal */}
                {showSpecialsModal && (
                    <div
                        className="fixed z-[201] pointer-events-none"
                        style={{
                            top: `${modalPosition.top}px`,
                            right: `${modalPosition.right}px`,
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="specials-modal-heading"
                    >
                        <div
                            className="bg-off-white backdrop-blur-xl border border-white/60 rounded-[20px] shadow-lg p-6 relative overflow-hidden w-[280px] sm:w-[300px] lg:w-[320px] pointer-events-auto animate-fade-in-scale"
                        >
                            {/* Decorative background element */}
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-lg" aria-hidden="true" />

                            {/* Close Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowSpecialsModal(false);
                                }}
                                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-charcoal transition-all duration-300 hover:scale-110 border border-white/20 cursor-pointer"
                                aria-label="Close modal"
                                type="button"
                            >
                                <X className="w-4 h-4" />
                            </button>

                                                    <div className="relative z-10">
                                <h3
                                    id="specials-modal-heading"
                                    className="text-h3 font-semibold text-charcoal mb-4 flex items-center gap-2.5 pr-8"
                                    style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
                                >
                                                            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral/20 to-coral/10" aria-hidden="true">
                                                                <Calendar className="w-4 h-4 text-coral" />
                                                            </span>
                                                            <span>Specials & Events</span>
                                                        </h3>

                                <ul className="grid grid-cols-1 gap-3 list-none max-h-[60vh] overflow-y-auto custom-scroll pr-2">
                                                            {businessData.specials.length > 0 ? (
                                                                businessData.specials.map((special: any) => {
                                                                const Icon = special.icon === "pizza" ? Coffee : Music;
                                                                const eventPath = special.type === "event" 
                                                                    ? `/event/${special.eventId}` 
                                                                    : `/special/${special.eventId}`;
                                                                
                                                                return (
                                                                    <li
                                                                        key={special.id}
                                                                        className="bg-gradient-to-br from-white/80 to-white/60 hover:from-white/90 hover:to-white/70 backdrop-blur-sm rounded-[10px] p-3 border border-sage/10 hover:border-coral/30 focus-within:ring-2 focus-within:ring-coral/20 focus-within:border-coral/30 transition-all duration-200 cursor-pointer"
                                                                    >
                                                                        <Link
                                                                            href={eventPath}
                                                                            onClick={() => setShowSpecialsModal(false)}
                                                                            className="flex items-center gap-3"
                                                                        >
                                                                            <div className="w-10 h-10 grid place-items-center bg-gradient-to-br from-sage/20 to-sage/10 rounded-[10px]" aria-hidden="true">
                                                                                <Icon className="w-4 h-4 text-sage" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <h4 className="text-body-sm font-semibold text-charcoal mb-0.5" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>{special.name}</h4>
                                                                                <p className="text-caption text-charcoal/70 max-w-[70ch]">{special.description}</p>
                                                                            </div>
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })) : (
                                                                <li className="text-center py-8 text-charcoal/70 text-body-sm" style={{ fontFamily: 'Urbanist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                                                                    No events or specials available at this time.
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                    </div>
                )}
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-[100] w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sage to-sage/90 hover:from-sage/90 hover:to-sage/80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-sage/30 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            )}

            <Footer />
        </>
    );
}
