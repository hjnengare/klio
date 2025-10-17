"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Star as StarIcon, Trophy, Calendar, Settings, Bell, Lock, LogOut } from "lucide-react";

// Lazy load components for better performance
const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

const ProfileHeader = dynamic(() => import("@/components/molecules/ProfileHeader").then(mod => ({ default: mod.ProfileHeader })), {
  ssr: false,
});

const ProfileStatsSection = dynamic(() => import("@/components/organisms/ProfileStatsSection").then(mod => ({ default: mod.ProfileStatsSection })), {
  ssr: false,
});

const ReviewsList = dynamic(() => import("@/components/organisms/ReviewsList").then(mod => ({ default: mod.ReviewsList })), {
  ssr: false,
});

const AchievementsList = dynamic(() => import("@/components/organisms/AchievementsList").then(mod => ({ default: mod.AchievementsList })), {
  ssr: false,
});

const SettingsMenu = dynamic(() => import("@/components/organisms/SettingsMenu").then(mod => ({ default: mod.SettingsMenu })), {
  ssr: false,
});

const Card = dynamic(() => import("@/components/molecules/Card").then(mod => ({ default: mod.Card })), {
  ssr: false,
});

const Skeleton = dynamic(() => import("@/components/atoms/Skeleton").then(mod => ({ default: mod.Skeleton })), {
  ssr: false,
});

// Glass effect styles
const glassHeader = `
  relative z-10
  px-3 sm:px-4 py-4 sm:py-6
  border-b border-black/5
  bg-off-white/90 shadow-md
`.replace(/\s+/g, " ");

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

function ProfileContent() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const mockProfile: UserProfile = {
        user_id: user?.id || "dummy-user-id",
        username: user?.email?.split("@")[0] || "foodie_explorer",
        display_name:
          (user as { name?: string })?.name || user?.email?.split("@")[0] || "Alex Johnson",
        avatar_url: (user as { avatar_url?: string })?.avatar_url || null,
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

      const mockReviews: Review[] = [
        {
          id: "1",
          business_name: "The Pot Luck Club",
          rating: 5,
          review_text: "Amazing rooftop dining experience with incredible city views!",
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
          review_text: "Excellent wine selection and beautiful vineyard setting.",
          is_featured: false,
          created_at: "2024-01-05T19:45:00Z",
          business_image_url: null,
        },
        {
          id: "4",
          business_name: "V&A Waterfront",
          rating: 4,
          review_text: "Great shopping and entertainment hub with harbor views.",
          is_featured: false,
          created_at: "2023-12-28T16:15:00Z",
          business_image_url: null,
        },
        {
          id: "5",
          business_name: "Chapman's Peak Drive",
          rating: 5,
          review_text: "Breathtaking coastal drive - must do when visiting Cape Town!",
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
            description: "Your reviews helped 50+ people discover great places",
            icon: "heart",
            category: "community",
          },
        },
      ];

      setProfile(mockProfile);
      setReviews(mockReviews);
      setAchievements(mockAchievements);
      setLoading(false);
    }, 500);
  }, [user]);

  const handleLogout = () => logout();

  const formatMemberSince = (d: string) => {
    const date = new Date(d);
    const year = date.getFullYear().toString().slice(-2);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} '${year}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-dvh bg-off-white relative">
        <div className="pt-24 pb-6 relative z-10">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card variant="glass" padding="md">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton variant="circular" width={64} height={64} />
                    <div className="space-y-2">
                      <Skeleton variant="text" width={200} height={24} />
                      <Skeleton variant="text" width={150} height={16} />
                    </div>
                  </div>
                </div>
              </Card>
              <Card variant="glass" padding="md">
                <Skeleton variant="text" width={150} height={20} className="mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={80} />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Prepare stats data
  const stats = [
    {
      icon: StarIcon,
      value: profile.reviews_count,
      label: "reviews",
      iconColor: "text-coral",
    },
    {
      icon: Trophy,
      value: profile.badges_count,
      label: "badges",
      iconColor: "text-sage",
    },
    {
      icon: Calendar,
      value: formatMemberSince(profile.created_at),
      label: "member since",
      iconColor: "text-sage",
    },
  ];

  // Prepare reviews data
  const reviewsData = reviews.map((review) => ({
    businessName: review.business_name,
    businessImageUrl: review.business_image_url,
    rating: review.rating,
    reviewText: review.review_text,
    isFeatured: review.is_featured,
    createdAt: review.created_at,
    onViewClick: () => console.log("View review", review.id),
  }));

  // Prepare achievements data
  const achievementsData = achievements.map((ua) => ({
    name: ua.achievements.name,
    description: ua.achievements.description,
    icon: ua.achievements.icon,
    earnedAt: ua.earned_at,
  }));

  // Prepare settings menu data
  const settingsMenuItems = [
    {
      icon: Settings,
      label: "Account Settings",
      onClick: () => console.log("Account Settings"),
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => console.log("Notifications"),
    },
    {
      icon: Lock,
      label: "Privacy & Data",
      onClick: () => console.log("Privacy & Data"),
    },
    {
      icon: LogOut,
      label: "Log Out",
      onClick: handleLogout,
      variant: "danger" as const,
    },
  ];

  return (
    <div className="min-h-dvh bg-off-white relative">
      {/* Fixed Page Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className={`${glassHeader} fixed top-0 left-0 right-0 z-50`}
      >
        <div className="relative z-[1] flex items-center justify-between max-w-[1300px] mx-auto">
          <Link href="/home" className="group flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-charcoal/5 hover:bg-sage/10 rounded-full flex items-center justify-center border border-charcoal/5 hover:border-sage/20 mr-2 sm:mr-4"
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
              className="font-sf text-base sm:text-xl font-700 text-charcoal"
            >
              Your Profile
            </motion.h1>
          </Link>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="pt-24 pb-6 relative z-10">
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header Card */}
            <Card variant="glass" padding="md">
              <ProfileHeader
                username={profile.username || profile.display_name || "User"}
                displayName={profile.display_name || undefined}
                avatarUrl={profile.avatar_url}
                isTopReviewer={profile.is_top_reviewer}
                topReviewerBadgeText="Top Reviewer in Cape Town this Month"
                onEditClick={() => console.log("Edit profile")}
              />
            </Card>

            {/* Stats Overview */}
            <ProfileStatsSection stats={stats} title="Stats Overview" />

            {/* Your Contributions */}
            <ReviewsList
              reviews={reviewsData}
              title="Your Contributions"
              initialDisplayCount={2}
              showToggle={true}
            />

            {/* Your Achievements */}
            <AchievementsList achievements={achievementsData} title="Your Achievements" />

            {/* Account Settings */}
            <SettingsMenu menuItems={settingsMenuItems} />
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
