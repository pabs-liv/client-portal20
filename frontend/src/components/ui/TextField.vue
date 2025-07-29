<template>
  <v-tooltip :text="modelValue || ($attrs.value as string)" location="top">
    <template #activator="{ props: tooltipProps }">
      <v-text-field
        v-bind="{ ...$attrs, ...tooltipProps }"
        :variant="readonly ? 'outlined' : 'outlined'"
        :readonly="readonly"
        density="compact"
        :model-value="modelValue"
        class="custom-text-field"
      ></v-text-field>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { VTextField, VTooltip } from 'vuetify/components';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  readonly?: boolean;
  modelValue?: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.custom-text-field {
  max-width: 300px;

  &.v-input--is-readonly {
    .v-field {
      background-color: var(--color-surface-neutral) !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }

    .v-field__input {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .v-label {
      color: var(--color-text-secondary) !important;
      opacity: 1 !important;
    }
  }
}
</style>
