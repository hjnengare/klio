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
      {/* Google Fonts for Lobster Two */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-coral/[0.02] to-white relative overflow-hidden">
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
        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={special.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop&crop=center"}
                  alt={special.alt || special.title}
                  fill
                  className="object-cover"
                  priority
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
                      ? "bg-red-500/90 text-white border-red-500/50"
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
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4"
                  style={{ fontFamily: '"Lobster Two", cursive' }}
                >
                  {special.title}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500 fill-current" size={20} />
                    <span className="text-lg font-semibold text-charcoal">{special.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal/70">
                    <MapPin size={18} />
                    <span className="font-medium">{special.location}</span>
                  </div>
                </div>
              </motion.div>

              {/* Special Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
              >
                <h2 className="text-2xl font-bold text-charcoal mb-6">Special Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center">
                      <Calendar className="text-coral" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/60">Valid</p>
                      <p className="font-semibold text-charcoal">{special.startDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center">
                      <Percent className="text-sage" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/60">Discount</p>
                      <p className="font-semibold text-charcoal">{special.price || "Special Price"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center">
                      <Clock className="text-coral" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/60">Available</p>
                      <p className="font-semibold text-charcoal">Limited Time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center">
                      <Users className="text-sage" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/60">Terms</p>
                      <p className="font-semibold text-charcoal">See venue for details</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
              >
                <h2 className="text-2xl font-bold text-charcoal mb-4">About This Special</h2>
                <p className="text-charcoal/80 leading-relaxed text-lg">
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
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 sticky top-24"
              >
                <h3 className="text-xl font-bold text-charcoal mb-4">Claim This Special</h3>
                
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-sage to-sage/90 hover:from-sage/90 hover:to-sage/80 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Visit Venue
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-coral to-coral/90 hover:from-coral/90 hover:to-coral/80 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Call for Details
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-charcoal/10">
                  <h4 className="font-semibold text-charcoal mb-3">Share Special</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                      <Facebook size={18} className="mx-auto" />
                    </button>
                    <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                      <Instagram size={18} className="mx-auto" />
                    </button>
                    <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                      <Twitter size={18} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
              >
                <h3 className="text-xl font-bold text-charcoal mb-4">Venue Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="text-coral" size={18} />
                    <span className="text-charcoal/80">+44 20 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="text-sage" size={18} />
                    <span className="text-charcoal/80">www.example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-coral" size={18} />
                    <span className="text-charcoal/80">{special.location}</span>
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
