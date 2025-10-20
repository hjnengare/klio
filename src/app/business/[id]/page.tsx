"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useMemo, useState, useCallback } from "react";
import {
    ArrowLeft,
    Store,
    Star,
    Images,
    Calendar,
    MessageSquareText,
    Pencil,
    ChevronLeft,
    ChevronRight,
    Pizza,
    Music,
    ShieldCheck,
    BadgeCheck,
    ThumbsUp,
    Flag,
    Share2,
    Reply,
    MoreHorizontal,
} from "lucide-react";

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

/* ============================================================
   Minimal, dependency-free carousel WITH caption overlay
   ============================================================ */
function ImageCarousel({
    images,
    altBase,
    rating,
    metrics,
}: {
    images: string[];
    altBase: string;
    rating: number;
    metrics: { label: string; value: number; color: "sage" | "coral" }[];
}) {
    const [index, setIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const total = images.length;

    const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
    const go = useCallback((i: number) => setIndex(i), []);
    
    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    // Keyboard navigation for modal
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isModalOpen) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                next();
                break;
        }
    }, [isModalOpen, closeModal, prev, next]);

    // Add keyboard event listener when modal is open
    React.useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, handleKeyDown]);

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[10px] border border-sage/10 bg-off-white">
            {/* Slides */}
            <div
                className="relative h-[500px] sm:h-[520px] md:h-[540px] lg:h-[560px] overflow-hidden cursor-pointer group"
                onClick={openModal}
            >
                {images.map((src, i) => (
                    <div
                        key={src}
                        className={`absolute inset-0 transition-opacity duration-300 ${
                            i === index ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Image
                            src={src}
                            alt={`${altBase} image ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority={i === 0}
                            loading={i === 0 ? "eager" : "lazy"}
                        />
                        
                        {/* Zoom overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Caption overlay: rating + metrics */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 p-3 sm:p-4">
                <div className="mx-auto max-w-none">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-[12px] border border-white/40 bg-off-white/70 backdrop-blur-md px-3 sm:px-4 py-2 shadow-sm">
                        {/* Rating badge */}
                        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-3 py-1 text-white text-sm font-semibold shadow">
                            <Star className="h-4 w-4" />
                            {rating.toFixed(1)}
                        </span>

                        {/* Divider dot */}
                        <span className="hidden sm:inline text-charcoal/30">•</span>

                        {/* Metrics chips */}
                        <div className="flex flex-wrap items-center gap-2">
                            {metrics.map((m) => (
                                <span
                                    key={m.label}
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${m.color === "sage"
                                            ? "border-sage/25 text-sage bg-sage/10"
                                            : "border-coral/25 text-coral bg-coral/10"
                                        }`}
                                >
                                    {m.label}: {m.value}%
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button
                aria-label="Previous image"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-off-white/80 hobg-off-whiteff-white p-2 shadow-sm border border-black/5"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                aria-label="Next image"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-off-white/80 hobg-off-whiteff-white p-2 shadow-sm border border-black/5"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Image */}
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                            <Image
                                src={images[index]}
                                alt={`${altBase} image ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 80vw"
                                priority
                            />
                        </div>

                        {/* Modal Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prev();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        next();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {index + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ============================================================
   Premium Review Card (used in Sidebar)
   ============================================================ */
function PremiumReviewCard({
    author,
    rating,
    text,
    date,
    tags,
    highlight = "Top Reviewer",
    verified = true,
}: {
    author: string;
    rating: number;
    text: string;
    date: string;
    tags?: string[];
    highlight?: string;
    verified?: boolean;
}) {
    const rounded = Math.round(rating);

    return (
        <div className="relative overflow-hidden rounded-xl border border-sage/10 bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md p-4">
            {/* subtle glows */}
            <span className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-sage/10 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-coral/10 blur-2xl" />

            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="grid place-items-center h-10 w-10 rounded-full bg-gradient-to-br from-sage/20 to-sage/10 ring-1 ring-sage/20">
                        <span className="text-sage font-semibold">{author?.[0]?.toUpperCase() || "U"}</span>
                    </div>
                    {verified && (
                        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-off-white shadow ring-1 ring-sage/20">
                            <BadgeCheck className="h-3.5 w-3.5 text-sage" />
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="truncate text-charcoal font-semibold">{author}</span>
                                {highlight && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-sage/20 bg-sage/10 px-2 py-0.5 text-[10px] text-sage">
                                        <ShieldCheck className="h-3 w-3" />
                                        {highlight}
                                    </span>
                                )}
                            </div>
                            <span className="text-[12px] text-charcoal/60">{date}</span>
                        </div>
                        {/* Stars */}
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => {
                                const fill = i < rounded;
                                return (
                                    <span key={i} className={fill ? "text-coral" : "text-gray-300"}>
                                        <Star className="h-3.5 w-3.5" fill={fill ? "currentColor" : "none"} />
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <p className="text-[0.92rem] text-charcoal/90 leading-relaxed mb-2">{text}</p>

                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className="inline-flex items-center gap-1 rounded-full border border-sage/25 bg-sage/10 px-2 py-0.5 text-[11px] text-sage"
                                >
                                    @ {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2.5 py-1.5 text-[11px] text-charcoal/80 hover:bg-charcoal/5 transition">
                                <ThumbsUp className="h-3.5 w-3.5" />
                                Helpful
                            </button>
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2.5 py-1.5 text-[11px] text-charcoal/80 hover:bg-charcoal/5 transition">
                                <Reply className="h-3.5 w-3.5" />
                                Reply
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2.5 py-1.5 text-[11px] text-charcoal/70 hover:bg-charcoal/5 transition">
                                <Share2 className="h-3.5 w-3.5" />
                                Share
                            </button>
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2.5 py-1.5 text-[11px] text-charcoal/70 hover:bg-charcoal/5 transition">
                                <Flag className="h-3.5 w-3.5" />
                                Report
                            </button>
                            <button
                                className="inline-flex rounded-full border border-charcoal/10 p-1.5 text-charcoal/60 hover:bg-charcoal/5 transition"
                                aria-label="More"
                            >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
            <header className="fixed top-0 left-0 right-0 z-50 bg-off-white/90 backdrop-blur-xl border-b border-sage/10 px-4 py-4 shadow-sm animate-slide-in-top">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <Link
                            href="/home"
                            className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full"
                        >
                            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
                        </Link>

                    <h1 className="font-sf text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal animate-delay-100 animate-fade-in">
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
