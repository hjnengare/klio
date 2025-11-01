"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { ArrowLeft, Star as StarIcon, Trophy, Calendar, Settings, Bell, Lock, LogOut, Upload, X, Store } from "lucide-react";
import { getBrowserSupabase } from "@/app/lib/supabase/client";

// Import components directly for faster loading
import Footer from "@/app/components/Footer/Footer";
import { ProfileHeader } from "@/components/molecules/ProfileHeader";
import { ProfileStatsSection } from "@/components/organisms/ProfileStatsSection";
import { ReviewsList } from "@/components/organisms/ReviewsList";
import { AchievementsList } from "@/components/organisms/AchievementsList";
import { SettingsMenu } from "@/components/organisms/SettingsMenu";
import { Skeleton } from "@/components/atoms/Skeleton";


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
  const profile = React.useMemo(() => {
    const profileData = {
      username: rawProfile.username ?? (user?.email ? user.email.split('@')[0] : 'user'),
      display_name: rawProfile.display_name ?? null,
      avatar_url: rawProfile.avatar_url ?? null,
      is_top_reviewer: rawProfile.is_top_reviewer ?? false,
      reviews_count: rawProfile.reviews_count ?? 0,
      badges_count: rawProfile.badges_count ?? 0,
      created_at: rawProfile.created_at ?? (user?.created_at ?? new Date().toISOString()),
      ...rawProfile,
    };
    console.log('Profile data updated:', profileData.avatar_url);
    return profileData;
  }, [user?.profile, user?.email, user?.created_at]);

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
        try {
          console.log('Starting avatar upload...', {
            fileName: avatarFile.name,
            fileSize: avatarFile.size,
            fileType: avatarFile.type,
            userId: user.id
          });

          // Validate file size (max 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (avatarFile.size > maxSize) {
            throw new Error('Image file is too large. Maximum size is 5MB.');
          }

          const timestamp = Date.now();
          const fileExt = avatarFile.name.split('.').pop() || 'jpg';
          const path = `${user.id}/avatar-${timestamp}.${fileExt}`;
          
          console.log('Uploading to path:', path);
          
          // Upload to Supabase Storage
          const { error: uploadErr, data: uploadData } = await supabase.storage
            .from('avatars')
            .upload(path, avatarFile, { 
              upsert: true, 
              cacheControl: '3600',
              contentType: avatarFile.type || `image/${fileExt}`
            });
          
          if (uploadErr) {
            console.error('Avatar upload error details:', {
              error: uploadErr,
              message: uploadErr.message,
              name: uploadErr.name
            });
            
            // Provide more specific error messages
            let errorMessage = 'Failed to upload avatar image';
            if (uploadErr.message) {
              errorMessage = uploadErr.message;
              
              // Check for specific error patterns
              if (uploadErr.message.includes('413') || uploadErr.message.includes('too large')) {
                errorMessage = 'Image file is too large. Please choose a smaller image.';
              } else if (uploadErr.message.includes('401') || uploadErr.message.includes('403') || uploadErr.message.includes('permission') || uploadErr.message.includes('unauthorized')) {
                errorMessage = 'Permission denied. Please check your account permissions.';
              } else if (uploadErr.message.includes('duplicate') || uploadErr.message.includes('already exists')) {
                // If file already exists, try to get the URL anyway
                console.log('File already exists, getting public URL...');
                // Don't throw - continue to get the URL
              } else {
                errorMessage = `Upload failed: ${uploadErr.message}`;
              }
            }
            
            // Only throw if it's not a duplicate (we can still get the URL)
            if (!uploadErr.message?.includes('duplicate') && !uploadErr.message?.includes('already exists')) {
              throw new Error(errorMessage);
            }
          }
          
          console.log('Upload successful, getting public URL...');
          
          // Get public URL
          const { data: pubData } = supabase.storage.from('avatars').getPublicUrl(path);
          
          if (!pubData?.publicUrl) {
            console.error('Failed to get public URL:', pubData);
            throw new Error('Failed to get public URL for uploaded image');
          }
          
          console.log('Got public URL:', pubData.publicUrl);
          
          // Store URL without query parameter (we can add cache-busting on display if needed)
          avatar_url = pubData.publicUrl;
          
          // Small delay to ensure image is available after upload
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('Avatar URL set:', avatar_url);
        } catch (uploadError: any) {
          console.error('Avatar upload failed:', uploadError);
          throw new Error(uploadError.message || 'Failed to upload profile image. Please try again.');
        }
      }

      // Use updateUser to handle both database update and local state update
      await updateUser({
        profile: {
          ...(user.profile || {}),
          username: normalizedUsername || null,
          display_name: displayNameInput.trim() || null,
          avatar_url: avatar_url,
        } as any,
      });

      console.log('Profile updated with avatar_url:', avatar_url);
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
      <div className="min-h-dvh bg-off-white">
        <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
          <div className="pt-4">
            <section
              className="relative"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              }}
            >
              <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
                <div className="max-w-[800px] mx-auto pt-8">
                  <div className="p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 mb-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4 mb-4">
                        <Skeleton variant="circular" width={64} height={64} />
                        <div className="space-y-2">
                          <Skeleton variant="text" width={200} height={24} />
                          <Skeleton variant="text" width={150} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 mb-12">
                    <Skeleton variant="text" width={150} height={20} className="mb-4" />
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={80} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
    <div className="min-h-dvh bg-off-white">
      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="group flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-sage/20 mr-3 sm:mr-4">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-sage transition-colors duration-300" />
              </div>
              <h1 className="font-urbanist text-base sm:text-xl font-700 text-white transition-all duration-300 group-hover:text-white/80 relative">
                Your Profile
              </h1>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
        <div className="py-1 pt-20">
          <section
            className="relative pt-4 sm:pt-6 pb-12 sm:pb-16 md:pb-20"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
          >
            <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
              <div className="max-w-[800px] mx-auto pt-2">
                {/* Profile Header Card */}
                <div className="p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 mb-6">
                  <ProfileHeader
                    key={profile.avatar_url || 'no-avatar'}
                    username={profile.username || profile.display_name || "User"}
                    displayName={profile.display_name || undefined}
                    avatarUrl={profile.avatar_url}
                    isTopReviewer={profile.is_top_reviewer}
                    topReviewerBadgeText="Top Reviewer in Cape Town this Month"
                    onEditClick={() => setIsEditOpen(true)}
                  />
                </div>

                {/* Stats Overview */}
                <ProfileStatsSection stats={stats} title="Stats Overview" />

                {/* Business Management */}
                <div className="p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-600 text-charcoal flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10">
                        <Store className="w-4 h-4 text-sage" />
                      </span>
                      Business Management
                    </h3>
                  </div>
                  <p className="text-sm text-charcoal/70 mb-4">Manage your business profiles, respond to reviews, and track performance.</p>
                  <Link
                    href="/manage-business"
                    className="bg-sage hover:bg-sage/90 text-white px-4 py-2 rounded-full text-sm font-600 transition-all duration-300 flex items-center gap-2 w-fit"
                  >
                    <Store className="w-4 h-4" />
                    Manage Businesses
                  </Link>
                </div>

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
          </section>
        </div>

        <Footer />
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setIsEditOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border border-white/50 rounded-xl ring-1 ring-white/20 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-urbanist text-lg font-600 text-charcoal">Edit Profile</h3>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-charcoal/5 transition-colors duration-200"
                onClick={() => !saving && setIsEditOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-charcoal/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-600 text-charcoal mb-2">Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="yourname"
                  className="w-full rounded-xl border-2 border-charcoal/20 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/50 font-urbanist
                             focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20
                             hover:border-charcoal/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-600 text-charcoal mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-xl border-2 border-charcoal/20 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/50 font-urbanist
                             focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20
                             hover:border-charcoal/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-600 text-charcoal mb-2">Profile Photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-charcoal/70 font-urbanist
                               file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0
                               file:text-sm file:font-600 file:bg-white/40 file:text-charcoal
                               hover:file:bg-charcoal hover:file:text-white file:transition-all file:duration-300 file:shadow-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-coral/10 border border-coral/20">
                  <p className="text-sm text-coral font-urbanist">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="px-4 py-2 rounded-full text-sm font-600 font-urbanist bg-white/40 text-charcoal
                             hover:bg-charcoal hover:text-white transition-all duration-300 shadow-sm
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-full text-sm font-600 font-urbanist bg-charcoal text-white
                             hover:bg-charcoal/90 transition-all duration-300 shadow-lg
                             disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
