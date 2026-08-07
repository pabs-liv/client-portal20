<template>
  <v-btn-toggle
    :model-value="modelValue"
    mandatory
    class="segmented-toggle"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-btn
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="segmented-toggle-btn"
    >
      {{ option.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  modelValue: string;
}

defineProps<Props>();
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.segmented-toggle {
  background-color: $color-border;
  border-radius: 8px;
  padding: 4px;
  box-shadow: none;
  height: auto;

  :global(html.dark) & {
    background-color: var(--color-bg-surface);
  }
}

.segmented-toggle-btn {
  border-radius: 6px !important;
  text-transform: none !important;
  font-family: $font-family-base !important;
  font-weight: $font-weight-normal;
  background-color: $color-border !important;
  color: $color-neutral-disabled !important;
  letter-spacing: 0 !important;
  box-shadow: none !important;
  height: 36px !important;
  padding: 0 $spacing-medium !important;
  transition: background-color 0.2s ease, color 0.2s ease;

  &.v-btn--active {
    background-color: $color-neutral-white !important;
    color: $color-primary !important;
    font-weight: $font-weight-bold;

    :deep(.v-btn__overlay) {
      opacity: 0 !important;
    }
  }

  :deep(.v-btn__overlay) {
    background-color: transparent !important;
  }

  :global(html.dark) & {
    background-color: var(--color-bg-surface) !important;
    color: var(--color-text-secondary) !important;

    &.v-btn--active {
      background-color: var(--color-card-bg) !important;
      color: #7BA7E0 !important;
    }
  }
}
</style>
