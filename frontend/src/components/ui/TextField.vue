<template>
  <v-tooltip :text="modelValue || ($attrs.value as string)" location="top" :disabled="!isTextTruncated">
    <template #activator="{ props: tooltipProps }">
      <v-text-field
        ref="textFieldRef"
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
import { ref, computed } from 'vue';
import { VTextField, VTooltip } from 'vuetify/components';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  readonly?: boolean;
  modelValue?: string;
}

const props = defineProps<Props>();

const textFieldRef = ref<HTMLElement | null>(null);

const isTextTruncated = computed(() => {
  if (textFieldRef.value) {
    const inputElement = textFieldRef.value.$el.querySelector('.v-field__input');
    if (inputElement) {
      return inputElement.scrollWidth > inputElement.clientWidth;
    }
  }
  return false;
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.custom-text-field {
  width: 100%;

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
