import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  getUserProgress,
  getUserProfileSummary,
  getUserQuizAttempts,
  getUserExamAttempts,
  getUserSubmissions,
  recordChapterProgress,
  isUserAdmin,
} from "@/lib/google-sheets";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = getClientIp(req);

    // Rate limiting: max 60 requests per minute
    const rateCheck = checkRateLimit(`progress-get-${session?.user?.email || clientIp}`, 60, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(rateCheck.reset) } }
      );
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    // Prevent IDOR: unauthenticated callers cannot enumerate other students' grades
    let effectiveUserId: string;
    if (session?.user?.email) {
      const isAdmin = isUserAdmin(session.user.email);
      if (requestedUserId && isAdmin) {
        effectiveUserId = requestedUserId; // Admin can inspect cadet records
      } else {
        effectiveUserId = (session.user as any).id || session.user.email;
      }
    } else {
      // Unauthenticated guests only get guest data, never real student records
      effectiveUserId = "guest-user";
    }

    const [progress, summary, quizAttempts, examAttempts, videoSubmissions] =
      await Promise.all([
        getUserProgress(effectiveUserId),
        getUserProfileSummary(effectiveUserId),
        getUserQuizAttempts(effectiveUserId),
        getUserExamAttempts(effectiveUserId),
        getUserSubmissions(effectiveUserId),
      ]);

    return NextResponse.json({
      progress,
      summary,
      quizAttempts,
      examAttempts,
      videoSubmissions,
    });
  } catch (error) {
    console.error("Failed to load user progress & summary:", error);
    return NextResponse.json(
      { error: "Failed to load progress data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = getClientIp(req);

    // Rate limit: max 40 progress updates per minute
    const rateCheck = checkRateLimit(`progress-post-${session?.user?.email || clientIp}`, 40, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many progress updates. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rateCheck.reset) } }
      );
    }

    const body = await req.json();
    const { moduleId, status = "COMPLETED" } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json({ error: "Missing or invalid moduleId" }, { status: 400 });
    }

    // Require authenticated session for persistent cloud database records
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: true,
          guest: true,
          message: "Progress noted for guest session. Sign in with Google to sync to your permanent gradebook.",
        },
        { status: 200 }
      );
    }

    // Strictly bind user identity to authenticated session token
    const effectiveUserId = (session.user as any).id || session.user.email;

    const updatedProgress = await recordChapterProgress(effectiveUserId, moduleId, status);
    const summary = await getUserProfileSummary(effectiveUserId);

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      summary,
    });
  } catch (error) {
    console.error("Failed to update chapter progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
