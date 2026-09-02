<template>
  <v-app>
    <Sidebar />
    <Header />
    <v-main>
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
</script>

<style lang="scss" scoped>
.main-container {
  padding: var(--root-padding);
}
</style>


