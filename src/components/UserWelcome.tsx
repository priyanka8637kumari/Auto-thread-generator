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
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Return null while redirecting
  return null;
}
