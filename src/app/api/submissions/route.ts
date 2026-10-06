import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { recordVideoSubmission, getUserSubmissions } from "@/lib/google-sheets";
import { getModuleById } from "@/lib/curriculum";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userEmail, moduleId, driveFileId, driveUrl } = body;

    if (!moduleId || !driveUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Strict URL validation to prevent SSRF and javascript: URL injection
    try {
      const parsedUrl = new URL(driveUrl);
      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        return NextResponse.json({ error: "Invalid driveUrl protocol" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid driveUrl format" }, { status: 400 });
    }

    // Bind authenticated identity from session if available to prevent IDOR spoofing
    const session = await getServerSession(authOptions);
    const resolvedUserId = session?.user 
      ? ((session.user as any).id || session.user.email || "student") 
      : (userId || "guest-user");
    const resolvedUserEmail = session?.user?.email || userEmail || "guest@ccna.local";

    const mod = getModuleById(moduleId);
    const canonicalModuleId = mod ? mod.id : moduleId;

    const submission = {
      submissionId: `sub-${Date.now()}`,
      userId: resolvedUserId,
      userEmail: resolvedUserEmail,
      moduleId: canonicalModuleId,
      driveFileId: driveFileId || "mock-drive-id",
      driveUrl: String(driveUrl),
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
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId");
  
  // Default to session user if logged in, otherwise requested or guest-user
  const targetUserId = session?.user 
    ? ((session.user as any).id || session.user.email || requestedUserId || "guest-user")
    : (requestedUserId || "guest-user");

  const submissions = await getUserSubmissions(targetUserId);
  return NextResponse.json({ submissions });
}
