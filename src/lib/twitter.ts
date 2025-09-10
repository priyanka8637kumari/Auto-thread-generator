/**
 * Twitter API v2 Integration Utilities
 * Handles authentication and posting to Twitter/X
 */

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

export interface TwitterCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface PostTweetResponse {
  data: {
    id: string;
    text: string;
  };
}

export interface TwitterApiError {
  title: string;
  detail: string;
  type: string;
}

/**
 * Twitter API Client Class
 */
export class TwitterApiClient {
  private baseUrl = 'https://api.twitter.com/2';
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Get authenticated user information
   */
  async getUserInfo(): Promise<TwitterUser> {
    const response = await fetch(`${this.baseUrl}/users/me`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get user info: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Post a single tweet
   */
  async postTweet(text: string, replyToId?: string): Promise<PostTweetResponse> {
    const payload: {
      text: string;
      reply?: {
        in_reply_to_tweet_id: string;
      };
    } = {
      text: text.slice(0, 280), // Ensure character limit
    };

    // If this is a reply, add the reply field
    if (replyToId) {
      payload.reply = {
        in_reply_to_tweet_id: replyToId
      };
    }

    const response = await fetch(`${this.baseUrl}/tweets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Extract more specific error information
      let errorMessage = 'Failed to post tweet';
      
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        const firstError = error.errors[0];
        errorMessage = firstError.message || firstError.detail || errorMessage;
      } else if (error.detail) {
        errorMessage = error.detail;
      } else if (error.title) {
        errorMessage = error.title;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Post a thread (multiple tweets in sequence)
   */
  async postThread(tweets: string[]): Promise<PostTweetResponse[]> {
    const results: PostTweetResponse[] = [];
    let replyToId: string | undefined;

    for (let i = 0; i < tweets.length; i++) {
      try {
        // Add a delay between tweets to avoid rate limits
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }

        const result = await this.postTweet(tweets[i], replyToId);
        results.push(result);
        
        // Set the reply ID for the next tweet
        replyToId = result.data.id;
        
      } catch (error) {
        console.error(`Failed to post tweet ${i + 1}:`, error);
        throw new Error(`Failed to post tweet ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }
}

/**
 * OAuth 2.0 Twitter Authentication Helper
 */
export class TwitterAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.TWITTER_CLIENT_ID!;
    this.clientSecret = process.env.TWITTER_CLIENT_SECRET!;
    this.redirectUri = process.env.TWITTER_REDIRECT_URI!;
  }

  /**
   * Generate OAuth 2.0 authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const scopes = ['tweet.write', 'tweet.read', 'users.read'].join(' ');
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes,
      state: state || 'default',
      code_challenge: 'challenge', // In production, use PKCE
      code_challenge_method: 'plain'
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TwitterCredentials> {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code_verifier: 'challenge', // Should match code_challenge
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token exchange failed: ${error.error_description || response.statusText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? Date.now() + (data.expires_in * 1000) : undefined,
    };
  }

  /**
   * Refresh an expired access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TwitterCredentials> {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token refresh failed: ${error.error_description || response.statusText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresAt: data.expires_in ? Date.now() + (data.expires_in * 1000) : undefined,
    };
  }
}

/**
 * Helper function to create a Twitter API client from session
 */
export function createTwitterClient(accessToken: string): TwitterApiClient {
  return new TwitterApiClient(accessToken);
}

/**
 * Validate tweet content for Twitter's requirements
 */
export function validateTweet(text: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!text || text.trim().length === 0) {
    errors.push('Tweet cannot be empty');
  }
  
  if (text.length > 280) {
    errors.push(`Tweet is too long (${text.length}/280 characters)`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Prepare thread for posting (add numbering to tweets after the first one)
 */
export function prepareThreadForPosting(tweets: string[]): string[] {
  return tweets.map((tweet, index) => {
    if (index === 0) return tweet; // First tweet without numbering
    return `${index + 1}/ ${tweet}`;
  });
}

/**
 * Add unique elements to tweets to avoid duplicate content detection
 */
export function makeThreadUnique(tweets: string[]): string[] {
  return tweets.map((tweet, index) => {
    // Add a unique element to each tweet while keeping it natural
    const uniqueElements = [
      '', // Keep some tweets unchanged
      '🧵', // Thread emoji
      '👇', // Down arrow emoji
      '💭', // Thought emoji
      '✨', // Sparkles emoji
    ];
    
    const element = uniqueElements[index % uniqueElements.length];
    
    // Add the unique element at the end if it's not empty
    if (element && !tweet.includes(element)) {
      return `${tweet} ${element}`;
    }
    
    return tweet;
  });
}
