# Lifewood Tech Exhibition Intelligence Platform
## UI/UX Engineering Specification & 4-Person Work Breakdown

**Document Version:** 1.0.0  
**Target Platform:** Lifewood Tech Exhibition Dashboard  
**Date:** September 2026  
**Primary Brand Colors:**
* **Dark Serpent:** `#133020` (Headers, Primary Anchors, High Contrast Cards)
* **Lifewood Emerald:** `#046241` (Action Accents, Badges, Hover Highlights)
* **Warm Saffron:** `#FFB347` / `#FFC370` (Primary CTAs & Key Buttons)
* **Parchment:** `#F5EEDB` (Subtle Card Backgrounds, Hover Fills)
* **Off-White / Surface:** `#F9F7F7` & `#FFFFFF` (Base Canvases, High Density Cards)
* **Warm Border:** `#D8D2C8` (Hairline Dividers & Card Outlines)

---

## 🗺️ Team Workload Matrix

```
┌──────────────────────────────────────┬──────────────────────────────────────┐
│ 👤 PERSON 1: SHELL & AUTHENTICATION  │ 👤 PERSON 2: DASHBOARD & ANALYTICS   │
│ • Expanding Language Selector Hover  │ • Remove AI Scraper Engine Button    │
│ • Login Page: 0-Scroll Laptop Layout │ • Bento Height & Baseline Alignment  │
│ • Login Card: Logo Top-Left Placement│ • Month Calendar: Icon & From/To Badges│
│ • Remove "Forgot Password" Link      │ • Coverage Gap Card: Remove Run & Sync│
│ • Global Lifewood Green Theme Polish │ • Remove "+ Add new record" Button   │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 👤 PERSON 3: EVENTS & ENGINE         │ 👤 PERSON 4: OPERATIONS & WORKFLOW   │
│ • Scraper: Remove Mode Switcher Bar  │ • Queues: Redesign "Queue is clear"  │
│ • Scraper: Remove (Batch 11) & Tag   │ • Queues: Remove Corrections Queue   │
│ • Rename CTA to "Start Scraping"     │ • History: Unify Log & Decision Look │
│ • Sync Crawler State to Dashboard    │ • Reports: Interactive HTML (Cards/Table)│
│ • Events Grid: Strict Row Alignment  │ • Settings: Bold Editorial Overhaul  │
│ • Remove Dot next to Fit Score       │                                      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 👤 Person 1: Shell, Navigation & Authentication Specialist

### Scope
Header interactions, authentication responsive constraints, branding lockups, and design system color contrast.

### Detailed Requirements:
1. **Header — Expanding Language Selector Button:**
   * **Default State:** Collapsed into an elegant, round icon button showing only the Globe icon with Lifewood Emerald/Dark Serpent styling (`#133020` with `#046241` accents).
   * **Hover Interaction:** On hover, rotate/pulse the globe icon and smoothly expand the pill horizontally (`framer-motion` spring animation) to reveal `EN` | `中文` options.
   * **Mouse Leave:** Collapse back to the compact globe button smoothly.
2. **Login Screen — Single-Screen (No Scroll) Responsive Layout:**
   * Constrain viewport height so users on standard 1080p and 1366×768 laptop resolutions do not need to scroll (`h-screen overflow-hidden` or `max-h-screen`).
   * Compact spacing, input padding (`py-2.5`), and editorial typewriter margins.
3. **Login Card — Logo Placement:**
   * Position the official Lifewood logo lockup (`Logo 2.png`) directly at the **top-left** inside the login form card.
4. **Login Card — Link Removal:**
   * Remove the **"Forgot password?"** text and link completely from the form.
5. **Overall Color Scheme & Contrast:**
   * Audit all headings, buttons, and badges to ensure the dark green (`#133020`) and emerald (`#046241`) are properly applied with balanced saffron (`#FFB347`) accents.

### Target Files:
* `src/components/shared/lang-toggle.tsx`
* `src/components/layout/topbar.tsx`
* `src/app/(auth)/login/page.tsx`
* `src/components/ui/LoginForm.tsx`
* `tailwind.config.ts`

---

## 👤 Person 2: Dashboard & Analytics Specialist

### Scope
Dashboard layout geometry, bento grid alignment, date horizon clarity, and gap intelligence syncing.

### Detailed Requirements:
1. **Header Action Cleanup:**
   * Remove the **"AI Scraper Engine"** button from the top dashboard action bar.
2. **Bento Grid Alignment:**
   * Fix the layout structure so the **"Events by region"** card perfectly aligns with the bottom baseline of the **"Exhibition distribution by month"** card (`h-full flex flex-col` in the 8/4 grid layout).
3. **Exhibition Distribution by Month (Calendar View Refactoring):**
   * Replace redundant repetitive text entries inside the month calendar date cells with a clean, single status icon.
   * Add prominent and clear **'From'** and **'To'** date horizon labels/badges to clarify the active date range.
4. **Coverage Gap Assessment Card Overhaul & Real-Time Sync:**
   * Remove the **"Run scraper"** button from the top of the card.
   * Remove the text `"Automated scraper pipeline active"` and the icon beside it.
   * **Data Synchronization:** Ensure the metrics and regional/business line sub-cards are dynamically calculated from real events in the intelligence database (`/api/dashboard/stats`).
5. **Recently Added Exhibitions Card:**
   * Remove the **"+ Add new record"** button/link from the card footer.
6. **Brand Color Elevation:**
   * Incorporate Lifewood emerald greens (`#046241`, `#133020`) into chart legends, progress bars, and card headers.

### Target Files:
* `src/app/(app)/dashboard/page.tsx`
* `src/components/dashboard/events-by-month.tsx`
* `src/components/dashboard/events-by-region.tsx`
* `src/components/dashboard/coverage-gaps.tsx`
* `src/app/api/dashboard/stats/route.ts`

---

## 👤 Person 3: Event Engine & Pipeline Specialist

### Scope
Scraper interface simplification, cross-component crawler synchronization, catalog card alignment, and score badge cleanups.

### Detailed Requirements:
1. **Scraper Engine UI Simplification:**
   * Remove the mode selector tabs: **"Internal Crawler & Scheduler"** and **"Apify + Google Gemini Engine (Batch 11 Spec)"**.
   * Retain solely the single **"Tech exhibition discovery engine"** interface container.
   * In the main discovery card header:
     * Remove the `(Batch 11)` text from the title.
     * Remove the tag/badge and icon: `"Real-Time Stream · Apify + Gemini 2.5 Flash"`.
   * Rename the primary CTA button from **"Start discover & crawl"** to **"Start Scraping"**.
2. **Scraper Engine ↔ Dashboard Status Synchronization:**
   * Wire the **"AI discovery & scraper engine status"** card on the main dashboard to the live crawler state (`/api/scraper/status` or shared store) so that every scraper run is reflected immediately on the dashboard.
3. **Events Page — Card Alignment:**
   * Ensure all event cards in grid view have identical heights and aligned internal elements:
     * Clamp event titles uniformly (`line-clamp-2` with minimum height).
     * Fix metadata positions (region, dates, city/country) to uniform vertical baselines.
4. **Fit Score Badge Polish:**
   * Remove the colored dot indicator next to the Fit Score text (keep the clean score pill, e.g., `Fit 4.5 / 5.0`).

### Target Files:
* `src/app/(app)/scraper/page.tsx`
* `src/components/events/EventScraperDashboard.tsx`
* `src/components/dashboard/scraper-status-widget.tsx`
* `src/app/(app)/events/page.tsx`
* `src/components/events/event-card.tsx`
* `src/components/events/fit-score-badge.tsx`

---

## 👤 Person 4: Operations, Workflow & Export Specialist

### Scope
Queue aesthetics, unified history logs, interactive client-side report exports, and an editorial settings redesign.

### Detailed Requirements:
1. **Queues Screen — Elegant Empty State & Context Cleanup:**
   * Remove the **"Corrections Queue (Data Edits)"** tab/button and its entire context container.
   * **Redesign "Queue is clear":**
     * Significantly enlarge the empty state card to feel premium and intentional.
     * Add an elegant Lifewood-themed illustration/icon with subtle emerald ambient glow.
     * Refined messaging: *"All Exhibition Records Reviewed"* with metadata summary pills (`0 Pending Approval · Database Synchronized`).
2. **History Screen — Unified Design:**
   * Unify the visual design of **"Queue Decision"** and **"Attended Exhibitions Log"** so both tabs share identical card styling, field layouts, typography, and detail modal format.
3. **Reports Screen — Interactive Standalone HTML Export:**
   * Overhaul the exported `.html` file:
     * Include comprehensive summaries and full 27-column event dossiers.
     * **Interactive View Switcher:** Embed a client-side JavaScript toggle directly inside the standalone HTML allowing the viewer to switch effortlessly between **Card Form** and **Table Form**.
     * Style with Lifewood executive print & web typography (`#133020`, `#046241`, `#FFB347`).
4. **Settings Screen — Editorial Bento Redesign ("Go Wild"):**
   * Completely overhaul settings into a high-end, visual editorial dashboard:
     * User Profile & Access Control Card.
     * Scraper API Key Management Card (with masked inputs and latency test).
     * Platform Preferences (Theme, Language, Refresh Cadence).
     * System Diagnostics & Cache Management Card.

### Target Files:
* `src/app/(app)/queues/page.tsx`
* `src/app/(app)/history/page.tsx`
* `src/app/api/reports/generate/route.ts`
* `src/app/(app)/reports/page.tsx`
* `src/app/(app)/settings/page.tsx`

---

## 🚀 Recommended Sprint Schedule

| Sprint | Person 1 | Person 2 | Person 3 | Person 4 |
|---|---|---|---|---|
| **Sprint 1 (Quick Wins)** | Hover Lang Selector + Login Card Logo & Spacing | Dashboard button cleanup + Recently Added card | Scraper UI button & tag cleanups + Fit score dot | Queue empty card redesign + Remove Corrections button |
| **Sprint 2 (Layout & Sync)** | Login no-scroll viewport + Brand contrast check | Bento grid alignment + Gap card cleanup | Events card row alignment | History tab unification |
| **Sprint 3 (Deep Features)** | Final review of theme consistency across shell | Month calendar icon & From/To date badges | Scraper ↔ Dashboard real-time status sync | Interactive HTML Report (Cards/Table) + Settings overhaul |

---

## ✅ Shared Quality Gate (Definition of Done)
* Every PR must pass `npm run build` with **0 errors**.
* Colors must adhere to the Lifewood branding guidelines (`#133020`, `#046241`, `#FFB347`, `#F5EEDB`, `#F9F7F7`, `#D8D2C8`).
* Bilingual translations (`en` and `zh`) must be preserved in all modified text strings via `useLocaleStore`.
