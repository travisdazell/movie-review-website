import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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

  if (req.method === 'POST') {
    const session = await requireAuth(req, res);
    if (!session) return;

    const { text, grade } = req.body;

    if (!text || !grade) {
      return res.status(400).json({ error: 'Text and grade are required' });
    }

    try {
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
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}