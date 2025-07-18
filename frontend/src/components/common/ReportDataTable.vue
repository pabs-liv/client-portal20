<template>
  <div class="report-data-table">
    <div v-if="showSearchBar && items.length > 0" class="search-bar-wrapper">
      <SearchBar @update:searchTerm="searchTerm = $event" :showFilterButton="showFilterButton" />
    </div>
    <div v-if="showFilterPills && activeFilters.length > 0" class="filter-pills-container">
      <FilteringPill
        v-for="filter in activeFilters"
        :key="filter.type"
        :is-active="filter.isActive"
        @click="handleFilterPillClick(filter)"
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
      
      <template v-slot:item.actions="{ item }">
        <v-menu v-if="showRowActions">
          <template v-slot:activator="{ props }">
            <EllipsisVertical :stroke-width="1" v-bind="props" class="row-action-icon" />
          </template>
          <v-list>
            <v-list-item @click="console.log('View item:', item)">
              <v-list-item-title>View</v-list-item-title>
            </v-list-item>
            <v-list-item @click="console.log('Download item:', item)">
              <v-list-item-title>Download</v-list-item-title>
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
import { ref, defineProps, computed, watch, onMounted } from 'vue';
import SearchBar from '../ui/SearchBar.vue';
import FilteringPill from '../ui/FilteringPill.vue';
import { Microscope, EllipsisVertical } from 'lucide-vue-next';

const props = defineProps({
  showSearchBar: {
    type: Boolean,
    default: true,
  },
  showFilterButton: {
    type: Boolean,
    default: true,
  },
  showFilterPills: {
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
  initialFilterPills: {
    type: Array,
    default: () => [],
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

const activeFilters = ref([]);
const selected = ref([]); // For managing selected items
const activeFilterPill = ref(props.initialFilterPills.length > 0 ? props.initialFilterPills[0] : null); // To track the currently active filter pill

// Watch for initialFilterPills prop to populate activeFilters
watch(() => props.initialFilterPills, (newVal) => {
  if (newVal && newVal.length > 0) {
    activeFilters.value = newVal.map(pill => ({ ...pill })); // Create a deep copy
    // Ensure the initially active pill is marked as active
    const initialActive = activeFilters.value.find(p => p.isActive);
    if (initialActive) {
      activeFilterPill.value = initialActive;
    } else {
      activeFilterPill.value = activeFilters.value[0];
      activeFilterPill.value.isActive = true; // Mark the first pill as active if none are
    }
  }
}, { immediate: true });

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
};

const handleFilterPillClick = (clickedFilter) => {
  activeFilters.value.forEach(filter => {
    filter.isActive = (filter.value === clickedFilter.value);
  });
  activeFilterPill.value = clickedFilter;
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

  // Apply filter based on activeFilterPill
  if (activeFilterPill.value && activeFilterPill.value.value !== 'all') {
    if (activeFilterPill.value.type === 'tab') {
      currentItems = currentItems.filter(item => item.type.toLowerCase() === activeFilterPill.value.value.toLowerCase());
    } else if (activeFilterPill.value.type === 'status') {
      currentItems = currentItems.filter(item => item.status.toLowerCase() === activeFilterPill.value.value.toLowerCase());
    }
  }
  console.log('ReportDataTable - filteredItems:', currentItems);
  return currentItems;
});

onMounted(() => {
  console.log('ReportDataTable mounted!');
  console.log('ReportDataTable - initialFilterPills:', props.initialFilterPills);
  console.log('ReportDataTable - activeFilters:', activeFilters.value);
  console.log('ReportDataTable - activeFilterPill:', activeFilterPill.value);
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.report-data-table {
  /* Basic styling for the container */
  /* Removed redundant padding, border, border-radius, and background-color */
}

.navigation-tabs-container {
  margin-bottom: $spacing-medium;
}

.search-bar-wrapper {
  margin-bottom: $spacing-medium;
}

.filter-pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-small;
  margin-bottom: $spacing-medium;
}

.my-table :deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  font-weight: $font-weight-bold !important;
}

.my-table :deep(.v-data-footer .v-icon) {
  color: $color-text-primary !important;
  opacity: 1 !important;
}

.my-table :deep(.v-selection-control__input input) {
  opacity: 1 !important;
  width: 16px !important;
  
}

.my-table :deep(.v-selection-control__wrapper) {
  color: $color-primary !important; /* Apply primary color to the wrapper */
  opacity: 1 !important; /* Ensure wrapper is visible */
}

.my-table :deep(.v-selection-control__ripple) {
  color: $color-primary !important; /* Apply primary color to the ripple effect */
}

.my-table :deep(.v-checkbox .v-icon) {
  color: $color-primary !important; /* Ensure checkmark icon is primary color */
  opacity: 1 !important; /* Ensure checkmark icon is visible */
}

.my-table :deep(.v-checkbox .v-selection-control__off-icon) {
  color: $color-border !important; /* Color for unchecked state border */
  opacity: 1 !important;
}

.my-table :deep(.v-checkbox .v-selection-control__on-icon) {
  color: $color-primary !important; /* Color for checked state checkmark */
  opacity: 1 !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-large;
  text-align: center;
  color: $color-neutral-disabled;
}

.empty-state-icon {
  margin-bottom: $spacing-small;
  color: $color-border;
}

.empty-state-text {
  font-size: $font-size-body;
  color: $color-neutral-disabled;
}

.row-action-icon {
  cursor: pointer;
}
</style>