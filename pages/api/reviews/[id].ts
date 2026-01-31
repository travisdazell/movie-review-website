import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteReview } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';
import { useMockData, getReviewById } from '../../../lib/mock-data-loader';

// API route for review operations
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid review ID' });
    return;
  }

  if (req.method === 'GET') {
    // Get a single review
    try {
      if (useMockData()) {
        console.log(`🎬 Development mode: Loading review ${id} from mock data`);
        const review = getReviewById(id);
        
        if (!review) {
          return res.status(404).json({ error: 'Review not found' });
        }

        return res.status(200).json({ review });
      }

      // TODO: Use Firebase to get review when configured
      res.status(404).json({ error: 'Review not found' });
    } catch (error) {
      console.error('Error fetching review:', error);
      res.status(500).json({ error: 'Failed to fetch review' });
    }
  } else if (req.method === 'PUT') {
    // Update review (admin only in production, mock success in dev)
    const session = await requireAdmin(req, res);
    if (!session) return;

    try {
      if (useMockData()) {
        console.log(`⚠️ Review update in mock mode - not persisted`);
        return res.status(200).json({ 
          message: 'Review updated (mock mode - not persisted)',
          id 
        });
      }

      // TODO: Use Firebase to update review when configured
      res.status(200).json({ message: 'Review updated', id });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Failed to update review' });
    }
  } else if (req.method === 'DELETE') {
    // Delete review (admin only)
    const session = await requireAdmin(req, res);
    if (!session) return;

    try {
      if (useMockData()) {
        console.log(`⚠️ Review deletion in mock mode - not persisted`);
        return res.status(204).end(); // No content
      }

      // Use Firebase when configured
      await deleteReview(id as string);
      res.status(204).end(); // No content
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}