"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Star as StarIcon, Trophy, Calendar, Settings, Bell, Lock, LogOut, Upload, X } from "lucide-react";
import { getBrowserSupabase } from "../lib/supabase/client";

// Import components directly for faster loading
import Footer from "../components/Footer/Footer";
import { ProfileHeader } from "@/components/molecules/ProfileHeader";
import { ProfileStatsSection } from "@/components/organisms/ProfileStatsSection";
import { ReviewsList } from "@/components/organisms/ReviewsList";
import { AchievementsList } from "@/components/organisms/AchievementsList";
import { SettingsMenu } from "@/components/organisms/SettingsMenu";
import { Card } from "@/components/molecules/Card";
import { Skeleton } from "@/components/atoms/Skeleton";

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
  const { user, updateUser, logout, isLoading } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [displayNameInput, setDisplayNameInput] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const supabase = getBrowserSupabase();

  const rawProfile: any = user?.profile || {};
  const profile = {
    username: rawProfile.username ?? (user?.email ? user.email.split('@')[0] : 'user'),
    display_name: rawProfile.display_name ?? null,
    avatar_url: rawProfile.avatar_url ?? null,
    is_top_reviewer: rawProfile.is_top_reviewer ?? false,
    reviews_count: rawProfile.reviews_count ?? 0,
    badges_count: rawProfile.badges_count ?? 0,
    created_at: rawProfile.created_at ?? (user?.created_at ?? new Date().toISOString()),
    ...rawProfile,
  } as any;

  useEffect(() => {
    if (isEditOpen) {
      setUsernameInput(profile.username || "");
      setDisplayNameInput(profile.display_name || "");
      setAvatarFile(null);
      setError(null);
    }
  }, [isEditOpen]);

  const validateUsername = (val: string) => {
    const v = val.trim();
    if (v.length < 3 || v.length > 30) return "Username must be 3-30 characters";
    if (!/^[a-zA-Z0-9._]+$/.test(v)) return "Only letters, numbers, dot and underscore allowed";
    return null;
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      const normalizedUsername = usernameInput.trim();
      const usernameErr = validateUsername(normalizedUsername);
      if (usernameErr) throw new Error(usernameErr);

      // Uniqueness check
      if (normalizedUsername) {
        const { data: existing, error: checkErr } = await supabase
          .from('profiles')
          .select('user_id')
          .ilike('username', normalizedUsername)
          .neq('user_id', user.id)
          .maybeSingle();
        if (checkErr && checkErr.code !== 'PGRST116') throw checkErr; // ignore no rows
        if (existing) throw new Error('Username already taken');
      }

      let avatar_url = profile.avatar_url || null;
      if (avatarFile) {
        const path = `${user.id}/avatar-${Date.now()}`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true, cacheControl: '3600' });
        if (uploadErr) throw uploadErr;
        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
        avatar_url = pub.publicUrl;
      }

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      updates.username = normalizedUsername || null;
      updates.display_name = displayNameInput.trim() || null;
      if (avatar_url !== null) updates.avatar_url = avatar_url;

      const { error: upErr } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);
      if (upErr) throw upErr;

      await updateUser({
        profile: {
          ...(user.profile || {}),
          username: updates.username ?? null,
          display_name: updates.display_name ?? null,
          avatar_url: updates.avatar_url ?? avatar_url ?? null,
          updated_at: updates.updated_at,
        } as any,
      });

      setIsEditOpen(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const formatMemberSince = (d: string) => {
    const date = new Date(d);
    const year = date.getFullYear().toString().slice(-2);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} '${year}`;
  };

  // Loading skeleton
  if (isLoading) {
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

  // Prepare reviews data (using empty list if none available)
  const reviews: Review[] = [];
  const reviewsData = reviews.map((review) => ({
    businessName: review.business_name,
    businessImageUrl: review.business_image_url,
    rating: review.rating,
    reviewText: review.review_text,
    isFeatured: review.is_featured,
    createdAt: review.created_at,
    onViewClick: () => console.log("View review", review.id),
  }));

  // Prepare achievements data (using empty list if none available)
  const achievements: UserAchievement[] = [];
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
    <div className="relative min-h-dvh bg-off-white">
      {/* Header */}
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
      <div className="pt-20 pb-6 relative z-10">
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
                onEditClick={() => setIsEditOpen(true)}
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

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !saving && setIsEditOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-off-white border border-sage/20 shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sf text-lg font-700 text-charcoal">Edit profile</h3>
              <button
                className="p-2 rounded-full hover:bg-charcoal/5"
                onClick={() => !saving && setIsEditOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-600 text-charcoal mb-1">Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="yourname"
                  className="w-full rounded-lg border border-sage/30 bg-white px-3 py-2 text-charcoal outline-none focus:ring-2 focus:ring-sage/30"
                />
              </div>

              <div>
                <label className="block text-sm font-600 text-charcoal mb-1">Display name</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-sage/30 bg-white px-3 py-2 text-charcoal outline-none focus:ring-2 focus:ring-sage/30"
                />
              </div>

              <div>
                <label className="block text-sm font-600 text-charcoal mb-1">Profile photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-charcoal/70 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sage/10 file:text-sage hover:file:bg-sage/20"
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-coral">{error}</div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="px-4 py-2 rounded-lg border border-charcoal/10 text-charcoal hover:bg-charcoal/5"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-sage text-white font-600 hover:bg-sage/90 disabled:opacity-60"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
