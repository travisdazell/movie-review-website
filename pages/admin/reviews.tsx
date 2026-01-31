import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { Review } from '../../lib/types';
import { Timestamp } from 'firebase/firestore';

interface ReviewWithMovie extends Review {
  movieTitle?: string;
}

const toDate = (date: Date | Timestamp | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (date instanceof Timestamp) return date.toDate();
  return null;
};

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewWithMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Redirect if not authenticated or not admin
  if (status === 'loading') {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!session || !session.isAdmin) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Access denied. Admin privileges required.</div>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteError(null);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Remove the review from the local state
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => router.push('/admin')}>Back to Admin</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Manage Reviews - Admin Panel</title>
        <meta name="description" content="Admin panel for managing reviews" />
      </Head>

      <div className="py-8">
        <div className="mb-6">
          <Link href="/admin">
            <button className="text-blue-600 hover:text-blue-800 mb-4 flex items-center">
              ← Back to Admin Panel
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Reviews</h1>
          <p className="text-gray-600 mt-2">Review and moderate user-submitted reviews</p>
        </div>

        {deleteError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{deleteError}</p>
              </div>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No reviews found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Grade: {review.grade}
                      </span>
                      <span className="text-sm text-gray-500">
                        {toDate(review.createdAt)?.toLocaleDateString() || 'Unknown date'}
                      </span>
                    </div>
                    {review.movieTitle && (
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Movie: {review.movieTitle}
                      </h3>
                    )}
                    <p className="text-gray-700 mb-4">{review.text}</p>
                    <p className="text-sm text-gray-500">
                      By: {review.userId || 'Anonymous'}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Button
                      onClick={() => handleDeleteReview(review.id!)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}