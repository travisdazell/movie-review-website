import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import ReviewList from '../../components/ReviewList';
import ReviewForm from '../../components/ReviewForm';
import { Movie, Review } from '../../lib/types';
import { useReducedMotion } from '../../lib/hooks/useReducedMotion';

interface MovieDetail {
  movie: Movie;
  reviews: Review[];
}

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (id) {
      fetchMovieDetail();
    }
  }, [id]);

  const fetchMovieDetail = async () => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Movie not found');
        } else {
          throw new Error('Failed to fetch movie details');
        }
        return;
      }
      const movieData = await response.json();
      setData(movieData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData: { text: string; grade: string }) => {
    if (!id || typeof id !== 'string') return;

    const response = await fetch(`/api/movies/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit review');
    }

    // Refresh the movie data to show the new review
    await fetchMovieDetail();
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movie details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link href="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Back to Movies
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  const { movie, reviews } = data;

  return (
    <Layout>
      <Head>
        <title>{movie.title} - Movie Reviews</title>
        <meta name="description" content={`Reviews for ${movie.title}`} />
      </Head>

      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        >
          <Link href="/">
            <motion.button
              className="mb-6 text-purple-600 hover:text-purple-800 flex items-center font-medium"
              whileHover={prefersReducedMotion ? {} : { x: -5 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              ← Back to Movies
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          >
            <div className="glass rounded-lg shadow-lg overflow-hidden">
              {movie.image ? (
                <div className="relative overflow-hidden group">
                  <motion.img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-96 object-cover"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="w-full h-96 bg-gradient-shimmer flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-primary bg-clip-text text-transparent">
                  {movie.title}
                </h1>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong className="text-purple-600">Year:</strong> {movie.year}</p>
                  {movie.director && <p><strong className="text-purple-600">Director:</strong> {movie.director}</p>}
                  {movie.actors && movie.actors.length > 0 && (
                    <p><strong className="text-purple-600">Actors:</strong> {movie.actors.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
          >
            {session && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4 bg-gradient-primary bg-clip-text text-transparent">Write a Review</h2>
                <ReviewForm movieId={id as string} onSubmit={handleReviewSubmit} />
              </motion.div>
            )}
            <ReviewList reviews={reviews} onReviewDeleted={fetchMovieDetail} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}