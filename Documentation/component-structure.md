# Component Documentation

This document provides a detailed overview of the Vue components used in the Client Portal application.

---

## Common Components (`frontend/src/components/common/`)

### 1. AccordionCard.vue

**Description:**
A reusable accordion card component that displays a header with a title and description, and expandable content.

**Props:**
- `showChevron` (Boolean, optional, default: `true`): Whether to show the chevron icon for expanding/collapsing the accordion.
- `headerText` (String, optional, default: `'Accordion Card'`): The main title text for the accordion header.
- `descriptionText` (String, optional, default: `''`): The descriptive text displayed below the header title.

**Slots:**
- `content`: The content to be displayed when the accordion is expanded.

### 2. AccountPrescriptionCard.vue

**Description:**
A card component that displays account and prescription information, including account name, carrier, status, and other details.

**Props:**
- `accountName` (String, required): The name of the account.
- `carrier` (String, required): The name of the carrier.
- `livesCovered` (Number, required): The number of lives covered.
- `startDate` (String, required): The start date of the coverage.
- `endDate` (String, required): The end date of the coverage.
- `routingBin` (String, required): The routing BIN.
- `status` (String, required, one of: `'active'`, `'inactive'`, `'implementing'`): The status of the account.

### 3. AccountSelector.vue

**Description:**
A component that provides a heading, subheading, and a dropdown selector for accounts. It can also display additional content via a slot.

**Props:**
- `heading` (String, required): The main heading for the component.
- `subheading` (String, required): The subheading displayed below the main heading.
- `items` (Array, required): The array of items to be displayed in the select dropdown.
- `label` (String, required): The label for the select dropdown.
- `itemTitle` (String, required): The property name for the title of the select items.
- `itemValue` (String, required): The property name for the value of the select items.
- `searchable` (Boolean, required): Whether the select dropdown is searchable.
- `modelValue` (any, required): The v-model value for the select dropdown.
- `showSlot` (Boolean, optional, default: `false`): Whether to show the content slot.
- `variant` (String, optional): The variant of the select component.

**Slots:**
- `default`: The content to be displayed below the account selector header.

### 4. AvgApprovalTimeChart.vue

**Description:**
A KPI card component that displays the average approval time.

**Props:** None

### 5. Banner.vue

**Description:**
A banner component for displaying informational or warning messages.

**Props:**
- `variant` (String, required, one of: `'info'`, `'warning'`): The variant of the banner, which determines its color and icon.
- `message` (String, required): The message to be displayed in the banner.
- `infoIcon` (any, optional, default: `Info` from `lucide-vue-next`): The icon to be displayed for the 'info' variant.
- `showButton` (Boolean, optional, default: `false`): Whether to show a button in the banner.
- `buttonProps` (Object, optional, default: `{}`): The props to be passed to the button component.

### 6. ImplementationStatusChart.vue

**Description:**
A horizontal bar chart that displays the status of implementations.

**Props:**
- `data` (Object, required): The data for the chart, with keys `new`, `inProgress`, `pendingAction`, and `completed`.
- `headerText` (String, optional, default: `'Implementations Overview'`): The title of the chart.

### 7. PageCard.vue

**Description:**
A simple card component with a header and content area, typically used to wrap page content.

**Props:**
- `headerText` (String, optional, default: `'Reports Awaiting Approval'`): The header text for the card.
- `descriptionText` (String, optional, default: `'View and approve reports for visibility to the client.'`): The description text below the header.

**Slots:**
- `default`: The main content of the card.

### 8. ReportDataTable.vue

**Description:**
A versatile data table component for displaying reports, with features like searching, filtering, and actions.

**Props:**
- `showSearchBar` (Boolean, optional, default: `true`): Whether to show the search bar.
- `showFilterButton` (Boolean, optional, default: `true`): Whether to show the filter button in the search bar.
- `showFilterPills` (Boolean, optional, default: `true`): Whether to show the filter pills.
- `headers` (Array, required): The headers for the data table.
- `items` (Array, optional, default: `[]`): The items to be displayed in the data table.
- `showRowActions` (Boolean, optional, default: `true`): Whether to show the row actions menu.
- `showTableFooter` (Boolean, optional, default: `true`): Whether to show the table footer with pagination.
- `showSelectionCheckboxes` (Boolean, optional, default: `true`): Whether to show checkboxes for row selection.
- `initialFilterPills` (Array, optional, default: `[]`): The initial set of filter pills.
- `showActionIcons` (Boolean, optional, default: `false`): Whether to show action icons instead of the actions menu.
- `actionIcons` (Array, optional, default: `[]`): The array of action icons to be displayed.
- `searchPlaceholder` (String, optional, default: `'Search by report name, report type, or keyword'`): The placeholder text for the search bar.
- `showInternalUserActions` (Boolean, optional, default: `false`): Whether to show actions specific to internal users.
- `internalUserActionFormatter` (Function, optional, default: `() => '-'`): A function to format the internal user action text.
- `internalUserActionClickHandler` (Function, optional, default: `() => {}`): A function to handle clicks on the internal user action.
- `booleanColumns` (Array, optional, default: `[]`): An array of column keys that should be displayed as checkboxes.

**Slots:**
- `item.ruleChangeLog`: A slot for custom rendering of the `ruleChangeLog` column.
- `item.{name}`: Dynamic slots for custom rendering of any column.

### 9. ReportStatusChart.vue

**Description:**
A donut chart that displays the status of reports.

**Props:** None

### 10. ReportTable.vue

**Description:**
A simple table for displaying a list of reports with their name, generation date, and status.

**Props:**
- `reports` (Array, optional, default: `[]`): The array of report objects to display.

### 11. ReportsByAccountChart.vue

**Description:**
A horizontal bar chart that displays the top 5 accounts with pending reports.

**Props:** None

### 12. ReportsByTypeChart.vue

**Description:**
A bar chart that displays the number of reports by type.

**Props:** None

### 13. SummaryWidget.vue

**Description:**
A widget for displaying a summary of information, including a title, count, description, and an optional icon.

**Props:**
- `title` (String, required): The title of the widget.
- `count` (String or Number, required): The main count or value to display.
- `description` (String, required): A description of the summary.
- `showIcon` (Boolean, optional, default: `false`): Whether to show an icon.
- `icon` (Function, optional, default: `Flame` from `lucide-vue-next`): The icon component to display.
- `iconBackgroundColor` (String, optional, default: `'transparent'`): The background color for the icon wrapper.
- `iconColor` (String, optional, default: `'var(--color-primary)'`): The color of the icon.
- `clickable` (Boolean, optional, default: `true`): Whether the widget is clickable.

### 14. Tabs.vue

**Description:**
A component for displaying a set of tabs.

**Props:**
- `tabs` (Array, required): An array of tab objects, each with a `label`, `key`, and optional `count` and `hasDropdown` properties.

### 15. TotalPendingChart.vue

**Description:**
A KPI card component that displays the total number of pending reports.

**Props:** None

### 16. UpcomingImplementationsTable.vue

**Description:**
A data table that displays upcoming implementations.

**Props:**
- `headerText` (String, optional, default: `'Upcoming Implementations Next 90 Days'`): The title of the table.

---

## Layout Components (`frontend/src/components/layout/`)

### 1. Header.vue

**Description:**
The main application header, containing a "Fiduciary Dashboard" button and a user profile menu.

**Props:** None

### 2. Sidebar.vue

**Description:**
The main application sidebar, providing navigation links. It dynamically filters links based on the user type.

**Props:** None

---

## UI Components (`frontend/src/components/ui/`)

### 1. Autocomplete.vue

**Description:**
A wrapper around the Vuetify `v-autocomplete` component with custom styling.

**Props:**
- `items` (Array, required): The items for the autocomplete.
- `label` (String, optional, default: `''`): The label for the autocomplete.
- `multiple` (Boolean, optional, default: `false`): Whether multiple selections are allowed.
- `readonly` (Boolean, optional, default: `false`): Whether the autocomplete is readonly.
- `modelValue` (any, optional): The v-model value.
- `variant` (String, optional, default: `'outlined'`): The variant of the autocomplete.
- `density` (String, optional, default: `'compact'`): The density of the autocomplete.

### 2. Breadcrumbs.vue

**Description:**
A breadcrumbs component that automatically generates breadcrumbs based on the current route.

**Props:** None

### 3. Button.vue

**Description:**
A custom button component with different variants.

**Props:**
- `variant` (String, required, one of: `'alert'`, `'primary'`, `'secondary'`, `'thirtiary'`): The variant of the button.
- `disabled` (Boolean, optional, default: `false`): Whether the button is disabled.
- `label` (String, required): The text label for the button.
- `textColor` (String, optional, default: `'var(--color-primary)'`): The text color for the secondary variant.
- `showIcon` (Boolean, optional, default: `false`): Whether to show an icon.
- `icon` (Object, optional, default: `null`): The icon component to display.

### 4. Card.vue

**Description:**
A custom card component with various options for content and actions.

**Props:**
- `title` (String, optional, default: `''`): The title of the card.
- `subtitle` (String, optional, default: `''`): The subtitle of the card.
- `text` (String, optional, default: `''`): The main text content of the card.
- `actions` (Array, optional, default: `[]`): An array of action objects for buttons.
- `selected` (Boolean, optional, default: `false`): Whether the card is in a selected state.
- `selectable` (Boolean, optional, default: `false`): Whether the card is selectable.
- `variant` (String, optional, default: `'default'`, one of: `'default'`, `'checkbox'`): The variant of the card.
- `flat` (Boolean, optional, default: `false`): Whether the card should have a flat appearance.

**Slots:**
- `default`: The main content of the card.

### 5. ComboBox.vue

**Description:**
A wrapper around the Vuetify `v-combobox` component with custom styling and search functionality.

**Props:**
- `items` (Array, required): The items for the combobox.
- `label` (String, optional, default: `'Select'`): The label for the combobox.
- `modelValue` (any, optional): The v-model value.
- `searchable` (Boolean, optional, default: `false`): Whether the combobox is searchable.
- `itemTitle` (String, optional, default: `'title'`): The property for the item title.
- `itemValue` (String, optional, default: `'value'`): The property for the item value.
- `noDataText` (String, optional, default: `'No data available'`): The text to display when there is no data.
- `variant` (String, optional, default: `'outlined'`): The variant of the combobox.

### 6. DatePicker.vue

**Description:**
A date picker component that uses a text field and a calendar dropdown.

**Props:**
- `label` (String, optional, default: `''`): The label for the date picker.
- `modelValue` (String, optional, default: `''`): The v-model value (formatted as `DD/MM/YYYY`).
- `readonly` (Boolean, optional, default: `false`): Whether the date picker is readonly.
- `color` (String, optional, default: `'primary'`): The color of the date picker.
- `variant` (String, optional, default: `'outlined'`): The variant of the text field.
- `density` (String, optional, default: `'compact'`): The density of the text field.

### 7. Dialog.vue

**Description:**
A dialog component for displaying modal content.

**Props:**
- `modelValue` (Boolean, required): The v-model value to control the dialog's visibility.
- `persistent` (Boolean, optional, default: `false`): Whether the dialog is persistent.
- `icon` (LucideIcon, optional): The icon to display in the dialog title.
- `heading` (String, required): The heading text for the dialog.
- `actions` (Array, optional, default: `[]`): An array of action objects for buttons.
- `showSecondaryButton` (Boolean, optional, default: `false`): Whether to show the secondary button.

**Slots:**
- `default`: The main content of the dialog.

### 8. FileUploader.vue

**Description:**
A file uploader component with drag-and-drop functionality and document type selection.

**Props:**
- `showDocumentTypeSelection` (Boolean, optional, default: `true`): Whether to show the document type selection.

### 9. FilteringPill.vue

**Description:**
A chip component used for filtering, with an active state.

**Props:**
- `closable` (Boolean, optional, default: `false`): Whether the pill is closable.
- `isActive` (Boolean, optional, default: `false`): Whether the pill is in an active state.

### 10. SearchBar.vue

**Description:**
A search bar component with an input field and optional filter and search buttons.

**Props:**
- `placeholder` (String, optional, default: `'Search by report name, report type, or keyword'`): The placeholder text for the search input.
- `showFilterButton` (Boolean, optional, default: `true`): Whether to show the filter button.
- `showSearchButton` (Boolean, optional, default: `false`): Whether to show the search button.

### 11. Select.vue

**Description:**
A wrapper around the Vuetify `v-select` component with custom styling and search functionality.

**Props:**
- `items` (Array, required): The items for the select.
- `label` (String, optional, default: `'Account'`): The label for the select.
- `modelValue` (any, optional): The v-model value.
- `searchable` (Boolean, optional, default: `false`): Whether the select is searchable.
- `itemTitle` (String, optional, default: `'title'`): The property for the item title.
- `itemValue` (String, optional, default: `'value'`): The property for the item value.
- `noDataText` (String, optional, default: `'No data available'`): The text to display when there is no data.
- `variant` (String, optional, default: `'outlined'`): The variant of the select.

### 12. TextField.vue

**Description:**
A wrapper around the Vuetify `v-text-field` component with custom styling and a tooltip for truncated text.

**Props:**
- `readonly` (Boolean, optional, default: `false`): Whether the text field is readonly.
- `modelValue` (String, optional): The v-model value.