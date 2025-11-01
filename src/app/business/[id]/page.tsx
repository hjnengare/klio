"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    Store,
    Star,
    Images,
    Calendar,
    MessageSquareText,
    Pencil,
    Pizza,
    Music,
} from "lucide-react";
import { ImageCarousel } from "../../components/Business/ImageCarousel";
import { PremiumReviewCard } from "../../components/Business/PremiumReviewCard";
import { getCategoryPng, isPngIcon } from "../../utils/categoryToPngMapping";

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
`;

// Helper component for business profile image with fallback
function BusinessProfileImage({ business }: { business: { id: string; name: string; category?: string; image?: string; uploaded_image?: string; uploadedImage?: string; image_url?: string } }) {
    const [imgError, setImgError] = useState(false);
    const [usingFallback, setUsingFallback] = useState(false);

    // Image fallback logic with edge case handling
    const getDisplayImage = useMemo(() => {
        // Priority 1: Check for uploaded business image (not a PNG icon)
        const uploadedImage = business.uploaded_image || business.uploadedImage;
        if (uploadedImage && 
            typeof uploadedImage === 'string' && 
            uploadedImage.trim() !== '' &&
            !isPngIcon(uploadedImage) &&
            !uploadedImage.includes('/png/')) {
            return { image: uploadedImage, isPng: false };
        }

        // Priority 2: Check image_url (API compatibility)
        if (business.image_url && 
            typeof business.image_url === 'string' && 
            business.image_url.trim() !== '' &&
            !isPngIcon(business.image_url)) {
            return { image: business.image_url, isPng: false };
        }

        // Priority 3: Check image field (if not a PNG)
        if (business.image && 
            typeof business.image === 'string' && 
            business.image.trim() !== '' &&
            !isPngIcon(business.image)) {
            return { image: business.image, isPng: false };
        }

        // Priority 4: Fallback to PNG based on category
        const categoryPng = getCategoryPng(business.category);
        return { image: categoryPng, isPng: true };
    }, [business]);

    const displayImage = getDisplayImage.image;
    const isImagePng = getDisplayImage.isPng;

    // Handle image error - fallback to PNG if uploaded image fails
    const handleImageError = () => {
        if (!usingFallback && !isImagePng) {
            setUsingFallback(true);
            setImgError(false);
        } else {
            setImgError(true);
        }
    };

    return (
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sage/20 relative">
            {!imgError && displayImage ? (
                isImagePng || displayImage.includes('/png/') || displayImage.endsWith('.png') || usingFallback ? (
                    // Display PNG files as icons
                    <div className="w-full h-full flex items-center justify-center bg-off-white">
                        <Image
                            src={usingFallback ? getCategoryPng(business.category) : displayImage}
                            alt={`${business.name} profile`}
                            width={40}
                            height={40}
                            className="w-8 h-8 object-contain"
                            unoptimized
                            onError={handleImageError}
                        />
                    </div>
                ) : (
                    // Regular full image for uploaded business images
                    <Image
                        src={displayImage}
                        alt={`${business.name} profile`}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                        onError={handleImageError}
                    />
                )
            ) : (
                // Final fallback
                <div className="w-full h-full flex items-center justify-center bg-white">
                    <Store className="w-5 h-5 text-sage" />
                </div>
            )}
        </div>
    );
}

export default function BusinessProfilePage() {
    const params = useParams();
    const businessId = params?.id as string;

    // Mock data (replace with API in production)
    const business = useMemo(() => {
        return {
            id: businessId || "demo",
            name: "Mama's Kitchen",
            category: "Restaurant", // Add category for PNG fallback
            rating: 4.8,
            image: "/images/product-01.jpg",
            images: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=900&fit=crop",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=900&fit=crop",
                "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&h=900&fit=crop",
                "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&h=900&fit=crop",
                "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&h=900&fit=crop",
            ],
            trust: 95,
            punctuality: 89,
            friendliness: 92,
            specials: [
                { id: 1, name: "2 for 1 Pizza", description: "Every day", icon: "pizza" },
                { id: 2, name: "Jazz Night", description: "Mondays", icon: "musical-notes" },
            ],
            reviews: [
                {
                    id: 1,
                    author: "Jess",
                    rating: 5,
                    text: "Loved the pizza, staff were so friendly. Food came fast & trustworthy. @on time @friendly",
                    date: "Feb 2023",
                    tags: ["trustworthy", "on time", "friendly"],
                },
                {
                    id: 2,
                    author: "Hilario",
                    rating: 4,
                    text: "Terrible anything but food came fast. @on time",
                    date: "March 2023",
                    tags: ["on time"],
                },
            ],
        };
    }, [businessId]);

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
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
                    <nav className="flex items-center justify-between" aria-label="Business profile navigation">
                        <Link
                            href="/home"
                            className="group flex items-center focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-navbar-bg rounded-lg px-1 -mx-1"
                            aria-label="Go back to home"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-2 sm:mr-3" aria-hidden="true">
                                <ArrowLeft className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                            </div>
                            <h1 className="font-urbanist text-sm font-700 text-white animate-delay-100 animate-fade-in" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                                {business.name}
                            </h1>
                        </Link>

                    <div className="flex items-center gap-3">
                        {/* Edit Button */}
                        <Link
                            href={`/business/${businessId}/edit`}
                            className="bg-sage/20 hover:bg-sage/30 text-white px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-2 border border-sage/30"
                        >
                            <Pencil className="w-3 h-3" />
                            Edit
                        </Link>
                        
                        {/* Manage Button */}
                        <Link
                            href="/manage-business"
                            className="bg-coral/20 hover:bg-coral/30 text-white px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-2 border border-coral/30"
                        >
                            <Store className="w-3 h-3" />
                            Manage
                        </Link>

                        {/* Profile Picture Placeholder */}
                        <BusinessProfileImage business={business} />
                    </div>
                    </nav>
                </div>
            </header>

            <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
                <div className="py-1 pt-20">
                    <main className="relative font-sf-pro pt-4 sm:pt-6" id="main-content" role="main" aria-label="Business profile content">
                        <div className="container mx-auto max-w-[1300px] px-3 sm:px-4 md:px-6 relative z-10">
                            <div className="pt-2 pb-12 sm:pb-16 md:pb-20">
                                {/* Accessible skip link */}
                                <a
                                    href="#reviews-section"
                                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sage focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 font-urbanist text-sm font-600"
                                >
                                    Skip to reviews
                                </a>

                                {/* Full width layout */}
                                <div className="space-y-6">

                        {/* PRIORITY 1: Hero Carousel - Full Width at Top */}
                        <article className="w-full" aria-labelledby="photos-heading">
                            <div className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-5 relative overflow-hidden animate-fade-in-up">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-lg" aria-hidden="true" />
                                <div className="relative z-10">
                                    <h2 id="photos-heading" className="text-sm font-bold text-charcoal mb-3 flex items-center gap-2.5 font-urbanist">
                                        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10" aria-hidden="true">
                                            <Images className="w-4 h-4 text-sage" />
                                        </span>
                                        <span>Photos</span>
                                    </h2>

                                    <ImageCarousel
                                        images={business.images || [business.image]}
                                        altBase={business.name}
                                        rating={business.rating}
                                        metrics={[
                                            { label: "Trust", value: business.trust, color: "sage" },
                                            { label: "Punctuality", value: business.punctuality, color: "coral" },
                                            { label: "Friendliness", value: business.friendliness, color: "sage" },
                                        ]}
                                    />
                                </div>
                            </div>
                        </article>

                        {/* PRIORITY 2: Reviews and Specials Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Reviews Section - Left Side (3/4 width) */}
                            <article
                                id="reviews-section"
                                className="lg:col-span-3 bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4 relative overflow-hidden animate-fade-in-up animate-delay-100"
                                aria-labelledby="reviews-heading"
                            >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10" aria-hidden="true">
                                        <MessageSquareText className="w-5 h-5 text-sage" />
                                    </span>
                                    <h2 id="reviews-heading" className="text-sm font-bold text-charcoal font-urbanist">
                                        Community Reviews
                                    </h2>
                                </div>
                                <Link
                                    href={`/business/${business.id}/review`}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sage to-sage/90 text-white text-sm font-600 py-3 px-5 hover:from-sage/90 hover:to-sage/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-off-white"
                                    aria-label="Write a review for {business.name}"
                                >
                                    <Pencil className="w-4 h-4" aria-hidden="true" />
                                    <span>Write Review</span>
                                </Link>
                            </div>

                            {/* Review Cards - Accessible Scrollable Container */}
                            <div
                                className="h-[600px] overflow-y-auto custom-scroll focus:outline-none focus:ring-2 focus:ring-sage/20 focus:ring-inset rounded-lg"
                                role="feed"
                                aria-label="Customer reviews"
                                tabIndex={0}
                            >
                                <div className="space-y-4 pr-2">
                                    <PremiumReviewCard
                                        author={business.reviews[0].author}
                                        rating={business.reviews[0].rating}
                                        text={business.reviews[0].text}
                                        date={business.reviews[0].date}
                                        tags={business.reviews[0].tags}
                                        highlight="Top Reviewer"
                                        verified
                                        profileImage="https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                    <PremiumReviewCard
                                        author={business.reviews[1].author}
                                        rating={business.reviews[1].rating}
                                        text={business.reviews[1].text}
                                        date={business.reviews[1].date}
                                        tags={business.reviews[1].tags}
                                        highlight="Local Guide"
                                        verified={false}
                                        profileImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                    <PremiumReviewCard
                                        author="Maria Garcia"
                                        rating={5}
                                        text="Amazing food and great service! The staff was very friendly and the atmosphere was perfect for a family dinner. Highly recommend the pasta dishes."
                                        date="Jan 2024"
                                        tags={["friendly", "family-friendly", "great food"]}
                                        highlight="Foodie"
                                        verified
                                        profileImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1563379091339-03246963d0b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                    <PremiumReviewCard
                                        author="Alex Chen"
                                        rating={4}
                                        text="Good food but service was a bit slow during peak hours. The pizza was delicious though, worth the wait."
                                        date="Dec 2023"
                                        tags={["slow service", "good food"]}
                                        highlight="Regular"
                                        verified={false}
                                        profileImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                    <PremiumReviewCard
                                        author="Sarah Johnson"
                                        rating={5}
                                        text="Absolutely fantastic! The ambiance is perfect for a date night. The wine selection is excellent and the staff knows their stuff. Will definitely be back!"
                                        date="Feb 2024"
                                        tags={["romantic", "great wine", "excellent service"]}
                                        highlight="Wine Expert"
                                        verified
                                        profileImage="https://broken-image-url.com/profile.jpg"
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                    <PremiumReviewCard
                                        author="Mike Rodriguez"
                                        rating={3}
                                        text="Food was decent but the wait time was too long. The place was packed and understaffed. Good food when it finally arrived though."
                                        date="Jan 2024"
                                        tags={["long wait", "understaffed", "decent food"]}
                                        highlight="Regular"
                                        verified={false}
                                        profileImage=""
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                    <PremiumReviewCard
                                        author="Emma Wilson"
                                        rating={5}
                                        text="Best restaurant in town! The chef's special was incredible and the presentation was beautiful. Service was impeccable from start to finish."
                                        date="Feb 2024"
                                        tags={["chef's special", "beautiful presentation", "impeccable service"]}
                                        highlight="Food Critic"
                                        verified
                                        profileImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                    <PremiumReviewCard
                                        author="David Kim"
                                        rating={4}
                                        text="Great atmosphere and friendly staff. The menu has good variety and the prices are reasonable. Parking can be a bit tricky during peak hours."
                                        date="Jan 2024"
                                        tags={["great atmosphere", "friendly staff", "reasonable prices"]}
                                        highlight="Local Guide"
                                        verified
                                        profileImage="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                        reviewImages={[
                                            "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                                            "https://images.unsplash.com/photo-1563379091339-03246963d0b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                        ]}
                                    />
                                </div>
                            </div>
                        </article>

                            {/* Specials & Events - Right Side (1/4 width) */}
                            <aside className="lg:col-span-1" aria-labelledby="specials-heading">
                                <div className="bg-card-bg backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-6 relative overflow-hidden animate-fade-in-up animate-delay-200">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-lg" aria-hidden="true" />

                                    <div className="relative z-10">
                                        <h3 id="specials-heading" className="text-sm font-bold text-charcoal mb-3 flex items-center gap-2.5 font-urbanist">
                                            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral/20 to-coral/10" aria-hidden="true">
                                                <Calendar className="w-4 h-4 text-coral" />
                                            </span>
                                            <span>Specials & Events</span>
                                        </h3>

                                        <ul className="grid grid-cols-2 sm:grid-cols-1 gap-3 list-none">
                                            {business.specials.map((special) => {
                                                const Icon = special.icon === "pizza" ? Pizza : Music;
                                                return (
                                                    <li
                                                        key={special.id}
                                                        className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-[10px] p-3 border border-sage/10 focus-within:ring-2 focus-within:ring-coral/20 focus-within:border-coral/30 transition-all duration-200"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 grid place-items-center bg-gradient-to-br from-sage/20 to-sage/10 rounded-[10px]" aria-hidden="true">
                                                                <Icon className="w-4 h-4 text-sage" />
                                                            </div>
                                                                <div>
                                                                    <h4 className="text-sm font-600 text-charcoal mb-0.5 font-urbanist">{special.name}</h4>
                                                                    <p className="text-xs text-charcoal/70">{special.description}</p>
                                                                </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </div>
      </div>
    </div>
    </>
  );
}
