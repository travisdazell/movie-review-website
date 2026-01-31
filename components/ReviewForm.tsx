import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface ReviewFormProps {
  movieId: string;
  onSubmit: (review: { text: string; grade: string }) => Promise<void>;
}

export default function ReviewForm({ movieId, onSubmit }: ReviewFormProps) {
  const [text, setText] = useState('');
  const [grade, setGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const characterLimit = 500;
  const characterCount = text.length;
  const characterPercentage = (characterCount / characterLimit) * 100;
  
  // Color transitions based on character count
  const getCharacterCountColor = () => {
    if (characterPercentage < 70) return 'text-gray-500';
    if (characterPercentage < 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !grade) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ text, grade });
      setShowSuccess(true);
      setText('');
      setGrade('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while submitting the review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Write a Review</h3>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 bg-red-50 border border-red-200 rounded-md p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 bg-green-50 border border-green-200 rounded-md p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Review submitted successfully!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Floating Label for Grade Select */}
        <div className="floating-label-group relative">
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="floating-input block w-full rounded-md border-2 border-gray-300 px-3 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition-all gradient-border"
            required
          >
            <option value="">Select a grade</option>
            <option value="A+">A+ (Excellent)</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F (Failure)</option>
          </select>
          <label htmlFor="grade" className={`floating-label ${grade ? 'text-purple-600' : ''}`}>
            Grade
          </label>
        </div>

        {/* Floating Label for Review Textarea */}
        <div className="floating-label-group relative">
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={characterLimit}
            rows={4}
            placeholder=" "
            className="floating-input block w-full rounded-md border-2 border-gray-300 px-3 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition-all gradient-border resize-none"
            required
          />
          <label htmlFor="text" className={`floating-label ${text ? 'text-purple-600' : ''}`}>
            Your Review
          </label>
          <motion.p
            animate={{ color: getCharacterCountColor() }}
            className={`mt-2 text-xs sm:text-sm font-medium ${getCharacterCountColor()}`}
          >
            {characterCount}/{characterLimit} characters
          </motion.p>
        </div>

        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
}