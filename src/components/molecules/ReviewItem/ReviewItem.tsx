'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star as StarIcon, Briefcase } from 'react-feather';
import { Badge } from '@/components/atoms/Badge';

export interface ReviewItemProps {
  businessName: string;
  businessImageUrl?: string | null;
  rating: number;
  reviewText?: string | null;
  isFeatured?: boolean;
  createdAt: string;
  onViewClick?: () => void;
  className?: string;
}

const BusinessThumb: React.FC<{
  name: string;
  imageUrl?: string | null;
  size?: number;
}> = ({ name, imageUrl, size = 40 }) => {
  const [err, setErr] = useState(false);

  if (!imageUrl || err) {
    return (
      <div
        className="relative rounded-full bg-gradient-to-br from-sage/15 to-coral/10 border border-charcoal/10 flex items-center justify-center"
        style={{ width: size, height: size }}
        aria-label={`${name} placeholder image`}
      >
        <Briefcase
          className="text-sage"
          style={{ width: size * 0.5, height: size * 0.5 }}
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
        src={imageUrl}
        alt={`${name} thumbnail`}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setErr(true)}
      />
    </div>
  );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const active = i < rating;
        return (
          <StarIcon
            key={i}
            className={active ? 'text-coral' : 'text-gray-300'}
            style={{
              width: 16,
              height: 16,
              fill: active ? 'currentColor' : 'none',
            }}
            aria-hidden
          />
        );
      })}
    </div>
  );
};

export const ReviewItem: React.FC<ReviewItemProps> = ({
  businessName,
  businessImageUrl,
  rating,
  isFeatured = false,
  createdAt,
  onViewClick,
  className = '',
}) => {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div
      className={`flex items-center justify-between py-3 border-b border-sage/10 last:border-b-0 ${className}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <BusinessThumb name={businessName} imageUrl={businessImageUrl} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-base font-700 text-charcoal truncate" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              {businessName}
            </span>
            <StarRating rating={rating} />
            {isFeatured && (
              <Badge variant="coral" size="sm">
                Featured
              </Badge>
            )}
          </div>
          <span className="text-sm text-charcoal/60" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>{formatDate(createdAt)}</span>
        </div>
      </div>
      <div className="text-right ml-3">
        <button
          onClick={onViewClick}
          className="text-coral text-sm font-500 hover:text-coral/80 transition-colors duration-200"
          style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}
        >
          Click to see
        </button>
        <div className="text-xs text-charcoal/50 mt-1" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif', fontWeight: 600 }}>full review</div>
      </div>
    </div>
  );
};
