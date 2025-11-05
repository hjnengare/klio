"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useMemo, useState, useEffect, useRef } from "react";
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
    Info,
} from "react-feather";
import { ImageCarousel } from "../../components/Business/ImageCarousel";
import { PremiumReviewCard } from "../../components/Business/PremiumReviewCard";
import { getCategoryPng, isPngIcon } from "../../utils/categoryToPngMapping";
import Footer from "../../components/Footer/Footer";
import BusinessInfoModal, { BusinessInfo } from "../../components/BusinessInfo/BusinessInfoModal";

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
    const businessId = params?.id as string;
    const [showSpecialsModal, setShowSpecialsModal] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const infoButtonRef = useRef<HTMLButtonElement>(null);

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
                if (showSpecialsModal) {
                    setShowSpecialsModal(false);
                }
                if (isInfoModalOpen) {
                    setIsInfoModalOpen(false);
                }
            }
        };

        if (showSpecialsModal || isInfoModalOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showSpecialsModal, isInfoModalOpen]);

    // Mock data (replace with API in production)
    const business = useMemo(() => {
        return {
            id: businessId || "demo",
            name: "Mama's Kitchen",
            description: "A family-owned restaurant serving authentic Italian cuisine with a modern twist. We've been serving the community for over 20 years, specializing in wood-fired pizzas, fresh pasta, and traditional Italian dishes made with locally sourced ingredients.",
            category: "Restaurant", // Add category for PNG fallback
            location: "Downtown, San Francisco, CA",
            address: "123 Main Street, San Francisco, CA 94102",
            phone: "+1 (415) 555-0123",
            email: "info@mamaskitchen.com",
            website: "www.mamaskitchen.com",
            price_range: "$$" as const,
            verified: true,
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
                { id: 1, name: "2 for 1 Pizza", description: "Every day", icon: "pizza", eventId: "special-1", type: "special" as const },
                { id: 2, name: "Jazz Night", description: "Mondays", icon: "musical-notes", eventId: "event-3", type: "event" as const },
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
                                className="group flex items-center focus:outline-nonecl rounded-lg px-1 -mx-1"
                                aria-label="Go back to home"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 mr-2 sm:mr-3" aria-hidden="true">
                                    <ArrowLeft className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                                </div>
                                <h1 className="font-urbanist text-sm sm:text-base font-700 text-white animate-delay-100 animate-fade-in truncate max-w-[150px] sm:max-w-none" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                                    {business.name}
                                </h1>
                            </Link>

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
                                        <span className="hidden sm:inline">Events & Specials</span>
                                    </button>
                                </div>

                                {/* Write Review Button */}
                                <Link
                                    href="/business/review"
                                    className="bg-sage/20 hover:bg-sage/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
                                    aria-label={`Write a review for ${business.name}`}
                                >
                                    <Edit className="w-3 h-3" />
                                    <span className="hidden md:inline">Write Review</span>
                                </Link>

                                {/* Edit Button */}
                                <Link
                                    href={`/business/${businessId}/edit`}
                                    className="bg-sage/20 hover:bg-sage/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
                                >
                                    <Edit className="w-3 h-3" />
                                    <span className="hidden lg:inline">Edit Business</span>
                                </Link>

                                {/* Manage Button */}
                                <Link
                                    href="/manage-business"
                                    className="bg-sage/20 hover:bg-coral/30 text-white px-2 sm:px-3 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border border-sage/30"
                                >
                                    <Briefcase className="w-3 h-3" />
                                    <span className="hidden lg:inline">Manage Business</span>
                                </Link>

                                {/* Info Button */}
                                <button
                                    ref={infoButtonRef}
                                    onClick={() => {
                                        if (isInfoModalOpen) {
                                            setIsInfoModalOpen(false);
                                        } else {
                                            setIsInfoModalOpen(true);
                                        }
                                    }}
                                    className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 min-h-[44px] min-w-[44px]"
                                    style={{ animation: 'gentlePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                                    aria-label="View business information"
                                >
                                    <Info className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </button>
                            </div>
                        </nav>
                    </div>
                </header>

                <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white ">
                    <div className="py-1 pt-20 md:px-20 sm:px-4">
                        <main className="relative font-sf-pro pt-4 sm:pt-6" id="main-content" role="main" aria-label="Business profile content">
                            <div className="container mx-auto max-w-[1300px] px-3 sm:px-4 relative z-10">
                                <div className="pt-2 pb-12 sm:pb-16 md:pb-20">


                                    {/* Full width layout */}
                                    <div className="space-y-6">

                                        {/* PRIORITY 1: Hero Carousel - Full Width at Top */}
                                        <article className="w-full sm:mx-0 flex items-center justify-center" aria-labelledby="photos-heading">
                                            <div className="bg-card-bg backdrop-blur-xl border-0 sm:border border-white/60 rounded-none sm:rounded-[20px] shadow-none sm:shadow-lg relative overflow-hidden animate-fade-in-up mx-auto w-full">
                                               
                                                <div className="relative z-10">
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

                                        {/* PRIORITY 2: Reviews Section - Centered */}
                                        <div className="flex justify-center">
                                          <div className="flex flex-col gap-3">
                                                    <h2 id="reviews-heading" className="text-sm font-bold text-charcoal font-urbanist border-b border-charcoal/10 pb-2">
                                                            Community Reviews
                                                        </h2>
                                                </div>
                                            </div>
                                                    <div className="space-y-4">
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
                                    className="text-sm font-bold text-charcoal mb-4 flex items-center gap-2.5 font-urbanist pr-8"
                                >
                                                            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral/20 to-coral/10" aria-hidden="true">
                                                                <Calendar className="w-4 h-4 text-coral" />
                                                            </span>
                                                            <span>Specials & Events</span>
                                                        </h3>

                                <ul className="grid grid-cols-1 gap-3 list-none max-h-[60vh] overflow-y-auto custom-scroll pr-2">
                                                            {business.specials.map((special) => {
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
                                                                                <h4 className="text-sm font-600 text-charcoal mb-0.5 font-urbanist">{special.name}</h4>
                                                                                <p className="text-xs text-charcoal/70">{special.description}</p>
                                                                            </div>
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })}
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

            {/* Business Info Modal */}
            <BusinessInfoModal
                businessInfo={{
                    name: business.name,
                    description: business.description,
                    category: business.category,
                    location: business.location,
                    address: business.address,
                    phone: business.phone,
                    email: business.email,
                    website: business.website,
                    price_range: business.price_range,
                    verified: business.verified,
                }}
                buttonRef={infoButtonRef}
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />

            <Footer />
        </>
    );
}
