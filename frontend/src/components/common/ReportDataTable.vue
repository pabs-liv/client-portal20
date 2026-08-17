<template>
  <div class="report-data-table">
    <div class="search-bar-controls" v-if="(showSearchBar && items.length > 0) || $slots['advanced-filter-button']">
      <div v-if="showSearchBar && items.length > 0" class="search-bar-wrapper">
        <SearchBar @update:searchTerm="searchTerm = $event" :showFilterButton="showFilterButton" :placeholder="searchPlaceholder" @click:filter="emit('click:filter')" />
      </div>
      <slot name="advanced-filter-button" />
    </div>
    <slot name="filter-pills" />
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
    <div v-if="showSelectionCheckboxes && selected.length >= 2" class="bulk-action-bar">
      <div class="bulk-action-left">
        <span class="bulk-action-count">{{ selected.length }} selected</span>
        <div class="bulk-action-divider"></div>
        <button v-if="showBulkApprove && bulkActionAvailable(selected)" class="bulk-action-btn" @click="handleBulkApprove">{{ bulkApproveLabel }}</button>
        <button v-if="showBulkReject && bulkActionAvailable(selected)" class="bulk-action-btn" @click="handleBulkReject">{{ bulkRejectLabel }}</button>
        <slot name="bulk-actions-extra" :selected="selected" />
        <button v-if="showBulkDownload" class="bulk-action-btn" @click="handleBulkDownload">Download</button>
      </div>
      <button class="bulk-action-btn" @click="clearSelection">Clear Selection</button>
    </div>
    <v-data-table
      :headers="processedHeaders"
      :items="filteredItems"
      class="my-table"
      :items-per-page="itemsPerPage"
      dense
      :hide-default-footer="!showTableFooter"
      :items-per-page-options="itemsPerPageOptions"
      :items-per-page-props="{ color: 'var(--color-text-primary)' }"
      :show-select="showSelectionCheckboxes"
      :select-strategy="'all'"
      :item-selectable="itemSelectable"
      return-object
      v-model="selected"
      v-model:sort-by="sortByState"
      :custom-key-sort="customKeySort"
      :show-expand="showExpand"
      :item-value="itemValue"
    >
      <template v-if="$slots['expanded-row']" v-slot:expanded-row="slotData">
        <slot name="expanded-row" v-bind="slotData" />
      </template>
      <template v-if="showExpand" v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
        <component
          :is="isExpanded(internalItem) ? ChevronDown : ChevronRight"
          :size="16"
          :stroke-width="1.5"
          class="expand-chevron"
          @click="toggleExpand(internalItem)"
        />
      </template>

      <template v-slot:item.actions="{ item }">
        <div v-if="showActionIcons" class="d-flex align-center" :class="actionsClass">
          <v-tooltip
            v-for="(iconDef, index) in actionIcons"
            :key="index"
            :text="isIconDisabled(item, iconDef) && iconDef.tooltipWhenDisabled ? iconDef.tooltipWhenDisabled : iconDef.tooltip"
          >
            <template v-slot:activator="{ props: tooltipProps }">
              <component
                :is="iconDef.icon"
                v-bind="tooltipProps"
                :size="iconDef.size || 25"
                :stroke-width="1"
                :class="['row-action-icon', iconDef.class, {'mr-2': index < actionIcons.length - 1}, {'disabled-icon': isIconDisabled(item, iconDef)}]"
                :style="{color: (item.status === 'Approved' && iconDef.type === 'approve') ? 'var(--color-approved)' : (item.status === 'Rejected' && iconDef.type === 'reject') ? 'var(--color-denied)' : 'var(--color-text-primary)'}"
                @click="isIconDisabled(item, iconDef) ? undefined : iconDef.onClick(item)"
              />
            </template>
          </v-tooltip>
        </div>
        <div v-else-if="showInternalUserActions" class="d-flex align-center" :class="actionsClass">
          <v-tooltip v-if="internalUserActionFormatter(item) === 'Information Requested'" text="View Assistance Request">
            <template v-slot:activator="{ props: tooltipProps }">
              <CircleHelp
                v-bind="tooltipProps"
                :size="18"
                :stroke-width="1.5"
                class="internal-action-icon"
                @click="internalUserActionClickHandler(item)"
              />
            </template>
          </v-tooltip>
          <span v-else>-</span>
        </div>
        <v-menu v-else-if="showRowActions" location="end">
          <template v-slot:activator="{ props }">
            <EllipsisVertical :stroke-width="1" v-bind="props" class="row-action-icon" />
          </template>
          <v-list>
            <template v-if="rowActionItems.length > 0">
              <v-list-item
                v-for="actionItem in rowActionItems"
                :key="actionItem.action"
                :disabled="rowActionDisabled(item, actionItem)"
                @click="emit('row-action', { action: actionItem.action, item })"
              >
                <v-list-item-title>{{ actionItem.label }}</v-list-item-title>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-item @click="console.log('View item:', item)">
                <v-list-item-title>View</v-list-item-title>
              </v-list-item>
              <v-list-item @click="console.log('Download item:', item)">
                <v-list-item-title>Download</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </template>
      <template v-for="col in booleanColumns" v-slot:[`item.${col}`]="{ item }">
        <v-checkbox-btn :model-value="item[col]" readonly class="d-flex justify-center"></v-checkbox-btn>
      </template>
      <template v-for="col in interactiveBooleanColumns" v-slot:[`item.${col}`]="{ item }">
        <div class="interactive-bool-cell" @click.stop="emit('toggle-cell', { key: col, item })">
          <component
            :is="item[col] ? CheckSquare : Square"
            :size="18"
            :stroke-width="1.5"
            class="interactive-bool-icon"
            :class="{ 'interactive-bool-icon--checked': item[col] }"
          />
        </div>
      </template>
      <template v-slot:item.ruleChangeLog="{ item }">
        <slot name="item.ruleChangeLog" :item="item"></slot>
      </template>
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
      <template v-slot:no-data>
        <slot name="empty-state">
          <div class="empty-state">
            <img :src="EmptyStateImg" alt="No data" class="empty-state-icon" />
            <p class="empty-state-text">{{ emptyStateText }}</p>
          </div>
        </slot>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import SearchBar from '../ui/SearchBar.vue';
import FilteringPill from '../ui/FilteringPill.vue';
import { EllipsisVertical, CircleCheckBig, BanknoteX, Info, ChevronRight, ChevronDown, CheckSquare, Square, CircleHelp } from 'lucide-vue-next';
import EmptyStateImg from '@/assets/EmptyState.svg';

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

interface RowActionItem {
  label: string;
  action: string;
}

interface Props {
  showSearchBar?: boolean;
  showFilterButton?: boolean;
  showFilterPills?: boolean;
  headers: Header[];
  items?: any[];
  showRowActions?: boolean;
  rowActionItems?: RowActionItem[];
  rowActionDisabled?: (item: any, actionItem: RowActionItem) => boolean;
  showBulkApprove?: boolean;
  showBulkReject?: boolean;
  showBulkDownload?: boolean;
  bulkApproveLabel?: string;
  bulkRejectLabel?: string;
  bulkActionAvailable?: (items: any[]) => boolean;
  itemSelectable?: string;
  showTableFooter?: boolean;
  showSelectionCheckboxes?: boolean;
  initialFilterPills?: Pill[];
  showActionIcons?: boolean;
  actionIcons?: { icon: any; tooltip: string; tooltipWhenDisabled?: string; onClick: (item: any) => void; class?: string; type?: 'approve' | 'reject' | 'info'; disabled?: (item: any) => boolean; }[];
  actionsClass?: string;
  searchPlaceholder?: string;
  showInternalUserActions?: boolean;
  internalUserActionFormatter?: (item: any) => string;
  internalUserActionClickHandler?: (item: any) => void;
  booleanColumns?: string[];
  interactiveBooleanColumns?: string[];
  emptyStateText?: string;
  showExpand?: boolean;
  itemValue?: string;
  itemsPerPage?: number;
  itemsPerPageOptions?: { value: number; title: string }[];
  defaultSortBy?: { key: string; order: 'asc' | 'desc' }[];
  customKeySort?: Record<string, (a: any, b: any) => number>;
}

const emit = defineEmits<{
  'row-action': [payload: { action: string; item: any }];
  'toggle-cell': [payload: { key: string; item: any }];
  'click:filter': [];
  'bulk-download': [items: any[]];
  'bulk-approve': [items: any[]];
  'bulk-reject': [items: any[]];
}>();

const props = withDefaults(defineProps<Props>(), {
  showSearchBar: true,
  showFilterButton: true,
  showFilterPills: true,
  items: () => [],
  showRowActions: true,
  rowActionItems: () => [],
  rowActionDisabled: () => false,
  showBulkApprove: false,
  showBulkReject: false,
  showBulkDownload: true,
  bulkApproveLabel: 'Approve',
  bulkRejectLabel: 'Reject',
  bulkActionAvailable: () => true,
  itemSelectable: undefined,
  showTableFooter: true,
  showSelectionCheckboxes: true,
  initialFilterPills: () => [],
  showActionIcons: false,
  actionIcons: () => [],
  actionsClass: 'justify-end',
  searchPlaceholder: 'Search...',
  showInternalUserActions: false,
  internalUserActionFormatter: (item: any) => '-',
  internalUserActionClickHandler: () => {},
  booleanColumns: () => [],
  interactiveBooleanColumns: () => [],
  emptyStateText: 'No data available',
  showExpand: false,
  itemValue: 'id',
  itemsPerPage: 10,
  itemsPerPageOptions: () => [
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
    { value: -1, title: 'All' },
  ],
  defaultSortBy: () => [],
  customKeySort: () => ({}),
});

function isIconDisabled(item: any, iconDef: { type?: 'approve' | 'reject' | 'info'; disabled?: (item: any) => boolean }): boolean {
  if (iconDef.disabled) return iconDef.disabled(item);
  return (item.status === 'Approved' && iconDef.type !== 'approve') || (item.status === 'Rejected' && iconDef.type !== 'reject');
}

const searchTerm = ref('');
const activeFilters = ref<Pill[]>([]);
const selected = ref<any[]>([]);
const activeFilterPill = ref<Pill | null>(null);
const sortByState = ref<{ key: string; order: 'asc' | 'desc' }[]>(
  props.defaultSortBy.length ? [...props.defaultSortBy] : []
);

watch(sortByState, (newVal) => {
  if (newVal.length === 0 && props.defaultSortBy.length > 0) {
    nextTick(() => {
      sortByState.value = [...props.defaultSortBy];
    });
  }
});

const handleBulkDownload = () => {
  // Placeholder — bulk download logic to be connected later. Clears the selection
  // immediately (rather than waiting on a real download to complete) so the bulk
  // action bar disappears the moment "Download" is clicked, matching the fact that
  // there's no real file transfer to wait on in this prototype.
  emit('bulk-download', [...selected.value]);
  console.log('Bulk download triggered for:', selected.value);
  clearSelection();
};

const clearSelection = () => {
  selected.value = [] as any[];
};

const handleBulkApprove = () => {
  emit('bulk-approve', [...selected.value]);
};

const handleBulkReject = () => {
  emit('bulk-reject', [...selected.value]);
};

defineExpose({ clearSelection });

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

const processedHeaders = computed(() => {
  const mapped = props.headers.map(header => ({
    ...header,
    class: 'font-weight-bold',
    align: props.booleanColumns.includes(header.key)
      ? 'center'
      : header.align || (header.key === 'actions' || header.key === 'eocId' || header.key === 'cost' || header.key === 'claimDate' || header.key === 'submissionDate' || header.key === 'approvedDate' ? 'end' : 'start'),
  }));
  if (props.showExpand) {
    mapped.unshift({ key: 'data-table-expand', title: '', class: 'font-weight-bold', align: 'start' });
  }
  return mapped;
});

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

.search-bar-controls {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  margin-bottom: $spacing-medium;
}

.search-bar-wrapper {
  flex: 1;
}

.filter-pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-small;
  margin-bottom: $spacing-medium;
}

.bulk-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $color-primary-dark;
  color: $color-neutral-white;
  padding: $spacing-small $spacing-medium;
  border-radius: 8px;
  margin-bottom: $spacing-small;
}

.bulk-action-left {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
}

.bulk-action-count {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  white-space: nowrap;
}

.bulk-action-divider {
  width: 1px;
  height: 18px;
  background-color: rgba(255, 255, 255, 0.4);
}

.bulk-action-btn,
:slotted(.bulk-action-btn) {
  background: transparent;
  border: 1px solid $color-neutral-white;
  color: $color-neutral-white;
  padding: 4px $spacing-small;
  border-radius: 100px;
  font-size: $font-size-body;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

.interactive-bool-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;

  &:hover { background-color: rgba($color-primary, 0.06); }
}

.interactive-bool-icon {
  color: $color-text-secondary;
  flex-shrink: 0;

  &--checked { color: $color-primary; }
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

.my-table :deep(.v-data-table__th--sortable .v-data-table-header__sort-icon) {
  opacity: 0.35 !important;
}

.my-table :deep(.v-data-table__th--sorted .v-data-table-header__sort-icon) {
  opacity: 1 !important;
}

.my-table :deep(.v-data-table-footer) {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid $color-border;
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
}

.my-table :deep(.v-data-table-footer__items-per-page) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.my-table :deep(.v-data-table-footer__items-per-page) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.my-table :deep(.v-data-table-footer__pagination) {
  order: 2;
  margin-left: auto;
}

.my-table :deep(.v-data-table-footer__info) {
  order: 3;
}

.my-table :deep(.v-data-footer .v-icon) {
  color: $color-text-primary !important;
  opacity: 1 !important;
}

.my-table :deep(.v-selection-control__input input) {
  opacity: 1 !important;
  width: 16px !important;
  accent-color: #0F285B;
}

// Force Vuetify's theme primary CSS variable to our navy within the table
// so checkbox icons (which use rgb(var(--v-theme-primary))) resolve correctly.
.my-table {
  --v-theme-primary: 15 40 91;
}

.my-table :deep(.v-selection-control__wrapper) {
  color: $color-primary !important;
  opacity: 1 !important;
}

.my-table :deep(.v-selection-control__ripple) {
  color: $color-primary !important;
}

.my-table :deep(.v-checkbox .v-icon),
.my-table :deep(.v-checkbox-btn .v-icon) {
  color: $color-primary !important;
  opacity: 1 !important;
}

.my-table :deep(.v-checkbox .v-selection-control__off-icon),
.my-table :deep(.v-checkbox-btn .v-selection-control__off-icon) {
  color: $color-border !important;
  opacity: 1 !important;
}

.my-table :deep(.v-checkbox .v-selection-control__on-icon),
.my-table :deep(.v-checkbox-btn .v-selection-control__on-icon) {
  color: $color-primary !important;
  opacity: 1 !important;
}

.expand-chevron {
  cursor: pointer;
  color: $color-text-secondary;
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
  width: 160px;
  margin-bottom: $spacing-small;
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

.internal-action-icon {
  color: $color-link;
  cursor: pointer;
}

.disabled-icon {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>