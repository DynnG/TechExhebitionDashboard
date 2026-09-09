# Tech Exhibition Dashboard — Frontend UI/UX Specification

## 1. Design System & Theme Foundations
* **Theme Archetype:** Structured Enterprise Bento Grid & Data-Dense Dashboard on Warm Editorial Minimalism.
* **Core Palette:**
  * **Dark Serpent (`#133020`):** Primary structural tone, headlines, primary active states, and dark buttons.
  * **Castleton Green (`#046241`):** Secondary brand accent, category pills, and borders.
  * **Saffron (`#FFB347`):** Accent highlight, primary action CTAs, and Fit 5 badges.
  * **Paper (`#F5EEDB`):** Subtle background accent / secondary canvas.
  * **Sea Salt (`#F9F7F7`):** Primary page and navigation background.
  * **White (`#FFFFFF`):** Mandatory container surface for all interactive cards and tables.
* **Typography:**
  * **Latin / International:** Manrope (Display / Semibold, Body / Regular).
  * **Chinese (活树):** Alimama ShuHeiTi (Headings), Microsoft YaHei (Body).

---

## 2. Global Components

### 2.1 Navigation Bar
* **Background:** Solid Sea Salt (`#F9F7F7`).
* **Active State Styling:** Minimalist inline indicator. No bulky colored background pills.
  * Active item: Text in Dark Serpent (`#133020`, semibold) with an elegant 2px bottom border underline (`#133020`).
  * Inactive items: Muted charcoal (`#666666`) shifting to Castleton Green (`#046241`) on hover.

### 2.2 Application Header
* **Elevation & Border:** Elevated using a soft drop shadow (`0 4px 20px -2px rgba(19, 48, 32, 0.05)`) paired with a blended 1px bottom border (`rgba(19, 48, 32, 0.08)`).
* **Internationalization (Language Changer):**
  * Global i18n implementation (English / Chinese).
  * Switching to Chinese renders the entire interface (navigation, labels, filters, placeholders, and tooltips) in Chinese using the brand font stack (`Alimama ShuHeiTi` / `Microsoft YaHei`).

---

## 3. Screen Specifications

### 3.1 Authentication (Login Page)
* **Layout:** Split 50/50 desktop layout.
* **Left Panel:** Brand showcase with Lifewood corporate imagery, official logo lockup (`lifewood 活树`), and brand tagline.
* **Right Panel:** Clean white form card housing credentials input, "Remember Me", and authentication actions. Primary CTA button filled with Dark Serpent (`#133020`) and Saffron (`#FFB347`) hover accent.

### 3.2 Dashboard (Overview)
* **Layout:** Bento-grid arrangement optimizing visual hierarchy across metrics, pipeline projections, and recent entries.
* **Metric & Score Cards:**
  * **Canvas:** Solid white surface (`#FFFFFF`), rounded borders (`border-radius: 12px`), 1px structural border (`#E6E6E6`).
  * **Interaction (Static Elevation):** Cards remain strictly static on the z-axis (no translate-Y or pop-up transforms).
  * **Hover Effect:** React Bits `BorderGlow` component (`reactbits/components/border-glow`) with a soft glow in Castleton Green or subtle Saffron.

### 3.3 Events Pipeline View
* **Filter Panel Card:** Remove all transparency. Render as a solid White (`#FFFFFF`) card container with a crisp border (`#E6E6E6`) over the Sea Salt canvas to prevent background bleed.
* **Event Cards — Fit Score Hierarchy:**
  * **Metric Scale:** Enlarge the numeric score (e.g., `text-2xl` / `font-bold` in Dark Serpent `#133020`).
  * **Fit Indicator Badges:**
    * Fit 5: Saffron pill (`#FFB347`, text `#133020`).
    * Fit 4: Earth Yellow pill (`#FFC370`, text `#133020`).
    * Fit 3: Castleton Green border outline (`#046241`).

### 3.4 Data Scraper View
* **Interface Cleanup:** Remove the horizontal dividing separator line between the filter controls and the subject results container for a seamless editorial flow.

### 3.5 User Management
* **Administrative Controls:** Include an explicit "Change Password" / "Reset Password" action trigger in the user table actions dropdown, allowing administrators to set or force new passwords for managed user accounts.

### 3.6 Settings
* **Security Tab:** Provide a dedicated "Change Password" section for the logged-in administrator (Current Password, New Password, Confirm Password validation).