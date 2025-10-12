"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import {
  User as UserIcon,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Trophy,
  Star as StarIcon,
  CheckCircle,
  Calendar,
  Pencil,
  Settings,
  Bell,
  Lock,
  LogOut,
  Building2,
} from "lucide-react";

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

// ---------- Frosted gradient helpers ----------
const glassHeader = `
  relative z-10
  px-3 sm:px-4 py-4 sm:py-6
  border-b border-black/5
  bg-white
`.replace(/\s+/g, " ");

const glassCard = `
  relative overflow-hidden rounded-2xl
  border border-black/5
  backdrop-blur-xl
  supports-[backdrop-filter]:bg-transparent
  before:content-[''] before:absolute before:inset-0 before:pointer-events-none
  before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75),rgba(255,255,255,0.60))]
  after:content-[''] after:absolute after:inset-0 after:pointer-events-none
  after:bg-[radial-gradient(500px_280px_at_10%_0%,rgba(232,215,146,0.12),transparent_65%),radial-gradient(450px_240px_at_90%_0%,rgba(209,173,219,0.10),transparent_65%)]
`.replace(/\s+/g, " ");

// ---------------------------------------------

// Types
interface UserProfile {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  locale: string;
  onboarding_step: string;
  is_top_reviewer: boolean;
  reviews_count: number;
  badges_count: number;
  interests_count: number;
  last_interests_updated: string | null;
  created_at: string;
  updated_at: string;
}
interface UserInterest {
  interest_id: string;
  interests: { id: string; name: string };
}
interface Review {
  id: string;
  business_name: string;
  rating: number;
  review_text: string | null;
  is_featured: boolean;
  created_at: string;
  business_image_url?: string | null;
}
interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: string;
}
interface UserAchievement {
  achievement_id: string;
  earned_at: string;
  achievements: Achievement;
}

function SafeAvatar({
  src,
  alt,
  size = 64,
  className = "",
}: {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const showPlaceholder = !src || !src.trim() || imageError;

  if (showPlaceholder) {
    return (
      <div
        className={`${className} bg-sage/10 flex items-center justify-center border border-sage/20 rounded-full`}
        style={{ width: size, height: size }}
        aria-label="Profile picture placeholder"
      >
        <UserIcon
          className="text-sage"
          style={{ width: size * 0.55, height: size * 0.55 }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={className}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        placeholder="empty"
      />
      {!imageLoaded && !imageError && (
        <div
          className="absolute inset-0 bg-sage/10 flex items-center justify-center border border-sage/20 rounded-full"
          style={{ width: size, height: size }}
          aria-label="Loading profile picture"
        >
          <UserIcon
            className="text-sage"
            style={{ width: size * 0.5, height: size * 0.5 }}
          />
        </div>
      )}
    </div>
  );
}

function BusinessThumb({
  name,
  imageUrl,
  size = 40,
  rounded = true,
}: {
  name: string;
  imageUrl?: string | null;
  size?: number;
  rounded?: boolean;
}) {
  const [err, setErr] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  const radius = rounded ? "rounded-full" : "rounded-md";

  if (!imageUrl || err) {
    return (
      <div
        className={`relative ${radius} bg-gradient-to-br from-sage/15 to-coral/10 border border-charcoal/10 flex items-center justify-center`}
        style={{ width: size, height: size }}
        aria-label={`${name} placeholder image`}
      >
        <Building2
          className="text-sage"
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
        <span className="sr-only">{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${radius} overflow-hidden`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl}
        alt={`${name} thumbnail`}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setErr(true)}
      />
    </div>
  );
}

function ProfileContent() {
  const { user, logout } = useAuth();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mockProfile: UserProfile = {
      user_id: user?.id || "dummy-user-id",
      username: user?.email?.split("@")[0] || "foodie_explorer",
      display_name:
        (user as any)?.name || user?.email?.split("@")[0] || "Alex Johnson",
      avatar_url: (user as any)?.avatar_url || null,
      locale: "en_US",
      onboarding_step: "complete",
      is_top_reviewer: true,
      reviews_count: 8,
      badges_count: 3,
      interests_count: 4,
      last_interests_updated: new Date().toISOString(),
      created_at: user?.created_at || new Date().toISOString(),
      updated_at: user?.updated_at || new Date().toISOString(),
    };

    const defaultInterests = [
      "food-drink",
      "arts-culture",
      "outdoors-adventure",
      "nightlife-entertainment",
    ];
    const mockUserInterests: UserInterest[] = defaultInterests.map(
      (interestId) => ({
        interest_id: interestId,
        interests: {
          id: interestId,
          name: interestId
            .replace("-", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        },
      })
    );

    const mockReviews: Review[] = [
      {
        id: "1",
        business_name: "The Pot Luck Club",
        rating: 5,
        review_text:
          "Amazing rooftop dining experience with incredible city views!",
        is_featured: true,
        created_at: "2024-01-15T10:30:00Z",
        business_image_url: null,
      },
      {
        id: "2",
        business_name: "Kirstenbosch Gardens",
        rating: 5,
        review_text: "Perfect place for a weekend picnic and nature walks.",
        is_featured: false,
        created_at: "2024-01-10T14:20:00Z",
        business_image_url: null,
      },
      {
        id: "3",
        business_name: "La Colombe Restaurant",
        rating: 4,
        review_text:
          "Excellent wine selection and beautiful vineyard setting.",
        is_featured: false,
        created_at: "2024-01-05T19:45:00Z",
        business_image_url: null,
      },
      {
        id: "4",
        business_name: "V&A Waterfront",
        rating: 4,
        review_text:
          "Great shopping and entertainment hub with harbor views.",
        is_featured: false,
        created_at: "2023-12-28T16:15:00Z",
        business_image_url: null,
      },
      {
        id: "5",
        business_name: "Chapman's Peak Drive",
        rating: 5,
        review_text:
          "Breathtaking coastal drive - must do when visiting Cape Town!",
        is_featured: true,
        created_at: "2023-12-20T09:30:00Z",
        business_image_url: null,
      },
    ];

    const mockAchievements: UserAchievement[] = [
      {
        achievement_id: "1",
        earned_at: "2024-01-01T12:00:00Z",
        achievements: {
          id: "1",
          name: "Local Explorer",
          description: "Reviewed 5 different businesses in your area",
          icon: "map",
          category: "discovery",
        },
      },
      {
        achievement_id: "2",
        earned_at: "2024-01-10T12:00:00Z",
        achievements: {
          id: "2",
          name: "Top Reviewer",
          description: "Earned featured review status",
          icon: "trophy",
          category: "quality",
        },
      },
      {
        achievement_id: "3",
        earned_at: "2024-01-15T12:00:00Z",
        achievements: {
          id: "3",
          name: "Community Helper",
          description:
            "Your reviews helped 50+ people discover great places",
          icon: "heart",
          category: "community",
        },
      },
    ];

    setProfile(mockProfile);
    setUserInterests(mockUserInterests);
    setReviews(mockReviews);
    setAchievements(mockAchievements);
    setError(null);
  }, [user]);

  const handleLogout = () => logout();

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const active = i < rating;
      return (
        <StarIcon
          key={i}
          className={active ? "text-coral" : "text-gray-300"}
          style={{ width: 16, height: 16, fill: active ? "currentColor" : "none" }}
          aria-hidden
        />
      );
    });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const formatMemberSince = (d: string) => {
    const date = new Date(d);
    const year = date.getFullYear().toString().slice(-2);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} '${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-white relative">
        <div className="pt-4 pb-6 relative z-10">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className={`${glassCard}`}>
                <div className="relative z-[1] p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-charcoal/10 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-6 bg-charcoal/10 rounded w-48"></div>
                        <div className="h-4 bg-charcoal/10 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="text-center">
                          <div className="h-8 bg-charcoal/10 rounded mb-2"></div>
                          <div className="h-4 bg-charcoal/10 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* …more skeletons if needed */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-dvh bg-white relative">
        <div className="pt-4 pb-6 relative z-10">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className={`${glassCard} text-center`}>
                <div className="relative z-[1] p-6">
                  <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
                  <h2 className="font-sf text-xl font-600 text-charcoal mb-2">
                    {error || "Profile not found"}
                  </h2>
                  <p className="text-charcoal/60 mb-4">
                    Please try refreshing the page or contact support if the problem persists.
                  </p>
                  <Link
                    href="/home"
                    className="inline-flex items-center space-x-2 bg-sage text-white px-6 py-3 rounded-6 font-sf font-600 hover:bg-sage/90 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-white via-sage/[0.015] to-white relative">
      {/* Floating background orbs remain */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Premium gradient overlay for glassy effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(116,145,118,0.03),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(214,116,105,0.02),transparent_50%)]" />
      </div>

      {/* ---------- Page Header (kept simple motion, no scroll-reveal) ---------- */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className={glassHeader}
      >
        <div className="relative z-[1] flex items-center justify-between max-w-[1300px] mx-auto">
          <Link href="/home" className="group flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center border border-charcoal/5 hover:border-sage/20 mr-2 sm:mr-4"
            >
              <ArrowLeft
                className="text-charcoal/70 group-hover:text-sage transition-colors duration-300"
                size={22}
              />
            </motion.div>
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
              className="font-sf text-base sm:text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal"
            >
              Your Profile
            </motion.h1>
          </Link>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="pt-2 pb-6 relative z-10">
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header Card */}
            <div className={glassCard}>
              <div className="relative z-[1] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16">
                        <SafeAvatar
                          src={profile.avatar_url}
                          alt="Profile picture"
                          size={64}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h1 className="font-sf text-xl font-700 text-charcoal">
                          @{profile.username || profile.display_name || "User"}
                        </h1>
                      </div>
                      {profile.is_top_reviewer && (
                        <div className="flex items-center space-x-1 mb-2">
                          <Trophy className="text-coral w-4 h-4" />
                          <span className="text-sm font-600 text-coral">
                            Top Reviewer in Cape Town this Month
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Edit profile"
                    className="w-8 h-8 bg-sage/10 hover:bg-sage/20 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <Pencil className="text-sage w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className={glassCard}>
              <div className="relative z-[1] p-5">
                <h2 className="font-sf text-lg font-700 text-charcoal mb-4">
                  Stats Overview
                </h2>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center px-1">
                    <div className="flex flex-col items-center mb-2">
                      <StarIcon
                        className="text-coral w-5 h-5 mb-1"
                        style={{ fill: "currentColor" }}
                      />
                      <span className="font-sf text-xl font-700 text-charcoal leading-tight">
                        {profile.reviews_count}
                      </span>
                    </div>
                    <span className="text-sm font-400 text-charcoal/60 leading-tight">
                      reviews
                    </span>
                  </div>
                  <div className="text-center px-1">
                    <div className="flex flex-col items-center mb-2">
                      <Trophy className="text-sage w-5 h-5 mb-1" />
                      <span className="font-sf text-xl font-700 text-charcoal leading-tight">
                        {profile.badges_count}
                      </span>
                    </div>
                    <span className="text-sm font-400 text-charcoal/60 leading-tight">
                      badges
                    </span>
                  </div>
                  <div className="text-center px-1">
                    <div className="flex flex-col items-center mb-2">
                      <Calendar className="text-sage w-5 h-5 mb-1" />
                      <span className="font-sf text-sm font-700 text-charcoal leading-tight">
                        {formatMemberSince(profile.created_at)}
                      </span>
                    </div>
                    <span className="text-xs font-400 text-charcoal/60 leading-tight">
                      member since
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Contributions */}
            <div className={glassCard}>
              <div className="relative z-[1] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sf text-lg font-700 text-charcoal">
                    Your Contributions
                  </h2>
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-sm text-coral font-500 hover:text-coral/80 transition-colors duration-200 flex items-center space-x-1"
                    aria-expanded={showAllReviews}
                  >
                    <span>{showAllReviews ? "Hide" : "See all reviews"}</span>
                    {showAllReviews ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="space-y-3">
                  {reviews
                    .slice(0, showAllReviews ? undefined : 2)
                    .map((review) => (
                      <div
                        key={review.id}
                        className="flex items-center justify-between py-3 border-b border-sage/10 last:border-b-0"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <BusinessThumb
                            name={review.business_name}
                            imageUrl={review.business_image_url}
                            size={40}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-sf text-base font-700 text-charcoal truncate">
                                {review.business_name}
                              </span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              {review.is_featured && (
                                <span className="text-xs text-coral font-600 whitespace-nowrap">
                                  (Featured)
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-charcoal/60">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <button className="text-coral text-sm font-500 hover:text-coral/80 transition-colors duration-200">
                            Click to see
                          </button>
                          <div className="text-xs text-charcoal/50 mt-1">
                            full review
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Your Achievements */}
            <div className={glassCard}>
              <div className="relative z-[1] p-5">
                <h2 className="font-sf text-lg font-600 text-charcoal mb-4">
                  Your Achievements
                </h2>
                <div className="space-y-3">
                  {achievements.map((ua) => (
                    <div
                      key={ua.achievement_id}
                      className="flex items-center space-x-3 p-3 transition-all duration-200 bg-sage/10 border border-sage/20 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage/20">
                        <Trophy className="w-5 h-5 text-sage" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-sf text-base font-600 text-charcoal">
                          {ua.achievements.name}
                        </span>
                        <p className="text-sm text-charcoal/60 mt-1">
                          {ua.achievements.description}
                        </p>
                      </div>
                      <CheckCircle className="text-sage w-5 h-5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className={glassCard}>
              <div className="relative z-[1] p-5">
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Settings className="text-gray-500 w-5 h-5" />
                      <span className="font-sf text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                        Account Settings
                      </span>
                    </div>
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Bell className="text-gray-500 w-5 h-5" />
                      <span className="font-sf text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                        Notifications
                      </span>
                    </div>
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Lock className="text-gray-500 w-5 h-5" />
                      <span className="font-sf text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                        Privacy & Data
                      </span>
                    </div>
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 hover:bg-coral/5 transition-colors duration-200 group rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <LogOut className="text-coral w-5 h-5" />
                      <span className="font-sf text-base font-500 text-coral group-hover:text-coral/80 transition-colors duration-200">
                        Log Out
                      </span>
                    </div>
                    <ChevronRight className="text-coral w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
