import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  getUserProgress,
  getUserProfileSummary,
  getUserQuizAttempts,
  getUserExamAttempts,
  getUserSubmissions,
  recordChapterProgress,
} from "@/lib/google-sheets";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    const effectiveUserId = session?.user 
      ? ((session.user as any).id || session.user.email || requestedUserId || "guest-user")
      : (requestedUserId || "guest-user");

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
    const body = await req.json();
    const {
      userId = "guest-user",
      moduleId,
      status = "COMPLETED", // "COMPLETED" | "READ" | "IN_PROGRESS" | "UNMARKED"
    } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json({ error: "Missing or invalid moduleId" }, { status: 400 });
    }

    // Bind authenticated identity to prevent IDOR progress manipulation
    const effectiveUserId = session?.user 
      ? ((session.user as any).id || session.user.email || "student")
      : (userId || "guest-user");

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
