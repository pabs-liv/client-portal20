
<template>
  <div>
    <h1 class="text-h1 mb-large">High-Cost Claims</h1>
    <div v-if="isExternal" class="widgets-container mb-large">
      <SummaryWidget
        title="Claims Pending Acknowledgment"
        :count="claimsPendingAcknowledgmentCount"
        description="Claims awaiting your acknowledgment"
        icon-background-color="rgba(253, 214, 113, 0.2)"
        icon-color="#FBBA13"
        :show-icon="true"
        :icon="ClockFading"
        :clickable="false"
      />
      <SummaryWidget
        title="Total Cost"
        :count="totalClaimsCost"
        description="Total estimated cost of all claims"
        icon-background-color="rgba(190, 227, 190, 0.4)"
        icon-color="#5CB85C"
        :show-icon="true"
        :icon="DollarSign"
        :clickable="false"
      />
      <SummaryWidget
        title="Average Claim Cost"
        :count="averageClaimCost"
        description="Average estimated cost per claim"
        icon-background-color="rgba(200, 220, 240, 0.4)"
        icon-color="#2C82CB"
        :show-icon="true"
        :icon="Calculator"
        :clickable="false"
      />
    </div>

    <PageCard
      headerText="High Cost Claim Manager"
      :descriptionText="isExternal ? 'Review, acknowledge, or ask questions about high-cost claims.' : 'Review high-cost claims and monitor clinical assistance requests submitted by clients.'"
    >
      <Banner
        variant="warning"
        message="Please acknowledge high-cost claims within 24 hours. If a claim is not acknowledged within 24 hours, it will automatically be processed to be filled in order to avoid member disruption and a delay in treatment with the approved therapy. If you have questions about a claim, select Request Clinical Assistance from the row's menu, or use bulk selection to request assistance for more than one claim."
      />
      <p v-if="isExternal" class="text-small disclaimer-text mt-small mb-large">
        Disclaimer: Cost represents estimated total cost of the medication, not inclusive of tax, member cost share, applicable program savings, etc.
      </p>
      <div class="search-filter-row">
        <div class="search-bar-wrapper">
          <SearchBar
            @update:searchTerm="claimsSearchTerm = $event"
            placeholder="Search by EOC ID, drug name, or NDC"
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
        ref="claimsTable"
        :headers="claimsHeaders"
        :items="tableItems"
        :show-search-bar="false"
        :show-filter-button="false"
        :show-filter-pills="false"
        :show-selection-checkboxes="isExternal"
        :show-row-actions="isExternal"
        :row-action-items="rowActionItems"
        :row-action-disabled="rowActionDisabled"
        @row-action="handleRowAction"
        :show-bulk-approve="isExternal"
        bulk-approve-label="Acknowledge Selected"
        :bulk-action-available="isBulkAcknowledgeAvailable"
        :show-bulk-download="false"
        @bulk-approve="handleBulkAcknowledgeClick"
      >
        <template #bulk-actions-extra="{ selected: bulkSelected }">
          <button class="bulk-action-btn" @click="openAssistanceDialog(bulkSelected)">Request Clinical Assistance</button>
        </template>
        <template #item.status="{ item }">
          <v-chip :color="(item as any).status === 'Acknowledged' ? 'success' : 'warning'" variant="tonal" size="small">
            {{ (item as any).status }}
          </v-chip>
        </template>
        <template #item.assistanceRequested="{ item }">
          <v-tooltip
            v-if="(item as any).notes"
            :text="`Assistance Requested by ${(item as any).requestedBy} on ${formatRequestedDate((item as any).requestedDate)}`"
          >
            <template #activator="{ props: tooltipProps }">
              <CircleHelp v-bind="tooltipProps" :size="18" :stroke-width="1.5" class="assistance-requested-icon" />
            </template>
          </v-tooltip>
        </template>
      </ReportDataTable>
    </PageCard>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="hccFilters"
      :icon="SlidersHorizontal"
      heading="High-Cost Claim Filters"
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
            variant="outlined"
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
            variant="outlined"
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
      :model-value="showAcknowledgeDialog"
      @update:model-value="showAcknowledgeDialog = $event"
      :icon="CircleCheckBig"
      :heading="acknowledgeDialogHeading"
      :actions="acknowledgeDialogActions"
      :show-secondary-button="true"
    >
      <p class="text-body mb-small">
        Are you sure you want to acknowledge the following high-cost claim{{ pendingAcknowledgeItems.length > 1 ? 's' : '' }}? This action cannot be undone.
      </p>
      <table class="claim-summary-table">
        <thead>
          <tr>
            <th>Account</th>
            <th>EOC ID</th>
            <th>Drug Name</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="claim in pendingAcknowledgeItems" :key="claim.id">
            <td>{{ claim.accountName }}</td>
            <td>{{ claim.eocId }}</td>
            <td>{{ claim.drugName }}</td>
            <td>{{ claim.cost }}</td>
          </tr>
        </tbody>
      </table>
    </Dialog>

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
            <th>EOC ID</th>
            <th>Drug Name</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="claim in pendingAssistanceItems" :key="claim.id">
            <td>{{ claim.accountName }}</td>
            <td>{{ claim.eocId }}</td>
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
import { CircleCheckBig, Info, ClockFading, DollarSign, Calculator, SlidersHorizontal, Check, CircleHelp, X } from 'lucide-vue-next';
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

const claimsTable = ref<InstanceType<typeof ReportDataTable> | null>(null);

const claimsHeaders = computed(() => {
  const headers: any[] = [
    { title: 'Account Name', key: 'accountName' },
    { title: 'EOC ID', key: 'eocId' },
    { title: 'Drug Name', key: 'drugName' },
    { title: 'NDC', key: 'ndc' },
    { title: 'Date of Service', key: 'claimDate', align: 'end' },
    { title: 'Quantity', key: 'quantity', align: 'end' },
    { title: 'Days Supply', key: 'daysSupply', align: 'end' },
    { title: 'Estimated Cost', key: 'cost', align: 'start' },
    { title: 'Status', key: 'status' },
    { title: 'Assistance', key: 'assistanceRequested', align: 'center', sortable: false },
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
const claimsData = ref([
  { id: 157826931, eocId: 'EOC30021', accountName: 'Company A', drugName: 'Drug A', ndc: '00071-0155-23', claimDate: '2025-07-15', quantity: 1, daysSupply: 30, cost: '$12,450.00', status: 'Pending', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null },
  { id: 158088181, eocId: 'EOC30047', accountName: 'Company B', drugName: 'Drug B', ndc: '00069-0944-30', claimDate: '2025-07-14', quantity: 2, daysSupply: 90, cost: '$45,800.00', status: 'Acknowledged', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null },
  { id: 158480891, eocId: 'EOC30058', accountName: 'Company C', drugName: 'Drug C', ndc: '00078-0421-15', claimDate: '2025-07-13', quantity: 4, daysSupply: 30, cost: '$18,750.00', status: 'Pending', notes: 'Can you confirm if a savings program applies to this claim?' as string | null, requestedBy: 'Jane Doe' as string | null, requestedDate: '2025-07-16' as string | null },
  { id: 152987510, eocId: 'EOC30063', accountName: 'Company D', drugName: 'Drug D', ndc: '00006-0749-31', claimDate: '2025-07-12', quantity: 1, daysSupply: 28, cost: '$92,300.00', status: 'Acknowledged', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null },
  { id: 153219641, eocId: 'EOC30079', accountName: 'Company E', drugName: 'Drug E', ndc: '00173-0879-00', claimDate: '2025-07-11', quantity: 3, daysSupply: 84, cost: '$61,200.00', status: 'Pending', notes: null as string | null, requestedBy: null as string | null, requestedDate: null as string | null },
]);

// The checkbox itself only grays out once a claim is fully wrapped up —
// Acknowledged AND already has an assistance request. Otherwise there's
// still something to bulk-act on (e.g. an Acknowledged claim can still be
// selected to bulk-request assistance). The kebab's Acknowledge item is
// available any time a claim is still Pending — Pending means only "not
// yet acknowledged by the client," nothing more.
// Every claim row stays selectable regardless of status or prior assistance
// requests — Request Clinical Assistance is always available (even after
// Acknowledge, and even if a request is already open), so a claim never
// reaches a state with nothing left to do.
const tableItems = computed(() =>
  filteredClaimsData.value.map(claim => {
    const assistanceRequested = !!claim.notes;
    return {
      ...claim,
      assistanceRequested,
      canAcknowledge: claim.status !== 'Acknowledged',
    };
  })
);

const parseCost = (cost: string) => {
  const value = parseFloat(cost.replace(/[^0-9.-]+/g, ''));
  return isNaN(value) ? 0 : value;
};

// "Pending" is purely a portal-action state — it means the client hasn't
// acknowledged the claim yet, not a clinical/claim-processing status.
const claimsPendingAcknowledgmentCount = computed(() => claimsData.value.filter(c => c.status === 'Pending').length);

const totalClaimsCost = computed(() => {
  const total = claimsData.value.reduce((sum, claim) => sum + parseCost(claim.cost), 0);
  return `${total.toFixed(2)}`;
});

const averageClaimCost = computed(() => {
  if (claimsData.value.length === 0) return '0.00';
  const total = claimsData.value.reduce((sum, claim) => sum + parseCost(claim.cost), 0);
  return `${(total / claimsData.value.length).toFixed(2)}`;
});

// === ACKNOWLEDGE (single or bulk, always via checkbox selection) === //

const showAcknowledgeDialog = ref(false);
const pendingAcknowledgeItems = ref<any[]>([]);

const acknowledgeDialogHeading = computed(() =>
  pendingAcknowledgeItems.value.length > 1 ? 'Acknowledge High-Cost Claims' : 'Acknowledge High-Cost Claim'
);

// "Acknowledge Selected" hides entirely when none of the selected claims are
// still eligible (mirrors Test Results' isBulkActionAvailable pattern) —
// Request Clinical Assistance has no such gate since it's always available.
const isBulkAcknowledgeAvailable = (items: any[]) => items.some(item => item.canAcknowledge);

const handleBulkAcknowledgeClick = (items: any[]) => {
  // Claims already Acknowledged are excluded from the dialog list and from
  // the snackbar's count — only claims actually being acknowledged by this
  // action are shown/counted (Story #34913).
  pendingAcknowledgeItems.value = items.filter(item => item.canAcknowledge);
  showAcknowledgeDialog.value = true;
};

const confirmAcknowledge = () => {
  // pendingAcknowledgeItems holds rows from tableItems, a computed that
  // spreads {...claim} into new plain objects on every recompute — mutating
  // those directly never reaches claimsData, so look the real item up by id
  // and mutate that instead.
  const acknowledgedIds = pendingAcknowledgeItems.value.map(claim => claim.id);
  claimsData.value.forEach(claim => {
    if (acknowledgedIds.includes(claim.id)) {
      claim.status = 'Acknowledged';
    }
  });
  const count = pendingAcknowledgeItems.value.length;
  showAcknowledgeDialog.value = false;
  claimsTable.value?.clearSelection();
  successSnackbarText.value = `${count} claim${count > 1 ? 's' : ''} acknowledged successfully`;
  showSuccessSnackbar.value = true;
  pendingAcknowledgeItems.value = [];
};

const acknowledgeDialogActions = [
  { text: 'Cancel', onClick: () => (showAcknowledgeDialog.value = false), styleType: 'secondary' as const },
  { text: 'Acknowledge', onClick: confirmAcknowledge, color: 'primary', variant: 'flat' as const },
];

// === REQUEST CLINICAL ASSISTANCE (single row icon, or bulk) === //

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
  claimsData.value.forEach(claim => {
    if (requestedIds.includes(claim.id)) {
      claim.notes = assistanceNotes.value;
      claim.requestedBy = requestedBy;
      claim.requestedDate = requestedDate;
    }
  });
  const count = pendingAssistanceItems.value.length;
  showAssistanceDialog.value = false;
  claimsTable.value?.clearSelection();
  successSnackbarText.value = `Clinical assistance request sent for ${count} claim${count > 1 ? 's' : ''}`;
  showSuccessSnackbar.value = true;
  pendingAssistanceItems.value = [];
};

const assistanceDialogActions = computed(() => [
  { text: 'Cancel', onClick: () => (showAssistanceDialog.value = false), styleType: 'secondary' as const },
  { text: 'Send Request', onClick: confirmAssistanceRequest, color: 'primary', variant: 'flat' as const, disabled: assistanceNotes.value.trim() === '' },
]);

// The assistance indicator's tooltip shows the requestor and date of the
// most recent request — same for external and internal, no separate
// internal-only view. See formatRequestedDate below.
const formatRequestedDate = (dateString: string | null) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const rowActionItems = [
  { label: 'Acknowledge', action: 'acknowledge' },
  { label: 'Request Clinical Assistance', action: 'assistance' },
];

const rowActionDisabled = (item: any, actionItem: { action: string }) => {
  if (actionItem.action === 'acknowledge') {
    return !item.canAcknowledge;
  }
  return false;
};

const handleRowAction = ({ action, item }: { action: string; item: any }) => {
  if (action === 'acknowledge') handleBulkAcknowledgeClick([item]);
  else if (action === 'assistance') openAssistanceDialog([item]);
};

const showSuccessSnackbar = ref(false);
const successSnackbarText = ref('');

// === FILTERS === //
// No Status filter — with only Pending/Acknowledged, sorting the Status
// column covers it. Cost is an independent min/max range rather than preset
// tiers, since every claim here is already above the account's NotifyAmount
// threshold ($10,000 by default) — fixed low-dollar breakpoints don't mean
// anything at this altitude, and min/max lets either bound be set alone or
// both together.

const hccFilters = computed<FilterGroup[]>(() => [
  { type: 'account', label: 'Account', multiselect: true, options: [], modelValue: null },
  { type: 'dateRange', label: 'Date of Service Range', multiselect: false, options: [], modelValue: null },
  { type: 'cost', label: 'Cost Range', multiselect: false, options: [], modelValue: null },
]);

const claimsSearchTerm = ref('');

const isAdvancedFiltersOpen = ref(false);

const appliedAccounts = ref<string[]>([]);
const appliedDateFrom = ref('');
const appliedDateTo = ref('');
const appliedMinCost = ref<number | null>(null);
const appliedMaxCost = ref<number | null>(null);

const dialogAccounts = ref<string[]>([]);
const dialogDateFrom = ref('');
const dialogDateTo = ref('');
const dialogMinCost = ref<string>('');
const dialogMaxCost = ref<string>('');

const accountSearch = ref('');
const showAccountList = ref(false);

const accountOptions = computed(() => [...new Set(claimsData.value.map(c => c.accountName))].sort());
const filteredAccountOptions = computed(() => {
  const q = accountSearch.value?.toLowerCase() ?? '';
  return accountOptions.value.filter(a => a.toLowerCase().includes(q));
});

const toggleAccount = (account: string) => {
  dialogAccounts.value = dialogAccounts.value.includes(account)
    ? dialogAccounts.value.filter(a => a !== account)
    : [...dialogAccounts.value, account];
};

const handleAccountPickerBlur = () => {
  setTimeout(() => { showAccountList.value = false; }, 150);
};

const openFilters = () => {
  dialogAccounts.value = [...appliedAccounts.value];
  dialogDateFrom.value = appliedDateFrom.value;
  dialogDateTo.value = appliedDateTo.value;
  dialogMinCost.value = appliedMinCost.value != null ? String(appliedMinCost.value) : '';
  dialogMaxCost.value = appliedMaxCost.value != null ? String(appliedMaxCost.value) : '';
  accountSearch.value = '';
  showAccountList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedAccounts.value = [...dialogAccounts.value];
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

.disclaimer-text {
  color: $color-neutral-disabled;
}

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

.assistance-requested-icon {
  color: $color-link;

  &--clickable {
    cursor: pointer;
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
