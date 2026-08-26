
<template>
  <div>
    <h1 class="text-h1 mb-large">Reports</h1>
    <PageCard
      headerText="Report Explorer"
      descriptionText="Browse and download reports by type and reporting period."
    >
      <div class="search-filter-row">
        <div class="search-bar-wrapper">
          <SearchBar
            @update:searchTerm="reportSearchTerm = $event"
            placeholder="Search by account name"
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
        class="filter-pills"
      />
      <ReportDataTable
        :headers="reportHeaders"
        :items="filteredReportData"
        :show-search-bar="false"
        :show-filter-button="false"
        :show-row-actions="false"
        :show-filter-pills="false"
        :show-action-icons="true"
        :action-icons="reportActionIcons"
        :show-selection-checkboxes="true"
        :default-sort-by="[{ key: 'startDate', order: 'desc' }]"
        :custom-key-sort="reportCustomKeySort"
        :items-per-page="10"
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]"
        @bulk-download="handleBulkDownload"
      >
        <template #empty-state>
          <div class="reports-no-results">No reports found</div>
        </template>
      </ReportDataTable>
    </PageCard>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="reportFilters"
      :icon="SlidersHorizontal"
      heading="Report Filters"
      :actions="advancedFiltersDialogActions"
    >
      <template #filter-account="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div v-if="dialogAccounts.length > 0" class="selected-chips">
          <v-chip
            v-for="acct in dialogAccounts"
            :key="acct"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ acct }}
            <span class="chip-close" @click.stop="dialogAccounts = dialogAccounts.filter(a => a !== acct)">
              <X :size="8" :stroke-width="3" />
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
              <div class="acct-checkbox" :class="{ active: dialogAccounts.includes(account) }">
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
      <template #filter-reportType="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div v-if="dialogReportTypes.length > 0" class="selected-chips">
          <v-chip
            v-for="type in dialogReportTypes"
            :key="type"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ type }}
            <span class="chip-close" @click.stop="dialogReportTypes = dialogReportTypes.filter(t => t !== type)">
              <X :size="8" :stroke-width="3" />
            </span>
          </v-chip>
        </div>
        <div class="account-picker-wrap">
          <div class="account-search-field" :class="{ 'account-search-field--active': showReportTypeList }">
            <input
              v-model="reportTypeSearch"
              type="text"
              class="account-search-input"
              placeholder="Search report types"
              @mousedown="showReportTypeList = true"
              @blur="handleReportTypePickerBlur"
            />
          </div>
          <div v-if="showReportTypeList" class="account-dropdown">
            <div
              v-for="type in filteredReportTypeOptions"
              :key="type"
              class="account-option"
              @mousedown.prevent
              @click="toggleReportType(type)"
            >
              <div class="acct-checkbox" :class="{ active: dialogReportTypes.includes(type) }">
                <Check v-if="dialogReportTypes.includes(type)" :size="12" :stroke-width="3" />
              </div>
              <span>{{ type }}</span>
            </div>
            <div v-if="filteredReportTypeOptions.length === 0" class="no-acct-results">
              No report types found
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

    <v-snackbar v-model="showDownloadSnackbar" :timeout="3000" color="success">
      {{ downloadSnackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { SlidersHorizontal, CloudDownload, Check, X } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

const isAdvancedFiltersOpen = ref(false);

// Applied state — what the table actually uses
const appliedAccounts = ref<string[]>([]);
const appliedReportTypes = ref<string[]>([]);
const appliedDateFrom = ref('');
const appliedDateTo = ref('');

// Dialog draft state — only committed when Apply is clicked
const dialogAccounts = ref<string[]>([]);
const dialogReportTypes = ref<string[]>([]);
const dialogDateFrom = ref('');
const dialogDateTo = ref('');

const accountSearch = ref('');
const showAccountList = ref(false);
const reportTypeSearch = ref('');
const showReportTypeList = ref(false);

const reportData = ref([
  { id: 1,  accountName: 'Company A', type: 'Quarterly',       startDate: '1/1/2025',  endDate: '3/31/2025' },
  { id: 2,  accountName: 'Company B', type: 'Monthly Value',   startDate: '6/1/2025',  endDate: '6/30/2025' },
  { id: 3,  accountName: 'Company C', type: 'Rebate Summary',  startDate: '1/1/2025',  endDate: '12/31/2025' },
  { id: 4,  accountName: 'Company A', type: 'MAC Pricing',     startDate: '4/1/2025',  endDate: '6/30/2025' },
  { id: 5,  accountName: 'Company D', type: 'RxCompass',       startDate: '7/1/2025',  endDate: '9/30/2025' },
  { id: 6,  accountName: 'Company B', type: 'Quarterly',       startDate: '4/1/2025',  endDate: '6/30/2025' },
  { id: 7,  accountName: 'Company E', type: 'Monthly Value',   startDate: '5/1/2025',  endDate: '5/31/2025' },
  { id: 8,  accountName: 'Company C', type: 'Quarterly',       startDate: '4/1/2025',  endDate: '6/30/2025' },
  { id: 9,  accountName: 'Company D', type: 'Rebate Payments', startDate: '1/1/2024',  endDate: '12/31/2024' },
  { id: 10, accountName: 'Company E', type: 'MAC Pricing',     startDate: '1/1/2025',  endDate: '3/31/2025' },
  { id: 11, accountName: 'Company A', type: 'Rebate Summary',  startDate: '1/1/2024',  endDate: '12/31/2024' },
  { id: 12, accountName: 'Company B', type: 'Rebate Payments', startDate: '1/1/2025',  endDate: '12/31/2025' },
]);

const accountOptions = computed(() =>
  [...new Set(reportData.value.map(item => item.accountName))].sort()
);

const reportTypeOptions = computed(() =>
  [...new Set(reportData.value.map(item => item.type))].sort()
);

const filteredAccountOptions = computed(() => {
  const q = accountSearch.value?.toLowerCase() ?? '';
  return accountOptions.value.filter(a => a.toLowerCase().includes(q));
});

const filteredReportTypeOptions = computed(() => {
  const q = reportTypeSearch.value?.toLowerCase() ?? '';
  return reportTypeOptions.value.filter(t => t.toLowerCase().includes(q));
});

const toggleAccount = (account: string) => {
  if (dialogAccounts.value.includes(account)) {
    dialogAccounts.value = dialogAccounts.value.filter(a => a !== account);
  } else {
    dialogAccounts.value = [...dialogAccounts.value, account];
  }
};

const toggleReportType = (type: string) => {
  if (dialogReportTypes.value.includes(type)) {
    dialogReportTypes.value = dialogReportTypes.value.filter(t => t !== type);
  } else {
    dialogReportTypes.value = [...dialogReportTypes.value, type];
  }
};

const handleAccountPickerBlur = () => {
  setTimeout(() => { showAccountList.value = false; }, 150);
};

const handleReportTypePickerBlur = () => {
  setTimeout(() => { showReportTypeList.value = false; }, 150);
};

const openFilters = () => {
  dialogAccounts.value = [...appliedAccounts.value];
  dialogReportTypes.value = [...appliedReportTypes.value];
  dialogDateFrom.value = appliedDateFrom.value;
  dialogDateTo.value = appliedDateTo.value;
  accountSearch.value = '';
  reportTypeSearch.value = '';
  showAccountList.value = false;
  showReportTypeList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedAccounts.value = [...dialogAccounts.value];
  appliedReportTypes.value = [...dialogReportTypes.value];
  appliedDateFrom.value = dialogDateFrom.value;
  appliedDateTo.value = dialogDateTo.value;
  isAdvancedFiltersOpen.value = false;
};

const cancelFilters = () => {
  isAdvancedFiltersOpen.value = false;
};

const reportFilters = reactive<FilterGroup[]>([
  { type: 'account',        label: 'Account',          multiselect: true,  options: [], modelValue: null },
  { type: 'reportType',     label: 'Report Type',      multiselect: true,  options: [], modelValue: null },
  { type: 'dateRange',      label: 'Date Range',       multiselect: false, options: [], modelValue: null },
]);

const parseMDYYYY = (dateStr: string): number => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

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
  appliedReportTypes.value.forEach(type => {
    pills.push({ type: 'reportType', value: type, label: type, isActive: true });
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
  } else if (pill.type === 'reportType') {
    appliedReportTypes.value = appliedReportTypes.value.filter(v => v !== pill.value);
  } else if (pill.type === 'dateRange') {
    appliedDateFrom.value = '';
    appliedDateTo.value = '';
  }
};

const reportSearchTerm = ref('');

const filteredReportData = computed(() => {
  let items = reportData.value;
  if (reportSearchTerm.value) {
    const q = reportSearchTerm.value.toLowerCase();
    items = items.filter(item => item.accountName.toLowerCase().includes(q));
  }
  if (appliedAccounts.value.length > 0) {
    items = items.filter(item => appliedAccounts.value.includes(item.accountName));
  }
  if (appliedReportTypes.value.length > 0) {
    items = items.filter(item => appliedReportTypes.value.includes(item.type));
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

const reportHeaders = ref([
  { title: 'Account Name',  key: 'accountName',  minWidth: '160px' },
  { title: 'Type',          key: 'type',          minWidth: '140px' },
  { title: 'Start Date',    key: 'startDate',     minWidth: '120px' },
  { title: 'End Date',      key: 'endDate',       minWidth: '120px' },
  { title: '',              key: 'actions', sortable: false, align: 'end', minWidth: '60px' },
]);

const reportCustomKeySort = {
  startDate:    (a: string, b: string) => parseMDYYYY(a) - parseMDYYYY(b),
  endDate:      (a: string, b: string) => parseMDYYYY(a) - parseMDYYYY(b),
};

const showDownloadSnackbar = ref(false);
const downloadSnackbarText = ref('');

const reportActionIcons = ref([
  {
    icon: CloudDownload,
    tooltip: 'Download',
    size: 20,
    onClick: (item: any) => {
      console.log('Download report:', item);
      downloadSnackbarText.value = `${item.accountName} report downloaded successfully!`;
      showDownloadSnackbar.value = true;
    },
  },
]);

const handleBulkDownload = (items: any[]) => {
  console.log('bulk downloaded', items);
  downloadSnackbarText.value = items.length === 1
    ? `${items[0].accountName} report downloaded successfully!`
    : `${items.length} reports downloaded successfully!`;
  showDownloadSnackbar.value = true;
};

const advancedFiltersDialogActions = [
  { text: 'Cancel',         type: 'cancel'  as const, onClick: cancelFilters },
  { text: 'Apply Filters',  type: 'confirm' as const, onClick: applyFilters  },
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

.reports-no-results {
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

.filter-pills {
  margin-top: $spacing-xsmall;
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xsmall;
  margin-bottom: $spacing-xsmall;
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
  color: $color-primary;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.9;
  margin-left: $spacing-nano;

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
  font-size: $font-size-body;
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
}

html:not(.dark) .account-option:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

html.dark .account-option:hover {
  background-color: rgba(255, 255, 255, 0.08);
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
  margin-right: $spacing-xsmall;

  &.active {
    background-color: $color-primary !important;
    border-color: $color-primary !important;
    color: $color-neutral-white;
  }
}

</style>
