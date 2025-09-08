/**
 * Twitter Posting API Route
 * Handles posting individual tweets and threads
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createTwitterClient, validateTweet, prepareThreadForPosting } from '@/lib/twitter';

export async function POST(request: NextRequest) {
  try {
    // Get session to ensure user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, content, accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Twitter access token is required' },
        { status: 400 }
      );
    }

    const twitterClient = createTwitterClient(accessToken);

    if (type === 'single') {
      // Post a single tweet
      const { text } = content;
      
      const validation = validateTweet(text);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: `Invalid tweet: ${validation.errors.join(', ')}` },
          { status: 400 }
        );
      }

      const result = await twitterClient.postTweet(text);
      
      return NextResponse.json({
        success: true,
        tweet: result.data,
        message: 'Tweet posted successfully!'
      });

    } else if (type === 'thread') {
      // Post a thread
      const { tweets } = content;
      
      if (!Array.isArray(tweets) || tweets.length === 0) {
        return NextResponse.json(
          { error: 'Thread must contain at least one tweet' },
          { status: 400 }
        );
      }

      // Validate all tweets
      for (let i = 0; i < tweets.length; i++) {
        const validation = validateTweet(tweets[i]);
        if (!validation.isValid) {
          return NextResponse.json(
            { error: `Invalid tweet ${i + 1}: ${validation.errors.join(', ')}` },
            { status: 400 }
          );
        }
      }

      // Prepare tweets (add numbering except for first tweet)
      const preparedTweets = prepareThreadForPosting(tweets);
      
      const results = await twitterClient.postThread(preparedTweets);
      
      return NextResponse.json({
        success: true,
        thread: results.map(r => r.data),
        message: `Thread with ${results.length} tweets posted successfully!`
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid post type. Use "single" or "thread"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Twitter posting error:', error);
    
    // Handle specific Twitter API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded. Please try again later.',
            type: 'RATE_LIMIT'
          },
          { status: 429 }
        );
      }
      
      if (errorMessage.includes('duplicate') || errorMessage.includes('already') || errorMessage.includes('repeated')) {
        return NextResponse.json(
          { 
            error: 'This content appears to be a duplicate of a recent tweet. Twitter doesn\'t allow posting identical content.',
            type: 'DUPLICATE_CONTENT'
          },
          { status: 400 }
        );
      }

      if (errorMessage.includes('forbidden') || errorMessage.includes('unauthorized')) {
        return NextResponse.json(
          { 
            error: 'Authentication failed. Please log in again.',
            type: 'AUTH_ERROR'
          },
          { status: 401 }
        );
      }

      if (errorMessage.includes('too long') || errorMessage.includes('character limit')) {
        return NextResponse.json(
          { 
            error: 'Tweet content exceeds the character limit.',
            type: 'CHARACTER_LIMIT'
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: error.message,
          type: 'TWITTER_API_ERROR'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while posting to Twitter',
        type: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
