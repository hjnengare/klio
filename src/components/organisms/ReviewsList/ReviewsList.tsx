'use client';

import React, { useState } from 'react';
import { Card } from '@/components/molecules/Card';
import { ReviewItem, ReviewItemProps } from '@/components/molecules/ReviewItem';
import { ChevronUp, ChevronRight } from 'lucide-react';

export interface ReviewsListProps {
  reviews: ReviewItemProps[];
  title?: string;
  initialDisplayCount?: number;
  showToggle?: boolean;
  className?: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  title = 'Your Contributions',
  initialDisplayCount = 2,
  showToggle = true,
  className = '',
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll
    ? reviews
    : reviews.slice(0, initialDisplayCount);

  return (
    <Card variant="glass" padding="md" className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sf text-lg font-700 text-charcoal">{title}</h2>
        {showToggle && reviews.length > initialDisplayCount && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-coral font-500 hover:text-coral/80 transition-colors duration-200 flex items-center space-x-1"
            aria-expanded={showAll}
          >
            <span>{showAll ? 'Hide' : 'See all reviews'}</span>
            {showAll ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {displayedReviews.map((review, index) => (
          <ReviewItem key={index} {...review} />
        ))}
      </div>
      {reviews.length === 0 && (
        <p className="text-center text-charcoal/60 py-8">No reviews yet</p>
      )}
    </Card>
  );
};
