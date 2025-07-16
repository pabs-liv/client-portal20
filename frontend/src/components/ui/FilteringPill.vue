<template>
  <v-chip
    v-bind="$attrs"
    :color="isActive ? 'var(--color-primary)' : chipColor"
    :variant="isActive ? 'flat' : 'outlined'"
    :closable="props.closable"
    class="filtering-pill"
  >
    <slot></slot>
  </v-chip>
</template>

<script setup>
import { computed, useAttrs, defineProps } from 'vue';

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const attrs = useAttrs();

// Define a computed property for the chip color
// This allows overriding the default primary color if a 'color' prop is explicitly passed
const chipColor = computed(() => {
  return attrs.color || 'var(--color-primary)';
});
</script>

<style scoped>
.filtering-pill.v-chip.v-chip--outlined .v-chip__content {
  color: var(--color-text-primary) !important;
}

.filtering-pill.v-chip--flat .v-chip__content {
  color: var(--color-neutral-white) !important;
}
</style>
