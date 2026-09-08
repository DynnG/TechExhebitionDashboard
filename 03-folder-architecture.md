# 03 — Folder Architecture
# Tech Exhibition Dashboard — Lifewood Data Technology

> **Version:** 1.0  
> **Date:** September 7, 2026  
> **Status:** Active

---

## 1.0 Project root

```
lifewood-exhibition-dashboard/
│
├── docs/                              # ← YOU ARE HERE (documentation)
│   ├── 01-ui-ux-design-spec.md
│   ├── 02-prompt-techstack-spec.md
│   ├── 03-folder-architecture.md
│   └── 04-workflow.md
│
├── frontend/                          # Next.js 14 application
│   └── (see §2.0 below)
│
├── scraper/                           # Python FastAPI scraper service
│   └── (see §3.0 below)
│
├── .github/                           # CI/CD workflows (future)
│   └── workflows/
│       └── deploy.yml
│
├── docker-compose.yml                 # Orchestrates frontend + scraper + postgres
├── .gitignore
├── README.md
└── LICENSE
```

---

## 2.0 Frontend (Next.js 14)

```
frontend/
│
├── public/                            # Static assets
│   ├── fonts/
│   │   ├── Manrope-Regular.woff2
│   │   ├── Manrope-Medium.woff2
│   │   ├── Manrope-SemiBold.woff2
│   │   └── AlimamaShuhei-Bold.woff2
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── lifewood-diamond.svg       # Diamond icon only
│   │   └── lifewood-logo.svg          # Full wordmark + diamond
│   └── images/
│       └── empty-state.svg            # Illustration for empty states
│
├── prisma/                            # Database schema & migrations
│   ├── schema.prisma                  # Main schema (all models)
│   ├── migrations/                    # Auto-generated migration files
│   │   └── 20260907_init/
│   │       └── migration.sql
│   └── seed.ts                        # Optional seed data for development
│
├── src/
│   │
│   ├── app/                           # Next.js App Router (pages & layouts)
│   │   │
│   │   ├── layout.tsx                 # Root layout (sidebar + header + providers)
│   │   ├── page.tsx                   # Redirect → /dashboard
│   │   ├── globals.css                # Tailwind base + brand CSS variables
│   │   │
│   │   ├── (auth)/                    # Auth route group (no sidebar)
│   │   │   ├── layout.tsx             # Auth-specific layout (centered, no nav)
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Login page
│   │   │   └── register/
│   │   │       └── page.tsx           # Register page (Admin-invite only)
│   │   │
│   │   ├── (app)/                     # Main app route group (with sidebar)
│   │   │   ├── layout.tsx             # App layout (sidebar + topbar + content)
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           # Dashboard home — stats, charts, gaps
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── page.tsx           # Events list — table + card views, filters
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx       # Event detail — full card view
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx       # Add event form (27 fields)
│   │   │   │   └── [id]/edit/
│   │   │   │       └── page.tsx       # Edit event form
│   │   │   │
│   │   │   ├── scraper/
│   │   │   │   ├── page.tsx           # Scraper control panel — config, trigger, results
│   │   │   │   └── results/
│   │   │   │       └── page.tsx       # Scrape results review — accept/reject
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   └── page.tsx           # Report generator — select type, preview, download
│   │   │   │
│   │   │   ├── queues/
│   │   │   │   └── page.tsx           # Review + corrections queues
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── page.tsx           # General settings
│   │   │       ├── users/
│   │   │       │   └── page.tsx       # User management (Admin)
│   │   │       └── scraper/
│   │   │           └── page.tsx       # Scraper schedule config (Admin)
│   │   │
│   │   └── api/                       # API Routes (backend)
│   │       │
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts       # NextAuth handler
│   │       │
│   │       ├── events/
│   │       │   ├── route.ts           # GET (list) + POST (create)
│   │       │   ├── [id]/
│   │       │   │   └── route.ts       # GET (single) + PUT (update) + DELETE
│   │       │   └── search/
│   │       │       └── route.ts       # GET — duplicate search endpoint
│   │       │
│   │       ├── dashboard/
│   │       │   ├── stats/
│   │       │   │   └── route.ts       # GET — aggregate statistics
│   │       │   └── gaps/
│   │       │       └── route.ts       # GET — coverage gap analysis
│   │       │
│   │       ├── scraper/
│   │       │   ├── run/
│   │       │   │   └── route.ts       # POST — trigger scrape (proxy to Python)
│   │       │   ├── status/
│   │       │   │   └── route.ts       # GET — scraper status
│   │       │   ├── results/
│   │       │   │   └── route.ts       # GET — fetch results
│   │       │   ├── accept/
│   │       │   │   └── route.ts       # POST — accept scraped event
│   │       │   ├── reject/
│   │       │   │   └── route.ts       # POST — reject scraped event
│   │       │   └── schedule/
│   │       │       └── route.ts       # GET + PUT — schedule config
│   │       │
│   │       ├── queues/
│   │       │   ├── route.ts           # GET (list) + POST (submit)
│   │       │   └── [id]/
│   │       │       └── route.ts       # PUT (approve/reject)
│   │       │
│   │       ├── reports/
│   │       │   ├── generate/
│   │       │   │   └── route.ts       # POST — generate report
│   │       │   └── [id]/
│   │       │       └── route.ts       # GET — download report
│   │       │
│   │       └── users/
│   │           ├── route.ts           # GET (list) + POST (create)
│   │           └── [id]/
│   │               └── route.ts       # PUT + DELETE
│   │
│   ├── components/                    # Reusable React components
│   │   │
│   │   ├── ui/                        # shadcn/ui base components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── command.tsx            # cmdk command palette
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   └── switch.tsx
│   │   │
│   │   ├── layout/                    # Layout components
│   │   │   ├── sidebar.tsx            # Main nav sidebar (Dark Serpent bg)
│   │   │   ├── topbar.tsx             # Top bar (breadcrumbs, actions, lang toggle)
│   │   │   ├── mobile-nav.tsx         # Mobile hamburger menu
│   │   │   └── footer.tsx             # App footer
│   │   │
│   │   ├── dashboard/                 # Dashboard-specific components
│   │   │   ├── stat-card.tsx          # Single stat card (number + label)
│   │   │   ├── events-by-month.tsx    # Bar chart — events per month
│   │   │   ├── events-by-region.tsx   # Donut chart — region distribution
│   │   │   ├── business-line-chart.tsx# Horizontal bar — business line dist.
│   │   │   ├── fit-score-chart.tsx    # Pie chart — fit score distribution
│   │   │   ├── coverage-gaps.tsx      # Gap analysis widget
│   │   │   ├── recent-events.tsx      # Recently added list
│   │   │   └── scraper-status.tsx     # Scraper mini-status widget
│   │   │
│   │   ├── events/                    # Event-specific components
│   │   │   ├── event-card.tsx         # Event card (matching HK report style)
│   │   │   ├── event-table.tsx        # Data table with sorting/pagination
│   │   │   ├── event-filters.tsx      # Filter bar (region, BL, fit, etc.)
│   │   │   ├── event-detail.tsx       # Full event detail view
│   │   │   ├── event-form.tsx         # Add/edit event form (27 fields)
│   │   │   ├── field-group.tsx        # Form section (Group A/B/C/D/E)
│   │   │   ├── fit-score-badge.tsx    # Fit score display (colored square)
│   │   │   ├── priority-indicator.tsx # Priority dot + label
│   │   │   ├── business-line-chip.tsx # Business line pill/chip
│   │   │   ├── duplicate-warning.tsx  # Duplicate detection warning bar
│   │   │   └── view-toggle.tsx        # Table ↔ Card view switcher
│   │   │
│   │   ├── scraper/                   # Scraper-specific components
│   │   │   ├── scraper-config.tsx     # Config panel (regions, BL, dates)
│   │   │   ├── scraper-progress.tsx   # Running status + progress bar
│   │   │   ├── scrape-result-row.tsx  # Single result row (accept/reject)
│   │   │   └── schedule-config.tsx    # Auto-schedule toggle + frequency
│   │   │
│   │   ├── reports/                   # Report-specific components
│   │   │   ├── report-config.tsx      # Report type/region/date selector
│   │   │   └── report-preview.tsx     # Live preview of generated report
│   │   │
│   │   ├── queues/                    # Queue-specific components
│   │   │   ├── queue-table.tsx        # Queue items list
│   │   │   └── queue-action.tsx       # Approve/reject/edit actions
│   │   │
│   │   └── shared/                    # Shared/generic components
│   │       ├── data-table.tsx         # Generic data table wrapper
│   │       ├── page-header.tsx        # Page title + description + actions
│   │       ├── empty-state.tsx        # Empty state with illustration
│   │       ├── loading-skeleton.tsx   # Skeleton loader
│   │       ├── confirm-dialog.tsx     # Confirmation modal
│   │       ├── search-input.tsx       # Search input with debounce
│   │       └── lang-toggle.tsx        # EN/中文 language switcher
│   │
│   ├── lib/                           # Utility libraries & business logic
│   │   │
│   │   ├── db.ts                      # Prisma client singleton
│   │   ├── auth.ts                    # NextAuth configuration
│   │   ├── utils.ts                   # General utilities (cn, formatDate, etc.)
│   │   │
│   │   ├── ai/                        # AI provider abstraction
│   │   │   ├── provider.ts            # Interface + factory function
│   │   │   ├── openai.ts              # OpenAI implementation
│   │   │   ├── anthropic.ts           # Anthropic implementation
│   │   │   ├── google.ts              # Google Gemini implementation
│   │   │   └── local.ts              # Local model implementation (Ollama)
│   │   │
│   │   ├── validations/               # Zod schemas
│   │   │   ├── event.ts               # Event create/update schemas
│   │   │   ├── scraper.ts             # Scraper config schemas
│   │   │   ├── queue.ts               # Queue item schemas
│   │   │   └── user.ts                # User create/update schemas
│   │   │
│   │   ├── constants/                 # App constants
│   │   │   ├── business-lines.ts      # 6 business lines + keywords
│   │   │   ├── regions.ts             # Region list
│   │   │   ├── fit-scores.ts          # Fit score rubric
│   │   │   └── participation.ts       # Participation recommendation options
│   │   │
│   │   └── reports/                   # Report generation logic
│   │       ├── html-template.ts       # HTML report template (HK-style)
│   │       └── csv-export.ts          # CSV export utility
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── use-events.ts              # Event data fetching & caching
│   │   ├── use-dashboard.ts           # Dashboard stats fetching
│   │   ├── use-scraper.ts             # Scraper status polling
│   │   ├── use-debounce.ts            # Debounced value hook
│   │   └── use-duplicate-check.ts     # Duplicate detection hook
│   │
│   ├── stores/                        # Zustand state stores
│   │   ├── filter-store.ts            # Event filter state (persisted)
│   │   ├── view-store.ts              # Table/card view preference
│   │   └── locale-store.ts            # Language preference
│   │
│   ├── i18n/                          # Internationalization
│   │   ├── config.ts                  # next-intl configuration
│   │   └── messages/
│   │       ├── en.json                # English translations
│   │       └── zh.json                # Chinese (Simplified) translations
│   │
│   └── types/                         # TypeScript type definitions
│       ├── event.ts                   # Event types & interfaces
│       ├── scraper.ts                 # Scraper types
│       ├── dashboard.ts               # Dashboard stat types
│       ├── queue.ts                    # Queue types
│       ├── user.ts                    # User & auth types
│       └── api.ts                     # API response types
│
├── .env.local                         # Environment variables (not committed)
├── .env.example                       # Environment template
├── .eslintrc.json                     # ESLint config
├── .prettierrc                        # Prettier config
├── next.config.js                     # Next.js config
├── tailwind.config.ts                 # Tailwind + Lifewood brand tokens
├── tsconfig.json                      # TypeScript config
├── postcss.config.js                  # PostCSS config
├── components.json                    # shadcn/ui config
├── package.json
└── package-lock.json
```

---

## 3.0 Scraper (Python FastAPI)

```
scraper/
│
├── app/
│   │
│   ├── main.py                        # FastAPI app entry point
│   ├── config.py                      # Settings (from .env + yaml)
│   │
│   ├── api/                           # API endpoints
│   │   ├── __init__.py
│   │   ├── routes.py                  # POST /scrape, GET /status, GET /results
│   │   └── dependencies.py            # Auth middleware (API key check)
│   │
│   ├── spiders/                       # Scrapy spiders (one per source type)
│   │   ├── __init__.py
│   │   ├── base_spider.py             # Base spider class with shared logic
│   │   ├── organizer_spider.py        # Crawl organizer portfolio pages
│   │   ├── venue_calendar_spider.py   # Crawl convention center calendars
│   │   ├── curated_list_spider.py     # Crawl curated event calendar sites
│   │   └── official_site_spider.py    # Crawl individual official event sites
│   │
│   ├── extractors/                    # Data extraction & normalization
│   │   ├── __init__.py
│   │   ├── event_extractor.py         # Parse HTML → raw event dict
│   │   ├── date_parser.py             # Normalize dates → standard format
│   │   └── location_parser.py         # Normalize city/country/region
│   │
│   ├── ai/                            # AI classification & extraction
│   │   ├── __init__.py
│   │   ├── classifier.py              # Business line classification + fit scoring
│   │   ├── field_filler.py            # Auto-fill basic event fields
│   │   ├── deduplicator.py            # Fuzzy name/acronym duplicate matching
│   │   └── prompts/
│   │       ├── classifier_prompt.txt  # Event classifier prompt template
│   │       ├── extractor_prompt.txt   # Field extractor prompt template
│   │       └── dedup_prompt.txt       # Duplicate detector prompt template
│   │
│   ├── models/                        # Pydantic data models
│   │   ├── __init__.py
│   │   ├── event.py                   # RawEvent, ProcessedEvent, ScrapeResult
│   │   ├── config.py                  # ScrapeConfig, ScheduleConfig
│   │   └── response.py               # API response models
│   │
│   ├── services/                      # Business logic services
│   │   ├── __init__.py
│   │   ├── scrape_service.py          # Orchestrates full scrape pipeline
│   │   ├── scheduler_service.py       # APScheduler integration
│   │   └── db_service.py              # Check existing events (via Next.js API)
│   │
│   └── utils/                         # Utilities
│       ├── __init__.py
│       ├── logger.py                  # Structured logging
│       └── rate_limiter.py            # Polite crawling (delays, robots.txt)
│
├── config/                            # Configuration files
│   ├── sources.yaml                   # URL list by source tier (see §5.2 in doc 02)
│   ├── business_lines.yaml            # Business line keywords & signals
│   └── regions.yaml                   # Region → country mapping
│
├── tests/                             # Python tests
│   ├── test_extractors.py
│   ├── test_classifier.py
│   ├── test_deduplicator.py
│   └── test_date_parser.py
│
├── .env                               # Python env vars (not committed)
├── .env.example                       # Template
├── requirements.txt                   # Python dependencies
├── Dockerfile                         # Container for scraper service
└── scrapy.cfg                         # Scrapy project config
```

---

## 4.0 File naming conventions

| Type | Convention | Example |
|---|---|---|
| **Pages** | `page.tsx` (Next.js convention) | `events/page.tsx` |
| **Components** | `kebab-case.tsx` | `event-card.tsx` |
| **Hooks** | `use-kebab-case.ts` | `use-events.ts` |
| **Stores** | `kebab-case-store.ts` | `filter-store.ts` |
| **Types** | `kebab-case.ts` | `event.ts` |
| **Utilities** | `kebab-case.ts` | `date-parser.py` |
| **API routes** | `route.ts` (Next.js convention) | `api/events/route.ts` |
| **Python modules** | `snake_case.py` | `event_extractor.py` |
| **Config files** | `kebab-case.yaml` | `business-lines.yaml` |
| **Docs** | `NN-kebab-case.md` | `01-ui-ux-design-spec.md` |

---

## 5.0 Key file responsibilities

| File | What it does |
|---|---|
| `src/app/layout.tsx` | Root layout — wraps everything in providers (auth, i18n, theme) |
| `src/app/(app)/layout.tsx` | App shell — sidebar + topbar + main content area |
| `src/lib/db.ts` | Single Prisma client instance (prevents connection leaks) |
| `src/lib/auth.ts` | NextAuth config — credentials provider, role in session |
| `src/lib/ai/provider.ts` | AI abstraction — swap providers without changing app code |
| `src/lib/constants/business-lines.ts` | Lifewood's 6 business lines with keywords (source of truth) |
| `src/lib/reports/html-template.ts` | Generates HK-style branded HTML reports |
| `prisma/schema.prisma` | Database schema — all 27 event fields + users + queues |
| `scraper/app/main.py` | FastAPI entry — receives scrape requests, returns results |
| `scraper/app/services/scrape_service.py` | Pipeline orchestrator — crawl → extract → classify → dedupe |
| `scraper/config/sources.yaml` | All URLs the scraper crawls, organized by tier |
| `docker-compose.yml` | One command to run everything — frontend + scraper + postgres |

---

## 6.0 Docker compose (development)

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: lifewood
      POSTGRES_PASSWORD: lifewood_dev
      POSTGRES_DB: lifewood_exhibitions
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://lifewood:lifewood_dev@postgres:5432/lifewood_exhibitions"
      SCRAPER_API_URL: "http://scraper:8000"
    depends_on:
      - postgres

  scraper:
    build: ./scraper
    ports:
      - "8000:8000"
    environment:
      SCRAPER_API_KEY: "${SCRAPER_API_KEY}"
      AI_PROVIDER: "${AI_PROVIDER}"
      AI_API_KEY: "${AI_API_KEY}"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## 7.0 What goes where — decision guide

| "I need to..." | Where to put it |
|---|---|
| Add a new page | `src/app/(app)/your-page/page.tsx` |
| Add a reusable UI component | `src/components/ui/` (shadcn) or `src/components/shared/` |
| Add a page-specific component | `src/components/your-feature/` |
| Add an API endpoint | `src/app/api/your-endpoint/route.ts` |
| Add a new database model | `prisma/schema.prisma` → run `prisma migrate dev` |
| Add form/API validation | `src/lib/validations/` |
| Add a constant (business line, region) | `src/lib/constants/` |
| Add a scraper source | `scraper/config/sources.yaml` |
| Add a new spider | `scraper/app/spiders/` |
| Add a new AI prompt | `scraper/app/ai/prompts/` |
| Add translations | `src/i18n/messages/en.json` + `zh.json` |
| Add a custom hook | `src/hooks/` |
| Add global state | `src/stores/` |
| Add TypeScript types | `src/types/` |
