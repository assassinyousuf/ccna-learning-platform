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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Determine production base URL if deployed on Vercel
      const vercelHost = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://ccna-learning-platform-noywwyj5z-yousufs-projects-50c935d3.vercel.app";

      // If running on Vercel or in production, NEVER redirect to localhost
      let resolvedBase = baseUrl;
      if ((process.env.NODE_ENV === "production" || process.env.VERCEL) && baseUrl.includes("localhost")) {
        resolvedBase = vercelHost;
      }

      // Handle relative paths like /dashboard
      if (url.startsWith("/")) {
        return `${resolvedBase}${url}`;
      }

      // Handle absolute URLs
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname.includes("vercel.app") || parsedUrl.hostname === new URL(resolvedBase).hostname) {
          return url;
        }
      } catch {
        // Fallback to dashboard
      }

      return `${resolvedBase}/dashboard`;
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
