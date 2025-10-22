'use client';

import React from 'react';
import Image from 'next/image';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  fallback?: string;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs' },
  sm: { container: 'w-8 h-8', text: 'text-sm' },
  md: { container: 'w-10 h-10', text: 'text-base' },
  lg: { container: 'w-16 h-16', text: 'text-xl' },
  xl: { container: 'w-24 h-24', text: 'text-3xl' },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);
  const { container, text } = sizeStyles[size];

  // Reset error state when src changes
  React.useEffect(() => {
    console.log('Avatar src changed:', src);
    setImageError(false);
  }, [src]);

  const initials = React.useMemo(() => {
    if (fallback) {
      return fallback
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [fallback, alt]);

  const showImage = src && !imageError;

  return (
    <div
      className={`
        ${container}
        relative rounded-full overflow-hidden flex-shrink-0
        ${!showImage ? 'bg-sage text-white' : ''}
        ${className}
      `}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-semibold ${text}`}>
          {initials}
        </div>
      )}
    </div>
  );
};
