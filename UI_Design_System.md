# YUSUR Consumer App — UI Design System

This design system defines the visual language, typography scales, layout tokens, and UI component specifications for the YUSUR Consumer App. The system is designed to look premium, modern, accessible (WCAG AA), and is built strictly around logical properties to ensure LTR (English) and RTL (Arabic) compliance.

---

## 1. Design Tokens

### A. Color System
The color system features high-contrast, healthcare-focused primary tones paired with soft, trustworthy secondary colors.

| Token | CSS Variable | Hex Value (Light) | Hex Value (Dark) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary (Teal)** | `--color-primary` | `#0D9488` | `#0E7490` | Brand identity, primary CTAs, active states, Rx badges |
| **Secondary (Blue)**| `--color-secondary` | `#0284C7` | `#0369A1` | Trust elements, informational links, ratings |
| **Success** | `--color-success` | `#10B981` | `#059669` | Order completed, payment success, active promotions |
| **Warning** | `--color-warning` | `#F59E0B` | `#D97706` | Pending pharmacist review, drug counter-indications |
| **Danger** | `--color-danger` | `#E11D48` | `#BE123C` | Out of stock, error alerts, order cancellations |
| **Info** | `--color-info` | `#0EA5E9` | `#0284C7` | Delivery updates, helpful tips |
| **Background** | `--color-bg` | `#F8FAFC` | `#0F172A` | Core app canvas background |
| **Surface** | `--color-surface` | `#FFFFFF` | `#1E293B` | Cards, bottom sheets, navigation menus |
| **Text Primary** | `--color-text-1` | `#0F172A` | `#F8FAFC` | Headings, primary labels, body text |
| **Text Secondary**| `--color-text-2` | `#64748B` | `#94A3B8` | Subtext, captions, placeholders, labels |

### B. Typography
The typography system uses dual-font family pairing to optimize readability for both languages.

* **Font Families:**
  - **English (LTR):** `Outfit`, sans-serif (Modern, clean, healthcare-friendly rounded feel).
  - **Arabic (RTL):** `Tajawal`, sans-serif (High legibility, well-proportioned heights, highly professional).
* **Font Scale:**
  - **Display:** `32px` / Line Height `120%` (Bold) — *Use: Hero headers, onboarding*
  - **Heading 1:** `24px` / Line Height `130%` (Bold/SemiBold) — *Use: Page titles*
  - **Heading 2:** `20px` / Line Height `130%` (SemiBold) — *Use: Section headers, card titles*
  - **Body Large:** `16px` / Line Height `150%` (Regular/Medium) — *Use: Chat, list items, description*
  - **Body Regular:** `14px` / Line Height `150%` (Regular) — *Use: Core body content, form values*
  - **Caption:** `12px` / Line Height `140%` (Regular/Medium) — *Use: Expiry dates, ratings, pharmacy ETAs*

### C. Spacing Scale
Built on a strict 4px grid. Standardize all spatial calculations using CSS logical properties to ensure perfect mirroring in RTL.

* `4px` (`--spacing-1`): Micro adjustments, card internal sub-elements.
* `8px` (`--spacing-2`): Small padding, text-to-input gap, inline badges.
* `12px` (`--spacing-3`): Card padding, input internal padding.
* `16px` (`--spacing-4`): Standard screen margin-inline, list separation, core gaps.
* `20px` (`--spacing-5`): Section gaps, medium elevations.
* `24px` (`--spacing-6`): Primary screen container padding, header-to-body margins.
* `32px` (`--spacing-8`): Large layouts, authentication screen top offsets.
* `40px` (`--spacing-10`): Bottom sheet top padding, onboarding card offsets.
* `48px` (`--spacing-12`): Splash screen layout offsets.

### D. Border Radius
* `4px` (`--radius-sm`): Small badges, mini checkmarks.
* `8px` (`--radius-md`): Buttons, input fields, notification badges.
* `12px` (`--radius-lg`): Product cards, pharmacy cards, search bars.
* `24px` (`--radius-xl`): Bottom sheets, dialog modals, wallet layout cards.
* `999px` (`--radius-pill`): Circular icons, loyalty progression meters, tags.

### E. Shadows
* **Low Elevation (Cards):** `0px 2px 8px rgba(15, 23, 42, 0.04)`
* **Medium Elevation (Navbars/Bottom Nav):** `0px -4px 16px rgba(15, 23, 42, 0.06)`
* **High Elevation (Bottom Sheets/Modals):** `0px 10px 32px rgba(15, 23, 42, 0.12)`

---

## 2. Interactive Component Specifications

### A. Buttons

#### Primary Button
* **Anatomy:** Icon (Start, Optional) + Label Text + Icon (End, Optional)
* **States:**
  - **Default:** Background `--color-primary`, Text `#FFFFFF`, Shadow Low.
  - **Pressed/Hover:** Background 10% darker primary, Text `#FFFFFF`.
  - **Disabled:** Background `--color-text-2` (opacity 30%), Text `--color-text-2`, Shadow None.
  - **Loading:** Label hidden, CSS Spinner centered.
* **Logical Spacing:** `padding-block: 14px`, `padding-inline: 24px`, `border-radius: --radius-md`.

#### Secondary Button
* **Anatomy:** Label Text (Outline styled)
* **States:**
  - **Default:** Background transparent, Border `1.5px solid --color-primary`, Text `--color-primary`.
  - **Pressed/Hover:** Background `--color-primary` (opacity 8%), Text `--color-primary`.
  - **Disabled:** Border `1.5px solid --color-text-2` (opacity 30%), Text `--color-text-2`.

#### Ghost Button
* **Anatomy:** Text Label or Icon-Only
* **States:**
  - **Default:** Background transparent, Text `--color-secondary`.
  - **Pressed/Hover:** Background `--color-secondary` (opacity 5%).

#### Danger Button
* **Anatomy:** Label Text
* **States:**
  - **Default:** Background `--color-danger`, Text `#FFFFFF`.
  - **Pressed:** 10% darker danger background.

---

### B. Inputs

#### Default Text Input
* **Anatomy:** Label text (top-start aligned) + Input box with optional start icon (e.g., search magnifier) and end icon (e.g., clear text/eye toggle) + Helper/Error text (bottom-start aligned).
* **States:**
  - **Default:** Background `--color-surface`, Border `1px solid --color-text-2` (opacity 20%), Text `--color-text-1`.
  - **Focused:** Border `1.5px solid --color-primary`, Box Shadow Low.
  - **Error:** Border `1.5px solid --color-danger`, Subtext color `--color-danger`.
  - **Disabled:** Background `--color-bg`, Text `--color-text-2` (opacity 50%), Border `1px solid --color-text-2` (opacity 10%).

#### Search Input
* **Anatomy:** Embedded magnifier icon + Placeholder text ("Search medicines, pharmacies...") + Voice search/Barcode icon (end).
* **Styling:** Pill-shaped (`border-radius: --radius-pill`), background `--color-bg`, no border, high contrast placeholder text.

---

### C. Cards

#### Product Card (Mobile Grid / List)
* **Anatomy:**
  1. Product Image (Aspect ratio 1:1, centered).
  2. Floating Badges (Top-start: Rx, Offer, Out of Stock).
  3. Wishlist Button (Top-end: Heart icon, red stroke/fill when active).
  4. Brand / Manufacturer name (Caption, `--color-text-2`).
  5. Product Name (Heading 2 size, limit to 2 lines).
  6. Rating widget (Star icon + `4.8 (120 reviews)`).
  7. Pharmacy Vendor Name (Caption, `--color-secondary`).
  8. Price row (Discounted price in bold Primary color, original price in gray strikethrough).
  9. Add CTA (Small teal circular plus button, turns into quantity counter `[-] 1 [+]` when clicked).

#### Pharmacy Card (Horizontal List / Map Overlay)
* **Anatomy:**
  1. Pharmacy Logo (Left-start in LTR, Right-start in RTL).
  2. Pharmacy Name (Heading 2, bold).
  3. Star rating + reviews count.
  4. Distance & Delivery details: `1.2 km` | `Delivery: 20-30 mins` | `Fee: 10 SAR`.
  5. Active Promo badge: "Buy 2 Get 1 Free" or "Free Delivery above 100 SAR" (Success styled badge).

#### Order Card
* **Anatomy:**
  1. Order ID Header: `#YS-98210` with Order Date.
  2. Multi-Pharmacy grouping icons (logos of pharmacies in order).
  3. Order Status badge (Color coded: green for Delivered, orange for In Transit, red for Cancelled).
  4. Summary line: `3 Items` | `Total: 154.50 SAR`.
  5. Action Row: "Track Order" (Primary button) and "Reorder" (Secondary outline button).

---

### D. Badges

| Type | Text Color | Background Color | Usage |
| :--- | :--- | :--- | :--- |
| **Rx (Prescription)** | `#FFFFFF` | `--color-primary` (Teal) | Flags prescription-only drugs |
| **Offer (Discount)** | `#FFFFFF` | `--color-success` (Green) | Percentage discounts, e.g. "20% OFF" |
| **Out of Stock** | `#FFFFFF` | `--color-danger` (Red) | Indicates item cannot be purchased |
| **Best Seller** | `#0F172A` | `#F59E0B` (Amber) | High sales velocity |
| **New** | `#FFFFFF` | `--color-secondary` (Blue) | Newly added items |

---

### E. Navigation Components

#### Global Navbar
* **Anatomy:**
  - Back Button (mirrors icon dynamically based on RTL/LTR) or Location Selector dropdown.
  - Page Title (Center aligned).
  - Actions (Notification Bell with badge, Wishlist Heart, Search icon).

#### Bottom Navigation
* **Anatomy:** 5 equal tabs: Home, Pharmacies, Cart, Orders, Profile.
* **Aesthetics:** White solid glassmorphism surface background (`--color-surface` with backdrop-filter blur), thin top border.
* **Active Indicator:** Active tab icon turns `--color-primary` with a tiny dot or pill accent beneath the icon; inactive tabs are `--color-text-2`.

---

### F. Specialized Dashboards

#### Wallet Dashboard Card
* **Aesthetics:** Sleek dark gradient card (e.g. from `#0D9488` to `#0284C7`), mimicking a premium credit card.
* **Anatomy:**
  1. YUSUR Wallet Branding logo.
  2. Balance Display: `245.50 SAR` (Display typography size).
  3. Refund/Promotional credits breakout labels.
  4. "Quick Top Up" primary CTA.
  5. "Transaction History" link.

#### Loyalty Rewards Card
* **Aesthetics:** Premium gold/bronze card layout.
* **Anatomy:**
  1. Level Indicator: "Gold Member".
  2. Points Balance: `1,250 Points` (Value: `25.00 SAR`).
  3. Visual Progression Meter (Progress bar tracking points until Platinum Tier).
  4. "Redeem at Checkout" toggle switcher.
