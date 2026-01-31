import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '../lib/types';
import { Timestamp } from 'firebase/firestore';
import Button from './Button';

interface ReviewListProps {
  reviews: Review[];
  onReviewDeleted?: () => void;
}

const toDate = (date: Date | Timestamp | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (date instanceof Timestamp) return date.toDate();
  return null;
};

const getGradeBadgeColor = (grade: string): string => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'from-green-500 to-emerald-600';
    case 'B':
      return 'from-blue-500 to-blue-600';
    case 'C':
      return 'from-yellow-500 to-yellow-600';
    case 'D':
      return 'from-orange-500 to-orange-600';
    case 'F':
      return 'from-red-500 to-red-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const GradeBadge = ({ grade }: { grade: string }) => (
  <motion.div
    className={`inline-flex items-center justify-center px-3 py-1 rounded-full bg-gradient-to-r ${getGradeBadgeColor(grade)} text-white font-bold text-lg shadow-md`}
    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
    transition={{ duration: 0.3 }}
  >
    {grade}
  </motion.div>
);

export default function ReviewList({ reviews, onReviewDeleted }: ReviewListProps) {
  const { data: session } = useSession();
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const toggleExpand = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getInitials = (userId: string): string => {
    return userId.substring(0, 2).toUpperCase();
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Call the callback to refresh the reviews
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      alert('Error deleting review: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <p className="text-gray-500">No reviews yet. Be the first to review this movie!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg sm:text-xl font-semibold text-gray-900"
      >
        Reviews ({reviews.length})
      </motion.h3>
      {reviews.map((review, index) => {
        const isExpanded = expandedReviews.has(review.id || '');
        const shouldTruncate = review.text.length > 200;
        const displayText = !isExpanded && shouldTruncate 
          ? review.text.substring(0, 200) + '...' 
          : review.text;

        return (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="glass rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {getInitials(review.userId)}
                </motion.div>
                
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {review.userId} {/* TODO: Replace with actual user name */}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {toDate(review.createdAt)?.toLocaleDateString() || 'Unknown date'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <GradeBadge grade={review.grade} />
                {session?.isAdmin && (
                  <Button
                    onClick={() => handleDeleteReview(review.id!)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? 'expanded' : 'collapsed'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  {displayText}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {shouldTruncate && (
              <motion.button
                onClick={() => toggleExpand(review.id || '')}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center space-x-1"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}