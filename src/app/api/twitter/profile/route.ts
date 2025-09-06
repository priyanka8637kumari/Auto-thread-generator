import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace('Bearer ', '');
    console.log('Fetching Twitter profile with access token:', accessToken.substring(0, 20) + '...');

    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Twitter API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch Twitter profile', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Twitter profile data received:', JSON.stringify(data, null, 2));
    
    const result = {
      id: data.data?.id,
      name: data.data?.name,
      username: data.data?.username,
      profileImage: data.data?.profile_image_url,
    };

    console.log('Returning profile data:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in Twitter profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
