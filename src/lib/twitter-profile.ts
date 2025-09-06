// Utility to fetch Twitter profile information
export async function getTwitterProfile(accessToken: string) {
  try {
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch Twitter profile:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Twitter profile data:', data);
    
    return {
      id: data.data?.id,
      name: data.data?.name,
      username: data.data?.username,
      profileImage: data.data?.profile_image_url,
    };
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    return null;
  }
}
