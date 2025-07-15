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
    <Button variant="primary" label="Search" :showIcon="true" :icon="Search" />
    <ListFilter v-if="showFilterButton" :stroke-width="1" class="filter-icon" />
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
});

const emit = defineEmits(['update:searchTerm']);

const searchTerm = ref('');

const emitSearch = () => {
  emit('update:searchTerm', searchTerm.value);
};
</script>

<style scoped>
.search-bar-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: var(--spacing-nano);
  background-color: var(--color-neutral-white);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0;
}

.search-icon {
  color: #888;
  margin-right: var(--spacing-nano);
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  padding: var(--spacing-nano) 0;
  font-size: 1rem;
  color: var(--color-text-primary);
}

.search-input::placeholder {
  color: #aaa;
}

/* Adjust button padding for better visual alignment */
.search-bar-container .button {
  padding: var(--spacing-nano) var(--spacing-small);
}

.filter-icon {
  color: var(--color-primary);
  cursor: pointer;
  font-size: 1.5rem; /* Adjust size as needed */
}
</style>
