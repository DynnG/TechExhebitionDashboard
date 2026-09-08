import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ matches: [] });
    }

    const trimmed = query.trim().toLowerCase();

    const existingEvents = await db.event.findMany({
      select: {
        id: true,
        eventNumber: true,
        eventName: true,
        dates: true,
        city: true,
        country: true,
      },
    });

    const matches = existingEvents.filter((evt) => {
      const name = evt.eventName.toLowerCase();
      return (
        name.includes(trimmed) ||
        trimmed.includes(name) ||
        name.replace(/[^a-z0-9]/g, "") === trimmed.replace(/[^a-z0-9]/g, "")
      );
    });

    return NextResponse.json({ matches });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Search failed: " + error.message },
      { status: 500 }
    );
  }
}
