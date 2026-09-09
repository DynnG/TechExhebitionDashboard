import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { ApifyClient } from 'apify-client';
import { GoogleGenAI } from '@google/genai';

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
// 1. ROUTE-LEVEL RATE LIMITER
// ==========================================
const scrapeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Rate limit exceeded: Maximum 5 crawl runs per 15 minutes per IP.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// 2. THROTTLING & EXPONENTIAL RETRY HELPERS
// ==========================================
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callWithRetry(fn, retries = 3, delay = 2000) {
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
    "official_website": "Direct event URL",
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
  res.json({
    status: 'ok',
    service: 'Tech Exhibition Discovery & Crawling Engine',
    hasApifyToken: Boolean(process.env.APIFY_TOKEN),
    hasGeminiKey: Boolean(geminiApiKey),
    targetDateRange: 'Sep 1, 2026 - Dec 31, 2027',
  });
});

// ==========================================
// 4. API PIPELINE ROUTE
// ==========================================
app.post('/api/crawl-events', scrapeLimiter, async (req, res) => {
  const { query } = req.body;
  const searchQuery = query || 'tech exhibition 2027 Singapore OR "Hong Kong" OR "United States"';

  if (!process.env.APIFY_TOKEN) {
    return res.status(400).json({
      success: false,
      error: 'APIFY_TOKEN is missing. Please set APIFY_TOKEN in your environment or .env file.',
    });
  }

  if (!geminiApiKey) {
    return res.status(400).json({
      success: false,
      error: 'GEMINI_API_KEY is missing. Please set GEMINI_API_KEY in your environment or .env file.',
    });
  }

  try {
    console.log(`[Step 1] Running Discovery Search: "${searchQuery}"`);
    const searchRun = await callWithRetry(() =>
      apify.actor('apify/google-search-scraper').call({
        queries: searchQuery,
        maxPagesPerQuery: 1,
        resultsPerPage: 5,
      })
    );

    const { items: searchResults } = await apify.dataset(searchRun.defaultDatasetId).listItems();
    const candidateUrls = [];
    searchResults.forEach((item) => {
      if (item.organicResults) {
        item.organicResults.forEach((res) => {
          if (res.url && !res.url.includes('google.com')) {
            candidateUrls.push(res.url);
          }
        });
      }
    });

    console.log(`Discovered ${candidateUrls.length} pages. Executing sequential scrape...`);
    const eventsList = [];
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    for (const targetUrl of candidateUrls) {
      try {
        console.log(`[Step 2] Crawling page: ${targetUrl}`);
        const crawlRun = await callWithRetry(() =>
          apify.actor('apify/website-content-crawler').call({
            startUrls: [{ url: targetUrl }],
            maxCrawlPages: 1,
          })
        );
        const { items: pageData } = await apify.dataset(crawlRun.defaultDatasetId).listItems();
        if (!pageData.length || !pageData[0].text) continue;

        const rawText = pageData[0].text.slice(0, 10000);

        // Enforce safe RPM spacing for Gemini API
        await sleep(1500);

        console.log(`[Step 3] Parsing and scoring with Gemini (${geminiModel}): ${targetUrl}`);
        const response = await callWithRetry(async () => {
          try {
            return await ai.models.generateContent({
              model: geminiModel,
              contents: `Source URL: ${targetUrl}\n\nPage Text:\n${rawText}`,
              config: {
                systemInstruction: PROMPT_SYSTEM,
                responseMimeType: 'application/json',
                temperature: 0.1,
              },
            });
          } catch (modelErr) {
            if (geminiModel !== 'gemini-2.0-flash' && modelErr.message?.includes('not found')) {
              console.warn(`[Model Fallback] Falling back from ${geminiModel} to gemini-2.0-flash`);
              return await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `Source URL: ${targetUrl}\n\nPage Text:\n${rawText}`,
                config: {
                  systemInstruction: PROMPT_SYSTEM,
                  responseMimeType: 'application/json',
                  temperature: 0.1,
                },
              });
            }
            throw modelErr;
          }
        });

        const parsed = JSON.parse(response.text);

        // Quality Gate: Within date scope and Fit Score >= 3
        if (parsed.is_in_scope && parsed.fit_score >= 3 && parsed.data) {
          eventsList.push({
            no: eventsList.length + 1,
            ...parsed.data,
            fit_score: parsed.fit_score,
            official_website: parsed.data.official_website || targetUrl,
            source_links: targetUrl,
          });
        }

        // Delay between page crawls to respect remote servers
        await sleep(2000);
      } catch (err) {
        console.error(`Failed to process ${targetUrl}:`, err.message);
      }
    }

    res.json({
      success: true,
      count: eventsList.length,
      data: eventsList,
    });
  } catch (err) {
    console.error('Fatal Pipeline Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Pipeline backend running on http://localhost:${PORT}`));
