import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const queueItems = await db.queueItem.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        event: true,
        submittedBy: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ queueItems });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch queues: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newQueueItem = await db.queueItem.create({
      data: {
        type: body.type || "FOR_REVIEW",
        eventId: parseInt(body.eventId),
        submittedById: parseInt((session.user as any).id),
        reason: body.reason,
        status: "PENDING",
      },
    });

    return NextResponse.json({ queueItem: newQueueItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to submit to queue: " + error.message },
      { status: 500 }
    );
  }
}
