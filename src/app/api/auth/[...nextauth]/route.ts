import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Ensure OAuth 2.0 is used
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<ExtendedSession> {
      const extendedSession = session as ExtendedSession;
      if (extendedSession.user) {
        extendedSession.user.id = token.sub; // Attach user ID if needed
      }
      return extendedSession;
    },
  },
});

export { handler as GET, handler as POST };
