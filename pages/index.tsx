import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MovieCard from '../components/MovieCard';
import { Movie } from '../lib/types';
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';
import { useSimpleParallax } from '../lib/hooks/useParallax';
import { useReducedMotion } from '../lib/hooks/useReducedMotion';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const parallaxOffset = prefersReducedMotion ? 0 : useSimpleParallax(0.3);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(data.movies || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Movie Reviews - Discover Great Movies</title>
        <meta name="description" content="Browse and review movies" />
      </Head>

      {/* Hero Section with Gradient Background and Parallax */}
      <div 
        ref={heroRef}
        className="relative -mt-4 -mx-4 sm:-mx-6 lg:-mx-8 mb-12 overflow-hidden"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Discover Great Movies
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
              Browse, review, and share your thoughts on the latest films
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading movies...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={fetchMovies}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No movies available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.5 
                    }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}