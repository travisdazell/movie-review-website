import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Movie } from '../lib/types';
import { use3DTilt } from '../lib/hooks/use3DTilt';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { transform, handleMouseMove, handleMouseLeave } = use3DTilt(cardRef, {
    maxTilt: 10,
    scale: 1.05,
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className="group"
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer glass">
          {/* Image Container with Zoom and Gradient Overlay */}
          <div className="relative aspect-w-2 aspect-h-3 bg-gray-200 overflow-hidden">
            <motion.div
              className="w-full h-32 sm:h-40 md:h-48"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {movie.image ? (
                <>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 skeleton" />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
            </motion.div>
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Card Content */}
          <div className="p-3 sm:p-4 bg-white/95">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-600">{movie.year}</p>
            {movie.director && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">
                Directed by {movie.director}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}