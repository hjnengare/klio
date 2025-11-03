"use client";

import { Star, BadgeCheck, ShieldCheck, ThumbsUp, Reply, Share2, Flag, MoreHorizontal, User } from "lucide-react";
import { useState } from "react";

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

    return (
        <div className="relative overflow-hidden rounded-xl border border-sage/10 bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md p-4">
            {/* subtle glows */}
            <span className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-sage/10 blur-lg" />
            <span className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-coral/10 blur-lg" />

            <div className="flex items-start gap-3 sm:gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                    {profileImage && !imageError ? (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-1 ring-sage/20">
                            <img 
                                src={profileImage} 
                                alt={`${author} profile`}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        </div>
                    ) : (
                        <div className="grid place-items-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-sage/20 to-sage/10 ring-1 ring-sage/20">
                            {profileImage && imageError ? (
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-sage" />
                            ) : (
                                <span className="text-sage font-semibold text-sm sm:text-base">{author?.[0]?.toUpperCase() || "U"}</span>
                            )}
                        </div>
                    )}
                    {verified && (
                        <span className="absolute -bottom-1 -right-1 grid h-4 w-4 sm:h-5 sm:w-5 place-items-center rounded-full bg-off-white shadow ring-1 ring-sage/20">
                            <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sage" />
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

                    <p className="text-sm sm:text-[0.92rem] text-charcoal/90 leading-relaxed mb-2">{text}</p>

                    {/* Review Images */}
                    {reviewImages && reviewImages.length > 0 && (
                        <div className="mb-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
                                {reviewImages.slice(0, 8).map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-sage/10">
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
                                    className="inline-flex items-center gap-1 rounded-full border border-sage/25 bg-sage/10 px-2 py-0.5 text-[11px] text-sage"
                                >
                                    @ {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1 flex-wrap">
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] text-charcoal/80 hover:bg-charcoal/5 transition">
                                <ThumbsUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Helpful</span>
                            </button>
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] text-charcoal/80 hover:bg-charcoal/5 transition">
                                <Reply className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Reply</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] text-charcoal/70 hover:bg-charcoal/5 transition">
                                <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Share</span>
                            </button>
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-2 py-1.5 sm:px-2.5 text-[10px] sm:text-[11px] text-charcoal/70 hover:bg-charcoal/5 transition">
                                <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden sm:inline">Report</span>
                            </button>
                            <button
                                className="inline-flex rounded-full border border-charcoal/10 p-1 sm:p-1.5 text-charcoal/60 hover:bg-charcoal/5 transition"
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
