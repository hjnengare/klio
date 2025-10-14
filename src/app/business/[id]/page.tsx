"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
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

// Dynamic imports for premium animations
const FadeInUp = dynamic(() => import("../../components/Animations/FadeInUp"), {
    ssr: false,
});

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
    const total = images.length;

    const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
    const go = useCallback((i: number) => setIndex(i), []);

    return (
        <div className="relative w-full overflow-hidden rounded-[10px] border border-sage/10 bg-white">
            {/* Slides */}
            <div className="relative aspect-[16/9]">
                {images.map((src, i) => (
                    <motion.div
                        key={src}
                        className="absolute inset-0"
                        initial={false}
                        animate={{ x: (i - index) * 100 + "%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Image
                            src={src}
                            alt={`${altBase} image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            unoptimized
                        />
                    </motion.div>
                ))}
            </div>

            {/* Caption overlay: rating + metrics */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 p-3 sm:p-4">
                <div className="mx-auto max-w-none">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-[12px] border border-white/40 bg-white/70 backdrop-blur-md px-3 sm:px-4 py-2 shadow-sm">
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
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white p-2 shadow-sm border border-black/5"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                aria-label="Next image"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white p-2 shadow-sm border border-black/5"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-sage" : "w-2.5 bg-black/30 hover:bg-black/40"
                            }`}
                    />
                ))}
            </div>
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
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-xl border border-sage/10 bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md p-4"
        >
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
                        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white shadow ring-1 ring-sage/20">
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
        </motion.div>
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
        <div
            className="min-h-dvh bg-white/90 relative overflow-hidden"
            style={{
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
        >
            {/* Ambient background elements */}
            <div className="absolute inset-0 opacity-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 0.8 }}
                    transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-3xl"
                />
            </div>

            {/* Premium Header */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 bg-white/90 backdrop-blur-xl border-b border-sage/10 px-4 py-6 shadow-sm"
            >
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/home"
                            className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal"
                    >
                        {business.name}
                    </motion.h1>

                    {/* Profile Picture Placeholder */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
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
                    </motion.div>
                </div>
            </motion.header>

            <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
                {/* Two-column layout: main content + reviews sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* MAIN (span 2) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Photos (with metrics caption overlay) */}
                        <FadeInUp delay={0.1}>
                            <div className="bg-white/90 backdrop-blur-lg rounded-[10px] shadow-sm border border-sage/10 p-5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <motion.h3
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15, duration: 0.5 }}
                                        className="text-lg font-600 text-charcoal mb-4 flex items-center gap-3"
                                    >
                                        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10">
                                            <Images className="w-4 h-4 text-sage" />
                                        </span>
                                        Photos
                                    </motion.h3>

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
                        </FadeInUp>

                        {/* Specials & Events */}
                        <FadeInUp delay={0.2}>
                            <div className="bg-white/90 backdrop-blur-lg rounded-[10px] shadow-sm border border-sage/10 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl" />

                                <div className="relative z-10">
                                    <motion.h3
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="text-lg font-600 text-charcoal mb-6 flex items-center gap-3"
                                    >
                                        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral/20 to-coral/10">
                                            <Calendar className="w-4 h-4 text-coral" />
                                        </span>
                                        Specials & Events
                                    </motion.h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {business.specials.map((special, index) => {
                                            const Icon = special.icon === "pizza" ? Pizza : Music;
                                            return (
                                                <motion.div
                                                    key={special.id}
                                                    initial={{ opacity: 0, y: 14 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.25 + index * 0.05, duration: 0.45 }}
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
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </FadeInUp>
                    </div>

                    {/* SIDEBAR: Reviews */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white/90 backdrop-blur-lg rounded-[12px] shadow-sm border border-sage/10 p-5 h-[75vh] overflow-y-auto custom-scroll">
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
    );
}
