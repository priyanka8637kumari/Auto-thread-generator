'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

// Note: This component is deprecated. Use LoginButton or UserWelcome instead.
export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-white">Welcome, {session.user?.name}</p>
        <button 
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('twitter')}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      Sign in with Twitter
    </button>
  );
}
