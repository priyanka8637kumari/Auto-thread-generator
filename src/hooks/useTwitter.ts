/**
 * Custom React Hook for Twitter Integration
 * Handles authentication via NextAuth and posting functionality
 */

import { useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { TwitterUser } from '@/lib/twitter';

interface UseTwitterOptions {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

interface TwitterHookState {
  isPosting: boolean;
  postingProgress: number;
  postingIndex: number | null;
}

// Extended session interface that matches our NextAuth configuration
interface ExtendedSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
  accessToken?: string;
}

export function useTwitter(options: UseTwitterOptions = {}) {
  const { data: sessionData } = useSession();
  const session = sessionData as ExtendedSession;
  
  const [state, setState] = useState<TwitterHookState>({
    isPosting: false,
    postingProgress: 0,
    postingIndex: null,
  });

  // Check if user is connected to Twitter (has NextAuth session)
  const isConnected = !!session?.user;

  // Get user info from NextAuth session (memoized to prevent dependency issues)
  const user: TwitterUser | null = useMemo(() => {
    return session?.user ? {
      id: session.user.id || '',
      username: session.user.name?.replace('@', '') || '',
      name: session.user.name || '',
      profile_image_url: session.user.image || undefined,
    } : null;
  }, [session?.user]);

  // Connect to Twitter (redirect to NextAuth)
  const connectTwitter = useCallback(async () => {
    try {
      // Since we're using NextAuth, redirect to sign in
      const { signIn } = await import('next-auth/react');
      await signIn('twitter');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect to Twitter';
      options.onError?.(message);
      throw error;
    }
  }, [options]);

  // Get user info (already available from session)
  const getUserInfo = useCallback(async () => {
    if (!session?.user) {
      throw new Error('No Twitter session available');
    }
    return user;
  }, [session, user]);

  // Post a single tweet using NextAuth session
  const postSingleTweet = useCallback(async (text: string, tweetIndex?: number) => {
    if (!session?.accessToken) {
      throw new Error('Not connected to Twitter');
    }

    setState(prev => ({ 
      ...prev, 
      isPosting: true, 
      postingIndex: tweetIndex ?? null 
    }));

    try {
      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'single',
          content: { text },
          accessToken: session.accessToken,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to post tweet');
      }

      options.onSuccess?.(data.message);
      return data.tweet;

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to post tweet';
      options.onError?.(message);
      throw error;
    } finally {
      setState(prev => ({ 
        ...prev, 
        isPosting: false, 
        postingIndex: null 
      }));
    }
  }, [session, options]);

  // Post a thread using NextAuth session
  const postThread = useCallback(async (tweets: string[]) => {
    if (!session?.accessToken) {
      throw new Error('Not connected to Twitter');
    }

    setState(prev => ({ 
      ...prev, 
      isPosting: true, 
      postingProgress: 0 
    }));

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          postingProgress: Math.min(prev.postingProgress + 10, 90)
        }));
      }, 200);

      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'thread',
          content: { tweets },
          accessToken: session.accessToken,
        }),
      });

      clearInterval(progressInterval);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to post thread');
      }

      setState(prev => ({ ...prev, postingProgress: 100 }));
      options.onSuccess?.(data.message);
      return data.thread;

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to post thread';
      options.onError?.(message);
      throw error;
    } finally {
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          isPosting: false, 
          postingProgress: 0,
          postingIndex: null 
        }));
      }, 1000);
    }
  }, [session, options]);

  // Disconnect from Twitter (sign out from NextAuth)
  const disconnect = useCallback(async () => {
    try {
      const { signOut } = await import('next-auth/react');
      await signOut();
      options.onSuccess?.('Disconnected from Twitter');
    } catch (_error) {
      options.onError?.('Failed to disconnect');
    }
  }, [options]);

  // Load saved credentials (not needed with NextAuth)
  const loadSavedCredentials = useCallback(() => {
    // NextAuth handles this automatically
    return null;
  }, []);

  return {
    // State
    isConnected,
    user,
    isPosting: state.isPosting,
    postingProgress: state.postingProgress,
    postingIndex: state.postingIndex,
    
    // Actions
    connectTwitter,
    getUserInfo,
    postSingleTweet,
    postThread,
    disconnect,
    loadSavedCredentials,
  };
}
