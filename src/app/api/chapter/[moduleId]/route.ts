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
    const moduleData = getModuleById(moduleId);
    const canonicalId = moduleData ? moduleData.id : moduleId;

    // Check potential chapter file paths (for both local dev and serverless deploy)
    const primaryPath = path.join(process.cwd(), "src", "data", "chapters", `${canonicalId}.json`);
    
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
