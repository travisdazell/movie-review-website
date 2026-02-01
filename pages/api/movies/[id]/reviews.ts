import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { useMockData, getReviewsForMovie, createMockReview } from '../../../../lib/mock-data-loader';
// import { addReview } from '../../../lib/db';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      session.isAdmin = adminEmails.includes(session.user?.email || '');
      return session;
    },
  },
};

async function requireAuth(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return session;
}

const addReview = (review: any) => {
  return 'mock-review-id';
};

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
    // Get reviews for a movie
    try {
      if (useMockData()) {
        console.log(`🎬 Development mode: Loading reviews for movie ${id} from mock data`);
        const reviews = getReviewsForMovie(id);
        return res.status(200).json({ reviews });
      }

      // TODO: Use Firebase to get reviews when configured
      res.status(200).json({ reviews: [] });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  } else if (req.method === 'POST') {
    const session = await requireAuth(req, res);
    if (!session) return;

    const { text, grade } = req.body;

    if (!text || !grade) {
      return res.status(400).json({ error: 'Text and grade are required' });
    }

    try {
      // Check if we're in mock mode
      if (useMockData()) {
        console.log(`⚠️ Review submission in mock mode - not persisted`);
        const mockReview = createMockReview(
          id,
          session.user?.email || 'anonymous',
          grade,
          text
        );
        return res.status(201).json({ 
          id: mockReview.id,
          message: 'Review submitted (mock mode - not persisted)',
          review: mockReview
        });
      }

      // Use Firebase when configured
      const reviewId = await addReview({
        movieId: id as string,
        userId: session.user.id,
        text,
        grade,
        createdAt: new Date(),
      });

      res.status(201).json({ id: reviewId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add review' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}