<template>
  <v-app>
    <Sidebar />
    <Header />
    <v-main style="overflow-y: auto;">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
</script>


