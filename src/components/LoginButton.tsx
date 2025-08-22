'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from './ui/moving-border';

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
      // <button 
      //   onClick={() => signIn('twitter')}
      //   className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
      // >
      //   Sign in with Twitter
      // </button>
      <Button
        onClick={() => signIn('twitter')}
        
        className="bg-black/30 backdrop-blur-xl hover:bg-black/50 text-white border-2 border-cyan-400/60 hover:border-cyan-300 px-8 py-3 font-medium rounded-full transition-all duration-300 shadow-2xl hover:shadow-cyan-400/30 hover:scale-105 whitespace-nowrap"
      >
        
        Sign in with <span className="w-5 h-5 ml-2 flex items-center justify-center font-bold text-lg">𝕏</span> 
      </Button>
    );
  }

  // Return null while redirecting
  return null;
}
