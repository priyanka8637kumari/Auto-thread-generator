import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Ensure OAuth 2.0 is used
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      (session.user as any).id = token.sub; // Attach user ID if needed
      return session;
    },
  },
});

export { handler as GET, handler as POST };
