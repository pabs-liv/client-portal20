<template>
  <div class="caa-reports-page">
    <AccountSelector
      heading="CAA Reports"
      subheading="Select an account to view and download its CAA Report - RxDC files."
      :items="accountOptions"
      label="Select Account"
      item-title="name"
      item-value="id"
      :searchable="true"
      v-model="selectedAccount"
      variant="outlined"
    />
    <div v-if="selectedAccount">
      <PageCard
        header-text="CAA Report - RxDC"
        description-text="Browse and download RxDC data files (D3-D8) by section and plan year."
      >
        <div class="caa-cta-row">
          <a
            class="button button-secondary caa-narrative-cta"
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
          :default-sort-by="[{ key: 'fileName', order: 'asc' }]"
          :items-per-page="10"
          :items-per-page-options="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
          ]"
        >
          <template #empty-state>
            <div v-if="isFilteredToZero" class="caa-no-results">No records found</div>
            <div v-else class="caa-empty-state">
              <img :src="EmptyStateImg" alt="No data" class="caa-empty-icon" />
              <p class="caa-empty-title">No CAA reports available</p>
              <p class="caa-empty-subtitle">No CAA Report - RxDC files have been added for this account yet.</p>
            </div>
          </template>
        </ReportDataTable>
      </PageCard>
    </div>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="caaFilters"
      :icon="SlidersHorizontal"
      heading="CAA Report Filters"
      :actions="advancedFiltersDialogActions"
    >
      <template #filter-section="{ filter }">
        <div v-if="dialogSections.length > 0" class="selected-chips">
          <v-chip
            v-for="section in dialogSections"
            :key="section"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ section }}
            <span class="chip-close" @click.stop="dialogSections = dialogSections.filter(s => s !== section)">
              <X :size="8" :stroke-width="3" />
            </span>
          </v-chip>
        </div>
        <div class="account-picker-wrap" ref="sectionPickerRef">
          <div class="account-search-field" :class="{ 'account-search-field--active': showSectionList }">
            <input
              v-model="sectionSearch"
              type="text"
              class="account-search-input"
              :placeholder="filter.label"
              @mousedown="openSectionList"
              @blur="handleSectionPickerBlur"
            />
          </div>
          <Teleport to="body">
            <div v-if="showSectionList" class="account-dropdown" :style="sectionDropdownStyle">
              <div
                v-for="section in filteredSectionOptions"
                :key="section"
                class="account-option"
                @mousedown.prevent
                @click="toggleSection(section)"
              >
                <div class="acct-checkbox" :class="{ active: dialogSections.includes(section) }">
                  <Check v-if="dialogSections.includes(section)" :size="12" :stroke-width="3" />
                </div>
                <span>{{ section }}</span>
              </div>
              <div v-if="filteredSectionOptions.length === 0" class="no-acct-results">
                No sections found
              </div>
            </div>
          </Teleport>
        </div>
      </template>
      <template #filter-planYear="{ filter }">
        <div v-if="dialogPlanYears.length > 0" class="selected-chips">
          <v-chip
            v-for="year in dialogPlanYears"
            :key="year"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ year }}
            <span class="chip-close" @click.stop="dialogPlanYears = dialogPlanYears.filter(y => y !== year)">
              <X :size="8" :stroke-width="3" />
            </span>
          </v-chip>
        </div>
        <div class="account-picker-wrap" ref="planYearPickerRef">
          <div class="account-search-field" :class="{ 'account-search-field--active': showPlanYearList }">
            <input
              v-model="planYearSearch"
              type="text"
              class="account-search-input"
              :placeholder="filter.label"
              @mousedown="openPlanYearList"
              @blur="handlePlanYearPickerBlur"
            />
          </div>
          <Teleport to="body">
            <div v-if="showPlanYearList" class="account-dropdown" :style="planYearDropdownStyle">
              <div
                v-for="year in filteredPlanYearOptions"
                :key="year"
                class="account-option"
                @mousedown.prevent
                @click="togglePlanYear(String(year))"
              >
                <div class="acct-checkbox" :class="{ active: dialogPlanYears.includes(String(year)) }">
                  <Check v-if="dialogPlanYears.includes(String(year))" :size="12" :stroke-width="3" />
                </div>
                <span>{{ year }}</span>
              </div>
              <div v-if="filteredPlanYearOptions.length === 0" class="no-acct-results">
                No plan years found
              </div>
            </div>
          </Teleport>
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
import { SlidersHorizontal, FileDown, Check, X } from 'lucide-vue-next';
import EmptyStateImg from '@/assets/EmptyState.svg';
import PageCard from '@/components/common/PageCard.vue';
import AccountSelector from '@/components/common/AccountSelector.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';

// The Advanced Filters dialog (AdvancedFiltersDialog.vue) is a Vuetify v-card, which
// clips overflow by default (for its rounded corners) — a plain position: absolute
// dropdown gets cut off at the card edge. Teleporting the dropdown panel to <body> and
// positioning it via getBoundingClientRect avoids that without touching the shared
// dialog component (which Reports/Documents also use, unmodified, for their own
// account-picker-style filters).
const sectionPickerRef = ref<HTMLElement | null>(null);
const planYearPickerRef = ref<HTMLElement | null>(null);
const sectionDropdownStyle = ref<Record<string, string>>({});
const planYearDropdownStyle = ref<Record<string, string>>({});

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

// Same account list used on Documents/Reports, for prototype consistency.
const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);

const selectedAccountName = computed(() =>
  accountOptions.value.find(acc => acc.id === selectedAccount.value)?.name ?? ''
);

const caaHeaders = ref([
  { title: 'File Name', key: 'fileName' },
  { title: 'Section', key: 'section' },
  { title: 'Plan Year', key: 'planYear' },
  { title: '', key: 'actions', sortable: false },
]);

// Section and Plan Year are real fields here (unlike the old portal, where they
// were never more than text baked into the file name) so they can actually be
// filtered/sorted on.
const allCaaItems = ref([
  { id: 1, fileName: 'D3-Top 50 Most Frequent Brand Drugs 2021 for Advanced Concrete Technologies.csv', section: 'D3', planYear: 2021, accountName: 'Stark Industries' },
  { id: 2, fileName: 'D4-Top 50 Most Costly Drugs 2021 for Advanced Concrete Technologies.csv', section: 'D4', planYear: 2021, accountName: 'Stark Industries' },
  { id: 3, fileName: 'D5-Top 50 Drugs by Spending Increase 2021 for Advanced Concrete Technologies.csv', section: 'D5', planYear: 2021, accountName: 'Stark Industries' },
  { id: 4, fileName: 'D6-Rx Totals 2021 for Advanced Concrete Technologies.csv', section: 'D6', planYear: 2021, accountName: 'Stark Industries' },
  { id: 5, fileName: 'D7-Rx Rebates by Therapeutic Class 2021 for Advanced Concrete Technologies.csv', section: 'D7', planYear: 2021, accountName: 'Stark Industries' },
  { id: 6, fileName: 'D8-Rx Rebates for the Top 25 Drugs 2021 for Advanced Concrete Technologies.csv', section: 'D8', planYear: 2021, accountName: 'Stark Industries' },
  { id: 7, fileName: 'D3-Top 50 Most Frequent Brand Drugs 2022 for Wayne Enterprises.csv', section: 'D3', planYear: 2022, accountName: 'Wayne Enterprises' },
  { id: 8, fileName: 'D6-Rx Totals 2022 for Wayne Enterprises.csv', section: 'D6', planYear: 2022, accountName: 'Wayne Enterprises' },
  { id: 9, fileName: 'D7-Rx Rebates by Therapeutic Class 2022 for Wayne Enterprises.csv', section: 'D7', planYear: 2022, accountName: 'Wayne Enterprises' },
  { id: 10, fileName: 'D8-Rx Rebates for the Top 25 Drugs 2023 for Cyberdyne Systems.csv', section: 'D8', planYear: 2023, accountName: 'Cyberdyne Systems' },
  { id: 11, fileName: 'D4-Top 50 Most Costly Drugs 2023 for Cyberdyne Systems.csv', section: 'D4', planYear: 2023, accountName: 'Cyberdyne Systems' },
]);

const accountCaaItems = computed(() => {
  if (!selectedAccount.value) return [];
  return allCaaItems.value.filter(item => item.accountName === selectedAccountName.value);
});

// Advanced Filters — same pattern as Reports/Documents.
const isAdvancedFiltersOpen = ref(false);
const caaSearchTerm = ref('');

const appliedSections = ref<string[]>([]);
const appliedPlanYears = ref<string[]>([]);

const dialogSections = ref<string[]>([]);
const dialogPlanYears = ref<string[]>([]);

const sectionOptions = computed(() =>
  [...new Set(allCaaItems.value.map(item => item.section))].sort()
);

const planYearOptions = computed(() =>
  [...new Set(allCaaItems.value.map(item => item.planYear))].sort((a, b) => b - a)
);

const sectionSearch = ref('');
const showSectionList = ref(false);

const filteredSectionOptions = computed(() => {
  const q = sectionSearch.value?.toLowerCase() ?? '';
  return sectionOptions.value.filter(s => s.toLowerCase().includes(q));
});

const toggleSection = (section: string) => {
  dialogSections.value = dialogSections.value.includes(section)
    ? dialogSections.value.filter(s => s !== section)
    : [...dialogSections.value, section];
};

const openSectionList = () => {
  showSectionList.value = true;
  nextTick(() => {
    sectionDropdownStyle.value = positionDropdown(sectionPickerRef.value);
  });
};

const handleSectionPickerBlur = () => {
  setTimeout(() => { showSectionList.value = false; }, 150);
};

const planYearSearch = ref('');
const showPlanYearList = ref(false);

const filteredPlanYearOptions = computed(() => {
  const q = planYearSearch.value?.toLowerCase() ?? '';
  return planYearOptions.value.filter(y => String(y).toLowerCase().includes(q));
});

const togglePlanYear = (year: string) => {
  dialogPlanYears.value = dialogPlanYears.value.includes(year)
    ? dialogPlanYears.value.filter(y => y !== year)
    : [...dialogPlanYears.value, year];
};

const openPlanYearList = () => {
  showPlanYearList.value = true;
  nextTick(() => {
    planYearDropdownStyle.value = positionDropdown(planYearPickerRef.value);
  });
};

const handlePlanYearPickerBlur = () => {
  setTimeout(() => { showPlanYearList.value = false; }, 150);
};

const openFilters = () => {
  dialogSections.value = [...appliedSections.value];
  dialogPlanYears.value = [...appliedPlanYears.value];
  sectionSearch.value = '';
  showSectionList.value = false;
  planYearSearch.value = '';
  showPlanYearList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedSections.value = [...dialogSections.value];
  appliedPlanYears.value = [...dialogPlanYears.value];
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
  { type: 'section', label: 'Section', multiselect: true, options: [], modelValue: null },
  { type: 'planYear', label: 'Plan Year', multiselect: true, options: [], modelValue: null },
]);

const activeFilterPills = computed<FilterPill[]>(() => {
  const pills: FilterPill[] = [];
  appliedSections.value.forEach(section => {
    pills.push({ type: 'section', value: section, label: `Section: ${section}`, isActive: true });
  });
  appliedPlanYears.value.forEach(year => {
    pills.push({ type: 'planYear', value: year, label: `Plan Year: ${year}`, isActive: true });
  });
  return pills;
});

const handleFilterPillClose = (pill: FilterPill) => {
  if (pill.type === 'section') {
    appliedSections.value = appliedSections.value.filter(s => s !== pill.value);
  } else if (pill.type === 'planYear') {
    appliedPlanYears.value = appliedPlanYears.value.filter(y => y !== pill.value);
  }
};

const filteredCaaItems = computed(() => {
  let items = accountCaaItems.value;

  if (caaSearchTerm.value) {
    const q = caaSearchTerm.value.toLowerCase();
    items = items.filter(item => item.fileName.toLowerCase().includes(q));
  }
  if (appliedSections.value.length > 0) {
    items = items.filter(item => appliedSections.value.includes(item.section));
  }
  if (appliedPlanYears.value.length > 0) {
    items = items.filter(item => appliedPlanYears.value.includes(String(item.planYear)));
  }

  return items;
});

// True only when search/filters are the reason the table is empty — the account
// itself has CAA files, they're just all filtered out right now.
const isFilteredToZero = computed(() =>
  accountCaaItems.value.length > 0 && filteredCaaItems.value.length === 0
);

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

// CTA sits in its own row above search/filters, matching Documents' +Add Document
// placement — a static, always-available link rather than a table row action,
// since it isn't tied to any Section/PlanYear filtering below it.
.caa-cta-row {
  display: flex;
  justify-content: flex-end;
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

.caa-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xlarge $spacing-medium;
  gap: $spacing-xsmall;
  text-align: center;
}

.caa-empty-icon {
  width: 160px;
  margin-bottom: $spacing-small;
}

.caa-empty-title {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0;
}

.caa-empty-subtitle {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: 0 0 $spacing-small;
}
</style>
