import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface MovieFormProps {
  onSubmit: (movie: {
    title: string;
    year: number;
    director: string;
    actors: string[];
    image?: string;
  }) => Promise<void>;
}

export default function MovieForm({ onSubmit }: MovieFormProps) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [director, setDirector] = useState('');
  const [actors, setActors] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !year || !director) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const actorArray = actors
        .split(',')
        .map(actor => actor.trim())
        .filter(actor => actor.length > 0);

      await onSubmit({
        title: title.trim(),
        year: parseInt(year),
        director: director.trim(),
        actors: actorArray,
        image: image.trim() || undefined,
      });

      // Show success state
      setShowSuccess(true);
      
      // Reset form
      setTitle('');
      setYear('');
      setDirector('');
      setActors('');
      setImage('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while creating the movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Add New Movie</h2>

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
                <p className="text-sm font-medium text-green-800">Movie created successfully!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="floating-label-group relative">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder=" "
            className="floating-input block w-full rounded-md border-2 border-gray-300 px-3 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition-all gradient-border"
            required
          />
          <label htmlFor="title" className={`floating-label ${title ? 'text-purple-600' : ''}`}>
            Movie Title *
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="floating-label-group relative">
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder=" "
              min="1900"
              max={new Date().getFullYear() + 5}
              className="floating-input block w-full rounded-md border-2 border-gray-300 px-3 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition-all gradient-border"
              required
            />
            <label htmlFor="year" className={`floating-label ${year ? 'text-purple-600' : ''}`}>
              Release Year *
            </label>
          </div>

          <div className="floating-label-group relative">
            <input
              type="text"
              id="director"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder=" "
              className="floating-input block w-full rounded-md border-2 border-gray-300 px-3 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition-all gradient-border"
              required
            />
            <label htmlFor="director" className={`floating-label ${director ? 'text-purple-600' : ''}`}>
              Director *
            </label>
          </div>
        </div>

        <div className="floating-label-group relative">
          <input
            type="text"
            id="actors"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
            placeholder=" "
            className="floating-input block w-full rounded-md border-2 border-gray-300 px-3 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition-all gradient-border"
          />
          <label htmlFor="actors" className={`floating-label ${actors ? 'text-purple-600' : ''}`}>
            Main Actors (comma-separated)
          </label>
        </div>

        <div className="floating-label-group relative">
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder=" "
            className="floating-input block w-full rounded-md border-2 border-gray-300 px-3 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base transition-all gradient-border"
          />
          <label htmlFor="image" className={`floating-label ${image ? 'text-purple-600' : ''}`}>
            Image URL (optional)
          </label>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Creating Movie...' : 'Create Movie'}
          </Button>
        </div>
      </form>
    </div>
  );
}