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
      :headers="processedHeaders"
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SearchBar from '../ui/SearchBar.vue';
import FilteringPill from '../ui/FilteringPill.vue';
import { Microscope, EllipsisVertical } from 'lucide-vue-next';

interface Header {
  title: string;
  key: string;
  [key: string]: any;
}

interface Pill {
  type: string;
  value: string;
  label: string;
  isActive?: boolean;
}

interface Props {
  showSearchBar?: boolean;
  showFilterButton?: boolean;
  showFilterPills?: boolean;
  headers: Header[];
  items?: any[];
  showRowActions?: boolean;
  showTableFooter?: boolean;
  showSelectionCheckboxes?: boolean;
  initialFilterPills?: Pill[];
}

const props = withDefaults(defineProps<Props>(), {
  showSearchBar: true,
  showFilterButton: true,
  showFilterPills: true,
  items: () => [],
  showRowActions: true,
  showTableFooter: true,
  showSelectionCheckboxes: true,
  initialFilterPills: () => [],
});

const searchTerm = ref('');
const activeFilters = ref<Pill[]>([]);
const selected = ref<any[]>([]);
const activeFilterPill = ref<Pill | null>(null);

const processedHeaders = computed(() => 
  props.headers.map(header => ({
    ...header,
    class: 'font-weight-bold',
  }))
);

watch(() => props.initialFilterPills, (newVal) => {
  if (newVal && newVal.length > 0) {
    activeFilters.value = newVal.map(pill => ({ ...pill }));
    const initialActive = activeFilters.value.find(p => p.isActive);
    if (initialActive) {
      activeFilterPill.value = initialActive;
    } else if (activeFilters.value.length > 0) {
      activeFilters.value[0].isActive = true;
      activeFilterPill.value = activeFilters.value[0];
    }
  }
}, { immediate: true });

const handleFilterPillClick = (clickedFilter: Pill) => {
  activeFilters.value.forEach(filter => {
    filter.isActive = (filter.value === clickedFilter.value);
  });
  activeFilterPill.value = clickedFilter;
};

const filteredItems = computed(() => {
  let currentItems = props.items;

  if (searchTerm.value) {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
    currentItems = currentItems.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }

  if (activeFilterPill.value && activeFilterPill.value.value !== 'all') {
    if (activeFilterPill.value.type === 'tab') {
      currentItems = currentItems.filter(item => item.type.toLowerCase() === activeFilterPill.value!.value.toLowerCase());
    } else if (activeFilterPill.value.type === 'status') {
      currentItems = currentItems.filter(item => item.status.toLowerCase() === activeFilterPill.value!.value.toLowerCase());
    }
  }
  return currentItems;
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.report-data-table {
  /* Basic styling for the container */
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

.my-table :deep(.v-table__wrapper) {
  thead {
    tr {
      th {
        font-weight: $font-weight-bold !important;
      }
    }
  }
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
  color: $color-primary !important;
  opacity: 1 !important;
}

.my-table :deep(.v-selection-control__ripple) {
  color: $color-primary !important;
}

.my-table :deep(.v-checkbox .v-icon) {
  color: $color-primary !important;
  opacity: 1 !important;
}

.my-table :deep(.v-checkbox .v-selection-control__off-icon) {
  color: $color-border !important;
  opacity: 1 !important;
}

.my-table :deep(.v-checkbox .v-selection-control__on-icon) {
  color: $color-primary !important;
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