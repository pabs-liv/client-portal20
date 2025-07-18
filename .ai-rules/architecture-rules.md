# 🏗️ Architecture Rules - Client Portal v2.0

## 📋 Project Context

**Architecture**: Vue.js 3 + TypeScript + Vuetify + Composition API
**State Management**: Pinia/Vuex
**Target**: PBM Client Portal with Entity-Scoped Data Access
**Users**: External (Consultants, Brokers, TPAs) + Internal (Staff)

---

## 🏢 Overall Architecture Pattern

### Application Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Portal v2.0                      │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (Vue 3 + Vuetify Components)          │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer (Composables + Services)            │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer (API Services + State Management)      │
├─────────────────────────────────────────────────────────────┤
│  External APIs (PBM Backend, Authentication, etc.)        │
└─────────────────────────────────────────────────────────────┘
```

### Core Architectural Principles

1. **Single Responsibility**: Each module has one clear purpose
2. **Dependency Inversion**: High-level modules don't depend on low-level modules
3. **Entity Isolation**: External users only access their entity data
4. **Composition over Inheritance**: Use composables for shared logic
5. **Progressive Enhancement**: Mobile-first, desktop-enhanced

---

## 📁 Project Structure Architecture

### Directory Organization (MANDATORY)

```
src/
├── components/            # Reusable UI components
│   ├── common/           # Reusable business/feature components
│   │   ├── Navigation.vue
│   │   ├── UserProfile.vue
│   │   ├── EntitySelector.vue
│   │   ├── PermissionWrapper.vue
│   │   ├── DataTable.vue
│   │   ├── ReportExplorer.vue
│   │   └── SearchFilters.vue
│   ├── layout/           # Layout-specific components
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   └── ui/               # Atomic UI components (basic building blocks)
│       ├── Button.vue
│       ├── Input.vue
│       ├── Chip.vue
│       ├── Card.vue
│       ├── Modal.vue
│       └── ProgressTracker.vue
├── views/                 # Page-level components
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard and home
│   ├── reports/          # Reports module
│   ├── claims/           # High-cost claims module
│   └── settings/         # Settings module
├── composables/          # Business logic composables
│   ├── auth/            # Authentication composables
│   ├── data/            # Data management composables
│   ├── ui/              # UI-specific composables
│   └── utils/           # Utility composables
├── services/             # External service integrations
│   ├── api/             # API service layer
│   ├── auth/            # Authentication services
│   └── storage/         # Storage services
├── stores/               # Pinia stores (create when needed)
│   ├── auth.ts          # Authentication state
│   ├── user.ts          # User state
│   └── entities.ts      # Entity data state
├── types/                # TypeScript type definitions (create when needed)
│   ├── api/             # API response types
│   ├── entities/        # Business entity types
│   └── ui/              # UI component types
├── utils/                # Pure utility functions
│   ├── formatters.ts    # Data formatting
│   ├── validators.ts    # Validation functions
│   └── constants.ts     # Application constants
├── router/               # Vue Router configuration
│   ├── index.ts         # Main router setup
│   └── guards/          # Route guards
├── plugins/              # Vue plugins and configurations
│   ├── vuetify.ts       # Vuetify configuration
│   └── pinia.ts         # Pinia configuration
├── App.vue              # Root component
├── main.ts              # Application entry point
└── style.css            # Global styles (can evolve to styles/ directory)
```

### Component Organization Rules

#### `components/ui/` - Atomic Components
Basic building blocks that are highly reusable and have minimal business logic:

```
ui/
├── Button.vue           # Custom button extending v-btn
├── Input.vue            # Custom input extending v-text-field
├── Chip.vue             # Custom chip extending v-chip
├── Card.vue             # Custom card extending v-card
├── Modal.vue            # Custom modal extending v-dialog
├── Loader.vue           # Loading indicators
├── Badge.vue            # Status badges
├── Avatar.vue           # User avatars
├── Tooltip.vue          # Custom tooltips
└── ProgressTracker.vue  # Progress indicators
```

#### `components/common/` - Reusable Components
More complex components that combine multiple UI elements or contain business logic:

```
common/
├── Navigation.vue       # Main navigation component
├── UserProfile.vue      # User profile dropdown/panel
├── EntitySelector.vue   # Entity selection component
├── PermissionWrapper.vue # Permission-based rendering
├── DataTable.vue        # Enhanced data table with sorting/filtering
├── ReportExplorer.vue   # Report visualization component
├── SearchFilters.vue    # Search and filter controls
├── StatusIndicator.vue  # Status display with business logic
├── NotificationCenter.vue # Notification management
└── FileUploader.vue     # File upload component
```

#### `components/layout/` - Layout Components
Components specifically for page layout and structure:

```
layout/
├── AppHeader.vue        # Application header
├── AppSidebar.vue       # Navigation sidebar
├── AppFooter.vue        # Application footer
├── PageHeader.vue       # Page-specific header
└── ContentWrapper.vue   # Main content area wrapper
```

### Module Organization Principles

```ts
// ✅ Good - Feature-based organization with component separation
src/
├── components/
│   ├── common/          # Reusable across multiple features
│   │   ├── DataTable.vue
│   │   ├── SearchFilters.vue
│   │   └── StatusIndicator.vue
│   ├── ui/              # Atomic building blocks
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── Modal.vue
│   └── layout/          # Layout-specific
│       ├── AppHeader.vue
│       └── AppSidebar.vue
├── views/
│   ├── reports/
│   │   ├── ReportsPage.vue           # Main page
│   │   ├── components/               # Report-specific components
│   │   │   ├── ReportTypeFilter.vue  # Only used in reports
│   │   │   ├── ReportChart.vue       # Only used in reports
│   │   │   └── ReportExporter.vue    # Only used in reports
│   │   └── composables/              # Report-specific logic
│   │       ├── useReportData.ts
│   │       └── useReportFilters.ts
│   └── claims/
│       ├── HighCostClaimsPage.vue
│       ├── components/               # Claims-specific components
│       │   ├── ClaimStatusChart.vue
│       │   └── ClaimDetails.vue
│       └── composables/
│           └── useClaimData.ts

// ❌ Bad - Everything in global components
src/
├── components/
│   ├── ReportTypeFilter.vue    # Should be in views/reports/components/
│   ├── ClaimStatusChart.vue    # Should be in views/claims/components/
│   └── DataTable.vue           # ✅ Good - truly reusable
```

### Component Placement Guidelines

#### Use `components/ui/` when:
- ✅ Component is a basic building block (Button, Input, Card)
- ✅ Component has minimal business logic
- ✅ Component extends a single Vuetify component
- ✅ Component is used across multiple features

#### Use `components/common/` when:
- ✅ Component combines multiple UI elements
- ✅ Component contains business logic or data management
- ✅ Component is reusable across multiple features
- ✅ Component has specific functionality (DataTable, SearchFilters)

#### Use `components/layout/` when:
- ✅ Component is part of the application layout
- ✅ Component is always present (Header, Sidebar, Footer)
- ✅ Component handles layout-specific logic

#### Use `views/[feature]/components/` when:
- ✅ Component is only used within a specific feature
- ✅ Component contains feature-specific business logic
- ✅ Component is tightly coupled to a specific page or workflow

---

## 🔄 Data Flow Architecture

### State Management Pattern

```ts
// Store (Pinia) - Global state
├── Authentication State
├── User Preferences
├── Entity Data
└── Application State

// Composables - Business logic
├── Data fetching
├── Data transformation
├── Business rules
└── Side effects

// Components - Presentation
├── Display data
├── Handle user interactions
├── Emit events
└── Local UI state only
```

### Data Flow Rules

1. **Single Source of Truth**: Global state in Pinia stores
2. **Unidirectional Flow**: Data flows down, events flow up
3. **Entity Isolation**: External users only access their entity data
4. **Reactive Updates**: Use Vue's reactivity for real-time updates

```ts
// ✅ Good - Proper data flow
// Store
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isExternal = computed(() => user.value?.role === 'external');
  
  return { user, isExternal };
});

// Composable
export function useReportData() {
  const { user, isExternal } = useAuthStore();
  
  const reports = ref<Report[]>([]);
  
  async function fetchReports() {
    const endpoint = isExternal.value 
      ? `/api/reports/entity/${user.value?.entityId}`
      : `/api/reports/all`;
    
    reports.value = await api.get(endpoint);
  }
  
  return { reports, fetchReports };
}

// Component
<script setup lang="ts">
const { reports, fetchReports } = useReportData();
</script>
```

---

## 🧩 Component Architecture

### Component Hierarchy (Atomic Design Pattern)

```
App.vue
├── Layout Components (layout/)
│   ├── AppHeader.vue
│   ├── AppSidebar.vue
│   └── AppFooter.vue
├── RouterView
│   ├── Page Components (views/)
│   │   ├── HomePage.vue
│   │   │   ├── Common Components (common/)
│   │   │   │   ├── DashboardWidgets.vue
│   │   │   │   ├── QuickActions.vue
│   │   │   │   └── ReportExplorer.vue
│   │   │   └── UI Components (ui/)
│   │   │       ├── Button.vue
│   │   │       ├── Card.vue
│   │   │       └── Chip.vue
│   │   └── ReportsPage.vue
│   │       ├── Common Components (common/)
│   │       │   ├── DataTable.vue
│   │       │   ├── SearchFilters.vue
│   │       │   └── StatusIndicator.vue
│   │       └── UI Components (ui/)
│   │           ├── Modal.vue
│   │           ├── Button.vue
│   │           └── ProgressTracker.vue
```

### Component Decision Tree

Use this decision tree to determine where a component should go:

```
Is this a layout component (header, sidebar, footer)?
├── YES → components/layout/
└── NO → Is this a basic, atomic UI element?
    ├── YES → components/ui/
    └── NO → Is this a reusable component with business logic?
        ├── YES → components/common/
        └── NO → Is this a page-level component?
            └── YES → views/
```

### Examples by Category

#### ✅ UI Components (Atomic)
```vue
<!-- components/ui/Button.vue -->
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
// Minimal logic, mostly styling and basic behavior
defineOptions({ inheritAttrs: false });

interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
});

const computedClasses = computed(() => {
  return `custom-button--${props.variant}`;
});

function handleClick(event: MouseEvent) {
  // Basic click handling
}
</script>
```

#### ✅ Common Components (Reusable + Business Logic)
```vue
<!-- components/common/DataTable.vue -->
<template>
  <div class="data-table">
    <div class="data-table__header">
      <slot name="header" />
      <SearchFilters
        v-if="showFilters"
        :filters="filters"
        @update="handleFilterUpdate"
      />
    </div>
    
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      @click:row="handleRowClick"
    >
      <template #item.status="{ item }">
        <StatusIndicator :status="item.status" />
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
// Complex business logic, multiple UI components, data management
import SearchFilters from '@/components/common/SearchFilters.vue';
import StatusIndicator from '@/components/common/StatusIndicator.vue';

interface Props {
  items: any[];
  headers: TableHeader[];
  loading?: boolean;
  showFilters?: boolean;
  entityScoped?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showFilters: true,
  entityScoped: true
});

// Business logic for filtering, sorting, entity scoping
const { filteredItems, filters, handleFilterUpdate } = useDataTableFilters(props);

function handleRowClick(item: any) {
  // Business logic for row selection
}
</script>
```

#### ✅ Layout Components
```vue
<!-- components/layout/AppHeader.vue -->
<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="toggleSidebar" />
    <v-toolbar-title>Client Portal v2.0</v-toolbar-title>
    <v-spacer />
    <UserProfile />
  </v-app-bar>
</template>

<script setup lang="ts">
// Layout-specific logic
import UserProfile from '@/components/common/UserProfile.vue';

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void;
}>();

function toggleSidebar() {
  emit('toggle-sidebar');
}
</script>
```

### Component Communication Patterns

#### 1. Parent-Child Communication
```ts
// ✅ Good - Props down, events up
// Parent
<template>
  <ReportTable 
    :items="reports" 
    :loading="isLoading"
    @select="handleSelect"
    @refresh="refreshData"
  />
</template>

// Child
<script setup lang="ts">
interface Props {
  items: Report[];
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', id: number): void;
  (e: 'refresh'): void;
}>();
</script>
```

#### 2. Sibling Communication
```ts
// ✅ Good - Use shared composable or store
// Shared composable
export function useReportSelection() {
  const selectedId = ref<number | null>(null);
  
  function selectReport(id: number) {
    selectedId.value = id;
  }
  
  return { selectedId, selectReport };
}

// Components use shared state
const { selectedId, selectReport } = useReportSelection();
```

#### 3. Cross-Module Communication
```ts
// ✅ Good - Use Pinia store for global state
export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  
  function addNotification(notification: Notification) {
    notifications.value.push(notification);
  }
  
  return { notifications, addNotification };
});
```

---

## 🌐 API Integration Architecture

### Service Layer Pattern

```ts
// services/api/base.ts
export class ApiService {
  private baseURL: string;
  private headers: Record<string, string>;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }
  
  async get<T>(endpoint: string): Promise<T> {
    // Implementation with error handling
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    // Implementation with error handling
  }
}

// services/api/reports.ts
export class ReportsApiService extends ApiService {
  async getReports(entityId?: number): Promise<Report[]> {
    const endpoint = entityId 
      ? `/reports/entity/${entityId}`
      : '/reports/all';
    
    return this.get<Report[]>(endpoint);
  }
  
  async createReport(report: CreateReportRequest): Promise<Report> {
    return this.post<Report>('/reports', report);
  }
}

// services/api/index.ts
export const reportsApi = new ReportsApiService(API_BASE_URL);
```

### API Integration Rules

1. **Service Layer**: All API calls go through service classes
2. **Error Handling**: Centralized error handling in services
3. **Type Safety**: All API responses are typed
4. **Entity Scoping**: Services handle entity-based filtering
5. **Caching**: Implement caching at service level

```ts
// ✅ Good - Service with error handling and typing
export class ClaimsApiService extends ApiService {
  async getHighCostClaims(
    entityId?: number,
    filters?: ClaimFilters
  ): Promise<ApiResponse<Claim[]>> {
    try {
      const params = this.buildParams({ entityId, ...filters });
      const response = await this.get<ApiResponse<Claim[]>>(`/claims/high-cost?${params}`);
      
      return response;
    } catch (error) {
      console.error('Failed to fetch high cost claims:', error);
      throw new ApiError('Unable to load claims data', error);
    }
  }
}
```

---

## 🛣️ Routing Architecture

### Route Organization

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards/auth';
import { permissionGuard } from './guards/permissions';

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    component: () => import('@/views/reports/ReportsPage.vue'),
    meta: { requiresAuth: true, permission: 'reports:read' }
  },
  {
    path: '/settings',
    component: () => import('@/views/settings/SettingsPage.vue'),
    meta: { requiresAuth: true, permission: 'settings:read' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Apply guards
router.beforeEach(authGuard);
router.beforeEach(permissionGuard);

export default router;
```

### Route Guard Architecture

```ts
// guards/auth.ts
export function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const { isAuthenticated } = useAuthStore();
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login');
  } else {
    next();
  }
}

// guards/permissions.ts
export function permissionGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const { hasPermission } = usePermissions();
  
  if (to.meta.permission && !hasPermission(to.meta.permission)) {
    next('/unauthorized');
  } else {
    next();
  }
}
```

---

## 🔧 Composable Architecture

### Composable Organization

```ts
// composables/auth/useAuth.ts
export function useAuth() {
  const store = useAuthStore();
  
  return {
    user: readonly(store.user),
    isAuthenticated: readonly(store.isAuthenticated),
    login: store.login,
    logout: store.logout
  };
}

// composables/data/useReportData.ts
export function useReportData() {
  const reports = ref<Report[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  async function fetchReports(filters?: ReportFilters) {
    loading.value = true;
    error.value = null;
    
    try {
      reports.value = await reportsApi.getReports(filters);
    } catch (err) {
      error.value = 'Failed to load reports';
    } finally {
      loading.value = false;
    }
  }
  
  return {
    reports: readonly(reports),
    loading: readonly(loading),
    error: readonly(error),
    fetchReports
  };
}

// composables/ui/useDataTable.ts
export function useDataTable<T>() {
  const items = ref<T[]>([]);
  const selectedItems = ref<T[]>([]);
  const search = ref('');
  const sortBy = ref<string>('');
  const sortOrder = ref<'asc' | 'desc'>('asc');
  
  const filteredItems = computed(() => {
    let filtered = items.value;
    
    if (search.value) {
      filtered = filtered.filter(item => 
        JSON.stringify(item).toLowerCase().includes(search.value.toLowerCase())
      );
    }
    
    if (sortBy.value) {
      filtered = filtered.sort((a, b) => {
        // Sorting logic
      });
    }
    
    return filtered;
  });
  
  return {
    items,
    selectedItems,
    search,
    sortBy,
    sortOrder,
    filteredItems,
    setItems: (newItems: T[]) => { items.value = newItems; }
  };
}
```

### Composable Rules

1. **Single Responsibility**: Each composable has one clear purpose
2. **Reactive Returns**: Return readonly refs for data, functions for actions
3. **Error Handling**: Include error states and handling
4. **Cleanup**: Properly clean up subscriptions and timers
5. **Typing**: Full TypeScript support

---

## 📊 State Management Architecture

### Pinia Store Structure

```ts
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const permissions = ref<string[]>([]);
  
  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const isExternal = computed(() => user.value?.role === 'external');
  const isInternal = computed(() => user.value?.role === 'internal');
  
  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      const response = await authApi.login(credentials);
      user.value = response.user;
      token.value = response.token;
      permissions.value = response.permissions;
    } catch (error) {
      throw new Error('Login failed');
    }
  }
  
  function logout() {
    user.value = null;
    token.value = null;
    permissions.value = [];
  }
  
  // Persist state
  const { pause, resume } = watchPausable(
    [user, token, permissions],
    () => {
      localStorage.setItem('auth', JSON.stringify({
        user: user.value,
        token: token.value,
        permissions: permissions.value
      }));
    },
    { deep: true }
  );
  
  return {
    user,
    token,
    permissions,
    isAuthenticated,
    isExternal,
    isInternal,
    login,
    logout
  };
});
```

### Store Organization Rules

1. **Feature-Based**: One store per major feature area
2. **Composition API**: Use Pinia with composition API syntax
3. **Immutability**: Don't mutate state directly from components
4. **Persistence**: Handle state persistence at store level
5. **Entity Scoping**: Implement entity-based data filtering

---

## 🎨 UI Architecture

### Layout System

```vue
<!-- components/layout/DefaultLayout.vue -->
<template>
  <v-app>
    <AppHeader />
    <AppSidebar v-if="showSidebar" />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
const { user } = useAuth();
const { isMobile } = useDisplay();

const showSidebar = computed(() => {
  return user.value && !isMobile.value;
});
</script>
```

### Responsive Architecture

```ts
// composables/ui/useResponsive.ts
export function useResponsive() {
  const { mobile, tablet, desktop } = useDisplay();
  
  const breakpoint = computed(() => {
    if (mobile.value) return 'mobile';
    if (tablet.value) return 'tablet';
    return 'desktop';
  });
  
  const isMobile = computed(() => breakpoint.value === 'mobile');
  const isTablet = computed(() => breakpoint.value === 'tablet');
  const isDesktop = computed(() => breakpoint.value === 'desktop');
  
  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop
  };
}
```

---

## 🔐 Security Architecture

### Permission System

```ts
// composables/auth/usePermissions.ts
export function usePermissions() {
  const { user, permissions } = useAuthStore();
  
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission);
  }
  
  function hasAnyPermission(permissionList: string[]): boolean {
    return permissionList.some(permission => hasPermission(permission));
  }
  
  function hasAllPermissions(permissionList: string[]): boolean {
    return permissionList.every(permission => hasPermission(permission));
  }
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}

// components/common/PermissionWrapper.vue
<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else-if="showFallback">
    <slot name="fallback">
      <v-alert type="warning">
        You don't have permission to access this content.
      </v-alert>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  showFallback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  requireAll: false,
  showFallback: true
});

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

const hasAccess = computed(() => {
  if (props.permission) {
    return hasPermission(props.permission);
  }
  
  if (props.permissions) {
    return props.requireAll 
      ? hasAllPermissions(props.permissions)
      : hasAnyPermission(props.permissions);
  }
  
  return true;
});
</script>
```

---

## 🚀 Performance Architecture

### Lazy Loading Strategy

```ts
// Lazy load routes
const routes = [
  {
    path: '/reports',
    component: () => import('@/views/reports/ReportsPage.vue')
  },
  {
    path: '/claims',
    component: () => import('@/views/claims/HighCostClaimsPage.vue')
  }
];

// Lazy load components
const LazyReportTable = defineAsyncComponent(() => import('@/components/reports/ReportTable.vue'));
```

### Caching Strategy

```ts
// composables/data/useCache.ts
export function useCache<T>(key: string, ttl: number = 5 * 60 * 1000) {
  const cache = new Map<string, { data: T; timestamp: number }>();
  
  function get(key: string): T | null {
    const cached = cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  function set(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
  }
  
  return { get, set };
}
```

---

## 📱 Mobile Architecture

### Progressive Web App Structure

```ts
// utils/pwa.ts
export function setupPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
  
  // Handle app install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    // Show custom install prompt
  });
}

// Mobile-specific composables
// composables/mobile/useOffline.ts
export function useOffline() {
  const isOnline = ref(navigator.onLine);
  
  window.addEventListener('online', () => {
    isOnline.value = true;
  });
  
  window.addEventListener('offline', () => {
    isOnline.value = false;
  });
  
  return { isOnline };
}
```

---

## 🔧 Development Architecture

### Environment Configuration

```ts
// utils/config.ts
interface Config {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    analytics: boolean;
    debugging: boolean;
  };
}

export const config: Config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  environment: import.meta.env.MODE as Config['environment'],
  features: {
    analytics: import.meta.env.PROD,
    debugging: import.meta.env.DEV
  }
};
```

### Plugin Architecture

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { setupPlugins } from './plugins';

const app = createApp(App);

// Setup all plugins
setupPlugins(app);

app.mount('#app');

// plugins/index.ts
import { App } from 'vue';
import { setupVuetify } from './vuetify';
import { setupPinia } from './pinia';
import { setupRouter } from './router';

export function setupPlugins(app: App) {
  setupVuetify(app);
  setupPinia(app);
  setupRouter(app);
}
```

---

## 📋 Architecture Review Checklist

### Before Implementation
- [ ] Component hierarchy defined
- [ ] Data flow patterns established
- [ ] API integration points identified
- [ ] State management strategy defined
- [ ] Permission system designed
- [ ] Responsive breakpoints planned
- [ ] Performance optimization strategy
- [ ] Error handling patterns established

### During Development
- [ ] Single responsibility principle followed
- [ ] Dependency injection used appropriately
- [ ] Entity isolation maintained
- [ ] Type safety enforced
- [ ] Error boundaries implemented
- [ ] Loading states provided
- [ ] Mobile experience considered

### Code Review Focus
- [ ] Proper separation of concerns
- [ ] Consistent architectural patterns
- [ ] Appropriate abstraction levels
- [ ] Clean component communication
- [ ] Efficient data flow
- [ ] Security considerations addressed

---

**Remember**: Architecture decisions have long-term implications. Choose patterns that will scale with the application and team growth. Always consider the external vs internal user context when designing data access patterns.