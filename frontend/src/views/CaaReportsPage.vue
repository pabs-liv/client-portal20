<template>
  <div class="caa-reports-page">
    <h1 class="text-h1 mb-large">CAA Reports</h1>
    <PageCard
      header-text="CAA Report - RxDC"
      description-text="Browse and download RxDC data files by account and reporting period."
    >
      <Banner
        variant="info"
        always-show
        message="To update your CAA reporting preference, go to <strong>Settings</strong> in the sidebar and select the <strong>CAA Drug Cost Reporting</strong> tab, or use the button below."
        class="caa-preference-banner"
      />
      <div class="caa-cta-row">
        <button type="button" class="button button-secondary" @click="goToCaaSettings">
          <MonitorCog :size="16" :stroke-width="1.5" />
          Go to CAA Settings
        </button>
        <a
          class="button button-secondary"
          href="/Content/Documents/2025 Narrative Responses.pdf"
          title="Download RxDC Narrative Response"
          target="_blank"
        >
          <FileDown :size="16" :stroke-width="1.5" />
          Download RxDC Narrative Response
        </a>
      </div>
      <div class="search-filter-row">
        <div class="search-bar-wrapper">
          <SearchBar
            @update:searchTerm="caaSearchTerm = $event"
            placeholder="Search by file name"
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
        :headers="caaHeaders"
        :items="filteredCaaItems"
        :show-search-bar="false"
        :show-filter-pills="false"
        :show-selection-checkboxes="true"
        :show-row-actions="true"
        :row-action-items="caaRowActions"
        @row-action="handleCaaRowAction"
        @bulk-download="handleBulkDownload"
        :default-sort-by="[{ key: 'startDate', order: 'desc' }]"
        :custom-key-sort="caaCustomKeySort"
        :items-per-page="10"
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
        ]"
      >
        <template #empty-state>
          <div class="caa-no-results">No CAA reports found</div>
        </template>
      </ReportDataTable>
    </PageCard>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="caaFilters"
      :icon="SlidersHorizontal"
      heading="CAA Report Filters"
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
        <div class="account-picker-wrap" ref="accountPickerRef">
          <div class="account-search-field" :class="{ 'account-search-field--active': showAccountList }">
            <input
              v-model="accountSearch"
              type="text"
              class="account-search-input"
              :placeholder="filter.label"
              @mousedown="openAccountList"
              @blur="handleAccountPickerBlur"
            />
          </div>
          <Teleport to="body">
            <div v-if="showAccountList" class="account-dropdown" :style="accountDropdownStyle">
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
          </Teleport>
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

    <v-snackbar v-model="showDownloadSnackbar" :timeout="3000" color="success">
      {{ downloadSnackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { SlidersHorizontal, FileDown, MonitorCog, Check, X } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Banner from '@/components/common/Banner.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

const router = useRouter();

const goToCaaSettings = () => {
  router.push('/settings?tab=caa-drug-cost-reporting');
};

// The Advanced Filters dialog (AdvancedFiltersDialog.vue) is a Vuetify v-card, which
// clips overflow by default (for its rounded corners) — a plain position: absolute
// dropdown gets cut off at the card edge. Teleporting the dropdown panel to <body> and
// positioning it via getBoundingClientRect avoids that without touching the shared
// dialog component (which Reports/Documents also use, unmodified, for their own
// account-picker-style filters — Date Range uses Vuetify's own v-menu/DatePicker here,
// which already teleports internally, so it needs no equivalent fix).
const accountPickerRef = ref<HTMLElement | null>(null);
const accountDropdownStyle = ref<Record<string, string>>({});

const positionDropdown = (anchor: HTMLElement | null) => {
  if (!anchor) return {};
  const rect = anchor.getBoundingClientRect();
  return {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  };
};

const caaHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'File Name', key: 'fileName' },
  { title: 'Start Date', key: 'startDate' },
  { title: 'End Date', key: 'endDate' },
  { title: '', key: 'actions', sortable: false },
]);

// Per Alex: no account gating — this is a cross-account explorer like Reports, not a
// single-account file list like Documents. Section (D3-D8) is dropped in favor of a
// real reporting-period Start Date/End Date, which is what actually varies per file
// rather than a fixed calendar year.
const allCaaItems = ref([
  { id: 1, fileName: 'D3-Top 50 Most Frequent Brand Drugs for Stark Industries.csv', startDate: '1/1/2021', endDate: '12/31/2021', accountName: 'Stark Industries' },
  { id: 2, fileName: 'D4-Top 50 Most Costly Drugs for Stark Industries.csv', startDate: '1/1/2021', endDate: '12/31/2021', accountName: 'Stark Industries' },
  { id: 3, fileName: 'D5-Top 50 Drugs by Spending Increase for Stark Industries.csv', startDate: '1/1/2021', endDate: '12/31/2021', accountName: 'Stark Industries' },
  { id: 4, fileName: 'D6-Rx Totals for Stark Industries.csv', startDate: '1/1/2021', endDate: '12/31/2021', accountName: 'Stark Industries' },
  { id: 5, fileName: 'D7-Rx Rebates by Therapeutic Class for Stark Industries.csv', startDate: '1/1/2021', endDate: '12/31/2021', accountName: 'Stark Industries' },
  { id: 6, fileName: 'D8-Rx Rebates for the Top 25 Drugs for Stark Industries.csv', startDate: '1/1/2021', endDate: '12/31/2021', accountName: 'Stark Industries' },
  { id: 7, fileName: 'D3-Top 50 Most Frequent Brand Drugs for Wayne Enterprises.csv', startDate: '1/1/2022', endDate: '12/31/2022', accountName: 'Wayne Enterprises' },
  { id: 8, fileName: 'D6-Rx Totals for Wayne Enterprises.csv', startDate: '1/1/2022', endDate: '12/31/2022', accountName: 'Wayne Enterprises' },
  { id: 9, fileName: 'D7-Rx Rebates by Therapeutic Class for Wayne Enterprises.csv', startDate: '1/1/2022', endDate: '12/31/2022', accountName: 'Wayne Enterprises' },
  { id: 10, fileName: 'D8-Rx Rebates for the Top 25 Drugs for Cyberdyne Systems.csv', startDate: '1/1/2023', endDate: '12/31/2023', accountName: 'Cyberdyne Systems' },
  { id: 11, fileName: 'D4-Top 50 Most Costly Drugs for Cyberdyne Systems.csv', startDate: '1/1/2023', endDate: '12/31/2023', accountName: 'Cyberdyne Systems' },
]);

// Advanced Filters — same pattern as Reports' Account + Date Range filters.
const isAdvancedFiltersOpen = ref(false);
const caaSearchTerm = ref('');

const appliedAccounts = ref<string[]>([]);
const appliedDateFrom = ref('');
const appliedDateTo = ref('');

const dialogAccounts = ref<string[]>([]);
const dialogDateFrom = ref('');
const dialogDateTo = ref('');

const accountOptions = computed(() =>
  [...new Set(allCaaItems.value.map(item => item.accountName))].sort()
);

const accountSearch = ref('');
const showAccountList = ref(false);

const filteredAccountOptions = computed(() => {
  const q = accountSearch.value?.toLowerCase() ?? '';
  return accountOptions.value.filter(a => a.toLowerCase().includes(q));
});

const toggleAccount = (account: string) => {
  dialogAccounts.value = dialogAccounts.value.includes(account)
    ? dialogAccounts.value.filter(a => a !== account)
    : [...dialogAccounts.value, account];
};

const openAccountList = () => {
  showAccountList.value = true;
  nextTick(() => {
    accountDropdownStyle.value = positionDropdown(accountPickerRef.value);
  });
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

const advancedFiltersDialogActions = [
  { text: 'Cancel', type: 'cancel' as const, onClick: cancelFilters },
  { text: 'Apply Filters', type: 'confirm' as const, onClick: applyFilters },
];

const caaFilters = reactive<FilterGroup[]>([
  { type: 'account', label: 'Account', multiselect: true, options: [], modelValue: null },
  { type: 'dateRange', label: 'Start Date Range', multiselect: false, options: [], modelValue: null },
]);

const parseMDYYYY = (dateStr: string): number => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const formatDateDisplay = (dateStr: string): string => {
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? dateStr : parsed.toLocaleDateString();
};

const caaCustomKeySort = {
  startDate: (a: string, b: string) => parseMDYYYY(a) - parseMDYYYY(b),
  endDate: (a: string, b: string) => parseMDYYYY(a) - parseMDYYYY(b),
};

const activeFilterPills = computed<FilterPill[]>(() => {
  const pills: FilterPill[] = [];
  appliedAccounts.value.forEach(acct => {
    pills.push({ type: 'account', value: acct, label: acct, isActive: true });
  });
  if (appliedDateFrom.value || appliedDateTo.value) {
    const parts = [appliedDateFrom.value, appliedDateTo.value].filter(Boolean).map(formatDateDisplay);
    pills.push({ type: 'dateRange', value: null, label: `Start Date Range: ${parts.join(' – ')}`, isActive: true });
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

const filteredCaaItems = computed(() => {
  let items = allCaaItems.value;

  if (caaSearchTerm.value) {
    const q = caaSearchTerm.value.toLowerCase();
    items = items.filter(item => item.fileName.toLowerCase().includes(q));
  }
  if (appliedAccounts.value.length > 0) {
    items = items.filter(item => appliedAccounts.value.includes(item.accountName));
  }
  if (appliedDateFrom.value || appliedDateTo.value) {
    items = items.filter(item => {
      // Filters on startDate only for now — a true start/end range filter is tracked
      // as a follow-up story across every page with this pattern (Reports, Test
      // Results, etc.), not just here.
      const start = parseMDYYYY(item.startDate);
      if (appliedDateFrom.value && start < parseMDYYYY(appliedDateFrom.value)) return false;
      if (appliedDateTo.value && start > parseMDYYYY(appliedDateTo.value)) return false;
      return true;
    });
  }

  return items;
});

const caaRowActions = [
  { label: 'Download', action: 'download' },
];

const showDownloadSnackbar = ref(false);
const downloadSnackbarText = ref('');

const handleCaaRowAction = ({ action, item }: { action: string; item: { id: number; fileName: string } }) => {
  if (action === 'download') {
    downloadSnackbarText.value = `${item.fileName} downloaded successfully!`;
    showDownloadSnackbar.value = true;
  }
};

const handleBulkDownload = (items: { fileName: string }[]) => {
  downloadSnackbarText.value = items.length === 1
    ? `${items[0].fileName} downloaded successfully!`
    : `${items.length} files downloaded successfully!`;
  showDownloadSnackbar.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.caa-reports-page {
  display: flex;
  flex-direction: column;
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
  margin-top: $spacing-xsmall;
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

// Teleported to <body> (see positionDropdown in script) so the Advanced Filters
// dialog's own overflow: hidden can't clip it — position/top/left/width all come from
// the inline :style binding, computed from the input's bounding box. z-index just needs
// to clear Vuetify's dialog overlay (~2400) since this no longer shares a stacking
// context with the card at all.
.account-dropdown {
  z-index: 2500;
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

// Banner sits above the CTAs, which sit above search/filters — same placement as
// Documents' +Add Document CTA row. Both buttons sit side by side, right-aligned,
// rather than stacked/centered, matching the app's established CTA convention.
.caa-preference-banner {
  margin-bottom: $spacing-medium;
}

.caa-cta-row {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-medium;
  margin-bottom: $spacing-medium;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xsmall;
  padding: $spacing-small $spacing-medium;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: $font-family-base;
  font-size: $font-size-body;
  line-height: 120%;
  font-weight: $font-weight-normal;
  transition: background-color 0.2s, opacity 0.2s;
  white-space: nowrap;
  border-radius: 100px;
  text-decoration: none;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.button-secondary {
  background-color: transparent;
  border-color: $color-primary;
  color: $color-primary;
}

.caa-no-results {
  text-align: center;
  padding: $spacing-medium;
  color: $color-text-secondary;
  font-size: $font-size-body;
}
</style>
