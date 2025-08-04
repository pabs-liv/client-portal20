<template>
  <v-combobox
    :model-value="modelValue"
    @update:model-value="handleModelValueUpdate"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="label"
    :variant="variant"
    :hide-selected="false"
    :no-data-text="noDataText"
    :menu-props="{ offsetY: true, eager: true }"
    :density="'compact'"
    v-model:search="internalSearch"
    :custom-filter="searchable ? customFilter : undefined"
    :menu-icon="ChevronDown"
  ></v-combobox>
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
  label: 'Select',
  searchable: false,
  itemTitle: 'title',
  itemValue: 'value',
  noDataText: 'No data available',
  variant: 'outlined',
});

const internalSearch = ref<string>('');

// Custom filter function for searchable combobox
const customFilter = (itemTitle: string, query: string, item: any) => {
  const textOne = item.raw[props.itemTitle]?.toLowerCase();
  const searchText = query.toLowerCase();
  return textOne.indexOf(searchText) > -1;
};

const handleModelValueUpdate = (newValue: any) => {
  if (props.searchable) {
    // If searchable, check if the new value exists in the items
    const foundItem = props.items.find(item => item[props.itemValue] === newValue);
    if (foundItem) {
      emit('update:modelValue', newValue);
    } else {
      // If not found, clear the selection
      emit('update:modelValue', null);
    }
  } else {
    // If not searchable, just emit the value
    emit('update:modelValue', newValue);
  }
};

// Clear search when selection changes
watch(() => props.modelValue, () => {
  if (props.searchable) {
    internalSearch.value = '';
  }
});

const emit = defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.v-combobox {
  :deep(.v-field__input) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
  }

  :deep(.v-label) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
    color: $color-neutral-disabled !important;
  }

  :deep(.v-combobox__selection-text) {
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
    color: $color-primary !important;
  }

  :deep(.v-list-item--active .v-list-item-title) {
    color: $color-primary !important;
  }
}
</style>