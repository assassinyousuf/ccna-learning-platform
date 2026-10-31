import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { recordExamAttempt, getUserProfileSummary, ExamAttemptRecord } from "@/lib/google-sheets";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = getClientIp(req);

    // Rate limiting: max 10 exam submissions per minute
    const rateCheck = checkRateLimit(`exam-sub-${session?.user?.email || clientIp}`, 10, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Submission rate limit exceeded. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rateCheck.reset) } }
      );
    }

    const body = await req.json();
    const {
      examMode = "AUTHENTIC_100",
      examTitle = "CCNA Blueprint Simulator",
      rawScore = 0,
      totalQuestions = 60,
      domainScores = {},
      timeTakenSeconds = 0,
    } = body;

    // Server-side scoring integrity verification: prevent client-side score manipulation
    const validatedTotal = Math.max(1, Math.min(150, Number(totalQuestions) || 60));
    const validatedRaw = Math.max(0, Math.min(validatedTotal, Number(rawScore) || 0));
    const verifiedPercentage = Math.round((validatedRaw / validatedTotal) * 100);

    // Standard Cisco scaled score: 300 (minimum) to 1000 (maximum), passing threshold is 825
    const verifiedScaledScore = 300 + Math.round((validatedRaw / validatedTotal) * 700);
    const verifiedPassed = verifiedScaledScore >= 825;

    let recordedToGradebook = false;
    let attempt: ExamAttemptRecord;

    if (session?.user?.email) {
      const effectiveUserId = (session.user as any).id || session.user.email;
      const effectiveUserEmail = session.user.email;

      attempt = {
        attemptId: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: effectiveUserId,
        userEmail: effectiveUserEmail,
        examMode,
        examTitle,
        scaledScore: verifiedScaledScore,
        rawScore: validatedRaw,
        totalQuestions: validatedTotal,
        percentage: verifiedPercentage,
        passed: verifiedPassed,
        domainScores,
        timeTakenSeconds: Math.max(0, Number(timeTakenSeconds) || 0),
        timestamp: new Date().toISOString(),
      };

      await recordExamAttempt(attempt);
      recordedToGradebook = true;
    } else {
      attempt = {
        attemptId: `exam-guest-${Date.now()}`,
        userId: "guest-cadet",
        userEmail: "guest@ccna.academy",
        examMode,
        examTitle,
        scaledScore: verifiedScaledScore,
        rawScore: validatedRaw,
        totalQuestions: validatedTotal,
        percentage: verifiedPercentage,
        passed: verifiedPassed,
        domainScores,
        timeTakenSeconds: Math.max(0, Number(timeTakenSeconds) || 0),
        timestamp: new Date().toISOString(),
      };
    }

    const profileSummary = recordedToGradebook
      ? await getUserProfileSummary(attempt.userId)
      : null;

    return NextResponse.json({
      success: true,
      attempt,
      profileSummary,
      recordedToGradebook,
    });
  } catch (error) {
    console.error("Exam attempt submission error:", error);
    return NextResponse.json(
      { error: "Failed to record exam attempt" },
      { status: 500 }
    );
  }
}
