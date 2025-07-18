# 🎨 UI/UX Guidelines - Client Portal v2.0

## 📋 Project Context

**Application**: PBM Client Portal v2.0
**Framework**: Vue.js 3 + Vuetify + TypeScript
**Users**: External (Consultants, Brokers, TPAs) + Internal (Staff)
**Devices**: Desktop-first, Mobile-responsive
**Domain**: Pharmacy Benefits Management (PBM)

---

## 🎯 Design Principles

### Core UX Principles

1. **Clarity First**: Information hierarchy is always clear
2. **Entity Awareness**: Users always know which entity/account they're viewing
3. **Permission Transparency**: Users understand what they can and cannot access
4. **Data Confidence**: Users trust the data accuracy and freshness
5. **Efficient Workflows**: Common tasks require minimal steps
6. **Progressive Disclosure**: Show relevant information at the right time
7. **Consistent Patterns**: Similar actions work the same way across the app

### PBM-Specific Principles

1. **Status Clarity**: Claims, prior auths, and processes have clear status indicators
2. **Entity Scoping**: External users see only their entity data, internal users see all
3. **Real-time Updates**: Critical information updates without page refresh
4. **Data Integrity**: Financial and health data is presented with confidence
5. **Audit Trail**: Users can see who did what and when
6. **Compliance Ready**: UI supports HIPAA and regulatory requirements

---

## 🎨 Visual Design System

### Color Palette (Client Portal v2.0)

```scss
// Primary Brand Color
$primary: #0F285B;                // Liviniti Blue

// Neutral Colors
$neutral-white: #FFFFFF;          // Surface Background
$neutral-disabled: #858585;       // Disabled State
$text-primary: #1A1A1A;           // Primary Text
$border-color: #E0E0E0;           // Border Color

// Status Colors
$success: #5CB85C;                // Success states
$warning: #FBBA13;                // Warning states
$error: #B80909;                  // Error states
$link: #2C82CB;                   // Link Color

// Status Background Colors (with opacity)
$success-background: rgba(190, 227, 190, 0.4);  // Success background
$warning-background: rgba(253, 214, 113, 0.2);  // Warning background
$error-background: rgba(212, 107, 107, 0.4);    // Error background
```

### Vuetify Theme Configuration

```ts
// plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // Primary brand color
          primary: '#0F285B',        // Liviniti Blue
          
          // Status colors
          success: '#5CB85C',
          warning: '#FBBA13',
          error: '#B80909',
          info: '#2C82CB',           // Link color
          
          // Surface colors
          surface: '#FFFFFF',
          'on-surface': '#1A1A1A',
          'on-surface-variant': '#858585',
          
          // Background colors
          background: '#FFFFFF',
          'on-background': '#1A1A1A',
          
          // Custom colors matching CSS variables
          'neutral-white': '#FFFFFF',
          'neutral-disabled': '#858585',
          'text-primary': '#1A1A1A',
          'border-color': '#E0E0E0',
          'link': '#2C82CB'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
});
```

### Typography System

```scss
// Import Lato font
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&display=swap');

// Typography Scale (matching current CSS)
$font-family-base: 'Lato', sans-serif;

// Font Sizes
$h1-size: 2.07rem;    // 33.12px
$h2-size: 1.728rem;   // 27.648px
$h3-size: 1.44rem;    // 23.04px
$h4-size: 1.2rem;     // 19.2px
$body-size: 1rem;     // 16px
$body-small-size: 0.8rem; // 12.8px

// Font Weights
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line Heights
$line-height-tight: 120%;
$line-height-normal: 150%;
$line-height-relaxed: 160%;

// Vuetify Typography Override
.v-application {
  font-family: $font-family-base !important;
  
  h1, .text-h1 {
    font-size: $h1-size !important;
    font-weight: $font-weight-bold !important;
    line-height: $line-height-tight !important;
    color: var(--color-text-primary) !important;
  }
  
  h2, .text-h2 {
    font-size: $h2-size !important;
    font-weight: $font-weight-semibold !important;
    line-height: $line-height-tight !important;
    color: var(--color-text-primary) !important;
  }
  
  h3, .text-h3 {
    font-size: $h3-size !important;
    font-weight: $font-weight-bold !important;
    line-height: $line-height-tight !important;
    color: var(--color-text-primary) !important;
  }
  
  h4, .text-h4 {
    font-size: $h4-size !important;
    font-weight: $font-weight-bold !important;
    line-height: $line-height-tight !important;
    color: var(--color-text-primary) !important;
  }
  
  p, .text-body-1 {
    font-size: $body-size !important;
    font-weight: $font-weight-normal !important;
    line-height: $line-height-tight !important;
    color: var(--color-text-primary) !important;
  }
  
  .text-body-2, .p2 {
    font-size: $body-small-size !important;
    font-weight: $font-weight-normal !important;
    line-height: $line-height-tight !important;
    color: var(--color-text-primary) !important;
  }
}
```

### Spacing System

```scss
// Custom Spacing Scale (matching current CSS)
$spacing-nano: 4px;     // --spacing-nano
$spacing-xsmall: 8px;   // --spacing-xsmall
$spacing-small: 12px;   // --spacing-small
$spacing-medium: 20px;  // --spacing-medium
$spacing-large: 32px;   // --spacing-large
$spacing-xlarge: 48px;  // --spacing-xlarge

// Root Padding (responsive)
$root-padding: clamp(3rem, calc(3rem + ((1vw - 0.48rem) * 2.0833)), 4.5rem);

// Vuetify Spacing Override
:root {
  --v-spacing-nano: #{$spacing-nano};
  --v-spacing-xsmall: #{$spacing-xsmall};
  --v-spacing-small: #{$spacing-small};
  --v-spacing-medium: #{$spacing-medium};
  --v-spacing-large: #{$spacing-large};
  --v-spacing-xlarge: #{$spacing-xlarge};
  --v-root-padding: #{$root-padding};
}

// Utility Classes
.spacing-nano { margin: $spacing-nano; }
.spacing-xsmall { margin: $spacing-xsmall; }
.spacing-small { margin: $spacing-small; }
.spacing-medium { margin: $spacing-medium; }
.spacing-large { margin: $spacing-large; }
.spacing-xlarge { margin: $spacing-xlarge; }

.pa-nano { padding: $spacing-nano; }
.pa-xsmall { padding: $spacing-xsmall; }
.pa-small { padding: $spacing-small; }
.pa-medium { padding: $spacing-medium; }
.pa-large { padding: $spacing-large; }
.pa-xlarge { padding: $spacing-xlarge; }

.ma-nano { margin: $spacing-nano; }
.ma-xsmall { margin: $spacing-xsmall; }
.ma-small { margin: $spacing-small; }
.ma-medium { margin: $spacing-medium; }
.ma-large { margin: $spacing-large; }
.ma-xlarge { margin: $spacing-xlarge; }
```

### Global Styles

```scss
// styles/global.scss
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&display=swap');

:root {
  /* Brand Colors */
  --color-primary: #0F285B;
  --color-primary-light: #1A3A6B;
  --color-primary-dark: #0A1F4A;
  
  /* Neutral Colors */
  --color-neutral-white: #FFFFFF;
  --color-neutral-disabled: #858585;
  --color-text-primary: #1A1A1A;
  --color-border: #E0E0E0;
  
  /* Status Colors */
  --color-success: #5CB85C;
  --color-warning: #FBBA13;
  --color-error: #B80909;
  --color-link: #2C82CB;
  
  /* Status Background Colors */
  --color-success-background: rgba(190, 227, 190, 0.4);
  --color-warning-background: rgba(253, 214, 113, 0.2);
  --color-error-background: rgba(212, 107, 107, 0.4);
  
  /* PBM Status Colors */
  --color-approved: #5CB85C;
  --color-pending: #FBBA13;
  --color-denied: #B80909;
  --color-overdue: #B80909;
  
  /* Spacing */
  --spacing-nano: 4px;
  --spacing-xsmall: 8px;
  --spacing-small: 12px;
  --spacing-medium: 20px;
  --spacing-large: 32px;
  --spacing-xlarge: 48px;
  
  /* Root Padding */
  --root-padding: clamp(3rem, calc(3rem + ((1vw - 0.48rem) * 2.0833)), 4.5rem);
}

body {
  font-family: 'Lato', sans-serif;
  background-color: var(--color-neutral-white);
  color: var(--color-text-primary);
}

// Apply custom spacing to Vuetify components
.v-application {
  .v-container {
    padding: var(--root-padding);
  }
}
```

---

## 🏗️ Layout Patterns

### Application Layout

```vue
<template>
  <v-app>
    <!-- Fixed Header -->
    <v-app-bar app height="64" color="primary">
      <v-app-bar-nav-icon @click="toggleSidebar" />
      <v-toolbar-title>Client Portal v2.0</v-toolbar-title>
      <v-spacer />
      <EntitySelector v-if="isInternal" />
      <NotificationIcon />
      <UserProfileMenu />
    </v-app-bar>

    <!-- Collapsible Sidebar -->
    <v-navigation-drawer 
      v-model="showSidebar" 
      app 
      :rail="isMobile"
      :permanent="isDesktop"
    >
      <NavigationMenu />
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
```

### Page Layout Structure

```vue
<template>
  <div class="page-layout">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header__title">
        <h1>{{ pageTitle }}</h1>
        <p class="page-description">{{ pageDescription }}</p>
      </div>
      <div class="page-header__actions">
        <v-btn color="primary" @click="primaryAction">
          {{ primaryActionText }}
        </v-btn>
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-layout {
  min-height: 100vh;
  padding: var(--root-padding);
  font-family: 'Lato', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xlarge);
  padding-bottom: var(--spacing-medium);
  border-bottom: 1px solid var(--color-border);

  &__title {
    h1 {
      font-family: 'Lato', sans-serif;
      font-size: 2.07rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xsmall);
      line-height: 120%;
    }
    
    .page-description {
      font-family: 'Lato', sans-serif;
      font-size: 1rem;
      font-weight: 400;
      color: var(--color-neutral-disabled);
      margin: 0;
      line-height: 120%;
    }
  }

  &__actions {
    display: flex;
    gap: var(--spacing-small);
  }
}

.page-content {
  .v-card {
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

// Mobile Responsive
@media (max-width: 768px) {
  .page-layout {
    padding: var(--spacing-medium);
  }
  
  .page-header {
    flex-direction: column;
    gap: var(--spacing-small);
    
    &__actions {
      width: 100%;
      
      .v-btn {
        flex: 1;
      }
    }
  }
}
</style>
```

### CSS Variables Integration

```scss
// main.ts - Import global styles
import './styles/global.scss';

// styles/global.scss - Global CSS variables and styles
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&display=swap');

:root {
  /* Brand Color */
  --color-primary: #0F285B;
  
  /* Neutral Colors */
  --color-neutral-white: #FFFFFF;
  --color-neutral-disabled: #858585;
  --color-text-primary: #1A1A1A;
  --color-border: #E0E0E0;
  
  /* Status Colors */
  --color-success: #5CB85C;
  --color-warning: #FBBA13;
  --color-error: #B80909;
  --color-link: #2C82CB;
  
  /* Status Background Colors */
  --color-success-background: rgba(190, 227, 190, 0.4);
  --color-warning-background: rgba(253, 214, 113, 0.2);
  --color-error-background: rgba(212, 107, 107, 0.4);
  
  /* Spacing */
  --spacing-nano: 4px;
  --spacing-xsmall: 8px;
  --spacing-small: 12px;
  --spacing-medium: 20px;
  --spacing-large: 32px;
  --spacing-xlarge: 48px;
  
  /* Root Padding */
  --root-padding: clamp(3rem, calc(3rem + ((1vw - 0.48rem) * 2.0833)), 4.5rem);
  
  /* Typography */
  --font-family-base: 'Lato', sans-serif;
  --font-size-h1: 2.07rem;
  --font-size-h2: 1.728rem;
  --font-size-h3: 1.44rem;
  --font-size-h4: 1.2rem;
  --font-size-body: 1rem;
  --font-size-small: 0.8rem;
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 120%;
}

// Base styles
body {
  font-family: var(--font-family-base);
  background-color: var(--color-neutral-white);
  color: var(--color-text-primary);
  margin: 0;
  padding: 0;
}

// Typography base styles
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-base);
  line-height: var(--line-height-tight);
  margin: 0;
  padding: 0;
}

p {
  font-family: var(--font-family-base);
  line-height: var(--line-height-tight);
  margin: 0;
  padding: 0;
}

// Link styles
a {
  color: var(--color-link);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

// Vuetify overrides
.v-application {
  font-family: var(--font-family-base) !important;
  
  // Override Vuetify's default spacing
  .v-container {
    padding: var(--root-padding);
  }
  
  // Override button styles
  .v-btn {
    font-family: var(--font-family-base) !important;
    
    &.v-btn--variant-elevated {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
  
  // Override card styles
  .v-card {
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  // Override input styles
  .v-field {
    font-family: var(--font-family-base) !important;
  }
  
  // Override table styles
  .v-data-table {
    font-family: var(--font-family-base) !important;
    
    .v-data-table__th,
    .v-data-table__td {
      font-family: var(--font-family-base) !important;
    }
  }
}

// Utility classes for spacing
.spacing-nano { margin: var(--spacing-nano); }
.spacing-xsmall { margin: var(--spacing-xsmall); }
.spacing-small { margin: var(--spacing-small); }
.spacing-medium { margin: var(--spacing-medium); }
.spacing-large { margin: var(--spacing-large); }
.spacing-xlarge { margin: var(--spacing-xlarge); }

.pa-nano { padding: var(--spacing-nano); }
.pa-xsmall { padding: var(--spacing-xsmall); }
.pa-small { padding: var(--spacing-small); }
.pa-medium { padding: var(--spacing-medium); }
.pa-large { padding: var(--spacing-large); }
.pa-xlarge { padding: var(--spacing-xlarge); }

.ma-nano { margin: var(--spacing-nano); }
.ma-xsmall { margin: var(--spacing-xsmall); }
.ma-small { margin: var(--spacing-small); }
.ma-medium { margin: var(--spacing-medium); }
.ma-large { margin: var(--spacing-large); }
.ma-xlarge { margin: var(--spacing-xlarge); }

// Typography utility classes
.text-h1 { 
  font-size: var(--font-size-h1) !important;
  font-weight: var(--font-weight-bold) !important;
  line-height: var(--line-height-tight) !important;
}

.text-h2 { 
  font-size: var(--font-size-h2) !important;
  font-weight: var(--font-weight-semibold) !important;
  line-height: var(--line-height-tight) !important;
}

.text-h3 { 
  font-size: var(--font-size-h3) !important;
  font-weight: var(--font-weight-bold) !important;
  line-height: var(--line-height-tight) !important;
}

.text-h4 { 
  font-size: var(--font-size-h4) !important;
  font-weight: var(--font-weight-bold) !important;
  line-height: var(--line-height-tight) !important;
}

.text-body { 
  font-size: var(--font-size-body) !important;
  font-weight: var(--font-weight-normal) !important;
  line-height: var(--line-height-tight) !important;
}

.text-small, .p2 { 
  font-size: var(--font-size-small) !important;
  font-weight: var(--font-weight-normal) !important;
  line-height: var(--line-height-tight) !important;
}
```

---

## 🧩 Component Design Patterns

### Status Indicators

```vue
<template>
  <v-chip
    :color="statusColor"
    :variant="statusVariant"
    size="small"
    class="status-chip"
  >
    <v-icon v-if="statusIcon" start :icon="statusIcon" />
    {{ statusText }}
  </v-chip>
</template>

<script setup lang="ts">
type StatusType = 'success' | 'warning' | 'error' | 'info';

interface Props {
  status: StatusType;
  statusText: string;
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true
});

const statusConfig = {
  success: { 
    color: 'success', 
    icon: 'mdi-check-circle', 
    bgColor: 'var(--color-success-background)'
  },
  warning: { 
    color: 'warning', 
    icon: 'mdi-clock-outline', 
    bgColor: 'var(--color-warning-background)'
  },
  error: { 
    color: 'error', 
    icon: 'mdi-close-circle', 
    bgColor: 'var(--color-error-background)'
  },
  info: { 
    color: 'info', 
    icon: 'mdi-information', 
    bgColor: 'rgba(44, 130, 203, 0.1)'
  }
};

const statusColor = computed(() => statusConfig[props.status].color);
const statusIcon = computed(() => props.showIcon ? statusConfig[props.status].icon : null);
const statusVariant = computed(() => 'tonal');
</script>

<style lang="scss" scoped>
.status-chip {
  font-family: 'Lato', sans-serif;
  font-weight: 600;
  
  // Custom status colors using CSS variables
  &.v-chip--color-success {
    background-color: var(--color-success-background) !important;
    color: var(--color-success) !important;
  }
  
  &.v-chip--color-warning {
    background-color: var(--color-warning-background) !important;
    color: var(--color-warning) !important;
  }
  
  &.v-chip--color-error {
    background-color: var(--color-error-background) !important;
    color: var(--color-error) !important;
  }
  
  &.v-chip--color-info {
    background-color: rgba(44, 130, 203, 0.1) !important;
    color: var(--color-link) !important;
  }
}
</style>
```

### Progress Tracking

```vue
<template>
  <div class="progress-tracker">
    <div class="progress-tracker__header">
      <h3>{{ title }}</h3>
      <span class="progress-tracker__percentage">{{ percentage }}%</span>
    </div>
    
    <v-progress-linear
      :model-value="percentage"
      :color="progressColor"
      height="8"
      rounded
      class="progress-tracker__bar"
    />
    
    <div class="progress-tracker__steps">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="progress-tracker__step"
        :class="{ 'progress-tracker__step--completed': step.completed }"
      >
        <v-icon :color="step.completed ? 'success' : 'neutral-disabled'">
          {{ step.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
        </v-icon>
        <span>{{ step.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  label: string;
  completed: boolean;
}

interface Props {
  title: string;
  percentage: number;
  steps: Step[];
}

const props = defineProps<Props>();

const progressColor = computed(() => {
  if (props.percentage >= 100) return 'success';
  if (props.percentage >= 75) return 'primary';
  if (props.percentage >= 50) return 'warning';
  return 'error';
});
</script>

<style lang="scss" scoped>
.progress-tracker {
  background: var(--color-neutral-white);
  border-radius: 8px;
  padding: var(--spacing-medium);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-small);

    h3 {
      font-family: 'Lato', sans-serif;
      font-size: 1.44rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
    }
  }

  &__percentage {
    font-family: 'Lato', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__bar {
    margin-bottom: var(--spacing-medium);
  }

  &__steps {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xsmall);
  }

  &__step {
    display: flex;
    align-items: center;
    gap: var(--spacing-small);

    &--completed {
      span {
        color: var(--color-text-primary);
        font-weight: 600;
      }
    }

    span {
      font-family: 'Lato', sans-serif;
      color: var(--color-neutral-disabled);
      font-size: 1rem;
    }
  }
}
</style>
```

### Data Tables

```vue
<template>
  <div class="data-table-container">
    <!-- Table Header -->
    <div class="data-table-header">
      <div class="data-table-header__title">
        <h2>{{ title }}</h2>
        <v-chip v-if="totalItems" color="primary" variant="outlined" size="small">
          {{ totalItems }} items
        </v-chip>
      </div>
      
      <div class="data-table-header__actions">
        <v-text-field
          v-model="search"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="data-table-search"
        />
        <v-btn color="primary" @click="exportData">
          <v-icon start>mdi-download</v-icon>
          Export
        </v-btn>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="data-table-filters">
      <v-chip-group v-model="selectedFilters" column multiple>
        <v-chip
          v-for="filter in filters"
          :key="filter.key"
          :value="filter.key"
          filter
          variant="outlined"
        >
          {{ filter.label }}
        </v-chip>
      </v-chip-group>
    </div>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :search="search"
      class="data-table"
      @click:row="handleRowClick"
    >
      <!-- Status Column -->
      <template #item.status="{ item }">
        <StatusIndicator :status="item.status" />
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
            />
          </template>
          <v-list>
            <v-list-item @click="viewItem(item)">
              <v-list-item-title>View</v-list-item-title>
            </v-list-item>
            <v-list-item @click="editItem(item)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <div class="data-table-empty">
          <v-icon size="64" color="neutral-disabled">mdi-database-off</v-icon>
          <h3>No data available</h3>
          <p>There are no items to display at this time.</p>
        </div>
      </template>

      <!-- Loading State -->
      <template #loading>
        <div class="data-table-loading">
          <v-progress-circular indeterminate color="primary" />
          <p>Loading data...</p>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<style lang="scss" scoped>
.data-table-container {
  background: var(--color-neutral-white);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: 'Lato', sans-serif;
}

.data-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-medium);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-neutral-white);

  &__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-small);

    h2 {
      font-family: 'Lato', sans-serif;
      font-size: 1.728rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-small);
  }
}

.data-table-search {
  width: 300px;
  
  :deep(.v-field__input) {
    font-family: 'Lato', sans-serif;
  }
}

.data-table-filters {
  padding: var(--spacing-medium);
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--color-border);
}

.data-table {
  font-family: 'Lato', sans-serif;
  
  :deep(.v-data-table__wrapper) {
    max-height: 600px;
    overflow-y: auto;
  }

  :deep(.v-data-table-header) {
    background: rgba(0, 0, 0, 0.02);
    
    .v-data-table__th {
      font-family: 'Lato', sans-serif;
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }

  :deep(.v-data-table__td) {
    font-family: 'Lato', sans-serif;
    color: var(--color-text-primary);
  }

  :deep(.v-data-table-rows-no-data),
  :deep(.v-data-table-rows-loading) {
    padding: var(--spacing-xlarge);
  }
}

.data-table-empty,
.data-table-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-small);
  padding: var(--spacing-xlarge);
  text-align: center;

  h3 {
    color: var(--color-text-primary);
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    margin: 0;
  }

  p {
    color: var(--color-neutral-disabled);
    font-family: 'Lato', sans-serif;
    margin: 0;
  }
}

// Mobile Responsiveness
@media (max-width: 768px) {
  .data-table-header {
    flex-direction: column;
    gap: var(--spacing-small);
    align-items: stretch;

    &__actions {
      flex-direction: column;
    }
  }

  .data-table-search {
    width: 100%;
  }

  .data-table {
    :deep(.v-data-table__wrapper) {
      overflow-x: auto;
    }
  }
}
</style>
```

---

## 🎯 User Experience Patterns

### Entity Selector (Internal Users)

```vue
<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        variant="outlined"
        prepend-icon="mdi-domain"
        class="entity-selector"
      >
        {{ selectedEntity?.name || 'Select Entity' }}
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="entity in entities"
        :key="entity.id"
        @click="selectEntity(entity)"
      >
        <v-list-item-title>{{ entity.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ entity.type }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface Entity {
  id: number;
  name: string;
  type: string;
}

interface Props {
  entities: Entity[];
  selectedEntity?: Entity;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', entity: Entity): void;
}>();

function selectEntity(entity: Entity) {
  emit('select', entity);
}
</script>
```

### Permission-Based UI

```vue
<template>
  <div class="permission-aware-content">
    <!-- Full Access -->
    <div v-if="hasFullAccess" class="full-access">
      <slot />
    </div>

    <!-- Limited Access -->
    <div v-else-if="hasLimitedAccess" class="limited-access">
      <v-alert 
        type="info" 
        variant="tonal"
        class="mb-4"
        icon="mdi-information"
      >
        You have limited access to this content. Some features may be restricted.
      </v-alert>
      <slot name="limited" />
    </div>

    <!-- No Access -->
    <div v-else class="no-access">
      <v-empty-state
        title="Access Restricted"
        text="You don't have permission to view this content."
        icon="mdi-lock"
      >
        <template #actions>
          <v-btn color="primary" @click="requestAccess">
            Request Access
          </v-btn>
        </template>
      </v-empty-state>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  requiredPermission: string;
  showLimitedContent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLimitedContent: false
});

const { hasPermission } = usePermissions();

const hasFullAccess = computed(() => hasPermission(props.requiredPermission));
const hasLimitedAccess = computed(() => props.showLimitedContent && hasPermission('read'));

function requestAccess() {
  // Handle access request
}
</script>
```

### Loading States

```vue
<template>
  <div class="loading-container">
    <!-- Skeleton Loading -->
    <div v-if="loading" class="skeleton-loader">
      <v-skeleton-loader
        type="card"
        :loading="true"
        class="mb-4"
      />
      <v-skeleton-loader
        type="table"
        :loading="true"
      />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <v-alert
        type="error"
        variant="tonal"
        class="mb-4"
      >
        <template #title>
          <div class="d-flex align-center">
            <v-icon start>mdi-alert-circle</v-icon>
            Something went wrong
          </div>
        </template>
        {{ error }}
      </v-alert>
      
      <v-btn 
        color="primary" 
        variant="outlined"
        @click="retry"
      >
        <v-icon start>mdi-refresh</v-icon>
        Try Again
      </v-btn>
    </div>

    <!-- Success State -->
    <div v-else class="success-state">
      <slot />
    </div>
  </div>
</template>
```

---

## 📱 Mobile UX Patterns

### Mobile Navigation

```vue
<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="!isMobile"
    :temporary="isMobile"
    app
  >
    <v-list>
      <v-list-item
        v-for="item in navigationItems"
        :key="item.route"
        :to="item.route"
        @click="isMobile && (drawer = false)"
      >
        <template #prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-badge
          v-if="item.badge"
          :content="item.badge"
          color="error"
          offset-x="10"
          offset-y="10"
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
```

### Touch-Friendly Interactions

```scss
// Touch targets should be at least 44px
.touch-target {
  min-height: 44px;
  min-width: 44px;
  
  // Increase touch area without affecting visual design
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    z-index: -1;
  }
}

// Swipe gestures for mobile tables
.mobile-table-row {
  position: relative;
  overflow: hidden;
  
  &.swipe-left {
    transform: translateX(-60px);
    transition: transform 0.3s ease;
  }
  
  .swipe-actions {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: rgba(244, 67, 54, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

---

## 🔔 Notification & Feedback Patterns

### Toast Notifications

```vue
<template>
  <v-snackbar
    v-model="show"
    :color="notificationColor"
    :timeout="timeout"
    :multi-line="multiLine"
    :vertical="vertical"
    :location="location"
  >
    <div class="notification-content">
      <v-icon v-if="icon" start>{{ icon }}</v-icon>
      <div class="notification-text">
        <div class="notification-title">{{ title }}</div>
        <div v-if="message" class="notification-message">{{ message }}</div>
      </div>
    </div>
    
    <template #actions>
      <v-btn
        v-if="actionText"
        :color="actionColor"
        variant="text"
        @click="handleAction"
      >
        {{ actionText }}
      </v-btn>
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="show = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Props {
  type: NotificationType;
  title: string;
  message?: string;
  actionText?: string;
  actionColor?: string;
  timeout?: number;
}

const props = withDefaults(defineProps<Props>(), {
  timeout: 5000,
  actionColor: 'white'
});

const notificationConfig = {
  success: { color: 'success', icon: 'mdi-check-circle' },
  error: { color: 'error', icon: 'mdi-alert-circle' },
  warning: { color: 'warning', icon: 'mdi-alert' },
  info: { color: 'info', icon: 'mdi-information' }
};

const notificationColor = computed(() => notificationConfig[props.type].color);
const icon = computed(() => notificationConfig[props.type].icon);
</script>
```

### Form Validation

```vue
<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email"
      type="email"
      variant="outlined"
      :error-messages="emailErrors"
      @blur="validateEmail"
    />
    
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Password"
      type="password"
      variant="outlined"
      :error-messages="passwordErrors"
      @blur="validatePassword"
    />
    
    <v-btn
      :loading="submitting"
      :disabled="!isFormValid"
      type="submit"
      color="primary"
      size="large"
      block
    >
      Submit
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
const form = ref();
const submitting = ref(false);
const email = ref('');
const password = ref('');
const emailErrors = ref<string[]>([]);
const passwordErrors = ref<string[]>([]);

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters'
];

const isFormValid = computed(() => {
  return email.value && password.value && 
         emailErrors.value.length === 0 && 
         passwordErrors.value.length === 0;
});

async function validateEmail() {
  emailErrors.value = [];
  // Custom validation logic
}

async function validatePassword() {
  passwordErrors.value = [];
  // Custom validation logic
}

async function handleSubmit() {
  const isValid = await form.value.validate();
  if (isValid.valid) {
    submitting.value = true;
    // Handle form submission
  }
}
</script>
```

---

## 🎨 Animation & Transitions

### Page Transitions

```vue
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="scss">
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
```

### Loading Animations

```scss
// Skeleton loading animation - Updated for Client Portal v2.0
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-loader {
  background: linear-gradient(
    90deg,
    #f5f5f5 25%,
    var(--color-border) 50%,
    #f5f5f5 75%
  );
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

// Pulse animation for buttons using Liviniti Blue
.pulse-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(15, 40, 91, 0.7); // Liviniti Blue with opacity
  }
  70% {
    box-shadow: 0 0 0 10px rgba(15, 40, 91, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(15, 40, 91, 0);
  }
}

// Loading spinner animation
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Fade in animation for components
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// Success animation for status changes
.success-animation {
  animation: successPulse 0.6s ease-in-out;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(92, 184, 92, 0.7); // Success green from palette
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(92, 184, 92, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(92, 184, 92, 0);
  }
}

// Warning animation for attention-needed items
.warning-animation {
  animation: warningPulse 0.6s ease-in-out;
}

@keyframes warningPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(251, 186, 19, 0.7); // Warning yellow from palette
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(251, 186, 19, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(251, 186, 19, 0);
  }
}

// Error animation for error states
.error-animation {
  animation: errorPulse 0.6s ease-in-out;
}

@keyframes errorPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 9, 9, 0.7); // Error red from palette
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(184, 9, 9, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 9, 9, 0);
  }
}
```

---

## ♿ Accessibility Guidelines

### ARIA Labels and Roles

```vue
<template>
  <div class="data-table" role="table" aria-label="Claims data table">
    <div class="data-table-header" role="rowgroup">
      <div class="data-table-row" role="row">
        <div 
          v-for="header in headers" 
          :key="header.key"
          class="data-table-cell" 
          role="columnheader"
          :aria-sort="getSortOrder(header.key)"
        >
          {{ header.title }}
        </div>
      </div>
    </div>
    
    <div class="data-table-body" role="rowgroup">
      <div 
        v-for="(item, index) in items" 
        :key="item.id"
        class="data-table-row" 
        role="row"
        :aria-rowindex="index + 1"
        @click="selectRow(item)"
        @keydown.enter="selectRow(item)"
        @keydown.space="selectRow(item)"
        tabindex="0"
      >
        <div 
          v-for="header in headers" 
          :key="header.key"
          class="data-table-cell" 
          role="gridcell"
        >
          {{ item[header.key] }}
        </div>
      </div>
    </div>
  </div>
</template>
```

### Keyboard Navigation

```scss
// Focus indicators
.focusable {
  &:focus {
    outline: 2px solid #1976D2;
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
}

// Skip navigation
.skip-navigation {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #1976D2;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 9999;
  
  &:focus {
    top: 6px;
  }
}
```

---

## 📊 Data Visualization Patterns

### Chart Color Palette

```scss
// Chart colors using Client Portal v2.0 color system
$chart-colors: (
  primary: #0F285B,      // Liviniti Blue
  success: #5CB85C,      // Success Green
  warning: #FBBA13,      // Warning Yellow
  error: #B80909,        // Error Red
  link: #2C82CB,         // Link Blue
  disabled: #858585,     // Neutral disabled
  border: #E0E0E0        // Border color
);

// Chart background colors with proper opacity
$chart-bg-colors: (
  success: rgba(190, 227, 190, 0.4),     // Success background
  warning: rgba(253, 214, 113, 0.2),     // Warning background
  error: rgba(212, 107, 107, 0.4),       // Error background
  primary: rgba(15, 40, 91, 0.1),        // Primary background
  neutral: rgba(133, 133, 133, 0.1)      // Neutral background
);

// Usage in Chart.js or similar
const chartConfig = {
  datasets: [{
    backgroundColor: [
      'var(--color-success)',
      'var(--color-warning)', 
      'var(--color-error)',
      'var(--color-primary)'
    ],
    borderColor: [
      'var(--color-success)',
      'var(--color-warning)',
      'var(--color-error)', 
      'var(--color-primary)'
    ]
  }]
};
```

### Dashboard Widgets

```vue
<template>
  <v-card class="dashboard-widget">
    <v-card-title class="widget-title">
      <div class="widget-icon">
        <v-icon :color="iconColor">{{ icon }}</v-icon>
      </div>
      <div class="widget-content">
        <h3 class="widget-value">{{ value }}</h3>
        <p class="widget-label">{{ label }}</p>
      </div>
    </v-card-title>
    
    <v-card-text v-if="showTrend" class="widget-trend">
      <div class="trend-indicator" :class="trendClass">
        <v-icon size="small">{{ trendIcon }}</v-icon>
        <span>{{ trendValue }}%</span>
      </div>
      <span class="trend-label">{{ trendLabel }}</span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  iconColor: string;
  value: string | number;
  label: string;
  showTrend?: boolean;
  trendValue?: number;
  trendLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showTrend: false
});

const trendClass = computed(() => {
  if (!props.trendValue) return '';
  return props.trendValue > 0 ? 'trend-up' : 'trend-down';
});

const trendIcon = computed(() => {
  if (!props.trendValue) return '';
  return props.trendValue > 0 ? 'mdi-trending-up' : 'mdi-trending-down';
});
</script>

<style lang="scss" scoped>
.dashboard-widget {
  height: 100%;
  
  .widget-title {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
  }
  
  .widget-icon {
    background: rgba(25, 118, 210, 0.1);
    border-radius: 50%;
    padding: $spacing-md;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .widget-content {
    flex: 1;
  }
  
  .widget-value {
    font-size: 2rem;
    font-weight: $font-weight-bold;
    color: rgba(0, 0, 0, 0.87);
    margin: 0;
  }
  
  .widget-label {
    color: rgba(0, 0, 0, 0.6);
    margin: 0;
  }
  
  .widget-trend {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: 0 $spacing-lg $spacing-lg;
  }
  
  .trend-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: $font-weight-medium;
    
    &.trend-up {
      color: #4CAF50;
    }
    
    &.trend-down {
      color: #F44336;
    }
  }
  
  .trend-label {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.875rem;
  }
}
</style>
```

---

## 📝 Content Guidelines

### Writing Guidelines

1. **Use Active Voice**: "Submit your claim" instead of "Claims can be submitted"
2. **Be Specific**: "Your claim was approved" instead of "Status updated"
3. **Use Plain Language**: Avoid jargon, explain acronyms
4. **Be Concise**: Get to the point quickly
5. **Use Consistent Terminology**: Same terms for same concepts throughout

### Error Messages

```vue
<template>
  <v-alert
    :type="alertType"
    :title="alertTitle"
    :text="alertText"
    :actions="alertActions"
    variant="tonal"
    closable
  />
</template>

<script setup lang="ts">
// Good error messages
const errorMessages = {
  network: {
    title: 'Connection Problem',
    text: 'Unable to connect to the server. Please check your internet connection and try again.',
    actions: [{ text: 'Retry', action: 'retry' }]
  },
  validation: {
    title: 'Please Check Your Information',
    text: 'Some fields need your attention. Please review and correct the highlighted items.',
    actions: [{ text: 'Review', action: 'review' }]
  },
  permission: {
    title: 'Access Restricted',
    text: 'You don\'t have permission to perform this action. Contact your administrator if you need access.',
    actions: [{ text: 'Contact Admin', action: 'contact' }]
  }
};
</script>
```

---

## 🧪 Testing UI Components

### Visual Testing Guidelines

```vue
<template>
  <div class="component-test-wrapper">
    <!-- Test different states -->
    <div class="test-state" data-testid="default-state">
      <StatusChip status="pending" />
    </div>
    
    <div class="test-state" data-testid="approved-state">
      <StatusChip status="approved" />
    </div>
    
    <div class="test-state" data-testid="denied-state">
      <StatusChip status="denied" />
    </div>
    
    <!-- Test responsive behavior -->
    <div class="test-responsive" data-testid="mobile-view">
      <DataTable :items="testItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Component testing utilities
const testItems = [
  { id: 1, name: 'Test Item 1', status: 'pending' },
  { id: 2, name: 'Test Item 2', status: 'approved' },
  { id: 3, name: 'Test Item 3', status: 'denied' }
];
</script>

<style lang="scss" scoped>
.component-test-wrapper {
  padding: $spacing-lg;
  
  .test-state {
    margin-bottom: $spacing-md;
    padding: $spacing-md;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }
  
  .test-responsive {
    @media (max-width: 768px) {
      // Mobile-specific test styles
    }
  }
}
</style>
```

---

## 📋 UI/UX Review Checklist - Client Portal v2.0

### Before Implementation
- [ ] Design follows Client Portal v2.0 design system
- [ ] Uses Liviniti Blue (#0F285B) as primary color
- [ ] Uses Lato font family throughout
- [ ] Color contrast meets accessibility standards (4.5:1 minimum)
- [ ] Touch targets are at least 44px on mobile
- [ ] Text is readable at all screen sizes
- [ ] CSS variables are used instead of hardcoded values
- [ ] Spacing uses custom spacing scale (nano, xsmall, small, medium, large, xlarge)
- [ ] Loading states are defined for all data-dependent components
- [ ] Error states are defined with proper error colors
- [ ] Empty states are defined with meaningful messaging
- [ ] Keyboard navigation works properly
- [ ] Screen reader compatibility verified

### Design System Compliance
- [ ] Primary color (#0F285B) used for primary actions and navigation
- [ ] Status colors used correctly (Success: #5CB85C, Warning: #FBBA13, Error: #B80909)
- [ ] Status background colors used for proper visual hierarchy
- [ ] Typography scale followed (H1: 2.07rem, H2: 1.728rem, H3: 1.44rem, H4: 1.2rem, Body: 1rem, Small: 0.8rem)
- [ ] Font weights used correctly (Normal: 400, Semibold: 600, Bold: 700)
- [ ] Line height set to 120% for all text
- [ ] Spacing variables used instead of hardcoded values
- [ ] Border color (#E0E0E0) used for component borders
- [ ] Neutral colors used appropriately (White: #FFFFFF, Disabled: #858585, Text: #1A1A1A)

### Component Standards
- [ ] Components use proper BEM naming convention
- [ ] Components are responsive across all breakpoints
- [ ] Components use CSS variables for colors and spacing
- [ ] Components have proper focus indicators
- [ ] Components have proper hover states
- [ ] Components handle loading states gracefully
- [ ] Components handle error states gracefully
- [ ] Components have proper TypeScript typing
- [ ] Components use Vuetify components as base when possible
- [ ] Components implement pass-through attributes when extending Vuetify

### PBM-Specific Requirements
- [ ] Status indicators use proper PBM status colors
- [ ] Progress tracking shows 0-100% completion accurately
- [ ] Entity selector is available for internal users
- [ ] Permission-based UI rendering works correctly
- [ ] Data tables show proper entity-scoped data
- [ ] High-cost claims are visually distinct
- [ ] Prior auth status is clear and actionable
- [ ] Billing documents are properly categorized

### Accessibility Standards
- [ ] WCAG 2.1 AA compliance verified
- [ ] Screen reader compatibility tested
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are clearly visible
- [ ] Color is not the only indicator of state/status
- [ ] Text alternatives provided for icons and images
- [ ] Proper heading hierarchy maintained
- [ ] Form labels are properly associated with inputs
- [ ] Error messages are descriptive and actionable

### Mobile & Responsive Design
- [ ] Components work on mobile devices (320px+)
- [ ] Components work on tablets (768px+)
- [ ] Components work on small laptops (1024px+)
- [ ] Components work on medium laptops (1366px+)
- [ ] Components work on large desktops (1920px+)
- [ ] Touch targets are at least 44px on mobile
- [ ] Text is readable without zooming
- [ ] Horizontal scrolling is avoided
- [ ] Navigation works on all screen sizes
- [ ] Data tables are responsive or horizontally scrollable

### Performance & User Experience
- [ ] Components load quickly (< 2 seconds)
- [ ] Loading states provide clear feedback
- [ ] Animations are smooth and purposeful
- [ ] Error messages are helpful and actionable
- [ ] Success feedback is provided for user actions
- [ ] Form validation is real-time and clear
- [ ] Data confidence is maintained (users trust the data)
- [ ] Entity scoping is clear to users
- [ ] Permission levels are transparent
- [ ] Common tasks require minimal steps

### Content & Messaging
- [ ] Uses plain language appropriate for healthcare professionals
- [ ] Error messages are specific and actionable
- [ ] Success messages are clear and reassuring
- [ ] Status indicators use consistent terminology
- [ ] Help text is contextual and useful
- [ ] Empty states provide clear next steps
- [ ] Loading messages are informative
- [ ] Form labels are clear and descriptive

### Testing Requirements
- [ ] Visual regression testing completed
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing completed (iOS, Android)
- [ ] Accessibility testing completed with screen readers
- [ ] Keyboard navigation testing completed
- [ ] Performance testing completed
- [ ] User acceptance testing completed
- [ ] PBM workflow testing completed

### Security & Compliance
- [ ] PHI data is properly protected
- [ ] HIPAA compliance verified
- [ ] User permissions are properly enforced
- [ ] Data encryption is implemented
- [ ] Audit trails are maintained
- [ ] Entity data isolation is enforced
- [ ] Sensitive data is masked appropriately
- [ ] Error messages don't expose sensitive information

### Code Quality
- [ ] CSS variables used throughout
- [ ] SCSS follows BEM methodology
- [ ] Components are reusable and composable
- [ ] TypeScript types are properly defined
- [ ] Code is commented where necessary
- [ ] Performance optimizations implemented
- [ ] Memory leaks avoided
- [ ] Proper cleanup in component lifecycle

---

**Remember**: This is a healthcare application handling sensitive PBM data. Always prioritize user trust, data accuracy, and regulatory compliance. The design should make users feel confident in the data they're viewing and the actions they're taking.

---

## 🚀 Implementation Guidelines

### Getting Started with the Design System

1. **Install Global Styles**
   ```bash
   # Add to main.ts
   import './styles/global.scss';
   ```

2. **Configure Vuetify Theme**
   ```ts
   // Use the Vuetify theme configuration provided above
   // in plugins/vuetify.ts
   ```

3. **Use CSS Variables**
   ```scss
   // Always use CSS variables instead of hardcoded values
   .my-component {
     color: var(--color-text-primary);
     padding: var(--spacing-medium);
     font-family: var(--font-family-base);
   }
   ```

4. **Follow Component Patterns**
   ```vue
   <!-- Always use the established component patterns -->
   <StatusIndicator :status="item.status" />
   <ProgressTracker :percentage="75" :steps="implementationSteps" />
   <DataTable :items="claims" :headers="headers" />
   ```

### Key Implementation Rules

- ✅ **Always use CSS variables** for colors, spacing, and typography
- ✅ **Always use Lato font family** throughout the application
- ✅ **Always use the custom spacing scale** (nano, xsmall, small, medium, large, xlarge)
- ✅ **Always use the provided status colors** (success: #5CB85C, warning: #FBBA13, error: #B80909)
- ✅ **Always implement proper loading/error/empty states**
- ✅ **Always consider entity scoping** for external vs internal users
- ✅ **Always test on multiple screen sizes** (mobile, tablet, desktop)
- ✅ **Always validate accessibility** with proper contrast and keyboard navigation
- ✅ **Always use Liviniti Blue (#0F285B)** as the primary color
- ✅ **Always use proper status background colors** for visual hierarchy

### Common Pitfalls to Avoid

- ❌ **Don't hardcode colors** - Use CSS variables (var(--color-primary), var(--color-success), etc.)
- ❌ **Don't use Roboto font** - Use Lato instead
- ❌ **Don't use standard Vuetify spacing** - Use custom spacing scale
- ❌ **Don't use wrong primary color** - Use Liviniti Blue (#0F285B) only
- ❌ **Don't ignore entity scoping** - Always consider user permissions
- ❌ **Don't forget mobile responsiveness** - Test on all screen sizes
- ❌ **Don't skip accessibility testing** - Verify with screen readers
- ❌ **Don't use generic error messages** - Make them specific and actionable
- ❌ **Don't forget loading states** - Always provide user feedback
- ❌ **Don't ignore status background colors** - Use proper rgba values for backgrounds

---

**Remember**: This design system ensures consistency across Client Portal v2.0 while maintaining the professional healthcare appearance and user trust that's essential for PBM operations. Always prioritize user confidence, data accuracy, and regulatory compliance in your design decisions.