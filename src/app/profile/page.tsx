"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { ArrowLeft, Star as StarIcon, Trophy, Calendar, X, Store, LogOut, AlertTriangle, Trash2 } from "lucide-react";
import { getBrowserSupabase } from "@/app/lib/supabase/client";

// Import components directly for faster loading
import Footer from "@/app/components/Footer/Footer";
import { ProfileHeader } from "@/components/molecules/ProfileHeader";
import { ProfileStatsSection } from "@/components/organisms/ProfileStatsSection";
import { ReviewsList } from "@/components/organisms/ReviewsList";
import { AchievementsList } from "@/components/organisms/AchievementsList";
import { DangerAction } from "@/components/molecules/DangerAction";
import { Skeleton } from "@/components/atoms/Skeleton";
import { ConfirmationDialog } from "@/components/molecules/ConfirmationDialog";


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
  const { user, updateUser, isLoading, logout } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarKey, setAvatarKey] = useState(0); // Force re-render of avatar
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const supabase = getBrowserSupabase();

  const profile = React.useMemo(() => {
    const rawProfile: any = user?.profile || {};
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
    console.log('Profile memo recomputed:', {
      avatar_url: profileData.avatar_url,
      type: typeof profileData.avatar_url,
      rawProfile_avatar_url: rawProfile.avatar_url,
      user_profile_avatar_url: user?.profile?.avatar_url
    });
    return profileData;
  }, [user?.profile?.avatar_url, user?.profile?.username, user?.profile?.display_name, user?.email, user?.created_at]);

  useEffect(() => {
    if (isEditOpen) {
      setAvatarFile(null);
      setError(null);
      setUsername(profile.username || "");
      setDisplayName(profile.display_name || "");
    }
  }, [isEditOpen, profile.username, profile.display_name]);

  // Log profile changes for debugging
  useEffect(() => {
    console.log('Profile page - user.profile changed:', user?.profile);
  }, [user?.profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
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
          avatar_url: avatar_url,
          username: username.trim() || null,
          display_name: displayName.trim() || null,
        } as any,
      });

      console.log('Profile updated:', { avatar_url, username, display_name: displayName });

      // Force re-render of avatar component
      setAvatarKey(prev => prev + 1);

      setIsEditOpen(false);
      setAvatarFile(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatMemberSince = (d: string) => {
    const date = new Date(d);
    const year = date.getFullYear().toString().slice(-2);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} '${year}`;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleDeactivate = () => {
    if (confirm("Are you sure you want to deactivate your account? You can reactivate it anytime by logging in.")) {
      // TODO: Implement account deactivation
      console.log("Account deactivation requested");
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Account successfully deleted, logout will be handled by the API
      setIsDeleteDialogOpen(false);
      window.location.href = '/onboarding';
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setIsDeleting(false);
      setDeleteError(`Failed to delete account: ${error.message}`);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-off-white">
        <header className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="h-16 flex items-center">
              <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
        </header>

        <div className="bg-off-white pt-20 pb-12">
          <section className="relative py-6">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
              <div className="max-w-[900px] mx-auto">
                <div className="p-6 sm:p-8 bg-card-bg border border-white/50 rounded-2xl shadow-sm mb-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <Skeleton variant="circular" width={64} height={64} />
                      <div className="space-y-2 flex-1">
                        <Skeleton variant="text" width={200} height={24} />
                        <Skeleton variant="text" width={150} height={16} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 bg-card-bg border border-white/50 rounded-2xl shadow-sm">
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
      iconColor: "text-coral",
    },
    {
      icon: Calendar,
      value: formatMemberSince(profile.created_at),
      label: "member since",
      iconColor: "text-coral",
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

  return (
    <div className="min-h-dvh bg-off-white">
      {/* Header - matching PromoBar + Header aesthetic */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg border-b border-white/10"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <Link href="/home" className="group flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200">
                <ArrowLeft className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-700 text-white">
                Your Profile
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="bg-off-white">
        <div className="pt-20 pb-12">
          <section
            className="relative py-6"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
              <div className="max-w-[900px] mx-auto">
                {/* Profile Header Card */}
                <div className="p-6 sm:p-8 bg-card-bg border border-white/50 rounded-2xl shadow-sm mb-6">
                  <ProfileHeader
                    key={`${profile.avatar_url || 'no-avatar'}-${avatarKey}`}
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
                <div className="p-6 sm:p-8 bg-card-bg border border-white/50 rounded-2xl shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-charcoal flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10">
                        <Store className="w-4 h-4 text-sage" />
                      </span>
                      Business Management
                    </h3>
                  </div>
                  <p className="text-xs text-charcoal/70 mb-4">Manage your business profiles, respond to reviews, and track performance.</p>
                  <Link
                    href="/manage-business"
                    className="bg-coral hover:bg-coral/90 text-white px-4 py-2 rounded-full text-xs font-600 transition-all duration-300 flex items-center gap-2 w-fit"
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

                {/* Account Actions */}
                <div className="p-6 sm:p-8 bg-card-bg border border-white/50 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-charcoal flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral/20 to-coral/10">
                        <AlertTriangle className="w-4 h-4 text-coral" />
                      </span>
                      Account Actions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <DangerAction
                      title="Log Out"
                      description="Sign out of your account on this device."
                      buttonText="Log Out"
                      onAction={handleLogout}
                      variant="primary"
                      showBorder={false}
                    />
                    <DangerAction
                      title="Deactivate Account"
                      description="Temporarily deactivate your account. You can reactivate it anytime by logging in."
                      buttonText="Deactivate Account"
                      onAction={handleDeactivate}
                      variant="primary"
                      showBorder={true}
                    />
                    <DangerAction
                      title="Delete Account"
                      description="Permanently delete your account and all associated data. This action cannot be undone."
                      buttonText="Delete Account"
                      onAction={handleDeleteAccount}
                      variant="secondary"
                      showBorder={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50">
          <div className="relative z-10 w-full max-w-md bg-card-bg border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white">Edit Profile</h3>
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                onClick={() => !saving && setIsEditOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white/90" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-xs text-charcoal border border-white/30 bg-white focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all duration-200"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-xs text-charcoal border border-white/30 bg-white focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all duration-200"
                  placeholder="Enter display name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-2">Profile Photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-charcoal/70
                               file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0
                               file:text-xs file:font-semibold file:bg-coral file:text-white
                               hover:file:bg-coral/90 file:transition-all file:duration-200 file:cursor-pointer"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-coral/10 border border-coral/30">
                  <p className="text-xs text-coral">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/20 text-white
                             hover:bg-white/30 transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-sage text-white
                             hover:bg-sage/90 transition-all duration-200 shadow-sm
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

      {/* Delete Account Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(false);
            setDeleteError(null);
          }
        }}
        onConfirm={confirmDeleteAccount}
        title="Delete Your Account"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data, reviews, and contributions will be permanently removed."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        requireConfirmText="DELETE"
        error={deleteError}
      />
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
