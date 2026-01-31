import type { NextApiRequest, NextApiResponse } from 'next';
import { getMovie, getReviews } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid movie ID' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const movie = await getMovie(id);
      if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }

      const reviews = await getReviews(id);
      res.status(200).json({ movie, reviews });
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}