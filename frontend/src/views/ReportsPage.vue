
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
        :items="tableItems"
        :show-search-bar="false"
        :show-filter-button="false"
        :show-row-actions="true"
        :row-action-items="reportRowActions"
        @row-action="handleReportRowAction"
        :show-filter-pills="false"
        :show-selection-checkboxes="true"
        :default-sort-by="[{ key: 'reportingPeriod', order: 'desc' }]"
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
              placeholder="Account"
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
      <template #filter-reportType>
        <p class="filter-helper-text">Only one report type can be filtered at a time, since each has its own reporting period cadence.</p>
        <Select
          v-model="dialogReportType"
          label="Report Type"
          :items="reportTypeSelectOptions"
          clearable
        />
      </template>
      <template #filter-reportingPeriod>
        <p v-if="!dialogReportType" class="filter-helper-text">Select a report type above to filter by reporting period.</p>
        <div v-if="dialogCadences.includes('quarterly')">
          <p class="filter-helper-text">Quarter Range</p>
          <div class="date-range-row">
            <Select v-model="dialogQuarterFrom" label="From Quarter" :items="quarterOptions" />
            <Select v-model="dialogQuarterFromYear" label="From Year" :items="yearOptions" />
          </div>
          <div class="date-range-row">
            <Select v-model="dialogQuarterTo" label="To Quarter" :items="quarterOptions" />
            <Select v-model="dialogQuarterToYear" label="To Year" :items="yearOptions" />
          </div>
        </div>
        <div v-if="dialogCadences.includes('monthly')">
          <p class="filter-helper-text">Month Range</p>
          <div class="date-range-row">
            <Select v-model="dialogMonthFrom" label="From Month" :items="monthOptions" />
            <Select v-model="dialogMonthFromYear" label="From Year" :items="yearOptions" />
          </div>
          <div class="date-range-row">
            <Select v-model="dialogMonthTo" label="To Month" :items="monthOptions" />
            <Select v-model="dialogMonthToYear" label="To Year" :items="yearOptions" />
          </div>
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
import { SlidersHorizontal, Check, X } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import Select from '@/components/ui/Select.vue';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

const isAdvancedFiltersOpen = ref(false);

// Applied state — what the table actually uses
const appliedAccounts = ref<string[]>([]);
// Report Type is single-select — filtering by reporting period range only makes sense
// against one cadence at a time, so mixing report types would make the range ambiguous.
const appliedReportType = ref('');
const appliedQuarterFrom = ref('');
const appliedQuarterFromYear = ref('');
const appliedQuarterTo = ref('');
const appliedQuarterToYear = ref('');
const appliedMonthFrom = ref('');
const appliedMonthFromYear = ref('');
const appliedMonthTo = ref('');
const appliedMonthToYear = ref('');

// Dialog draft state — only committed when Apply is clicked
const dialogAccounts = ref<string[]>([]);
const dialogReportType = ref('');
const dialogQuarterFrom = ref('');
const dialogQuarterFromYear = ref('');
const dialogQuarterTo = ref('');
const dialogQuarterToYear = ref('');
const dialogMonthFrom = ref('');
const dialogMonthFromYear = ref('');
const dialogMonthTo = ref('');
const dialogMonthToYear = ref('');

const accountSearch = ref('');
const showAccountList = ref(false);

const reportData = ref([
  { id: 1,  accountName: 'Company A', type: 'Quarterly',       startDate: '1/1/2025',  endDate: '3/31/2025' },
  { id: 2,  accountName: 'Company B', type: 'Monthly Value',   startDate: '6/1/2025',  endDate: '6/30/2025' },
  { id: 3,  accountName: 'Company C', type: 'Rebate Summary',  startDate: '10/1/2025', endDate: '12/31/2025' },
  { id: 4,  accountName: 'Company A', type: 'MAC Pricing',     startDate: '4/1/2025',  endDate: '6/30/2025' },
  { id: 5,  accountName: 'Company D', type: 'RxCompass',       startDate: '7/1/2025',  endDate: '9/30/2025' },
  { id: 6,  accountName: 'Company B', type: 'Quarterly',       startDate: '4/1/2025',  endDate: '6/30/2025' },
  { id: 7,  accountName: 'Company E', type: 'Monthly Value',   startDate: '5/1/2025',  endDate: '5/31/2025' },
  { id: 8,  accountName: 'Company C', type: 'Quarterly',       startDate: '4/1/2025',  endDate: '6/30/2025' },
  { id: 9,  accountName: 'Company D', type: 'Rebate Payments', startDate: '10/1/2024', endDate: '12/31/2024' },
  { id: 10, accountName: 'Company E', type: 'MAC Pricing',     startDate: '1/1/2025',  endDate: '3/31/2025' },
  { id: 11, accountName: 'Company A', type: 'Rebate Summary',  startDate: '1/1/2024',  endDate: '3/31/2024' },
  { id: 12, accountName: 'Company B', type: 'Rebate Payments', startDate: '4/1/2025',  endDate: '6/30/2025' },
]);

// Every report type in this prototype is either quarterly or monthly cadence — no annual reports.
const cadenceOf = (type: string): 'quarterly' | 'monthly' => type === 'Monthly Value' ? 'monthly' : 'quarterly';

const formatReportingPeriod = (item: { type: string; startDate: string }): string => {
  const [month, , year] = item.startDate.split('/').map(Number);
  if (cadenceOf(item.type) === 'monthly') {
    return `${String(month).padStart(2, '0')}-${year}`;
  }
  const quarter = Math.floor((month - 1) / 3) + 1;
  return `Q${quarter} ${year}`;
};

const parseReportingPeriod = (period: string): number => {
  const quarterMatch = period.match(/^Q(\d) (\d{4})$/);
  if (quarterMatch) {
    return new Date(Number(quarterMatch[2]), (Number(quarterMatch[1]) - 1) * 3, 1).getTime();
  }
  const monthMatch = period.match(/^(\d{2})-(\d{4})$/);
  if (monthMatch) {
    return new Date(Number(monthMatch[2]), Number(monthMatch[1]) - 1, 1).getTime();
  }
  return 0;
};

const accountOptions = computed(() =>
  [...new Set(reportData.value.map(item => item.accountName))].sort()
);

const reportTypeOptions = computed(() =>
  [...new Set(reportData.value.map(item => item.type))].sort()
);

const reportTypeSelectOptions = computed(() =>
  reportTypeOptions.value.map(type => ({ title: type, value: type }))
);

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
  dialogReportType.value = appliedReportType.value;
  dialogQuarterFrom.value = appliedQuarterFrom.value;
  dialogQuarterFromYear.value = appliedQuarterFromYear.value;
  dialogQuarterTo.value = appliedQuarterTo.value;
  dialogQuarterToYear.value = appliedQuarterToYear.value;
  dialogMonthFrom.value = appliedMonthFrom.value;
  dialogMonthFromYear.value = appliedMonthFromYear.value;
  dialogMonthTo.value = appliedMonthTo.value;
  dialogMonthToYear.value = appliedMonthToYear.value;
  accountSearch.value = '';
  showAccountList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedAccounts.value = [...dialogAccounts.value];
  appliedReportType.value = dialogReportType.value;
  appliedQuarterFrom.value = dialogQuarterFrom.value;
  appliedQuarterFromYear.value = dialogQuarterFromYear.value;
  appliedQuarterTo.value = dialogQuarterTo.value;
  appliedQuarterToYear.value = dialogQuarterToYear.value;
  appliedMonthFrom.value = dialogMonthFrom.value;
  appliedMonthFromYear.value = dialogMonthFromYear.value;
  appliedMonthTo.value = dialogMonthTo.value;
  appliedMonthToYear.value = dialogMonthToYear.value;
  isAdvancedFiltersOpen.value = false;
};

const cancelFilters = () => {
  isAdvancedFiltersOpen.value = false;
};

const reportFilters = reactive<FilterGroup[]>([
  { type: 'account',          label: 'Account',           multiselect: true,  options: [], modelValue: null },
  { type: 'reportType',       label: 'Report Type',       multiselect: false, options: [], modelValue: null },
  { type: 'reportingPeriod',  label: 'Reporting Period',  multiselect: false, options: [], modelValue: null },
]);

// Reporting Period picker only appears once a report type is selected — a quarterly type
// gets a Quarter range picker, a monthly type gets a Month range picker.
const dialogCadences = computed<('quarterly' | 'monthly')[]>(() => {
  if (!dialogReportType.value) return [];
  return [cadenceOf(dialogReportType.value)];
});

const quarterOptions = [
  { title: 'Q1', value: 'Q1' },
  { title: 'Q2', value: 'Q2' },
  { title: 'Q3', value: 'Q3' },
  { title: 'Q4', value: 'Q4' },
];

const monthOptions = [
  { title: 'January', value: '01' }, { title: 'February', value: '02' }, { title: 'March', value: '03' },
  { title: 'April', value: '04' },   { title: 'May', value: '05' },      { title: 'June', value: '06' },
  { title: 'July', value: '07' },    { title: 'August', value: '08' },   { title: 'September', value: '09' },
  { title: 'October', value: '10' }, { title: 'November', value: '11' }, { title: 'December', value: '12' },
];

const yearOptions = computed(() => {
  const years = [...new Set(reportData.value.map(item => Number(item.startDate.split('/')[2])))];
  return years.sort((a, b) => b - a).map(y => ({ title: String(y), value: String(y) }));
});

const parseMDYYYY = (dateStr: string): number => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const activeFilterPills = computed<FilterPill[]>(() => {
  const pills: FilterPill[] = [];
  appliedAccounts.value.forEach(acct => {
    pills.push({ type: 'account', value: acct, label: acct, isActive: true });
  });
  if (appliedReportType.value) {
    pills.push({ type: 'reportType', value: appliedReportType.value, label: appliedReportType.value, isActive: true });
  }
  if (appliedQuarterFrom.value && appliedQuarterFromYear.value && appliedQuarterTo.value && appliedQuarterToYear.value) {
    const from = `${appliedQuarterFrom.value} ${appliedQuarterFromYear.value}`;
    const to = `${appliedQuarterTo.value} ${appliedQuarterToYear.value}`;
    pills.push({ type: 'reportingPeriod', value: 'quarter', label: `Reporting Period: ${from}${from === to ? '' : ` – ${to}`}`, isActive: true });
  }
  if (appliedMonthFrom.value && appliedMonthFromYear.value && appliedMonthTo.value && appliedMonthToYear.value) {
    const fromLabel = monthOptions.find(m => m.value === appliedMonthFrom.value)?.title;
    const toLabel = monthOptions.find(m => m.value === appliedMonthTo.value)?.title;
    const from = `${fromLabel} ${appliedMonthFromYear.value}`;
    const to = `${toLabel} ${appliedMonthToYear.value}`;
    pills.push({ type: 'reportingPeriod', value: 'month', label: `Reporting Period: ${from}${from === to ? '' : ` – ${to}`}`, isActive: true });
  }
  return pills;
});

const handleFilterPillClose = (pill: FilterPill) => {
  if (pill.type === 'account') {
    appliedAccounts.value = appliedAccounts.value.filter(v => v !== pill.value);
  } else if (pill.type === 'reportType') {
    appliedReportType.value = '';
  } else if (pill.type === 'reportingPeriod' && pill.value === 'quarter') {
    appliedQuarterFrom.value = '';
    appliedQuarterFromYear.value = '';
    appliedQuarterTo.value = '';
    appliedQuarterToYear.value = '';
  } else if (pill.type === 'reportingPeriod' && pill.value === 'month') {
    appliedMonthFrom.value = '';
    appliedMonthFromYear.value = '';
    appliedMonthTo.value = '';
    appliedMonthToYear.value = '';
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
  if (appliedReportType.value) {
    items = items.filter(item => item.type === appliedReportType.value);
  }
  if (appliedQuarterFrom.value && appliedQuarterFromYear.value && appliedQuarterTo.value && appliedQuarterToYear.value) {
    const fromTs = parseReportingPeriod(`${appliedQuarterFrom.value} ${appliedQuarterFromYear.value}`);
    const toTs = parseReportingPeriod(`${appliedQuarterTo.value} ${appliedQuarterToYear.value}`);
    items = items.filter(item => {
      if (cadenceOf(item.type) !== 'quarterly') return true;
      const periodTs = parseReportingPeriod(formatReportingPeriod(item));
      return periodTs >= fromTs && periodTs <= toTs;
    });
  }
  if (appliedMonthFrom.value && appliedMonthFromYear.value && appliedMonthTo.value && appliedMonthToYear.value) {
    const fromTs = parseReportingPeriod(`${appliedMonthFrom.value}-${appliedMonthFromYear.value}`);
    const toTs = parseReportingPeriod(`${appliedMonthTo.value}-${appliedMonthToYear.value}`);
    items = items.filter(item => {
      if (cadenceOf(item.type) !== 'monthly') return true;
      const periodTs = parseReportingPeriod(formatReportingPeriod(item));
      return periodTs >= fromTs && periodTs <= toTs;
    });
  }
  return items;
});

const reportHeaders = ref([
  { title: 'Account Name',      key: 'accountName',      minWidth: '160px' },
  { title: 'Type',              key: 'type',              minWidth: '140px' },
  { title: 'Reporting Period',  key: 'reportingPeriod',  minWidth: '140px' },
  { title: '',                  key: 'actions', sortable: false, align: 'end', minWidth: '60px' },
]);

const reportCustomKeySort = {
  reportingPeriod: (a: string, b: string) => parseReportingPeriod(a) - parseReportingPeriod(b),
};

const tableItems = computed(() =>
  filteredReportData.value.map(item => ({ ...item, reportingPeriod: formatReportingPeriod(item) }))
);

const showDownloadSnackbar = ref(false);
const downloadSnackbarText = ref('');

const reportRowActions = [
  { label: 'Download', action: 'download' },
];

const handleReportRowAction = ({ action, item }: { action: string; item: any }) => {
  if (action === 'download') {
    console.log('Download report:', item);
    downloadSnackbarText.value = `${item.accountName} report downloaded successfully!`;
    showDownloadSnackbar.value = true;
  }
};

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

.filter-helper-text {
  font-size: $font-size-small;
  color: $color-text-secondary;
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
