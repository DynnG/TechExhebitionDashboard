import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isStream = req.headers.get('accept')?.includes('text/event-stream');

    // Query existing events to pass to the crawler engine for instant deduplication
    let existingEvents: Array<{ id: number; eventName: string; city: string; dates: string; officialWebsite: string }> = [];
    try {
      existingEvents = await db.event.findMany({
        select: {
          id: true,
          eventName: true,
          city: true,
          dates: true,
          officialWebsite: true,
        },
      });
    } catch (dbErr: any) {
      console.warn('[Crawl Proxy] Could not fetch DB events for deduplication:', dbErr.message);
    }

    // Forward to the pipeline engine running on port 5000
    const engineBase = process.env.CRAWLER_ENGINE_URL || 'http://localhost:5000/api/crawl-events';
    const engineUrl = isStream ? `${engineBase}?stream=true` : engineBase;

    const res = await fetch(engineUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isStream ? { Accept: 'text/event-stream' } : {}),
      },
      body: JSON.stringify({
        ...body,
        existingEvents,
      }),
    });

    if (isStream && res.body) {
      return new Response(res.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to reach Crawling Engine at http://localhost:5000. Ensure "node server.js" is running. (' +
          error.message +
          ')',
      },
      { status: 502 }
    );
  }
}

