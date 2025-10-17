'use client';

import React from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import { Trophy, Pencil } from 'lucide-react';

export interface ProfileHeaderProps {
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
  isTopReviewer?: boolean;
  topReviewerBadgeText?: string;
  onEditClick?: () => void;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  displayName,
  avatarUrl,
  isTopReviewer = false,
  topReviewerBadgeText = 'Top Reviewer in Cape Town this Month',
  onEditClick,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center space-x-4">
        <Avatar
          src={avatarUrl}
          alt={displayName || username}
          fallback={displayName || username}
          size="lg"
        />
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="font-sf text-xl font-700 text-charcoal">
              @{username}
            </h1>
          </div>
          {isTopReviewer && (
            <Badge variant="coral" size="sm" className="flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span className="font-600">{topReviewerBadgeText}</span>
            </Badge>
          )}
        </div>
      </div>
      {onEditClick && (
        <IconButton
          icon={Pencil}
          variant="sage"
          size="md"
          ariaLabel="Edit profile"
          onClick={onEditClick}
        />
      )}
    </div>
  );
};
