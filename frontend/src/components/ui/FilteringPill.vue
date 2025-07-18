<template>
  <v-chip
    v-bind="$attrs"
    :color="isActive ? 'primary' : chipColor"
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
  return attrs.color || 'primary';
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.filtering-pill.v-chip--variant-outlined {
  .v-chip__content {
    color: $color-text-primary;
  }
}

.filtering-pill.v-chip--variant-flat {
  .v-chip__content {
    color: $color-neutral-white;
  }
}
</style>
