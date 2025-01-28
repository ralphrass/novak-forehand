// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.picture = user.image;
      }
      return token;
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };