"use client";

import { useState } from "react";
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
    compact?: boolean;
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
    compact = false,
}: PremiumReviewCardProps) {
    const rounded = Math.round(rating);
    const [imageError, setImageError] = useState(false);

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-md transition-shadow duration-300 border-white/50 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 ring-1 ring-white/20 text-charcoal shadow-[0_15px_40px_rgba(15,23,42,0.08)] ${
                compact ? 'p-3' : 'p-4'
            }`}
        >
            {/* Glass depth overlay - matching BusinessCard */}
            <div className="absolute inset-0 bg-gradient-to-br from-off-white/5 via-transparent to-transparent pointer-events-none z-0" />
            {/* subtle glows - matching BusinessCard style */}
            <span
                className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full blur-lg bg-sage/10"
            />
            <span
                className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full blur-lg bg-coral/10"
            />

            <div className={`flex items-start gap-2 sm:gap-3 relative z-10 ${compact ? 'gap-2' : ''}`}>
                {/* Avatar */}
                <div className="relative shrink-0">
                    {profileImage && !imageError ? (
                        <div
                            className={`rounded-full overflow-hidden ring-1 ring-white/30 ${
                                compact ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-8 w-8 sm:h-10 sm:w-10'
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
                            className={`grid place-items-center rounded-full ring-1 bg-off-white/95 ring-white/30 border border-white/30 ${
                                compact ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-8 w-8 sm:h-10 sm:w-10'
                            }`}
                        >
                            <User className={`text-charcoal/60 ${compact ? 'h-3 w-3 sm:h-3.5 sm:w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
                        </div>
                    )}
                    {verified && (
                        <span
                            className={`absolute -bottom-1 -right-1 grid place-items-center rounded-full shadow ring-1 bg-off-white/95 ring-white/30 border border-white/30 ${
                                compact ? 'h-3 w-3 sm:h-3.5 sm:w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'
                            }`}
                        >
                            <BadgeCheck className={`text-sage ${compact ? 'h-2.5 w-2.5 sm:h-3 sm:w-3' : 'h-3 w-3 sm:h-3.5 sm:w-3.5'}`} />
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                    <div className={`flex items-start justify-between gap-2 ${compact ? 'mb-0.5' : 'mb-1'}`}>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`truncate font-semibold text-charcoal ${compact ? 'text-sm' : ''}`}>
                                    {author}
                                </span>
                                {highlight && !compact && (
                                    <span
                                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] border-sage/20 bg-sage/10 text-sage"
                                    >
                                        <ShieldCheck className="h-3 w-3" />
                                        {highlight}
                                    </span>
                                )}
                            </div>
                            <span className={`text-charcoal/60 ${compact ? 'text-[11px]' : 'text-[12px]'}`}>{date}</span>
                        </div>
                        {/* Stars */}
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => {
                                const fill = i < rounded;
                                return (
                                    <span key={i} className={fill ? "text-coral" : "text-gray-300"}>
                                        <Star className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} fill={fill ? "currentColor" : "none"} />
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <p
                        className={`leading-relaxed mb-2 text-charcoal/90 ${
                            compact ? 'text-xs sm:text-sm mb-1.5 line-clamp-4' : 'text-sm sm:text-[0.92rem]'
                        }`}
                    >
                        {text}
                    </p>

                    {/* Review Images - Show in compact mode too, just limit count */}
                    {reviewImages && reviewImages.length > 0 && (
                        <div className={compact ? 'mb-2' : 'mb-3'}>
                            <div className={`grid gap-1.5 sm:gap-2 ${
                                compact 
                                    ? 'grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-1.5' 
                                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                            }`}>
                                {reviewImages.slice(0, compact ? 4 : 8).map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-md overflow-hidden bg-sage/10 border border-white/30"
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

                    {tags && tags.length > 0 && !compact && (
                        <div className={`flex flex-wrap gap-1.5 ${compact ? 'mb-1' : 'mb-2'}`}>
                            {tags.slice(0, compact ? 2 : tags.length).map((t) => (
                                <span
                                    key={t}
                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 border-sage/25 bg-sage/10 text-sage ${
                                        compact ? 'text-[10px]' : 'text-[11px]'
                                    }`}
                                >
                                    @ {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions - hide in compact mode */}
                    {!compact && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                            <div className="flex items-center gap-1 flex-wrap">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition border-charcoal/10 text-charcoal/80 hover:bg-charcoal/5"
                                >
                                    <ThumbsUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="hidden sm:inline">Helpful</span>
                                </button>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition border-charcoal/10 text-charcoal/80 hover:bg-charcoal/5"
                                >
                                    <Reply className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="hidden sm:inline">Reply</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition border-charcoal/10 text-charcoal/70 hover:bg-charcoal/5"
                                >
                                    <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="hidden sm:inline">Share</span>
                                </button>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] transition border-charcoal/10 text-charcoal/70 hover:bg-charcoal/5"
                                >
                                    <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="hidden sm:inline">Report</span>
                                </button>
                                <button
                                    className="inline-flex rounded-full border p-1 sm:p-1.5 transition border-charcoal/10 text-charcoal/60 hover:bg-charcoal/5"
                                    aria-label="More"
                                >
                                    <MoreHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
