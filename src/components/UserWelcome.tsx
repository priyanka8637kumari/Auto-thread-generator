'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserWelcome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to homepage if not logged in
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/');
    }
  }, [session, status, router]);

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-white">Loading...</h2>
      </div>
    );
  }

  // Only show welcome message if logged in
  if (session) {
    return (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-white">
          Welcome, {session.user?.name || 'User'}!
        </h2>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-gray-800/60 backdrop-blur-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl border border-gray-600/40 hover:border-gray-500/60 hover:bg-gray-700/60 hover:shadow-lg hover:shadow-gray-400/20 transition-all duration-300 flex items-center gap-2 group"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    );
  }

  // Return null while redirecting
  return null;
}
