
<template>
  <v-app-bar app flat dense border class="app-header">
    <v-spacer></v-spacer>

    <div class="d-flex align-center mr-4 account-lock">
      <v-switch
        :model-value="!!lockedAccount"
        color="primary"
        hide-details
        density="compact"
        aria-label="Account lock"
        @update:model-value="onLockSwitchChange"
      ></v-switch>
      <a href="#" class="account-lock-link" @click.prevent="isAccountLockDialogOpen = true">
        {{ lockedAccount?.name ?? 'Account Lock' }}
      </a>
    </div>

    <AccountLockDialog v-model="isAccountLockDialogOpen" />

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
        <v-list-item @click="onLogout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Sun, Moon } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useDarkMode } from '@/composables/useDarkMode';
import { useAccountLock } from '@/composables/useAccountLock';
import AccountLockDialog from '@/components/layout/AccountLockDialog.vue';

const { isDark, toggleDarkMode } = useDarkMode();
const router = useRouter();

const { lockedAccount, unlockAccount } = useAccountLock();
const isAccountLockDialogOpen = ref(false);

// Switching on opens the dialog to pick an account; switching off clears the lock.
function onLockSwitchChange(value: boolean | null) {
  if (value) {
    isAccountLockDialogOpen.value = true;
  } else {
    unlockAccount();
  }
}

function onLogout() {
  router.push('/');
}
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

.account-lock-link {
  color: var(--color-text-primary);
  text-decoration: underline;
}

.dark-mode-toggle {
  color: var(--color-text-secondary) !important;

  &:hover {
    color: var(--color-text-primary) !important;
  }
}
</style>
