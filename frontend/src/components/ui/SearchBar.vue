<template>
  <div class="search-bar-container">
    <div class="search-input-wrapper">
      <Search :stroke-width="1" class="search-icon" />
      <input
        type="text"
        v-model="searchTerm"
        :placeholder="placeholder"
        class="search-input"
        @input="emitSearch"
      />
    </div>
    <Button v-if="showSearchButton" variant="primary" label="Search" :showIcon="true" :icon="Search" />
    <ListFilter v-if="showFilterButton" :stroke-width="1" class="filter-icon" @click="$emit('click:filter')" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { Search, ListFilter } from 'lucide-vue-next';
import Button from './Button.vue'; // Assuming Button.vue is in the same ui folder

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search by report name, report type, or keyword',
  },
  showFilterButton: {
    type: Boolean,
    default: true,
  },
  showSearchButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:searchTerm', 'click:filter']);

const searchTerm = ref('');

const emitSearch = () => {
  emit('update:searchTerm', searchTerm.value);
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.search-bar-container {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-nano;
  background-color: $color-neutral-white;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0;
}

.search-icon {
  color: $color-neutral-disabled;
  margin-right: $spacing-nano;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  padding: $spacing-nano 0;
  font-size: $font-size-body;
  color: $color-text-primary;
}

.search-input::placeholder {
  color: $color-neutral-disabled;
}

/* Adjust button padding for better visual alignment */
.search-bar-container .button {
  padding: $spacing-nano $spacing-small;
}

.filter-icon {
  color: $color-primary;
  cursor: pointer;
  font-size: 1.5rem; /* Adjust size as needed */
}
</style>
