
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
          <img :src="item.icon" :alt="item.title" class="nav-icon" />
          <span class="nav-title">{{ item.title }}</span>
        </div>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item to="/settings" class="nav-item">
        <div class="nav-item-content">
          <img src="/icons/settings.svg" alt="Settings" class="nav-icon" />
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
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const navItems = ref([
  { title: 'Home', icon: '/icons/home.svg', to: '/' },
  { title: 'Approvals', icon: '/icons/approvals.svg', to: '/approvals' },
  { title: 'Reports', icon: '/icons/reports.svg', to: '/reports' },
  { title: 'Documents', icon: '/icons/documents.svg', to: '/documents' },
  { title: 'Claims', icon: '/icons/claims.svg', to: '/high-cost-claims' },
  { title: 'Prior Auths', icon: '/icons/priorauth.svg', to: '/prior-auths' },
  { title: 'Billing', icon: '/icons/billing.svg', to: '/billing' },
  { title: 'Plan Explorer', icon: '/icons/planexplorer.svg', to: '/plan-explorer' },
  { title: 'Test Results', icon: '/icons/testresults.svg', to: '/test-results' },
  { title: 'Added Value', icon: '/icons/addedvalue.svg', to: '/added-value' },
]);
</script>

<style scoped>
.sidebar::-webkit-scrollbar {
  display: none;
}
.sidebar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.v-navigation-drawer {
  border-right: 1px solid #e0e0e0 !important;
}
.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align to the left */
  padding-left: 20px !important; /* Add left padding */
  padding-bottom: 16px !important;
  padding-top: 16px !important;
}
.logo-img {
  height: 40px;
}
.logo-arrow {
  color: #8A8A8A;
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
  height: 24px;
  width: 24px;
  margin-bottom: 4px;
}
.nav-title {
  font-size: 0.75rem; /* 12px */
  color: #1f2022;
  font-weight: 500;
}
.nav-item-active .nav-title {
  color: #0052CC;
  font-weight: bold;
}
.nav-item-active .nav-icon {
  filter: invert(25%) sepia(99%) saturate(2051%) hue-rotate(202deg) brightness(93%) contrast(101%);
}
</style>
