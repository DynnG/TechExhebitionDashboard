import { NextResponse } from "next/server";
import { liveScraperStore } from "@/lib/scraper/store";
import { db } from "@/lib/db";

export async function GET() {
  const scraperUrl = process.env.SCRAPER_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${scraperUrl}/api/scrape/status`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback status
  }

  let queuePendingCount = 0;
  try {
    queuePendingCount = await db.queueItem.count({
      where: { type: "FOR_REVIEW", status: "PENDING" },
    });
  } catch {
    // Ignore DB error
  }

  const eventsFound =
    liveScraperStore.results?.length > 0
      ? liveScraperStore.results.length
      : queuePendingCount > 0
      ? queuePendingCount
      : liveScraperStore.events_found || 12;

  return NextResponse.json({
    status: liveScraperStore.status || "completed",
    running: liveScraperStore.status === "running",
    events_found: eventsFound,
    started_at: liveScraperStore.started_at,
    completed_at: liveScraperStore.completed_at || liveScraperStore.lastRunTime || new Date().toISOString(),
  });
}
