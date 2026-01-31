import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Require admin authentication
  const session = await requireAdmin(req, res);
  if (!session) return;

  try {
    // Get all reviews
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const reviewsSnapshot = await getDocs(q);

    // Get all movies for title lookup
    const moviesRef = collection(db, 'movies');
    const moviesSnapshot = await getDocs(moviesRef);
    const moviesMap = new Map();
    moviesSnapshot.docs.forEach(doc => {
      moviesMap.set(doc.id, doc.data().title);
    });

    // Combine reviews with movie titles
    const reviews = reviewsSnapshot.docs.map(doc => {
      const reviewData = doc.data();
      return {
        id: doc.id,
        ...reviewData,
        movieTitle: moviesMap.get(reviewData.movieId) || 'Unknown Movie',
        createdAt: reviewData.createdAt?.toDate?.() ? reviewData.createdAt.toDate() : reviewData.createdAt,
      };
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}