import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const nextAuthHandler = NextAuth(authOptions);

async function handler(req: NextRequest, ctx: any) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

  // On any remote / Vercel deployment: dynamically bind NEXTAUTH_URL to the incoming request's host
  if (!isLocal && host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
    process.env.AUTH_TRUST_HOST = "true";
  }

  const response = await nextAuthHandler(req, ctx);

  // If deployed on Vercel or remote host, STRICTLY intercept and purge any localhost redirect
  if (!isLocal && response && response.headers) {
    const location = response.headers.get("location");
    if (location && (location.includes("localhost") || location.includes("127.0.0.1"))) {
      const currentOrigin = `${proto}://${host}`;
      const encodedLocal = encodeURIComponent("http://localhost:3000");
      const encodedCurrent = encodeURIComponent(currentOrigin);

      const rewrittenLocation = location
        .replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, currentOrigin)
        .replace(new RegExp(encodedLocal, "g"), encodedCurrent);

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
