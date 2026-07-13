<template>
  <v-btn variant="text" color="primary" class="advanced-filters-btn" @click="emit('click')">
    <SlidersHorizontal :size="18" :stroke-width="1.5" class="mr-1" />
    Filters
  </v-btn>
</template>

<script setup lang="ts">
import { SlidersHorizontal } from 'lucide-vue-next';

const emit = defineEmits<{ click: [] }>();
</script>

<style scoped>
.advanced-filters-btn {
  text-transform: none;
  letter-spacing: 0;
  font-size: 1rem;
}
</style>
