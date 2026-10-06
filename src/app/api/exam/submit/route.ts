import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { recordExamAttempt, getUserProfileSummary, ExamAttemptRecord } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      examMode = "AUTHENTIC_100",
      examTitle = "CCNA Blueprint Simulator",
      scaledScore = 300,
      rawScore = 0,
      totalQuestions = 60,
      percentage = 0,
      passed = false,
      domainScores = {},
      timeTakenSeconds = 0,
      userId = "guest-cadet",
      userEmail = "guest@ccna.academy",
    } = body;

    // Bind identity to verified session if user is logged in
    const effectiveUserId = session?.user 
      ? ((session.user as any).id || session.user.email || "cadet")
      : (userId || "guest-cadet");
    const effectiveUserEmail = session?.user?.email || userEmail || "cadet@ccna.academy";

    const attempt: ExamAttemptRecord = {
      attemptId: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: effectiveUserId,
      userEmail: effectiveUserEmail,
      examMode,
      examTitle,
      scaledScore: Number(scaledScore) || 300,
      rawScore: Number(rawScore) || 0,
      totalQuestions: Number(totalQuestions) || 60,
      percentage: Number(percentage) || 0,
      passed: Boolean(passed),
      domainScores,
      timeTakenSeconds: Number(timeTakenSeconds) || 0,
      timestamp: new Date().toISOString(),
    };

    await recordExamAttempt(attempt);
    const profileSummary = await getUserProfileSummary(attempt.userId);

    return NextResponse.json({
      success: true,
      attempt,
      profileSummary,
    });
  } catch (error) {
    console.error("Exam attempt submission error:", error);
    return NextResponse.json(
      { error: "Failed to record exam attempt" },
      { status: 500 }
    );
  }
}
