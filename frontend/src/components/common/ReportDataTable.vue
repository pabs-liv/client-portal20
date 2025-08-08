<template>
  <div class="report-data-table">
    <div v-if="showSearchBar && items.length > 0" class="search-bar-wrapper">
      <SearchBar @update:searchTerm="searchTerm = $event" :showFilterButton="showFilterButton" :placeholder="searchPlaceholder" />
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
        <div v-if="showActionIcons" class="d-flex align-center" :class="actionsClass">
          <v-tooltip v-for="(iconDef, index) in actionIcons" :key="index" :text="iconDef.tooltip">
            <template v-slot:activator="{ props: tooltipProps }">
              <component
                :is="iconDef.icon"
                v-bind="tooltipProps"
                :size="iconDef.size || 25"
                :stroke-width="1"
                :class="['row-action-icon', iconDef.class, {'mr-2': index < actionIcons.length - 1}, {'disabled-icon': (item.status === 'Approved' && iconDef.type !== 'approve') || (item.status === 'Rejected' && iconDef.type !== 'reject')}]"
                :style="{color: (item.status === 'Approved' && iconDef.type === 'approve') ? 'var(--color-approved)' : (item.status === 'Rejected' && iconDef.type === 'reject') ? 'var(--color-denied)' : 'var(--color-text-primary)'}"
                @click="iconDef.onClick(item)"
              />
            </template>
          </v-tooltip>
        </div>
        <div v-else-if="showInternalUserActions">
          <span
            v-if="internalUserActionFormatter(item) === 'Information Requested'"
            class="link"
            @click="internalUserActionClickHandler(item)"
          >
            {{ internalUserActionFormatter(item) }}
          </span>
          <span v-else>
            {{ internalUserActionFormatter(item) }}
          </span>
        </div>
        <v-menu v-else-if="showRowActions" location="end">
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
      <template v-for="col in booleanColumns" v-slot:[`item.${col}`]="{ item }">
        <v-checkbox-btn :model-value="item[col]" readonly class="d-flex justify-center"></v-checkbox-btn>
      </template>
      <template v-slot:item.ruleChangeLog="{ item }">
        <slot name="item.ruleChangeLog" :item="item"></slot>
      </template>
      <template v-for="(_, name) in $slots" v-slot:[`item.${name}`]="slotData">
        <slot :name="`item.${name}`" v-bind="slotData" />
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
import { Microscope, EllipsisVertical, CircleCheckBig, BanknoteX, Info } from 'lucide-vue-next';

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
  showActionIcons?: boolean;
  actionIcons?: { icon: any; tooltip: string; onClick: (item: any) => void; class?: string; type?: 'approve' | 'reject' | 'info'; }[];
  actionsClass?: string;
  searchPlaceholder?: string;
  showInternalUserActions?: boolean;
  internalUserActionFormatter?: (item: any) => string;
  internalUserActionClickHandler?: (item: any) => void;
  booleanColumns?: string[];
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
  showActionIcons: false,
  actionIcons: () => [],
  actionsClass: 'justify-end',
  searchPlaceholder: 'Search by report name, report type, or keyword',
  showInternalUserActions: false,
  internalUserActionFormatter: (item: any) => '-',
  internalUserActionClickHandler: () => {},
  booleanColumns: () => [],
});

const searchTerm = ref('');
const activeFilters = ref<Pill[]>([]);
const selected = ref<any[]>([]);
const activeFilterPill = ref<Pill | null>(null);

const handleRequestInfo = (item: any) => {
  if (item.status !== 'Approved' && item.status !== 'Rejected') {
    console.log('Request Info:', item);
    // Implement request info logic
  }
};

const getIconStyle = (item: any, iconClass: string) => {
  let iconType: 'approve' | 'reject' | 'info';
  if (iconClass.includes('approve-icon')) {
    iconType = 'approve';
  } else if (iconClass.includes('reject-icon')) {
    iconType = 'reject';
  } else {
    iconType = 'info';
  }

  if (item.status === 'Approved') {
    if (iconType === 'approve') {
      return { color: 'var(--color-approved)' };
    } else {
      return { color: 'var(--color-neutral-disabled)', pointerEvents: 'none' };
    }
  } else if (item.status === 'Rejected') {
    if (iconType === 'reject') {
      return { color: 'var(--color-denied)' };
    } else {
      return { color: 'var(--color-neutral-disabled)', pointerEvents: 'none' };
    }
  }
  return { color: 'var(--color-text-primary)' };
};

const handleApprove = (item: any) => {
  if (item.status !== 'Approved' && item.status !== 'Rejected') {
    console.log('Approve:', item);
    // Implement approve logic
  }
};

const handleReject = (item: any) => {
  if (item.status !== 'Approved' && item.status !== 'Rejected') {
    console.log('Reject:', item);
    // Implement reject logic
  }
};

const processedHeaders = computed(() => 
  props.headers.map(header => ({
    ...header,
    class: 'font-weight-bold',
    align: props.booleanColumns.includes(header.key)
      ? 'center'
      : header.align || (header.key === 'actions' || header.key === 'eocId' || header.key === 'cost' || header.key === 'claimDate' || header.key === 'submissionDate' || header.key === 'approvedDate' ? 'end' : 'start'),
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
    } else if (activeFilterPill.value.type === 'billingType') {
      currentItems = currentItems.filter(item => item.billingType.toLowerCase() === activeFilterPill.value!.value.toLowerCase());
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
  transition: color 0.2s ease;

  &:hover {
    color: $color-primary;
  }
}

.link {
  color: $color-link;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.disabled-icon {
  pointer-events: none;
  cursor: not-allowed;
}
</style>