<template>
  <v-tooltip :text="modelValue || ($attrs.value as string)" location="top" :disabled="!isTextTruncated">
    <template #activator="{ props: tooltipProps }">
      <v-text-field
        ref="textFieldRef"
        v-bind="{ ...$attrs, ...tooltipProps }"
        :label="hasRequiredMarker ? undefined : ($attrs.label as string)"
        :variant="readonly ? 'outlined' : 'outlined'"
        :readonly="readonly"
        density="compact"
        :model-value="modelValue"
        class="custom-text-field"
      >
        <template v-if="hasRequiredMarker" #label>{{ labelWithoutAsterisk }}<span class="text-field-required-asterisk">*</span></template>
      </v-text-field>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import { VTextField, VTooltip } from 'vuetify/components';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  readonly?: boolean;
  modelValue?: string;
}

const props = defineProps<Props>();
const attrs = useAttrs();

// Same issue as Select.vue: a trailing "*" typed into the label attribute inherits the
// label's muted color, making it an invisible required-field cue. Split it out so it can
// be colored independently.
const hasRequiredMarker = computed(() => /\*\s*$/.test((attrs.label as string) ?? ''));
const labelWithoutAsterisk = computed(() => ((attrs.label as string) ?? '').replace(/\*\s*$/, '').trimEnd());

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

.text-field-required-asterisk {
  color: $color-error;
  margin-left: 2px;
}

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
