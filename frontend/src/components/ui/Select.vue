<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="label"
    :variant="variant"
    :hide-selected="false"
    :no-data-text="noDataText"
    :menu-props="{ offsetY: true, eager: true }"
    :density="'compact'"
    :search="searchable ? internalSearch : undefined"
    @update:search="searchable ? internalSearch = $event : null"
    :custom-filter="searchable ? customFilter : undefined"
    :menu-icon="ChevronDown"
  ></v-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

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
</style>