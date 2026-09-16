import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const filePath = path.join(process.cwd(), "src", "data", "chapters", `${moduleId}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API Chapter Error:", err);
    return NextResponse.json({ error: "Failed to load chapter content" }, { status: 500 });
  }
}
