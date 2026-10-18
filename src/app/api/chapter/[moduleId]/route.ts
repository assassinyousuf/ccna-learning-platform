import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getModuleById } from "@/lib/curriculum";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    
    // Strict input validation to prevent path traversal
    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json({ error: "Invalid module ID" }, { status: 400 });
    }

    // Strip any directory traversal characters or slashes
    const sanitizedId = path.basename(moduleId).replace(/[^a-zA-Z0-9_-]/g, "");
    if (!sanitizedId) {
      return NextResponse.json({ error: "Invalid module identifier" }, { status: 400 });
    }

    const moduleData = getModuleById(sanitizedId);
    const canonicalId = moduleData ? moduleData.id : sanitizedId;

    // Verify resolved path stays strictly inside src/data/chapters
    const chaptersDir = path.resolve(process.cwd(), "src", "data", "chapters");
    const primaryPath = path.resolve(chaptersDir, `${canonicalId}.json`);

    if (!primaryPath.startsWith(chaptersDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    
    if (fs.existsSync(primaryPath)) {
      const fileContent = fs.readFileSync(primaryPath, "utf-8");
      const data = JSON.parse(fileContent);
      return NextResponse.json(data);
    }

    // If full textbook JSON file does not exist, return moduleData if available
    if (moduleData) {
      return NextResponse.json({
        ...moduleData,
        fullText: moduleData.content || `## ${moduleData.title}\n\n${moduleData.description}`,
      });
    }

    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  } catch (err: any) {
    console.error("API Chapter Error:", err);
    return NextResponse.json({ error: "Failed to load chapter content" }, { status: 500 });
  }
}
