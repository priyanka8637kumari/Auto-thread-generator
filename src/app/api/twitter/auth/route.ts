/**
 * Twitter Authentication API Route
 * Handles OAuth flow initiation
 */

import { NextRequest, NextResponse } from 'next/server';
import { TwitterAuth } from '@/lib/twitter';

export async function GET(_request: NextRequest) {
  try {
    const twitterAuth = new TwitterAuth();
    const authUrl = twitterAuth.getAuthorizationUrl();
    
    return NextResponse.json({ 
      authUrl,
      message: 'Redirect to this URL to authenticate with Twitter'
    });
  } catch (error) {
    console.error('Twitter auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Twitter authentication URL' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const twitterAuth = new TwitterAuth();
    const credentials = await twitterAuth.exchangeCodeForToken(code);
    
    return NextResponse.json({ 
      success: true,
      credentials 
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to exchange code for token' },
      { status: 500 }
    );
  }
}
