import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'live_crawled_events.json');

export async function DELETE(req: Request) {
  try {
    const { eventName } = await req.json();
    if (!eventName) {
      return NextResponse.json({ success: false, error: 'eventName is required' }, { status: 400 });
    }

    const engineBase = process.env.CRAWLER_ENGINE_URL || 'http://localhost:5000/api/crawl-events';
    const itemUrl = `${engineBase.replace(/\/+$/, '')}/cache/item`;

    // Try notifying engine if running
    try {
      await fetch(itemUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName }),
      });
    } catch {
      // Ignore if engine is down
    }

    // Always update local disk cache file
    if (fs.existsSync(CACHE_FILE)) {
      try {
        const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter(
            (e: any) => (e.event_name || '').trim().toLowerCase() !== eventName.trim().toLowerCase()
          );
          fs.writeFileSync(CACHE_FILE, JSON.stringify(updated, null, 2), 'utf-8');
          return NextResponse.json({ success: true, count: updated.length, data: updated });
        }
      } catch (err: any) {
        console.warn('[Cache Item Proxy] Failed updating cache file:', err.message);
      }
    }

    return NextResponse.json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
