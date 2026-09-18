import { NextRequest, NextResponse } from "next/server";
import { createResumableUploadSession } from "@/lib/google-drive";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, mimeType, fileSize } = body;

    if (!fileName) {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 });
    }

    const session = await createResumableUploadSession({
      fileName: fileName || "ccna-lab-submission.mp4",
      mimeType: mimeType || "video/mp4",
      fileSize: fileSize || 0,
    });

    return NextResponse.json({
      success: true,
      uploadUrl: session.uploadUrl,
      fileId: session.fileId || `drive-mock-${Date.now()}`,
    });
  } catch (error) {
    console.error("Failed to init Drive upload session:", error);
    return NextResponse.json(
      { error: "Failed to initialize Drive upload session" },
      { status: 500 }
    );
  }
}
