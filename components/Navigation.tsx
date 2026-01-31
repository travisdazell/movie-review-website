import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '../lib/hooks/useScrollAnimation';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 50;

  return (
    <nav className={`flex items-center transition-all duration-300 ${isScrolled ? 'glass shadow-lg' : ''}`}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/" className="nav-link text-gray-700 hover:text-purple-600 text-sm md:text-base relative group">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {session?.isAdmin && (
          <Link href="/admin" className="nav-link text-gray-700 hover:text-purple-600 text-sm md:text-base relative group">
            Admin
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        )}

        {status === 'loading' ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
        ) : session ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 text-xs md:text-sm hidden sm:inline">
              Welcome, {session.user?.name || session.user?.email}
            </span>
            <motion.button
              onClick={() => signOut()}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded text-xs md:text-sm transition-shadow hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Out
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => signIn('google')}
            className="bg-gradient-primary text-white px-3 py-1 rounded text-xs md:text-sm transition-shadow hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-gray-700 hover:text-purple-600 text-sm font-medium">
            Home
          </Link>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-purple-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 glass rounded-md shadow-lg overflow-hidden"
            >
              <div className="flex flex-col space-y-2 p-4">
                {session?.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-purple-600 text-sm py-2 border-b border-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                {status === 'loading' ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                ) : session ? (
                  <>
                    <span className="text-gray-600 text-xs py-2">
                      {session.user?.name || session.user?.email}
                    </span>
                    <motion.button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded text-sm"
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Out
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    onClick={() => {
                      signIn('google');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-primary text-white px-3 py-2 rounded text-sm"
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}