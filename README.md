# ❖ Lifewood Tech Exhibition Intelligence Platform (Frontend Application)

> **Version:** 1.0.0  
> **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
> **Organization:** Lifewood Data Technology  

---

## 📖 Executive Summary & Core Purpose

The **Lifewood Tech Exhibition Intelligence Platform** is a web-based intelligence hub designed specifically for **Lifewood Data Technology**. The platform systematically crawls, extracts, classifies, scores, and manages global technology exhibitions and industrial summits relevant to Lifewood’s core business lines:

* **Global AI Data Annotation & Fine-Tuning**
* **AIGC & Generative AI Datasets**
* **Autonomous Driving (ADAS, LiDAR, Vision Data)**
* **Answer-Engine Optimization (AEO) & Generative Engine Optimization (GEO)**
* **EDGE Intelligence & Embedded Vision**
* **Global Scanning, OCR & Catalog Indexing**

The platform equips executive decision-makers, business development leaders, and data team supervisors with real-time pipeline visibility, strategic fit scoring (1.0–5.0 scale), regional coverage gap alerts, executive report generation, and role-based governance workflows.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | Next.js (App Router) | 14.2.x | SSR, React 18, Server Components & Client SPA routing |
| **Language** | TypeScript | 5.x | Strict type safety across client & API routes |
| **Styling & Icons** | Tailwind CSS + Lucide Icons | 3.4.x | Modern UI components, responsive layout & custom brand palette |
| **State & i18n** | Zustand | 4.5.x | Global client state & English (`EN`) / Simplified Chinese (`中文`) i18n |
| **Database & ORM** | Prisma ORM (SQLite / PostgreSQL) | 5.x | Database schema management, migrations, and type-safe queries |
| **Authentication** | NextAuth.js | 4.24.x | JWT session strategy, credential provider & RBAC middleware |
| **Charts & Analytics** | Recharts | 2.12.x | Bar charts, pie/donut charts & custom high-contrast tooltips |
| **Notifications** | Sonner | 1.5.x | Interactive toast notifications |

---

## ✨ Core Features & Module Breakdown

### 📊 1. Executive Intelligence Dashboard (`/dashboard`)
* **KPI Metrics Grid:** Real-time counters for Total Exhibitions, Forward Pipeline Count, Average Fit Score, and Global Region Coverage.
* **Exhibitions Distribution by Month Chart:** Interactive bar chart with time-frame dropdown filters and high-contrast hover tooltips displaying monthly exhibition numbers.
* **Business Line Distribution Chart:** Vertical horizontal bar chart mapping exhibitions across Lifewood’s 6 core offerings with numerical data labels.
* **Events by Region Doughnut Chart:** Pie visualization mapping exhibitions across APAC, North America, Europe, and Middle East.
* **Coverage Gap Assessment Widget:** Highlights months with fewer than 5 high-fit entries requiring proactive search.
* **Recently Added Exhibitions Grid:** Visual cards grid showcasing the latest 5 verified entries with enlarged, highlighted Fit Score Badges (`Score 5.0 / 5.0`).

### 🗂️ 2. Exhibition Records Catalog (`/events`)
* **Card & Table View Switcher:** Toggle between responsive visual cards grid and structured tabular views.
* **Multi-Criteria Filter Bar:** Filter exhibitions by Region, Business Line, Fit Score threshold, Priority Level, or keyword search.
* **Interactive Add Event Modal:** In-page pop-up modal attached via React Portal with smooth scale animations and full-screen backdrop overlay (`z-[99999]`).
* **Real-time Duplicate Prevention:** As users input event details, `DuplicateWarning` checks existing records to prevent duplicates.
* **Calendar Date Range Picker:** Interactive Start & End date pickers (`<input type="date">`) for intuitive date selection.

### 🔍 3. Single Event Specification & Map Details (`/events/[id]`)
* **Header & Rating Badge:** Displays record number, region tag, pricing status (`Free Entry` vs `Paid / Ticketed`), priority tag, and an enlarged, highlighted top-right Fit Score pill.
* **Google Maps Location Card:** Shows venue name, full street address (`locationAddress`), and a direct CTA button (`Open Location in Google Maps ↗`). Includes fallback badge when address is omitted.
* **Prominent Official Website CTA:** Direct high-contrast button to visit official event websites.
* **Pop-Up Edit Modal:** In-page modal allowing Admins and Supervisors to update record details without leaving the page.

### 🤖 4. AI Scraper Control Engine (`/scraper`)
* **Instant Crawler Trigger:** One-click execution calling the Python FastAPI microservice (`/api/scrape`).
* **Source Tier Selection:** Toggle search targets across Tier 1 (Official Organizers), Tier 2 (Convention Centers), and Tier 3 (Curated AI Calendars).
* **Automated Schedule Panel:** Configure daily/weekly background crawling jobs.
* **Staging Review Table:** Review extracted items, inspect AI confidence scores, and transfer accepted entries directly to the Review Queue (`/queues`).

### 📥 5. Governance & Review Queues (`/queues`)
* **Review Queue (`FOR_REVIEW`):** Holds scraped entries and intern submissions awaiting supervisor evaluation.
* **Corrections Queue (`CORRECTION`):** Tracks data correction requests for existing records.
* **Clearance Workflow:** Approving an item updates the event status to `PUBLISHED` and clears it from the active queue into History.

### 📜 6. Governance & Attendance History (`/history`)
* **Tab 1 — Queue Decisions History:** Audit log of all approved and rejected queue items. Includes a **30-Day Auto-Clear policy** (automatically hides decisions older than 30 days).
* **Tab 2 — Attended Exhibitions Log:** Permanent record of exhibitions marked for attendance or exhibition. **Never expires.**

### 👥 7. User Management & Role-Based Access Control (`/users`)
* **Role Hierarchy:**
  * **`ADMIN`:** Full access (Create/Edit/Delete Events, Manage Users & Roles, System Configs).
  * **`SUPERVISOR`:** Manage Events, Approve/Reject Queues, Access Reports & Scraper.
  * **`INTERN`:** Submit Draft Events, Trigger Scrapers, View Catalog (no delete/publish permissions).
* **Administration Interface:** Accessible from sidebar to view system accounts; Admin controls to add users, change roles, and remove accounts with password hashing.

### 📑 8. Executive Report Generator (`/reports`)
* **Report Scopes:** Regional Summaries, Business Line Coverage, or Full Database Export.
* **Branded Export Formats:** Official Lifewood HK Executive Report HTML or Raw CSV Spreadsheet dataset.
* **Live Preview:** Rendered iframe preview before file downloading.

---

## ⚡ Setup & Local Development Guide

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env.local` configuration file:
   ```bash
   cp .env.example .env.local
   ```

4. Initialize the Prisma database and seed sample data:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:3000`.*

---

## 🔑 Default User Accounts & Credentials

The seed script (`prisma/seed.ts`) populates default test accounts for each system role:

| Role | Email | Default Password | Capabilities |
|---|---|---|---|
| **Admin** | `admin@lifewood.com` | `admin123` | Full control over events, user accounts, roles, and settings. |
| **Supervisor** | `supervisor@lifewood.com` | `supervisor123` | Edit records, approve/reject review queues, export reports. |
| **Intern** | `intern@lifewood.com` | `intern123` | Submit event drafts, trigger web scraper, view catalog. |

---

## 🔒 Security & Rate Limiting

* **Password Hashing:** All user passwords are encrypted using `bcrypt.hash()` with a salt factor of 10.
* **Session Verification:** API endpoints enforce JWT session role validation (`ADMIN`, `SUPERVISOR`, `INTERN`).
* **Rate Limiting:** Scraper trigger requests are rate-limited (`/api/scraper/run`, max 10 requests/hour per user) via `lib/rate-limit.ts`.

---

## 🛡️ License

Copyright © 2026 **Lifewood Data Technology**. All rights reserved.
