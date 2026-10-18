import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getModuleById } from "@/lib/curriculum";
import { recordQuizAttempt } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { moduleId, answers = {}, userId, userEmail } = body;

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

    // Bind identity to authenticated session if logged in
    const effectiveUserId = session?.user 
      ? ((session.user as any).id || session.user.email || "student")
      : (userId || "guest-user");
    const effectiveUserEmail = session?.user?.email || userEmail || "guest@ccna.local";

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

    // Log to Google Sheets
    await recordQuizAttempt(attemptRecord);

    return NextResponse.json({
      success: true,
      score,
      total,
      percentage,
      passed,
      results,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json({ error: "Failed to process quiz submission" }, { status: 500 });
  }
}
