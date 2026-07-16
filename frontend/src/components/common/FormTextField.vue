<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const emit = defineEmits(['update:modelValue']);

const props = withDefaults(defineProps<{
  label?: string;
  modelValue: string | null;
  displayOnly?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}>(), {
  displayOnly: false,
  disabled: false,
  isLoading: false,
});

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value: string | null) => emit('update:modelValue', value),
});

const displayOnlyValue = computed(() => props.modelValue || '—');
</script>

<template>
  <v-skeleton-loader v-if="props.isLoading" type="text" class="skeleton-loader" />
  <div v-else-if="props.displayOnly" class="display-field">
    <div class="display-field__label">{{ props.label }}</div>
    <div class="display-field__value">{{ displayOnlyValue }}</div>
  </div>
  <v-text-field
    v-else
    v-bind="$attrs"
    :label="props.label"
    v-model="fieldValue"
    variant="outlined"
    :disabled="props.disabled"
  />
</template>

<style lang="scss" scoped>
@import '@/style.scss';

.display-field {
  margin-bottom: $spacing-small;

  &__label {
    font-size: $font-size-small;
    color: $color-text-secondary;
    margin-bottom: 2px;
  }

  &__value {
    font-size: $font-size-body;
    color: $color-text-primary;
  }
}

.skeleton-loader {
  :deep(.v-skeleton-loader__text) {
    margin-left: 0;
  }
}
</style>
