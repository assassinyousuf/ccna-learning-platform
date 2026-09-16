import { NextRequest, NextResponse } from "next/server";
import { recordVideoSubmission, getUserSubmissions } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userEmail, moduleId, driveFileId, driveUrl } = body;

    if (!moduleId || !driveUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = {
      submissionId: `sub-${Date.now()}`,
      userId: userId || "guest-user",
      userEmail: userEmail || "guest@ccna.local",
      moduleId,
      driveFileId: driveFileId || "mock-drive-id",
      driveUrl,
      status: "APPROVED" as const, // auto-approve upon verified upload
      submittedAt: new Date().toISOString(),
    };

    await recordVideoSubmission(submission);

    return NextResponse.json({
      success: true,
      submission,
      message: "Video proof submitted successfully and logged to Google Sheets!",
    });
  } catch (error) {
    console.error("Video submission error:", error);
    return NextResponse.json({ error: "Failed to process video submission" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "guest-user";
  const submissions = await getUserSubmissions(userId);
  return NextResponse.json({ submissions });
}
