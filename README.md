# ❖ Lifewood Tech Exhibition Intelligence Platform (Full-Stack Application)

> **Version:** 1.0.0  
> **Platform:** Full-Stack Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma ORM + NextAuth.js  
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

Follow these steps to run the complete platform locally on your machine.

### 📋 Prerequisites
- **Node.js**: Version `18.17.0` or higher (`node -v`)
- **npm**: Version `9.x` or higher (`npm -v`)
- **Git** installed on your system

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Zycheee/TechExhebitionDashboard.git
cd TechExhebitionDashboard
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables (`.env.example` vs `.env` / `.env.local`)

This repository includes a template file named **`.env.example`** with all the required configuration keys.

> **💡 What is `.env.example`?**  
> It is an intentionally committed blueprint showing every environment variable the platform needs. It contains placeholder values so that you know what keys to configure without exposing any private API tokens to Git.

Create your local environment files from `.env.example`:

```bash
# For Next.js (Dashboard frontend & API routes)
cp .env.example .env.local

# For the Crawler Microservice (Express engine on port 5000)
cp .env.example .env
```

*Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are present to avoid NextAuth `Configuration 500` errors:*
```env
NEXTAUTH_SECRET="lifewood-secret-key-super-secure-2026"
NEXTAUTH_URL="http://localhost:3000"
```

Open `.env` (or `.env.local`) and configure your optional API keys for web scraping:
- **`APIFY_TOKEN`**: *(Optional)* Required to discover real exhibition URLs using Apify Google Search scraper. [Get an Apify token](https://console.apify.com/account#/integrations).
- **`GEMINI_API_KEY`**: *(Optional)* Required for AI-powered event extraction, normalization, and fit scoring. [Get a free Gemini API key](https://aistudio.google.com/app/apikey).
- **`NEXTAUTH_SECRET`**: Set to any random secret string for session encryption.

*(Note: If you do not provide Apify or Gemini keys, you can still use the full dashboard, view events, manage users, queues, and review cached scraped data!)*

### 4️⃣ Initialize Database & Seed Default Data
The platform uses **SQLite** (`prisma/dev.db`) by default for local development, so **no external database server is required**.

```bash
# Push Prisma schema to SQLite dev.db
npx prisma db push

# Seed default user accounts and initial demo exhibitions
npx prisma db seed
```

### 5️⃣ Run the Application

The platform consists of two services:
1. **Next.js Web Application** (Dashboard, UI, Authentication, Queue & Event Management on port `3000`)
2. **AI Crawler Microservice** (Express, Apify + Gemini extraction pipeline on port `5000`)

#### Terminal 1 — Start Next.js App:
```bash
npm run dev
```
*The application will be available at `http://localhost:3000`.*  
*(Note: If you just created or updated your `.env` file, make sure to stop (`Ctrl + C`) and restart `npm run dev` so Next.js reloads the environment variables).*

#### Terminal 2 — Start AI Discovery & Crawler Engine (Optional for live crawling):
```bash
npm run crawler
```
*Runs the background crawling microservice engine on port 5000 (`http://localhost:5000`) for live web searches, real-time SSE extraction, and crawler caching.*

### 6️⃣ Build for Production
```bash
npm run build
```

---

## 🔑 Default User Accounts & Credentials

The seed script (`prisma/seed.ts`) populates default test accounts for each system role:

| Role | Email | Default Password | Capabilities |
|---|---|---|---|
| **Admin** | `admin@lifewood.com` | `admin123` | Full control over events, user accounts, roles, and settings. |
| **Supervisor** | `supervisor@lifewood.com` | `supervisor123` | Edit records, approve/reject review queues, export reports. |
| **Intern** | `intern@lifewood.com` | `intern123` | Submit event drafts, trigger web scraper, view catalog. |

---

## 🛠️ Common Troubleshooting & FAQ

<details>
<summary><b>Q: I see "Failed to reach Crawling Engine on port 5000" in the scraper tab.</b></summary>

The live web scraper runs as a microservice on port 5000. Open a second terminal window and run:
```bash
npm run crawler
```
If you only run `npm run dev`, you can still view previously cached events and test manual event additions without running the crawler.
</details>

<details>
<summary><b>Q: How do I reset the local database?</b></summary>

To wipe and re-seed the SQLite database:
```bash
npx prisma db push --force-reset
npx prisma db seed
```
</details>

<details>
<summary><b>Q: Why was `.env` tracked in git earlier?</b></summary>

An initial commit included a blank `.env` with empty keys (`PORT=5000`, `APIFY_TOKEN=`, `GEMINI_API_KEY=`). `.gitignore` has now been updated to ensure that all local `.env` and `.env*.local` files containing your private API keys remain strictly local and are never committed.
</details>

---

## 🔒 Security & Rate Limiting

* **Password Hashing:** All user passwords are encrypted using `bcrypt.hash()` with a salt factor of 10.
* **NextAuth & JWT Encryption:** NextAuth handles JWT session tokens signed using `NEXTAUTH_SECRET` (configured in `.env` and `src/lib/auth.ts`).
* **Session Verification:** API endpoints enforce JWT session role validation (`ADMIN`, `SUPERVISOR`, `INTERN`).
* **Environment Protection:** `.env` and `.env*.local` are ignored to prevent credential leakage.

---

## 🛡️ License

Copyright © 2026 **Lifewood Data Technology**. All rights reserved.
