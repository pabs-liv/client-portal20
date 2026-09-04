
<template>
  <div>
    <h1 class="text-h1 mb-large">Prior Authorizations</h1>
    <div v-if="isExternal" class="widgets-container mb-large">
      <SummaryWidget
        title="Pending"
        :count="pendingCount"
        description="Authorizations awaiting review (Last 30 Days)"
        icon-background-color="rgba(253, 214, 113, 0.2)"
        icon-color="#FBBA13"
        :show-icon="true"
        :icon="Hourglass"
        :clickable="false"
      />
      <SummaryWidget
        title="Approved"
        :count="approvedCount"
        description="Authorizations that have been approved (Last 30 Days)"
        icon-background-color="rgba(190, 227, 190, 0.4)"
        icon-color="#5CB85C"
        :show-icon="true"
        :icon="CircleCheckBig"
        :clickable="false"
      />
      <SummaryWidget
        title="Denied"
        :count="deniedCount"
        description="Authorizations that have been denied (Last 30 Days)"
        icon-background-color="rgba(212, 107, 107, 0.4)"
        icon-color="#B80909"
        :show-icon="true"
        :icon="XCircle"
        :clickable="false"
      />
    </div>
    <PageCard
      headerText="Prior Authorization Manager"
      :descriptionText="isExternal ? 'Review the status of your prior authorizations, or ask a question about a submission.' : 'Review prior authorization statuses and monitor clinical assistance requests submitted by clients.'"
    >
      <div v-if="pendingClinicalAssistanceItems.length > 0" class="pending-assistance-section mb-large">
        <h3 class="pending-assistance-section__title">Pending Clinical Assistance</h3>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="font-weight-bold" style="width: 12%;">EOC ID</th>
              <th class="font-weight-bold" style="width: 25%;">Account Name</th>
              <th class="font-weight-bold" style="width: 20%;">Drug Name</th>
              <th class="font-weight-bold" style="width: 13%;">Ticket #</th>
              <th class="font-weight-bold" style="width: 15%;">Requested Date</th>
              <th class="font-weight-bold" style="width: 15%;">Request Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="auth in pendingClinicalAssistanceItems" :key="auth.eocId">
              <td>{{ auth.eocId }}</td>
              <td>{{ auth.accountName }}</td>
              <td>{{ auth.drugName }}</td>
              <td>{{ auth.ticketNumber }}</td>
              <td>{{ auth.requestedDate }}</td>
              <td>
                <v-chip :color="assistanceStatusColor(auth.assistanceStatus)" variant="tonal" size="small">
                  {{ auth.assistanceStatus }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div class="search-filter-row">
        <div class="search-bar-wrapper">
          <SearchBar
            @update:searchTerm="priorAuthSearchTerm = $event"
            placeholder="Search by EOC ID or drug name"
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
      <div class="pa-table">
        <ReportDataTable
          :headers="priorAuthHeaders"
          :items="tableItems"
          item-value="eocId"
          :show-search-bar="false"
          :show-filter-button="false"
          :show-filter-pills="false"
          :show-selection-checkboxes="false"
          :show-row-actions="isExternal"
          :row-action-items="rowActionItems"
          @row-action="handleRowAction"
          :show-bulk-approve="false"
          :show-bulk-reject="false"
          :show-bulk-download="false"
        >
          <template #item.status="{ item }">
            <v-chip :color="getStatusDisplay((item as any).rawStatus).color" variant="tonal" size="small">
              {{ getStatusDisplay((item as any).rawStatus).label }}
            </v-chip>
          </template>
        </ReportDataTable>
      </div>
    </PageCard>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="priorAuthFilters"
      :icon="SlidersHorizontal"
      heading="Prior Authorization Filters"
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
      <template #filter-status="{ filter }">
        <div v-if="dialogStatuses.length > 0" class="selected-chips">
          <v-chip
            v-for="status in dialogStatuses"
            :key="status"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ status }}
            <span class="chip-close" @click.stop="toggleDialogStatus(status)">
              <X :size="12" />
            </span>
          </v-chip>
        </div>
        <div class="account-picker-wrap">
          <div class="account-search-field" :class="{ 'account-search-field--active': showStatusList }">
            <input
              v-model="statusSearch"
              type="text"
              class="account-search-input"
              placeholder="Status"
              @mousedown="showStatusList = true"
              @blur="handleStatusPickerBlur"
            />
          </div>
          <div v-if="showStatusList" class="account-dropdown">
            <div
              v-for="opt in filteredStatusOptions"
              :key="String(opt.value)"
              class="account-option"
              @mousedown.prevent
              @click="toggleDialogStatus(opt.value as string)"
            >
              <div class="acct-checkbox" :class="{ active: dialogStatuses.includes(opt.value as string) }">
                <Check v-if="dialogStatuses.includes(opt.value as string)" :size="12" :stroke-width="3" />
              </div>
              <span>{{ opt.text }}</span>
            </div>
            <div v-if="filteredStatusOptions.length === 0" class="no-acct-results">
              No statuses found
            </div>
          </div>
        </div>
      </template>
      <template #filter-dateRange="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div class="date-range-row">
          <DatePicker label="From" v-model="dialogDateFrom" />
          <DatePicker label="To" v-model="dialogDateTo" />
        </div>
      </template>
    </AdvancedFiltersDialog>

    <Dialog
      :model-value="showAssistanceDialog"
      @update:model-value="showAssistanceDialog = $event"
      :icon="Info"
      heading="Request Clinical Assistance"
      :actions="assistanceDialogActions"
    >
      <p class="text-body mb-small">
        Your request will be sent to your account management team and they will be in touch with you shortly with additional details.
      </p>
      <table class="claim-summary-table">
        <thead>
          <tr>
            <th>Account</th>
            <th>EOC ID</th>
            <th>Drug Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="auth in pendingAssistanceItems" :key="auth.eocId">
            <td>{{ auth.accountName }}</td>
            <td>{{ auth.eocId }}</td>
            <td>{{ auth.drugName }}</td>
          </tr>
        </tbody>
      </table>
      <v-textarea
        v-model="assistanceNotes"
        label="Notes"
        variant="outlined"
        maxlength="1000"
        counter
        class="mt-3"
      />
    </Dialog>

    <v-snackbar v-model="showSuccessSnackbar" :timeout="3000" color="success">
      {{ successSnackbarText }}
    </v-snackbar>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import SummaryWidget from '@/components/common/SummaryWidget.vue';
import Dialog from '@/components/ui/Dialog.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import { useUserType } from '@/composables/useUserType';
import { Hourglass, CircleCheckBig, XCircle, Info, SlidersHorizontal, Check, X } from 'lucide-vue-next';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

// Column widths are enforced via the .pa-table :deep() rules below, not the
// header "width" property — Vuetify's v-data-table doesn't reliably apply
// per-column width under its default table-layout:auto (same fix pattern as
// Plan Explorer's cs-matrix-table).
const priorAuthHeaders = computed(() => {
  const headers: any[] = [
    { title: 'Account Name', key: 'accountName' },
    { title: 'EOC ID', key: 'eocId' },
    { title: 'Drug Name', key: 'drugName' },
    { title: 'Submission Date', key: 'submissionDate', align: 'end' },
    { title: 'Status', key: 'status' },
  ];
  if (isExternal.value) {
    headers.push({ title: '', key: 'actions', sortable: false, align: 'end' });
  }
  return headers;
});

// Raw statuses mirror the Member Portal's prior authorization pipeline —
// several sign-off sub-statuses all display as "Under Review". notes mirrors
// HCC's model: a real flag for "client has requested clinical assistance,"
// not a guess derived from status.
const priorAuthData = ref([
  { accountName: 'Company A', eocId: 'EOC12345', drugName: 'Drug A', rawStatus: 'Submitted', submissionDate: '2025-07-01', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { accountName: 'Company B', eocId: 'EOC67890', drugName: 'Drug B', rawStatus: 'Approved', submissionDate: '2025-06-25', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { accountName: 'Company C', eocId: 'EOC11223', drugName: 'Drug C', rawStatus: 'Rejected', submissionDate: '2025-06-20', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { accountName: 'Company D', eocId: 'EOC44556', drugName: 'Drug D', rawStatus: 'RPH Sign-Off', submissionDate: '2025-07-05', notes: 'Can you confirm the expected turnaround time for this authorization?' as string | null, requestedBy: 'Jane Doe' as string | null, requestedDate: '2025-07-06' as string | null, ticketNumber: '1004821' as string | null, assistanceStatus: 'Submitted' as string | null },
  { accountName: 'Company E', eocId: 'EOC77889', drugName: 'Drug E', rawStatus: 'Approved', submissionDate: '2025-06-18', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { accountName: 'Company F', eocId: 'EOC99001', drugName: 'Drug F', rawStatus: 'Show Review', submissionDate: '2025-07-10', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { accountName: 'Company G', eocId: 'EOC22334', drugName: 'Drug G', rawStatus: 'Submitted', submissionDate: '2025-06-15', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { accountName: 'Company H', eocId: 'EOC55667', drugName: 'Drug H', rawStatus: 'MD Sign-Off', submissionDate: '2025-07-02', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { accountName: 'Company I', eocId: 'EOC88990', drugName: 'Drug I', rawStatus: 'Client Sign-Off', submissionDate: '2025-06-28', notes: 'What additional documentation is needed from the prescriber?' as string | null, requestedBy: 'John Smith' as string | null, requestedDate: '2025-06-29' as string | null, ticketNumber: '1004793' as string | null, assistanceStatus: 'In Progress' as string | null },
  { accountName: 'Company J', eocId: 'EOC10112', drugName: 'Drug J', rawStatus: 'Approved', submissionDate: '2025-07-08', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
]);

// Six statuses only — every raw sub-status from the adjudication pipeline
// collapses into one of these. Anything not explicitly mapped falls to
// "In Review" rather than surfacing a raw/unknown value to the client.
type StatusDisplay = { label: 'Approved' | 'Denied' | 'Awaiting Physician Response' | 'In Review' | 'Override Placement In Progress' | 'Status Unavailable'; color: 'success' | 'error' | 'warning' | 'default' };

function getStatusDisplay(rawStatus: string | null | undefined): StatusDisplay {
  switch (rawStatus) {
    case 'Approved':
      return { label: 'Approved', color: 'success' };
    case 'Rejected':
      return { label: 'Denied', color: 'error' };
    case 'Show Review':
      return { label: 'Awaiting Physician Response', color: 'warning' };
    case 'Authorization':
      return { label: 'Override Placement In Progress', color: 'warning' };
    case null:
    case undefined:
    case '':
      return { label: 'Status Unavailable', color: 'default' };
    default:
      return { label: 'In Review', color: 'warning' };
  }
}

// Coarse widget bucket — collapses every non-Approved/Denied status into
// "Pending" for the 3 summary cards. The table/filter use the full 6-status
// getStatusDisplay resolution instead; only the widgets need this rollup.
function getStatusBucket(rawStatus: string): 'Pending' | 'Approved' | 'Denied' {
  if (rawStatus === 'Approved') return 'Approved';
  if (rawStatus === 'Rejected') return 'Denied';
  return 'Pending';
}

// Every claim row stays selectable and Request Clinical Assistance stays
// available regardless of prior requests — mirrors HCC's pattern (confirmed
// against the old portal's actual RequestMoreInformation/
// RequestClinicalAssistance handlers, neither of which locks re-requesting).
const tableItems = computed(() => filteredPriorAuthData.value);

// Surfaced as its own table right under the page header — mirrors HCC's
// pattern, shown regardless of user type.
const pendingClinicalAssistanceItems = computed(() => priorAuthData.value.filter(item => item.notes != null));

// assistanceStatus reflects the Solo1 ticket's status once that integration
// exists (Story #35379) — matches HCC's assistanceStatusColor pattern.
// New -> Submitted (blue, matches $color-link/#2C82CB and master's StatusChip
// 'info' variant); In Progress/Waiting on Response -> In Progress (yellow).
// Closed tickets are removed from this table entirely, so no color case is
// needed for Closed.
const assistanceStatusColor = (status: string | null): string => {
  if (status === 'In Progress') return 'warning';
  return '#2C82CB'; // Submitted and any unrecognized status
};

const pendingCount = computed(() => priorAuthData.value.filter(item => getStatusBucket(item.rawStatus) === 'Pending').length);
const approvedCount = computed(() => priorAuthData.value.filter(item => getStatusBucket(item.rawStatus) === 'Approved').length);
const deniedCount = computed(() => priorAuthData.value.filter(item => getStatusBucket(item.rawStatus) === 'Denied').length);

const { isExternal } = useUserType();

const showSuccessSnackbar = ref(false);
const successSnackbarText = ref('');

// === REQUEST CLINICAL ASSISTANCE (single row only, via row action icon) === //

const showAssistanceDialog = ref(false);
const pendingAssistanceItems = ref<any[]>([]);
const assistanceNotes = ref('');

const openAssistanceDialog = (items: any[]) => {
  pendingAssistanceItems.value = items;
  assistanceNotes.value = '';
  showAssistanceDialog.value = true;
};

const confirmAssistanceRequest = () => {
  // pendingAssistanceItems holds rows from tableItems, a computed that spreads
  // {...item} into new plain objects on every recompute — mutating those
  // directly never reaches priorAuthData, so look the real item up by eocId
  // and mutate that instead.
  const requestedEocIds = pendingAssistanceItems.value.map(auth => auth.eocId);
  // Design placeholder — production pulls the logged-in user's name instead
  // of this hardcoded string (mirrors HCC's confirmAssistanceRequest).
  const requestedBy = 'Current User';
  const requestedDate = new Date().toISOString().slice(0, 10);
  // Design placeholder — production ticket # comes back from the Solo1 ticket
  // created for this request (Client Experience - AM/AE Escalation queue).
  const ticketNumber = `${Math.floor(1000000 + Math.random() * 9000000)}`;
  priorAuthData.value.forEach(auth => {
    if (requestedEocIds.includes(auth.eocId)) {
      auth.notes = assistanceNotes.value;
      auth.requestedBy = requestedBy;
      auth.requestedDate = requestedDate;
      auth.ticketNumber = ticketNumber;
      auth.assistanceStatus = 'Submitted';
    }
  });
  showAssistanceDialog.value = false;
  successSnackbarText.value = 'Clinical assistance request sent';
  showSuccessSnackbar.value = true;
  pendingAssistanceItems.value = [];
};

const assistanceDialogActions = computed(() => [
  { text: 'Cancel', onClick: () => (showAssistanceDialog.value = false), styleType: 'secondary' as const },
  { text: 'Send Request', onClick: confirmAssistanceRequest, styleType: 'primary' as const, disabled: assistanceNotes.value.trim() === '' },
]);

const rowActionItems = [
  { label: 'Request Clinical Assistance', action: 'assistance' },
];

const handleRowAction = ({ action, item }: { action: string; item: any }) => {
  if (action === 'assistance') openAssistanceDialog([item]);
};

// === FILTERS === //

const priorAuthStatusOptions = [
  { text: 'Approved', value: 'Approved', active: false },
  { text: 'Denied', value: 'Denied', active: false },
  { text: 'Awaiting Physician Response', value: 'Awaiting Physician Response', active: false },
  { text: 'In Review', value: 'In Review', active: false },
  { text: 'Override Placement In Progress', value: 'Override Placement In Progress', active: false },
  { text: 'Status Unavailable', value: 'Status Unavailable', active: false },
];

// Status is always last in the filter list, for consistency across pages.
const priorAuthFilters = computed<FilterGroup[]>(() => [
  { type: 'account', label: 'Account', multiselect: true, options: [], modelValue: null },
  { type: 'dateRange', label: 'Submission Date Range', multiselect: false, options: [], modelValue: null },
  { type: 'status', label: 'Status', multiselect: true, options: priorAuthStatusOptions, modelValue: null },
]);

const priorAuthSearchTerm = ref('');

const isAdvancedFiltersOpen = ref(false);

const appliedAccounts = ref<string[]>([]);
const appliedStatuses = ref<string[]>([]);
const appliedDateFrom = ref('');
const appliedDateTo = ref('');

const dialogAccounts = ref<string[]>([]);
const dialogStatuses = ref<string[]>([]);
const dialogDateFrom = ref('');
const dialogDateTo = ref('');

const accountSearch = ref('');
const showAccountList = ref(false);
const statusSearch = ref('');
const showStatusList = ref(false);

const accountOptions = computed(() => [...new Set(priorAuthData.value.map(a => a.accountName))].sort());
const filteredAccountOptions = computed(() => {
  const q = accountSearch.value?.toLowerCase() ?? '';
  return accountOptions.value.filter(a => a.toLowerCase().includes(q));
});

const filteredStatusOptions = computed(() => {
  const q = statusSearch.value?.toLowerCase() ?? '';
  return priorAuthStatusOptions.filter(o => o.text.toLowerCase().includes(q));
});

const toggleAccount = (account: string) => {
  dialogAccounts.value = dialogAccounts.value.includes(account)
    ? dialogAccounts.value.filter(a => a !== account)
    : [...dialogAccounts.value, account];
};

const handleAccountPickerBlur = () => {
  setTimeout(() => { showAccountList.value = false; }, 150);
};

const handleStatusPickerBlur = () => {
  setTimeout(() => { showStatusList.value = false; }, 150);
};

const toggleDialogStatus = (value: string) => {
  dialogStatuses.value = dialogStatuses.value.includes(value)
    ? dialogStatuses.value.filter(v => v !== value)
    : [...dialogStatuses.value, value];
};

const openFilters = () => {
  dialogAccounts.value = [...appliedAccounts.value];
  dialogStatuses.value = [...appliedStatuses.value];
  dialogDateFrom.value = appliedDateFrom.value;
  dialogDateTo.value = appliedDateTo.value;
  accountSearch.value = '';
  showAccountList.value = false;
  statusSearch.value = '';
  showStatusList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedAccounts.value = [...dialogAccounts.value];
  appliedStatuses.value = [...dialogStatuses.value];
  appliedDateFrom.value = dialogDateFrom.value;
  appliedDateTo.value = dialogDateTo.value;
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
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? dateStr : parsed.toLocaleDateString();
};

const activeFilterPills = computed<FilterPill[]>(() => {
  const pills: FilterPill[] = [];
  appliedAccounts.value.forEach(acct => {
    pills.push({ type: 'account', value: acct, label: acct, isActive: true });
  });
  appliedStatuses.value.forEach(status => {
    pills.push({ type: 'status', value: status, label: status, isActive: true });
  });
  if (appliedDateFrom.value || appliedDateTo.value) {
    const parts = [appliedDateFrom.value, appliedDateTo.value].filter(Boolean).map(formatDateDisplay);
    pills.push({ type: 'dateRange', value: null, label: `Submission Date: ${parts.join(' – ')}`, isActive: true });
  }
  return pills;
});

const handleFilterPillClose = (pill: FilterPill) => {
  if (pill.type === 'account') {
    appliedAccounts.value = appliedAccounts.value.filter(a => a !== pill.value);
  } else if (pill.type === 'status') {
    appliedStatuses.value = appliedStatuses.value.filter(s => s !== pill.value);
  } else if (pill.type === 'dateRange') {
    appliedDateFrom.value = '';
    appliedDateTo.value = '';
  }
};

const filteredPriorAuthData = computed(() => {
  return priorAuthData.value.filter(item => {
    if (priorAuthSearchTerm.value) {
      const q = priorAuthSearchTerm.value.toLowerCase();
      const matchesSearch =
        item.eocId.toLowerCase().includes(q) ||
        item.drugName.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (appliedAccounts.value.length > 0 && !appliedAccounts.value.includes(item.accountName)) {
      return false;
    }
    if (appliedStatuses.value.length > 0 && !appliedStatuses.value.includes(getStatusDisplay(item.rawStatus).label)) {
      return false;
    }
    if (appliedDateFrom.value || appliedDateTo.value) {
      const submissionDate = new Date(item.submissionDate);
      if (appliedDateFrom.value && submissionDate < new Date(appliedDateFrom.value)) return false;
      if (appliedDateTo.value && submissionDate > new Date(appliedDateTo.value)) return false;
    }
    return true;
  });
});
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
}

.search-filter-row {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  margin-bottom: $spacing-small;
}

.search-bar-wrapper {
  flex: 1;
}

.filter-pills {
  margin-bottom: $spacing-small;
}

// Vuetify's v-data-table doesn't reliably honor a per-column "width" header
// property under its default table-layout:auto, so column sizing is forced
// directly via nth-child (same fix pattern as Plan Explorer's cs-matrix-table).
// Actions (external only) gets a small fixed width layered on top of the six
// percentage widths below, which sum to 100% on their own for internal users.
.pa-table {
  :deep(table) {
    table-layout: fixed;
    width: 100%;
  }

  :deep(th:nth-child(1)), :deep(td:nth-child(1)) { width: 22%; }
  :deep(th:nth-child(2)), :deep(td:nth-child(2)) { width: 13%; }
  :deep(th:nth-child(3)), :deep(td:nth-child(3)) { width: 17%; }
  :deep(th:nth-child(4)), :deep(td:nth-child(4)) { width: 15%; }
  :deep(th:nth-child(5)), :deep(td:nth-child(5)) { width: 17%; }
  :deep(th:nth-child(6)), :deep(td:nth-child(6)) { width: 16%; }
  :deep(th:nth-child(7)), :deep(td:nth-child(7)) { width: 60px; }
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

.pending-assistance-section {
  border: 2px solid $color-link;
  border-radius: 8px;
  background-color: $color-information-background;
  padding: $spacing-medium;

  &__title {
    color: $color-link;
    margin-bottom: $spacing-small;
  }

  :deep(table) {
    background-color: transparent;

    thead th,
    tbody td {
      color: $color-text-primary;
      background-color: rgba($color-neutral-white, 0.8);
    }
  }
}

.claim-summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: $spacing-small;

  th,
  td {
    text-align: left;
    padding: $spacing-xsmall $spacing-small;
    border-bottom: 1px solid $color-border;
    font-size: $font-size-small;
  }

  th {
    color: $color-text-secondary;
    font-weight: $font-weight-semibold;
  }
}
</style>
