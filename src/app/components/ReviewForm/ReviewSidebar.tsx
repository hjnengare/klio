"use client";

import Image from "next/image";
import { Star, Heart, MapPin, Calendar } from "lucide-react";

interface SmallReview {
  id: string;
  user: { name: string; avatar?: string; location?: string };
  business: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
  image?: string;
}

interface ReviewSidebarProps {
  otherReviews: SmallReview[];
}

const frostyPanel = `
  relative overflow-hidden rounded-2xl
  border border-black/5
  backdrop-blur-xl supports-[backdrop-filter]:bg-transparent
  before:content-[''] before:absolute before:inset-0 before:pointer-events-none
  before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.62))]
`.replace(/\s+/g, " ");

export default function ReviewSidebar({ otherReviews }: ReviewSidebarProps) {
  return (
    <>
      {/* Desktop: FIXED frosty panel */}
      <div className={`hidden lg:block lg:fixed right-[max(1rem,calc((100vw-80rem)/2))] top-24 w-[360px] max-h-[calc(100vh-7rem)] overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent`}>
        <div className={frostyPanel}>
          <div className="relative z-[1]">
            <h3 className="text-lg font-700 text-charcoal px-3 pt-3 pb-2 sticky top-0">
              What others are saying
            </h3>
            <div className="px-3 pb-3 space-y-3">
              {otherReviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-black/5 p-3 bg-off-white/70">
                  <div className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-sage/10">
                      {r.user.avatar ? (
                        <Image
                          src={r.user.avatar}
                          alt={`${r.user.name} avatar`}
                          fill
                          className="object-cover"
                          sizes="48px"
                          quality={85}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sage">•</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-700 text-charcoal truncate">{r.user.name}</p>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-navbar-bg" style={{ fill: "currentColor" }} />
                          <span className="text-xs text-charcoal/70">{r.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-charcoal/50 mt-0.5">
                        {r.user.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} />
                            {r.user.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {r.date}
                        </span>
                      </div>
                      <p className="text-sm text-charcoal/80 mt-2 line-clamp-3">{r.text}</p>
                      {r.image && (
                        <div className="relative mt-3 w-full h-24 rounded-md overflow-hidden">
                          <Image
                            src={r.image}
                            alt={`${r.business} photo`}
                            fill
                            className="object-cover"
                            sizes="360px"
                            quality={85}
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-charcoal/60 mt-3">
                        <Heart size={14} />
                        <span className="text-xs">{r.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet horizontal list */}
      <div className="lg:hidden mt-6">
        <h3 className="text-base font-700 text-charcoal px-4">What others are saying</h3>
        <div className="mt-3 overflow-x-auto hide-scrollbar">
          <ul className="flex gap-3 px-4 pb-2">
            {otherReviews.map((r) => (
              <li key={r.id} className="min-w-[260px] max-w-[280px] bg-off-white border border-sage/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-sage/10">
                    {r.user.avatar ? (
                      <Image
                        src={r.user.avatar}
                        alt={`${r.user.name} avatar`}
                        fill
                        className="object-cover"
                        sizes="40px"
                        quality={85}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sage">•</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-700 text-charcoal truncate">{r.user.name}</p>
                    <div className="flex items-center gap-1 text-xs text-charcoal/60">
                      <Star size={12} className="text-navbar-bg" style={{ fill: "currentColor" }} />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-charcoal/80 mt-2 line-clamp-3">{r.text}</p>

                {r.image && (
                  <div className="relative mt-3 w-full h-24 rounded-md overflow-hidden">
                    <Image
                      src={r.image}
                      alt={`${r.business} photo`}
                      fill
                      className="object-cover"
                      sizes="260px"
                      quality={85}
                    />
                  </div>
                )}

                <div className="flex items-center gap-1 text-charcoal/60 mt-3">
                  <Heart size={14} />
                  <span className="text-xs">{r.likes}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
