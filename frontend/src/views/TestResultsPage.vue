<template>
  <div>
    <h1 class="text-h1 mb-large">Test Results</h1>
    <div class="widgets-container mb-large">
      <SummaryWidget
        title="Total Reports for This Period"
        :count="totalReports"
        description="All test reports available"
        icon-background-color="rgba(44, 130, 203, 0.2)"
        icon-color="#2C82CB"
        :show-icon="true"
        :icon="FileText"
        :clickable="false"
      />
      <SummaryWidget
        title="Reports Pending Approval"
        :count="pendingReports"
        description="Test reports awaiting your review"
        icon-background-color="rgba(253, 214, 113, 0.2)"
        icon-color="#FBBA13"
        :show-icon="true"
        :icon="Hourglass"
        :clickable="false"
      />
    </div>
    <PageCard
      headerText="Test Results"
      descriptionText="Review and manage test report results from plan design configurations."
    >
      <div class="global-controls">
        <AdvancedFiltersButton @click="openFilters" />
        <FilteringPillsGroup
          v-if="activeFilterPills.length"
          :filters="activeFilterPills"
          :closable="true"
          @close:filter="handleFilterPillClose"
          class="filter-pills"
        />
      </div>
      <ReportDataTable
        ref="testResultsTable"
        :headers="processedTestResultsHeaders"
        :items="filteredTestResultsData"
        :show-search-bar="false"
        :show-filter-button="false"
        :show-filter-pills="false"
        :show-selection-checkboxes="true"
        :show-row-actions="true"
        :row-action-items="rowActionItems"
        :row-action-disabled="isRowActionDisabled"
        :show-bulk-approve="true"
        :show-bulk-reject="true"
        :bulk-action-available="isBulkActionAvailable"
        @row-action="handleRowAction"
        @bulk-approve="handleBulkApprove"
        @bulk-reject="handleBulkReject"
        @bulk-download="handleBulkDownload"
      >
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'error' : 'warning'"
            variant="tonal"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>
      </ReportDataTable>
    </PageCard>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="testResultFilters"
      :icon="SlidersHorizontal"
      heading="Test Result Filters"
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
              <X :size="12" />
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
      <template #filter-dateRange>
        <p class="filter-section-label">{{ dateRangeFilter?.label }}</p>
        <div class="date-range-row">
          <DatePicker label="From" v-model="dialogTestDateFrom" />
          <DatePicker label="To" v-model="dialogTestDateTo" />
        </div>
      </template>
      <template #filter-approvedBy="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div v-if="dialogApprovedBy.length > 0" class="selected-chips">
          <v-chip
            v-for="person in dialogApprovedBy"
            :key="person"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ person }}
            <span class="chip-close" @click.stop="dialogApprovedBy = dialogApprovedBy.filter(p => p !== person)">
              <X :size="12" />
            </span>
          </v-chip>
        </div>
        <div class="account-picker-wrap">
          <div class="account-search-field" :class="{ 'account-search-field--active': showApprovedByList }">
            <input
              v-model="approvedBySearch"
              type="text"
              class="account-search-input"
              placeholder="Search reviewers"
              @mousedown="showApprovedByList = true"
              @blur="handleApprovedByPickerBlur"
            />
          </div>
          <div v-if="showApprovedByList" class="account-dropdown">
            <div
              v-for="person in filteredApprovedByOptions"
              :key="person"
              class="account-option"
              @mousedown.prevent
              @click="toggleApprovedBy(person)"
            >
              <div class="acct-checkbox" :class="{ active: dialogApprovedBy.includes(person) }">
                <Check v-if="dialogApprovedBy.includes(person)" :size="12" :stroke-width="3" />
              </div>
              <span>{{ person }}</span>
            </div>
            <div v-if="filteredApprovedByOptions.length === 0" class="no-acct-results">
              No reviewers found
            </div>
          </div>
        </div>
      </template>
      <template #filter-approvedDateRange="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div class="date-range-row">
          <DatePicker label="From" v-model="dialogApprovedDateFrom" />
          <DatePicker label="To" v-model="dialogApprovedDateTo" />
        </div>
      </template>
      <template #filter-status="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div>
          <div
            v-for="opt in filter.options"
            :key="String(opt.value)"
            class="account-option"
            @click="toggleDialogStatus(opt.value as string)"
          >
            <div class="acct-checkbox" :class="{ active: dialogStatuses.includes(opt.value as string) }">
              <Check v-if="dialogStatuses.includes(opt.value as string)" :size="12" :stroke-width="3" />
            </div>
            <span>{{ opt.text }}</span>
          </div>
        </div>
      </template>
    </AdvancedFiltersDialog>

    <Dialog
      :model-value="showApproveDialog"
      @update:model-value="showApproveDialog = $event"
      :icon="CircleCheckBig"
      heading="Approve Test Result"
      :text="`Are you sure you want to approve the test result for ${selectedTestResult?.accountName}?`"
      :actions="approveDialogActions"
    />

    <Dialog
      :model-value="showRejectDialog"
      @update:model-value="showRejectDialog = $event"
      :icon="BanknoteX"
      heading="Reject Test Result"
      :text="`Are you sure you want to reject the test result for ${selectedTestResult?.accountName}?`"
      :actions="rejectDialogActions"
    />


    <Dialog
      :model-value="showBulkApproveDialog"
      @update:model-value="showBulkApproveDialog = $event"
      :icon="CircleCheckBig"
      heading="Approve Test Results"
      :text="bulkDialogText('approve')"
      :actions="bulkApproveDialogActions"
    />

    <Dialog
      :model-value="showBulkRejectDialog"
      @update:model-value="showBulkRejectDialog = $event"
      :icon="BanknoteX"
      heading="Reject Test Results"
      :text="bulkDialogText('reject')"
      :actions="bulkRejectDialogActions"
    />

    <v-snackbar v-model="showDownloadSnackbar" :timeout="3000" color="success">
      {{ downloadSnackbarText }}
    </v-snackbar>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Dialog from '@/components/ui/Dialog.vue';
import SummaryWidget from '@/components/common/SummaryWidget.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import { CircleCheckBig, BanknoteX, FileText, Hourglass, SlidersHorizontal, Check, X } from 'lucide-vue-next';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

const testResultsTable = ref<InstanceType<typeof ReportDataTable> | null>(null);

const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const showBulkApproveDialog = ref(false);
const showBulkRejectDialog = ref(false);
const selectedTestResult = ref<any>(null);
const bulkSelectedItems = ref<any[]>([]);

const showDownloadSnackbar = ref(false);
const downloadSnackbarText = ref('');

const isAdvancedFiltersOpen = ref(false);

// Applied state — what the table actually uses
const appliedAccounts = ref<string[]>([]);
const appliedTestDateFrom = ref('');
const appliedTestDateTo = ref('');
const appliedApprovedBy = ref<string[]>([]);
const appliedApprovedDateFrom = ref('');
const appliedApprovedDateTo = ref('');
const appliedStatuses = ref<string[]>([]);

// Dialog draft state — only committed when Apply is clicked
const dialogAccounts = ref<string[]>([]);
const dialogTestDateFrom = ref('');
const dialogTestDateTo = ref('');
const dialogApprovedBy = ref<string[]>([]);
const dialogApprovedDateFrom = ref('');
const dialogApprovedDateTo = ref('');
const dialogStatuses = ref<string[]>([]);

const toggleDialogStatus = (value: string) => {
  dialogStatuses.value = dialogStatuses.value.includes(value)
    ? dialogStatuses.value.filter(v => v !== value)
    : [...dialogStatuses.value, value];
};

const accountSearch = ref('');
const showAccountList = ref(false);
const approvedBySearch = ref('');
const showApprovedByList = ref(false);

const handleApproveClick = (item: any) => {
  selectedTestResult.value = item;
  showApproveDialog.value = true;
};

const handleRejectClick = (item: any) => {
  selectedTestResult.value = item;
  showRejectDialog.value = true;
};

const handleDownloadClick = (item: any) => {
  console.log('downloaded', item);
  downloadSnackbarText.value = `Test result for ${item.accountName} downloaded successfully!`;
  showDownloadSnackbar.value = true;
};

const rowActionItems = [
  { label: 'Approve', action: 'approve' },
  { label: 'Reject', action: 'reject' },
  { label: 'Download', action: 'download' },
];

const isRowActionDisabled = (item: any, actionItem: { action: string }) => {
  if (actionItem.action === 'approve' || actionItem.action === 'reject') {
    return item.status !== 'Pending';
  }
  return false;
};

const isBulkActionAvailable = (items: any[]) => items.some((item) => item.status === 'Pending');

const handleRowAction = ({ action, item }: { action: string; item: any }) => {
  if (action === 'approve') handleApproveClick(item);
  else if (action === 'reject') handleRejectClick(item);
  else if (action === 'download') handleDownloadClick(item);
};

const approveDialogActions = [
  { text: 'Cancel', onClick: () => (showApproveDialog.value = false), variant: 'text' as const },
  { text: 'Approve', onClick: () => { console.log('approved', selectedTestResult.value); showApproveDialog.value = false; }, color: 'primary', variant: 'flat' as const }
];

const rejectDialogActions = [
  { text: 'Cancel', onClick: () => (showRejectDialog.value = false), variant: 'text' as const },
  { text: 'Reject', onClick: () => { console.log('rejected', selectedTestResult.value); showRejectDialog.value = false; }, color: 'error', variant: 'flat' as const, type: 'destructive' as const }
];

const bulkDialogText = (type: 'approve' | 'reject') => {
  const count = bulkSelectedItems.value.filter((item) => item.status === 'Pending').length;
  const isBulk = count !== 1;
  return `Are you sure you want to ${type} ${count} test result${isBulk ? 's' : ''}?`;
};

const handleBulkApprove = (items: any[]) => {
  bulkSelectedItems.value = items;
  showBulkApproveDialog.value = true;
};

const handleBulkReject = (items: any[]) => {
  bulkSelectedItems.value = items;
  showBulkRejectDialog.value = true;
};

const handleBulkDownload = (items: any[]) => {
  console.log('bulk downloaded', items);
  downloadSnackbarText.value = items.length === 1
    ? `Test result for ${items[0].accountName} downloaded successfully!`
    : `${items.length} test results downloaded successfully!`;
  showDownloadSnackbar.value = true;
};

const bulkApproveDialogActions = [
  { text: 'Cancel', onClick: () => (showBulkApproveDialog.value = false), variant: 'text' as const },
  {
    text: 'Approve',
    color: 'primary',
    variant: 'flat' as const,
    onClick: () => {
      console.log('bulk approved', bulkSelectedItems.value);
      showBulkApproveDialog.value = false;
      testResultsTable.value?.clearSelection();
    },
  },
];

const bulkRejectDialogActions = [
  { text: 'Cancel', onClick: () => (showBulkRejectDialog.value = false), variant: 'text' as const },
  {
    text: 'Reject',
    color: 'error',
    variant: 'flat' as const,
    type: 'destructive' as const,
    onClick: () => {
      console.log('bulk rejected', bulkSelectedItems.value);
      showBulkRejectDialog.value = false;
      testResultsTable.value?.clearSelection();
    },
  },
];

const testResultsHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'Report Type', key: 'reportType' },
  { title: 'Start Date', key: 'testStartDate' },
  { title: 'End Date', key: 'testEndDate' },
  { title: 'Status', key: 'status' },
  { title: 'Reviewed By', key: 'approvedBy' },
  { title: 'Review Date', key: 'approvedDate', align: 'start' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]);

const processedTestResultsHeaders = computed(() => testResultsHeaders.value);

const testResultsData = ref([
  { id: 1,  accountName: 'Company A', reportType: 'Configuration',  testStartDate: '1/1/2025',  testEndDate: '12/31/2025', status: 'Approved', approvedBy: 'John Doe',   approvedDate: '7/20/2025' },
  { id: 2,  accountName: 'Company B', reportType: 'Formulary',      testStartDate: '1/1/2025',  testEndDate: '3/31/2025',  status: 'Pending',  approvedBy: '-',           approvedDate: '-' },
  { id: 3,  accountName: 'Company C', reportType: 'Benefit Design', testStartDate: '7/1/2025',  testEndDate: '7/31/2025',  status: 'Rejected', approvedBy: 'Jane Smith', approvedDate: '7/21/2025' },
  { id: 4,  accountName: 'Company D', reportType: 'Configuration',  testStartDate: '1/1/2025',  testEndDate: '12/31/2025', status: 'Approved', approvedBy: 'John Doe',   approvedDate: '7/22/2025' },
  { id: 5,  accountName: 'Company E', reportType: 'Formulary',      testStartDate: '4/1/2025',  testEndDate: '6/30/2025',  status: 'Pending',  approvedBy: '-',           approvedDate: '-' },
  { id: 6,  accountName: 'Company F', reportType: 'Benefit Design', testStartDate: '1/1/2025',  testEndDate: '6/30/2025',  status: 'Rejected', approvedBy: 'Jane Smith', approvedDate: '7/23/2025' },
  { id: 7,  accountName: 'Company G', reportType: 'Configuration',  testStartDate: '7/15/2025', testEndDate: '7/20/2025',  status: 'Approved', approvedBy: 'John Doe',   approvedDate: '7/24/2025' },
  { id: 8,  accountName: 'Company H', reportType: 'Formulary',      testStartDate: '7/1/2025',  testEndDate: '9/30/2025',  status: 'Pending',  approvedBy: '-',           approvedDate: '-' },
  { id: 9,  accountName: 'Company I', reportType: 'Benefit Design', testStartDate: '8/1/2025',  testEndDate: '8/31/2025',  status: 'Rejected', approvedBy: 'Jane Smith', approvedDate: '7/25/2025' },
  { id: 10, accountName: 'Company J', reportType: 'Configuration',  testStartDate: '7/1/2025',  testEndDate: '7/5/2025',   status: 'Approved', approvedBy: 'John Doe',   approvedDate: '7/26/2025' },
]);

const accountOptions = computed(() =>
  [...new Set(testResultsData.value.map(item => item.accountName))].sort()
);

const approvedByOptions = computed(() =>
  [...new Set(testResultsData.value.map(item => item.approvedBy).filter(v => v !== '-'))].sort()
);

const filteredAccountOptions = computed(() => {
  const q = accountSearch.value?.toLowerCase() ?? '';
  return accountOptions.value.filter(a => a.toLowerCase().includes(q));
});

const filteredApprovedByOptions = computed(() => {
  const q = approvedBySearch.value?.toLowerCase() ?? '';
  return approvedByOptions.value.filter(a => a.toLowerCase().includes(q));
});

const toggleAccount = (account: string) => {
  dialogAccounts.value = dialogAccounts.value.includes(account)
    ? dialogAccounts.value.filter(a => a !== account)
    : [...dialogAccounts.value, account];
};

const toggleApprovedBy = (person: string) => {
  dialogApprovedBy.value = dialogApprovedBy.value.includes(person)
    ? dialogApprovedBy.value.filter(p => p !== person)
    : [...dialogApprovedBy.value, person];
};

const handleAccountPickerBlur = () => {
  setTimeout(() => { showAccountList.value = false; }, 150);
};

const handleApprovedByPickerBlur = () => {
  setTimeout(() => { showApprovedByList.value = false; }, 150);
};

const testResultStatusOptions = [
  { text: 'Pending', value: 'Pending', active: false },
  { text: 'Approved', value: 'Approved', active: false },
  { text: 'Rejected', value: 'Rejected', active: false },
];

// Status is always last in the filter list, for consistency across pages.
const testResultFilters = computed<FilterGroup[]>(() => [
  { type: 'account', label: 'Account', multiselect: true, options: [], modelValue: null },
  { type: 'dateRange', label: 'Test Date Range', multiselect: false, options: [], modelValue: null },
  { type: 'approvedBy', label: 'Reviewed By', multiselect: true, options: [], modelValue: null },
  { type: 'approvedDateRange', label: 'Review Date Range', multiselect: false, options: [], modelValue: null },
  { type: 'status', label: 'Status', multiselect: true, options: testResultStatusOptions, modelValue: null },
]);

const dateRangeFilter = computed(() => testResultFilters.value.find(f => f.type === 'dateRange'));

const openFilters = () => {
  dialogAccounts.value = [...appliedAccounts.value];
  dialogTestDateFrom.value = appliedTestDateFrom.value;
  dialogTestDateTo.value = appliedTestDateTo.value;
  dialogApprovedBy.value = [...appliedApprovedBy.value];
  dialogApprovedDateFrom.value = appliedApprovedDateFrom.value;
  dialogApprovedDateTo.value = appliedApprovedDateTo.value;
  dialogStatuses.value = [...appliedStatuses.value];
  accountSearch.value = '';
  showAccountList.value = false;
  approvedBySearch.value = '';
  showApprovedByList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedAccounts.value = [...dialogAccounts.value];
  appliedTestDateFrom.value = dialogTestDateFrom.value;
  appliedTestDateTo.value = dialogTestDateTo.value;
  appliedApprovedBy.value = [...dialogApprovedBy.value];
  appliedApprovedDateFrom.value = dialogApprovedDateFrom.value;
  appliedApprovedDateTo.value = dialogApprovedDateTo.value;
  appliedStatuses.value = [...dialogStatuses.value];
  isAdvancedFiltersOpen.value = false;
};

const cancelFilters = () => {
  isAdvancedFiltersOpen.value = false;
};

const advancedFiltersDialogActions = [
  { text: 'Cancel', type: 'cancel' as const, onClick: cancelFilters },
  { text: 'Apply Filters', type: 'confirm' as const, onClick: applyFilters },
];

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
  if (appliedTestDateFrom.value || appliedTestDateTo.value) {
    const parts = [appliedTestDateFrom.value, appliedTestDateTo.value].filter(Boolean).map(formatDateDisplay);
    pills.push({ type: 'dateRange', value: null, label: `Test Date: ${parts.join(' – ')}`, isActive: true });
  }
  appliedApprovedBy.value.forEach(person => {
    pills.push({ type: 'approvedBy', value: person, label: person, isActive: true });
  });
  if (appliedApprovedDateFrom.value || appliedApprovedDateTo.value) {
    const parts = [appliedApprovedDateFrom.value, appliedApprovedDateTo.value].filter(Boolean).map(formatDateDisplay);
    pills.push({ type: 'approvedDateRange', value: null, label: `Review Date: ${parts.join(' – ')}`, isActive: true });
  }
  appliedStatuses.value.forEach(status => {
    pills.push({ type: 'status', value: status, label: status, isActive: true });
  });
  return pills;
});

const handleFilterPillClose = (pill: FilterPill) => {
  if (pill.type === 'account') {
    appliedAccounts.value = appliedAccounts.value.filter(v => v !== pill.value);
  } else if (pill.type === 'dateRange') {
    appliedTestDateFrom.value = '';
    appliedTestDateTo.value = '';
  } else if (pill.type === 'approvedBy') {
    appliedApprovedBy.value = appliedApprovedBy.value.filter(v => v !== pill.value);
  } else if (pill.type === 'approvedDateRange') {
    appliedApprovedDateFrom.value = '';
    appliedApprovedDateTo.value = '';
  } else if (pill.type === 'status') {
    appliedStatuses.value = appliedStatuses.value.filter(v => v !== pill.value);
  }
};

const parseMDYYYY = (dateStr: string): number => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const filteredTestResultsData = computed(() => {
  let items = testResultsData.value;
  if (appliedAccounts.value.length > 0) {
    items = items.filter(item => appliedAccounts.value.includes(item.accountName));
  }
  if (appliedTestDateFrom.value || appliedTestDateTo.value) {
    const fromTs = appliedTestDateFrom.value ? parseMDYYYY(appliedTestDateFrom.value) : 0;
    const toTs = appliedTestDateTo.value ? parseMDYYYY(appliedTestDateTo.value) : Infinity;
    items = items.filter(item => {
      const start = parseMDYYYY(item.testStartDate);
      return start >= fromTs && start <= toTs;
    });
  }
  if (appliedApprovedBy.value.length > 0) {
    items = items.filter(item => appliedApprovedBy.value.includes(item.approvedBy));
  }
  if (appliedApprovedDateFrom.value || appliedApprovedDateTo.value) {
    const fromTs = appliedApprovedDateFrom.value ? parseMDYYYY(appliedApprovedDateFrom.value) : 0;
    const toTs = appliedApprovedDateTo.value ? parseMDYYYY(appliedApprovedDateTo.value) : Infinity;
    items = items.filter(item => {
      if (item.approvedDate === '-') return false;
      const approved = parseMDYYYY(item.approvedDate);
      return approved >= fromTs && approved <= toTs;
    });
  }
  if (appliedStatuses.value.length > 0) {
    items = items.filter(item => appliedStatuses.value.includes(item.status));
  }
  return items;
});

const totalReports = computed(() => testResultsData.value.length);
const pendingReports = computed(() => testResultsData.value.filter(item => item.status === 'Pending').length);
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
}

.global-controls {
  margin-bottom: $spacing-medium;
}

.filter-pills {
  margin-bottom: $spacing-small;
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

  &:hover {
    html:not(.dark) & {
      background-color: rgba(0, 0, 0, 0.06);
    }
    html.dark & {
      background-color: rgba(255, 255, 255, 0.08);
    }
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
  margin-right: $spacing-xsmall;

  &.active {
    background-color: $color-primary !important;
    border-color: $color-primary !important;
    color: $color-neutral-white;
  }
}

</style>
