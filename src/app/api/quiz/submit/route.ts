import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getModuleById } from "@/lib/curriculum";
import { recordQuizAttempt } from "@/lib/google-sheets";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = getClientIp(req);

    // Rate limiting: max 20 quiz submissions per minute per user/IP
    const rateCheck = checkRateLimit(`quiz-submit-${session?.user?.email || clientIp}`, 20, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Submission rate limit exceeded. Please wait a minute." },
        { status: 429, headers: { "Retry-After": String(rateCheck.reset) } }
      );
    }

    const body = await req.json();
    const { moduleId, answers = {} } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json({ error: "Missing or invalid moduleId" }, { status: 400 });
    }

    const moduleData = getModuleById(moduleId);
    if (!moduleData) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const quiz = moduleData.quiz;
    let score = 0;
    const results = quiz.map((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const total = quiz.length || 1;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 80; // 80% passing grade

    // Only record to persistent gradebook if user has an authenticated session
    let recordedToGradebook = false;
    if (session?.user?.email) {
      const effectiveUserId = (session.user as any).id || session.user.email;
      const effectiveUserEmail = session.user.email;

      const attemptRecord = {
        attemptId: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: effectiveUserId,
        userEmail: effectiveUserEmail,
        moduleId: moduleData.id,
        moduleTitle: moduleData.title || moduleData.rawTitle,
        score,
        total,
        percentage,
        passed,
        timestamp: new Date().toISOString(),
      };

      await recordQuizAttempt(attemptRecord);
      recordedToGradebook = true;
    }

    return NextResponse.json({
      success: true,
      score,
      total,
      percentage,
      passed,
      results,
      recordedToGradebook,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json({ error: "Failed to process quiz submission" }, { status: 500 });
  }
}
