import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'live_crawled_events.json');

function readLocalCache(): any[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err: any) {
    console.warn('[Cache Proxy] Could not read local cache file:', err.message);
  }
  return [];
}

export async function GET() {
  const engineBase = process.env.CRAWLER_ENGINE_URL || 'http://localhost:5000/api/crawl-events';
  const cacheUrl = `${engineBase.replace(/\/+$/, '')}/cache`;

  try {
    const res = await fetch(cacheUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(500),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Engine may not be running or timed out; fall back immediately to local disk cache file
  }

  const cached = readLocalCache();
  return NextResponse.json({ success: true, count: cached.length, data: cached });
}

export async function DELETE() {
  const engineBase = process.env.CRAWLER_ENGINE_URL || 'http://localhost:5000/api/crawl-events';
  const cacheUrl = `${engineBase.replace(/\/+$/, '')}/cache`;

  // Try notifying engine if running
  try {
    await fetch(cacheUrl, { method: 'DELETE' });
  } catch {
    // Ignore if engine is down
  }

  // Ensure local cache file is removed
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
    return NextResponse.json({ success: true, message: 'Cache cleared successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
