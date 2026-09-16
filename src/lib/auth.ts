import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { recordUser } from "./google-sheets";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID.replace(/["']/g, "").trim(),
            clientSecret: process.env.GOOGLE_CLIENT_SECRET.replace(/["']/g, "").trim(),
          }),
        ]
      : []),
    // Demo / Instant Student Access Provider
    CredentialsProvider({
      id: "demo-student",
      name: "Instant Access (Student)",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Alex Rivera" },
        email: { label: "Email", type: "email", placeholder: "student@cisco.academy" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return {
            id: "student-101",
            name: "Cadet Network Engineer",
            email: "student@ccna.academy",
            image: "https://api.dicebear.com/7.x/bottts/svg?seed=cisco-student",
          };
        }
        return {
          id: `student-${Buffer.from(credentials.email).toString("hex").slice(0, 8)}`,
          name: credentials.name || "CCNA Student",
          email: credentials.email,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${credentials.email}`,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async signIn({ user }) {
      if (user && user.email) {
        // Record user to Google Sheets / database
        await recordUser({
          userId: user.id || user.email,
          email: user.email,
          name: user.name || "Student",
          joinedAt: new Date().toISOString(),
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "ccna-learning-platform-super-secret-key-2026",
};
