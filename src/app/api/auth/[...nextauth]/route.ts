import NextAuth from "next-auth";
import { authOptions, CANONICAL_URL } from "@/lib/auth";
import { NextRequest } from "next/server";

const nextAuthHandler = NextAuth(authOptions);

// Trusted domain validation to prevent Host Header Injection / Environmental Pollution
function isTrustedHost(host: string): boolean {
  if (!host) return false;
  const cleanHost = host.split(":")[0].toLowerCase();
  
  // Local development
  if (cleanHost === "localhost" || cleanHost === "127.0.0.1") return true;
  
  // Vercel deployment domains
  if (cleanHost.endsWith(".vercel.app")) return true;
  
  // Canonical production URL
  try {
    const canonicalHost = new URL(CANONICAL_URL).hostname.toLowerCase();
    if (cleanHost === canonicalHost) return true;
  } catch {}

  // Explicit allowed host from environment if configured
  if (process.env.NEXTAUTH_URL) {
    try {
      const envHost = new URL(process.env.NEXTAUTH_URL).hostname.toLowerCase();
      if (cleanHost === envHost) return true;
    } catch {}
  }

  return false;
}

async function handler(req: NextRequest, ctx: any) {
  const rawHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isLocal = rawHost.includes("localhost") || rawHost.includes("127.0.0.1");

  // Only bind trusted hosts to prevent Host Header Injection / Cache Poisoning
  if (!isLocal && isTrustedHost(rawHost)) {
    const proto = req.headers.get("x-forwarded-proto") === "http" ? "http" : "https";
    process.env.NEXTAUTH_URL = `${proto}://${rawHost}`;
    process.env.AUTH_TRUST_HOST = "true";
  }

  const response = await nextAuthHandler(req, ctx);

  // If deployed on Vercel or remote host, intercept and purge any localhost redirect
  if (!isLocal && response && response.headers) {
    const location = response.headers.get("location");
    if (location && (location.includes("localhost") || location.includes("127.0.0.1"))) {
      const trustedTarget = isTrustedHost(rawHost) 
        ? `https://${rawHost}` 
        : CANONICAL_URL;

      const encodedLocal = encodeURIComponent("http://localhost:3000");
      const encodedTarget = encodeURIComponent(trustedTarget);

      const rewrittenLocation = location
        .replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, trustedTarget)
        .replace(new RegExp(encodedLocal, "g"), encodedTarget);

      const newHeaders = new Headers(response.headers);
      newHeaders.set("location", rewrittenLocation);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }
  }

  return response;
}

export { handler as GET, handler as POST };
