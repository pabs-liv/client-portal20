<template>
  <v-app>
    <template v-if="isLoginRoute">
      <router-view />
    </template>
    <template v-else>
      <Sidebar />
      <Header />
      <v-main>
        <v-container fluid class="main-container">
          <router-view />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const route = useRoute();
const isLoginRoute = computed(() => route.name === 'Splash' || route.name === 'Login');
</script>

<style lang="scss" scoped>
.main-container {
  padding: var(--root-padding);
}
</style>


