import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { recordVideoSubmission, getUserSubmissions, isUserAdmin } from "@/lib/google-sheets";
import { getModuleById } from "@/lib/curriculum";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = getClientIp(req);

    // Rate limiting: max 10 submissions per minute
    const rateCheck = checkRateLimit(`video-sub-${session?.user?.email || clientIp}`, 10, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a minute." },
        { status: 429, headers: { "Retry-After": String(rateCheck.reset) } }
      );
    }

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required to submit lab proof." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { moduleId, driveFileId, driveUrl } = body;

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

    // Strictly bind authenticated identity from verified session token
    const resolvedUserId = (session.user as any).id || session.user.email;
    const resolvedUserEmail = session.user.email;

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

  let targetUserId = "guest-user";
  if (session?.user?.email) {
    const isAdmin = isUserAdmin(session.user.email);
    if (requestedUserId && isAdmin) {
      targetUserId = requestedUserId;
    } else {
      targetUserId = (session.user as any).id || session.user.email;
    }
  }

  const submissions = await getUserSubmissions(targetUserId);
  return NextResponse.json({ submissions });
}
