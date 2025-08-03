# Project Change Log

This file documents all significant changes made to the project for future reference and context.

---



## [2025-07-08]
- Initialized project review and setup.
- Started frontend server with Vite and Vue 3.
- No backend detected as of this date.
- **Project Scaffolding:**
  - Reviewed and analyzed the provided `project-structure.txt` to understand the architecture.
  - Created a new Vue 3 project with TypeScript to align with the technical stack requirements.
  - Installed and configured the Vuetify 3 UI framework.
  - Built the complete directory structure, including folders for `components`, `views`, `composables`, `services`, and `utils`.
  - Created all specified placeholder files (`.vue` and `.ts`) to prepare for development.
  - Configured the main application entry point (`App.vue`) with a basic layout structure.

---

## [2025-07-09]
- Installed `@mdi/font` to enable Material Design Icons.
- Configured Vuetify to use Material Design Icons in `frontend/src/plugins/vuetify.ts`.
- Set the top navigation settings icon color to `#0F285B` in `frontend/src/components/layout/Header.vue`.
- Changed the sidebar navigation title color to `#1f2022` in `frontend/src/components/layout/Sidebar.vue`.

---

## [2025-07-10]
- Established root styling in `frontend/src/style.css`.
- Defined a global color palette with CSS variables, including primary, neutral, success, warning, and error colors.
- Added background/surface color variations for success, warning, and error states.
- Set 'Lato' as the default font family and imported it from Google Fonts.
- Defined typography styles for headings (H1, H2, H3) and paragraph text (`p`, `.p2`).
- Established a 4pt grid system with CSS variables for consistent spacing (`--spacing-nano` to `--spacing-xlarge`).

---

## [2025-07-10]
- Established root styling in `frontend/src/style.css`.
- Defined a global color palette with CSS variables, including primary, neutral, success, warning, and error colors.
- Added background/surface color variations for success, warning, and error states.
- Set 'Lato' as the default font family and imported it from Google Fonts.
- Defined typography styles for headings (H1, H2, H3, H4) and paragraph text (`p`, `.p2`).
- Established a 4pt grid system with CSS variables for consistent spacing (`--spacing-nano` to `--spacing-xlarge`).
- Added a root padding variable (`--root-padding`) and applied it to `frontend/src/App.vue` for consistent page padding.
- Created `frontend/src/components/common/Banner.vue` component with customizable icon and optional button.
- Installed `lucide-vue-next` for icon support.
- Created and moved `frontend/src/components/common/Button.vue` component with multiple variants and optional icon.
- Created `frontend/src/components/common/SummaryWidget.vue` component with customizable icon, circular background, and icon color.
- Created `frontend/src/components/common/ReportExplorer.vue` placeholder component.
- Updated `frontend/src/views/HomePage.vue` to include `Banner`, `SummaryWidget`, and `ReportExplorer` components with appropriate props and styling, and removed problematic HTML comments.

---

## [2025-07-10]
- Established root styling in `frontend/src/style.css`.
- Defined a global color palette with CSS variables, including primary, neutral, success, warning, and error colors.
- Added background/surface color variations for success, warning, and error states.
- Set 'Lato' as the default font family and imported it from Google Fonts.
- Defined typography styles for headings (H1, H2, H3, H4) and paragraph text (`p`, `.p2`).
- Established a 4pt grid system with CSS variables for consistent spacing (`--spacing-nano` to `--spacing-xlarge`).
- Added a root padding variable (`--root-padding`) and applied it to `frontend/src/App.vue` for consistent page padding.
- Created `frontend/src/components/common/Banner.vue` component with customizable icon, optional button, and circular background for the icon with white color.
- Installed `lucide-vue-next` for icon support.
- Created and moved `frontend/src/components/common/Button.vue` component with multiple variants and optional icon.
- Created `frontend/src/components/common/SummaryWidget.vue` component with customizable icon, circular background, icon color, and `h4` title.
- Created `frontend/src/components/common/ReportExplorer.vue` placeholder component.
- Updated `frontend/src/views/HomePage.vue` to include `Banner`, `SummaryWidget`, and `ReportExplorer` components with appropriate props and styling, and removed problematic HTML comments.

---

## [2025-07-10]
- Established root styling in `frontend/src/style.css`.
- Defined a global color palette with CSS variables, including primary, neutral, success, warning, and error colors.
- Added background/surface color variations for success, warning, and error states.
- Set 'Lato' as the default font family and imported it from Google Fonts.
- Defined typography styles for headings (H1, H2, H3, H4) and paragraph text (`p`, `.p2`).
- Established a 4pt grid system with CSS variables for consistent spacing (`--spacing-nano` to `--spacing-xlarge`).
- Added a root padding variable (`--root-padding`) and applied it to `frontend/src/App.vue` for consistent page padding.
- Created `frontend/src/components/common/Banner.vue` component with customizable icon, optional button, and circular background for the icon with white color.
- Installed `lucide-vue-next` for icon support.
- Created and moved `frontend/src/components/common/Button.vue` component with multiple variants and optional icon.
- Created `frontend/src/components/common/SummaryWidget.vue` component with customizable icon, circular background, icon color, and `h4` title.
- Created `frontend/src/components/common/ReportExplorer.vue` placeholder component.
- Created `frontend/src/components/common/ImplementationStatusChart.vue` component using `vue3-apexcharts` for horizontal bar charts.
- Installed `vue3-apexcharts` and `apexcharts` libraries.
- Registered `vue3-apexcharts` globally in `frontend/src/main.ts`.
- Updated `frontend/src/views/HomePage.vue` to include `Banner`, `SummaryWidget`, `ReportExplorer`, `ImplementationStatusChart` components with appropriate props and styling, and removed problematic HTML comments.

---

## [2025-07-10]
- Established root styling in `frontend/src/style.css`.
- Defined a global color palette with CSS variables, including primary, neutral, success, warning, and error colors.
- Added background/surface color variations for success, warning, and error states.
- Set 'Lato' as the default font family and imported it from Google Fonts.
- Defined typography styles for headings (H1, H2, H3, H4) and paragraph text (`p`, `.p2`).
- Established a 4pt grid system with CSS variables for consistent spacing (`--spacing-nano` to `--spacing-xlarge`).
- Added a root padding variable (`--root-padding`) and applied it to `frontend/src/App.vue` for consistent page padding.
- Created `frontend/src/components/common/Banner.vue` component with customizable icon, optional button, and circular background for the icon with white color.
- Installed `lucide-vue-next` for icon support.
- Created and moved `frontend/src/components/common/Button.vue` component with multiple variants and optional icon.
- Created `frontend/src/components/common/SummaryWidget.vue` component with customizable icon, circular background, icon color, and `h4` title.
- Created `frontend/src/components/common/ReportExplorer.vue` placeholder component.
- Created `frontend/src/components/common/ImplementationStatusChart.vue` component using `vue3-apexcharts` for horizontal bar charts.
- Installed `vue3-apexcharts` and `apexcharts` libraries.
- Registered `vue3-apexcharts` globally in `frontend/src/main.ts`.
- Created `frontend/src/components/common/RecentActivityFeed.vue` placeholder component.
- Updated `frontend/src/views/HomePage.vue` to include `Banner`, `SummaryWidget`, `ReportExplorer`, `ImplementationStatusChart`, and `RecentActivityFeed` components with appropriate props and styling, and removed problematic HTML comments.

---

## [2025-07-10]
- Established root styling in `frontend/src/style.css`.
- Defined a global color palette with CSS variables, including primary, neutral, success, warning, and error colors.
- Added background/surface color variations for success, warning, and error states.
- Set 'Lato' as the default font family and imported it from Google Fonts.
- Defined typography styles for headings (H1, H2, H3, H4) and paragraph text (`p`, `.p2`).
- Established a 4pt grid system with CSS variables for consistent spacing (`--spacing-nano` to `--spacing-xlarge`).
- Added a root padding variable (`--root-padding`) and applied it to `frontend/src/App.vue` for consistent page padding.
- Created `frontend/src/components/common/Banner.vue` component with customizable icon, optional button, and circular background for the icon with white color.
- Installed `lucide-vue-next` for icon support.
- Created and moved `frontend/src/components/common/Button.vue` component with multiple variants and optional icon.
- Created `frontend/src/components/common/SummaryWidget.vue` component with customizable icon, circular background, icon color, and `h4` title.
- Created `frontend/src/components/common/ReportExplorer.vue` placeholder component.
- Created `frontend/src/components/common/ImplementationStatusChart.vue` component using `vue3-apexcharts` for horizontal bar charts.
- Installed `vue3-apexcharts` and `apexcharts` libraries.
- Registered `vue3-apexcharts` globally in `frontend/src/main.ts`.
- Created `frontend/src/components/common/RecentActivityFeed.vue` placeholder component.
- Refactored `frontend/src/components/common/ReportExplorer.vue` to accept a `reports` prop and dynamically render the table.
- Updated `frontend/src/views/HomePage.vue` to include `Banner`, `SummaryWidget`, `ReportExplorer`, `ImplementationStatusChart`, and `RecentActivityFeed` components with appropriate props and styling, and removed problematic HTML comments.

---

## [2025-07-10]
- Recreated `frontend/src/components/common/RecentActivityFeed.vue` component to accept an `activities` prop and dynamically render the activity list.
- Re-added `RecentActivityFeed` component to `frontend/src/views/HomePage.vue` with sample data.

---

## [2025-07-10]
- Refactored `frontend/src/components/common/ReportExplorer.vue` to be an accordion component using Vuetify's expansion panels, with a customizable `h2` header in primary color, a description, and animated chevron icons.

---

## [2025-07-10]
- Renamed `frontend/src/components/common/ReportExplorer.vue` to `frontend/src/components/common/AccordionCard.vue`.
- Updated `frontend/src/views/HomePage.vue` to reference the new `AccordionCard.vue` component.

---

## [2025-07-15]
- Refactored the `ReportDataTable.vue` component to improve checkbox alignment and submenu functionality.
- Replaced the custom checkbox implementation with Vuetify's default `v-checkbox-btn` functionality to ensure proper vertical alignment with the row text.
- Updated the row actions submenu to only include "View" and "Download" options, removing "Edit" and "Delete."
- Ensured the changes were applied to the `HomePage.vue` instance of the `ReportDataTable` by explicitly setting the `show-selection-checkboxes` prop to `true`.

---

## [2025-07-15]
- Refactored `UpcomingImplementationsTable.vue`:
  - Removed the "View All" button.
  - Added a "View All" text link at the bottom, centered and styled with link color.
  - Added `--spacing-medium` gap between the heading and the table.
- Refactored `FilteringPill.vue`:
  - Updated to use Vuetify's `v-chip` with `variant="outlined"` by default.
  - Set outline color to `var(--color-primary)` and text color to `var(--color-text-primary)`.
- Added `isActive` prop to control active state (filled primary primary background, `var(--color-neutral-white)` text).
  - Ensured the close icon is not displayed by default by setting `closable` prop to `false` by default and removing explicit `closable` from `ReportDataTable.vue`.
- Refactored `ReportDataTable.vue` for filter pills and table filtering:
  - Added `initialFilterPills` prop to accept an array of filter pill objects.
  - Modified `activeFilters` and `activeFilterPill` initialization to use `initialFilterPills` with a `watch` for proper timing.
  - Updated `handleFilterPillClick` to manage `isActive` state of pills (toggling active/outlined appearance).
  - Removed `showNavigationTabs` prop and related template/script logic (Tabs component, `handleTabSelected`).
  - Updated `filteredItems` to filter by `item.type` based on `activeFilterPill.value`.
  - Corrected the `is-active` prop binding on `FilteringPill` to `filter.isActive`.
- Refactored `HomePage.vue` for filter pills:
  - Defined `reportFilterPills` array with "All", "Quarterly", "Monthly", "Ad-Hoc", "Rebate", "CAA" labels (removed "Reports" suffix).
  - Set `isActive: true` for the "All" pill in `reportFilterPills` by default.
  - Passed `reportFilterPills` to `ReportDataTable` via `initialFilterPills` prop.

---

## [2025-07-15]
- Added navigation to Summary Widgets on `HomePage.vue`:
  - "Pending Approvals" widget now navigates to `ReportsPage.vue`.
  - "High-Cost Claims" widget now navigates to `ApprovalsPage.vue`.
  - "Prior Authorizations" widget now navigates to `PriorAuthsPage.vue`.
  - Added `cursor: pointer;` to `SummaryWidget.vue` to indicate clickability.
- Updated "Upcoming Implementations Next 90 Days" widget in `UpcomingImplementationsTable.vue`:
  - "View All" link now navigates to `PlanExplorerPage.vue`.
- Added "Pending Approval" filter pill to `HomePage.vue`:
  - Pill filters `ReportDataTable` by `status = "Pending Approval"`.
- Converted `frontend/src/style.css` to `frontend/src/style.scss`.
- Updated `main.ts` to reference `style.scss`.
- Converted `<style scoped>` to `<style lang="scss" scoped>` in the following Vue components:
  - `App.vue`
  - `AccordionCard.vue`
  - `Banner.vue`
  - `ImplementationStatusChart.vue`
  - `ReportDataTable.vue`
  - `ReportTable.vue`
  - `SummaryWidget.vue`
  - `Tabs.vue`
  - `UpcomingImplementationsTable.vue`
  - `Header.vue`
  - `Sidebar.vue`
  - `Button.vue`
  - `FilteringPill.vue`
  - `SearchBar.vue`
  - `HomePage.vue`
- Refactored `frontend/src/style.scss` to use SCSS variables and follow SCSS standards.
- Updated `Banner.vue` to use SCSS variables for colors and spacing.
- Updated `SummaryWidget.vue` to use SCSS variables for colors and spacing, and global typography classes.
- Updated `HomePage.vue` to use SCSS spacing variables.
- Addressed persistent `Element is missing end tag` error in `ImplementationStatusChart.vue` by re-writing the file content with correct SCSS variable usage and `@import` syntax.
- Fixed `AccordionCard.vue` by re-adding missing `</script>` tag.
- Fixed `FilteringPill.vue` by replacing SCSS variable with CSS variable in JavaScript context.

---

## [2025-07-18]
### Changed
- Successfully refactored `AccordionCard.vue` to ensure the `ReportDataTable` component renders correctly when the accordion is expanded.
- Updated `SearchBar.vue` and `FilteringPill.vue` to use SCSS variables, ensuring consistency with the new styling standards.
- Configured a custom Vuetify theme in `vuetify.ts` to align with the project's color palette, fixing the active state of the `FilteringPill` component.

---

## [1.0.1] - 2025-07-18

### Added
- [State Management] Installed and configured Pinia for global state management. Created a `user` store to manage `userType` and a `useUserType` composable to provide reactive access to the user type (`internal`/`external`). Impact: This establishes a centralized and type-safe way to manage global state, enabling role-based UI rendering. #pinia #vue #typescript
- [Developer Tools] Added a development-only UI switcher in `App.vue` to toggle the `userType` between `internal` and `external`. Impact: This allows for easy testing and validation of role-based UI changes without requiring a full authentication flow. #vue #dev-tools

### Changed
- [Role-Based Rendering] Refactored the `Banner.vue` component to be displayed only to `external` users. This was achieved by integrating the `useUserType` composable. Impact: The UI now dynamically adapts to the user's role, showing relevant information based on their permissions. #vue #permissions

---

## [1.0.2] - 2025-07-18

### Added
- [Component] Created a new reusable `PageCard.vue` component to provide a consistent container for page content. Impact: This improves UI consistency and reduces code duplication. #vue #component
- [Component] Created a new reusable `Breadcrumbs.vue` component to display the user's navigation path. Impact: This improves site navigation and user orientation. #vue #component #navigation
- [Feature] Added `SummaryWidget` components to the `ApprovalsPage.vue` to display a breakdown of reports awaiting approval by type. Impact: This provides users with a quick overview of their pending tasks. #vue #feature

### Changed
- [UI/UX] Updated the `ApprovalsPage.vue` to use the new `PageCard` component and added spacing between elements for better visual separation. Impact: This improves the layout and readability of the page. #vue #ui-ux
- [UI/UX] Updated the `ReportsPage.vue` to use the `PageCard` component and replicated the `ReportDataTable` from the homepage. Impact: This provides a consistent user experience between the home and reports pages. #vue #ui-ux
- [Styling] Updated the typography utility classes in `style.scss` to ensure all heading levels use the `Lato` font family. Impact: This corrects font inconsistencies and ensures a consistent look and feel. #scss #styling
- [Styling] Updated the `PageCard.vue` component to use the primary text color for the description. Impact: This improves readability and visual consistency. #scss #styling

### Fixed
- [UI/UX] Corrected the `ReportDataTable.vue` component to ensure table headers are always bold. Impact: This fixes a visual bug and improves the readability of the data table. #vue #ui-ux
- [UI/UX] Corrected the `ReportsPage.vue` to hide the "Actions" column header while still displaying the row actions. Impact: This cleans up the UI while retaining functionality. #vue #ui-ux

---

## [1.0.3] - 2025-07-18

### Added
- [Feature] Added a new chart section to the `ReportsPage.vue` with a responsive bento-box layout. This section conditionally renders different charts for internal and external users. Impact: This provides a more data-rich and role-specific experience on the reports page. #vue #feature #charts

### Changed
- [Component] Refactored the placeholder chart components (`ReportStatusChart.vue`, `ReportsByTypeChart.vue`, `TotalPendingChart.vue`, `AvgApprovalTimeChart.vue`, `ReportsByAccountChart.vue`) to use the `vue3-apexcharts` library. Impact: This makes the charts functional and consistent with the project's charting standards. #vue #apexcharts #component
- [UI/UX] Adjusted the height of the external user charts to `250px` to prevent them from taking up too much vertical space. Impact: This improves the layout and user experience on the reports page. #vue #ui-ux

### Fixed
- [Styling] Corrected the chart card components to use the `.text-h4` class for their titles, ensuring consistent typography. Impact: This fixes a styling inconsistency and improves the visual hierarchy of the page. #scss #styling

---

## [1.0.4] - 2025-07-18

### Changed
- [UI/UX] Updated `ReportStatusChart.vue` to display the total number of reports inside the donut chart. Impact: This provides a clearer summary of the data directly within the visualization. #vue #apexcharts #ui-ux
- [UI/UX] Adjusted the styling of the total count and label within the donut chart in `ReportStatusChart.vue` to match the desired visual hierarchy. Impact: Improves readability and visual appeal of the chart. #vue #apexcharts #ui-ux

---

## [2025-07-20]
### Changed
- [UI/UX] Updated `ReportsByAccountChart.vue` heading to "Top 5 - Pending Reports by Account" and changed heading tag to `h3` with `text-h3` class.
- [UI/UX] Updated `TotalPendingChart.vue` and `AvgApprovalTimeChart.vue` headings to `h3` with `text-h3` class.
- [UI/UX] Added `width="100%"` to `apexchart` in `ReportsByAccountChart.vue` for better alignment.
- [Feature] Integrated `PageCard` and `ReportDataTable` into `DocumentsPage.vue` with dynamic content based on user type (internal/external).
- [UI/UX] Updated `DocumentsPage.vue` `PageCard` heading to "Document Explorer" for both internal and external users.
- [UI/UX] Updated `DocumentsPage.vue` `PageCard` description for external users to "View and download documents relevant to your account(s)."
- [Component] Refactored `Tabs.vue` to use Vuetify's `v-tabs` and `v-tab` components, ensuring primary color for active states and consistent typography.
- [UI/UX] Added `.mb-large` utility class to `style.scss` for consistent spacing.
- [UI/UX] Added `mb-large` class to `Tabs` component in `DocumentsPage.vue` for spacing.
- [Component] Created `FileUploader.vue` component in `components/ui` for document uploads.
- [Feature] Implemented conditional rendering of `FileUploader.vue` in `DocumentsPage.vue` for the "Document Uploader" tab (internal users only).
- [UI/UX] Added placeholder SVG for `upload-placeholder.svg` in `public/icons`.
- [UI/UX] Removed border, padding, and box-shadow from `.file-uploader-card` in `FileUploader.vue`.
- [UI/UX] Made document type selection in `FileUploader.vue` a prop, defaulting to `true`.
- [UI/UX] Reverted `FileUploader.vue` to use `v-radio-group` and `v-radio` components.
- [UI/UX] Attempted to fix radio button visibility in `FileUploader.vue` by targeting `mdi-radiobox-blank` icon and setting its color. **(Issue still unresolved: Radio buttons not visible in idle state.)**
- [UI/UX] Attempted to fix radio button visibility in `FileUforleUploader.vue` by explicitly setting `on-icon` and `off-icon` props on `v-radio` components. **(Issue still unresolved: Radio buttons not visible in idle state.)**

---

- [UI/UX] Fixed active styling for `v-item-group` in `FileUploader.vue` by ensuring all `v-card` elements use `variant="flat"` when selected and `variant="outlined"` when not selected. Impact: This resolves the inconsistency in active state styling for document type selection.

- [UI/UX] Fixed active styling for `v-item-group` in `FileUploader.vue` by ensuring all `v-card` elements use `variant="flat"` when selected and `variant="outlined"` when not selected. Impact: This resolves the inconsistency in active state styling for document type selection.

- [UI/UX] Fixed active styling for `v-item-group` in `FileUploader.vue` by ensuring all `v-card` elements use `variant="flat"` when selected and `variant="outlined"` when not selected. Impact: This resolves the inconsistency in active state styling for document type selection.

## [2025-07-21]
### Added
- [Component] Created a new reusable `Dialog.vue` component using Vuetify's `v-dialog`. It supports persistent behavior, customizable icons (from Lucide), headings, text content, and action buttons via props. Impact: Provides a standardized and flexible way to implement dialogs across the application. #vue #component #ui-ux

### Changed
- [UI/UX] Increased the size of the upload illustration in `FileUploader` component by 50% (from 120px to 180px) to give it more prominence on the page. Impact: This improves the visual hierarchy and user focus on the upload action. #vue #ui-ux #styling
- [Refactor] Updated FileUploader component to use an imported image asset. Refactored `frontend/src/components/ui/FileUploader.vue` to import the upload illustration from `@/assets/UploadIllustration.png` instead of using a static path in the template. Moved the image asset from `assets/nav-icons/` to `frontend/src/assets/` to align with Vite's asset handling. This ensures the image is correctly processed and bundled during the build. Impact: Improves asset handling robustness and aligns with modern frontend development best practices for Vite projects. #vue #refactor #vite #assets
- [UI/UX] Made radio buttons in `FileUploader.vue` visible in their idle state by increasing the border thickness to 2px and removing invalid `on-icon` and `off-icon` properties. Impact: This fixes a UI bug where the radio buttons were invisible until selected, improving usability. #vue #ui-ux #bugfix
- [UI/UX] Attempted to fix radio button visibility in `FileUploader.vue` by directly styling the idle icon color to match the primary text color. This provides a more robust solution that works with Vuetify's default styling. Impact: This resolves the UI bug where radio buttons were not visible, ensuring a consistent and usable interface. #vue #ui-ux #bugfix
- [Feature] Enabled action icons in `ReportDataTable` within `HighCostClaimsPage.vue` and defined `actionIcons` array with `CircleCheckBig`, `BanknoteX`, and `Info` icons and their respective handlers. Impact: Adds interactive action icons to the high-cost claims table. #vue #feature #ui-ux
- [UI/UX] Refactored action icons in `HighCostClaimsPage.vue` data table to be 25px and centered the "Actions" header. Impact: Improves visual consistency and readability of the table. #vue #ui-ux
- [UI/UX] Ensured action icons in `ReportDataTable.vue` correctly apply the `size` prop and centered the "Actions" header. Impact: Fixes icon sizing and header alignment. #vue #ui-ux
- [UI/UX] Updated `ReportDataTable.vue` to left-align the content within the "Actions" column and made the column hug its content. Impact: Improves visual alignment and table layout. #vue #ui-ux

### Fixed
- [Bug] Corrected missing end tag in `HighCostClaimsPage.vue`. Impact: Resolves compilation error. #vue #bugfix
- [Bug] Removed duplicate declarations of `activeFilterPill`, `getIconClasses`, `getIconStyle`, `handleApprove`, `handleReject`, and `handleRequestInfo` in `ReportDataTable.vue`. Impact: Resolves compilation errors due to identifier redeclaration. #vue #bugfix

---

## [2025-07-22]
### Changed
- [UI/UX] Renamed "Claims" menu item to "High-Cost Claims" in `frontend/src/components/layout/Sidebar.vue`. Impact: Improves clarity and consistency of navigation. #vue #ui-ux #navigation
- [UI/UX] Fixed icon association for "High-Cost Claims" menu item in `frontend/src/components/layout/Sidebar.vue`. Impact: Ensures correct visual representation for the updated menu item. #vue #ui-ux #navigation
- [UI/UX] Updated `PageCard` description in `frontend/src/views/HighCostClaimsPage.vue` to be conditional based on user type. For internal users, the description is now "Review claims and acknowledge client questions about high cost claims.". Impact: Provides a more tailored user experience based on permissions. #vue #ui-ux #permissions
- [Feature] Added `PageCard` component with "Prior Authorizations" heading and "Review prior authorizations and stay on top of your members." description to `frontend/src/views/PriorAuthsPage.vue`. Impact: Provides a consistent page layout and clear introduction for the Prior Authorizations section. #vue #component #ui-ux
- [Feature] Integrated `ReportDataTable` into `frontend/src/views/PriorAuthsPage.vue` with search bar enabled, filter button disabled, and filter pills enabled. Impact: Provides data display and filtering capabilities for prior authorizations. #vue #component #ui-ux
- [UI/UX] Set `search-placeholder` to "Search prior authorizations" in `frontend/src/views/PriorAuthsPage.vue`. Impact: Improves clarity for search functionality. #vue #ui-ux
- [UI/UX] Hid "Actions" column header and aligned table data submenu to the end in `frontend/src/views/ApprovalsPage.vue`. Impact: Cleans up UI while retaining functionality. #vue #ui-ux
- [UI/UX] Updated `priorAuthHeaders` in `frontend/src/views/PriorAuthsPage.vue` to include "Account Name", "EOC ID", "Drug Name", "Submission Date", and "Status" columns. Added 10 dummy records to `priorAuthData`. Impact: Provides more comprehensive data display for prior authorizations. #vue #ui-ux
- [UI/UX] Aligned "Submission Date" column (heading and data) to the right in `frontend/src/views/PriorAuthsPage.vue`. Impact: Improves data readability and consistency.
- [UI/UX] Adjusted column widths for "Submission Date", "Account Name", and "Drug Name" in `frontend/src/views/PriorAuthsPage.vue`. Impact: Optimizes table layout for better readability.
- [UI/UX] Removed "Ad-Hoc" type from `reportItems` data and `reportFilterPills` in `frontend/src/views/ReportsPage.vue`. Impact: Streamlines data and filtering options.
- [UI/UX] Conditionally displayed "Approved By" and "Approved Date" columns for external users in `frontend/src/views/ReportsPage.vue`. Impact: Tailors data display based on user type.
- [UI/UX] Set donut chart in `frontend/src/components/common/ReportStatusChart.vue` to use `palette2` by removing hardcoded colors. Impact: Applies consistent color palette.
- [UI/UX] Updated `ReportsByTypeChart.vue` to use `palette2` and removed hardcoded colors. Impact: Applies consistent color palette.
- [Bug] Fixed `TypeError: Cannot read properties of undefined (reading 'title')` in `frontend/src/components/layout/Sidebar.vue` by refactoring `v-for` and `v-if` logic. Impact: Resolves critical rendering error.
- [Bug] Fixed malformed `v-list-item` tag in `frontend/src/components/layout/Sidebar.vue`. Impact: Resolves compilation error.
- [UI/UX] Removed `size` and `color` attributes from Lucide icons in `frontend/src/components/layout/Sidebar.vue` to ensure consistent styling via CSS. Impact: Improves icon styling consistency.
- [UI/UX] Added `color` property to `.nav-icon` style in `frontend/src/components/layout/Sidebar.vue` to ensure consistent icon color. Impact: Ensures correct icon color display.
- [Feature] Enabled action icons in `ReportDataTable` within `HighCostClaimsPage.vue` and defined `actionIcons` array with `CircleCheckBig`, `BanknoteX`, and `Info` icons and their respective handlers. Impact: Adds interactive action icons to the high-cost claims table.
- [UI/UX] Updated `Dialog.vue` buttons to use `variant` and `color` props for consistent styling. Impact: Improves button styling in dialogs.
- [UI/UX] Set action icon size to 25px in `ReportDataTable.vue`. Impact: Increases icon size for better visibility.

## [2025-07-23]
### Added
- [Component] Created `Card.vue` component in `frontend/src/components/ui/Card.vue` for standardized card styling. Impact: Provides a reusable and consistently styled card component for the application. #vue #component #ui-ux
- [Feature] Added `PageCard` component to `frontend/src/views/BillingPage.vue` with "Statement & Invoice Explorer" heading and description. Impact: Provides a consistent page layout and clear introduction for the Billing section. #vue #component #ui-ux
- [Feature] Added `ReportDataTable` to `frontend/src/views/BillingPage.vue` with specified columns ("Account Name", "Billing Type", "ID", "Invoice/Statement Detail", "Billing Period", "Amount", "Actions"), search bar enabled, filter button disabled, and row actions enabled. Impact: Provides data display and interaction for billing information. #vue #feature #ui-ux
- [Feature] Added an ApexCharts area chart to `frontend/src/views/BillingPage.vue` for "Billed Amount Over Time" with smooth curve, border, and styling consistent with other charts. Impact: Provides a visual representation of billing trends. #vue #feature #charts
- [Feature] Added `PageCard` component to `frontend/src/views/TestResultsPage.vue` with "Test Results" heading and description. Impact: Provides a consistent page layout and clear introduction for the Test Results section. #vue #component #ui-ux
- [Feature] Added `ReportDataTable` to `frontend/src/views/TestResultsPage.vue` with specified columns ("Account Name", "Report Type", "Report", "Date Range", "Status", "Actions"), search bar enabled, and row actions enabled. Impact: Provides data display and interaction for test results. #vue #feature #ui-ux
- [Feature] Added two `SummaryWidget` components to `frontend/src/views/TestResultsPage.vue` for "Total Reports for This Period" and "Reports Pending Approval", displayed in a grid layout above the page card. Impact: Provides a quick overview of test report metrics. #vue #feature #ui-ux

### Changed
- [UI/UX] Updated `frontend/src/views/HighCostClaimsPage.vue` to have separate dialogs for internal and external users when clicking the "Request Info" action. External users see "Send Request" and "Cancel" buttons, while internal users see an "Acknowledge" button. Impact: Provides tailored user experience based on user type for information requests. #vue #ui-ux #permissions
- [UI/UX] Adjusted the width of the "Actions" column in `frontend/src/views/HighCostClaimsPage.vue` to `180px` to accommodate "Information Requested" text on a single line. Impact: Improves readability of the table. #vue #ui-ux
- [UI/UX] Updated `frontend/src/views/PriorAuthsPage.vue` to include three `SummaryWidget` components ("Pending", "Approved", "Denied") above the page card, with appropriate icons and counts. Impact: Provides a quick overview of prior authorization statuses. #vue #ui-ux
- [UI/UX] Updated `frontend/src/views/PriorAuthsPage.vue` to display an info icon for external users, which triggers a dialog with "Request Additional Information About This PA" heading and "Send Request" and "Cancel" buttons. Impact: Provides a clear mechanism for external users to request more information. #vue #ui-ux
- [UI/UX] Added "Actions" column heading to `frontend/src/views/PriorAuthsPage.vue` and aligned it to the end. Impact: Improves clarity and alignment of the table. #vue #ui-ux
- [UI/UX] Aligned action icons in `frontend/src/components/common/ReportDataTable.vue` to the end of the column. Impact: Improves visual consistency. #vue #ui-ux
- [UI/UX] Updated `frontend/src/views/PriorAuthsPage.vue` to display a dialog for internal users when "Information Requested" is clicked, with "PA Information Requested" heading and "Acknowledge" button. Impact: Provides a clear mechanism for internal users to acknowledge information requests. #vue #ui-ux
- [UI/UX] Updated `frontend/src/views/BillingPage.vue` to right-align "ID" and "Amount" columns. Impact: Improves data readability and consistency. #vue #ui-ux
- [UI/UX] Hidden "Actions" column heading in `frontend/src/views/BillingPage.vue`. Impact: Cleans up UI for billing table. #vue #ui-ux
- [UI/UX] Enabled filtering pills ("All", "Invoice", "Statement") in `frontend/src/views/BillingPage.vue` and wired them to filter the table by "Billing Type". Impact: Provides filtering capabilities for billing data. #vue #ui-ux
- [UI/UX] Set search bar placeholder text to "Search invoices and statements" in `frontend/src/views/BillingPage.vue`. Impact: Improves clarity for search functionality. #vue #ui-ux
- [UI/UX] Added `<h1>` tag "Billing" as page title in `frontend/src/views/BillingPage.vue`. Impact: Provides a clear page title. #vue #ui-ux
- [UI/UX] Added `<h1>` tag "Added Value Programs" as page title in `frontend/src/views/AddedValuePage.vue`. Impact: Provides a clear page title. #vue #ui-ux
- [UI/UX] Refactored `frontend/src/components/ui/Card.vue` to include a `selected` variant with primary border, no shadow, reduced text opacity, and a disabled button with "Added to Account" text. Impact: Provides a clear visual cue for selected program cards. #vue #ui-ux #component
- [UI/UX] Set `letter-spacing: 0 !important;` for all text within `frontend/src/components/ui/Card.vue`. Impact: Ensures consistent typography. #vue #ui-ux
- [UI/UX] Added `$spacing-small` padding to `frontend/src/components/ui/Card.vue`. Impact: Improves visual spacing within cards. #vue #ui-ux
- [UI/UX] Updated `frontend/src/views/AddedValuePage.vue` to display specific titles and categories for program cards. Impact: Provides accurate content for program cards. #vue #ui-ux
- [UI/UX] Refactored layout in `frontend/src/views/AddedValuePage.vue` to separate "Programs In Use" and "Available Programs" sections with appropriate spacing. Impact: Improves visual hierarchy and organization of content. #vue #ui-ux
- [UI/UX] Limited "Programs In Use" section in `frontend/src/views/AddedValuePage.vue` to 2 cards, all with the `selected` variant. Impact: Provides a clear distinction between programs in use and available programs.
- [UI/UX] Limited "Available Programs" section in `frontend/src/views/AddedValuePage.vue` to "Liviniti Delivery on Demand" and "LivLite" cards. Impact: Provides accurate content for available programs.
- [UI/UX] Ensured `selected` class is dynamically applied to `v-card` in `frontend/src/components/ui/Card.vue`. Impact: Correctly applies selected variant styling.
- [UI/UX] Set the card border to primary color with 0.6 opacity and removed the card shadow for the `selected` variant in `frontend/src/components/ui/Card.vue`. Impact: Provides the intended visual cue for selected cards.
- [UI/UX] Added `$spacing-large` bottom margin to the page card description text in `frontend/src/components/common/PageCard.vue`. Impact: Improves visual spacing.
- [UI/UX] Updated `frontend/src/views/TestResultsPage.vue` to display "Approved By" and "Approved Date" columns only for internal users. Impact: Provides role-based data visibility.
- [UI/UX] Updated `frontend/src/views/TestResultsPage.vue` to display "Actions" column with approve/reject icons only for external users. Impact: Provides role-based action visibility.
- [UI/UX] Set status table data in `frontend/src/views/TestResultsPage.vue` to "Approved", "Rejected", "Pending". Impact: Provides accurate dummy data.
- [UI/UX] Toggled off the filter button in the search bar on `frontend/src/views/TestResultsPage.vue`. Impact: Streamlines search functionality.

### Fixed
- [Bug] Corrected `Invalid end tag` error in `frontend/src/views/BillingPage.vue` by fixing script and style tag placement. Impact: Resolves compilation error.
- [Bug] Corrected `Invalid end tag` error in `frontend/src/views/TestResultsPage.vue` by fixing script and style tag placement. Impact: Resolves compilation error.
- [Bug] Fixed `ReferenceError: computed is not defined` in `frontend/src/views/TestResultsPage.vue` by importing `computed` from `vue`. Impact: Resolves runtime error.
- [Bug] Fixed `ReferenceError: testResultsData is not defined` in `frontend/src/views/TestResultsPage.vue` by reordering variable declarations. Impact: Resolves runtime error.
- [Bug] Fixed `TypeError: instance.update is not a function` in `frontend/src/views/TestResultsPage.vue` by explicitly selecting properties in `processedTestResultsData` instead of using `delete`. Impact: Resolves runtime error.
- [Bug] Fixed `box-shadow` not being removed for selected card variant in `frontend/src/components/ui/Card.vue` by adding `!important` to `box-shadow: none;`. Impact: Correctly applies selected variant styling.

---

## [2025-07-24]
### Added
- [Component] Created `AccountPrescriptionCard.vue` component to display PBM account details in a card format.
- [Feature] Added a new section to `AddedValuePage.vue` with a 70/30 responsive layout to display account details and available programs.
- [Component] Added a `flat` prop to the `Card.vue` component to provide a shadowless variant.
- [Component] Created `AccountSelector.vue` component to encapsulate account selection logic and styling, with a slot for additional content.

### Changed
- [UI/UX] Refactored `frontend/src/components/ui/Card.vue` to include a `variant` prop that can be set to `checkbox`.
- [UI/UX] Replaced Vuetify's `v-checkbox` with `lucide-vue-next` icons (`CheckSquare` and `Square`) to resolve visibility issues.
- [UI/UX] Ensured the card title wraps when it is too long and set the checkbox icon's stroke width to 1px.
- [UI/UX] Refactored the selected card variant to show the card text and apply a primary color border.
- [UI/UX] Set a `min-height` on the card component to ensure all cards in a row have a uniform height.
- [UI/UX] Added a "Request Program Details" button to `frontend/src/views/AddedValuePage.vue` that only appears when a card is selected.
- [UI/UX] Set the "Request Program Details" button to be title-cased.
- [UI/UX] Added a global style to `frontend/src/style.scss` to make all buttons title-cased and have no letter spacing.
- [UI/UX] Added two more cards to `frontend/src/views/AddedValuePage.vue`.
- [UI/UX] Refactored `AccountPrescriptionCard.vue` to be responsive, use SCSS variables for colors, and use a local image asset for the logo.
- [UI/UX] Added "In Use" and "Available" sections to the `AddedValuePage.vue` to better organize program cards.
- [UI/UX] Implemented `gap` for spacing in the programs column on `AddedValuePage.vue` for better visual grouping.
- [UI/UX] Added descriptive text under the "Available" heading.
- [UI/UX] Refactored `AccountSelector.vue` to correctly position the slot content below the heading and select component.
- [UI/UX] Added `showSlot` prop to `AccountSelector.vue` to control the visibility of the slot content.

### Fixed
- [Bug] Fixed issue where the "Continue" button in the account selection dialog was not disabled when no account was selected.
- [Bug] Fixed issue where the account selection dialog could be dismissed by clicking outside, even with `persistent` set to `true`.

### Fixed
- [Bug] Fixed issue where the "Continue" button in the account selection dialog was not disabled when no account was selected.
- [Bug] Fixed issue where the account selection dialog could be dismissed by clicking outside, even with `persistent` set to `true`.

---

## [2025-07-28]

### Added
- [Settings Page] Implemented `frontend/src/views/SettingsPage.vue` with `AccountSelector` component for account selection.
- [Settings Page] Integrated `frontend/src/components/common/Tabs.vue` within the `AccountSelector` slot, displaying "Company Information", "User Administration", "CAA Drug Cost Reporting", and "CAA Gag Clause Attestation" tabs.
- [UI Component] Created new reusable `frontend/src/components/ui/TextField.vue` component as a wrapper for Vuetify's `v-text-field`.
- [Settings Page] Added "Company Information" tab content including a "General Information" heading, descriptive text, and two read-only `TextField` components for "Company name" and "Doing business as".

### Changed
- [Component] Refactored `frontend/src/components/common/AccountSelector.vue` to accept `heading` and `subheading` props for reusability.
- [Settings Page] Implemented conditional rendering for tab content in `SettingsPage.vue`, displaying content only after an account is selected.

### Fixed
- [Bug] Resolved `[vue/compiler-sfc] Identifier 'accountOptions' has already been declared` error in `frontend/src/views/SettingsPage.vue` by removing duplicate variable declarations.

### Known Issues
- [UI/UX] Read-only styling for `frontend/src/components/ui/TextField.vue` is not yet fully implemented as requested (label visibility, truncation, and tooltip behavior for read-only variant require further refinement).

---

## [2025-07-29]
### Changed
- [UI/UX] Refactored the `TextField.vue` component to simplify read-only styling, using Vuetify's native `readonly` state and CSS variables for a more robust implementation. Impact: Improves code maintainability and resolves styling inconsistencies. #vue #refactor #ui-ux
- [Feature] Added an editable "Notification threshold" field to the `SettingsPage.vue` under a new "High Cost Notification Settings" section, allowing users to configure claim limits. Impact: Enhances the configuration options available to users. #vue #feature
- [UI/UX] Implemented "Save" and "Cancel" buttons on the "Company Information" tab in `SettingsPage.vue`. The buttons are only active when changes have been made to the form. Impact: Provides clear actions for the user and prevents accidental saves. #vue #ui-ux
- [UI/UX] Added a snackbar notification to confirm successful saves on the `SettingsPage.vue`. Impact: Improves user feedback and experience. #vue #ui-ux
- [Refactor] Reorganized the layout of the "Company Information" tab in `SettingsPage.vue` for better structure and consistency. Grouped related fields into containers (`general-information-container`, `high-cost-container`) and moved the action buttons to the bottom of the tab. Impact: Improves code readability and maintainability. #vue #refactor

### Fixed
- [Bug] Fixed a SASS compilation error (`Undefined variable`) in `TextField.vue` by replacing out-of-scope SCSS variables with the correct global CSS variables. Impact: Resolves a critical build error. #vue #bugfix #scss

### Added
- [Feature] Implemented the "User Administration" tab in `SettingsPage.vue`, including a `ReportDataTable` to display user information. Impact: Provides a dedicated interface for user management. #vue #feature #settings
- [Component] Added a new `boolean-columns` prop to `ReportDataTable.vue` to automatically render specified columns as read-only checkboxes. Impact: Enhances the reusability and functionality of the data table component. #vue #component #refactor

### Changed
- [UI/UX] Updated the `ReportDataTable` in `SettingsPage.vue` to use the new `boolean-columns` prop, simplifying the template. Impact: Improves code readability and maintainability. #vue #ui-ux
- [UI/UX] Centered the headers and content for boolean (checkbox) columns in `ReportDataTable.vue` for improved visual alignment. Impact: Fixes styling inconsistencies and improves the user experience. #vue #ui-ux #styling

### Fixed
- [Bug] Corrected multiple instances where adding new features to `SettingsPage.vue` inadvertently removed existing content or created duplicate imports. Impact: Restores full functionality to the page and prevents regressions. #vue #bugfix

---

## [2025-07-29]
### Added
- [Component] Created a new reusable `Autocomplete.vue` component to wrap Vuetify's `v-autocomplete`, ensuring consistent styling and proper display of the chevron icon. Impact: Improves UI consistency and provides better control over the autocomplete component's appearance. #vue #component #ui-ux
- [Component] Created a new reusable `DatePicker.vue` component for date input, allowing both manual entry and calendar selection. Impact: Provides a standardized and flexible date input solution. #vue #component #ui-ux
- [Feature] Added the "CAA Drug Cost Reporting" tab to `SettingsPage.vue`, including a disclaimer and a "Benefit Details" section. Impact: Introduces a new functional area for CAA reporting. #vue #feature #settings

### Changed
- [UI/UX] Modified `TextField.vue` to display tooltips only when text is truncated, improving user experience. Impact: Reduces visual clutter and provides context only when necessary. #vue #ui-ux
- [UI/UX] Updated `TextField.vue` to expand to 100% width of its parent container, ensuring consistent layout. Impact: Improves responsiveness and layout flexibility. #vue #ui-ux
- [UI/UX] Implemented responsive styling for `form-row` elements in `SettingsPage.vue`, ensuring fields wrap and span 100% width on mobile devices while maintaining desktop layout. Impact: Enhances mobile usability and design consistency. #vue #ui-ux
- [Refactor] Replaced direct `v-autocomplete` usage with the new `Autocomplete.vue` component in `SettingsPage.vue`. Impact: Improves code organization and leverages custom component styling. #vue #refactor
- [Refactor] Integrated `DatePicker.vue` components into `SettingsPage.vue` for "Plan year begin date" and "Plan year end date". Impact: Standardizes date input and improves UI consistency. #vue #refactor
- [Feature] Added "Market segment" and "Members as of 12/31 of the reference year" fields to the "CAA Drug Cost Reporting" tab in `SettingsPage.vue`. Impact: Expands data capture for CAA reporting. #vue #feature

---

## [2025-07-30]
### Changed
- [UI/UX] Refactored `Button.vue`, `Autocomplete.vue`, and `DatePicker.vue` to consistently use SCSS variables for styling. Impact: Ensures consistent theming and easier management of styles. #vue #refactor #styling
- [UI/UX] Updated `Button.vue` to use the `Pencil` icon for the `thirtiary` variant, with specified size and stroke width. Impact: Improves visual representation of the edit action. #vue #ui-ux
- [UI/UX] Adjusted the layout of the `tab-header` in `SettingsPage.vue` to correctly position the "Edit" button next to the heading. Impact: Improves visual hierarchy and user experience. #vue #ui-ux
- [Refactor] Moved `.heading-and-button-wrapper` styling to `style.scss` for global reusability. Impact: Promotes consistent layout patterns across the application. #refactor #styling
- [Feature] Implemented editing and saving functionality for the "Company Information" tab in `SettingsPage.vue`, including fields for company name, DBA, and notification threshold. Impact: Enables users to modify company-specific settings. #vue #feature
- [Feature] Added "Plan Sponsor Details" section to the "CAA Drug Cost Reporting" tab in `SettingsPage.vue`, including fields for legal name, EIN, TPA name, and TPA EIN. Impact: Expands data capture for CAA reporting. #vue #feature

### Fixed
- [Bug] Resolved "Undefined variable" errors in `Autocomplete.vue` and `DatePicker.vue` by adding `$color-text-secondary` to `style.scss`. Impact: Fixes critical build errors and ensures proper styling. #vue #bugfix #scss

---

## [2025-08-02]
### Added
- [Settings Page] Added "CAA Gag Clause Attestation" tab content in `frontend/src/views/SettingsPage.vue`.
  - Included an `h3` header "CAA Gag Clause Prohibition Compliance Attestation".
  - Wrapped the header in `.heading-and-button-wrapper` with an edit button and placed inside `.tab-header` for consistency.
  - Added a `.CAA-config` container and a `v-form` within the tab.
  - Added text "Do you authorize Liviniti to submit the CAA Gag Clause Prohibition Compliance Attestation on your behalf?" and a disclaimer.
  - Implemented a `v-item-group` with "Yes" and "No" options (mandatory variant).
  - Added save and cancel buttons for the Gag Clause section.
- [Styling] Added global styling for the `.disclaimer` class in `frontend/src/style.scss` (font-size: `$font-size-small`, color: `$color-text-secondary`).

### Changed
- [Component] Refactored `frontend/src/components/ui/Select.vue` to revert from `v-combobox` back to `v-select` to ensure correct behavior with the `searchable` prop and `modelValue` validation. This also fixed the issue where `selectedAccount` was being set to `null` in `AddedValuePage.vue`.
- [Settings Page] Updated `companyData` type in `frontend/src/views/SettingsPage.vue` to include the `authorize` property for the Gag Clause Attestation.
- [Settings Page] Modified data initialization for `editableCaaData` in `frontend/src/views/SettingsPage.vue` to ensure all relevant fields are correctly initialized.
- [Settings Page] Implemented `isEditingGagClause` and `isGagClauseChanged` reactive variables in `frontend/src/views/SettingsPage.vue`.
- [Settings Page] Added `editableGagClauseData` with an `authorize` property in `frontend/src/views/SettingsPage.vue`.
- [Settings Page] Updated `watch` logic for `selectedAccount` in `frontend/src/views/SettingsPage.vue` to correctly initialize and reset `editableGagClauseData`.
- [Settings Page] Added `updateGagClauseField`, `saveGagClauseChanges`, and `cancelGagClauseChanges` functions in `frontend/src/views/SettingsPage.vue` to manage the Gag Clause Attestation data.

### Fixed
- [Bug] Resolved issue where tab content was not displaying in `frontend/src/views/SettingsPage.vue` due to incorrect `selectedAccount` values caused by `v-combobox` behavior in `Select.vue`.
- [Bug] Fixed `AddedValuePage.vue` functionality by reverting `Select.vue` to `v-select`, which ensures `selectedAccount` holds a valid `itemValue` from `accountOptions`.
