# 02 — Prompt & Tech Stack Specification
# Tech Exhibition Dashboard — Lifewood Data Technology

> **Version:** 1.0  
> **Date:** September 7, 2026  
> **Status:** Active

---

## TABLE OF CONTENTS

1. [Tech stack overview](#10-tech-stack-overview)
2. [Frontend specification](#20-frontend-specification)
3. [Backend specification](#30-backend-specification)
4. [Database specification](#40-database-specification)
5. [Scraper engine specification](#50-scraper-engine-specification)
6. [AI / prompt engineering specification](#60-ai--prompt-engineering-specification)
7. [Authentication & authorization](#70-authentication--authorization)
8. [API design](#80-api-design)
9. [Environment & configuration](#90-environment--configuration)
10. [Dependencies list](#100-dependencies-list)

---

## 1.0 Tech stack overview

```
┌─────────────────────────────────────────────────────────┐
│                    ARCHITECTURE                          │
│                                                          │
│   ┌──────────────┐    REST API    ┌──────────────────┐  │
│   │   FRONTEND   │ ◄────────────► │     BACKEND      │  │
│   │  Next.js 14  │                │   Next.js API    │  │
│   │  React 18    │                │   Routes         │  │
│   │  TypeScript  │                │   TypeScript     │  │
│   │  Tailwind    │                │                  │  │
│   └──────────────┘                └────────┬─────────┘  │
│                                            │             │
│                                   ┌────────▼─────────┐  │
│                                   │   PostgreSQL     │  │
│                                   │   (via Prisma)   │  │
│                                   └────────┬─────────┘  │
│                                            │             │
│   ┌──────────────┐    Subprocess  ┌────────▼─────────┐  │
│   │   SCRAPER    │ ◄────────────► │   Scheduler      │  │
│   │   Python     │                │   (node-cron)    │  │
│   │   FastAPI    │                │                  │  │
│   │   Scrapy     │                └──────────────────┘  │
│   └──────────────┘                                      │
│                                                          │
│   ┌──────────────┐                                      │
│   │  AI PROVIDER │  (configurable — OpenAI / Claude /   │
│   │  (LLM API)   │   Gemini / local)                   │
│   └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | Next.js (App Router) | 14.x | SSR, routing, React framework |
| **UI library** | React | 18.x | Component rendering |
| **Language** | TypeScript | 5.x | Type safety across frontend + backend |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS, Lifewood brand tokens |
| **Components** | shadcn/ui | latest | Accessible, customizable component primitives |
| **Charts** | Recharts | 2.x | Dashboard visualizations |
| **Backend API** | Next.js API Routes | 14.x | REST endpoints, server actions |
| **ORM** | Prisma | 5.x | Type-safe PostgreSQL queries |
| **Database** | PostgreSQL | 16.x | Primary data store |
| **Auth** | NextAuth.js | 4.x | Session-based auth, role management |
| **Scraper** | Python + FastAPI | 3.11+ / 0.100+ | Independent scraper microservice |
| **Crawling** | Scrapy + BeautifulSoup | 2.11+ / 4.x | Web crawling and HTML parsing |
| **Scheduling** | node-cron (Next.js) + APScheduler (Python) | — | Dual scheduling: JS triggers, Python executes |
| **AI provider** | Configurable (user provides later) | — | Event classification, field extraction |
| **i18n** | next-intl | 3.x | English + Chinese bilingual support |
| **Validation** | Zod | 3.x | Schema validation for forms and API |
| **State** | Zustand | 4.x | Client-side state management |

---

## 2.0 Frontend specification

### 2.1 Framework: Next.js 14 (App Router)

**Why Next.js:**
- Server-side rendering for fast initial load and SEO
- App Router for file-based routing with layouts
- API Routes colocated with frontend (no separate server needed)
- Built-in image optimization
- TypeScript first-class support

### 2.2 Key frontend libraries

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "recharts": "^2.12.0",
    "next-intl": "^3.0.0",
    "zustand": "^4.5.0",
    "zod": "^3.22.0",
    "lucide-react": "latest",
    "@tanstack/react-table": "^8.0.0",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.0",
    "sonner": "^1.4.0",
    "cmdk": "latest"
  }
}
```

### 2.3 Tailwind configuration (Lifewood brand tokens)

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        paper: '#F5EEDB',
        'sea-salt': '#F9F7F7',
        'dark-serpent': '#133020',
        'castleton': '#046241',
        saffron: '#FFB347',
        'earth-yellow': '#FFC370',
        // Semantic
        'fit-5': '#133020',
        'fit-4': '#046241',
        'fit-3': '#708E7C',
        'priority-high': '#C17110',
        'priority-medium': '#FFB347',
        'priority-low': '#9CAFA4',
      },
      fontFamily: {
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        'alimama': ['Alimama ShuHeiTi', 'Microsoft YaHei', 'sans-serif'],
        'yahei': ['Microsoft YaHei', 'PingFang SC', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
}
```

---

## 3.0 Backend specification

### 3.1 Next.js API Routes

All backend logic lives in Next.js API routes (`app/api/...`) except the scraper, which runs as a separate Python microservice.

**API route structure:**
```
app/api/
  auth/          → NextAuth.js handlers
  events/        → CRUD for exhibition events
  scraper/       → Trigger and status endpoints (proxy to Python service)
  reports/       → Report generation
  queues/        → Review and corrections queues
  dashboard/     → Aggregated stats
  users/         → User management (Admin only)
```

### 3.2 Python scraper microservice

Runs independently as a FastAPI service on a separate port (default: `8000`).

**Responsibilities:**
- Accept scrape requests from Next.js backend
- Crawl configured sources
- Extract raw event data
- Call AI provider for classification
- Return structured results to Next.js for storage

**Communication:** HTTP REST between Next.js → Python FastAPI.

---

## 4.0 Database specification

### 4.1 ORM: Prisma

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── Core models ───

model Event {
  id                      Int       @id @default(autoincrement())
  eventNumber             Int       @unique              // Field 1: No.
  region                  String                         // Field 2
  country                 String                         // Field 3
  city                    String                         // Field 4
  eventName               String                         // Field 5
  dates                   String                         // Field 6 (formatted string)
  startDate               DateTime?                      // Parsed for filtering/sorting
  endDate                 DateTime?                      // Parsed for filtering/sorting
  venue                   String                         // Field 7
  locationAddress         String                         // Field 8
  officialWebsite         String                         // Field 9
  organizer               String                         // Field 10
  eventCategory           String                         // Field 11
  businessLines           String[]                       // Field 12 (array)
  strategicFocus          String                         // Field 13
  relevanceToLifewood     String                         // Field 14
  targetAudience          String                         // Field 15
  estimatedAttendees      String    @default("Not publicly disclosed") // Field 16
  exhibitorOpportunity    String    @default("Not publicly disclosed") // Field 17
  boothCost               String    @default("Not publicly disclosed") // Field 18
  registrationDeadline    String    @default("Not publicly disclosed") // Field 19
  contactEmail            String    @default("Not publicly disclosed") // Field 20
  contactPerson           String    @default("Not publicly disclosed") // Field 21
  socialMedia             String    @default("Not publicly disclosed") // Field 22
  participationRec        String                         // Field 23
  priorityLevel           String                         // Field 24
  fitScore                Int                            // Field 25
  keyNotes                String                         // Field 26
  sourceLinks             String[]                       // Field 27 (array)

  // Metadata
  status                  EventStatus @default(PUBLISHED)
  source                  EventSource @default(MANUAL)
  createdAt               DateTime    @default(now())
  updatedAt               DateTime    @updatedAt
  createdById             Int?
  createdBy               User?       @relation(fields: [createdById], references: [id])

  // Relations
  queueItems              QueueItem[]
}

enum EventStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  ARCHIVED
}

enum EventSource {
  MANUAL
  SCRAPED
  IMPORTED
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  name          String
  passwordHash  String
  role          UserRole  @default(INTERN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  events        Event[]
  queueItems    QueueItem[]
}

enum UserRole {
  ADMIN
  SUPERVISOR
  INTERN
}

model QueueItem {
  id            Int         @id @default(autoincrement())
  type          QueueType
  eventId       Int
  event         Event       @relation(fields: [eventId], references: [id])
  submittedById Int
  submittedBy   User        @relation(fields: [submittedById], references: [id])
  reason        String
  status        QueueStatus @default(PENDING)
  resolvedAt    DateTime?
  createdAt     DateTime    @default(now())
}

enum QueueType {
  FOR_REVIEW        // Ambiguous fit score
  CORRECTION        // Edit to existing record
}

enum QueueStatus {
  PENDING
  APPROVED
  REJECTED
}

model ScrapeRun {
  id            Int       @id @default(autoincrement())
  status        String    // idle, running, completed, error
  startedAt     DateTime
  completedAt   DateTime?
  eventsFound   Int       @default(0)
  eventsAdded   Int       @default(0)
  eventsSkipped Int       @default(0)
  config        Json      // regions, business lines, date range used
  errorLog      String?
}

model ScraperSchedule {
  id            Int       @id @default(autoincrement())
  enabled       Boolean   @default(false)
  frequency     String    // daily, weekly, monthly
  nextRunAt     DateTime?
  lastRunAt     DateTime?
  config        Json      // default scrape parameters
}
```

---

## 5.0 Scraper engine specification

### 5.1 Architecture

```
Python FastAPI Service (port 8000)
│
├── /api/scrape          POST — start a scrape job
├── /api/scrape/status   GET  — check running job status
├── /api/scrape/results  GET  — fetch completed results
│
├── Scrapy spiders/
│   ├── organizer_spider.py     — crawl organizer portfolio pages
│   ├── venue_calendar_spider.py — crawl convention center calendars
│   ├── curated_list_spider.py  — crawl curated event calendar sites
│   └── official_site_spider.py — crawl individual official event sites
│
├── Extractors/
│   ├── event_extractor.py      — parse HTML → raw event dict
│   └── date_parser.py          — normalize dates to standard format
│
├── AI/
│   ├── classifier.py           — business line classification
│   ├── field_filler.py         — auto-fill basic fields
│   └── deduplicator.py         — fuzzy name/acronym matching
│
└── Config/
    ├── sources.yaml             — URL list, organized by source tier
    └── business_lines.yaml      — keywords and signals per business line
```

### 5.2 Source configuration (sources.yaml)

```yaml
# sources.yaml — where the scraper crawls

tier_1_official:
  description: "Official event and organizer sites"
  sources:
    - name: "HKTDC Events Calendar"
      url: "https://www.hktdc.com/event"
      type: organizer_portfolio
    - name: "Informa Connect"
      url: "https://www.informaconnect.com/events/"
      type: organizer_portfolio
    - name: "IQPC/SSON Events"
      url: "https://www.ssonetwork.com/events"
      type: organizer_portfolio
    - name: "Reed Exhibitions"
      url: "https://www.rxglobal.com/events"
      type: organizer_portfolio
    - name: "Clarion Events"
      url: "https://www.clarionevents.com/"
      type: organizer_portfolio
    - name: "KAOUN International (GITEX)"
      url: "https://www.gitex.com/"
      type: organizer_portfolio

tier_2_venue_calendars:
  description: "Convention center event calendars"
  sources:
    - name: "HKCEC"
      url: "https://www.hkcec.com/en/events"
      type: venue_calendar
    - name: "Marina Bay Sands"
      url: "https://www.marinabaysands.com/sands-expo-convention-centre.html"
      type: venue_calendar
    - name: "Javits Center"
      url: "https://javitscenter.com/events"
      type: venue_calendar
    - name: "McCormick Place"
      url: "https://www.mccormickplace.com/events/"
      type: venue_calendar
    - name: "Moscone Center"
      url: "https://www.moscone.com/events"
      type: venue_calendar
    - name: "LVCC"
      url: "https://www.vegasmeansbusiness.com/venues/las-vegas-convention-center/"
      type: venue_calendar
    - name: "Messe Berlin"
      url: "https://www.messe-berlin.de/en/visitors/event-calendar.html"
      type: venue_calendar
    - name: "ExCeL London"
      url: "https://www.excel.london/whats-on"
      type: venue_calendar

tier_3_curated:
  description: "Curated event calendars — for discovery, not verification"
  sources:
    - name: "Crossmint AI Conference Calendar"
      url: "https://www.crossmint.com/learn/ai-agent-conference-calendar"
      type: curated_list
    - name: "Paul Okhrem AI Events"
      url: "https://paul-okhrem.com/ai-events/"
      type: curated_list
    - name: "Fintech Magazine Events"
      url: "https://fintechmagazine.com/top10/top-10-fintech-events-2026-2027"
      type: curated_list
    - name: "Bleap Finance Europe Tech"
      url: "https://www.bleap.finance/en-us/blog/best-tech-events-in-europe"
      type: curated_list
    - name: "WaveCNT Marketing Events"
      url: "https://wavecnct.com/blogs/marketing-conferences-trade-shows-usa-2026"
      type: curated_list
```

### 5.3 Scrape flow

```
1. Receive scrape request (regions, date range, business lines)
         ↓
2. Load source URLs from sources.yaml matching regions
         ↓
3. Crawl each source → extract raw event dicts
    {name, dates_raw, location_raw, url, description, organizer_raw}
         ↓
4. Date parser normalizes dates → filter by date window (Sept 2026 – Dec 2027)
         ↓
5. Deduplicator checks against existing DB records (fuzzy match on name + acronym)
         ↓
6. AI classifier reads event description → assigns business line(s) + confidence %
         ↓
7. AI field filler auto-fills: region, country, city, event category, strategic focus
         ↓
8. Return results with status: NEW / DUPLICATE / OUT_OF_SCOPE / LOW_FIT
         ↓
9. User reviews in dashboard → Accept / Edit / Reject each result
```

---

## 6.0 AI / Prompt engineering specification

### 6.1 Overview

The AI provider is **configurable** (user will specify later). The system is designed to work with any OpenAI-compatible API (OpenAI, Anthropic, Google, local models).

All prompts follow this structure:

```
ROLE → TASK → SPECIFICS → CONTEXT → EXAMPLES → NOTES
```

### 6.2 Prompt: Event classifier

```yaml
prompt_id: event_classifier
purpose: Determine if a scraped event is relevant to Lifewood's business lines and assign a preliminary fit score

role: |
  You are a strategic analyst at Lifewood Data Technology, a global AI data solutions company. 
  Your job is to evaluate whether a tech exhibition or conference is relevant to Lifewood's 
  six business lines and assign a preliminary fit score.

task: |
  Given an event's name, description, topics, and "who should attend" information, do the following:
  1. Determine which of Lifewood's 6 business lines the event maps to (can be multiple)
  2. Identify the primary business line
  3. Assign a preliminary fit score (1–5)
  4. Write a 1–2 sentence "Relevance to Lifewood" assessment
  5. Recommend a participation level

specifics:
  business_lines:
    1:
      name: "Global Scanning + Indexing"
      data_elements: "Text, Picture"
      keywords: "digitization, archives, records, manuscripts, OCR/HTR, metadata, libraries, genealogy, provenance"
    2:
      name: "Global AI Data"
      data_elements: "Text, Audio, Picture, Video"
      keywords: "training data, annotation/labeling, RLHF, evals, datasets, LLM, multilingual data, MLOps, data governance"
    3:
      name: "AIGC"
      data_elements: "Picture, Video"
      keywords: "generative AI, AI video/creative, content production, marketing AI, media & entertainment AI"
    4:
      name: "Autonomous Driving"
      data_elements: "Picture, Video"
      keywords: "ADAS, AV, LiDAR, sensor fusion, computer vision, in-cabin, mobility software"
    5:
      name: "AEO / GEO"
      data_elements: "Text"
      keywords: "answer-engine optimization, generative-engine optimization, AI search, LLM SEO, AI Overviews, brand citation, multilingual SEO"
    6:
      name: "EDGE Intelligence"
      data_elements: "Audio, Picture, Video"
      keywords: "embedded vision, edge AI, IoT, industrial IoT, on-device inference"

  cross_cutting_moats:
    A: "AI Orchestration — enterprise-AI / data-platform / MLOps events"
    B: "Agentic Workflow Engine — agentic AI & intelligent automation"
    C: "Global Compliance & Data Governance — AI-governance & data-governance events"
    D: "Global Delivery Network — BPO / GBS / CX / global-sourcing events"

  fit_score_rubric:
    5: "Audience and theme map directly to Lifewood services — the buyer in the room is our buyer"
    4: "Strong fit; large relevant buyer audience; clear partnership or brand value"
    3: "Moderate fit; useful for visibility and partnerships; broader audience"
    2: "Low fit — some tangential relevance"
    1: "No fit — different industry entirely"

  participation_levels:
    - "Exhibit / sponsor"
    - "Attend / selective sponsor"
    - "Speak / apply for CFP"
    - "Monitor only"

context: |
  Lifewood Data Technology is a global AI data solutions company based in the Philippines, USA (Utah), 
  and Hong Kong. They provide:
  - AI training data (text, audio, image, video annotation and labeling)
  - Multilingual data services (100+ languages)
  - Document digitization and indexing
  - AIGC video/content production
  - AEO/GEO and multilingual SEO services
  - Edge AI and autonomous driving data
  - BPO/global delivery services
  
  The ideal event has buyers who PURCHASE what Lifewood makes — not just events with "AI" in the name.
  Score the audience, not the buzzwords.

examples:
  - input: "GITEX ASIA x AI Everything Singapore 2026 — Asia's largest tech/AI/startup event"
    output:
      business_lines: ["2. Global AI Data"]
      primary: "2. Global AI Data"
      fit_score: 5
      relevance: "Best single Asia stage for Lifewood's AI-data, LLM training data, multilingual data & digital-transformation offering before regional enterprise, government & investor buyers."
      participation: "Exhibit / sponsor"

  - input: "International Builders' Show — Building materials and construction tools"
    output:
      business_lines: []
      primary: null
      fit_score: 1
      relevance: "Construction industry — no relevant Lifewood buyer audience."
      participation: "Do not enter"

  - input: "brightonSEO San Diego 2026 — World's largest search marketing conference"
    output:
      business_lines: ["2. Global AI Data", "5. AEO/GEO"]
      primary: "5. AEO/GEO"
      fit_score: 5
      relevance: "Best-fit venue for AEO/GEO and multilingual SEO services; tactical audience adopting generative-engine optimization."
      participation: "Sponsor / speak"

notes: |
  - NEVER assign a fit score based on the event title alone. Read the description.
  - An event with "AI" in the name that sells to AI buyers deploying tools is a 3–4. 
    An event where model-builders and data-quality teams gather is a 5.
  - If unsure between fit 2 and 3, return fit 2 with a flag: "needs_review: true"
  - Cross-cutting moats (A–D) justify inclusion but are NOT tagged per-event.
  - Return valid JSON only.

output_schema:
  type: object
  properties:
    business_lines:
      type: array
      items: string
    primary_business_line:
      type: string
      nullable: true
    fit_score:
      type: integer
      minimum: 1
      maximum: 5
    relevance_to_lifewood:
      type: string
    participation_recommendation:
      type: string
    needs_review:
      type: boolean
    confidence:
      type: number
      minimum: 0
      maximum: 1
```

### 6.3 Prompt: Field extractor

```yaml
prompt_id: field_extractor
purpose: Extract structured event fields from raw scraped HTML/text

role: |
  You are a data extraction specialist. Your job is to read raw event page content 
  and extract structured fields accurately. If a field isn't found, respond with 
  "Not publicly disclosed" — never estimate or fabricate.

task: |
  Given the raw text content of an event's official webpage, extract the following fields:
  1. Event name (official name + year)
  2. Date(s) (format: "Sep 14–17, 2027"; use "Q3 2027 (dates TBA)" if unconfirmed)
  3. Venue (official venue name)
  4. Location address (full street address)
  5. City
  6. Country
  7. Region (one of: North America, Asia, Europe, Middle East, South America, Africa, Oceania)
  8. Organizer (company/body running it)
  9. Event category (short descriptor, e.g. "Enterprise AI conference & expo")
  10. Target audience
  11. Estimated attendees
  12. Exhibitor/sponsor opportunity (yes/no + details if found)
  13. Booth or sponsorship cost
  14. Registration deadline
  15. Contact email
  16. Contact person
  17. LinkedIn / social media URL
  18. Key notes (edition number, co-located shows, free/paid, CFP deadline)
  19. Official website URL

specifics: |
  Date formatting rules:
  - Confirmed: "Sep 14–17, 2027" (3-letter month, en dash, year)
  - Range across months: "Nov 30–Dec 3, 2026"
  - Single day: "Jun 18, 2026"
  - Unconfirmed: "Q3 2027 (dates TBA)"
  - Provisional: "Sep 2027 (dates provisional)"
  
  City rules:
  - Use actual city name, not ZIP code (wrong: "FL 33316", correct: "Fort Lauderdale, FL")
  
  Attendee rules:
  - Use "5,000+" format when approximate
  - Use "Not publicly disclosed" when not stated anywhere

context: |
  This is for Lifewood Data Technology's event database which tracks tech exhibitions worldwide.
  Data integrity is critical — fabricated data damages trust. "Not publicly disclosed" is always 
  the correct answer when information isn't available.

notes: |
  - The non-negotiable honesty rule: if a detail is not published, write "Not publicly disclosed"
  - Never leave a field blank. Never estimate. Never round a guess into a number.
  - If the official site has a "Save the date" banner for the next year's edition, capture that.
  - Return valid JSON only.

output_schema:
  type: object
  properties:
    event_name: { type: string }
    dates: { type: string }
    start_date: { type: string, format: date, nullable: true }
    end_date: { type: string, format: date, nullable: true }
    venue: { type: string }
    location_address: { type: string }
    city: { type: string }
    country: { type: string }
    region: { type: string, enum: ["North America", "Asia", "Europe", "Middle East", "South America", "Africa", "Oceania"] }
    organizer: { type: string }
    event_category: { type: string }
    target_audience: { type: string }
    estimated_attendees: { type: string }
    exhibitor_opportunity: { type: string }
    booth_cost: { type: string }
    registration_deadline: { type: string }
    contact_email: { type: string }
    contact_person: { type: string }
    social_media: { type: string }
    key_notes: { type: string }
    official_website: { type: string }
```

### 6.4 Prompt: Duplicate detector

```yaml
prompt_id: duplicate_detector
purpose: Determine if a scraped event already exists in the database

role: |
  You are a deduplication specialist for an events database.

task: |
  Given a new event name and a list of existing event names from the database, 
  determine if the new event is a duplicate of any existing one.

specifics: |
  Rules:
  - Same brand, different city = NOT duplicate (GITEX Global Dubai ≠ GITEX Asia Singapore)
  - Same event, different year = NOT duplicate (SSOW 2026 ≠ SSOW 2027 → both get their own record)
  - Renamed events ARE duplicates (Labelexpo = LOUPE Americas)
  - Acronyms match full names (MWC = Mobile World Congress)
  - "x" and "&" and "+" are interchangeable connectors

context: |
  The database tracks tech exhibitions. Each event-year combination gets its own record.
  Same brand in different cities are separate records.

output_schema:
  type: object
  properties:
    is_duplicate:
      type: boolean
    matched_event:
      type: string
      nullable: true
    confidence:
      type: number
    reason:
      type: string
```

### 6.5 AI provider abstraction

```typescript
// lib/ai/provider.ts — abstraction layer so any provider works

interface AIProvider {
  classify(eventData: RawEventData): Promise<ClassificationResult>;
  extractFields(rawContent: string): Promise<ExtractedFields>;
  checkDuplicate(newName: string, existingNames: string[]): Promise<DuplicateResult>;
}

// Implementations can be swapped via environment variable:
// AI_PROVIDER=openai | anthropic | google | local
```

---

## 7.0 Authentication & authorization

### 7.1 Provider: NextAuth.js

```typescript
// Credential-based auth (email + password)
// Sessions stored in PostgreSQL via Prisma adapter

providers: [
  CredentialsProvider({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      // Validate against User table
      // Return user with role
    },
  }),
]
```

### 7.2 Role permissions

| Action | Admin | Supervisor | Intern |
|---|---|---|---|
| View dashboard | ✅ | ✅ | ✅ |
| View events | ✅ | ✅ | ✅ |
| Add event (draft) | ✅ | ✅ | ✅ |
| Publish event | ✅ | ✅ | ❌ |
| Edit any event | ✅ | ✅ | ❌ |
| Edit own draft | ✅ | ✅ | ✅ |
| Delete event | ✅ | ❌ | ❌ |
| Approve queue items | ✅ | ✅ | ❌ |
| Run scraper | ✅ | ✅ | ❌ |
| Configure scraper schedule | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Generate reports | ✅ | ✅ | ✅ |
| Export reports | ✅ | ✅ | ❌ |

---

## 8.0 API design

### 8.1 REST endpoints

```
# Events
GET    /api/events              — List events (filterable, paginated)
GET    /api/events/:id          — Get single event
POST   /api/events              — Create event
PUT    /api/events/:id          — Update event
DELETE /api/events/:id          — Delete event (Admin only)

# Dashboard
GET    /api/dashboard/stats     — Aggregate stats (total, by region, by month, etc.)
GET    /api/dashboard/gaps      — Coverage gap analysis

# Scraper
POST   /api/scraper/run         — Trigger scrape (proxied to Python service)
GET    /api/scraper/status      — Current scraper status
GET    /api/scraper/results     — Latest scrape results
POST   /api/scraper/accept/:id  — Accept a scraped event into DB
POST   /api/scraper/reject/:id  — Reject a scraped event
GET    /api/scraper/schedule    — Get schedule config
PUT    /api/scraper/schedule    — Update schedule config

# Queues
GET    /api/queues              — List queue items (type, status filters)
POST   /api/queues              — Submit to queue
PUT    /api/queues/:id/approve  — Approve queue item
PUT    /api/queues/:id/reject   — Reject queue item

# Reports
POST   /api/reports/generate    — Generate a report
GET    /api/reports/:id         — Download generated report

# Auth
POST   /api/auth/signin        — Sign in
POST   /api/auth/signout       — Sign out
GET    /api/auth/session       — Current session

# Users
GET    /api/users               — List users (Admin)
POST   /api/users               — Create user (Admin)
PUT    /api/users/:id           — Update user (Admin)
DELETE /api/users/:id           — Delete user (Admin)
```

### 8.2 Query parameters (events list)

```
GET /api/events?
  page=1
  &limit=25
  &sort=startDate
  &order=asc
  &region=Asia
  &businessLine=2
  &fitScore=4,5
  &priority=High
  &dateFrom=2026-09-01
  &dateTo=2027-12-31
  &search=GITEX
  &status=PUBLISHED
```

---

## 9.0 Environment & configuration

```env
# .env.local

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lifewood_exhibitions"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Python scraper service
SCRAPER_API_URL="http://localhost:8000"
SCRAPER_API_KEY="your-scraper-api-key"

# AI Provider (configure when ready)
AI_PROVIDER="openai"           # openai | anthropic | google | local
AI_API_KEY="your-api-key"
AI_MODEL="gpt-4o-mini"         # or claude-sonnet, gemini-pro, etc.

# App
NEXT_PUBLIC_APP_NAME="Lifewood Exhibition Dashboard"
NEXT_PUBLIC_DEFAULT_LOCALE="en"
```

---

## 10.0 Dependencies list

### 10.1 Frontend / Next.js (package.json)

```
next, react, react-dom, typescript
tailwindcss, postcss, autoprefixer
@radix-ui/react-* (dialog, dropdown, select, tabs, tooltip, etc.)
lucide-react (icons)
recharts (charts)
@tanstack/react-table (data tables)
react-hook-form, @hookform/resolvers (forms)
zod (validation)
zustand (state management)
next-intl (i18n — EN + CN)
next-auth (authentication)
@prisma/client (database queries)
sonner (toast notifications)
cmdk (command palette / search)
date-fns (date formatting)
class-variance-authority, clsx, tailwind-merge (utility)
```

### 10.2 Python scraper (requirements.txt)

```
fastapi>=0.100.0
uvicorn>=0.23.0
scrapy>=2.11.0
beautifulsoup4>=4.12.0
httpx>=0.25.0
pydantic>=2.0.0
apscheduler>=3.10.0
python-dotenv>=1.0.0
openai>=1.0.0        # or anthropic / google-generativeai — based on AI_PROVIDER
pyyaml>=6.0
fuzzywuzzy>=0.18.0
python-Levenshtein>=0.21.0
```

### 10.3 Dev tools

```
prisma (ORM CLI)
eslint, prettier (linting)
@types/* (TypeScript definitions)
```
