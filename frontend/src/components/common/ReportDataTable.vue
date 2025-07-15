<template>
  <div class="report-data-table">
    <div v-if="showNavigationTabs" class="navigation-tabs-container">
      <Tabs :tabs="reportTabs" @tab-selected="handleTabSelected" />
    </div>
    <div v-if="showSearchBar && items.length > 0" class="search-bar-wrapper">
      <SearchBar @update:searchTerm="searchTerm = $event" :showFilterButton="showFilterButton" />
    </div>
    <div v-if="activeFilters.length > 0" class="filter-pills-container">
      <FilteringPill
        v-for="filter in activeFilters"
        :key="filter.type"
        closable
        @click:close="removeFilter(filter)"
      >
        {{ filter.label }}
      </FilteringPill>
    </div>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="my-table"
      :items-per-page="5"
      dense
      :hide-default-footer="!showTableFooter"
      :items-per-page-props="{ color: 'var(--color-text-primary)' }"
      :show-select="showSelectionCheckboxes"
      v-model:selected="selected"
    >
      <template v-slot:item.data-table-select="{ item, isSelected, toggleSelect }">
        <v-checkbox-btn
          :model-value="isSelected"
          @update:model-value="toggleSelect"
          color="var(--color-primary)"
          density="compact"
        ></v-checkbox-btn>
      </template>
      <template v-slot:header.data-table-select="{ someSelected, allSelected, toggleSelectAll }">
        <v-checkbox-btn
          :model-value="allSelected"
          :indeterminate="someSelected && !allSelected"
          @update:model-value="toggleSelectAll"
          color="var(--color-primary)"
          density="compact"
        ></v-checkbox-btn>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-menu v-if="showRowActions">
          <template v-slot:activator="{ props }">
            <EllipsisVertical :stroke-width="1" v-bind="props" class="row-action-icon" />
          </template>
          <v-list>
            <v-list-item @click="console.log('View item:', item)">
              <v-list-item-title>View</v-list-item-title>
            </v-list-item>
            <v-list-item @click="console.log('Edit item:', item)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="console.log('Delete item:', item)">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:no-data>
        <div class="empty-state">
          <Microscope :size="80" :stroke-width="1" class="empty-state-icon" />
          <p class="empty-state-text">No reports available.</p>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import SearchBar from '../ui/SearchBar.vue';
import Tabs from './Tabs.vue';
import FilteringPill from '../ui/FilteringPill.vue';
import { Microscope, EllipsisVertical } from 'lucide-vue-next';

const props = defineProps({
  showNavigationTabs: {
    type: Boolean,
    default: false,
  },
  showSearchBar: {
    type: Boolean,
    default: true,
  },
  showFilterButton: {
    type: Boolean,
    default: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  showRowActions: {
    type: Boolean,
    default: true,
  },
  showTableFooter: {
    type: Boolean,
    default: true,
  },
  showSelectionCheckboxes: {
    type: Boolean,
    default: true,
  },
});

const searchTerm = ref('');
const reportTabs = ref([
  { label: 'All Reports', key: 'all' },
  { label: 'Approvals', key: 'approvals', count: 4 },
  { label: 'Monthly Reports', key: 'monthly', hasDropdown: true },
  { label: 'Quarterly Reports', key: 'quarterly', hasDropdown: true },
  { label: 'Rebate Reports', key: 'rebate', hasDropdown: true },
  { label: 'CAA Reports', key: 'caa', hasDropdown: true },
]);

const activeTabKey = computed(() => {
  if (props.showNavigationTabs && reportTabs.value.length > 0) {
    return reportTabs.value[0].key;
  }
  return null;
});

const activeFilters = ref([]);
const selected = ref([]); // For managing selected items

// Function to add or update a filter pill
const addOrUpdateFilter = (type, value, label) => {
  const existingFilterIndex = activeFilters.value.findIndex(f => f.type === type);
  if (value) {
    if (existingFilterIndex > -1) {
      activeFilters.value[existingFilterIndex] = { type, value, label };
    } else {
      activeFilters.value.push({ type, value, label });
    }
  } else {
    // Remove filter if value is empty
    if (existingFilterIndex > -1) {
      activeFilters.value.splice(existingFilterIndex, 1);
    }
  }
};

// Function to remove a filter pill
const removeFilter = (filterToRemove) => {
  activeFilters.value = activeFilters.value.filter(filter => filter !== filterToRemove);
  // If removing search term, clear search input
  if (filterToRemove.type === 'search') {
    searchTerm.value = '';
  }
  // If removing tab filter, reset active tab
  if (filterToRemove.type === 'tab') {
    activeTabKey.value = null;
  }
};

const filteredItems = computed(() => {
  let currentItems = props.items;

  // Apply search filter
  if (searchTerm.value) {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
    currentItems = currentItems.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }

  // Apply tab filter
  if (activeTabKey.value && activeTabKey.value !== 'all') {
    currentItems = currentItems.filter(item => item.status.toLowerCase() === activeTabKey.value.toLowerCase());
  }

  console.log('ReportDataTable - filteredItems:', currentItems);
  return currentItems;
});

const handleTabSelected = (key) => {
  activeTabKey.value = key;
  const selectedTab = reportTabs.value.find(tab => tab.key === key);
  if (selectedTab && key !== 'all') {
    addOrUpdateFilter('tab', key, `Tab: ${selectedTab.label}`);
  } else {
    removeFilter(activeFilters.value.find(f => f.type === 'tab'));
  }
};
</script>

<style scoped>
.report-data-table {
  /* Basic styling for the container */
  /* Removed redundant padding, border, border-radius, and background-color */
}

.navigation-tabs-container {
  margin-bottom: var(--spacing-medium);
}

.search-bar-wrapper {
  margin-bottom: var(--spacing-medium);
}

.filter-pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-nano);
  margin-bottom: var(--spacing-medium);
}

.my-table :deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  font-weight: bold !important;
}

.my-table :deep(.v-data-footer .v-icon) {
  color: var(--color-text-primary) !important;
  opacity: 1 !important;
}

.my-table :deep(.v-selection-control__input input) {
  opacity: 1 !important;
  width: 16px !important;
  height: 16px !important;
}

.my-table :deep(.v-selection-control__wrapper) {
  color: var(--color-primary) !important; /* Apply primary color to the wrapper */
  opacity: 1 !important; /* Ensure wrapper is visible */
}

.my-table :deep(.v-selection-control__ripple) {
  color: var(--color-primary) !important; /* Apply primary color to the ripple effect */
}

.my-table :deep(.v-checkbox .v-icon) {
  color: var(--color-primary) !important; /* Ensure checkmark icon is primary color */
  opacity: 1 !important; /* Ensure checkmark icon is visible */
}

.my-table :deep(.v-checkbox .v-selection-control__off-icon) {
  color: var(--color-border) !important; /* Color for unchecked state border */
  opacity: 1 !important;
}

.my-table :deep(.v-checkbox .v-selection-control__on-icon) {
  color: var(--color-primary) !important; /* Color for checked state checkmark */
  opacity: 1 !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-large);
  text-align: center;
  color: #888;
}

.empty-state-icon {
  margin-bottom: var(--spacing-small);
  color: #ccc;
}

.empty-state-text {
  font-size: 1rem;
  color: #888;
}

.row-action-icon {
  cursor: pointer;
}
</style>

