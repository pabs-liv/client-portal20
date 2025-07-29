<template>
  <v-tooltip :text="modelValue || $attrs.value" location="top">
    <template v-slot:activator="{ props: tooltipProps }">
      <v-text-field
        v-bind="{ ...$attrs, ...tooltipProps }"
        :variant="readonly ? 'plain' : 'outlined'"
        density="compact"
        :model-value="modelValue"
      ></v-text-field>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { VTextField, VTooltip } from 'vuetify/components';
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  readonly?: boolean;
  modelValue?: string; // Explicitly define modelValue prop
}

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.v-text-field {
  display: inline-block; // Allow it to shrink-wrap content
  max-width: 300px; // Max width constraint
  vertical-align: top; // For proper alignment in flex/grid

  .v-field__input {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // Specific styles for read-only plain variant
  &.v-input--is-readonly.v-text-field--plain {
    .v-field__field {
      // Adjust padding to make space for the label acting as value
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      min-height: unset !important;
      height: auto !important;
    }

    .v-field__input {
      display: none !important; // Hide the actual input value
    }

    .v-field__label {
      // Position the label to appear as the value
      transform: none !important; // Remove any floating transform
      position: static !important; // Make it flow with content
      max-width: 100%; // Ensure it truncates if needed
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--v-theme-on-surface) !important; // Make it look like normal text
      font-size: 1rem; // Match body text size
      line-height: normal; // Ensure proper line height
      padding-left: 16px; // Match default input padding
      padding-right: 16px;
    }

    .v-input__control {
      min-height: unset !important;
      height: auto !important;
    }
  }
}
</style>
