
<template>
  <v-app-bar app flat dense border class="app-header">
    <v-spacer></v-spacer>

    <v-btn
      icon
      variant="text"
      class="dark-mode-toggle mr-1"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggleDarkMode"
    >
      <Sun v-if="isDark" :size="20" :stroke-width="1.5" />
      <Moon v-else :size="20" :stroke-width="1.5" />
    </v-btn>

    <v-btn variant="outlined" class="mr-2 help-button">Fiduciary Dashboard</v-btn>

    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="36">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User" />
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();
</script>

<style lang="scss" scoped>
.app-header {
  background-color: var(--color-bg-header) !important;
  border-bottom: 1px solid var(--color-border) !important;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.help-button {
  border-radius: 100px;
  text-transform: none;
  color: var(--color-text-primary) !important;
  border-color: var(--color-border) !important;
}

.dark-mode-toggle {
  color: var(--color-text-secondary) !important;

  &:hover {
    color: var(--color-text-primary) !important;
  }
}
</style>
