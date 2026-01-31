import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import MovieForm from '../../components/MovieForm';
import Button from '../../components/Button';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleMovieSubmit = async (movieData: {
    title: string;
    year: number;
    director: string;
    actors: string[];
    image?: string;
  }) => {
    try {
      setErrorMessage('');
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create movie');
      }

      const result = await response.json();
      setSuccessMessage(`Movie "${movieData.title}" created successfully!`);
      setErrorMessage('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Error creating movie: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setSuccessMessage('');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Admin Panel - Movie Reviews</title>
        <meta name="description" content="Admin panel for managing movies" />
      </Head>

      <div className="py-8">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage movies and site content</p>
        </motion.div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 shadow-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link href="/admin/reviews">
            <motion.div
              className="glass shadow-lg rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-semibold bg-gradient-secondary bg-clip-text text-transparent mb-2">Manage Reviews</h3>
              <p className="text-gray-600 text-sm">Review and moderate user-submitted reviews</p>
            </motion.div>
          </Link>
          <motion.div
            className="glass shadow-lg rounded-lg p-6"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold bg-gradient-accent bg-clip-text text-transparent mb-2">Add New Movie</h3>
            <p className="text-gray-600 text-sm">Create new movies in the database</p>
          </motion.div>
        </motion.div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Movie</h2>
          <MovieForm onSubmit={handleMovieSubmit} />
        </div>
      </div>
    </Layout>
  );
}