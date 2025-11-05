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
  bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md
  border border-white/50 ring-1 ring-white/20
  shadow-lg shadow-sage/20
`.replace(/\s+/g, " ");

export default function ReviewSidebar({ otherReviews }: ReviewSidebarProps) {
  return (
    <>
      {/* Desktop: Aligned with form */}
      <div className={`hidden lg:block`}>
        <div className={frostyPanel}>
          <div className="relative z-[1]">
            <h3 className="text-sm font-bold text-charcoal font-urbanist px-3 pt-4 pb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              What others are saying
            </h3>
            <div className="px-3 pb-4 space-y-2 xl:space-y-3 max-h-[600px] overflow-y-auto custom-scroll">
              {otherReviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-sage/10 bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md p-3 relative overflow-hidden">
                  {/* subtle glows */}
                  <span className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-sage/10 blur-lg" />
                  <span className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-coral/10 blur-lg" />
                  <div className="flex gap-3 relative z-10">
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
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-charcoal font-urbanist truncate" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{r.user.name}</p>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-coral" style={{ fill: "currentColor" }} />
                          <span className="text-[12px] text-charcoal/60 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{r.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-charcoal/60 mb-1 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
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
                      <p className="text-sm sm:text-[0.92rem] text-charcoal/90 leading-relaxed mb-2 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{r.text}</p>
                      {r.image && (
                        <div className="relative mt-2 w-full h-20 rounded-md overflow-hidden">
                          <Image
                            src={r.image}
                            alt={`${r.business} photo`}
                            fill
                            className="object-cover"
                            sizes="320px"
                            quality={85}
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-charcoal/60 mt-2">
                        <Heart size={12} />
                        <span className="text-[10px] font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{r.likes}</span>
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
      <div className="lg:hidden mt-4 sm:mt-6">
        <h3 className="text-sm font-bold text-charcoal font-urbanist px-4 pt-4 pb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>What others are saying</h3>
        <div className="mt-2 sm:mt-3 overflow-x-auto hide-scrollbar">
          <ul className="flex gap-2 sm:gap-3 px-4 pb-4">
            {otherReviews.map((r) => (
              <li key={r.id} className="min-w-[240px] sm:min-w-[260px] max-w-[260px] sm:max-w-[280px] bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md border border-sage/10 rounded-2xl p-3 sm:p-4 relative overflow-hidden">
                {/* subtle glows */}
                <span className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-sage/10 blur-lg" />
                <span className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-coral/10 blur-lg" />
                <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 bg-sage/10">
                    {r.user.avatar ? (
                      <Image
                        src={r.user.avatar}
                        alt={`${r.user.name} avatar`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 32px, 40px"
                        quality={85}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sage">•</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal font-urbanist truncate" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{r.user.name}</p>
                    <div className="flex items-center gap-1 text-[12px] text-charcoal/60 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                      <Star size={12} className="text-coral" style={{ fill: "currentColor" }} />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-[0.92rem] text-charcoal/90 leading-relaxed mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3 font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{r.text}</p>

                {r.image && (
                  <div className="relative mt-2 sm:mt-3 w-full h-20 sm:h-24 rounded-md overflow-hidden">
                    <Image
                      src={r.image}
                      alt={`${r.business} photo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 240px, 260px"
                      quality={85}
                    />
                  </div>
                )}

                <div className="flex items-center gap-1 text-charcoal/60 mt-2 sm:mt-3">
                  <Heart size={12} />
                  <span className="text-[10px] font-urbanist" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{r.likes}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
