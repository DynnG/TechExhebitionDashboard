# Tech Exhibition Discovery & Crawling Engine (Apify + @google/genai)

This service implements an automated discovery, crawling, and schema validation pipeline for the ****Lifewood Batch 11 Tech Exhibition Dashboard****.

---

## 1. Architecture Overview

[ Frontend Trigger ]

│ (POST /api/crawl-events)

▼

[ Express Rate Limiter ]  ──> Blocks IP spam (> 5 req / 15 min)

│

▼

[ Apify: google-search-scraper ]  ──> Finds organic event URLs

│

▼

[ Apify: website-content-crawler ] ──> Fetches & renders deep page text

│

▼

[ Gemini: gemini-2.5-flash ] ──> Evaluates Fit Score, applies 27-field schema

│

▼

[ Output Response ] ──> Clean JSON ready for manual dashboard entry



---

## 2. Hard Requirements & Scope Rules

1. ****Date Boundary****: Events must start between ****September 1, 2026, and December 31, 2027****.

2. ****Relevance Filter****: Event must match $\ge 1$ of Lifewood's core business lines:

   - `1. Global Scanning + Indexing`

   - `2. Global AI Data`

   - `3. AIGC`

   - `4. Autonomous Driving`

   - `5. AEO/GEO`

   - `6. EDGE Intelligence`

3. ****Quality Floor****: Only events with ****Fit Score $\ge 3$**** are accepted.

4. ****Honesty Rule****: Never guess missing information. Unknown fields must strictly be `"Not publicly disclosed"`.

5. ****No ZIP Codes****: The `city` column must contain a clean city name.

---

## 3. Installation & Configuration

### Prerequisites

\* Node.js v18+ installed.

\* An Apify API token.

\* A Google Gemini API key.

### Install Dependencies

```bash

npm init -y

npm install express cors dotenv express-rate-limit apify-client @google/genai

Environment Variables (`.env`)

```env
PORT=5000

APIFY_TOKEN=apify_api_xxxxxxxxxxxxxxxxxxxx

GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxx
```

Add `"type": "module"` to your package.json to enable ES module imports.

4. Backend Pipeline Implementation (server.js)

JavaScript

import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';

import rateLimit from 'express-rate-limit';

import { ApifyClient } from 'apify-client';

import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const apify = new ApifyClient({ token: process.env.APIFY_TOKEN });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

// 4. API PIPELINE ROUTE

// ==========================================

app.post('/api/crawl-events', scrapeLimiter, async (req, res) => {

  const { query } = req.body;

  const searchQuery = query || 'tech exhibition 2027 Singapore OR "Hong Kong" OR "United States"';

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

        console.log(`[Step 3] Parsing and scoring with Gemini: ${targetUrl}`);

        const response = await callWithRetry(() =>

          ai.models.generateContent({

            model: 'gemini-2.5-flash',

            contents: `Source URL: ${targetUrl}

Page Text:
${rawText}`,

            config: {

              systemInstruction: PROMPT_SYSTEM,

              responseMimeType: 'application/json',

              temperature: 0.1,

            },

          })

        );

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

5. Frontend Integration (EventScraperDashboard.tsx)

TypeScript

import React, { useState } from 'react';

interface EventRecord {

  no: number;

  event_name: string;

  dates: string;

  city: string;

  country: string;

  business_lines: string;

  fit_score: number;

  priority_level: string;

  participation_recommendation: string;

  booth_sponsorship_cost: string;

  official_website: string;

}

export default function EventScraperDashboard() {

  const [loading, setLoading] = useState(false);

  const [statusText, setStatusText] = useState('');

  const [events, setEvents] = useState<EventRecord[]>([]);

  const [query, setQuery] = useState('tech exhibition 2027 Singapore OR Malaysia OR Philippines');

  const handleCrawl = async () => {

    setLoading(true);

    setStatusText('Running Google Search and Apify Crawlers...');

    try {

      const res = await fetch('http://localhost:5000/api/crawl-events', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ query }),

      });

      setStatusText('Applying Lifewood 27-column audit and Fit Scoring...');

      const result = await res.json();

      if (result.success) {

        setEvents(result.data);

      } else {

        alert(`Error: ${result.error}`);

      }

    } catch (err: any) {

      alert(`Network failure: ${err.message}`);

    } finally {

      setLoading(false);

      setStatusText('');

    }

  };

  return (

    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>

      <h2>Tech Exhibition Discovery Engine (Batch 11)</h2>

      <p style={{ color: '#555' }}>Crawl target: Sep 1, 2026 – Dec 31, 2027 (Fit Score ≥ 3)</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>

        <input

          type="text"

          value={query}

          onChange={(e) => setQuery(e.target.value)}

          disabled={loading}

          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}

        />

        <button

          onClick={handleCrawl}

          disabled={loading}

          style={{

            padding: '10px 20px',

            backgroundColor: loading ? '#94a3b8' : '#0284c7',

            color: '#fff',

            border: 'none',

            borderRadius: '4px',

            cursor: loading ? 'not-allowed' : 'pointer',

            fontWeight: 600,

          }}

        >

          {loading ? 'Processing Pipeline...' : 'Start Search & Crawl'}

        </button>

      </div>

      {loading && <p style={{ color: '#0284c7' }}>⏳ {statusText}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', fontSize: '13px' }}>

        <thead>

          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>

            <th style={{ padding: '8px' }}>#</th>

            <th style={{ padding: '8px' }}>Event</th>

            <th style={{ padding: '8px' }}>Dates</th>

            <th style={{ padding: '8px' }}>Location</th>

            <th style={{ padding: '8px' }}>Business Line</th>

            <th style={{ padding: '8px' }}>Fit</th>

            <th style={{ padding: '8px' }}>Priority</th>

            <th style={{ padding: '8px' }}>Booth Cost</th>

            <th style={{ padding: '8px' }}>Link</th>

          </tr>

        </thead>

        <tbody>

          {events.length === 0 && !loading ? (

            <tr>

              <td colSpan={9} style={{ textAlign: 'center', padding: '16px', color: '#888' }}>

                No records yet. Run a search query to populate.

              </td>

            </tr>

          ) : (

            events.map((e) => (

              <tr key={e.no} style={{ borderBottom: '1px solid #e2e8f0' }}>

                <td style={{ padding: '8px' }}>{e.no}</td>

                <td style={{ padding: '8px', fontWeight: 600 }}>{e.event_name}</td>

                <td style={{ padding: '8px' }}>{e.dates}</td>

                <td style={{ padding: '8px' }}>{e.city}, {e.country}</td>

                <td style={{ padding: '8px' }}>{e.business_lines}</td>

                <td style={{ padding: '8px', fontWeight: 700 }}>{e.fit_score}</td>

                <td style={{ padding: '8px' }}>{e.priority_level}</td>

                <td style={{ padding: '8px' }}>{e.booth_sponsorship_cost}</td>

                <td style={{ padding: '8px' }}>

                  <a href={e.official_website} target="_blank" rel="noreferrer" style={{ color: '#0284c7' }}>

                    View

                  </a>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

6. Execution Instructions

Start the backend:

Bash

node server.js

Mount the React component into your frontend application and run the dev server (npm run dev).

Click "Start Search & Crawl".

Take the structured, verified records and enter them directly into the Lifewood dashboard platform.