import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runLiveWebCrawler } from "@/lib/scraper/live-crawler";
import { liveScraperStore } from "@/lib/scraper/store";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const regions = body.regions || [];
    const businessLines = body.businessLines || [];

    // Execute Live Web Crawling directly in Node.js
    const liveResults = await runLiveWebCrawler(regions, businessLines);
    liveScraperStore.results = liveResults;

    return NextResponse.json({
      message: "Live Web Scraper executed successfully",
      status: "completed",
      eventsFound: liveResults.length,
      results: liveResults,
      completed_at: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to run live scraper: " + error.message },
      { status: 500 }
    );
  }
}
