import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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

export async function requireAuth(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return session;
}

export async function requireAdmin(req: any, res: any) {
  const session = await requireAuth(req, res);
  if (!session) return false;

  // For now, check if email is in a hardcoded admin list
  // In production, this would check the user's role from database
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!adminEmails.includes(session.user?.email || '')) {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }

  return session;
}

export async function getUserFromSession(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  return session?.user;
}