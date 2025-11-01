"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Clock,
  Users,
  Share2,
  Bookmark,
  Heart,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Percent,
} from "lucide-react";
import { EVENTS_AND_SPECIALS, Event } from "../../data/eventsData";
import { useToast } from "../../contexts/ToastContext";

interface SpecialDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SpecialDetailPage({ params }: SpecialDetailPageProps) {
  const [special, setSpecial] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    // Find the special by ID
    const foundSpecial = EVENTS_AND_SPECIALS.find(e => e.id === resolvedParams.id);
    if (foundSpecial) {
      setSpecial(foundSpecial);
    }
    setLoading(false);
  }, [resolvedParams.id]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      "success"
    );
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showToast(
      isLiked ? "Removed from favorites" : "Added to favorites",
      "success"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: special?.title,
        text: special?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", "success");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-coral/[0.02] to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    );
  }

  if (!special) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-coral/[0.02] to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Special Not Found</h1>
          <Link href="/events-specials" className="text-coral hover:underline">
            Back to Events & Specials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-coral/[0.02] to-white relative overflow-hidden font-sf-pro">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-coral/3 via-transparent to-sage/3" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,116,105,0.03),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(116,145,118,0.025),transparent_50%)]" />
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="bg-off-white/95 backdrop-blur-md shadow-sm relative z-10 sticky top-0"
        >
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/events-specials" className="group flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-coral/20 hover:to-coral/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-coral/20 mr-3">
                  <ArrowLeft className="text-charcoal/70 group-hover:text-coral transition-colors duration-300" size={20} />
                </div>
                <span className="text-sm font-medium text-charcoal group-hover:text-coral transition-colors duration-300">
                  Back to Specials
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-gradient-to-br from-sage/10 to-sage/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-sage/5 hover:border-sage/20"
                  aria-label="Share special"
                >
                  <Share2 className="text-sage" size={18} />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border ${
                    isBookmarked
                      ? "bg-coral text-white border-coral"
                      : "bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-coral/20 hover:to-coral/10 border-charcoal/5 hover:border-coral/20"
                  }`}
                  aria-label="Bookmark special"
                >
                  <Bookmark className={isBookmarked ? "text-white" : "text-charcoal/70"} size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="relative z-10 max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl"
              >
                <Image
                  src={special.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop&crop=center&q=90"}
                  alt={special.alt || special.title}
                  fill
                  className="object-cover object-center"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 900px"
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Special Badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border bg-sage/90 text-white border-sage/50">
                    Special Offer
                  </span>
                </div>

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 ${
                    isLiked
                      ? "bg-coral/90 text-white border-coral/50"
                      : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                  }`}
                  aria-label="Like special"
                >
                  <Heart className={`mx-auto ${isLiked ? "fill-current" : ""}`} size={20} />
                </button>
              </motion.div>

              {/* Special Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1
                  className="text-xl font-bold text-charcoal mb-4 font-urbanist"
                >
                  {special.title}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="text-amber-400 fill-amber-400" size={16} />
                    <span className="text-sm font-semibold text-charcoal font-urbanist">{special.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal/70">
                    <MapPin size={14} />
                    <span className="text-xs font-medium font-urbanist">{special.location}</span>
                  </div>
                </div>
              </motion.div>

              {/* Special Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4"
              >
                <h2 className="text-lg font-bold text-charcoal mb-4 font-urbanist">Special Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-coral/10 rounded-full flex items-center justify-center">
                      <Calendar className="text-coral" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/60 font-urbanist">Valid</p>
                      <p className="text-sm font-semibold text-charcoal font-urbanist">{special.startDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center">
                      <Percent className="text-sage" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/60 font-urbanist">Discount</p>
                      <p className="text-sm font-semibold text-charcoal font-urbanist">{special.price || "Special Price"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-coral/10 rounded-full flex items-center justify-center">
                      <Clock className="text-coral" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/60 font-urbanist">Available</p>
                      <p className="text-sm font-semibold text-charcoal font-urbanist">Limited Time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center">
                      <Users className="text-sage" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/60 font-urbanist">Terms</p>
                      <p className="text-sm font-semibold text-charcoal font-urbanist">See venue for details</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4"
              >
                <h2 className="text-lg font-bold text-charcoal mb-3 font-urbanist">About This Special</h2>
                <p className="text-sm text-charcoal/80 leading-relaxed font-urbanist">
                  {special.description || "Don't miss out on this amazing special offer! This limited-time deal provides incredible value and a fantastic experience. Perfect for trying something new or treating yourself to something special."}
                </p>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4 sticky top-24"
              >
                <h3 className="text-lg font-bold text-charcoal mb-3 font-urbanist">Claim This Special</h3>

                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-sage to-sage/90 hover:from-sage/90 hover:to-sage/80 text-white font-semibold py-3 px-5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-urbanist">
                    Visit Venue
                  </button>

                  <button className="w-full bg-gradient-to-r from-coral to-coral/90 hover:from-coral/90 hover:to-coral/80 text-white font-semibold py-3 px-5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-urbanist">
                    Call for Details
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-charcoal/10">
                  <h4 className="text-sm font-semibold text-charcoal mb-2.5 font-urbanist">Share Special</h4>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white/30 hover:bg-coral text-charcoal/90 hover:text-white py-2 px-3 rounded-full transition-all duration-200 shadow-sm">
                      <Facebook size={16} className="mx-auto" />
                    </button>
                    <button className="flex-1 bg-white/30 hover:bg-sage text-charcoal/90 hover:text-white py-2 px-3 rounded-full transition-all duration-200 shadow-sm">
                      <Instagram size={16} className="mx-auto" />
                    </button>
                    <button className="flex-1 bg-white/30 hover:bg-charcoal text-charcoal/90 hover:text-white py-2 px-3 rounded-full transition-all duration-200 shadow-sm">
                      <Twitter size={16} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-4"
              >
                <h3 className="text-lg font-bold text-charcoal mb-3 font-urbanist">Venue Information</h3>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Phone className="text-coral" size={16} />
                    <span className="text-sm text-charcoal/80 font-urbanist">+44 20 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe className="text-sage" size={16} />
                    <span className="text-sm text-charcoal/80 font-urbanist">www.example.com</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="text-coral" size={16} />
                    <span className="text-sm text-charcoal/80 font-urbanist">{special.location}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
