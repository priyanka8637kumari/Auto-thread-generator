/**
 * Twitter User Info API Route
 * Gets authenticated user's Twitter profile information
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createTwitterClient } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  try {
    // Get session to ensure user is authenticated
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get access token from query parameters
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Twitter access token is required' },
        { status: 400 }
      );
    }

    const twitterClient = createTwitterClient(accessToken);
    const userInfo = await twitterClient.getUserInfo();
    
    return NextResponse.json({
      success: true,
      user: userInfo
    });

  } catch (error) {
    console.error('Twitter user info error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Invalid or expired Twitter access token' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get Twitter user information' },
      { status: 500 }
    );
  }
}
