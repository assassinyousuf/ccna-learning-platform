import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createResumableUploadSession } from "@/lib/google-drive";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_MIME_TYPES = new Set([
  "video/webm",
  "video/mp4",
  "video/quicktime",
  "video/x-matroska",
  "video/ogg",
]);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = getClientIp(req);

    // Rate limiting: max 10 session creations per minute
    const rateCheck = checkRateLimit(`drive-init-${session?.user?.email || clientIp}`, 10, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many upload requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rateCheck.reset) } }
      );
    }

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required to initiate Drive upload session." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fileName, mimeType, fileSize } = body;

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 });
    }

    // Sanitize filename to prevent header injection
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Validate MIME type
    const normalizedMime = (mimeType || "video/webm").toLowerCase().split(";")[0].trim();
    if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
      return NextResponse.json(
        { error: "Invalid video format. Supported: MP4, WebM, QuickTime MOV." },
        { status: 400 }
      );
    }

    // Max file size: 500MB
    const sizeNumber = Number(fileSize) || 0;
    if (sizeNumber > 500 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 500MB maximum upload limit." },
        { status: 400 }
      );
    }

    const driveSession = await createResumableUploadSession({
      fileName: sanitizedFileName,
      mimeType: normalizedMime,
      fileSize: sizeNumber,
    });

    return NextResponse.json({
      success: true,
      uploadUrl: driveSession.uploadUrl,
      fileId: driveSession.fileId || `drive-mock-${Date.now()}`,
    });
  } catch (error) {
    console.error("Failed to init Drive upload session:", error);
    return NextResponse.json(
      { error: "Failed to initialize Drive upload session" },
      { status: 500 }
    );
  }
}
