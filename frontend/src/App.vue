<template>
  <v-app>
    <Sidebar />
    <Header />
    <v-main>
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
    </v-main>

    <!-- Development-only user type switcher -->
    <div v-if="isDev" class="dev-switcher">
      <v-switch
        :model-value="isInternal"
        label="Internal User"
        @update:model-value="toggleUserType"
      ></v-switch>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { useUserType } from '@/composables/useUserType';

const { isInternal, setUserType } = useUserType();

const isDev = import.meta.env.DEV;

const toggleUserType = (value: boolean) => {
  setUserType(value ? 'internal' : 'external');
};
</script>

<style lang="scss" scoped>
.main-container {
  padding: var(--root-padding);
}

.dev-switcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  z-index: 9999;
}
</style>


