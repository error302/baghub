import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Mock users for demo purposes
const users = [
  {
    id: "1",
    email: "admin@baghub.com",
    name: "Admin User",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE1nMpqVJOKnMvLjp9FGYHBRHGJz5m", // password: admin123
    role: "admin",
  },
  {
    id: "2",
    email: "user@baghub.com",
    name: "Test User",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE1nMpqVJOKnMvLjp9FGYHBRHGJz5m", // password: user123
    role: "customer",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};