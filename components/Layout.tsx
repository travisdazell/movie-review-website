import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white shadow"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Movie Reviews</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Navigation />
            </div>
          </div>
        </div>
      </motion.header>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>
    </div>
  );
}