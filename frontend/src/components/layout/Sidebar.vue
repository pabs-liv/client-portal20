
<template>
  <v-navigation-drawer permanent app width="120" class="sidebar">
    <div class="logo-container pa-2">
      <img src="/icons/Logo.svg" alt="Client Portal Logo" class="logo-img" />
      <v-icon class="logo-arrow">mdi-chevron-down</v-icon>
    </div>

    <v-list nav dense class="nav-list">
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        class="nav-item"
        active-class="nav-item-active"
      >
        <div class="nav-item-content">
          <template v-if="item.title === 'Home'">
            <House :stroke-width="1" class="nav-icon" />
          </template>
          <template v-else-if="item.title === 'Reports'">
            <FileChartColumnIncreasing  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'CAA Reports'">
            <FileCheck2  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'Documents'">
            <FileText  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'High-Cost Claims'">
            <Tablets  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'Prior Auths'">
            <RotateCcwKey  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'Billing'">
            <ScrollText  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'Plan Explorer'">
            <Blocks  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'Test Results'">
            <CircleGauge  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else-if="item.title === 'Added Value'">
            <Blocks  :stroke-width="1" class="nav-icon"  />
          </template>
          <template v-else>
            <img :src="item.icon" :alt="item.title" class="nav-icon" />
          </template>
          <span class="nav-title">{{ item.title }}</span>
        </div>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item to="/settings" class="nav-item">
        <div class="nav-item-content">
          <MonitorCog  :stroke-width="1" class="nav-icon"  />
          <span class="nav-title">Settings</span>
        </div>
      </v-list-item>
      <v-list-item class="nav-item">
        <div class="nav-item-content">
          <v-icon class="nav-icon">mdi-logout</v-icon>
          <span class="nav-title">Logout</span>
        </div>
      </v-list-item>
    </v-list>

    <!-- Development-only user type switcher -->
    <div v-if="isDev" class="dev-switcher">
      <v-switch
        :model-value="isInternal"
        label="Internal User"
        density="compact"
        hide-details
        @update:model-value="toggleUserType"
      ></v-switch>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { House, FileChartColumnIncreasing, FileCheck2, FileText, Tablets, RotateCcwKey, ScrollText, Blocks, CircleGauge, MonitorCog } from 'lucide-vue-next';
import { useUserType } from '@/composables/useUserType';

const { isInternal, setUserType } = useUserType();

const isDev = import.meta.env.DEV;

const toggleUserType = (value: boolean) => {
  setUserType(value ? 'internal' : 'external');
};

const navItems = ref([
  { title: 'Home', to: '/' },
  { title: 'Reports', to: '/reports' },
  { title: 'CAA Reports', to: '/caa-reports' },
  { title: 'Documents', to: '/documents' },
  { title: 'High-Cost Claims', to: '/high-cost-claims' },
  { title: 'Prior Auths', to: '/prior-auths' },
  { title: 'Billing', to: '/billing' },
  { title: 'Plan Explorer', to: '/plan-explorer' },
  { title: 'Test Results', to: '/test-results' },
  { title: 'Added Value', to: '/added-value' },
]);
</script>

<style lang="scss" scoped>
.sidebar::-webkit-scrollbar {
  display: none;
}
.sidebar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.v-navigation-drawer {
  background-color: var(--color-bg-sidebar) !important;
  border-right: 1px solid var(--color-border) !important;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px !important;
  padding-bottom: 16px !important;
  padding-top: 16px !important;
}
.logo-img {
  height: 40px;
}
.logo-arrow {
  color: var(--color-text-secondary);
  margin-left: 8px;
}
.nav-list {
  padding: 0;
}
.nav-item {
  padding: 16px 0;
  text-align: center;
}
.nav-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
}
.nav-icon {
  height: 25px;
  width: 25px;
  margin-bottom: 4px;
  color: var(--color-nav-icon);
  transition: color 0.25s ease;
}
.nav-title {
  font-size: 0.75rem;
  color: var(--color-nav-title);
  font-weight: 500;
  transition: color 0.25s ease;
}
.nav-item-active .nav-icon {
  color: #0052CC;
}
.nav-item-active .nav-title {
  color: #0052CC;
  font-weight: bold;
}

// Dark mode: swap to a lighter blue that clears 4.5:1 on the dark sidebar bg (#13161F)
:global(html.dark) .nav-item-active .nav-icon,
:global(html.dark) .nav-item-active .nav-title {
  color: #7BA7E0 !important; // 6.9:1 contrast on #13161F — WCAG AA ✓
}

.dev-switcher {
  padding: 8px 4px 16px;
  text-align: center;

  :deep(.v-label) {
    font-size: 0.6875rem;
    opacity: 1;
    color: var(--color-nav-title);
  }
}

</style>
