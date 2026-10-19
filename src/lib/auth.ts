import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { recordUser, getOrCreateUser } from "./google-sheets";

// Canonical production URL for Vercel deployment
export const CANONICAL_URL = "https://ccna-learning-platform-yousufs-projects-50c935d3.vercel.app";

// Strictly detect if running on Vercel deployment (never confuse local production builds with Vercel)
const isVercel = Boolean(process.env.VERCEL === "1" || process.env.VERCEL_ENV);

if (isVercel) {
  const vercelHost = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : CANONICAL_URL;

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
            // Enforce PKCE and state checks on production/HTTPS to prevent OAuth CSRF/code injection.
            // In local HTTP dev, checks are relaxed to prevent cross-origin cookie dropping.
            checks: isVercel ? ["pkce", "state"] : ["none"],
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
    // 1. Cadet Access (Pending Approval demo)
    CredentialsProvider({
      id: "demo-student",
      name: "Cadet (Pending Clearance)",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Alex Rivera" },
        email: { label: "Email", type: "email", placeholder: "student@cisco.academy" },
      },
      async authorize(credentials) {
        const email = credentials?.email || "student@cisco.academy";
        const name = credentials?.name || "Alex Rivera";
        const userRec = await getOrCreateUser({
          userId: `cadet-${Buffer.from(email).toString("hex").slice(0, 8)}`,
          email,
          name,
        });
        return {
          id: userRec.userId,
          name: userRec.name,
          email: userRec.email,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          role: userRec.role,
          status: userRec.status,
        };
      },
    }),
    // 2. Cleared Cadet Access (Approved)
    CredentialsProvider({
      id: "demo-approved",
      name: "Approved Cadet (Cleared)",
      credentials: {},
      async authorize() {
        const email = "sarah.connor@cyberdyne.net";
        const userRec = await getOrCreateUser({
          userId: "student-sarah",
          email,
          name: "Sarah Connor (Cleared Cadet)",
        });
        return {
          id: userRec.userId,
          name: userRec.name,
          email: userRec.email,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          role: userRec.role,
          status: userRec.status,
        };
      },
    }),
    // 3. NOC Administrator Access
    CredentialsProvider({
      id: "demo-admin",
      name: "NOC Administrator (Officer)",
      credentials: {},
      async authorize() {
        const email = "admin@ccna.academy";
        const userRec = await getOrCreateUser({
          userId: "admin-demo",
          email,
          name: "Commander Network Admin",
        });
        return {
          id: userRec.userId,
          name: userRec.name,
          email: userRec.email,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          role: userRec.role,
          status: userRec.status,
        };
      },
    }),
  ],
  useSecureCookies: isVercel,
  cookies: {
    sessionToken: {
      name: isVercel ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isVercel,
      },
    },
    callbackUrl: {
      name: isVercel ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isVercel,
      },
    },
    csrfToken: {
      name: isVercel ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isVercel,
      },
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        if ((user as any).role) token.role = (user as any).role;
        if ((user as any).status) token.status = (user as any).status;
      }
      if (token.email) {
        try {
          const userRec = await getOrCreateUser({
            userId: (token.id as string) || (token.sub as string) || token.email,
            email: token.email,
            name: token.name || undefined,
          });
          token.role = userRec.role;
          token.status = userRec.status;
        } catch (err) {
          console.error("[jwt callback error]", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        if (token.sub || token.id) {
          (session.user as any).id = (token.id as string) || (token.sub as string);
        }
        if (token.email) session.user.email = token.email;
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture as string;
        (session.user as any).role = token.role || "STUDENT";
        (session.user as any).status = token.status || "PENDING";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const prodUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : CANONICAL_URL;

      const isRemote = Boolean(
        isVercel || 
        baseUrl.includes("vercel.app") || 
        (typeof window !== "undefined" && !window.location.hostname.includes("localhost"))
      );

      // In production or on Vercel: STRICTLY forbid and purge any localhost redirect
      if (isRemote) {
        const targetBase = baseUrl.includes("localhost") ? prodUrl : baseUrl;
        if (url.includes("localhost")) {
          return url.replace(/https?:\/\/localhost(:\d+)?/, targetBase);
        }
        if (url.startsWith("/")) {
          return `${targetBase}${url}`;
        }
        try {
          const parsed = new URL(url);
          if (parsed.hostname.includes("vercel.app")) {
            return url;
          }
        } catch {}
        return `${targetBase}/dashboard`;
      }

      // Local development
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) {
          return url;
        }
      } catch {}
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user }) {
      try {
        if (user && user.email) {
          await getOrCreateUser({
            userId: user.id || user.email,
            email: user.email,
            name: user.name || "Student",
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
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "ccna-learning-platform-super-secret-key-2026",
  debug: process.env.NODE_ENV !== "production",
  logger: {
    error(code, metadata) {
      console.error("[NextAuth ERROR]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth WARN]", code);
    },
    debug(code, metadata) {
      console.log("[NextAuth DEBUG]", code, metadata);
    },
  },
};
