"use client";

import { useMemo, useState } from "react";
import { Star, BadgeCheck, ShieldCheck, ThumbsUp, Reply, Share2, Flag, MoreHorizontal, User } from "lucide-react";

interface PremiumReviewCardProps {
    author: string;
    rating: number;
    text: string;
    date: string;
    tags?: string[];
    highlight?: string;
    verified?: boolean;
    profileImage?: string;
    reviewImages?: string[];
}

export function PremiumReviewCard({
    author,
    rating,
    text,
    date,
    tags,
    highlight = "Top Reviewer",
    verified = true,
    profileImage,
    reviewImages,
}: PremiumReviewCardProps) {
    const rounded = Math.round(rating);
    const [imageError, setImageError] = useState(false);
    const variant = useMemo(() => (Math.random() < 0.5 ? "sage" : "navy"), []);
    const isNavy = variant === "navy";

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-4 transition-shadow duration-300 ${
                isNavy
                    ? "border-navbar-bg/40 bg-gradient-to-br from-navbar-bg/95 via-navbar-bg/90 to-navbar-bg/85 text-white shadow-[0_18px_44px_rgba(22,29,38,0.3)]"
                    : "border-white/30 bg-gradient-to-br from-white/85 via-white/75 to-white/60 text-charcoal shadow-[0_15px_40px_rgba(15,23,42,0.08)]"
            }`}
        >
            {/* subtle glows */}
            <span
                className={`pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full blur-lg ${
                    isNavy ? "bg-white/15" : "bg-sage/10"
                }`}
            />
            <span
                className={`pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full blur-lg ${
                    isNavy ? "bg-white/10" : "bg-coral/10"
                }`}
            />

            <div className="flex items-start gap-3 sm:gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                    {profileImage && !imageError ? (
                        <div
                            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-1 ${
                                isNavy ? "ring-white/20" : "ring-sage/20"
                            }`}
                        >
                            <img
                                src={profileImage}
                                alt={`${author} profile`}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        </div>
                    ) : (
                        <div
                            className={`grid place-items-center h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-1 ${
                                isNavy
                                    ? "bg-white/15 ring-white/25"
                                    : "bg-gradient-to-br from-sage/20 to-sage/10 ring-sage/20"
                            }`}
                        >
                            <User className={`h-4 w-4 sm:h-5 sm:w-5 ${isNavy ? "text-white/80" : "text-sage"}`} />
                        </div>
                    )}
                    {verified && (
                        <span
                            className={`absolute -bottom-1 -right-1 grid h-4 w-4 sm:h-5 sm:w-5 place-items-center rounded-full shadow ring-1 ${
                                isNavy ? "bg-navbar-bg/80 ring-white/30" : "bg-off-white ring-sage/20"
                            }`}
                        >
                            <BadgeCheck className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isNavy ? "text-white" : "text-sage"}`} />
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`truncate font-semibold ${isNavy ? "text-white" : "text-charcoal"}`}>
                                    {author}
                                </span>
                                {highlight && (
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${
                                            isNavy
                                                ? "border-white/30 bg-white/10 text-white"
                                                : "border-sage/20 bg-sage/10 text-sage"
                                        }`}
                                    >
                                        <ShieldCheck className="h-3 w-3" />
                                        {highlight}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[12px] ${isNavy ? "text-white/70" : "text-charcoal/60"}`}>{date}</span>
                        </div>
                        {/* Stars */}
                        <div className={`flex items-center ${isNavy ? "text-white/80" : ""}`}>
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

                    <p
                        className={`text-sm sm:text-[0.92rem] leading-relaxed mb-2 ${
                            isNavy ? "text-white/85" : "text-charcoal/90"
                        }`}
                    >
                        {text}
                    </p>

                    {/* Review Images */}
                    {reviewImages && reviewImages.length > 0 && (
                        <div className="mb-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
                                {reviewImages.slice(0, 8).map((image, index) => (
                                    <div
                                        key={index}
                                        className={`relative aspect-square rounded-md overflow-hidden ${
                                            isNavy ? "bg-white/10" : "bg-sage/10"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
                                        isNavy
                                            ? "border-white/30 bg-white/10 text-white/85"
                                            : "border-sage/25 bg-sage/10 text-sage"
                                    }`}
                                >
                                    @ {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1 flex-wrap">
                            <button
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition ${
                                    isNavy
                                        ? "border-white/20 text-white/85 hover:bg-white/10"
                                        : "border-charcoal/10 text-charcoal/80 hover:bg-charcoal/5"
                                }`}
                            >
                                <ThumbsUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Helpful</span>
                            </button>
                            <button
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition ${
                                    isNavy
                                        ? "border-white/20 text-white/85 hover:bg-white/10"
                                        : "border-charcoal/10 text-charcoal/80 hover:bg-charcoal/5"
                                }`}
                            >
                                <Reply className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Reply</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                            <button
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition ${
                                    isNavy
                                        ? "border-white/25 text-white/85 hover:bg-white/10"
                                        : "border-charcoal/10 text-charcoal/70 hover:bg-charcoal/5"
                                }`}
                            >
                                <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Share</span>
                            </button>
                            <button
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition ${
                                    isNavy
                                        ? "border-white/25 text-white/85 hover:bg-white/10"
                                        : "border-charcoal/10 text-charcoal/70 hover:bg-charcoal/5"
                                }`}
                            >
                                <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Report</span>
                            </button>
                            <button
                                className={`inline-flex rounded-full border p-1 sm:p-1.5 transition ${
                                    isNavy
                                        ? "border-white/20 text-white/70 hover:bg-white/10"
                                        : "border-charcoal/10 text-charcoal/60 hover:bg-charcoal/5"
                                }`}
                                aria-label="More"
                            >
                                <MoreHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
