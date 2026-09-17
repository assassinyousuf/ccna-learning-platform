import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { recordUser } from "./google-sheets";

// If running on Vercel or in production, ensure NEXTAUTH_URL points to the real Vercel host
if (process.env.VERCEL || process.env.VERCEL_URL || process.env.NODE_ENV === "production") {
  const vercelHost = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://ccna-learning-platform-noywwyj5z-yousufs-projects-50c935d3.vercel.app";

  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
    process.env.NEXTAUTH_URL = vercelHost;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID.replace(/["']/g, "").trim(),
            clientSecret: process.env.GOOGLE_CLIENT_SECRET.replace(/["']/g, "").trim(),
            authorization: {
              params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code",
              },
            },
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        if (token.sub) {
          (session.user as { id?: string }).id = token.sub;
        }
        if (token.email) session.user.email = token.email;
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const prodUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://ccna-learning-platform-noywwyj5z-yousufs-projects-50c935d3.vercel.app";

      const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.NODE_ENV === "production");

      // In production or on Vercel: STRICTLY forbid and purge any localhost redirect
      if (isVercel) {
        if (url.includes("localhost")) {
          return url.replace(/https?:\/\/localhost(:\d+)?/, prodUrl);
        }
        if (url.startsWith("/")) {
          return `${prodUrl}${url}`;
        }
        try {
          const parsed = new URL(url);
          if (parsed.hostname.includes("vercel.app")) {
            return url;
          }
        } catch {}
        return `${prodUrl}/dashboard`;
      }

      // Local development
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return url;
    },
    async signIn({ user }) {
      try {
        if (user && user.email) {
          // Record user to Google Sheets / database
          await recordUser({
            userId: user.id || user.email,
            email: user.email,
            name: user.name || "Student",
            joinedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("[signIn callback error]", err);
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "ccna-learning-platform-super-secret-key-2026",
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("[NextAuth ERROR]", code, JSON.stringify(metadata, null, 2));
    },
    warn(code) {
      console.warn("[NextAuth WARN]", code);
    },
    debug(code, metadata) {
      console.log("[NextAuth DEBUG]", code, metadata);
    },
  },
};
