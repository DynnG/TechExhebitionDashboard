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
    const userRole = (session?.user as any)?.role || "USER";

    if (!session || userRole === "USER") {
      return NextResponse.json(
        { error: "Forbidden: Admin or Superadmin role required." },
        { status: 403 }
      );
    }

    const id = parseInt(params.id);
    const { action } = await req.json(); // "APPROVE" or "REJECT"

    const queueItem = await db.queueItem.findUnique({ where: { id } });
    if (!queueItem) {
      return NextResponse.json({ error: "Queue item not found" }, { status: 404 });
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    const updatedQueueItem = await db.queueItem.update({
      where: { id },
      data: {
        status: newStatus,
        resolvedAt: new Date(),
      },
    });

    if (action === "APPROVE") {
      await db.event.update({
        where: { id: queueItem.eventId },
        data: { status: "PUBLISHED" },
      });
    }

    return NextResponse.json({ queueItem: updatedQueueItem });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update queue item: " + error.message },
      { status: 500 }
    );
  }
}
