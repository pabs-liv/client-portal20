# Client Portal 2.0 — Application Documentation

> **Last Updated:** 2026-03-19
> **Status:** Frontend-only (Vue 3 + TypeScript). No backend integration yet. All data is mock/hardcoded.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Design System](#3-design-system)
4. [Pages Reference](#4-pages-reference)
5. [Component Library](#5-component-library)
6. [Plan Explorer — Detailed Reference](#6-plan-explorer--detailed-reference)
7. [Security and Compliance](#7-security-and-compliance)
8. [Developer Guide](#8-developer-guide)
9. [API Reference](#9-api-reference)
10. [QA Notes](#10-qa-notes)

---

## 1. Overview

Client Portal 2.0 is a PBM (Pharmacy Benefits Manager) client portal serving two distinct user audiences:

- **External users** — Consultants, brokers, and TPAs who manage client accounts. They have a scoped view: no Approvals page, simplified charts, and action icons on claim tables.
- **Internal users** — Staff at the PBM organization with full access to all pages, enhanced charts, and additional column visibility in tables.

The application is entirely frontend-only at this stage. There is no live backend; all data is hardcoded or mocked in component scripts. The planned backend is a RESTful API authenticated through Okta.

### Tech Stack

| Technology | Version / Notes |
|---|---|
| Vue.js 3 | Composition API, `<script setup>` throughout |
| TypeScript | Strict typing on all components and composables |
| Vite | Build tool and dev server, runs on port 3000 |
| Vuetify 3 | UI component library (v3.9 beta). Theme configured in `plugins/vuetify.ts` |
| Pinia | State management (single `user.ts` store currently) |
| Vue Router 4 | Client-side routing with `createWebHistory` |
| SCSS | Global tokens in `style.scss`; scoped per-component styles |
| vue3-apexcharts | Charts (area, bar, donut) |
| Lucide Vue Next | Icon set |

---

## 2. Architecture

### 2.1 Folder Structure

```
frontend/src/
├── assets/             Static images and fonts (e.g., UploadIllustration.png)
├── components/
│   ├── common/         19 app-specific reusable components (ReportDataTable, SummaryWidget, etc.)
│   ├── layout/         Header.vue, Sidebar.vue
│   └── ui/             13 atomic UI components (Button, TextField, Dialog, Select, etc.)
├── composables/        Vue Composition API utility functions
├── plugins/            vuetify.ts (theme, icons)
├── router/             index.ts (all 11 routes)
├── services/           API stub modules (not yet implemented)
├── stores/             user.ts (Pinia store)
├── views/              11 page components
└── style.scss          Global design tokens (colors, typography, spacing)
```

### 2.2 Entry Point

`frontend/src/main.ts` bootstraps the Vue app, registering Pinia, Vuetify, Vue Router, and VueApexCharts as plugins, and importing the global SCSS stylesheet.

### 2.3 App Shell (`App.vue`)

The root component renders a full-height `v-app` with three persistent regions:

- **`<Sidebar />`** — Left navigation drawer, 120px wide, icon + label layout.
- **`<Header />`** — Top app bar with a "Fiduciary Dashboard" button and a user avatar menu.
- **`<v-main>`** — Page content rendered via `<router-view>` inside a fluid `v-container`.

A development-only user-type switcher (`v-switch`) is rendered fixed in the bottom-right corner when `import.meta.env.DEV` is true. This allows developers to toggle between internal and external user modes without a real auth session.

### 2.4 Routing

All routes use `createWebHistory` (HTML5 history mode). Each route has a `meta.breadcrumb` string used by the `Breadcrumbs` UI component.

| Path | Name | Breadcrumb |
|---|---|---|
| `/` | Home | Home |
| `/approvals` | Approvals | Approvals |
| `/reports` | Reports | Reports |
| `/documents` | Documents | Documents |
| `/high-cost-claims` | Claims | High-Cost Claims |
| `/prior-auths` | PriorAuths | Prior Authorizations |
| `/billing` | Billing | Billing |
| `/plan-explorer` | PlanExplorer | Plan Explorer |
| `/test-results` | TestResults | Test Results |
| `/added-value` | AddedValue | Added Value |
| `/settings` | Settings | Settings |

Route guards for permission checking are documented in the security rules but not yet implemented in `router/index.ts`. The `usePermissions` composable scaffolds the logic.

### 2.5 State Management

State management uses Pinia. The sole active store is `frontend/src/stores/user.ts`.

```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const userType = ref<'internal' | 'external'>('external');
  function setUserType(type: 'internal' | 'external') {
    userType.value = type;
  }
  return { userType, setUserType };
});
```

Default value is `'external'`. The `useUserType()` composable wraps this store and exposes `isInternal` and `isExternal` computed properties used throughout all pages and components.

### 2.6 Composables

All composables live in `frontend/src/composables/`.

| File | Purpose |
|---|---|
| `useUserType.ts` | Wraps the Pinia user store; exposes `userType`, `isInternal`, `isExternal`, `setUserType` |
| `useAuth.ts` | Auth stub (empty, planned for Okta PKCE implementation) |
| `useApi.ts` | API client stub (empty, planned) |
| `useNavigation.ts` | Navigation helpers |
| `useSettings.ts` | Settings page helpers |
| `useReportExplorer.ts` | Report explorer data helpers |
| `usePermissions.ts` | RBAC permission checking (scaffolded, not yet wired to router) |
| `useEntityManagement.ts` | Entity/account management helpers |
| `useMobileDetection.ts` | Detects mobile viewport |

---

## 3. Design System

### 3.1 Colors

Defined as SCSS variables in `frontend/src/style.scss` and available as CSS custom properties.

#### Brand Colors
| Variable | Value | Usage |
|---|---|---|
| `$color-primary` | `#0F285B` | Primary actions, headings, borders |
| `$color-primary-light` | `#1A3A6B` | Hover states on primary |
| `$color-primary-dark` | `#0A1F4A` | Active states |

#### Neutral Colors
| Variable | Value | Usage |
|---|---|---|
| `$color-neutral-white` | `#FFFFFF` | Page and card backgrounds |
| `$color-neutral-disabled` | `#858585` | Disabled text and icons |
| `$color-text-primary` | `#1A1A1A` | Body text |
| `$color-text-secondary` | `#6B6B6B` | Secondary and hint text |
| `$color-border` | `#E0E0E0` | Card borders, dividers |

#### Status / Semantic Colors
| Variable | Value | Usage |
|---|---|---|
| `$color-success` / `$color-approved` | `#5CB85C` | Success states, approved status |
| `$color-warning` / `$color-pending` | `#FBBA13` | Warning banners, pending status |
| `$color-error` / `$color-denied` / `$color-overdue` | `#B80909` | Error states, denied/overdue status |
| `$color-link` | `#2C82CB` | Links, info banners |

#### Status Background Colors
| Variable | Value |
|---|---|
| `$color-success-background` | `rgba(190, 227, 190, 0.4)` |
| `$color-warning-background` | `rgba(253, 214, 113, 0.2)` |
| `$color-error-background` | `rgba(212, 107, 107, 0.4)` |
| `$color-information-background` | `rgba(44, 130, 203, 0.1)` |

### 3.2 Typography

Font family: **Lato** (weights 400, 600, 700), loaded from Google Fonts.

| Class | Size | Weight | Usage |
|---|---|---|---|
| `.text-h1` | `2.07rem` | 700 | Page titles |
| `.text-h2` | `1.728rem` | 600 | Card/section headings |
| `.text-h3` | `1.44rem` | 700 | Sub-section headings (primary color) |
| `.text-h4` | `1.2rem` | 700 | Field group headings |
| `.text-body` | `1rem` | 400 | Body text |
| `.text-small` / `.p2` | `0.8rem` | 400 | Captions, hints, disclaimers |

Line height is `120%` (`$line-height-tight`) across all typographic styles.

**Global Vuetify override:** All `v-btn` elements have `text-transform: none` and `letter-spacing: 0` applied globally, enforcing title-case, non-uppercase button labels throughout.

### 3.3 Spacing

Based on an 8px scale (with 4px nano step):

| Variable | Value |
|---|---|
| `$spacing-nano` | `4px` |
| `$spacing-xsmall` | `8px` |
| `$spacing-small` | `12px` |
| `$spacing-medium` | `20px` |
| `$spacing-large` | `32px` |
| `$spacing-xlarge` | `48px` |

Root page padding uses a fluid clamp: `clamp(3rem, calc(3rem + ((1vw - 0.48rem) * 2.0833)), 4.5rem)`.

Utility classes are available: `.pa-{size}` (padding), `.ma-{size}` (margin), `.mb-large`, `.mt-small`, and named spacing utilities.

### 3.4 Button Variants

The custom `Button.vue` component uses a `variant` prop with four options:

| Variant | Appearance | Use Case |
|---|---|---|
| `primary` | Navy fill, white text, pill shape | Main CTA actions |
| `secondary` | Transparent, navy border, pill shape | Secondary/cancel actions |
| `alert` | Red fill, white text, pill shape | Destructive actions |
| `thirtiary` | Transparent, navy border, 4px radius, Pencil icon | Inline edit triggers |

### 3.5 Component Patterns

- **Cards** always use `border: 1px solid $color-border`, `border-radius: 8px`, and `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`.
- **Forms** use `.form-row` (flex, gap 20px) with individual fields taking equal width. On mobile they stack vertically.
- **Tables** are always wrapped in a `PageCard` or `AccordionCard` and use `ReportDataTable` — never bare HTML tables.
- **Banners** (`Banner.vue`) are only rendered for external users (the component checks `isExternal` internally).
- **`ap-section`** is a Plan Explorer-specific card pattern (bordered, 8px radius) used for all wizard step content sections.

---

## 4. Pages Reference

### 4.1 Home Page

- **Route:** `/`
- **Access:** Internal and External
- **Description:** Dashboard landing page showing a personalized welcome message and key activity summaries.

**Key Features:**
- Warning `Banner` for CAA RxDC report deadlines (external users only).
- Three `SummaryWidget` KPI cards: Pending Approvals, High-Cost Claims, Prior Authorizations. Each is clickable and navigates to the relevant page.
- Two-column layout: `ImplementationStatusChart` (horizontal bar — New, In Progress, Pending Action, Completed) and `UpcomingImplementationsTable` (next 90 days with a "View All" button).
- `AccordionCard` wrapping a `ReportDataTable` (Report Explorer) with filter pills for All, Quarterly, Monthly, Ad-Hoc, Rebate, CAA, and a Pending Approval status pill.

---

### 4.2 Approvals Page

- **Route:** `/approvals`
- **Access:** Internal only (hidden from sidebar for external users)
- **Description:** Review and approve reports pending internal sign-off.

**Key Features:**
- Four `SummaryWidget` KPIs: Quarterly, Monthly, Ad-Hoc, Annual report counts (computed from table items).
- `PageCard` containing a `ReportDataTable` with columns: Account Name, Report Name, Type, Reporting Period, Last Edited By, Status, Actions.
- Filter pills: All, Quarterly, Monthly, Ad-Hoc, Annual.
- Row actions menu (View, Download) on each row.

---

### 4.3 Reports Page

- **Route:** `/reports`
- **Access:** Internal and External (different chart sets shown)
- **Description:** Browse and manage all available reports with user-type-specific analytics.

**Key Features:**
- **External view:** Two charts side by side — `ReportStatusChart` (donut) and `ReportsByTypeChart` (bar).
- **Internal view:** KPI column (`TotalPendingChart`, `AvgApprovalTimeChart`) plus `ReportsByAccountChart` (horizontal bar showing top 5 accounts with pending reports).
- `PageCard` with `ReportDataTable`. External users see additional columns: Approved By, Approved Date.
- Filter pills: All, Quarterly, Monthly, Rebate, CAA, Pending Approval.

---

### 4.4 Documents Page

- **Route:** `/documents`
- **Access:** Internal and External (slightly different tab sets and descriptions)
- **Description:** View, download, and upload documents organized by category.

**Key Features:**
- `PageCard` with `Tabs` component.
- **Tabs:** All Documents, PHI Documents, MAC Appeals, Billing, Notifications, Document Uploader.
- "All Documents" and category tabs show a `ReportDataTable` with search enabled.
- "MAC Appeals" tab uses a different column set (File Name, Date Added).
- "Document Uploader" tab shows `FileUploader` above a table of recently uploaded documents with clickable document name links.
- Internal users see a broader description ("Select and upload documents..."); external users see "View and download documents...".
- Search is real-time, filtering the visible table in-place as the user types.

---

### 4.5 High-Cost Claims Page

- **Route:** `/high-cost-claims`
- **Access:** Internal and External (different action modes)
- **Description:** Review claims where ingredient cost exceeds the account's notification threshold.

**Key Features:**
- **External users only:** Three `SummaryWidget` KPIs: Claims Pending Approval, Total Cost, Average Claim Cost.
- Bar chart: Top 5 Accounts by High-Cost Claim Amount (ApexCharts).
- Warning `Banner` inside the `PageCard` reminding users to acknowledge within 24 hours.
- **External users:** Action icon row per claim (Approve `CircleCheckBig`, Reject `BanknoteX`, Request Info `Info`). Icons are color-coded by status (approved = green, rejected = red, others = text-primary). Disabled styling applied for non-applicable actions on resolved claims.
- **Internal users:** "Information Requested" link shown in the actions column (clickable only when status is Pending or Rejected).
- Four dialog modals: Approve, Reject, Internal Info Acknowledged, External Request Info.

---

### 4.6 Prior Authorizations Page

- **Route:** `/prior-auths`
- **Access:** Internal and External
- **Description:** View prior authorization requests for member medications.

**Key Features:**
- Table-based view of PAs (EOC ID, Drug Name, Status, Submission Date, Account Name).
- Request Info action per row.

---

### 4.7 Billing Page

- **Route:** `/billing`
- **Access:** Internal and External
- **Description:** View and download invoices and statements, with a trend chart.

**Key Features:**
- Area chart (ApexCharts) showing Billed Amount Over Time. Data is derived from the billing table items — amounts are summed by billing period and sorted.
- `PageCard` labeled "Statement and Invoice Explorer" with `ReportDataTable`.
- Columns: Account Name, Billing Type, ID, Invoice/Statement Detail, Billing Period, Amount.
- Filter pills: All, Invoice, Statement.
- Row actions (View, Download) via ellipsis menu.

---

### 4.8 Plan Explorer Page

- **Route:** `/plan-explorer`
- **Access:** Internal and External
- **Description:** Track account implementation progress. Presents either a wizard-based Implementation Tracker or a Group Account Profile (GAP) view depending on the selected account's status.

See [Section 6](#6-plan-explorer--detailed-reference) for full details.

---

### 4.9 Test Results Page

- **Route:** `/test-results`
- **Access:** Internal and External
- **Description:** Review configuration test results (plan design tests, eligibility tests, etc.) with approve/reject actions.

**Key Features:**
- `ReportDataTable` with columns: Account Name, Report Type, Report, Date Range, Status, Approved By, Approved Date.
- Approve and reject dialogs per row.

---

### 4.10 Added Value Page

- **Route:** `/added-value`
- **Access:** Internal and External
- **Description:** Explore and request information on added value programs (wellness, savings, specialty).

**Key Features:**
- Card grid of available programs (Anti-Obesity Management, Liviniti Pharmacogenomics, etc.) with selection state.
- "In Use" section listing already-enrolled programs.
- "Request Details" action to prompt account manager follow-up.

---

### 4.11 Settings Page

- **Route:** `/settings`
- **Access:** Internal and External
- **Description:** Manage account-level configuration. Requires account selection via `AccountSelector`.

**Tabs:**

| Tab Key | Label | Contents |
|---|---|---|
| `company-information` | Company Information | General Information (company name, DBA) and High Cost Notification Settings (threshold with $ prefix) |
| `user-administration` | User Administration | `ReportDataTable` with boolean columns (Activated, Main POC, Survey Contact), user roles and permissions |
| `caa-drug-cost-reporting` | CAA Drug Cost Reporting | Group health plan #, carve-out benefit, Form 5500 plan #, states (multi-select autocomplete), market segment, plan year dates, member count |
| `caa-gag-clause` | CAA Gag Clause Attestation | Attestation form |
| `claim-edit-rules` | Claim Edit Rules | `ReportDataTable` with change log slot |

All editable fields use `TextField` in readonly mode by default; clicking "Edit" switches them to writable mode. Save/Cancel actions are shown only when editing. Changes are tracked via dirty-state detection (`isCompanyChanged` computed).

---

## 5. Component Library

### 5.1 Common Components (`components/common/`)

#### AccordionCard.vue

Collapsible section card using Vuetify `v-expansion-panels`. Chevron animates between right (collapsed) and up (expanded).

| Prop | Type | Default | Description |
|---|---|---|---|
| `headerText` | String | `'Accordion Card'` | Title displayed in the panel header |
| `descriptionText` | String | `''` | Subtitle below the title |
| `showChevron` | Boolean | `true` | Whether to show the expand/collapse chevron |

| Slot | Description |
|---|---|
| `content` | Content rendered inside the expanded panel |

---

#### AccountPrescriptionCard.vue

Card displaying account and prescription summary information.

| Prop | Type | Required | Description |
|---|---|---|---|
| `accountName` | String | Yes | Account name |
| `carrier` | String | Yes | Carrier name |
| `livesCovered` | Number | Yes | Number of lives covered |
| `startDate` | String | Yes | Coverage start date |
| `endDate` | String | Yes | Coverage end date |
| `routingBin` | String | Yes | Routing BIN |
| `status` | `'active' \| 'inactive' \| 'implementing'` | Yes | Account status |

---

#### AccountSelector.vue

Page-level header component combining a heading/subheading with a `Select` dropdown. Used on Settings and Plan Explorer to provide account-scoped context for the page below.

| Prop | Type | Required | Description |
|---|---|---|---|
| `heading` | String | Yes | H1 page title |
| `subheading` | String | Yes | Descriptive subtitle |
| `items` | Array | Yes | Account list for the dropdown |
| `label` | String | Yes | Dropdown field label |
| `itemTitle` | String | Yes | Object key for display text |
| `itemValue` | String | Yes | Object key for bound value |
| `searchable` | Boolean | Yes | Enables typeahead search in dropdown |
| `modelValue` | any | Yes | v-model value |
| `showSlot` | Boolean | No (`false`) | When true, renders the default slot below the header row |
| `variant` | String | No | Variant passed to the inner Select |

| Slot | Description |
|---|---|
| `default` | Content rendered in a full-width row below the selector header (only when `showSlot` is true) |

---

#### AvgApprovalTimeChart.vue

KPI card showing average report approval time. No props.

---

#### Banner.vue

Informational or warning banner. **Only renders for external users** — the component internally checks `isExternal` via `useUserType()` and returns nothing for internal users.

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `variant` | `'info' \| 'warning'` | Yes | — | Controls color scheme and icon |
| `message` | String | Yes | — | Banner text (rendered as `v-html`, supports HTML) |
| `infoIcon` | Component | No | `Info` (Lucide) | Icon for the info variant |
| `showButton` | Boolean | No | `false` | Whether to render an action button |
| `buttonProps` | Object | No | `{}` | Props forwarded to the inner `Button` component |

**Styling:**
- `info` variant: navy border, `$color-information-background` fill.
- `warning` variant: amber border, `$color-warning-background` fill.

---

#### ImplementationStatusChart.vue

Horizontal bar chart showing implementation counts by phase.

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `data` | Object | Yes | — | Shape: `{ new, inProgress, pendingAction, completed }` |
| `headerText` | String | No | `'Implementations Overview'` | Chart title |

---

#### PageCard.vue

Standard page section wrapper with a header row and content area. The header row uses flexbox and includes a `header-end` slot for appending badges or buttons inline with the title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `headerText` | String | `'Reports Awaiting Approval'` | Section title (styled as `.text-h2`, primary color) |
| `descriptionText` | String | `'View and approve reports...'` | Subtitle paragraph below the title |

| Slot | Description |
|---|---|
| `default` | Main card content |
| `header-end` | Appended to the right of the header text (used by Plan Explorer for the "Active" badge) |

---

#### ReportDataTable.vue

The core data table used across all pages. Wraps Vuetify `v-data-table` with search, filtering, selection, and action patterns. Supports dynamic slot passthrough for custom cell rendering.

| Prop | Type | Default | Description |
|---|---|---|---|
| `headers` | Array | required | Column definitions for `v-data-table` |
| `items` | Array | `[]` | Row data |
| `showSearchBar` | Boolean | `true` | Show the `SearchBar` above the table |
| `showFilterButton` | Boolean | `true` | Show the filter button inside the search bar |
| `showFilterPills` | Boolean | `true` | Show `FilteringPill` chips above the table |
| `initialFilterPills` | Array | `[]` | Initial set of filter pill definitions |
| `showSelectionCheckboxes` | Boolean | `true` | Show row-level selection checkboxes |
| `showRowActions` | Boolean | `true` | Show the ellipsis menu with View/Download actions |
| `showTableFooter` | Boolean | `true` | Show pagination footer |
| `showActionIcons` | Boolean | `false` | Show inline icon buttons per row (external user claim actions) |
| `actionIcons` | Array | `[]` | Icon definitions: `{ icon, tooltip, onClick, type }` |
| `searchPlaceholder` | String | `'Search by report name...'` | Search bar placeholder text |
| `showInternalUserActions` | Boolean | `false` | Show a text-based action link column for internal users |
| `internalUserActionFormatter` | Function | `() => '-'` | Returns display text for the action cell given a row item |
| `internalUserActionClickHandler` | Function | `() => {}` | Click handler for the action link |
| `booleanColumns` | Array | `[]` | Column keys to render as readonly checkboxes instead of text |
| `actionsClass` | String | `''` | CSS class appended to the actions cell `div` (used to override alignment) |
| `emptyStateText` | String | `'No data found.'` | Text shown in the empty state |
| `showExpand` | Boolean | `false` | Enable expandable rows |
| `itemValue` | String | `'id'` | Key used by Vuetify for row identity |

| Slot | Description |
|---|---|
| `item.{columnKey}` | Custom cell renderer for any column. Passes `{ item }`. |
| `item.ruleChangeLog` | Dedicated slot for the change log column (Settings page) |
| `expanded-row` | Content for expanded rows when `showExpand` is true |
| `empty-state` | Replaces the default empty-state illustration |

**Action icon behavior:** When `showActionIcons` is true, icon color is set to `$color-approved` (green) for an Approved status row with the `approve` type icon, and `$color-denied` (red) for a Rejected row with the `reject` type icon. Other icons are dimmed on resolved rows.

**Filter pill behavior:** Pills with `type: 'tab'` filter by the `type` column. Pills with `type: 'status'` filter by the `status` column. The active pill highlights and all items are shown when the "All" pill is active.

---

#### ReportsByAccountChart.vue / ReportsByTypeChart.vue / ReportStatusChart.vue

ApexCharts-based visualization components. No configurable props.

---

#### SummaryWidget.vue

KPI summary card with optional icon, colored icon background, and click navigation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | String | required | Widget heading |
| `count` | String or Number | required | Large KPI value |
| `description` | String | required | Subtitle below the count |
| `showIcon` | Boolean | `false` | Whether to render the icon |
| `icon` | Component | `Flame` | Lucide icon component |
| `iconBackgroundColor` | String | `'transparent'` | Background color of icon wrapper circle |
| `iconColor` | String | `'var(--color-primary)'` | Icon stroke/fill color |
| `clickable` | Boolean | `true` | Adds cursor pointer and emits click events |

---

#### Tabs.vue

Horizontal tab bar used on Documents and Settings pages.

| Prop | Type | Description |
|---|---|---|
| `tabs` | Array | Array of `{ label, key, count?, hasDropdown? }` objects |

Emits `tab-selected` with the selected tab `key`.

---

#### TotalPendingChart.vue

KPI card for total pending reports (internal users). No props.

---

#### UpcomingImplementationsTable.vue

Table of upcoming implementations within the next 90 days.

| Prop | Type | Default | Description |
|---|---|---|---|
| `headerText` | String | `'Upcoming Implementations Next 90 Days'` | Card heading |
| `showViewAllButton` | Boolean | `false` | Show a "View All" button in the header |

---

### 5.2 Layout Components (`components/layout/`)

#### Sidebar.vue

Persistent left navigation drawer, 120px wide. Each nav item renders a Lucide icon centered above a text label. The active route item is highlighted.

Navigation items are filtered based on user type:
- The `Approvals` item is hidden for external users.
- Settings and Logout are always shown at the bottom, separated by a divider.

Nav items and their icons:

| Title | Route | Icon |
|---|---|---|
| Home | `/` | `House` |
| Approvals | `/approvals` | `CircleCheckBig` (internal only) |
| Reports | `/reports` | `FileChartColumnIncreasing` |
| Documents | `/documents` | `FileText` |
| High-Cost Claims | `/high-cost-claims` | `Tablets` |
| Prior Auths | `/prior-auths` | `RotateCcwKey` |
| Billing | `/billing` | `ScrollText` |
| Plan Explorer | `/plan-explorer` | `Blocks` |
| Test Results | `/test-results` | `CircleGauge` |
| Added Value | `/added-value` | `Blocks` |
| Settings | `/settings` | `MonitorCog` |

---

#### Header.vue

Top app bar (`v-app-bar`) with a flat white background and a bottom border.

- **Left:** Spacer.
- **Center-right:** Outlined "Fiduciary Dashboard" button (pill shape).
- **Right:** User avatar (`v-btn icon`) with dropdown menu containing Profile and Logout items.

No props.

---

### 5.3 UI Components (`components/ui/`)

#### Autocomplete.vue

Thin wrapper around `v-autocomplete` with project font and spacing overrides.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | required | Autocomplete options |
| `label` | String | `''` | Field label |
| `multiple` | Boolean | `false` | Allow multiple selections |
| `readonly` | Boolean | `false` | Read-only mode |
| `modelValue` | any | — | v-model |
| `variant` | String | `'outlined'` | Vuetify input variant |
| `density` | String | `'compact'` | Vuetify density |

---

#### Breadcrumbs.vue

Auto-generates breadcrumb trail from the current Vue Router route using `meta.breadcrumb`. No props.

---

#### Button.vue

Custom button with four visual variants. Always title-case (no text-transform). See [Section 3.4](#34-button-variants) for variant details.

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `variant` | `'alert' \| 'primary' \| 'secondary' \| 'thirtiary'` | Yes | — | Visual style |
| `label` | String | Yes | — | Button text |
| `disabled` | Boolean | No | `false` | Disabled state |
| `textColor` | String | No | `var(--color-primary)` | Text color override (secondary variant) |
| `showIcon` | Boolean | No | `false` | Show an optional icon |
| `icon` | Object | No | `null` | Lucide icon component |

Note: The `thirtiary` variant always renders a `Pencil` icon regardless of `showIcon`/`icon`.

---

#### Card.vue

Generic card component with optional title, subtitle, text, and action buttons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | String | `''` | Card title |
| `subtitle` | String | `''` | Card subtitle |
| `text` | String | `''` | Body text |
| `actions` | Array | `[]` | Button definitions for the card footer |
| `selected` | Boolean | `false` | Highlighted/selected state |
| `selectable` | Boolean | `false` | Whether the card responds to click selection |
| `variant` | `'default' \| 'checkbox'` | `'default'` | Card variant |
| `flat` | Boolean | `false` | Remove box shadow |

| Slot | Description |
|---|---|
| `default` | Custom card body content |

---

#### ComboBox.vue

Wrapper around `v-combobox` with optional search filtering.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | required | Options |
| `label` | String | `'Select'` | Field label |
| `modelValue` | any | — | v-model |
| `searchable` | Boolean | `false` | Enable search filtering |
| `itemTitle` | String | `'title'` | Display key |
| `itemValue` | String | `'value'` | Value key |
| `noDataText` | String | `'No data available'` | Empty state text |
| `variant` | String | `'outlined'` | Vuetify variant |

---

#### DatePicker.vue

Date picker combining a text field with a calendar popover. Bound value is formatted as `DD/MM/YYYY`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | String | `''` | Field label |
| `modelValue` | String | `''` | v-model (DD/MM/YYYY) |
| `readonly` | Boolean | `false` | Read-only mode |
| `color` | String | `'primary'` | Calendar color |
| `variant` | String | `'outlined'` | Input variant |
| `density` | String | `'compact'` | Input density |

---

#### Dialog.vue

Modal dialog with configurable heading, optional icon, body slot, and action buttons. Max width 800px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | Boolean | required | Controls dialog open/close (use with `v-model`) |
| `persistent` | Boolean | `false` | Prevent closing by clicking outside |
| `icon` | LucideIcon | — | Icon shown left of the heading |
| `heading` | String | required | Dialog title |
| `text` | String | — | Optional body text (rendered as a `<p>` above the slot) |
| `actions` | Array | `[]` | Button definitions: `{ text, onClick, styleType?, color?, variant?, type? }` |
| `showSecondaryButton` | Boolean | `false` | When false, only the last action button is shown |

| Slot | Description |
|---|---|
| `default` | Custom dialog body content |

**Action button styling:** `styleType: 'primary'` → elevated primary button; `styleType: 'secondary'` → outlined primary button; `type: 'destructive'` → red elevated button.

---

#### FileUploader.vue

Drag-and-drop file upload zone with optional document type pill selection.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showDocumentTypeSelection` | Boolean | `true` | Show PHI / Accounting / Invoice / Notification type pills above the dropzone |

The dropzone displays `UploadIllustration.png` from `src/assets/`. On drag-over, the background lightens to `rgba($color-primary, 0.05)`. File handling (`handleFiles`) currently logs to the console — actual upload logic is a TODO.

Document type options: `PHI`, `Accounting / General`, `Accounting / Invoice`, `Notification Files`.

---

#### FilteringPill.vue

Chip used as a filter toggle. Active state changes its visual treatment.

| Prop | Type | Default | Description |
|---|---|---|---|
| `closable` | Boolean | `false` | Show a close/remove button on the chip |
| `isActive` | Boolean | `false` | Whether the pill is in active/selected state |

---

#### MobileNavigation.vue

Bottom navigation bar for mobile viewports. No documented props.

---

#### SearchBar.vue

Search input with an optional filter button and/or search button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | String | `'Search by report name, report type, or keyword'` | Input placeholder |
| `showFilterButton` | Boolean | `true` | Show the filter icon button |
| `showSearchButton` | Boolean | `false` | Show an explicit search button |

Emits `update:searchTerm` with the current input value on each keystroke.

---

#### Select.vue

Wrapper around `v-select` with project font overrides, optional typeahead search, and `ChevronDown` menu icon.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | required | Select options |
| `label` | String | `'Account'` | Field label |
| `modelValue` | any | — | v-model |
| `searchable` | Boolean | `false` | Enable typeahead filtering |
| `itemTitle` | String | `'title'` | Display key |
| `itemValue` | String | `'value'` | Value key |
| `noDataText` | String | `'No data available'` | Empty state text |
| `variant` | String | `'outlined'` | Vuetify variant |

---

#### TextField.vue

Wrapper around `v-text-field`. Adds a `v-tooltip` that activates only when the field text is truncated (scrollWidth > clientWidth), providing full text on hover.

| Prop | Type | Default | Description |
|---|---|---|---|
| `readonly` | Boolean | `false` | Read-only mode (still shows outlined variant) |
| `modelValue` | String | — | v-model |

All other Vuetify `v-text-field` attributes pass through via `v-bind="$attrs"` (with `inheritAttrs: false`).

---

## 6. Plan Explorer — Detailed Reference

### 6.1 Overview

The Plan Explorer page (`/plan-explorer`) is the most complex page in the application. It presents a different view depending on which account is selected:

- **Implementing accounts** (e.g., Stark Industries, ID = 1): Shows an Implementation Tracker with a vertical timeline on the left and a wizard-based configuration panel on the right.
- **Active/fully-implemented accounts** (e.g., Wayne Enterprises, ID = 2): Shows the Group Account Profile (GAP) view — a read-only structured view of the live account configuration.

Account selection is handled via `AccountSelector` at the top of the page.

### 6.2 Implementation Tracker Path (Stark Industries)

When Stark Industries (or any non-Wayne-Enterprises account) is selected, the page renders a two-column layout inside a `PageCard`:

- **Left column (3/12):** Vertical `v-timeline` listing all implementation phases. The timeline is sticky when the wizard is active.
- **Right column (9/12):** Detail panel for the selected timeline item.

**Implementation Timeline Steps (mock data):**

| Step | Status | Description |
|---|---|---|
| Plan Setup | completed | Initial setup of account configurations |
| Contract Status | in-progress | Review and finalization of contractual agreements |
| IT Integration | pending | Technical system integrations |
| Testing | pending | Test configuration against test claims |
| Go Live | pending | Production launch |
| Post Go-Live Support | pending | Monitoring and support after launch |

Clicking a timeline item reveals its detail card on the right. When the **Plan Setup** step is selected, a nested sub-step list appears below it in the timeline, showing all 9 wizard steps with their completion status.

### 6.3 Plan Setup Wizard

The wizard is a 9-step guided form for configuring a new account's plan settings. It is activated when "Plan Setup" is selected in the timeline for an implementing account (Stark Industries path).

**Wizard UI:**
- Top of right panel: step counter ("Step X of 9"), optional "Required" badge, step title (`.text-h2`), and description.
- Step content rendered below in `ap-section` cards (bordered, 8px radius).
- Footer: Previous button (left) | Mark as Complete + Next/Finish buttons (right).

**Step Completion Flow:**
- Clicking **Next** advances to the next step and marks the current step as `'in-progress'` if it was `'not-started'`.
- Clicking **Mark as Complete** sets the step's `status` to `'complete'` and auto-advances to the next step. The button is hidden once a step is complete.
- On Step 9, "Next" is replaced by **"Finish Plan Setup"**, which exits the wizard and navigates to the Contract Status timeline item.

**Wizard Steps:**

| Step # | Name | Required | Description |
|---|---|---|---|
| 1 | Account Profile | Yes | Confirm account details, effective dates, flags (IsRxWatchtower, Manual Claims) and company address |
| 2 | Network Configuration | Yes | Define pharmacy networks (Preferred Networks table with filter pills) and Preferred Pharmacies (tabbed empty states with Assign button) |
| 3 | Plan Design | Yes | Create and configure benefit plans. Each plan has an accordion with sub-sections: Plan Overview, Plan Parameters, Plan Max Spend Parameters (toggle), Coordination of Benefits, Applicable Benefit Period, BPG Configuration (table), Associated Plan Codes (table), Associated Benefit Codes (table) |
| 4 | Transition of Care | No | Set up transition rules for members moving from another plan |
| 5 | Programs | No | Select and configure clinical and specialty programs |
| 6 | Limits and Controls | No | Refill Too Soon thresholds (retail/mail), Max Claim Days, Max Day Supply, Max Dollar limits, and a multi-select list of override types |
| 7 | Billing | No | Configure billing preferences, payment terms, and invoice settings |
| 8 | ID Cards | No | Vendor configuration with tabbed layout (Carrier, Mail Service, Specialty). Carrier tab shows Carrier Branding Information card with Liviniti logo, service numbers, BIN/PCN/Group Number, and a Download Kit button. Walgreens disclaimer banner shown above branding card. Mailing Preference section below a divider. |
| 9 | Verification and Summary | No | Completion overview grid showing all 8 prior steps with: left border color (green = complete, amber = in-progress/not-started), status badge, Edit button. Completion percentage displayed in amber or green (100%). "Finish Plan Setup" button. |

**Sidebar sub-step indicators:** Completed steps in the timeline sub-step list show a green checkmark icon and green text instead of a step number.

### 6.4 Group Account Profile (GAP) Path — Wayne Enterprises

When Wayne Enterprises (ID = 2) is selected, the page card title becomes **"Plan Configuration for Wayne Enterprises"** with an "Active" badge in the header-end slot. No description text is shown.

The two-column wizard layout is replaced by a read-only GAP view:

- **Account meta line:** Building icon, account name + number ("Wayne Enterprises – 11250"), effective date ("Effective: 01/01/2026").
- **Full-width search bar:** Plain input with a search icon for filtering fields within the GAP.
- **5 accordion rows:** Each row shows an icon, label, and chevron-down. Content for expanded sections is not yet implemented.

| Section | Icon |
|---|---|
| Account Information | `Building2` |
| Plan Design | `Shield` |
| Benefit Information | `Link2` |
| Account Contacts | `Users` |
| Third Party Vendors | `FileText` |

### 6.5 Account Options

The `accountOptions` array in `PlanExplorerPage.vue` defines the selectable accounts. Constants:
- `STARK_INDUSTRIES_ID = 1` — triggers the Implementation Tracker / wizard path.
- `WAYNE_ENTERPRISES_ID = 2` — triggers the GAP view path.

---

## 7. Security and Compliance

> All security rules are defined in `.ai-rules/security-rules.md`. The implementation is planned but not yet wired into the application. The notes below describe the target architecture.

### 7.1 Authentication — Okta PKCE

The planned authentication system uses **Okta** with **OAuth 2.0 Authorization Code Flow + PKCE**:

```ts
const oktaConfig: OktaConfig = {
  issuer: 'https://your-domain.okta.com/oauth2/default',
  clientId: process.env.VITE_OKTA_CLIENT_ID,
  redirectUri: 'https://your-app.com/callback',
  scopes: ['openid', 'profile', 'email', 'pbm:read', 'pbm:write'],
  pkce: true,
  responseType: 'code'
};
```

Key requirements:
- `pkce: true` is **mandatory**.
- State parameter must be cryptographically generated (`crypto.randomUUID()`) and validated on callback.
- Nonce must be validated in the ID token payload.

### 7.2 Token Management

| Rule | Requirement |
|---|---|
| Access token storage | In-memory only (`ref<TokenStore>`). Never in `localStorage` or `sessionStorage`. |
| Refresh token storage | httpOnly cookie only |
| Token refresh | Automatic check every 60 seconds; proactive refresh with a 5-minute buffer |
| Refresh failure | Force logout and redirect to login |

### 7.3 Session Management

| Setting | Value |
|---|---|
| Idle timeout | 30 minutes |
| Warning before timeout | 5 minutes |
| Maximum session time | 8 hours |

On logout: tokens are revoked with Okta, all in-memory token state is cleared, Pinia user store is cleared, and the browser is redirected to the Okta logout endpoint.

### 7.4 Role-Based Access Control (RBAC)

Two user roles exist: `'internal'` and `'external'`. Planned fine-grained permissions via `UserPermissions` interface:

```ts
interface UserPermissions {
  canViewReports: boolean;
  canEditReports: boolean;
  canDeleteReports: boolean;
  canViewAllEntities: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
  entityIds: string[]; // For external users — scoped to specific accounts
}
```

Route guards will check `to.meta.permission` against the current user's permissions before navigation. The `usePermissions` composable scaffolds `hasPermission`, `hasEntityAccess`, and `canAccessResource` helpers.

**Current state:** User type toggling is implemented in the Pinia store and reflected in the UI (sidebar, charts, table columns, banners). Full RBAC guard wiring is not yet implemented in the router.

### 7.5 HIPAA and PHI Protection

The application handles pharmacy benefit data subject to HIPAA. PHI field categories:

```
firstName, lastName, middleName, ssn, dateOfBirth, phoneNumber, email,
address, city, state, zipCode, medicalRecordNumber, accountNumber, licenseNumber
```

Planned protections:
- **Data masking** composable (`useDataMasking`) for SSN (XXX-XX-XXXX), phone, email, and credit card patterns.
- **Audit trail** (`useAuditLogger`) logging ACCESS, MODIFY, DELETE, and EXPORT events with userId, entityId, resourceType, IP address, and timestamp.
- **Secure error handling:** Internal error details are never exposed to users. User-facing messages are generic and action-oriented.
- **Security event logging** (`useSecurityLogger`) for LOGIN, LOGOUT, PERMISSION_DENIED, and SUSPICIOUS_ACTIVITY events.

### 7.6 API Security

All API requests will use a secure Axios client with:
- `Authorization: Bearer {token}` header injected via request interceptor.
- Token validity checked before each request (auto-refresh if expired).
- 401 response triggers immediate logout.
- Request data sanitized to remove `__proto__`, `constructor`, and `prototype` keys.

### 7.7 Browser Security

Planned Content Security Policy:

```
default-src 'self'
script-src 'self' 'unsafe-inline'
connect-src 'self' https://your-domain.okta.com
frame-ancestors 'none'
```

Required security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`.

All sensitive configuration (Okta issuer, client ID, API base URL) must be provided via environment variables (`VITE_OKTA_ISSUER`, `VITE_OKTA_CLIENT_ID`, `VITE_API_BASE_URL`) — never hardcoded.

---

## 8. Developer Guide

### 8.1 Prerequisites

- Node.js v18 or higher
- npm (included with Node.js)

### 8.2 Setup

```bash
git clone <repository-url>
cd 'Client Portal 2.0/frontend'
npm install
```

### 8.3 Running Locally

```bash
npm run dev
```

The application starts on **http://localhost:3000** (Vite is configured for port 3000).

### 8.4 Building for Production

```bash
npm run build
```

Output is placed in `frontend/dist/`. The build generates optimized, tree-shaken assets.

### 8.5 Switching User Types in Development

A toggle switch is visible in the bottom-right corner of the screen in development mode. Flipping it between "Internal User" and external changes the Pinia `userType` state, which cascades through all `useUserType()` consumers to show the correct UI variant.

### 8.6 Conventions

#### Naming
- Component files: `PascalCase.vue`
- Composable files: `useCamelCase.ts`
- Store files: `camelCase.ts`
- SCSS variables: `$kebab-case`
- CSS classes: `.kebab-case`

#### Styling
- Never add inline styles except for dynamic bindings (`:style`).
- Never introduce new CSS frameworks or override Vuetify's design tokens directly.
- Always use SCSS variables from `style.scss` for colors, spacing, and typography.
- Component-specific styles go in `<style lang="scss" scoped>` blocks with `@import '@/style.scss'` at the top.

#### Component Usage Rules
- Use existing components from `components/common/` and `components/ui/` before building anything new.
- `ReportDataTable` for any tabular data display. Never use bare `<table>` elements.
- `PageCard` or `AccordionCard` as section wrappers.
- `Dialog` for all modal interactions.
- `Banner` for page-level notices (renders only for external users automatically).

#### Buttons
- Use `Button.vue` for standalone actions.
- For Vuetify-integrated contexts (dialogs, form footers), `v-btn` with `color="primary"` and `variant="elevated"` or `variant="outlined"` is acceptable.
- All button labels must be title-case. No ALL CAPS.

### 8.7 Adding a New Page

1. Create `frontend/src/views/NewPageName.vue`.
2. Add the route in `frontend/src/router/index.ts`:
   ```ts
   { path: '/new-page', name: 'NewPage', component: NewPagePage, meta: { breadcrumb: 'New Page' } }
   ```
3. Add a nav item to the `navItems` array in `Sidebar.vue` with the appropriate Lucide icon.
4. If the page is internal-only, add a filter condition in `filteredNavItems`.

### 8.8 Adding a New Component

1. Determine tier: `components/ui/` for generic/atomic, `components/common/` for app-specific.
2. Create the `.vue` file using `<script setup lang="ts">` with typed props via `defineProps<Props>()`.
3. Use `withDefaults` for optional props.
4. Add a `<style lang="scss" scoped>` block importing `'@/style.scss'`.
5. Document props in this file.

### 8.9 Testing

No tests currently exist. The planned approach:

- **Framework:** Vitest (compatible with Vite, fast HMR-aware runner).
- **Component tests:** `@vue/test-utils` for mounting and asserting component behavior.
- **Unit tests:** Cover composables, services, and utility functions.
- **Test file location:** Co-located with the file under test (`MyComponent.spec.ts` next to `MyComponent.vue`).
- **Security tests:** Token storage assertions, permission validation, PHI masking validation.

### 8.10 Branching and Contribution

1. Create a branch per feature or fix: `feature/plan-explorer-step-9` or `bugfix/dialog-close`.
2. Write clear commit messages describing the "why".
3. Open a pull request to `main`.
4. At least one peer review and approval required before merge.

---

## 9. API Reference

> All service integrations are stubs. No backend is connected. The endpoints below describe the planned contract between the frontend and the future backend.

### 9.1 Authentication

All auth endpoints will be replaced by Okta PKCE flow. The entries below are legacy placeholders from early planning.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/session` | Get current user session and type |
| `POST` | `/api/auth/login` | Authenticate (will be replaced by Okta redirect) |
| `POST` | `/api/auth/logout` | Terminate session |

The planned Okta integration will use OAuth 2.0 Authorization Code + PKCE. User type (`internal`/`external`) will be derived from Okta claims/groups.

### 9.2 Home Page

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/home` | Returns welcome message, summary widgets, implementation status, upcoming implementations, and report explorer data |

### 9.3 Reports

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports` | List reports. Query params: `search`, `type`, `status`, `discriminator` |

**Backend notes:** Data sourced from `dbo.Reports` (PbmOperations). `IsApproved = 1` for approved, `0` for pending. `IsDeleted` must be filtered. `Discriminator` enables period-scoped queries (e.g., Q1 2024 Quarterly).

### 9.4 Approvals

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/approve-reports` | Set `IsApproved` flag, record who approved and when |

**Backend notes:** `dbo.Reports.ApprovedBy`, `dbo.Reports.EditedDate`. Denied reports should trigger deletion (`IsDeleted = 1`) and require re-generation.

### 9.5 High-Cost Claims

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/high-cost-claims` | List claims, summary stats, and top-5 accounts chart data |
| `PUT` | `/api/high-cost-claims/{claimId}` | Update claim status (approve/reject) |

**Backend notes:** Source: `PbmOperations.PHI.PriorAuthorizationsAgadia` (filter by `IngredientCost > ACT.Accounts.HighCostClaimNotifyAmount`). Client sign-off candidates: `NextStep = 'Client Sign-off'`. Final outcome: `Outcome` field.

### 9.6 Prior Authorizations

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prior-auths` | List PAs with summary |
| `POST` | `/api/prior-auths/{authId}/request-info` | Request additional info for a PA |

**Backend notes:** Source: `PbmOperations.PHI.PriorAuthorizationsAgadia` filtered by `AccountId`. Field mappings: `EocId → EocId`, `ServiceName → DrugName`, `Outcome → Status`, `EventStartDate → SubmissionDate`.

### 9.7 Documents

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents` | List documents. Query param: `category` |
| `POST` | `/api/documents/upload` | Upload document (`multipart/form-data`) |

### 9.8 Settings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/settings/accounts/{accountId}` | Get account settings |
| `PUT` | `/api/settings/accounts/{accountId}` | Update account settings |
| `GET` | `/api/settings/user-admin` | Get user administration data |
| `GET` | `/api/settings/claim-edit-rules` | Get claim edit rules |

**Backend notes:** Account fields come from `ACT.Accounts` and `ACT.AccountAddressXRef`. User admin will be Auth0-driven after redesign.

### 9.9 Plan Explorer

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/plan-explorer/accounts/{accountId}/steps` | Get implementation steps and statuses |
| `PUT` | `/api/plan-explorer/steps/{stepId}` | Update step status |

### 9.10 Added Value

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/added-value/programs` | List all available programs |
| `GET` | `/api/added-value/accounts/{accountId}/programs` | Get programs in use and available for account |
| `POST` | `/api/added-value/programs/request-details` | Submit interest in selected programs |

### 9.11 Billing

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/billing` | List billing records and chart data |

### 9.12 Test Results

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/test-results` | List test results |
| `PUT` | `/api/test-results/{resultId}` | Approve or reject a test result |

---

## 10. QA Notes

### 10.1 Known Issues and Limitations

| Area | Issue | Status |
|---|---|---|
| General | All data is mock/hardcoded — no real data is displayed | By design (frontend-only phase) |
| Auth | No real authentication — user type toggled via dev switcher | By design |
| FileUploader | `handleFiles()` only logs to console; no actual upload logic | TODO |
| Plan Explorer — GAP view | Expanded accordion content for Wayne Enterprises sections not implemented | TODO |
| Dialog — `text` prop | Renders correctly as `<p>` above the default slot | Fixed (CHANGELOG 2025-08-08) |
| SettingsPage | Save functionality wired: `updateCompanyField`, `updateCaaField` | Fixed (CHANGELOG 2025-08-08) |
| FileUploader asset path | `UploadIllustration.png` — lowercase filename required | Fixed |
| ReportDataTable | `actionsClass` prop added for per-use alignment overrides | Fixed |
| Plan Explorer wizard footer | "Back to Overview" button removed; "Submit for Review" renamed to "Finish Plan Setup" | Updated (CHANGELOG 2026-03-12) |
| Prior Auths page | Basic table view only; no dialog interactions yet implemented | Open |
| Test Results page | Basic table; approve/reject dialogs referenced but not fully detailed in this phase | Open |
| Header avatar | Currently uses a hardcoded `randomuser.me` image URL | TODO — replace with authenticated user avatar |

### 10.2 QA Test Cases Summary

#### TC-001: Document Search — "All Documents" Tab

**Objective:** Verify real-time search filtering on the Documents page.

**Steps:**
1. Navigate to `/documents`. Verify the "All Documents" tab is active by default and a table of 7 documents is shown.
2. Type "Benefit" in the search field.
3. Verify the table filters to show only "2025 Benefit Guide".
4. Clear the search. Verify all documents return.

**Expected Result:** Table filters in real-time; pagination updates to "1-1 of 1" while filtering; clearing restores all rows.

**Actual Result (executed 2025-08-25):** PASS. Search filtered to 1 result correctly.

---

#### TC-002: User Type Toggle — Approvals Page Visibility

**Objective:** Verify the Approvals page is hidden from external users.

**Steps:**
1. With user type = External, verify "Approvals" is not in the sidebar.
2. Toggle to Internal. Verify "Approvals" appears in the sidebar.
3. Toggle back to External. Verify it disappears.

**Expected Result:** Approvals nav item visibility is reactive to user type.

---

#### TC-003: High-Cost Claims — External User Action Icons

**Objective:** Verify approve/reject/info icons are correctly rendered and dialogs open.

**Steps:**
1. Set user type = External. Navigate to `/high-cost-claims`.
2. Verify three action icons per row (CircleCheckBig, BanknoteX, Info).
3. Click Approve on a Pending claim. Verify the Approve dialog opens with the correct account name.
4. Click Cancel. Verify dialog closes without state change.
5. Click Approve again and confirm. Verify dialog closes.
6. Verify icon color coding: Approved rows show green approve icon; Rejected rows show red reject icon.

---

#### TC-004: Plan Explorer — Wizard Step Completion

**Objective:** Verify the wizard step completion and auto-advance behavior.

**Steps:**
1. Select Stark Industries in Plan Explorer. Click "Plan Setup" in the timeline.
2. Verify Step 1 (Account Profile) is shown with "Required" badge.
3. Click "Mark as Complete". Verify step advances to Step 2 and the sidebar shows a green checkmark for Step 1.
4. Continue to Step 9. Click "Finish Plan Setup". Verify the wizard exits and the "Contract Status" timeline item is selected.

---

#### TC-005: Settings Page — Edit and Save Company Information

**Objective:** Verify edit mode activates and saves correctly.

**Steps:**
1. Select an account in Settings. Navigate to Company Information tab.
2. Verify all fields are read-only.
3. Click "Edit". Verify fields become editable.
4. Modify the Company Name field. Verify the Save button becomes active.
5. Click Save. Verify the fields return to read-only mode with updated values.
6. Click Edit again and then Cancel. Verify the original values are restored.

---

### 10.3 Regression Checklist

Before any significant release or code review milestone, verify the following:

- [ ] Home page loads without errors for both user types.
- [ ] Sidebar shows Approvals only for internal users.
- [ ] Banner component renders for external users but not internal.
- [ ] Document upload illustration renders (check `UploadIllustration.png` lowercase path).
- [ ] Plan Explorer shows wizard for Stark Industries; GAP view for Wayne Enterprises.
- [ ] All dialogs (Approve, Reject, Info) on High-Cost Claims open and close correctly.
- [ ] Settings page edit/save/cancel flow works for Company Information and CAA tabs.
- [ ] `ReportDataTable` empty state renders the illustration when no items match search.
- [ ] Filter pills on Reports and Home page correctly filter table rows.
- [ ] Billing area chart renders without console errors.
