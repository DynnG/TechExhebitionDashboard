import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runLiveWebCrawler } from "@/lib/scraper/live-crawler";
import { liveScraperStore } from "@/lib/scraper/store";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id || "user";
    const limitCheck = checkRateLimit(`scraper-run-${userId}`, 10, 60 * 60 * 1000); // 10 per hour
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded: Maximum 10 scraper triggers per hour." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const regions = body.regions || [];
    const businessLines = body.businessLines || [];

    // Execute Live Web Crawling directly in Node.js
    liveScraperStore.status = "running";
    liveScraperStore.started_at = new Date().toISOString();
    const liveResults = await runLiveWebCrawler(regions, businessLines);
    liveScraperStore.results = liveResults;
    liveScraperStore.status = "completed";
    liveScraperStore.events_found = liveResults.length;
    liveScraperStore.completed_at = new Date().toISOString();
    liveScraperStore.lastRunTime = new Date().toISOString();

    return NextResponse.json({
      message: "Live Web Scraper executed successfully",
      status: "completed",
      eventsFound: liveResults.length,
      results: liveResults,
      completed_at: liveScraperStore.completed_at,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to run live scraper: " + error.message },
      { status: 500 }
    );
  }
}
