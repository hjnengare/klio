"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Ion } from "../components/Ion";
import { useScrollReveal } from "../hooks/useScrollReveal";

// Dynamic imports
const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

// Types based on new database schema
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
  interests: {
    id: string;
    name: string;
  };
}

interface Review {
  id: string;
  business_name: string;
  rating: number;
  review_text: string | null;
  is_featured: boolean;
  created_at: string;
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

/** A robust avatar that:
 *  - Uses `profilePicture` if provided
 *  - Falls back to ionicon person placeholder
 *  - Handles image load errors and swaps to fallback gracefully
 */
function SafeAvatar({
  src,
  alt,
  username,
  size = 64,
  className = "",
}: {
  src?: string;
  alt: string;
  username: string;
  size?: number;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If no src provided or image failed to load, show ionicon placeholder
  const showPlaceholder = !src || !src.trim() || imageError;

  if (showPlaceholder) {
    return (
      <div
        className={`${className} bg-sage/10 flex items-center justify-center border border-sage/20`}
        style={{ width: size, height: size }}
      >
        <Ion
          name="person"
          className={`text-sage text-[${Math.max(size * 0.5, 24)}px]`}
          label="Profile picture placeholder"
        />
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={className}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        placeholder="empty"
      // NOTE: if you are doing static export, use `unoptimized` here or set `images.unoptimized = true`
      // unoptimized
      />
      {/* Show ionicon while loading */}
      {!imageLoaded && !imageError && (
        <div
          className="absolute inset-0 bg-sage/10 flex items-center justify-center border border-sage/20"
          style={{ width: size, height: size }}
        >
          <Ion
            name="person"
            className={`text-sage text-[${Math.max(size * 0.5, 24)}px]`}
            label="Loading profile picture"
          />
        </div>
      )}
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data from auth context and create profile data
  useEffect(() => {
    // Always create dummy profile data for UI/UX design - no auth required
    const mockProfile: UserProfile = {
      user_id: user?.id || 'dummy-user-id',
      username: user?.email?.split('@')[0] || 'foodie_explorer',
      display_name: user?.name || user?.email?.split('@')[0] || 'Alex Johnson',
      avatar_url: user?.avatar_url || null,
      locale: 'en_US',
      onboarding_step: user?.profile?.onboarding_step || 'complete',
      is_top_reviewer: true, // Mock as top reviewer for demo
      reviews_count: 8,
      badges_count: 3,
      interests_count: user?.interests?.length || 4,
      last_interests_updated: new Date().toISOString(),
      created_at: user?.created_at || new Date().toISOString(),
      updated_at: user?.updated_at || new Date().toISOString()
    };

    // Create mock user interests from auth context or default interests
    const defaultInterests = ['food-drink', 'arts-culture', 'outdoors-adventure', 'nightlife-entertainment'];
    const interestsToUse = user?.interests && user.interests.length > 0 ? user.interests : defaultInterests;
    const mockUserInterests: UserInterest[] = interestsToUse.map((interestId, index) => ({
      interest_id: interestId,
      interests: {
        id: interestId,
        name: interestId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      }
    }));

    // Create mock reviews data
    const mockReviews: Review[] = [
      {
        id: '1',
        business_name: 'The Pot Luck Club',
        rating: 5,
        review_text: 'Amazing rooftop dining experience with incredible city views!',
        is_featured: true,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        business_name: 'Kirstenbosch Gardens',
        rating: 5,
        review_text: 'Perfect place for a weekend picnic and nature walks.',
        is_featured: false,
        created_at: '2024-01-10T14:20:00Z'
      },
      {
        id: '3',
        business_name: 'La Colombe Restaurant',
        rating: 4,
        review_text: 'Excellent wine selection and beautiful vineyard setting.',
        is_featured: false,
        created_at: '2024-01-05T19:45:00Z'
      },
      {
        id: '4',
        business_name: 'V&A Waterfront',
        rating: 4,
        review_text: 'Great shopping and entertainment hub with harbor views.',
        is_featured: false,
        created_at: '2023-12-28T16:15:00Z'
      },
      {
        id: '5',
        business_name: 'Chapman\'s Peak Drive',
        rating: 5,
        review_text: 'Breathtaking coastal drive - must do when visiting Cape Town!',
        is_featured: true,
        created_at: '2023-12-20T09:30:00Z'
      }
    ];

    // Create mock achievements
    const mockAchievements: UserAchievement[] = [
      {
        achievement_id: '1',
        earned_at: '2024-01-01T12:00:00Z',
        achievements: {
          id: '1',
          name: 'Local Explorer',
          description: 'Reviewed 5 different businesses in your area',
          icon: 'map',
          category: 'discovery'
        }
      },
      {
        achievement_id: '2',
        earned_at: '2024-01-10T12:00:00Z',
        achievements: {
          id: '2',
          name: 'Top Reviewer',
          description: 'Earned featured review status',
          icon: 'trophy',
          category: 'quality'
        }
      },
      {
        achievement_id: '3',
        earned_at: '2024-01-15T12:00:00Z',
        achievements: {
          id: '3',
          name: 'Community Helper',
          description: 'Your reviews helped 50+ people discover great places',
          icon: 'heart',
          category: 'community'
        }
      }
    ];

    // Set all data immediately without loading delays
    setProfile(mockProfile);
    setUserInterests(mockUserInterests);
    setReviews(mockReviews);
    setAchievements(mockAchievements);
  }, [user]);

  // Simplified scroll reveal for better performance
  const headerRef = useScrollReveal({ className: ["scroll-reveal"] });
  const statsRef = useScrollReveal({ className: ["scroll-reveal"] });
  const contributionsRef = useScrollReveal({ className: ["scroll-reveal"] });
  const achievementsRef = useScrollReveal({ className: ["scroll-reveal"] });
  const settingsRef = useScrollReveal({ className: ["scroll-reveal"] });

  const handleLogout = () => {
    logout();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ion
        key={index}
        name={index < rating ? "star" : "star-outline"}
        className={index < rating ? "text-coral text-[14px]" : "text-gray-300 text-[14px]"}
        label={index === 0 ? `Rating: ${rating} out of 5` : undefined}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + " '" + year;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-dvh bg-off-white relative">
        <div className="pt-4 pb-6 relative z-10">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-off-white backdrop-blur-sm p-6 border border-charcoal/10 shadow-sm">
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
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-dvh bg-off-white relative">
        <div className="pt-4 pb-6 relative z-10">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-off-white backdrop-blur-sm p-6 border border-red-200 shadow-sm text-center">
                <Ion name="alert-circle" className="text-red-500 text-[48px] mb-4" />
                <h2 className="font-urbanist text-xl font-600 text-charcoal mb-2">
                  {error || 'Profile not found'}
                </h2>
                <p className="text-charcoal/60 mb-4">
                  Please try refreshing the page or contact support if the problem persists.
                </p>
                <Link
                  href="/home"
                  className="inline-flex items-center space-x-2 bg-sage text-white px-6 py-3 rounded-6 font-urbanist font-600 hover:bg-sage/90 transition-colors"
                >
                  <Ion name="chevron-back" className="text-[16px]" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-off-white relative">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating orbs */}
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"
          initial={{ x: -100, y: 100 }}
          animate={{
            x: ["-100px", "100px", "-100px"],
            y: ["100px", "50px", "100px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "20%", left: "10%" }}
        />

        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-xl"
          initial={{ x: 100, y: -50 }}
          animate={{
            x: ["100px", "-50px", "100px"],
            y: ["-50px", "100px", "-50px"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "60%", right: "15%" }}
        />

        <motion.div
          className="absolute w-20 h-20 bg-gradient-to-br from-sage/6 to-transparent rounded-full blur-lg"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: ["0px", "80px", "-40px", "0px"],
            y: ["0px", "-60px", "40px", "0px"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ bottom: "20%", left: "20%" }}
        />

        {/* Subtle sparkles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sage/20 rounded-full"
            style={{
              left: `${(i * 83 + 37) % 100}%`,
              top: `${(i * 127 + 19) % 100}%`,
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Back arrow */}
      <div className="pt-4 pb-2 relative z-10">
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/home"
              className="inline-flex items-center justify-center w-10 h-10 bg-off-white hover:bg-white border border-charcoal/10 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Ion name="chevron-back" className="text-sage text-[20px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-2 pb-6 relative z-10">
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Profile Header Card */}
            <div ref={headerRef} className="bg-off-white backdrop-blur-sm p-6 border border-charcoal/10 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-sage/20">
                      <SafeAvatar
                        src={profile.avatar_url}
                        alt="Profile picture"
                        username={profile.username || profile.display_name || 'User'}
                        size={64}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="font-urbanist text-xl font-700 text-charcoal">
                        @{profile.username || profile.display_name || 'User'}
                      </h1>

                    </div>
                    {profile.is_top_reviewer && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Ion name="trophy" className="text-coral text-[16px]" />
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
                  <Ion name="create-outline" className="text-sage text-[16px]" />
                </button>
              </div>
            </div>
            {/* Stats Overview */}
            <div ref={statsRef} className="bg-off-white backdrop-blur-sm p-5 border border-charcoal/10 shadow-md">
              <h2 className="font-urbanist text-lg font-700 text-charcoal mb-4">Stats Overview</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center px-1">
                  <div className="flex flex-col items-center mb-2">
                    <Ion name="star" className="text-coral text-[18px] mb-1" />
                    <span className="font-urbanist text-xl font-700 text-charcoal leading-tight">
                      {profile.reviews_count}
                    </span>
                  </div>
                  <span className="text-sm font-400 text-charcoal/60 leading-tight">reviews</span>
                </div>
                <div className="text-center px-1">
                  <div className="flex flex-col items-center mb-2">
                    <Ion name="trophy" className="text-sage text-[18px] mb-1" />
                    <span className="font-urbanist text-xl font-700 text-charcoal leading-tight">
                      {profile.badges_count}
                    </span>
                  </div>
                  <span className="text-sm font-400 text-charcoal/60 leading-tight">badges</span>
                </div>
                <div className="text-center px-1">
                  <div className="flex flex-col items-center mb-2">
                    <Ion name="calendar" className="text-sage text-[18px] mb-1" />
                    <span className="font-urbanist text-sm font-700 text-charcoal leading-tight">
                      {formatMemberSince(profile.created_at)}
                    </span>
                  </div>
                  <span className="text-xs font-400 text-charcoal/60 leading-tight">member since</span>
                </div>
              </div>
            </div>

            {/* Your Contributions */}
            <div ref={contributionsRef} className="bg-off-white backdrop-blur-sm p-5 border border-charcoal/10 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-urbanist text-lg font-700 text-charcoal">Your Contributions</h2>
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-sm text-coral font-500 hover:text-coral/80 transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>{showAllReviews ? "Hide" : "See all reviews"}</span>
                  <Ion name={showAllReviews ? "chevron-up" : "chevron-forward"} className="text-[14px]" />
                </button>
              </div>
              <div className="space-y-3">
                {reviews.slice(0, showAllReviews ? undefined : 2).map((review) => (
                  <div key={review.id} className="flex items-center justify-between py-3 border-b border-sage/10 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-urbanist text-base font-700 text-charcoal">
                          {review.business_name}
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.is_featured && (
                          <span className="text-xs text-coral font-500">
                            (Featured)
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-charcoal/60">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <div className="text-right">
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

            {/* Your Achievements */}
            <div ref={achievementsRef} className="bg-off-white backdrop-blur-sm p-5 border border-charcoal/10 shadow-sm">
              <h2 className="font-urbanist text-lg font-600 text-charcoal mb-4">Your Achievements</h2>
              <div className="space-y-3">
                {achievements.map((userAchievement) => (
                  <div
                    key={userAchievement.achievement_id}
                    className="flex items-center space-x-3 p-3 transition-all duration-200 bg-sage/10 border border-sage/20"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage/20">
                      <Ion
                        name={userAchievement.achievements.icon}
                        className="text-[20px] text-sage"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-urbanist text-base font-600 text-charcoal">
                        {userAchievement.achievements.name}
                      </span>
                      <p className="text-sm text-charcoal/60 mt-1">
                        {userAchievement.achievements.description}
                      </p>
                    </div>
                    <Ion name="checkmark-circle" className="text-sage text-[18px]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings */}
            <div ref={settingsRef} className="bg-off-white backdrop-blur-sm p-5 border border-charcoal/10 shadow-sm">
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <Ion name="settings-outline" className="text-gray-500 text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Account Settings
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-gray-400 text-[16px]" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <Ion name="notifications-outline" className="text-gray-500 text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Notifications
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-gray-400 text-[16px]" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <Ion name="lock-closed-outline" className="text-gray-500 text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Privacy & Data
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-gray-400 text-[16px]" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 hover:bg-coral/5 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <Ion name="log-out-outline" className="text-coral text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-coral group-hover:text-coral/80 transition-colors duration-200">
                      Log Out
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-coral text-[16px]" />
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}