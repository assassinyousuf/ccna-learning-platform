import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Simulates direct Google Drive upload endpoint in dev mode
  return NextResponse.json({
    status: "UPLOADED",
    id: `file-drive-local-${Date.now()}`,
    webViewLink: "https://drive.google.com/drive/u/0/my-drive",
  });
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
