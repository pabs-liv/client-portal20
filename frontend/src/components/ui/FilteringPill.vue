<template>
  <v-chip v-bind="$attrs" :color="chipColor" class="filtering-pill">
    <slot></slot>
  </v-chip>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

const attrs = useAttrs();

// Define a computed property for the chip color
// This allows overriding the default primary color if a 'color' prop is explicitly passed
const chipColor = computed(() => {
  return attrs.color || 'var(--color-primary)';
});
</script>

<style scoped>
.filtering-pill {
  /* Any additional scoped styles for the filtering pill */
}
</style>
