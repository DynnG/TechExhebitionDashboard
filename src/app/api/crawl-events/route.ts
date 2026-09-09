import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward to the pipeline engine running on port 5000
    const engineUrl = process.env.CRAWLER_ENGINE_URL || 'http://localhost:5000/api/crawl-events';

    const res = await fetch(engineUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

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
