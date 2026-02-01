import { Movie, Review } from './types';
import mockData from './data/mock-movies.json';

interface MockDataStructure {
  movies: Movie[];
  reviews: Record<string, Omit<Review, 'movieId'>[]>;
}

/**
 * Check if Firebase is configured
 * Returns true if Firebase environment variables are present
 */
export function isFirebaseConfigured(): boolean {
  const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
  const hasApiKey = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  
  return hasProjectId && hasApiKey;
}

/**
 * Check if we should use mock data
 * Returns true in development mode when Firebase is not configured
 */
export function useMockData(): boolean {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const firebaseConfigured = isFirebaseConfigured();
  
  return isDevelopment && !firebaseConfigured;
}

/**
 * Validate a single movie object
 */
export function isValidMovie(data: any): data is Movie {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.year === 'number' &&
    data.year >= 1970 &&
    data.year <= 2025 &&
    typeof data.director === 'string' &&
    Array.isArray(data.actors) &&
    data.actors.length > 0 &&
    (!data.image || typeof data.image === 'string')
  );
}

/**
 * Validate a single review object
 */
export function isValidReview(data: any): data is Omit<Review, 'movieId'> {
  const validGrades = ['A+', 'A', 'B', 'C', 'D', 'F'];
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.userId === 'string' &&
    typeof data.grade === 'string' &&
    validGrades.includes(data.grade) &&
    typeof data.text === 'string' &&
    data.text.length >= 30 &&
    data.text.length <= 500
  );
}

/**
 * Validate the entire mock data structure
 */
export function validateMockData(data: any): data is MockDataStructure {
  if (!data || typeof data !== 'object') {
    console.error('❌ Mock data validation failed: data is not an object');
    return false;
  }

  if (!Array.isArray(data.movies)) {
    console.error('❌ Mock data validation failed: movies is not an array');
    return false;
  }

  if (!data.reviews || typeof data.reviews !== 'object') {
    console.error('❌ Mock data validation failed: reviews is not an object');
    return false;
  }

  // Validate all movies
  for (let i = 0; i < data.movies.length; i++) {
    if (!isValidMovie(data.movies[i])) {
      console.error(`❌ Mock data validation failed: invalid movie at index ${i}`, data.movies[i]);
      return false;
    }
  }

  // Validate all reviews
  for (const movieId in data.reviews) {
    if (!Array.isArray(data.reviews[movieId])) {
      console.error(`❌ Mock data validation failed: reviews for ${movieId} is not an array`);
      return false;
    }
    for (let i = 0; i < data.reviews[movieId].length; i++) {
      if (!isValidReview(data.reviews[movieId][i])) {
        console.error(`❌ Mock data validation failed: invalid review for ${movieId} at index ${i}`, data.reviews[movieId][i]);
        return false;
      }
    }
  }

  return true;
}

/**
 * Get all movies from mock data
 */
export function getAllMovies(): Movie[] {
  if (!validateMockData(mockData)) {
    console.error('❌ Mock data validation failed, returning empty array');
    return [];
  }

  console.log(`🎬 Development mode: Using mock movie data`);
  console.log(`📊 Loaded ${mockData.movies.length} movies from mock data`);
  
  return mockData.movies;
}

/**
 * Get a single movie by ID
 */
export function getMovieById(id: string): Movie | null {
  if (!validateMockData(mockData)) {
    console.error('❌ Mock data validation failed');
    return null;
  }

  const movie = mockData.movies.find(m => m.id === id);
  
  if (!movie) {
    console.log(`⚠️ Movie not found in mock data: ${id}`);
    return null;
  }

  console.log(`🎬 Loaded movie from mock data: ${movie.title}`);
  return movie;
}

/**
 * Get all reviews for a specific movie
 */
export function getReviewsForMovie(movieId: string): Review[] {
  if (!validateMockData(mockData)) {
    console.error('❌ Mock data validation failed, returning empty array');
    return [];
  }

  const movieReviews = mockData.reviews[movieId] || [];
  
  // Add movieId to each review since it's not stored in the JSON
  const reviewsWithMovieId: Review[] = movieReviews.map(review => ({
    ...review,
    movieId,
    createdAt: new Date(review.createdAt as unknown as string)
  }));

  console.log(`📊 Loaded ${reviewsWithMovieId.length} reviews for movie ${movieId}`);
  
  return reviewsWithMovieId;
}

/**
 * Get a single review by ID
 * Review IDs are in format: rev-{movieNum}-{reviewNum}
 */
export function getReviewById(reviewId: string): Review | null {
  if (!validateMockData(mockData)) {
    console.error('❌ Mock data validation failed');
    return null;
  }

  // Parse movie ID from review ID (e.g., "rev-001-002" -> "mov-001")
  const match = reviewId.match(/^rev-(\d{3})-\d{3}$/);
  if (!match) {
    console.error(`⚠️ Invalid review ID format: ${reviewId}`);
    return null;
  }

  const movieId = `mov-${match[1]}`;
  const movieReviews = mockData.reviews[movieId] || [];
  
  const review = movieReviews.find(r => r.id === reviewId);
  
  if (!review) {
    console.log(`⚠️ Review not found in mock data: ${reviewId}`);
    return null;
  }

  console.log(`📊 Loaded review from mock data: ${reviewId}`);
  return {
    ...review,
    movieId,
    createdAt: new Date(review.createdAt as unknown as string)
  };
}

/**
 * Get movie with its reviews
 */
export function getMovieWithReviews(movieId: string): { movie: Movie; reviews: Review[] } | null {
  const movie = getMovieById(movieId);
  
  if (!movie) {
    return null;
  }

  const reviews = getReviewsForMovie(movieId);
  
  return { movie, reviews };
}

/**
 * Mock success response for creating a review
 * In mock mode, reviews are not persisted
 */
export function createMockReview(movieId: string, userId: string, grade: string, text: string): Review {
  console.log(`⚠️ Review submission in mock mode - not persisted`);
  
  const mockReviewId = `mock-review-${Date.now()}`;
  
  return {
    id: mockReviewId,
    movieId,
    userId,
    grade: grade as Review['grade'],
    text,
    createdAt: new Date()
  };
}

/**
 * Get statistics about mock data
 */
export function getMockDataStats() {
  if (!validateMockData(mockData)) {
    return { movies: 0, reviews: 0, avgReviewsPerMovie: 0 };
  }

  const totalReviews = Object.values(mockData.reviews).reduce(
    (sum, reviews) => sum + reviews.length,
    0
  );

  const avgReviewsPerMovie = Math.round(totalReviews / mockData.movies.length);

  return {
    movies: mockData.movies.length,
    reviews: totalReviews,
    avgReviewsPerMovie
  };
}
