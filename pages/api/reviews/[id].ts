import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteReview } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

// API route for review operations
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    // Delete review (admin only)
    const session = await requireAdmin(req, res);
    if (!session) return;

    try {
      await deleteReview(id as string);
      res.status(204).end(); // No content
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}