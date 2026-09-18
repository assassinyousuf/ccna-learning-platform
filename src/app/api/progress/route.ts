import { NextRequest, NextResponse } from "next/server";
import { getUserProgress } from "@/lib/google-sheets";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "guest-user";
  const progress = await getUserProgress(userId);
  return NextResponse.json({ progress });
}
