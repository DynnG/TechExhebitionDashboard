import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin permissions required." }, { status: 403 });
    }

    const userId = parseInt(params.id, 10);
    const body = await req.json();
    const { name, role } = body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name } : {}),
        ...(role ? { role } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update user: " + error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin permissions required." }, { status: 403 });
    }

    const userId = parseInt(params.id, 10);
    const currentUserId = parseInt((session?.user as any)?.id || "0", 10);

    if (userId === currentUserId) {
      return NextResponse.json({ error: "Cannot delete your own admin account." }, { status: 400 });
    }

    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete user: " + error.message }, { status: 500 });
  }
}
