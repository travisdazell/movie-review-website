import type { NextApiRequest, NextApiResponse } from 'next';
import { getMovies, addMovie } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';
import { useMockData, getAllMovies } from '../../../lib/mock-data-loader';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Check if we should use mock data (development mode without Firebase)
      if (useMockData()) {
        console.log('🎬 Development mode: Using mock movie data');
        const movies = getAllMovies();
        return res.status(200).json({ movies });
      }

      // Use Firebase in production or when configured
      const movies = await getMovies();
      res.status(200).json({ movies });
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  } else if (req.method === 'POST') {
    // Create movie (admin only)
    const session = await requireAdmin(req, res);
    if (!session) return;

    try {
      const { title, year, director, actors, image } = req.body;

      if (!title || !year || !director) {
        return res.status(400).json({ error: 'Title, year, and director are required' });
      }

      const movieData = {
        title,
        year: parseInt(year),
        director,
        actors: actors || [],
        image: image || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const id = await addMovie(movieData);
      res.status(201).json({ message: 'Movie created successfully', id });
    } catch (error) {
      console.error('Error creating movie:', error);
      res.status(500).json({ error: 'Failed to create movie' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}