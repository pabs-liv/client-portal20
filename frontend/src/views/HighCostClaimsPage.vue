
<template>
  <div>
    <h1 class="text-h1 mb-large">High-Cost Claims</h1>
    <div v-if="isExternal" class="widgets-container mb-large">
      <SummaryWidget
        title="Claims Pending Acknowledgment"
        :count="claimsPendingAcknowledgmentCount"
        description="Claims awaiting your acknowledgment (Last 30 Days)"
        icon-background-color="rgba(253, 214, 113, 0.2)"
        icon-color="#FBBA13"
        :show-icon="true"
        :icon="ClockFading"
        :clickable="false"
      />
      <SummaryWidget
        title="Total Cost"
        :count="totalClaimsCost"
        description="Total estimated cost of all claims (Last 30 Days)"
        icon-background-color="rgba(190, 227, 190, 0.4)"
        icon-color="#5CB85C"
        :show-icon="true"
        :icon="DollarSign"
        :clickable="false"
      />
      <SummaryWidget
        title="Average Claim Cost"
        :count="averageClaimCost"
        description="Average estimated cost per claim (Last 30 Days)"
        icon-background-color="rgba(200, 220, 240, 0.4)"
        icon-color="#2C82CB"
        :show-icon="true"
        :icon="Calculator"
        :clickable="false"
      />
    </div>

    <PageCard
      headerText="High Cost Claim Manager"
      :descriptionText="isExternal ? 'Review or ask questions about high-cost claims.' : 'Review high-cost claims and monitor clinical assistance requests submitted by clients.'"
    >
      <div v-if="pendingAssistanceClaims.length > 0" class="pending-assistance-section mb-large">
        <h3 class="pending-assistance-section__title">Pending Clinical Assistance</h3>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="font-weight-bold" style="width: 20%;">Account Name</th>
              <th class="font-weight-bold" style="width: 17%;">Drug Name</th>
              <th class="font-weight-bold text-end" style="width: 12%;">Estimated Cost</th>
              <th class="font-weight-bold" style="width: 12%;">Ticket #</th>
              <th class="font-weight-bold" style="width: 13%;">Requested Date</th>
              <th class="font-weight-bold" style="width: 15%;">Request Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="claim in pendingAssistanceClaims" :key="claim.id">
              <td>{{ claim.accountName }}</td>
              <td>{{ claim.drugName }}</td>
              <td class="text-end">{{ claim.cost }}</td>
              <td>{{ claim.ticketNumber }}</td>
              <td>{{ claim.requestedDate }}</td>
              <td>
                <v-chip :color="assistanceStatusColor(claim.assistanceStatus)" variant="tonal" size="small">
                  {{ claim.assistanceStatus }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <Banner
        v-if="isExternal"
        variant="info"
        message="Disclaimer: Cost represents estimated total cost of the medication, not inclusive of tax, member cost share, applicable program savings, etc."
        class="mb-large"
      />
      <div class="search-filter-row">
        <div class="search-bar-wrapper">
          <SearchBar
            @update:searchTerm="claimsSearchTerm = $event"
            placeholder="Search by drug name or NDC"
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
        :headers="claimsHeaders"
        :items="tableItems"
        :show-search-bar="false"
        :show-filter-button="false"
        :show-filter-pills="false"
        :show-selection-checkboxes="false"
        :show-row-actions="isExternal"
        :row-action-items="rowActionItems"
        @row-action="handleRowAction"
      />
    </PageCard>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="hccFilters"
      :icon="SlidersHorizontal"
      heading="High-Cost Claim Filters"
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
        <div class="mt-medium">
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
        </div>
      </template>
      <template #filter-dateRange="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div class="date-range-row">
          <DatePicker label="From" v-model="dialogDateFrom" />
          <DatePicker label="To" v-model="dialogDateTo" />
        </div>
      </template>
      <template #filter-cost="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div class="date-range-row">
          <v-text-field
            v-model="dialogMinCost"
            type="number"
            min="0"
            step="1000"
            variant="underlined"
            density="compact"
            prefix="$"
            label="Minimum"
            placeholder="e.g. 25000"
            :rules="[(v: string) => v === '' || Number(v) >= 0 || 'Enter a positive amount']"
            hide-details="auto"
          />
          <v-text-field
            v-model="dialogMaxCost"
            type="number"
            min="0"
            step="1000"
            variant="underlined"
            density="compact"
            prefix="$"
            label="Maximum"
            placeholder="e.g. 100000"
            :rules="[(v: string) => v === '' || Number(v) >= 0 || 'Enter a positive amount']"
            hide-details="auto"
          />
        </div>
      </template>
    </AdvancedFiltersDialog>

    <Dialog
      :model-value="showAssistanceDialog"
      @update:model-value="showAssistanceDialog = $event"
      :icon="Info"
      heading="Request Clinical Assistance"
      :actions="assistanceDialogActions"
      :show-secondary-button="true"
    >
      <p class="text-body mb-small">
        Your request will be sent to your clinical point of contact and they will be in touch with you shortly with additional details.
      </p>
      <table class="claim-summary-table">
        <thead>
          <tr>
            <th>Account</th>
            <th>Drug Name</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="claim in pendingAssistanceItems" :key="claim.id">
            <td>{{ claim.accountName }}</td>
            <td>{{ claim.drugName }}</td>
            <td>{{ claim.cost }}</td>
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
import { Info, ClockFading, DollarSign, Calculator, SlidersHorizontal, Check, X } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import Banner from '@/components/common/Banner.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Dialog from '@/components/ui/Dialog.vue';
import SummaryWidget from '@/components/common/SummaryWidget.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import { useUserType } from '@/composables/useUserType';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

const { isExternal } = useUserType();

const claimsHeaders = computed(() => {
  const headers: any[] = [
    { title: 'Account Name', key: 'accountName' },
    { title: 'Drug Name', key: 'drugName' },
    { title: 'NDC', key: 'ndc' },
    { title: 'Date of Service', key: 'claimDate' },
    { title: 'Quantity', key: 'quantity' },
    { title: 'Days Supply', key: 'daysSupply' },
    { title: 'Estimated Cost', key: 'cost' },
  ];
  if (isExternal.value) {
    headers.push({ title: 'Actions', key: 'actions', sortable: false, align: 'start' });
  }
  return headers;
});

// High-cost claims are gated by each account's NotifyAmount threshold
// (defaults to $10,000), so every claim here should already be well above
// that — mock costs reflect realistic specialty-drug pricing, not the old
// low-dollar placeholder amounts.
// rawStatus mirrors Prior Auths — every high-cost claim is itself a prior
// authorization, so it carries the same adjudication-pipeline status values.
// ackStatus is a separate, portal-only field: whether the client has
// acknowledged the claim, independent of its clinical/PA status.
const claimsData = ref([
  { id: 157826931, eocId: 'EOC30021', accountName: 'Company A', drugName: 'Drug A', ndc: '00071-0155-23', claimDate: '2025-07-15', quantity: 1, daysSupply: 30, cost: '$12,450.00', rawStatus: 'Submitted', ackStatus: 'Pending', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { id: 158088181, eocId: 'EOC30047', accountName: 'Company B', drugName: 'Drug B', ndc: '00069-0944-30', claimDate: '2025-07-14', quantity: 2, daysSupply: 90, cost: '$45,800.00', rawStatus: 'Approved', ackStatus: 'Acknowledged', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { id: 158480891, eocId: 'EOC30058', accountName: 'Company C', drugName: 'Drug C', ndc: '00078-0421-15', claimDate: '2025-07-13', quantity: 4, daysSupply: 30, cost: '$18,750.00', rawStatus: 'Show Review', ackStatus: 'Pending', notes: 'Can you confirm if a savings program applies to this claim?' as string | null, requestedBy: 'Jane Doe' as string | null, requestedDate: '2025-07-16' as string | null, ticketNumber: '1005014' as string | null, assistanceStatus: 'Submitted' },
  { id: 152987510, eocId: 'EOC30063', accountName: 'Company D', drugName: 'Drug D', ndc: '00006-0749-31', claimDate: '2025-07-12', quantity: 1, daysSupply: 28, cost: '$92,300.00', rawStatus: 'Approved', ackStatus: 'Acknowledged', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
  { id: 153219641, eocId: 'EOC30079', accountName: 'Company E', drugName: 'Drug E', ndc: '00173-0879-00', claimDate: '2025-07-11', quantity: 3, daysSupply: 84, cost: '$61,200.00', rawStatus: 'Rejected', ackStatus: 'Pending', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null, ticketNumber: null as string | null, assistanceStatus: null as string | null },
]);

// Six statuses only — mirrors Prior Auths' getStatusDisplay. Every raw
// sub-status from the adjudication pipeline collapses into one of these.
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

// Request Clinical Assistance is always available, even if a request is
// already open for that claim.
const tableItems = computed(() => filteredClaimsData.value);

// Surfaced as its own table right under the page header — mirrors master's
// HighCostClaimsPage treatment, shown regardless of user type (internal staff
// need this visibility too, not just external clients).
const pendingAssistanceClaims = computed(() => claimsData.value.filter(claim => claim.notes != null));

// assistanceStatus reflects the Solo1 ticket's status once that integration
// exists (Story #35379). New -> Submitted (blue, matches $color-link/#2C82CB
// and master's StatusChip 'info' variant); In Progress/Waiting on Response ->
// In Progress (yellow). Closed tickets are removed from this table entirely,
// so no color case is needed for Closed.
const assistanceStatusColor = (status: string | null): string => {
  if (status === 'In Progress') return 'warning';
  return '#2C82CB'; // Submitted and any unrecognized status
};

const parseCost = (cost: string) => {
  const value = parseFloat(cost.replace(/[^0-9.-]+/g, ''));
  return isNaN(value) ? 0 : value;
};

// "Pending" is purely a portal-action state — it means the client hasn't
// acknowledged the claim yet, not a clinical/claim-processing status.
const claimsPendingAcknowledgmentCount = computed(() => claimsData.value.filter(c => c.ackStatus === 'Pending').length);

const formatCurrency = (amount: number): string =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const totalClaimsCost = computed(() => {
  const total = claimsData.value.reduce((sum, claim) => sum + parseCost(claim.cost), 0);
  return formatCurrency(total);
});

const averageClaimCost = computed(() => {
  if (claimsData.value.length === 0) return formatCurrency(0);
  const total = claimsData.value.reduce((sum, claim) => sum + parseCost(claim.cost), 0);
  return formatCurrency(total / claimsData.value.length);
});

// === REQUEST CLINICAL ASSISTANCE (single row only) === //

const showAssistanceDialog = ref(false);
const pendingAssistanceItems = ref<any[]>([]);
const assistanceNotes = ref('');

const openAssistanceDialog = (items: any[]) => {
  pendingAssistanceItems.value = items;
  assistanceNotes.value = '';
  showAssistanceDialog.value = true;
};

const confirmAssistanceRequest = () => {
  const requestedIds = pendingAssistanceItems.value.map(claim => claim.id);
  // Design placeholder — production pulls the logged-in user's name instead
  // of this hardcoded string.
  const requestedBy = 'Current User';
  const requestedDate = new Date().toISOString().slice(0, 10);
  // Design placeholder — production ticket # comes back from the Solo1 ticket
  // created for this request (Client Experience - AM/AE Escalation queue).
  const ticketNumber = `${Math.floor(1000000 + Math.random() * 9000000)}`;
  claimsData.value.forEach(claim => {
    if (requestedIds.includes(claim.id)) {
      claim.notes = assistanceNotes.value;
      claim.requestedBy = requestedBy;
      claim.requestedDate = requestedDate;
      claim.ticketNumber = ticketNumber;
      claim.assistanceStatus = 'Submitted';
    }
  });
  showAssistanceDialog.value = false;
  successSnackbarText.value = 'Clinical assistance request sent';
  showSuccessSnackbar.value = true;
  pendingAssistanceItems.value = [];
};

const assistanceDialogActions = computed(() => [
  { text: 'Cancel', onClick: () => (showAssistanceDialog.value = false), styleType: 'secondary' as const },
  { text: 'Send Request', onClick: confirmAssistanceRequest, color: 'primary', variant: 'flat' as const, disabled: assistanceNotes.value.trim() === '' },
]);

const rowActionItems = [
  { label: 'Request Clinical Assistance', action: 'assistance' },
];

const handleRowAction = ({ action, item }: { action: string; item: any }) => {
  if (action === 'assistance') openAssistanceDialog([item]);
};

const showSuccessSnackbar = ref(false);
const successSnackbarText = ref('');

// === FILTERS === //
// Cost is an independent min/max range rather than preset tiers, since every
// claim here is already above the account's NotifyAmount threshold ($10,000
// by default) — fixed low-dollar breakpoints don't mean anything at this
// altitude, and min/max lets either bound be set alone or both together.
// Status options mirror Prior Auths' six-status set.

const hccStatusOptions = [
  { text: 'Approved', value: 'Approved', active: false },
  { text: 'Denied', value: 'Denied', active: false },
  { text: 'Awaiting Physician Response', value: 'Awaiting Physician Response', active: false },
  { text: 'In Review', value: 'In Review', active: false },
  { text: 'Override Placement In Progress', value: 'Override Placement In Progress', active: false },
  { text: 'Status Unavailable', value: 'Status Unavailable', active: false },
];

// Status is always last in the filter list, for consistency across pages.
const hccFilters = computed<FilterGroup[]>(() => [
  { type: 'account', label: 'Account', multiselect: true, options: [], modelValue: null },
  { type: 'dateRange', label: 'Date of Service Range', multiselect: false, options: [], modelValue: null },
  { type: 'cost', label: 'Cost Range', multiselect: false, options: [], modelValue: null },
  { type: 'status', label: 'Status', multiselect: true, options: hccStatusOptions, modelValue: null },
]);

const claimsSearchTerm = ref('');

const isAdvancedFiltersOpen = ref(false);

const appliedAccounts = ref<string[]>([]);
const appliedStatuses = ref<string[]>([]);
const appliedDateFrom = ref('');
const appliedDateTo = ref('');
const appliedMinCost = ref<number | null>(null);
const appliedMaxCost = ref<number | null>(null);

const dialogAccounts = ref<string[]>([]);
const dialogStatuses = ref<string[]>([]);
const dialogDateFrom = ref('');
const dialogDateTo = ref('');
const dialogMinCost = ref<string>('');
const dialogMaxCost = ref<string>('');

const accountSearch = ref('');
const showAccountList = ref(false);
const statusSearch = ref('');
const showStatusList = ref(false);

const accountOptions = computed(() => [...new Set(claimsData.value.map(c => c.accountName))].sort());
const filteredAccountOptions = computed(() => {
  const q = accountSearch.value?.toLowerCase() ?? '';
  return accountOptions.value.filter(a => a.toLowerCase().includes(q));
});

const filteredStatusOptions = computed(() => {
  const q = statusSearch.value?.toLowerCase() ?? '';
  return hccStatusOptions.filter(o => o.text.toLowerCase().includes(q));
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
  dialogMinCost.value = appliedMinCost.value != null ? String(appliedMinCost.value) : '';
  dialogMaxCost.value = appliedMaxCost.value != null ? String(appliedMaxCost.value) : '';
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
  const parsedMinCost = parseFloat(dialogMinCost.value);
  const parsedMaxCost = parseFloat(dialogMaxCost.value);
  appliedMinCost.value = isNaN(parsedMinCost) ? null : parsedMinCost;
  appliedMaxCost.value = isNaN(parsedMaxCost) ? null : parsedMaxCost;
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
    pills.push({ type: 'dateRange', value: null, label: `Date of Service: ${parts.join(' – ')}`, isActive: true });
  }
  if (appliedMinCost.value != null || appliedMaxCost.value != null) {
    let label: string;
    if (appliedMinCost.value != null && appliedMaxCost.value != null) {
      label = `Cost: $${appliedMinCost.value.toLocaleString()} – $${appliedMaxCost.value.toLocaleString()}`;
    } else if (appliedMinCost.value != null) {
      label = `Cost: ≥ $${appliedMinCost.value.toLocaleString()}`;
    } else {
      label = `Cost: ≤ $${appliedMaxCost.value!.toLocaleString()}`;
    }
    pills.push({ type: 'cost', value: null, label, isActive: true });
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
  } else if (pill.type === 'cost') {
    appliedMinCost.value = null;
    appliedMaxCost.value = null;
  }
};

const filteredClaimsData = computed(() => {
  return claimsData.value.filter(claim => {
    if (claimsSearchTerm.value) {
      const q = claimsSearchTerm.value.toLowerCase();
      const matchesSearch =
        claim.eocId.toLowerCase().includes(q) ||
        claim.drugName.toLowerCase().includes(q) ||
        claim.ndc.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (appliedAccounts.value.length > 0 && !appliedAccounts.value.includes(claim.accountName)) {
      return false;
    }
    if (appliedStatuses.value.length > 0 && !appliedStatuses.value.includes(getStatusDisplay(claim.rawStatus).label)) {
      return false;
    }
    if (appliedDateFrom.value || appliedDateTo.value) {
      const claimDate = new Date(claim.claimDate);
      if (appliedDateFrom.value && claimDate < new Date(appliedDateFrom.value)) return false;
      if (appliedDateTo.value && claimDate > new Date(appliedDateTo.value)) return false;
    }
    if (appliedMinCost.value != null && parseCost(claim.cost) < appliedMinCost.value) {
      return false;
    }
    if (appliedMaxCost.value != null && parseCost(claim.cost) > appliedMaxCost.value) {
      return false;
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

.filter-section-label {
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: $spacing-small;
}

.mt-medium {
  margin-top: $spacing-medium;
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
