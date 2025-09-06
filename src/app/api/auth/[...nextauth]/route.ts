import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Ensure OAuth 2.0 is used
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read tweet.write",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Save the access token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        console.log('Account data:', account);
      }
      // Save the Twitter username from the profile
      if (profile) {
        console.log('Profile data received:', JSON.stringify(profile, null, 2));
        
        // Try multiple ways to extract the username
        let username = null;
        
        // Method 1: Direct username field
        if ((profile as any).username) {
          username = (profile as any).username;
        }
        // Method 2: From data object (Twitter API v2 format)
        else if ((profile as any).data && (profile as any).data.username) {
          username = (profile as any).data.username;
        }
        // Method 3: From screen_name (Twitter API v1 format)
        else if ((profile as any).screen_name) {
          username = (profile as any).screen_name;
        }
        // Method 4: Extract from profile URL if available
        else if (profile.image && profile.image.includes('twitter.com/')) {
          const match = profile.image.match(/twitter\.com\/([^\/]+)/);
          if (match) username = match[1];
        }
        
        console.log('Extracted username:', username);
        token.username = username;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<ExtendedSession> {
      const extendedSession = session as ExtendedSession;
      if (extendedSession.user) {
        extendedSession.user.id = token.sub;
        extendedSession.user.username = token.username as string;
      }
      extendedSession.accessToken = token.accessToken as string;
      console.log('Final session username:', extendedSession.user?.username);
      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
