import { NextRequest, NextResponse } from "next/server";
import { recordExamAttempt, getUserProfileSummary, ExamAttemptRecord } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  try {
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

    const attempt: ExamAttemptRecord = {
      attemptId: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: userId || "guest-cadet",
      userEmail: userEmail || "cadet@ccna.academy",
      examMode,
      examTitle,
      scaledScore,
      rawScore,
      totalQuestions,
      percentage,
      passed,
      domainScores,
      timeTakenSeconds,
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
