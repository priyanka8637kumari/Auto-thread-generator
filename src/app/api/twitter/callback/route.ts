/**
 * Twitter OAuth Callback Route
 * Handles the callback from Twitter OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { TwitterAuth } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth error
    if (error) {
      const errorDescription = searchParams.get('error_description');
      console.error('OAuth error:', error, errorDescription);
      
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    // Handle missing code
    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=Missing authorization code', request.url)
      );
    }

    // Exchange code for tokens
    const twitterAuth = new TwitterAuth();
    const credentials = await twitterAuth.exchangeCodeForToken(code);

    // Create HTML page that closes popup and passes credentials to parent
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Twitter Authorization Complete</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Authorization Successful!</h2>
            <p>You can close this window now.</p>
            <p style="color: #666; font-size: 14px;">Redirecting back to the app...</p>
          </div>
          <script>
            // Store credentials in localStorage for the main window
            localStorage.setItem('twitter_credentials', JSON.stringify(${JSON.stringify(credentials)}));
            
            // Close the popup window
            if (window.opener) {
              window.close();
            } else {
              // If not a popup, redirect to dashboard
              window.location.href = '/dashboard';
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Twitter callback error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    
    // Create error HTML page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Twitter Authorization Failed</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #ef4444;">Authorization Failed</h2>
            <p>${errorMessage}</p>
            <button onclick="window.close()" style="
              background: #3b82f6; 
              color: white; 
              border: none; 
              padding: 10px 20px; 
              border-radius: 8px; 
              cursor: pointer;
              margin-top: 20px;
            ">
              Close Window
            </button>
          </div>
          <script>
            // If this is a popup, close it after 3 seconds
            if (window.opener) {
              setTimeout(() => window.close(), 3000);
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
      status: 400,
    });
  }
}
