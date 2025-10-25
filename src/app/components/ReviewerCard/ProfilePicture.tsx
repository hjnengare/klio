import Image from 'next/image';
import React, { useState } from 'react';
import { User, Trophy, CheckCircle, MapPin } from 'lucide-react';

interface ProfilePictureProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  badge?: "top" | "verified" | "local";
}

export default function ProfilePicture({
  src,
  alt,
  size = "md",
  badge
}: ProfilePictureProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const getSizeNumber = (size: keyof typeof sizeClasses): number => {
    const sizeMap = { sm: 28, md: 32, lg: 40 };
    return sizeMap[size];
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case "top":
        return Trophy;
      case "verified":
        return CheckCircle;
      case "local":
        return MapPin;
      default:
        return User;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case "top":
        return "text-amber-500";
      case "verified": 
        return "text-blue-500";
      case "local":
        return "text-sage";
      default:
        return "";
    }
  };

  // If no src provided or error occurred, show placeholder
  if (!src || imgError) {
    return (
      <div className="relative inline-block">
        <div className={`${sizeClasses[size]} rounded-full bg-sage/10 flex items-center justify-center border-2 border-white shadow-lg ring-2 ring-white/50`}>
          <User
            className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-sage/70`}
          />
        </div>
        {badge && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-off-white rounded-full flex items-center justify-center shadow-lg border border-white/50 ring-1 ring-white/30">
            {React.createElement(getBadgeIcon(badge), {
              className: `w-2.5 h-2.5 ${getBadgeColor(badge)}`
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <Image
        src={src}
        alt={alt}
        width={getSizeNumber(size)}
        height={getSizeNumber(size)}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md`}
        unoptimized={src.includes('dicebear.com')}
        onError={() => setImgError(true)}
      />

      {badge && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-off-white   rounded-full flex items-center justify-center shadow-lg border border-gray-100">
          {React.createElement(getBadgeIcon(badge), {
            className: `w-2.5 h-2.5 ${getBadgeColor(badge)}`
          })}
        </div>
      )}
    </div>
  );
}
