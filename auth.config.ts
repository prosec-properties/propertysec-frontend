import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        token: {},
        tokenExpiresAt: {},
        user: {},
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials || !credentials.token) return null;
          const { token, tokenExpiresAt, ...user } = credentials;


          const userInfo = {
            token,
            expiresAt: tokenExpiresAt,
            ...user,
          };

          return userInfo;
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {

        const expiresAtMillis = new Date(user.expiresAt).getTime();
        const currentMillis = Date.now();
        const futureMillis = currentMillis + expiresAtMillis;
        const futureSeconds = Math.floor(futureMillis / 1000);

        token.accessToken = user?.token;
        token.expiresAt = futureSeconds;
        token.user = user;
        token.expiresAtString = user.expiresAt;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.expires = token.expiresAtString as any;
        session.accessToken = token.accessToken;
        session.user = token.user as any;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
