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
  relative overflow-hidden rounded-lg
  bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md
  border border-white/50 ring-1 ring-white/20
  shadow-lg shadow-sage/20
`.replace(/\s+/g, " ");

export default function ReviewSidebar({ otherReviews }: ReviewSidebarProps) {
  return (
    <>
      {/* Desktop: FIXED frosty panel */}
      <div className={`hidden lg:block lg:fixed right-[max(1rem,calc((100vw-80rem)/2))] top-24 w-[320px] xl:w-[360px] max-h-[calc(100vh-7rem)] overflow-y-auto px-3 xl:px-4 py-4 xl:py-6 space-y-3 xl:space-y-4 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent`}>
        <div className={frostyPanel}>
          <div className="relative z-[1]">
            <h3 className="text-base xl:text-lg font-700 text-charcoal px-3 pt-3 pb-2 sticky top-0">
              What others are saying
            </h3>
            <div className="px-3 pb-3 space-y-2 xl:space-y-3">
              {otherReviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-white/50 ring-1 ring-white/20 p-2 xl:p-3 bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md relative overflow-hidden">
                  {/* subtle glows */}
                  <span className="pointer-events-none absolute -top-4 -right-4 h-12 w-12 rounded-full bg-sage/10 blur-xl" />
                  <span className="pointer-events-none absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-coral/10 blur-xl" />
                  <div className="flex gap-2 xl:gap-3 relative z-10">
                    <div className="relative w-10 h-10 xl:w-12 xl:h-12 rounded-full overflow-hidden flex-shrink-0 bg-sage/10">
                      {r.user.avatar ? (
                        <Image
                          src={r.user.avatar}
                          alt={`${r.user.name} avatar`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1280px) 40px, 48px"
                          quality={85}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sage">•</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs xl:text-sm font-700 text-charcoal truncate">{r.user.name}</p>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-navbar-bg xl:w-3.5 xl:h-3.5" style={{ fill: "currentColor" }} />
                          <span className="text-[10px] xl:text-xs text-charcoal/70">{r.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 xl:gap-2 text-[10px] xl:text-xs text-charcoal/50 mt-0.5">
                        {r.user.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={10} className="xl:w-3 xl:h-3" />
                            {r.user.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={10} className="xl:w-3 xl:h-3" />
                          {r.date}
                        </span>
                      </div>
                      <p className="text-xs xl:text-sm text-charcoal/80 mt-1 xl:mt-2 line-clamp-2 xl:line-clamp-3">{r.text}</p>
                      {r.image && (
                        <div className="relative mt-2 xl:mt-3 w-full h-20 xl:h-24 rounded-md overflow-hidden">
                          <Image
                            src={r.image}
                            alt={`${r.business} photo`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1280px) 320px, 360px"
                            quality={85}
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-charcoal/60 mt-2 xl:mt-3">
                        <Heart size={12} className="xl:w-3.5 xl:h-3.5" />
                        <span className="text-[10px] xl:text-xs">{r.likes}</span>
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
        <h3 className="text-sm sm:text-base font-700 text-charcoal px-4">What others are saying</h3>
        <div className="mt-2 sm:mt-3 overflow-x-auto hide-scrollbar">
          <ul className="flex gap-2 sm:gap-3 px-4 pb-2">
            {otherReviews.map((r) => (
              <li key={r.id} className="min-w-[240px] sm:min-w-[260px] max-w-[260px] sm:max-w-[280px] bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-md border border-white/50 ring-1 ring-white/20 rounded-lg p-3 sm:p-4 relative overflow-hidden">
                {/* subtle glows */}
                <span className="pointer-events-none absolute -top-4 -right-4 h-12 w-12 rounded-full bg-sage/10 blur-xl" />
                <span className="pointer-events-none absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-coral/10 blur-xl" />
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
                    <p className="text-xs sm:text-sm font-700 text-charcoal truncate">{r.user.name}</p>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-charcoal/60">
                      <Star size={10} className="text-navbar-bg sm:w-3 sm:h-3" style={{ fill: "currentColor" }} />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-charcoal/80 mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3">{r.text}</p>

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
                  <Heart size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="text-[10px] sm:text-xs">{r.likes}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
