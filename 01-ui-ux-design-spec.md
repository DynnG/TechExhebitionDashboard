# 01 — UI/UX Design Specification
# Tech Exhibition Dashboard — Lifewood Data Technology

> **Version:** 1.0  
> **Date:** September 7, 2026  
> **Status:** Active  
> **Applies to:** All frontend pages, components, and exported reports

---

## 1.0 Design philosophy

**Function over form.** Every element earns its place by helping a user find, evaluate, or enter an exhibition record faster. Decoration that doesn't serve clarity gets removed.

> "Design is not just about how things look. It's about how they make you feel, how they solve problems, and how they inspire connection and innovation."  
> — Lifewood Design Team

---

## 2.0 Brand alignment

This app follows the **Lifewood Brand Style Guide 2024**. All colors, typefaces, and layout rules below are derived from that guide.

---

## 3.0 Color system

### 3.1 Primary palette

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--bg-paper` | Paper | `#F5EEDB` | Primary page background |
| `--bg-white` | White | `#FFFFFF` | Card backgrounds, form fields |
| `--bg-light` | Sea Salt | `#F9F7F7` | Secondary light backgrounds, table hover |
| `--bg-dark` | Dark Serpent | `#133020` | Header, sidebar, dark sections, primary text on light bg |
| `--green-accent` | Castleton Green | `#046241` | Secondary green, links, active states |
| `--accent` | Saffron | `#FFB347` | CTA buttons, highlights, badges, active filters |
| `--accent-soft` | Earth Yellow | `#FFC370` | Secondary accent, hover states on saffron elements |

### 3.2 Secondary palette (charts, diagrams, icons only)

```
Warm tones:  #C17110  #E89131  #FFB347  #FFC370  #F4D0A4
Green tones: #133020  #034E34  #417256  #708E7C  #9CAFA4
Neutrals:    #666666  #999999  #CCCCCC  #E6E6E6  #FFFFFF
```

### 3.3 Semantic colors

| Token | Hex | Usage |
|---|---|---|
| `--fit-5` | `#133020` | Fit score 5 badge (Dark Serpent) |
| `--fit-4` | `#046241` | Fit score 4 badge (Castleton Green) |
| `--fit-3` | `#708E7C` | Fit score 3 badge (muted green) |
| `--priority-high` | `#C17110` | High priority indicator |
| `--priority-medium` | `#FFB347` | Medium priority indicator |
| `--priority-low` | `#9CAFA4` | Low priority indicator |
| `--success` | `#046241` | Success toasts, valid fields |
| `--error` | `#B91C1C` | Error states, destructive actions |
| `--warning` | `#E89131` | Warnings, pending states |

### 3.4 Color rules

- **Backgrounds:** Paper (`#F5EEDB`) or White only for main content areas. Dark Serpent for header/sidebar/contrast sections.
- **Text:** Dark Serpent on light backgrounds. White or Paper on dark backgrounds. Never other colors for body text.
- **Saffron:** CTA buttons and highlights only. Never placed on top of colored backgrounds — only on White, Paper, or Sea Salt.
- **Charts:** Use the secondary palette. Start with warm tones for primary data, green tones for secondary, neutrals for gridlines/labels.

---

## 4.0 Typography

### 4.1 Typefaces

| Context | Typeface | Weight | Fallback |
|---|---|---|---|
| Headlines / Display | Manrope | Semibold (600) | system-ui, sans-serif |
| Subtitles / Accents | Manrope | Medium (500) | system-ui, sans-serif |
| Body text | Manrope | Regular (400) | system-ui, sans-serif |
| Chinese headlines | Alimama ShuHeiTi | Bold | Microsoft YaHei, sans-serif |
| Chinese body | Microsoft YaHei | Regular | PingFang SC, sans-serif |

### 4.2 Size scale

| Token | Size | Line height | Usage |
|---|---|---|---|
| `--text-display` | 36px | 1.15 | Page titles ("Dashboard", "Events") |
| `--text-h1` | 28px | 1.2 | Section headings |
| `--text-h2` | 22px | 1.25 | Card titles, subsection headings |
| `--text-h3` | 18px | 1.3 | Widget titles, form group labels |
| `--text-body` | 14px | 1.6 | Default body text, table cells |
| `--text-sm` | 12px | 1.5 | Labels, badges, metadata, timestamps |
| `--text-xs` | 10px | 1.4 | Fine print, field hints |

**Ratio rule:** Display : Headline : Body ≈ 4 : 2 : 1

### 4.3 Typography rules

- **Casing:** Sentence case everywhere. No ALL CAPS. No Title Case.
- **Alignment:** Left-justified or center-justified. Never right-justified or fully justified.
- **Tracking/Leading:** Use defaults — Manrope is already optimized.

---

## 5.0 Layout system

### 5.1 Page structure

```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR (Dark Serpent bg, 260px, collapsible)           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Logo (diamond + wordmark)                          │ │
│  │  ─────────────────────────                          │ │
│  │  Nav: Dashboard                                     │ │
│  │  Nav: Events                                        │ │
│  │  Nav: Add event                                     │ │
│  │  Nav: Scraper                                       │ │
│  │  Nav: Reports                                       │ │
│  │  Nav: Queues                                        │ │
│  │  ─────────────────────────                          │ │
│  │  Nav: Settings                                      │ │
│  │  User avatar + role badge                           │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  MAIN CONTENT (Paper bg, flex-1)                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  TOP BAR: Page title + breadcrumbs + action buttons │ │
│  │  ───────────────────────────────────────────────────│ │
│  │                                                     │ │
│  │  CONTENT AREA (max-width: 1440px, centered)         │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Spacing scale

```
4px   — inner padding (badges, chips)
8px   — tight spacing (between related items)
12px  — default component padding
16px  — card padding, form field spacing
24px  — section spacing within a page
32px  — gap between major content blocks
48px  — page-level top/bottom padding
56px  — page-level left/right padding (matches HK report)
```

### 5.3 Breakpoints

| Name | Width | Behavior |
|---|---|---|
| Mobile | < 640px | Sidebar hidden (hamburger), single column, stacked cards |
| Tablet | 640–1024px | Sidebar collapsed (icons only), 2-column grid |
| Desktop | 1024–1440px | Full sidebar, 3-column grid |
| Wide | > 1440px | Content centered at max-width 1440px |

### 5.4 Grid

- **Dashboard:** 12-column grid, widgets span 3/4/6/12 columns
- **Event list (table view):** Full-width table with horizontal scroll on mobile
- **Event list (card view):** Responsive grid, `repeat(auto-fill, minmax(380px, 1fr))`
- **Forms:** 2 columns on desktop (field groups side-by-side), single column on mobile

---

## 6.0 Component specifications

### 6.1 Cards (event cards)

```
Background:      White (#FFFFFF)
Border:          1.5px solid #D8D2C8 (same as HK report)
Border radius:   12px
Shadow:          0 2px 16px rgba(0,0,0,0.05)
Hover shadow:    0 6px 30px rgba(0,0,0,0.08)
Hover transform: translateY(-1px)

Structure:
┌──────────────────────────────────────────┐
│ [6px color accent bar] HEADER AREA       │
│  Event # · Date                          │
│  Event Name (Manrope Semibold, 18px)     │
│  [Business Line chip] [Fit badge] [Pri]  │
│                                 Location │
│                                    Venue │
├──────────────────────────────────────────┤
│  BODY GRID (auto-fit columns)            │
│  ┌──────────┬──────────┬──────────┐      │
│  │ Organizer│ Audience │ Attendees│      │
│  └──────────┴──────────┴──────────┘      │
├══════════════════════════════════════════╡
│  STRATEGIC SECTION (green-tinted bg)     │
│  Relevance to Lifewood | Recommendation  │
└──────────────────────────────────────────┘
```

**Accent bar colors (left edge, 6px wide):**

| Business line | Color |
|---|---|
| Global AI Data | `#046241` (Castleton Green) |
| AIGC | `#133020` (Dark Serpent) |
| Global Scanning + Indexing | `#C17110` (warm brown) |
| Autonomous Driving | `#034E34` (deep green) |
| AEO/GEO | `#E89131` (amber) |
| EDGE Intelligence | `#417256` (sage) |

### 6.2 Chips / Badges

```
Padding:         4px 11px
Border radius:   100px (pill)
Font size:       11px
Font weight:     500 (Medium)
Text color:      White (#FFFFFF)
Background:      Business-line color (see accent bar table above)
```

### 6.3 Fit score badges

```
Shape:           Rounded square, 32x32px
Font size:       16px, Manrope Semibold
Font color:      White

Fit 5 bg:  #133020  (Dark Serpent)
Fit 4 bg:  #046241  (Castleton Green)
Fit 3 bg:  #708E7C  (muted green)
```

### 6.4 Priority indicators

```
Shape:  7px circle (dot) + text label
High:   #C17110 dot, "High" in #C17110
Medium: #FFB347 dot, "Medium" in #E89131
Low:    #9CAFA4 dot, "Low" in #9CAFA4
```

### 6.5 Buttons

| Type | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary (CTA) | Saffron `#FFB347` | Dark Serpent `#133020` | none | Earth Yellow `#FFC370` |
| Secondary | transparent | Dark Serpent | 1.5px Dark Serpent | bg `#F5EEDB` |
| Ghost | transparent | Castleton Green | none | bg `#F9F7F7` |
| Destructive | `#B91C1C` | White | none | darken 10% |

```
All buttons:
  Padding:       10px 20px
  Border radius: 8px
  Font:          Manrope Medium, 14px
  Transition:    all 0.18s ease
```

### 6.6 Form inputs

```
Background:      White (#FFFFFF)
Border:          1.5px solid #D8D2C8
Border radius:   8px
Padding:         10px 14px
Font:            Manrope Regular, 14px
Focus border:    Castleton Green (#046241)
Focus shadow:    0 0 0 3px rgba(4,98,65,0.15)
Error border:    #B91C1C
Placeholder:     #999999
```

### 6.7 Tables

```
Header row:
  Background:    Dark Serpent (#133020)
  Text:          White, Manrope Semibold, 10.5px, uppercase, letter-spacing 0.08em
  Padding:       13px

Body rows:
  Background:    White (#FFFFFF)
  Border bottom: 1px solid #D8D2C8
  Hover bg:      #F0F5F2
  Padding:       10px 13px

Quarter separator rows:
  Background:    rgba(19,48,32,0.06)
  Text:          Castleton Green, Semibold, 11px, uppercase
```

### 6.8 Sidebar navigation

```
Active item:
  Background:    rgba(255,179,71,0.15)
  Left border:   3px solid Saffron (#FFB347)
  Text color:    White

Inactive item:
  Background:    transparent
  Text color:    rgba(245,238,219,0.65)

Hover:
  Background:    rgba(255,255,255,0.08)
  Text color:    White
```

### 6.9 Filter bar

```
Container:
  Background:    Paper (#F5EEDB)
  Border bottom: 1.5px solid #D8D2C8
  Padding:       14px 24px
  Display:       flex, wrap, gap 8px

Filter chips (inactive):
  Padding:       7px 16px
  Border radius: 100px
  Border:        1.5px solid #D8D2C8
  Background:    transparent
  Font:          Manrope Medium, 12.5px
  Color:         #666666
  Cursor:        pointer

Filter chips (active):
  Background:    Dark Serpent (#133020)
  Border color:  Dark Serpent
  Color:         White
```

### 6.10 Toast / notifications

```
Container:
  Position:      fixed, top-right
  Border radius: 10px
  Padding:       14px 20px
  Shadow:        0 4px 20px rgba(0,0,0,0.12)
  Font:          Manrope Regular, 13px

Success: left border 4px #046241, bg White
Error:   left border 4px #B91C1C, bg White
Warning: left border 4px #E89131, bg White
Info:    left border 4px #133020, bg White
```

---

## 7.0 Page specifications

### 7.1 Dashboard (home)

```
Layout: 12-column grid

Row 1 — Stat cards (4 across):
  [Total events]  [2027 events]  [Avg fit score]  [Regions covered]
  Each: White bg, rounded corners, Saffron number highlight

Row 2 — Charts (2 across):
  [Events by month — bar chart]  [Events by region — donut chart]
  Colors: Secondary warm palette

Row 3 — Charts (2 across):
  [Business line distribution — horizontal bars]  [Fit score distribution — pie]

Row 4 — Gaps & alerts:
  [Coverage gaps — months with < 5 events highlighted in Saffron]
  [Recently added events — list, max 10]

Row 5 — Scraper status:
  [Last run time]  [Next scheduled run]  [Events found last run]  [Trigger button]
```

### 7.2 Events list page

```
Top section:
  Page title: "Events"
  View toggle: [Table] [Cards]
  Action button: "+ Add event" (primary CTA, Saffron)

Filter bar:
  [Region ▾]  [Business line ▾]  [Fit score ▾]  [Priority ▾]  [Date range ▾]
  [Search input: name/city/country]
  [Clear all filters]

Table view:
  Columns: #, Event name, Date, City/Country, Region, Business line, Fit, Priority, Actions
  Sortable by: date, fit, priority, name
  Pagination: 25 / 50 / 100 per page

Card view:
  Grid layout (see §6.1 for card spec)
  Infinite scroll or pagination
```

### 7.3 Event detail page

```
Full-width card layout (like the HK report detail cards, but standalone):

HEADER:
  [Accent bar] Event name (display size)
  [Business line chips]  [Fit badge]  [Priority]
  Date · Venue · City, Country

BODY (2-column grid):
  Left column:
    Strategic focus / purpose
    Relevance to Lifewood
    Business line(s) with descriptions
    Target audience

  Right column:
    Organizer
    Official website (clickable link)
    Estimated attendees
    Booth/sponsorship cost
    Registration deadline
    Contact email / person
    LinkedIn / social media

FOOTER:
  Participation recommendation (highlighted chip)
  Key notes
  Source links
  [Edit] [Delete] buttons (role-dependent)
```

### 7.4 Add / Edit event form

```
Grouped by the 5 schema groups:

Group A — Identity & location (mandatory)
  [No. (auto-increment)]  [Region (dropdown)]
  [Country (input)]       [City (input)]
  [Event name (input)]    [Date(s) (date picker + format helper)]
  [Venue (input)]         [Location address (textarea)]

Group B — Source & organizer (mandatory)
  [Official website (URL input)]
  [Organizer (input)]
  [Event category (input)]

Group C — Strategic assessment (mandatory)
  [Business line(s) (multi-select from 6 options)]
  [Strategic focus/purpose (textarea, 1–2 sentences)]
  [Relevance to Lifewood (textarea, must name buyer + service)]
  [Target audience (input)]
  [Participation recommendation (dropdown: Exhibit, Attend, Speak, Monitor)]
  [Priority level (auto-derived from fit score)]
  [Fit score (1–5 slider or radio, minimum 3 enforced)]

Group D — Commercial detail (best-effort)
  [Estimated attendees (input)]
  [Exhibitor/sponsor opportunity (textarea)]
  [Booth or sponsorship cost (input)]
  [Registration deadline (date picker)]
  [Contact email (input)]
  [Contact person (input)]
  [LinkedIn/social media (input)]
  → Each field has a "Not publicly disclosed" quick-fill button

Group E — Provenance (mandatory)
  [Key notes (textarea)]
  [Source links (repeatable URL inputs, min 1, min 2 if date TBA)]

VALIDATION:
  - All Group A/B/C/E fields required (red border if empty on submit)
  - Group D: empty → auto-fill "Not publicly disclosed" on save
  - Date format: "Sep 14–17, 2027" enforced (helper text shown)
  - Duplicate check: runs on blur of "Event name" field, shows warning if match found
  - Fit score < 3 → block submit with message: "Only events scoring Fit 3+ can be entered"

ACTIONS:
  [Save as draft]  [Submit for review]  [Publish] (Admin/Supervisor only)
```

### 7.5 Scraper page

```
HEADER:
  "Event scraper" title
  [Run now] button (primary CTA)
  Status indicator: Idle / Running / Complete / Error

CONFIGURATION PANEL:
  Date range: [Start date] → [End date] (default: now → Dec 31, 2027)
  Regions: [multi-select checkboxes]
  Business lines: [multi-select checkboxes]
  Source tiers: [Tier 1 ✓] [Tier 2 ✓] [Tier 3 ✓]

SCHEDULE:
  [Enable auto-schedule toggle]
  Frequency: [Daily / Weekly / Monthly dropdown]
  Next run: [shows calculated datetime]

RESULTS:
  Results table after scraper completes:
  [Event name]  [Date]  [Location]  [Auto-assigned business line]  [Confidence %]
  [Actions: Accept / Edit / Reject]

  Accepted events go to the main database.
  Rejected events are logged and excluded from future runs.
```

### 7.6 Reports page

```
HEADER:
  "Reports" title
  [Generate report] button

FORM:
  Report type: [Regional summary / Business line summary / Full export]
  Region filter: [dropdown]
  Date range: [start → end]
  Style: [Lifewood branded HTML (like HK report) / CSV / PDF]

OUTPUT:
  Preview pane showing the generated report
  [Download] [Share link] buttons
```

### 7.7 Queues page

```
Two tabs:
  [For review] — Events with ambiguous fit scores awaiting supervisor ruling
  [Corrections] — Suggested edits to existing records awaiting approval

Each entry shows:
  Event name, submitted by, submitted date, reason
  [Approve] [Reject] [Edit & approve] buttons (Supervisor/Admin only)
```

---

## 8.0 Interaction patterns

### 8.1 Transitions

```
All transitions:  0.18s ease (consistent with HK report)
Hover lift:       translateY(-1px) on cards
Page transitions: Fade in, 0.2s
Modal:            Slide up from bottom, 0.25s
Sidebar collapse: Width animation, 0.2s
```

### 8.2 Loading states

```
Skeleton loaders on cards/tables (pulse animation, bg #E6E6E6)
Spinner for scraper running state (Saffron colored, 24px)
Progress bar for bulk operations (Saffron gradient)
```

### 8.3 Empty states

```
Centered illustration placeholder + text:
  "No events found" — with action button to adjust filters or add event
  "2027 is empty — let's fill it" — on dashboard gap widget
```

### 8.4 Duplicate warning

```
When typing event name in the add-event form:
  → Debounced search (300ms) against existing records
  → If match found: yellow warning bar below the field
    "⚠ Possible duplicate: [Event Name] (existing record #123)"
    [View existing] [Continue anyway]
```

---

## 9.0 Bilingual support (English + Chinese)

### 9.1 Language switcher

```
Location: Top-right of header bar, next to user avatar
Toggle:   [EN | 中文] pill toggle
Default:  English
```

### 9.2 Chinese typography

```
Headlines:  Alimama ShuHeiTi Bold (fallback: Microsoft YaHei Bold)
Body text:  Microsoft YaHei Regular (fallback: PingFang SC)
```

### 9.3 Translation scope

All UI labels, navigation, buttons, form labels, and system messages are translatable. Event data itself stays in its original input language (not translated).

---

## 10.0 Accessibility

- All interactive elements keyboard-navigable (tab order follows visual order)
- Color contrast minimum: WCAG AA (4.5:1 for body text, 3:1 for large text)
- Form inputs have visible labels (not placeholder-only)
- Error messages are descriptive and associated with their field via `aria-describedby`
- Focus ring: 2px Castleton Green outline on all focusable elements
- Screen reader: meaningful alt text on icons, `aria-labels` on icon-only buttons

---

## 11.0 Logo placement

- **Sidebar:** Diamond icon + "Lifewood" wordmark at the top of the sidebar
- **Exported reports:** Full logo (diamond + wordmark) bottom-right of the page
- **Favicon:** Diamond icon only
- **Minimum clear space:** Height of the diamond icon on all sides

---

## 12.0 Reference implementations

The **HongKong Exhibitions 2026 (Mar-Apr).html** file serves as the visual reference for:
- Card layout and structure
- Table styling
- Filter bar behavior
- Color accent bars by category
- Typography hierarchy
- Hover and transition effects

All dashboard components should feel like a natural extension of that report's design language.
