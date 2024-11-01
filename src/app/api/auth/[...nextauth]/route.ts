// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (user && (await compare(credentials.password, user.password))) {
          return {
            id: user.id,
            name: user.name,
            type: user.type,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,       // Type assertion
          type: token.type as string,   // Type assertion
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Optionally, define a custom sign-in page
  },
};

// Export the NextAuth handler with `GET` and `POST` methods for Next.js 13 route format
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };