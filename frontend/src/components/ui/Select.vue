<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="hasRequiredMarker ? undefined : label"
    :variant="variant"
    :hide-selected="false"
    :no-data-text="noDataText"
    :menu-props="{ offsetY: true, eager: true }"
    :density="'compact'"
    :search="searchable ? internalSearch : undefined"
    @update:search="searchable ? internalSearch = $event : null"
    :custom-filter="searchable ? customFilter : undefined"
    :menu-icon="ChevronDown"
    :base-color="isDark ? 'rgba(255,255,255,0.6)' : undefined"
    :bg-color="isDark ? 'var(--color-input-bg)' : undefined"
  >
    <template v-if="hasRequiredMarker" #label>{{ labelWithoutAsterisk }}<span class="select-required-asterisk">*</span></template>
  </v-select>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

interface Props {
  items: any[];
  label?: string;
  modelValue?: any;
  searchable?: boolean;
  itemTitle?: string;
  itemValue?: string;
  noDataText?: string;
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo';
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Account',
  searchable: false,
  itemTitle: 'title',
  itemValue: 'value',
  noDataText: 'No data available',
  variant: 'outlined',
});

const internalSearch = ref<string>('');

// Vuetify's :label prop only accepts plain text, so a trailing "*" typed into the label
// string inherits the same muted label color below — invisible as a required-field cue.
// Detect it and re-render it via the label slot so it can be colored independently.
const hasRequiredMarker = computed(() => /\*\s*$/.test(props.label ?? ''));
const labelWithoutAsterisk = computed(() => (props.label ?? '').replace(/\*\s*$/, '').trimEnd());

// Custom filter function for searchable select
const customFilter = (itemTitle: string, query: string, item: any) => {
  const textOne = item.raw[props.itemTitle]?.toLowerCase();
  const searchText = query.toLowerCase();
  return textOne.indexOf(searchText) > -1;
};

// Clear search when selection changes if not multiple
watch(() => props.modelValue, () => {
  if (!props.searchable) {
    internalSearch.value = '';
  }
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.select-required-asterisk {
  color: $color-error;
  margin-left: 2px;
}

.v-select {
  :deep(.v-field__input) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
  }

  :deep(.v-label) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
    color: $color-neutral-disabled !important;
  }

  :deep(.v-select__selection-text) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
    color: $color-text-primary !important;
  }

  :deep(.v-icon) {
    color: $color-text-primary !important;
  }

  :deep(.v-list-item-title) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
    color: $color-text-primary !important;
  }

  :deep(.v-list-item--active .v-list-item-title) {
    color: $color-primary !important;
  }
}

:global(html.dark) .v-select {
  :deep(.v-field) {
    background-color: var(--color-input-bg) !important;
    color: var(--color-text-primary) !important;
  }

  :deep(.v-field__outline) {
    --v-field-border-color: var(--color-input-border);
  }

  :deep(.v-label) {
    color: var(--color-text-secondary) !important;
  }

  :deep(.v-select__selection-text),
  :deep(.v-field__input),
  :deep(.v-icon) {
    color: var(--color-text-primary) !important;
  }
}
</style>