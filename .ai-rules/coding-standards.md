# 📝 Coding Standards - Client Portal v2.0

## 📋 Project Context

**Framework**: Vue.js 3 + TypeScript + Vuetify + Composition API
**Styling**: SCSS Only
**Target**: PBM Client Portal with External/Internal Users

---

## 🛡️ TypeScript Standards (MANDATORY)

### ✅ Core TypeScript Requirements

#### 1. Interface Definitions
All structured data must have proper interfaces:

```ts
// ✅ Good - Proper interface definition
interface ReportItem {
  id: number;
  accountName: string;
  reportName: string;
  type: string;
  reportingPeriod: string;
  lastEditedBy: string;
  status: 'pending' | 'approved' | 'denied';
}

// ❌ Bad - No interface, using any
const reportItems = ref<any[]>([]);

// ✅ Good - Typed reactive data
const reportItems = ref<ReportItem[]>([]);
```

#### 2. Ref and Computed Typing
Always type your reactive references:

```ts
// ✅ Good - Explicit typing
const activeTab = ref<number>(0);
const isLoading = ref<boolean>(false);
const selectedItems = ref<string[]>([]);

// ✅ Good - Computed with proper return type
const filteredReports = computed<ReportItem[]>(() => {
  return reportItems.value.filter(r => r.status === 'pending');
});

// ❌ Bad - No typing
const activeTab = ref(0);
const filteredReports = computed(() => {
  return reportItems.value.filter(r => r.status === 'pending');
});
```

#### 3. Function Parameter Typing
All function parameters must be typed:

```ts
// ✅ Good - Typed parameters
function getStatusColor(status: string): string {
  switch (status) {
    case 'approved': return 'green';
    case 'denied': return 'red';
    default: return 'grey';
  }
}

function updateReport(id: number, data: Partial<ReportItem>): Promise<void> {
  return api.updateReport(id, data);
}

// ❌ Bad - No parameter types
function getStatusColor(status) {
  // implementation
}
```

#### 4. Props and Emits Typing
Use proper TypeScript generics for props and emits:

```ts
// ✅ Good - Typed props
interface Props {
  items: ReportItem[];
  loading?: boolean;
  selectedId?: number;
  title: string;
}

const props = defineProps<Props>();

// ✅ Good - Typed emits
const emit = defineEmits<{
  (e: 'select', id: number): void;
  (e: 'refresh'): void;
  (e: 'update', item: ReportItem): void;
}>();

// ❌ Bad - No typing
const props = defineProps(['items', 'loading', 'selectedId']);
const emit = defineEmits(['select', 'refresh', 'update']);
```

#### 5. Type Organization
- All shared types go in `src/types/`
- One interface per file when complex
- Related types can be grouped in single files

```ts
// src/types/Report.ts
export interface ReportItem {
  id: number;
  accountName: string;
  reportName: string;
  type: ReportType;
  status: ReportStatus;
}

export type ReportType = 'monthly' | 'quarterly' | 'annual';
export type ReportStatus = 'pending' | 'approved' | 'denied';

// src/types/User.ts
export interface User {
  id: number;
  name: string;
  role: UserRole;
  entityId?: number;
}

export type UserRole = 'external' | 'internal';
```

### 🚨 TypeScript Enforcement

- ✅ **All** reactive data must be typed
- ✅ **All** function parameters must be typed
- ✅ **All** props and emits must be typed
- ❌ **NO** use of `any` (without justification comment)
- ❌ **NO** implicit any declarations
- ✅ **ALL** shared types must be in `src/types/`

---

## 🎨 Vue 3 Composition API Standards

### Component Structure (MANDATORY)

Every Vue component must follow this exact structure:

```vue
<template>
  <!-- Template content -->
</template>

<script setup lang="ts">
// 1. Imports (grouped and ordered)
import { ref, computed, onMounted, watchEffect } from 'vue';
import { VBtn, VCard } from 'vuetify/components';
import { useAuth } from '@/composables/useAuth';
import type { ReportItem } from '@/types/Report';

// 2. Props interface and definition
interface Props {
  items: ReportItem[];
  loading?: boolean;
}

const props = defineProps<Props>();

// 3. Emits definition
const emit = defineEmits<{
  (e: 'select', id: number): void;
  (e: 'refresh'): void;
}>();

// 4. Composables
const { user, hasPermission } = useAuth();

// 5. Reactive state (grouped logically)
const selectedId = ref<number | null>(null);
const isLoading = ref<boolean>(false);
const searchQuery = ref<string>('');

// 6. Computed properties
const filteredItems = computed<ReportItem[]>(() => {
  if (!searchQuery.value) return props.items;
  return props.items.filter(item => 
    item.reportName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 7. Methods (grouped by functionality)
function selectItem(id: number): void {
  selectedId.value = id;
  emit('select', id);
}

function refreshData(): void {
  isLoading.value = true;
  emit('refresh');
  // Additional refresh logic
}

// 8. Watchers
watchEffect(() => {
  if (props.loading) {
    isLoading.value = props.loading;
  }
});

// 9. Lifecycle hooks
onMounted(() => {
  // Component initialization
});
</script>

<style lang="scss" scoped>
// SCSS styling (see styling standards below)
</style>
```

### Import Order Standards

```ts
// 1. Vue core imports
import { ref, computed, onMounted } from 'vue';

// 2. Vue Router imports
import { useRouter, useRoute } from 'vue-router';

// 3. Vuetify imports
import { VBtn, VCard, VDataTable } from 'vuetify/components';

// 4. Third-party library imports
import axios from 'axios';

// 5. Local composables
import { useAuth } from '@/composables/useAuth';
import { useApi } from '@/composables/useApi';

// 6. Local components
import CustomButton from '@/components/ui/CustomButton.vue';

// 7. Types (always last)
import type { ReportItem } from '@/types/Report';
import type { User } from '@/types/User';
```

---

## 🎨 SCSS Styling Standards (MANDATORY)

### ✅ SCSS Only Rule
- ✅ **ONLY** use SCSS for styling
- ❌ **NO** CSS files
- ❌ **NO** Stylus, Less, or other preprocessors
- ❌ **NO** inline styles (except for dynamic styles)

### SCSS Structure Standard

```scss
// Component: ReportTable.vue
<style lang="scss" scoped>
// 1. Import Vuetify variables (if needed)
@import 'vuetify/settings';

// 2. Component variables
$table-header-bg: #f5f5f5;
$table-border-color: #e0e0e0;
$status-approved: #4caf50;
$status-denied: #f44336;
$status-pending: #ff9800;

// 3. Main component class
.report-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;

  // BEM methodology for nested elements
  &__header {
    background-color: $table-header-bg;
    padding: 16px;
    border-bottom: 1px solid $table-border-color;
    
    &-title {
      font-weight: 600;
      font-size: 1.2rem;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  &__body {
    background-color: white;
  }

  &__row {
    border-bottom: 1px solid $table-border-color;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    &--selected {
      background-color: rgba(25, 118, 210, 0.08);
    }
  }

  &__cell {
    padding: 12px 16px;
    vertical-align: middle;
  }

  // Status-specific styling
  &__status {
    &--approved {
      color: $status-approved;
    }

    &--denied {
      color: $status-denied;
    }

    &--pending {
      color: $status-pending;
    }
  }

  // Responsive breakpoints (use Vuetify's breakpoint system)
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    &__header {
      padding: 12px;
    }

    &__cell {
      padding: 8px 12px;
      font-size: 0.875rem;
    }
  }
}

// Mobile-specific styles
.mobile-optimized {
  .report-table {
    &__row {
      display: block;
      margin-bottom: 8px;
      border: 1px solid $table-border-color;
      border-radius: 4px;
    }

    &__cell {
      display: block;
      padding: 8px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
```

### SCSS Naming Conventions

```scss
// ✅ Good - BEM methodology
.component-name {
  // Base component styles
  
  &__element {
    // Element within component
  }
  
  &__element--modifier {
    // Modified element
  }
  
  &--modifier {
    // Modified component
  }
}

// ✅ Good - Descriptive class names
.pbm-data-table { }
.report-status-indicator { }
.claim-progress-tracker { }

// ❌ Bad - Generic or unclear names
.table { }
.btn { }
.content { }
```

---

## 🧩 Custom Component Standards

### Vuetify Component Extension

When creating custom components from Vuetify components:

```vue
<!-- CustomButton.vue -->
<template>
  <v-btn
    v-bind="$attrs"
    :class="computedClasses"
    @click="handleClick"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
// ✅ Good - Inherit all Vuetify props
defineOptions({
  inheritAttrs: false
});

interface Props {
  // Only add props that are truly custom
  customBehavior?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  customBehavior: false
});

const emit = defineEmits<{
  (e: 'custom-event', data: string): void;
}>();

// ✅ Good - Check existing Vuetify props first
const computedClasses = computed<string>(() => {
  return props.customBehavior ? 'custom-button--special' : '';
});

function handleClick(event: MouseEvent): void {
  // Custom click handling
  emit('custom-event', 'clicked');
}
</script>
```

### Component Prop Guidelines

```ts
// ✅ Good - Check Vuetify props first
// Before creating this prop:
interface Props {
  buttonColor?: string; // ❌ Bad - v-btn already has 'color' prop
}

// Do this instead:
// <CustomButton color="primary" /> - Use existing Vuetify prop

// ✅ Good - Only create props for truly custom behavior
interface Props {
  showConfirmation?: boolean; // ✅ Good - Custom behavior
  trackAnalytics?: boolean;   // ✅ Good - Custom behavior
}
```

---



### Naming Conventions

```ts
// ✅ Good - File naming
HomePage.vue           // Views: PascalCase + Page suffix
ReportsPage.vue       // Views: PascalCase + Page suffix
DataTable.vue         // Components: PascalCase
CustomButton.vue      // Components: PascalCase
useAuth.ts           // Composables: camelCase + use prefix
useReportData.ts     // Composables: camelCase + use prefix
Report.ts            // Types: PascalCase
User.ts              // Types: PascalCase
formatters.ts        // Utils: camelCase
validators.ts        // Utils: camelCase

// ❌ Bad - File naming
homePage.vue         // Wrong case
data-table.vue       // Wrong format
authComposable.ts    // Wrong prefix
```

---

## 🔧 Error Handling Standards

### Function Error Handling

```ts
// ✅ Good - Proper error handling
async function fetchReports(): Promise<ReportItem[]> {
  try {
    const response = await api.get<ApiResponse<ReportItem[]>>('/reports');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    // Show user-friendly error message
    throw new Error('Unable to load reports. Please try again.');
  }
}

// ✅ Good - Error handling in composables
export function useReportData() {
  const reports = ref<ReportItem[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function loadReports(): Promise<void> {
    loading.value = true;
    error.value = null;
    
    try {
      reports.value = await fetchReports();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  return {
    reports: readonly(reports),
    loading: readonly(loading),
    error: readonly(error),
    loadReports
  };
}
```

### Component Error Handling

```vue
<template>
  <div class="report-container">
    <v-alert
      v-if="error"
      type="error"
      dismissible
      @click:close="error = null"
    >
      {{ error }}
    </v-alert>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <ReportTable
      v-else-if="reports.length > 0"
      :items="reports"
      @select="handleSelect"
    />

    <v-empty-state
      v-else
      title="No reports found"
      text="There are no reports available for your account."
    />
  </div>
</template>

<script setup lang="ts">
const { reports, loading, error, loadReports } = useReportData();

function handleSelect(id: number): void {
  try {
    // Handle selection logic
  } catch (err) {
    error.value = 'Failed to select report';
  }
}
</script>
```

---

## 📚 Documentation Standards

### JSDoc Comments

```ts
/**
 * Fetches reports for the current user's entity
 * @param filters - Optional filters to apply
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 * @returns Promise that resolves to paginated report data
 * @throws Error when API request fails
 */
async function fetchReports(
  filters?: ReportFilters,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<ReportItem>> {
  // Implementation
}

/**
 * Custom composable for managing report data
 * Provides reactive state and methods for report operations
 */
export function useReportData() {
  // Implementation
}
```

### Code Comments

```ts
// ✅ Good - Explain complex business logic
function calculateClaimStatus(claim: ClaimItem): ClaimStatus {
  // PBM business rule: Claims over $1000 require additional approval
  if (claim.amount > 1000) {
    return 'pending_approval';
  }
  
  // Auto-approve claims under $1000 for established accounts
  return claim.accountAge > 12 ? 'approved' : 'pending_review';
}

// ✅ Good - Explain temporary workarounds
// TODO: Remove this workaround once API v2 is deployed
const legacyApiFormat = transformToLegacyFormat(data);

// ❌ Bad - Obvious comments
const name = 'John'; // Set name to John
const count = items.length; // Get the length of items
```

---

## 🧪 Code Quality Standards

### Variable Naming

```ts
// ✅ Good - Descriptive names
const selectedReportId = ref<number | null>(null);
const isLoadingReports = ref<boolean>(false);
const filteredHighCostClaims = computed<ClaimItem[]>(() => {
  return claims.value.filter(claim => claim.amount > 1000);
});

// ❌ Bad - Generic names
const id = ref<number | null>(null);
const loading = ref<boolean>(false);
const items = computed<any[]>(() => {
  return data.value.filter(item => item.amount > 1000);
});
```

### Function Structure

```ts
// ✅ Good - Single responsibility
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ❌ Bad - Multiple responsibilities
function formatAndValidateData(data: any): any {
  // Format currency
  data.amount = formatCurrency(data.amount);
  
  // Validate email
  if (!validateEmail(data.email)) {
    throw new Error('Invalid email');
  }
  
  // Transform data
  return transformData(data);
}
```

---

## 🚨 Code Review Checklist

### Before Committing

- [ ] All TypeScript interfaces defined
- [ ] All function parameters typed
- [ ] All reactive data typed
- [ ] SCSS used exclusively (no CSS)
- [ ] BEM naming convention followed
- [ ] Error handling implemented
- [ ] Loading states provided
- [ ] Component structure follows standard
- [ ] Imports properly organized
- [ ] No `any` types (or justified with comments)
- [ ] Proper JSDoc for complex functions
- [ ] Responsive design considered

### Common Issues to Avoid

```ts
// ❌ Common mistakes
const data = ref([]); // No typing
const props = defineProps(['items']); // No typing
function handleClick(id) { } // No parameter typing
const items = computed(() => data.value); // No return typing

// ✅ Correct approach
const data = ref<ItemType[]>([]);
const props = defineProps<{ items: ItemType[] }>();
function handleClick(id: number): void { }
const items = computed<ItemType[]>(() => data.value);
```

---

**Remember**: These coding standards are non-negotiable. They ensure code quality, maintainability, and team consistency. Every line of code should follow these standards.