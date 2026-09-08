# 04 — Workflow
# Tech Exhibition Dashboard — Lifewood Data Technology

> **Version:** 1.0  
> **Date:** September 7, 2026  
> **Status:** Active

---

## TABLE OF CONTENTS

1. [Development workflow](#10-development-workflow)
2. [Scraper pipeline workflow](#20-scraper-pipeline-workflow)
3. [Manual data entry workflow](#30-manual-data-entry-workflow)
4. [Review & approval workflow](#40-review--approval-workflow)
5. [Report generation workflow](#50-report-generation-workflow)
6. [User journey flows](#60-user-journey-flows)
7. [Development phases & build order](#70-development-phases--build-order)
8. [Setup & run instructions](#80-setup--run-instructions)
9. [Git workflow](#90-git-workflow)

---

## 1.0 Development workflow

### 1.1 Overview

The project has two independent services that run concurrently:

```
┌───────────────────────┐     HTTP (REST)     ┌───────────────────────┐
│    Next.js Frontend   │ ◄─────────────────► │   Python Scraper      │
│    (port 3000)        │                      │   (port 8000)         │
│                       │                      │                       │
│  • UI pages           │                      │  • Web crawling       │
│  • API routes         │                      │  • AI classification  │
│  • Auth               │                      │  • Data extraction    │
│  • Database (Prisma)  │                      │  • Scheduling         │
└───────┬───────────────┘                      └───────────────────────┘
        │
        ▼
┌───────────────────────┐
│    PostgreSQL          │
│    (port 5432)         │
└───────────────────────┘
```

### 1.2 Development cycle

```
1. Write code
     ↓
2. Test locally (npm run dev + uvicorn)
     ↓
3. Commit to feature branch
     ↓
4. Review (self or peer)
     ↓
5. Merge to main
     ↓
6. Deploy (future — Vercel + Railway/Fly.io)
```

---

## 2.0 Scraper pipeline workflow

### 2.1 Full pipeline flow

```
                 ┌──────────────────────┐
                 │   TRIGGER            │
                 │   (manual button     │
                 │    or cron schedule)  │
                 └──────────┬───────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  STEP 1: CONFIGURE          │
              │                             │
              │  • Date range               │
              │    (Sept 2026 → Dec 2027)   │
              │  • Regions to crawl         │
              │  • Business lines to match  │
              │  • Source tiers to include   │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │  STEP 2: CRAWL              │
              │                             │
              │  For each source URL:       │
              │  1. Fetch page HTML         │
              │  2. Respect robots.txt      │
              │  3. Rate limit (2s delay)   │
              │  4. Follow pagination       │
              │  5. Extract event links     │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │  STEP 3: EXTRACT            │
              │                             │
              │  For each event page:       │
              │  1. Parse HTML content      │
              │  2. Extract raw fields:     │
              │     name, dates_raw,        │
              │     location_raw, url,      │
              │     description_raw,        │
              │     organizer_raw           │
              │  3. Normalize dates         │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │  STEP 4: FILTER             │
              │                             │
              │  Drop events where:         │
              │  • Start date outside       │
              │    Sept 2026 – Dec 2027     │
              │  • No relevance signals     │
              │    found in description     │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │  STEP 5: DEDUPLICATE        │
              │                             │
              │  For each remaining event:  │
              │  1. Fuzzy match name vs     │
              │     all existing DB names   │
              │  2. Check acronyms          │
              │  3. Check former names      │
              │  4. Flag if > 85% match     │
              │                             │
              │  Same brand + diff city     │
              │  = NOT duplicate ✓          │
              │  Same event + next year     │
              │  = NOT duplicate ✓          │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │  STEP 6: AI CLASSIFY        │
              │                             │
              │  Send to AI provider:       │
              │  • Event name + description │
              │  • "Who should attend" text │
              │  • Topics / tracks listed   │
              │                             │
              │  AI returns:                │
              │  • Business line(s) matched │
              │  • Preliminary fit score    │
              │  • Confidence percentage    │
              │  • needs_review flag        │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │  STEP 7: AUTO-FILL          │
              │                             │
              │  AI fills basic fields:     │
              │  ✅ Region                   │
              │  ✅ Country                  │
              │  ✅ City                     │
              │  ✅ Event name (formatted)   │
              │  ✅ Date(s) (formatted)      │
              │  ✅ Venue                    │
              │  ✅ Location address         │
              │  ✅ Official website         │
              │  ✅ Organizer                │
              │  ✅ Event category           │
              │  ✅ Strategic focus          │
              │  ✅ Target audience          │
              │  ✅ Estimated attendees      │
              │                             │
              │  User fills strategic:      │
              │  ⬜ Relevance to Lifewood   │
              │  ⬜ Business line(s) confirm│
              │  ⬜ Fit score (confirm/adj) │
              │  ⬜ Participation rec.      │
              │  ⬜ Priority level          │
              │  ⬜ Key notes               │
              │  ⬜ Commercial details      │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │  STEP 8: PRESENT RESULTS    │
              │                             │
              │  Results appear in the      │
              │  scraper results page:      │
              │                             │
              │  Each result shows:         │
              │  • Event name + auto-fields │
              │  • AI confidence %          │
              │  • Business line match      │
              │  • Preliminary fit score    │
              │  • Status: NEW / DUPLICATE  │
              │    / OUT_OF_SCOPE / LOW_FIT │
              │                             │
              │  User actions:              │
              │  [Accept] → opens edit form │
              │     → user fills strategic  │
              │     → save to DB            │
              │  [Edit]   → modify any field│
              │  [Reject] → discard         │
              └─────────────────────────────┘
```

### 2.2 Scraper scheduling

```
MANUAL TRIGGER:
  User clicks "Run now" on scraper page
  → POST /api/scraper/run with config
  → Python service starts crawling
  → Status polled every 5 seconds
  → Results appear when complete

AUTO SCHEDULE:
  Admin configures schedule in settings:
  ┌─────────────────────────────────┐
  │  Frequency: [Weekly ▾]          │
  │  Day:       [Monday ▾]          │
  │  Time:      [06:00 AM ▾]       │
  │  Regions:   [All ✓]            │
  │  [Save schedule]                │
  └─────────────────────────────────┘
  
  → APScheduler fires at configured time
  → Results stored, notification sent
  → Admin/Supervisor reviews on next login
```

### 2.3 Error handling

```
Source unreachable → Skip, log warning, continue with next source
Rate limited (429) → Backoff 30s, retry 2x, then skip
AI timeout → Queue event for manual classification
Parse failure → Log raw HTML snippet for debugging, skip event
Duplicate found → Mark as DUPLICATE, don't discard (user can override)
```

---

## 3.0 Manual data entry workflow

### 3.1 Flow

```
User clicks "+ Add event"
        │
        ▼
┌─────────────────────────────┐
│  GROUP A: Identity          │
│  Fill: region, country,     │
│  city, name, dates, venue,  │
│  address                    │
│                             │
│  [Date format helper shown] │
│  "Sep 14–17, 2027"          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  DUPLICATE CHECK            │
│                             │
│  On blur of "Event name":   │
│  → Debounced API call       │
│  → Fuzzy match vs DB        │
│                             │
│  If match found:            │
│  ⚠ "Possible duplicate:    │
│     GITEX Asia (#29)"       │
│  [View existing] [Continue] │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  GROUP B: Source             │
│  Fill: website, organizer,  │
│  event category              │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  GROUP C: Strategic          │
│  Fill: business lines,       │
│  strategic focus, relevance, │
│  target audience, fit score, │
│  priority, participation rec │
│                              │
│  VALIDATION:                 │
│  • Relevance must name a    │
│    specific buyer + service  │
│  • Fit score minimum = 3    │
│  • Priority auto-derived    │
│    from fit score            │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  GROUP D: Commercial         │
│  Fill: attendees, booth cost,│
│  deadline, contact, LinkedIn │
│                              │
│  Each field has:             │
│  [NPD] quick button         │
│  (fills "Not publicly       │
│   disclosed")                │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  GROUP E: Provenance         │
│  Fill: key notes,            │
│  source links (min 1,        │
│  min 2 if date is TBA)       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  REVIEW & SUBMIT             │
│                              │
│  Admin/Supervisor:           │
│  [Publish] → live in DB      │
│                              │
│  Intern:                     │
│  [Save draft]                │
│  [Submit for review] → queue │
└─────────────────────────────┘
```

### 3.2 Validation rules summary

| Rule | Trigger | Behavior |
|---|---|---|
| Required fields (A/B/C/E) | On submit | Red border + error message |
| Empty Group D fields | On save | Auto-fill "Not publicly disclosed" |
| Date format | On blur | Helper hint if format doesn't match `Mon DD–DD, YYYY` |
| Fit score < 3 | On submit | Block with: "Only Fit 3+ events can be entered" |
| Duplicate name | On blur (name field) | Yellow warning bar with link to existing |
| Source links count | On submit | If date is TBA and links < 2, block |
| Generic relevance | On submit (soft) | Warning: "This relevance could apply to any event — be specific" |
| City = ZIP code | On blur (city) | Warning: "Use city name, not ZIP code" |

---

## 4.0 Review & approval workflow

### 4.1 For Review queue (ambiguous fit scores)

```
Intern encounters event where fit is unclear (2 vs 3):
        │
        ▼
    Saves with fit = 2 + submits to "For Review" queue
    with reason: "Audience seems tangential but has 
    an AI data track — unsure if 2 or 3"
        │
        ▼
    Supervisor sees item in Queues page
        │
        ├── [Approve as-is] → event stays at fit 2, not entered
        ├── [Edit & approve] → supervisor changes fit to 3, publishes
        └── [Reject] → event removed from queue
```

### 4.2 Corrections queue (edits to existing records)

```
User finds better data for an existing event (e.g. contact email):
        │
        ▼
    Submits correction to Corrections queue:
    "Found contact email for GITEX Asia: info@gitexasia.com
     Source: official website footer"
        │
        ▼
    Supervisor reviews:
        │
        ├── [Approve] → field updated on the event record
        └── [Reject] → correction discarded with reason
```

### 4.3 Intern draft → publish flow

```
Intern creates event:
        │
        ▼
    Status: DRAFT (only visible to creator + supervisors)
        │
        ▼
    Intern clicks [Submit for review]
        │
        ▼
    Status: PENDING_REVIEW (visible in supervisor's queue)
        │
        ▼
    Supervisor:
        ├── [Publish] → Status: PUBLISHED (visible to all)
        ├── [Request changes] → back to DRAFT with feedback note
        └── [Reject] → Status: ARCHIVED
```

---

## 5.0 Report generation workflow

### 5.1 Flow

```
User navigates to Reports page
        │
        ▼
┌─────────────────────────────┐
│  CONFIGURE REPORT            │
│                              │
│  Type:     [Regional ▾]     │
│  Region:   [Asia ▾]         │
│  Country:  [Hong Kong ▾]    │
│  Date:     [2026-01 → 2026-12] │
│  Format:   [HTML ▾]         │
│  [Generate preview]          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  PREVIEW                     │
│                              │
│  Shows rendered report in    │
│  the HK-report style:       │
│  • Header with Lifewood     │
│    branding                  │
│  • Summary table (all       │
│    matching events)          │
│  • Detail cards for          │
│    high-priority events      │
│  • Filter bar by LOB/month  │
│  • Footer with methodology  │
│                              │
│  [Download HTML]             │
│  [Download CSV]              │
│  [Copy share link]           │
└─────────────────────────────┘
```

### 5.2 Report template structure (matches HK HTML)

```html
<!-- Generated report follows HK report structure -->

<header>
  Lifewood branding, region title, date range, meta pills
</header>

<section class="summary-table">
  All events in a sortable table with quarterly separators
</section>

<section class="filter-bar">
  Filter buttons by business line and month
</section>

<section class="detail-cards">
  Full detail cards for Fit 4+ events:
  - Header (accent bar, name, chips, date, venue)
  - Body grid (organizer, audience, attendees, etc.)
  - Strategic footer (relevance, recommendation)
</section>

<footer>
  Lifewood logo, methodology note, generated date
</footer>
```

---

## 6.0 User journey flows

### 6.1 Intern — daily workflow

```
1. Login
2. View dashboard → see coverage gaps, own draft count
3. Navigate to Events → see existing events (avoid duplicates)
4. Click "+ Add event"
5. Fill 27-field form (Group A → E)
6. Save as draft → self-review against checklist
7. Submit for review
8. Repeat (target: 5–6 events/day)
9. End of day: check if supervisor returned any for changes
```

### 6.2 Supervisor — daily workflow

```
1. Login
2. View dashboard → see team progress, new submissions
3. Navigate to Queues
4. Review pending events:
   - Check data against source links
   - Verify fit score and relevance
   - Publish or request changes
5. Review For Review queue (ambiguous events)
6. Review Corrections queue
7. Optionally: run scraper or generate report
```

### 6.3 Admin — weekly workflow

```
1. Login
2. Dashboard overview — total events, progress vs target
3. Run scraper with full config → review results
4. Accept strong results, reject noise
5. Generate weekly regional reports
6. Manage users (add interns, assign roles)
7. Adjust scraper schedule if needed
8. Review field completeness — identify backfill needs
```

---

## 7.0 Development phases & build order

### Phase 1: Foundation (Days 1–2)

```
Goal: App runs locally, database works, basic auth

Tasks:
  □ Initialize Next.js 14 project with TypeScript
  □ Configure Tailwind with Lifewood brand tokens
  □ Install & configure shadcn/ui components
  □ Set up PostgreSQL + Prisma schema
  □ Run initial migration (Event, User, Queue models)
  □ Set up NextAuth with credentials provider
  □ Create root layout with sidebar + topbar
  □ Create login page
  □ Seed one admin user

Deliverable: App boots, user can log in, sidebar shows
```

### Phase 2: Event CRUD (Days 3–4)

```
Goal: Events can be created, listed, viewed, edited, deleted

Tasks:
  □ Build event list page (table view)
  □ Build event card component (HK report style)
  □ Build card view toggle
  □ Build filter bar (region, BL, fit, priority, date, search)
  □ Build event detail page
  □ Build add event form (all 27 fields, 5 groups)
  □ Add validation (Zod schemas)
  □ Add duplicate detection on event name
  □ Build edit event page
  □ Build API routes (CRUD)

Deliverable: Full event management works end-to-end
```

### Phase 3: Dashboard (Day 5)

```
Goal: Dashboard shows meaningful stats and gaps

Tasks:
  □ Build stat cards (total, 2027 count, avg fit, regions)
  □ Build events-by-month bar chart
  □ Build events-by-region donut chart
  □ Build business line distribution chart
  □ Build fit score distribution chart
  □ Build coverage gap analysis widget
  □ Build recently added events widget
  □ Build dashboard API routes

Deliverable: Dashboard home page is informative and functional
```

### Phase 4: Scraper (Days 6–8)

```
Goal: Scraper finds events from the web

Tasks:
  □ Set up Python FastAPI project
  □ Build base spider class
  □ Build organizer portfolio spider
  □ Build venue calendar spider
  □ Build curated list spider
  □ Build event extractor (HTML → raw dict)
  □ Build date parser & normalizer
  □ Build location parser
  □ Integrate AI classifier (business line + fit score)
  □ Integrate AI field filler (auto-fill basic fields)
  □ Build deduplicator (fuzzy matching)
  □ Build scraper API endpoints
  □ Build Next.js proxy routes
  □ Build scraper UI page (config, trigger, status)
  □ Build scrape results review page (accept/reject)
  □ Add scheduling (APScheduler)

Deliverable: Scraper finds real events, user can accept into DB
```

### Phase 5: Queues & Roles (Day 9)

```
Goal: Review workflow works, roles enforced

Tasks:
  □ Build queues page (For Review + Corrections)
  □ Build queue submission flow
  □ Build approve/reject actions
  □ Enforce role permissions on all API routes
  □ Enforce role permissions on UI (hide/show buttons)
  □ Build draft → pending → published flow

Deliverable: Interns can't publish, supervisors review, admins manage
```

### Phase 6: Reports & i18n (Day 10)

```
Goal: Regional reports generated, bilingual support

Tasks:
  □ Build HTML report template (HK-style)
  □ Build report config page (type, region, dates)
  □ Build report preview
  □ Add CSV export
  □ Set up next-intl
  □ Create EN translations
  □ Create ZH translations
  □ Add language toggle to topbar

Deliverable: Export branded reports, switch between EN/中文
```

### Phase 7: Polish & Deploy prep (Days 11–12)

```
Goal: Production ready

Tasks:
  □ Empty states for all pages
  □ Loading skeletons
  □ Error boundaries
  □ Mobile responsiveness
  □ Accessibility pass (keyboard nav, aria labels, contrast)
  □ Docker compose for local deployment
  □ Environment variable documentation
  □ README with setup instructions
  □ Performance: query optimization, pagination
  □ Security: input sanitization, CSRF, rate limiting

Deliverable: App is polished, documented, and deployable
```

---

## 8.0 Setup & run instructions

### 8.1 Prerequisites

```
Node.js      >= 18.x
Python       >= 3.11
PostgreSQL   >= 16.x
npm          >= 9.x
uv or pip    (Python package manager)
```

### 8.2 First-time setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd lifewood-exhibition-dashboard

# 2. Start PostgreSQL (via Docker or local install)
docker compose up postgres -d

# 3. Set up the frontend
cd frontend
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL, secrets, etc.
npm install
npx prisma migrate dev --name init
npx prisma db seed    # optional: seed admin user
npm run dev            # → http://localhost:3000

# 4. Set up the scraper (in a new terminal)
cd ../scraper
cp .env.example .env
# Edit .env with your AI_API_KEY, SCRAPER_API_KEY
uv venv && source .venv/bin/activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000    # → http://localhost:8000
```

### 8.3 Daily development

```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Scraper
cd scraper && uvicorn app.main:app --reload --port 8000

# Terminal 3: Database (if using Docker)
docker compose up postgres -d

# Access:
#   App:     http://localhost:3000
#   Scraper: http://localhost:8000/docs  (FastAPI Swagger UI)
#   DB:      postgresql://localhost:5432/lifewood_exhibitions
```

### 8.4 Useful commands

```bash
# Frontend
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run ESLint
npx prisma studio        # Visual database browser
npx prisma migrate dev   # Run pending migrations
npx prisma generate      # Regenerate Prisma client

# Scraper
uvicorn app.main:app --reload    # Start with auto-reload
pytest tests/                     # Run tests
```

---

## 9.0 Git workflow

### 9.1 Branch strategy

```
main              — stable, deployable
  └── dev         — integration branch
       ├── feat/dashboard-stats
       ├── feat/event-form
       ├── feat/scraper-spiders
       ├── fix/date-parser
       └── docs/update-readme
```

### 9.2 Commit convention

```
feat:     New feature           feat: add event filter bar
fix:      Bug fix               fix: date parser handles TBA dates
docs:     Documentation         docs: update API endpoint reference
style:    Formatting only       style: fix card border radius
refactor: Code restructure      refactor: extract AI provider interface
test:     Tests                 test: add classifier unit tests
chore:    Build/tooling         chore: upgrade prisma to 5.x
```

### 9.3 PR template

```markdown
## What
Brief description of the change.

## Why
Context — what problem this solves or feature it adds.

## How
Technical approach taken.

## Testing
How this was verified.

## Screenshots
If UI changed, include before/after.
```
