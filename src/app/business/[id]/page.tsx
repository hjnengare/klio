"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
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

export default function BusinessProfilePage() {
    const params = useParams();
    const businessId = params?.id as string;

    // Mock data (replace with API in production)
    const business = useMemo(() => {
        return {
            id: businessId || "demo",
            name: "Mama's Kitchen",
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
            {/* SF Pro Font Setup */}
            <style jsx global>{`
                .font-sf {
                    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
                        "SF Pro Display", "Helvetica Neue", Helvetica, Arial, system-ui,
                        sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
                }
            `}</style>
        <div
                className="min-h-dvh bg-off-white/90 relative overflow-hidden font-sf"
            style={{
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
        >

            {/* Fixed Premium Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg backdrop-blur-xl border-b border-white/5 px-4 py-4 shadow-lg shadow-sage/5 animate-slide-in-top">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <Link
                            href="/home"
                            className="text-white/90 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-full"
                        >
                            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
                        </Link>

                    <h1 className="font-sf text-sm font-700 text-white animate-delay-100 animate-fade-in">
                        {business.name}
                    </h1>

                    {/* Profile Picture Placeholder */}
                    <div>
                        {business.image && business.image.startsWith("/images/") ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sage/20 bg-gradient-to-br from-sage/20 to-coral/20 flex items-center justify-center">
                                <Store className="w-5 h-5 text-sage" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sage/20">
                                <Image
                                    src={
                                        business.image ||
                                        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop"
                                    }
                                    alt={`${business.name} profile`}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6 pt-32 relative z-10">
                {/* Two-column layout: main content + reviews sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* MAIN (span 2) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Photos (with metrics caption overlay) */}
                        <div className="bg-off-white/90 backdrop-blur-lg rounded-[10px] shadow-sm border border-sage/10 p-5 relative overflow-hidden animate-fade-in-up animate-delay-100">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
                                <div className="relative z-10">
                                <h3 className="text-lg font-600 text-charcoal mb-4 flex items-center gap-3">
                                        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10">
                                            <Images className="w-4 h-4 text-sage" />
                                        </span>
                                        Photos
                                </h3>

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

                        {/* Specials & Events */}
                        <div className="bg-off-white/90 backdrop-blur-lg rounded-[10px] shadow-sm border border-sage/10 p-6 relative overflow-hidden animate-fade-in-up animate-delay-200">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl" />

                                <div className="relative z-10">
                                <h3 className="text-lg font-600 text-charcoal mb-6 flex items-center gap-3">
                                        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral/20 to-coral/10">
                                            <Calendar className="w-4 h-4 text-coral" />
                                        </span>
                                        Specials & Events
                                </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {business.specials.map((special) => {
                                            const Icon = special.icon === "pizza" ? Pizza : Music;
                                            return (
                                            <div
                                                    key={special.id}
                                                    className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-[10px] p-5 border border-sage/10"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 grid place-items-center bg-gradient-to-br from-sage/20 to-sage/10 rounded-[10px]">
                                                            <Icon className="w-6 h-6 text-sage" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-600 text-charcoal mb-0.5">{special.name}</h4>
                                                            <p className="text-sm text-charcoal/70">{special.description}</p>
                                                        </div>
                                                    </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                    </div>

                    {/* SIDEBAR: Reviews */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-32 bg-off-white/90 backdrop-blur-lg rounded-[12px] shadow-sm border border-sage/10 p-5 h-[75vh] overflow-y-auto custom-scroll animate-fade-in-up animate-delay-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10">
                                        <MessageSquareText className="w-4 h-4 text-sage" />
                                    </span>
                                    <h3 className="text-base sm:text-lg font-700 text-charcoal">Community Reviews</h3>
                                </div>
                                <Link
                                    href={`/business/${business.id}/review`}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sage to-sage/90 text-white text-xs sm:text-sm font-600 py-2 px-3 sm:px-4"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Write
                                </Link>
                            </div>

                            {/* Review Cards */}
                            <div className="space-y-3">
                                <PremiumReviewCard
                                    author={business.reviews[0].author}
                                    rating={business.reviews[0].rating}
                                    text={business.reviews[0].text}
                                    date={business.reviews[0].date}
                                    tags={business.reviews[0].tags}
                                    highlight="Top Reviewer"
                                    verified
                                />
                                <PremiumReviewCard
                                    author={business.reviews[1].author}
                                    rating={business.reviews[1].rating}
                                    text={business.reviews[1].text}
                                    date={business.reviews[1].date}
                                    tags={business.reviews[1].tags}
                                    highlight="Local Guide"
                                    verified={false}
                                />
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
        </>
    );
}
