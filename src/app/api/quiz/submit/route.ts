import { NextRequest, NextResponse } from "next/server";
import { getModuleById } from "@/lib/curriculum";
import { recordQuizAttempt } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { moduleId, answers, userId, userEmail } = body;

    const moduleData = getModuleById(moduleId);
    if (!moduleData) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const quiz = moduleData.quiz;
    let score = 0;
    const results = quiz.map((q, idx) => {
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

    const total = quiz.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 80; // 80% passing grade

    const attemptRecord = {
      attemptId: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: userId || "guest-user",
      userEmail: userEmail || "guest@ccna.local",
      moduleId,
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
