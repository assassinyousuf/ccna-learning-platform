import { NextRequest, NextResponse } from "next/server";
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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "guest-user";

    const [progress, summary, quizAttempts, examAttempts, videoSubmissions] =
      await Promise.all([
        getUserProgress(userId),
        getUserProfileSummary(userId),
        getUserQuizAttempts(userId),
        getUserExamAttempts(userId),
        getUserSubmissions(userId),
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
    const body = await req.json();
    const {
      userId = "guest-user",
      moduleId,
      status = "COMPLETED", // "COMPLETED" | "READ" | "IN_PROGRESS" | "UNMARKED"
    } = body;

    if (!moduleId) {
      return NextResponse.json({ error: "Missing moduleId" }, { status: 400 });
    }

    const updatedProgress = await recordChapterProgress(userId, moduleId, status);
    const summary = await getUserProfileSummary(userId);

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

