<template>
  <div>
    <h1 class="text-h1 mb-large">Billing</h1>
    <PageCard
      headerText="Statement & Invoice Explorer"
      descriptionText="View and download invoices and statements with ease."
    >
      <div class="search-filter-row">
        <div class="search-bar-wrapper">
          <SearchBar
            @update:searchTerm="billingSearchTerm = $event"
            placeholder="Search by reference number or keyword"
            :showFilterButton="false"
          />
        </div>
        <AdvancedFiltersButton @click="openFilters" />
      </div>
      <FilteringPillsGroup
        v-if="activeFilterPills.length"
        :filters="activeFilterPills"
        :closable="true"
        @close:filter="handleFilterPillClose"
        class="mb-3"
      />
      <Tabs :tabs="billingTabs" @tab-selected="handleTabSelected" />
      <ReportDataTable
        :headers="billingHeaders"
        :items="filteredBillingData"
        :show-search-bar="false"
        :show-filter-button="false"
        :show-row-actions="false"
        :show-filter-pills="false"
        :show-action-icons="true"
        :action-icons="billingActionIcons"
        :default-sort-by="[{ key: 'startDate', order: 'desc' }]"
        :custom-key-sort="billingCustomKeySort"
        :items-per-page="10"
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
          { value: -1, title: 'All' },
        ]"
      >
        <template #empty-state>
          <div class="billing-no-results">No records found</div>
        </template>
      </ReportDataTable>
    </PageCard>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="billingFilters"
      :icon="SlidersHorizontal"
      heading="Billing Filters"
      :actions="advancedFiltersDialogActions"
    >
      <template #filter-account="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div v-if="dialogAccounts.length > 0" class="selected-chips mb-2">
          <v-chip
            v-for="acct in dialogAccounts"
            :key="acct"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ acct }}
            <span class="chip-close ml-1" @click.stop="dialogAccounts = dialogAccounts.filter(a => a !== acct)">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0F285B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </span>
          </v-chip>
        </div>
        <div class="account-picker-wrap">
          <div class="account-search-field" :class="{ 'account-search-field--active': showAccountList }">
            <input
              v-model="accountSearch"
              type="text"
              class="account-search-input"
              placeholder="Search accounts"
              @mousedown="showAccountList = true"
              @blur="handleAccountPickerBlur"
            />
          </div>
          <div v-if="showAccountList" class="account-dropdown">
            <div
              v-for="account in filteredAccountOptions"
              :key="account"
              class="account-option"
              @mousedown.prevent
              @click="toggleAccount(account)"
            >
              <div class="acct-checkbox mr-2" :class="{ active: dialogAccounts.includes(account) }">
                <Check v-if="dialogAccounts.includes(account)" :size="12" :stroke-width="3" />
              </div>
              <span>{{ account }}</span>
            </div>
            <div v-if="filteredAccountOptions.length === 0" class="no-acct-results">
              No accounts found
            </div>
          </div>
        </div>
      </template>
      <template #filter-dateRange>
        <p class="filter-section-label">Date Range</p>
        <div class="date-range-row">
          <DatePicker label="From" v-model="dialogDateFrom" />
          <DatePicker label="To" v-model="dialogDateTo" />
        </div>
      </template>
    </AdvancedFiltersDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { SlidersHorizontal, CloudDownload, Check } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Tabs from '@/components/common/Tabs.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

const billingTabs = [
  { label: 'All', key: 'all' },
  { label: 'Invoice', key: 'Invoice' },
  { label: 'Statement', key: 'Statement' },
];

const selectedTab = ref('all');
const isAdvancedFiltersOpen = ref(false);
const billingSearchTerm = ref('');

// Applied state — what the table actually uses
const appliedAccounts = ref<string[]>([]);
const appliedDateFrom = ref('');
const appliedDateTo = ref('');

// Dialog draft state — only committed when Apply is clicked
const dialogAccounts = ref<string[]>([]);
const dialogDateFrom = ref('');
const dialogDateTo = ref('');

const accountSearch = ref('');
const showAccountList = ref(false);

const filteredAccountOptions = computed(() => {
  const q = accountSearch.value?.toLowerCase() ?? '';
  return accountOptions.value.filter(a => a.toLowerCase().includes(q));
});

const toggleAccount = (account: string) => {
  if (dialogAccounts.value.includes(account)) {
    dialogAccounts.value = dialogAccounts.value.filter(a => a !== account);
  } else {
    dialogAccounts.value = [...dialogAccounts.value, account];
  }
};

const handleAccountPickerBlur = () => {
  setTimeout(() => { showAccountList.value = false; }, 150);
};

const openFilters = () => {
  dialogAccounts.value = [...appliedAccounts.value];
  dialogDateFrom.value = appliedDateFrom.value;
  dialogDateTo.value = appliedDateTo.value;
  accountSearch.value = '';
  showAccountList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedAccounts.value = [...dialogAccounts.value];
  appliedDateFrom.value = dialogDateFrom.value;
  appliedDateTo.value = dialogDateTo.value;
  isAdvancedFiltersOpen.value = false;
};

const cancelFilters = () => {
  isAdvancedFiltersOpen.value = false;
};

const handleTabSelected = (key: string) => {
  selectedTab.value = key;
};

const billingData = ref([
  { accountName: 'Company A', billingType: 'Invoice',   id: 'INV001', detail: 'Monthly Services',  startDate: '6/1/2025',  endDate: '6/30/2025',  amount: '$1,500.00' },
  { accountName: 'Company B', billingType: 'Statement', id: 'STM002', detail: 'Q2 Summary',         startDate: '4/1/2025',  endDate: '6/30/2025',  amount: '$3,200.00' },
  { accountName: 'Company C', billingType: 'Invoice',   id: 'INV003', detail: 'Consulting Fees',    startDate: '7/1/2025',  endDate: '7/31/2025',  amount: '$800.00'   },
  { accountName: 'Company D', billingType: 'Statement', id: 'STM004', detail: 'Annual Report',      startDate: '1/1/2025',  endDate: '12/31/2025', amount: '$5,000.00' },
  { accountName: 'Company E', billingType: 'Invoice',   id: 'INV005', detail: 'Service Adjustment', startDate: '6/1/2025',  endDate: '6/30/2025',  amount: '$250.00'   },
  { accountName: 'Company F', billingType: 'Statement', id: 'STM006', detail: 'Monthly Summary',    startDate: '7/1/2025',  endDate: '7/31/2025',  amount: '$1,100.00' },
  { accountName: 'Company G', billingType: 'Invoice',   id: 'INV007', detail: 'New Client Setup',   startDate: '7/1/2025',  endDate: '7/31/2025',  amount: '$750.00'   },
  { accountName: 'Company H', billingType: 'Statement', id: 'STM008', detail: 'Q1 Review',          startDate: '1/1/2025',  endDate: '3/31/2025',  amount: '$2,900.00' },
  { accountName: 'Company I', billingType: 'Invoice',   id: 'INV009', detail: 'Ad-hoc Request',     startDate: '7/1/2025',  endDate: '7/31/2025',  amount: '$400.00'   },
  { accountName: 'Company J', billingType: 'Statement', id: 'STM010', detail: 'Mid-Year Report',    startDate: '1/1/2025',  endDate: '6/30/2025',  amount: '$4,500.00' },
]);

const accountOptions = computed(() =>
  [...new Set(billingData.value.map(item => item.accountName))].sort()
);

// Passed to AdvancedFiltersDialog only to drive slot iteration — not used for modelValue
const billingFilters = reactive<FilterGroup[]>([
  { type: 'account',   label: 'Account',    multiselect: true,  options: [], modelValue: null },
  { type: 'dateRange', label: 'Date Range', multiselect: false, options: [], modelValue: null },
]);

const formatDateDisplay = (dateStr: string): string => {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  return `${parseInt(parts[0])}/${parseInt(parts[1])}/${parts[2]}`;
};

const activeFilterPills = computed<FilterPill[]>(() => {
  const pills: FilterPill[] = [];
  appliedAccounts.value.forEach(acct => {
    pills.push({ type: 'account', value: acct, label: acct, isActive: true });
  });
  if (appliedDateFrom.value || appliedDateTo.value) {
    const parts = [appliedDateFrom.value, appliedDateTo.value]
      .filter(Boolean)
      .map(formatDateDisplay);
    pills.push({ type: 'dateRange', value: null, label: `Date: ${parts.join(' – ')}`, isActive: true });
  }
  return pills;
});

const handleFilterPillClose = (pill: FilterPill) => {
  if (pill.type === 'account') {
    appliedAccounts.value = appliedAccounts.value.filter(v => v !== pill.value);
  } else if (pill.type === 'dateRange') {
    appliedDateFrom.value = '';
    appliedDateTo.value = '';
  }
};

const filteredBillingData = computed(() => {
  let items = billingData.value;
  if (selectedTab.value !== 'all') {
    items = items.filter(item => item.billingType === selectedTab.value);
  }
  if (billingSearchTerm.value) {
    const q = billingSearchTerm.value.toLowerCase();
    items = items.filter(item =>
      item.id.toLowerCase().includes(q) ||
      item.accountName.toLowerCase().includes(q) ||
      item.detail.toLowerCase().includes(q)
    );
  }
  if (appliedAccounts.value.length > 0) {
    items = items.filter(item => appliedAccounts.value.includes(item.accountName));
  }
  if (appliedDateFrom.value || appliedDateTo.value) {
    const fromTs = appliedDateFrom.value ? parseMDYYYY(appliedDateFrom.value) : 0;
    const toTs   = appliedDateTo.value   ? parseMDYYYY(appliedDateTo.value)   : Infinity;
    items = items.filter(item => {
      const start = parseMDYYYY(item.startDate);
      return start >= fromTs && start <= toTs;
    });
  }
  return items;
});

const billingHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'Report Type', key: 'billingType' },
  { title: 'Reference Number', key: 'id' },
  { title: 'Invoice/Statement Detail', key: 'detail' },
  { title: 'Start Date', key: 'startDate' },
  { title: 'End Date', key: 'endDate' },
  { title: 'Amount', key: 'amount', align: 'end' },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]);

const parseMDYYYY = (dateStr: string): number => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const billingCustomKeySort = {
  startDate: (a: string, b: string) => parseMDYYYY(a) - parseMDYYYY(b),
  endDate:   (a: string, b: string) => parseMDYYYY(a) - parseMDYYYY(b),
};

const billingActionIcons = ref([
  {
    icon: CloudDownload,
    tooltip: 'Download',
    size: 20,
    onClick: (item: any) => console.log('Download item:', item),
  },
]);

const advancedFiltersDialogActions = [
  { text: 'Cancel', type: 'cancel' as const, onClick: cancelFilters },
  { text: 'Apply Filters', type: 'confirm' as const, onClick: applyFilters },
];
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.search-filter-row {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  margin-bottom: $spacing-small;
}

.search-bar-wrapper {
  flex: 1;
}

.billing-no-results {
  text-align: center;
  padding: $spacing-medium;
  color: $color-text-secondary;
  font-size: $font-size-body;
}

.filter-section-label {
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: $spacing-small;
}

.date-range-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-medium;
  margin-bottom: $spacing-small;
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xsmall;
}

.autocomplete-chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.chip-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: $color-neutral-white;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
}

.account-picker-wrap {
  position: relative;
  margin-bottom: $spacing-small;
}

.account-search-field {
  border: 1px solid var(--color-input-border);
  border-radius: 4px;
  background-color: var(--color-input-bg);
  padding: 6px $spacing-small;
  transition: border-color 0.15s;

  &--active,
  &:focus-within {
    border-color: $color-primary;
  }
}

.account-search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: var(--color-text-primary);

  &::placeholder {
    color: $color-neutral-disabled;
  }
}

.account-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.no-acct-results {
  padding: $spacing-small;
  color: $color-text-secondary;
  font-size: $font-size-small;
  text-align: center;
}

.account-option {
  display: flex;
  align-items: center;
  padding: $spacing-xsmall $spacing-small;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}

.acct-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid $color-border;
  border-radius: 3px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background-color: #0F285B !important;
    border-color: #0F285B !important;
    color: $color-neutral-white;
  }
}
</style>
