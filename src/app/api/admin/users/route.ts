import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUserRecord,
  recordUser,
  isUserAdmin,
  UserRole,
  UserStatus,
} from "@/lib/google-sheets";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const isAdmin = userRole === "ADMIN" || isUserAdmin(session.user.email);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator clearance required" },
        { status: 403 }
      );
    }

    const users = await getAllUsers();

    const stats = {
      total: users.length,
      pending: users.filter((u) => u.status === "PENDING").length,
      approved: users.filter((u) => u.status === "APPROVED").length,
      rejected: users.filter((u) => u.status === "REJECTED").length,
      admins: users.filter((u) => u.role === "ADMIN").length,
    };

    return NextResponse.json({ users, stats }, { status: 200 });
  } catch (error) {
    console.error("[Admin Users GET Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const isAdmin = userRole === "ADMIN" || isUserAdmin(session.user.email);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator clearance required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, userId, role, status, email, name } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    if (action === "APPROVE") {
      if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
      }
      const updated = await updateUserStatus(userId, "APPROVED", session.user.email);
      return NextResponse.json({ success: true, user: updated }, { status: 200 });
    }

    if (action === "REJECT") {
      if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
      }
      const updated = await updateUserStatus(userId, "REJECTED", session.user.email);
      return NextResponse.json({ success: true, user: updated }, { status: 200 });
    }

    if (action === "SET_ROLE") {
      if (!userId || !role) {
        return NextResponse.json({ error: "userId and role required" }, { status: 400 });
      }
      const updated = await updateUserRole(userId, role as UserRole);
      return NextResponse.json({ success: true, user: updated }, { status: 200 });
    }

    if (action === "DELETE") {
      if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
      }
      const deleted = await deleteUserRecord(userId);
      return NextResponse.json({ success: deleted }, { status: 200 });
    }

    if (action === "PRE_APPROVE") {
      if (!email) {
        return NextResponse.json({ error: "Email required for pre-approval" }, { status: 400 });
      }
      const normEmail = email.toLowerCase().trim();
      const newRecord = {
        userId: `pre-${Buffer.from(normEmail).toString("hex").slice(0, 8)}`,
        email: normEmail,
        name: name || "Pre-Approved Cadet",
        joinedAt: new Date().toISOString(),
        role: (role as UserRole) || "STUDENT",
        status: "APPROVED" as UserStatus,
        approvedAt: new Date().toISOString(),
        approvedBy: session.user.email,
      };
      await recordUser(newRecord);
      return NextResponse.json({ success: true, user: newRecord }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[Admin Users POST Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
