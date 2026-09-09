import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { ApifyClient } from 'apify-client';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// Load environment variables from .env and .env.local
dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const apifyToken = process.env.APIFY_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;

if (!apifyToken) {
  console.warn('[Warning] APIFY_TOKEN is not configured in .env or .env.local');
}
if (!geminiApiKey) {
  console.warn('[Warning] GEMINI_API_KEY is not configured in .env or .env.local');
}

const apify = new ApifyClient({ token: apifyToken });
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// ==========================================
// Cache & Local Storage Helpers
// ==========================================
const CACHE_FILE = path.join(process.cwd(), 'data', 'live_crawled_events.json');

// ==========================================
// Deduplication & Similarity Helpers
// ==========================================
const AGGREGATOR_DOMAINS = [
  'eventbrite.com',
  '10times.com',
  'gevme.com',
  'meetup.com',
  'linkedin.com',
  'facebook.com',
  'techinasia.com',
  'google.com',
];

function normalizeDomain(urlStr) {
  if (!urlStr) return '';
  try {
    const url = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    return url.hostname.replace(/^www\./, '').toLowerCase().trim();
  } catch {
    return urlStr.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase().trim();
  }
}

function cleanString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractYear(eventName, dates) {
  const match = `${eventName || ''} ${dates || ''}`.match(/\b(202[5-9]|203[0-9])\b/);
  return match ? match[1] : null;
}

function stringSimilarity(s1, s2) {
  const c1 = cleanString(s1);
  const c2 = cleanString(s2);
  if (!c1 || !c2) return 0;
  if (c1 === c2) return 1.0;
  if (c1.includes(c2) || c2.includes(c1)) {
    return Math.min(c1.length, c2.length) / Math.max(c1.length, c2.length);
  }

  const track = Array(c2.length + 1)
    .fill(null)
    .map(() => Array(c1.length + 1).fill(null));
  for (let i = 0; i <= c1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= c2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= c2.length; j += 1) {
    for (let i = 1; i <= c1.length; i += 1) {
      const indicator = c1[i - 1] === c2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  const dist = track[c2.length][c1.length];
  return 1 - dist / Math.max(c1.length, c2.length);
}

function checkIsDuplicate(candidate, existingEventsList) {
  if (!candidate || !existingEventsList || !existingEventsList.length) {
    return { isDuplicate: false };
  }

  const candName = candidate.event_name || candidate.eventName || '';
  const candCity = cleanString(candidate.city || '');
  const candYear = extractYear(candName, candidate.dates || '');
  const candDomain = normalizeDomain(candidate.official_website || candidate.officialWebsite || '');

  for (const existing of existingEventsList) {
    const exName = existing.event_name || existing.eventName || '';
    const exCity = cleanString(existing.city || '');
    const exYear = extractYear(exName, existing.dates || '');
    const exDomain = normalizeDomain(existing.official_website || existing.officialWebsite || '');

    // Rule 1: Same official website domain (excluding aggregators)
    if (
      candDomain &&
      exDomain &&
      candDomain === exDomain &&
      !AGGREGATOR_DOMAINS.includes(candDomain)
    ) {
      // If years are explicitly different, they are separate editions (2026 vs 2027)
      if (candYear && exYear && candYear !== exYear) {
        continue;
      }
      return {
        isDuplicate: true,
        reason: `Matches official website (${candDomain}) of existing event "${exName}"`,
        matchedEvent: exName,
      };
    }

    // Rule 2: High name similarity
    const similarity = stringSimilarity(candName, exName);
    if (similarity >= 0.82) {
      // Rule 3: Same brand in different city is NOT duplicate (GITEX Dubai != GITEX Singapore)
      if (candCity && exCity && candCity !== exCity && !candCity.includes(exCity) && !exCity.includes(candCity)) {
        continue;
      }

      // Rule 4: Same event in different year is NOT duplicate (2026 vs 2027)
      if (candYear && exYear && candYear !== exYear) {
        continue;
      }

      return {
        isDuplicate: true,
        reason: `Matches name (${Math.round(similarity * 100)}% match) of existing event "${exName}" in ${existing.city || 'same location'}`,
        matchedEvent: exName,
      };
    }
  }

  return { isDuplicate: false };
}

function loadFromCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
}

function saveToCache(items) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const existing = loadFromCache();
    const itemsToAdd = Array.isArray(items) ? items : [items];

    for (const item of itemsToAdd) {
      if (!item || item.is_duplicate) continue;
      const dup = checkIsDuplicate(item, existing);
      if (!dup.isDuplicate) {
        existing.push({
          ...item,
          no: existing.length + 1,
        });
      }
    }

    fs.writeFileSync(CACHE_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    return existing;
  } catch (err) {
    console.warn('[Cache] Could not write cache file:', err.message);
    return [];
  }
}

// ==========================================
// 1. ROUTE-LEVEL RATE LIMITER
// ==========================================
const scrapeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Rate limit exceeded: Maximum 10 crawl runs per 15 minutes per IP.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// 2. THROTTLING & EXPONENTIAL RETRY HELPERS
// ==========================================
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callWithRetry(fn, retries = 2, delay = 1500) {
  try {
    return await fn();
  } catch (error) {
    const isRateLimit =
      error.status === 429 ||
      error.message?.includes('429') ||
      error.message?.includes('RESOURCE_EXHAUSTED');

    if (retries > 0 && isRateLimit) {
      console.warn(`[429 Quota] Retrying in ${delay}ms... (${retries} attempts left)`);
      await sleep(delay);
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Fallback HTML text extractor if Apify website-content-crawler fails or times out
async function fetchPageDirect(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);
    if (!resp.ok) return null;
    const html = await resp.text();
    const $ = cheerio.load(html);
    $('script, style, noscript, nav, footer, svg').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.slice(0, 10000);
  } catch {
    return null;
  }
}

// ==========================================
// 3. SCHEMA & AUDIT PROMPT
// ==========================================
const PROMPT_SYSTEM = `
You are a strategic intelligence data auditor for Lifewood PH.
Audit and extract event information strictly against these parameters:

1. Target Date Range: Start date MUST be between Sep 1, 2026 and Dec 31, 2027.
2. Lifewood Core Business Lines (Must match at least one):
   - 1. Global Scanning + Indexing (digitization, archives, OCR/HTR, libraries)
   - 2. Global AI Data (training data, annotation, labeling, RLHF, datasets, LLM)
   - 3. AIGC (generative AI, AI creative, marketing AI)
   - 4. Autonomous Driving (ADAS, AV, LiDAR, sensor fusion)
   - 5. AEO/GEO (answer engine optimization, AI search, LLM SEO)
   - 6. EDGE Intelligence (embedded vision, edge AI, IoT)
3. Fit Score Rubric (1 to 5):
   - 5: Audience directly purchases data annotation, training datasets, or scanning.
   - 4: Strong enterprise AI & data buyer representation.
   - 3: Moderate visibility, broad developer/technology expo.
   - 1-2: Low fit or irrelevant industrial expo (mark is_in_scope: false).
4. Non-negotiable Honesty Rule:
   If any commercial, deadline, or contact field is missing or not publicly listed, output exactly "Not publicly disclosed". NEVER estimate or guess.
   IMPORTANT EXCEPTION: "official_website" MUST be an actual HTTP or HTTPS URL to the event or its canonical domain, NEVER "Not publicly disclosed". If no specific homepage URL is found, use the source page URL.
5. Location: "city" must be a clean city name (e.g. "Singapore", "San Francisco"). Never output ZIP codes.

Return a JSON object conforming exactly to this schema:
{
  "is_in_scope": boolean,
  "fit_score": number,
  "data": {
    "region": "North America | Asia | Europe | Middle East | South America | Africa | Oceania",
    "country": "Full country name",
    "city": "City name",
    "event_name": "Official name + Year",
    "dates": "Mmm DD-DD, YYYY or QX 2027 (dates TBA)",
    "venue": "Venue name or Not publicly disclosed",
    "location_address": "Street address or Not publicly disclosed",
    "official_website": "Direct event website URL (must start with https:// or http://)",
    "organizer": "Organizer name",
    "event_category": "Short descriptor",
    "business_lines": "e.g. 2. Global AI Data, 3. AIGC",
    "strategic_focus": "1-2 sentences on event purpose",
    "relevance_lifewood": "1-2 sentences identifying specific buyer and service",
    "target_audience": "Audience roles and seniority",
    "estimated_attendees": "String or Not publicly disclosed",
    "exhibitor_sponsor_opportunity": "String or Not publicly disclosed",
    "booth_sponsorship_cost": "String or Not publicly disclosed",
    "registration_deadline": "String or Not publicly disclosed",
    "contact_email": "String or Not publicly disclosed",
    "contact_person": "String or Not publicly disclosed",
    "linkedin_social_media": "String or Not publicly disclosed",
    "participation_recommendation": "Exhibit/sponsor | Attend / selective sponsor | Speak/apply for CFP | Monitor only",
    "priority_level": "High | Medium | Low",
    "key_notes": "Edition details or past edition anchor dates",
    "source_links": "Source URL"
  }
}
`;

// ==========================================
// Health & Diagnostic Endpoint
// ==========================================
app.get('/api/health', (req, res) => {
  const cached = loadFromCache();
  res.json({
    status: 'ok',
    service: 'Optimized Tech Exhibition Discovery & Crawling Engine',
    hasApifyToken: Boolean(process.env.APIFY_TOKEN),
    hasGeminiKey: Boolean(geminiApiKey),
    cachedEventsCount: cached.length,
    targetDateRange: 'Sep 1, 2026 - Dec 31, 2027',
  });
});

// Endpoint to fetch previously cached scraped events
app.get('/api/crawl-events/cache', (req, res) => {
  const cached = loadFromCache();
  res.json({ success: true, count: cached.length, data: cached });
});

// Endpoint to clear crawler cache
app.delete('/api/crawl-events/cache', (req, res) => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
    res.json({ success: true, message: 'Cache cleared successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. API PIPELINE ROUTE (WITH REAL-TIME STREAMING & PARALLEL BATCHING)
// ==========================================
app.post('/api/crawl-events', scrapeLimiter, async (req, res) => {
  const { query } = req.body;
  const searchQuery = query || 'tech exhibition 2027 Singapore OR "Hong Kong" OR "United States"';

  const isStream =
    req.query.stream === 'true' ||
    req.headers.accept?.includes('text/event-stream');

  // SSE helper function
  const sendSSE = (payload) => {
    if (isStream && !res.writableEnded) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      if (typeof res.flush === 'function') res.flush();
    }
  };

  if (isStream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') res.flushHeaders();
  }

  if (!process.env.APIFY_TOKEN) {
    const errorMsg = 'APIFY_TOKEN is missing. Please set APIFY_TOKEN in your environment or .env file.';
    if (isStream) {
      sendSSE({ type: 'error', error: errorMsg });
      return res.end();
    }
    return res.status(400).json({ success: false, error: errorMsg });
  }

  if (!geminiApiKey) {
    const errorMsg = 'GEMINI_API_KEY is missing. Please set GEMINI_API_KEY in your environment or .env file.';
    if (isStream) {
      sendSSE({ type: 'error', error: errorMsg });
      return res.end();
    }
    return res.status(400).json({ success: false, error: errorMsg });
  }

  const eventsList = [];
  const candidateModels = [
    process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-2.0-flash',
  ].filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);

  try {
    // ----------------------------------------------------
    // STEP 1: Fast Google Discovery Search (Apify)
    // ----------------------------------------------------
    console.log(`[Step 1] Running Discovery Search: "${searchQuery}"`);
    sendSSE({
      type: 'status',
      step: 1,
      message: `Searching Google for: "${searchQuery}"...`,
    });

    const searchRun = await callWithRetry(() =>
      apify.actor('apify/google-search-scraper').call({
        queries: searchQuery,
        maxPagesPerQuery: 1,
        resultsPerPage: 5,
      })
    );

    const existingDbEvents = req.body.existingEvents || [];
    const cachedEvents = loadFromCache();
    const allKnownEvents = [...existingDbEvents, ...cachedEvents];

    const { items: searchResults } = await apify.dataset(searchRun.defaultDatasetId).listItems();
    const candidateUrls = [];
    searchResults.forEach((item) => {
      if (item.organicResults) {
        item.organicResults.forEach((r) => {
          if (r.url && !r.url.includes('google.com') && !candidateUrls.includes(r.url)) {
            candidateUrls.push(r.url);
          }
        });
      }
    });

    // Prioritize fresh candidate URLs over already indexed domains
    const knownDomains = new Set(
      allKnownEvents
        .map((e) => normalizeDomain(e.official_website || e.officialWebsite))
        .filter(Boolean)
    );

    const targetUrls = [];
    for (const url of candidateUrls) {
      if (targetUrls.length >= 5) break;
      const domain = normalizeDomain(url);
      if (!AGGREGATOR_DOMAINS.includes(domain) && knownDomains.has(domain)) {
        console.log(`[Deduplication] Prioritizing unvisited domain over known: ${domain}`);
        continue;
      }
      targetUrls.push(url);
    }
    if (targetUrls.length === 0) {
      targetUrls.push(...candidateUrls.slice(0, 5));
    }
    console.log(`Discovered ${targetUrls.length} candidate URLs:`, targetUrls);
    sendSSE({
      type: 'candidates',
      urls: targetUrls,
      message: `Discovered ${targetUrls.length} candidate event websites. Extracting content...`,
    });

    // ----------------------------------------------------
    // STEP 2: Fast Parallel Page Extraction (Cheerio mode)
    // ----------------------------------------------------
    sendSSE({
      type: 'status',
      step: 2,
      message: `Crawling ${targetUrls.length} websites in parallel using high-speed Cheerio parser...`,
    });

    const pageDataMap = new Map();

    try {
      // Run Apify website-content-crawler in BATCH with fast Cheerio crawler (seconds instead of minutes)
      const crawlRun = await callWithRetry(() =>
        apify.actor('apify/website-content-crawler').call({
          startUrls: targetUrls.map((url) => ({ url })),
          crawlerType: 'cheerio',
          maxCrawlPages: targetUrls.length,
          maxCrawlingDurationSecs: 35,
        })
      );

      const { items: crawledPages } = await apify.dataset(crawlRun.defaultDatasetId).listItems();
      for (const p of crawledPages) {
        if (p.url && p.text) {
          pageDataMap.set(p.url, p.text.slice(0, 10000));
        }
      }
    } catch (crawlErr) {
      console.warn('[Crawl Warning] Batch crawler issue, using direct fallback:', crawlErr.message);
    }

    // Direct fetch fallback for any missing URLs to ensure zero data loss
    for (const url of targetUrls) {
      if (!pageDataMap.has(url)) {
        console.log(`[Direct Fetch] Extracting ${url}...`);
        const fallbackText = await fetchPageDirect(url);
        if (fallbackText) {
          pageDataMap.set(url, fallbackText);
        }
      }
    }

    // ----------------------------------------------------
    // STEP 3: Gemini AI Auditing, Deduplication & Immediate Streaming
    // ----------------------------------------------------
    sendSSE({
      type: 'status',
      step: 3,
      message: 'Applying Lifewood 27-column audit & Fit Scoring with Gemini AI...',
    });

    let index = 0;
    for (const targetUrl of targetUrls) {
      index++;
      const rawText = pageDataMap.get(targetUrl);
      if (!rawText) continue;

      try {
        console.log(`[Step 3] AI Auditing ${index}/${targetUrls.length}: ${targetUrl}`);
        sendSSE({
          type: 'auditing',
          url: targetUrl,
          message: `AI auditing ${index}/${targetUrls.length}: ${new URL(targetUrl).hostname}...`,
        });

        const response = await callWithRetry(async () => {
          let lastErr = null;
          for (const modelName of candidateModels) {
            try {
              return await ai.models.generateContent({
                model: modelName,
                contents: `Source URL: ${targetUrl}\n\nPage Text:\n${rawText}`,
                config: {
                  systemInstruction: PROMPT_SYSTEM,
                  responseMimeType: 'application/json',
                  temperature: 0.1,
                },
              });
            } catch (modelErr) {
              lastErr = modelErr;
              console.warn(
                `[Gemini Fallback] Model "${modelName}" failed (${modelErr.message?.slice(0, 100)}...). Trying fallback model...`
              );
            }
          }
          throw lastErr;
        });

        const parsed = JSON.parse(response.text);

        // Quality Gate: Within date scope and Fit Score >= 3
        if (parsed.is_in_scope && parsed.fit_score >= 3 && parsed.data) {
          // Check for duplicate against database records, local cache, and current batch
          const dupCheck = checkIsDuplicate(parsed.data, [...allKnownEvents, ...eventsList]);

          // Clean and resolve official_website: never allow "Not publicly disclosed" as a link
          const rawWebsite = (parsed.data.official_website || '').trim();
          const isInvalidWebsite =
            !rawWebsite ||
            rawWebsite.toLowerCase().includes('not publicly') ||
            rawWebsite.toLowerCase().includes('tba') ||
            rawWebsite.toLowerCase().includes('unknown') ||
            rawWebsite.toLowerCase().includes('n/a') ||
            rawWebsite === 'https://' ||
            rawWebsite === 'http://';

          let resolvedWebsite = targetUrl;
          if (!isInvalidWebsite) {
            resolvedWebsite =
              rawWebsite.startsWith('http://') || rawWebsite.startsWith('https://')
                ? rawWebsite
                : `https://${rawWebsite.replace(/^\/+/, '')}`;
          }

          const newEvent = {
            no: eventsList.length + 1,
            ...parsed.data,
            fit_score: parsed.fit_score,
            official_website: resolvedWebsite,
            source_links: targetUrl,
            is_duplicate: dupCheck.isDuplicate,
            duplicate_reason: dupCheck.reason || null,
            duplicate_of: dupCheck.matchedEvent || null,
          };

          eventsList.push(newEvent);

          if (!dupCheck.isDuplicate) {
            // 🌟 Save to disk cache IMMEDIATELY so it accumulates
            saveToCache(newEvent);

            // 🌟 Stream directly to frontend screen IMMEDIATELY!
            sendSSE({
              type: 'event',
              data: newEvent,
              isDuplicate: false,
              message: `✓ Added: ${newEvent.event_name} (Fit ${newEvent.fit_score}/5)`,
            });
          } else {
            console.log(`[Deduplication] Duplicate recognized: ${newEvent.event_name} -> ${dupCheck.reason}`);
            sendSSE({
              type: 'event',
              data: newEvent,
              isDuplicate: true,
              message: `⚠️ Duplicate detected: ${newEvent.event_name} (${dupCheck.reason})`,
            });
          }
        }

        // Brief safety pause for Gemini RPM
        await sleep(1000);
      } catch (itemErr) {
        console.error(`Error processing ${targetUrl}:`, itemErr.message);
      }
    }

    const uniqueCount = eventsList.filter((e) => !e.is_duplicate).length;
    const dupCount = eventsList.filter((e) => e.is_duplicate).length;
    console.log(`Pipeline complete! Verified ${uniqueCount} unique events (${dupCount} duplicates recognized).`);

    if (isStream) {
      sendSSE({
        type: 'done',
        count: eventsList.length,
        uniqueCount,
        dupCount,
        data: eventsList,
        message: `Pipeline complete! Verified ${uniqueCount} unique events (${dupCount} duplicate(s) recognized & flagged).`,
      });
      return res.end();
    }

    return res.json({
      success: true,
      count: eventsList.length,
      uniqueCount,
      dupCount,
      data: eventsList,
    });
  } catch (err) {
    console.error('Fatal Pipeline Error:', err);
    if (isStream) {
      sendSSE({ type: 'error', error: err.message });
      return res.end();
    }
    return res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Optimized Pipeline backend running on http://localhost:${PORT}`);
});

