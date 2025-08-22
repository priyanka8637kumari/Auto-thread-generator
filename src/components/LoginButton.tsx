'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
        Loading...
      </button>
    );
  }

  // Only show sign in button if not logged in
  if (!session) {
    return (
      <button 
        onClick={() => signIn('twitter')}
        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
      >
        Sign in with Twitter
      </button>
    );
  }

  // Return null while redirecting
  return null;
}
