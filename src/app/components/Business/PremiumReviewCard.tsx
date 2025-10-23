"use client";

import { Star, BadgeCheck, ShieldCheck, ThumbsUp, Reply, Share2, Flag, MoreHorizontal } from "lucide-react";

interface PremiumReviewCardProps {
    author: string;
    rating: number;
    text: string;
    date: string;
    tags?: string[];
    highlight?: string;
    verified?: boolean;
}

export function PremiumReviewCard({
    author,
    rating,
    text,
    date,
    tags,
    highlight = "Top Reviewer",
    verified = true,
}: PremiumReviewCardProps) {
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
