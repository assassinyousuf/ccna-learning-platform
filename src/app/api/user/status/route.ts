import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateUser } from "@/lib/google-sheets";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const userRec = await getOrCreateUser({
      userId: (session.user as any).id || session.user.email,
      email: session.user.email,
      name: session.user.name || undefined,
    });

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: userRec.userId,
          email: userRec.email,
          name: userRec.name,
          role: userRec.role,
          status: userRec.status,
          joinedAt: userRec.joinedAt,
          approvedAt: userRec.approvedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[User Status GET Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
