<template>
  <div class="documents-page">
    <AccountSelector
      heading="Documents"
      subheading="Select an account to view and manage its documents."
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
        header-text="Document Explorer"
        :description-text="pageDescription"
      >
        <div class="search-filter-row">
          <div class="search-bar-wrapper">
            <SearchBar
              @update:searchTerm="documentSearchTerm = $event"
              placeholder="Search by document name"
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
        <Tabs :tabs="documentTabs" @tab-selected="handleTabSelected" class="mb-large" />
        <div v-if="filteredDocumentItems.length > 0" class="doc-upload-cta-row">
          <button class="button button-primary" @click="openUploadModal">+ Add Documents</button>
        </div>
        <ReportDataTable
          :headers="documentHeaders"
          :items="filteredDocumentItems"
          :show-search-bar="false"
          :show-filter-pills="false"
          :show-selection-checkboxes="true"
          :show-row-actions="true"
          :row-action-items="documentRowActions"
          @row-action="handleDocumentRowAction"
          @bulk-download="handleBulkDownload"
        >
          <template #empty-state>
            <div v-if="isFilteredToZero" class="doc-no-results">No records found</div>
            <div v-else class="doc-empty-state">
              <img :src="EmptyStateImg" alt="No data" class="doc-empty-icon" />
              <p class="doc-empty-title">Nothing to see here</p>
              <p class="doc-empty-subtitle">No documents have been uploaded yet.</p>
              <button class="button button-secondary" @click="openUploadModal">+ Add Documents</button>
            </div>
          </template>
        </ReportDataTable>
      </PageCard>
    </div>

    <AdvancedFiltersDialog
      v-model="isAdvancedFiltersOpen"
      :filters="documentFilters"
      :icon="SlidersHorizontal"
      heading="Document Filters"
      :actions="advancedFiltersDialogActions"
    >
      <template #filter-modifiedBy="{ filter }">
        <p class="filter-section-label">{{ filter.label }}</p>
        <div v-if="dialogModifiedBy.length > 0" class="selected-chips">
          <v-chip
            v-for="person in dialogModifiedBy"
            :key="person"
            variant="flat"
            color="primary"
            class="autocomplete-chip"
          >
            {{ person }}
            <span class="chip-close" @click.stop="dialogModifiedBy = dialogModifiedBy.filter(p => p !== person)">
              <X :size="8" :stroke-width="3" />
            </span>
          </v-chip>
        </div>
        <div class="account-picker-wrap">
          <div class="account-search-field" :class="{ 'account-search-field--active': showModifiedByList }">
            <input
              v-model="modifiedBySearch"
              type="text"
              class="account-search-input"
              placeholder="Search by name"
              @mousedown="showModifiedByList = true"
              @blur="handleModifiedByPickerBlur"
            />
          </div>
          <div v-if="showModifiedByList" class="account-dropdown">
            <div
              v-for="person in filteredModifiedByOptions"
              :key="person"
              class="account-option"
              @mousedown.prevent
              @click="toggleModifiedBy(person)"
            >
              <div class="acct-checkbox" :class="{ active: dialogModifiedBy.includes(person) }">
                <Check v-if="dialogModifiedBy.includes(person)" :size="12" :stroke-width="3" />
              </div>
              <span>{{ person }}</span>
            </div>
            <div v-if="filteredModifiedByOptions.length === 0" class="no-acct-results">
              No results found
            </div>
          </div>
        </div>
      </template>
      <template #filter-dateRange>
        <p class="filter-section-label">Upload Date Range</p>
        <div class="date-range-row">
          <DatePicker label="From" v-model="dialogDateFrom" />
          <DatePicker label="To" v-model="dialogDateTo" />
        </div>
      </template>
    </AdvancedFiltersDialog>

    <!-- Add Documents modal — account/category are locked from whichever tab it was opened
         from (not editable here), so an upload can never be misdirected to the wrong
         account or category. Same persistent-dialog pattern as Plan Explorer > Network
         Configuration's "+ Add Network Link". -->
    <Dialog
      v-model="showUploadModal"
      :persistent="true"
      :icon="CloudUpload"
      heading="Add Document"
      :actions="uploadDialogActions"
      :show-secondary-button="true"
    >
      <div class="upload-context">
        <div class="ap-field">
          <span class="ap-field-label">Account</span>
          <span class="ap-field-value">{{ selectedAccountName }}</span>
        </div>
        <div class="ap-field">
          <span class="ap-field-label">Category</span>
          <span class="ap-field-value">{{ selectedTabKey }}</span>
        </div>
      </div>

      <template v-if="stagedFileName">
        <v-chip color="primary" variant="flat" class="bl-file-chip">
          <Paperclip :size="12" :stroke-width="2" class="bl-file-chip-icon" />
          <span class="bl-file-chip-label">{{ stagedFileName }}</span>
          <span class="bl-file-chip-close" @click.stop="stagedFileName = ''"><X :size="10" :stroke-width="2.5" /></span>
        </v-chip>
      </template>
      <FileUploader v-else :show-document-type-selection="false" @file-selected="(name) => { stagedFileName = name }" />

      <template v-if="stagedFileName">
        <p v-if="selectedTabKey === 'PHI Documents'" class="text-body upload-review-line">
          This will be added to {{ selectedAccountName }}'s PHI Documents.
        </p>
        <div v-else class="ap-checkbox-toggle upload-phi-ack" @click="uploadPhiAck = !uploadPhiAck">
          <CheckSquare v-if="uploadPhiAck" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" />
          <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" />
          <span class="text-small">I confirm this document does not contain Protected Health Information (PHI). If it does, it must be uploaded under the PHI Documents tab instead.</span>
        </div>
      </template>
    </Dialog>

    <!-- Remove Document confirmation -->
    <Dialog
      v-model="showRemoveDocumentDialog"
      :icon="Trash2"
      heading="Remove Document"
      :text="`Are you sure you want to remove ${documentPendingRemoval?.documentName} from ${selectedAccountName}'s ${selectedTabKey}? This cannot be undone.`"
      :actions="removeDocumentDialogActions"
      :show-secondary-button="true"
    />
    <v-snackbar v-model="showDownloadSnackbar" :timeout="3000" color="success">
      {{ downloadSnackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { SlidersHorizontal, Check, X, CloudUpload, Paperclip, CheckSquare, Square, Trash2 } from 'lucide-vue-next';
import EmptyStateImg from '@/assets/EmptyState.svg';
import PageCard from '@/components/common/PageCard.vue';
import AccountSelector from '@/components/common/AccountSelector.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Tabs from '@/components/common/Tabs.vue';
import FileUploader from '@/components/ui/FileUploader.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import AdvancedFiltersButton from '@/components/ui/AdvancedFiltersButton.vue';
import AdvancedFiltersDialog from '@/components/common/AdvancedFiltersDialog.vue';
import FilteringPillsGroup from '@/components/ui/FilteringPillsGroup.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import Dialog from '@/components/ui/Dialog.vue';
import type { FilterGroup } from '@/types/filters';
import type { FilterPill } from '@/components/ui/FilteringPill.vue';
import { useDocumentsStore } from '@/stores/documents';

const documentsStore = useDocumentsStore();

// Same account list as Plan Explorer, since Transition of Care submissions there
// (documentsStore.addDocument calls) land in Documents > PHI Documents under these accounts.
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

// Not permission-specific on purpose — some users can upload, some can only
// download, so the copy shouldn't assume either.
const pageDescription = 'Manage documents relevant to your account.';

const documentHeaders = ref([
  { title: 'Document Name', key: 'documentName' },
  { title: 'Type', key: 'type' },
  { title: 'Upload Date', key: 'uploadDate' },
  { title: 'Uploaded By', key: 'lastModifiedBy' },
  { title: '', key: 'actions', sortable: false }, // Empty title for actions column
]);

// Categories: PHI Documents / Billing / Plan & Compliance (folds in the old MAC Appeals
// tab — appeal documentation isn't universal across clients) / General (catch-all for
// anything that doesn't fit; treated as protected/single-client like the rest, since its
// contents are unknown by definition) / Notifications. No "All Documents" — a combined
// view would let PHI rows surface in a low-friction browsing context, undoing the point
// of treating PHI as specially protected.
const allDocumentItems = ref([
  { id: 1, documentName: '2025 Benefit Guide', type: 'pdf', uploadDate: '2025-01-15', lastModifiedBy: 'Jane Smith', status: 'Published', category: 'Plan & Compliance', accountName: 'Stark Industries' },
  { id: 2, documentName: 'Q1 2025 Performance Report', type: 'xls', uploadDate: '2025-04-01', lastModifiedBy: 'John Doe', status: 'Published', category: 'Billing', accountName: 'Wayne Enterprises' },
  { id: 3, documentName: 'Pharmacy Network Update', type: 'doc', uploadDate: '2025-03-10', lastModifiedBy: 'Alice Brown', status: 'Draft', category: 'Notifications', accountName: 'Cyberdyne Systems' },
  { id: 4, documentName: 'Claim Submission Form', type: 'pdf', uploadDate: '2024-11-20', lastModifiedBy: 'Jane Smith', status: 'Published', category: 'PHI Documents', accountName: 'Stark Industries' },
  { id: 5, documentName: 'Annual Review Summary', type: 'csv', uploadDate: '2025-02-28', lastModifiedBy: 'Bob White', status: 'Published', category: 'Billing', accountName: 'Oscorp' },
  { id: 6, documentName: 'HIPAA Compliance Doc', type: 'pdf', uploadDate: '2025-06-01', lastModifiedBy: 'John Doe', status: 'Published', category: 'Plan & Compliance', accountName: 'Wayne Enterprises' },
  { id: 7, documentName: 'New User Onboarding', type: 'doc', uploadDate: '2025-07-01', lastModifiedBy: 'Alice Brown', status: 'Draft', category: 'General', accountName: 'Stark Industries' },
  { id: 8, documentName: 'MAC Appeal - Case #12345', type: 'pdf', uploadDate: '2025-06-15', lastModifiedBy: 'Jane Smith', status: 'Published', category: 'Plan & Compliance', accountName: 'Stark Industries' },
  { id: 9, documentName: 'MAC Appeal - Case #12346', type: 'pdf', uploadDate: '2025-07-02', lastModifiedBy: 'John Doe', status: 'Published', category: 'Plan & Compliance', accountName: 'Wayne Enterprises' },
  { id: 10, documentName: 'MAC Appeal - Case #12347', type: 'pdf', uploadDate: '2025-07-18', lastModifiedBy: 'Bob White', status: 'Published', category: 'Plan & Compliance', accountName: 'Cyberdyne Systems' },
  { id: 11, documentName: 'MAC Appeal - Case #12348', type: 'pdf', uploadDate: '2025-07-25', lastModifiedBy: 'Alice Brown', status: 'Published', category: 'Plan & Compliance', accountName: 'Oscorp' },
  { id: 12, documentName: 'MAC Appeal - Case #12349', type: 'pdf', uploadDate: '2025-08-01', lastModifiedBy: 'Jane Smith', status: 'Published', category: 'Plan & Compliance', accountName: 'Tyrell Corporation' },
]);

const documentTabs = ref([
  { label: 'PHI Documents', key: 'PHI Documents' },
  { label: 'Billing', key: 'Billing' },
  { label: 'Plan & Compliance', key: 'Plan & Compliance' },
  { label: 'General', key: 'General' },
  { label: 'Notifications', key: 'Notifications' },
]);

const selectedTabKey = ref('PHI Documents'); // PHI is the most-used tab per the old portal

// Default back to PHI Documents whenever the account changes, rather than leaving
// whatever tab happened to be active for the previous account.
watch(selectedAccount, () => {
  selectedTabKey.value = 'PHI Documents';
});

const handleTabSelected = (key: string) => {
  selectedTabKey.value = key;
};

const combinedDocumentItems = computed(() => [...documentsStore.documents, ...allDocumentItems.value]);

// Advanced Filters — same pattern as Reports/Billing (external AdvancedFiltersButton +
// AdvancedFiltersDialog + FilteringPillsGroup, applied on top of the existing tab/category filter)
const isAdvancedFiltersOpen = ref(false);
const documentSearchTerm = ref('');

// Applied state — what the table actually uses
const appliedModifiedBy = ref<string[]>([]);
const appliedDateFrom = ref('');
const appliedDateTo = ref('');

// Dialog draft state — only committed when Apply is clicked
const dialogModifiedBy = ref<string[]>([]);
const dialogDateFrom = ref('');
const dialogDateTo = ref('');

const modifiedBySearch = ref('');
const showModifiedByList = ref(false);

const modifiedByOptions = computed(() =>
  [...new Set(combinedDocumentItems.value.map(item => item.lastModifiedBy).filter(Boolean))].sort()
);

const filteredModifiedByOptions = computed(() => {
  const q = modifiedBySearch.value?.toLowerCase() ?? '';
  return modifiedByOptions.value.filter(p => p.toLowerCase().includes(q));
});

const toggleModifiedBy = (person: string) => {
  dialogModifiedBy.value = dialogModifiedBy.value.includes(person)
    ? dialogModifiedBy.value.filter(p => p !== person)
    : [...dialogModifiedBy.value, person];
};

const handleModifiedByPickerBlur = () => {
  setTimeout(() => { showModifiedByList.value = false; }, 150);
};

const openFilters = () => {
  dialogModifiedBy.value = [...appliedModifiedBy.value];
  dialogDateFrom.value = appliedDateFrom.value;
  dialogDateTo.value = appliedDateTo.value;
  modifiedBySearch.value = '';
  showModifiedByList.value = false;
  isAdvancedFiltersOpen.value = true;
};

const applyFilters = () => {
  appliedModifiedBy.value = [...dialogModifiedBy.value];
  appliedDateFrom.value = dialogDateFrom.value;
  appliedDateTo.value = dialogDateTo.value;
  isAdvancedFiltersOpen.value = false;
};

const cancelFilters = () => {
  isAdvancedFiltersOpen.value = false;
};

const advancedFiltersDialogActions = [
  { text: 'Cancel',        type: 'cancel'  as const, onClick: cancelFilters },
  { text: 'Apply Filters', type: 'confirm' as const, onClick: applyFilters  },
];

const documentFilters = reactive<FilterGroup[]>([
  { type: 'modifiedBy',   label: 'Uploaded By', multiselect: true, options: [], modelValue: null },
  { type: 'dateRange',    label: 'Upload Date Range',    multiselect: false, options: [], modelValue: null },
]);

// DatePicker (dialogDateFrom/To) emits M/D/YYYY; item.uploadDate is stored as ISO YYYY-MM-DD.
// Parsed explicitly (both as local-time components) to avoid a timezone off-by-one-day bug
// that native `new Date(string)` parsing would introduce when mixing these two formats.
const parseMDYYYY = (dateStr: string): number => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const parseISODate = (dateStr: string): number => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const formatUploadDateDisplay = (dateStr: string): string => {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  return `${parseInt(parts[0])}/${parseInt(parts[1])}/${parts[2]}`;
};

const activeFilterPills = computed<FilterPill[]>(() => {
  const pills: FilterPill[] = [];
  appliedModifiedBy.value.forEach(person => {
    pills.push({ type: 'modifiedBy', value: person, label: `Uploaded by: ${person}`, isActive: true });
  });
  if (appliedDateFrom.value || appliedDateTo.value) {
    const parts = [appliedDateFrom.value, appliedDateTo.value]
      .filter(Boolean)
      .map(formatUploadDateDisplay);
    pills.push({ type: 'dateRange', value: null, label: `Upload Date: ${parts.join(' – ')}`, isActive: true });
  }
  return pills;
});

const handleFilterPillClose = (pill: FilterPill) => {
  if (pill.type === 'modifiedBy') {
    appliedModifiedBy.value = appliedModifiedBy.value.filter(v => v !== pill.value);
  } else if (pill.type === 'dateRange') {
    appliedDateFrom.value = '';
    appliedDateTo.value = '';
  }
};

// The category's full set before search/advanced-filters are applied — used to tell
// "genuinely no documents in this category" apart from "filtered/searched down to zero",
// since those two states need different empty-state treatments (illustration+CTA vs.
// plain "No records found", matching Billing's pattern).
const categoryDocumentItems = computed(() => {
  if (!selectedAccount.value) return [];
  return combinedDocumentItems.value.filter(item =>
    item.accountName === selectedAccountName.value && item.category === selectedTabKey.value
  );
});

const filteredDocumentItems = computed(() => {
  if (!selectedAccount.value) return [];

  let items = categoryDocumentItems.value;

  // Search is scoped to Document Name only — Uploaded By already has its own
  // Advanced Filter, and Type isn't a meaningful free-text search target.
  if (documentSearchTerm.value) {
    const q = documentSearchTerm.value.toLowerCase();
    items = items.filter(item => item.documentName.toLowerCase().includes(q));
  }
  if (appliedModifiedBy.value.length > 0) {
    items = items.filter(item => appliedModifiedBy.value.includes(item.lastModifiedBy));
  }
  if (appliedDateFrom.value || appliedDateTo.value) {
    const fromTs = appliedDateFrom.value ? parseMDYYYY(appliedDateFrom.value) : -Infinity;
    const toTs   = appliedDateTo.value   ? parseMDYYYY(appliedDateTo.value)   : Infinity;
    items = items.filter(item => {
      const uploaded = parseISODate(item.uploadDate);
      return uploaded >= fromTs && uploaded <= toTs;
    });
  }

  return items;
});

// True only when search/filters are the reason the table is empty — the category
// itself has documents, they're just all filtered out right now.
const isFilteredToZero = computed(() =>
  categoryDocumentItems.value.length > 0 && filteredDocumentItems.value.length === 0
);

// Row actions — Download and Remove (requires confirmation before anything is deleted).
const documentRowActions = [
  { label: 'Download', action: 'download' },
  { label: 'Remove', action: 'remove' },
];

const showRemoveDocumentDialog = ref(false);
const documentPendingRemoval = ref<{ id: number; documentName: string } | null>(null);

const showDownloadSnackbar = ref(false);
const downloadSnackbarText = ref('');

const handleDocumentRowAction = ({ action, item }: { action: string; item: { id: number; documentName: string } }) => {
  if (action === 'download') {
    downloadSnackbarText.value = `${item.documentName} downloaded successfully!`;
    showDownloadSnackbar.value = true;
  } else if (action === 'remove') {
    documentPendingRemoval.value = item;
    showRemoveDocumentDialog.value = true;
  }
};

// Bulk download — ReportDataTable already clears its own selection when this fires
// (so the bulk action bar disappears immediately); this just surfaces the toast.
const handleBulkDownload = (items: { documentName: string }[]) => {
  downloadSnackbarText.value = items.length === 1
    ? `${items[0].documentName} downloaded successfully!`
    : `${items.length} documents downloaded successfully!`;
  showDownloadSnackbar.value = true;
};

const cancelRemoveDocument = () => {
  showRemoveDocumentDialog.value = false;
  documentPendingRemoval.value = null;
};

const confirmRemoveDocument = () => {
  const target = documentPendingRemoval.value;
  if (target) {
    if (documentsStore.documents.some(doc => doc.id === target.id)) {
      documentsStore.removeDocument(target.id);
    } else {
      allDocumentItems.value = allDocumentItems.value.filter(doc => doc.id !== target.id);
    }
  }
  cancelRemoveDocument();
};

const removeDocumentDialogActions = [
  { text: 'Cancel', onClick: cancelRemoveDocument, styleType: 'secondary' as const },
  { text: 'Remove', onClick: confirmRemoveDocument, type: 'destructive' as const },
];

// Add Documents modal — category and account are locked from whichever tab was active
// when it was opened (selectedTabKey / selectedAccountName), never chosen inside the
// modal itself, so an upload can't be misdirected to the wrong place.
const showUploadModal = ref(false);
const stagedFileName = ref('');
const uploadPhiAck = ref(false);

const openUploadModal = () => {
  stagedFileName.value = '';
  uploadPhiAck.value = false;
  showUploadModal.value = true;
};

const closeUploadModal = () => {
  showUploadModal.value = false;
};

const canConfirmUpload = computed(() =>
  !!stagedFileName.value && (selectedTabKey.value === 'PHI Documents' || uploadPhiAck.value)
);

const confirmUpload = () => {
  if (!canConfirmUpload.value || !selectedAccount.value) return;
  documentsStore.addDocument({
    documentName: stagedFileName.value,
    type: stagedFileName.value.split('.').pop() || 'file',
    uploadDate: new Date().toISOString().slice(0, 10),
    lastModifiedBy: 'Pablo Duarte', // "Pablo" matches the logged-in-user placeholder used on Home; always show first + last name here
    status: 'Published',
    category: selectedTabKey.value,
    accountName: selectedAccountName.value,
  });
  showUploadModal.value = false;
};

const uploadDialogActions = computed(() => [
  { text: 'Cancel', onClick: closeUploadModal, styleType: 'secondary' as const },
  { text: 'Upload Document', onClick: confirmUpload, disabled: !canConfirmUpload.value },
]);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.documents-page {
  display: flex;
  flex-direction: column;
  // No gap here — AccountSelector already carries its own margin-bottom (mb-large,
  // 32px). A container-level gap on top of that was stacking to 64px total, wider
  // than Added Value's spacing (which has no competing gap on its own wrapper).
}

.document-link {
  color: $color-link;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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

.doc-upload-cta-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: $spacing-medium;
}

// Same base button styling as Plan Explorer's .button/.button-primary — scoped styles
// don't share across components, so this is duplicated here rather than global.
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

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.button-primary {
  background-color: $color-primary;
  color: $color-neutral-white;
}

.button-secondary {
  background-color: transparent;
  border-color: $color-primary;
  color: $color-primary;
}

.doc-no-results {
  text-align: center;
  padding: $spacing-medium;
  color: $color-text-secondary;
  font-size: $font-size-body;
}

.doc-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xlarge $spacing-medium;
  gap: $spacing-xsmall;
  text-align: center;
}

.doc-empty-icon {
  width: 160px;
  margin-bottom: $spacing-small;
}

.doc-empty-title {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0;
}

.doc-empty-subtitle {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: 0 0 $spacing-small;
}

.upload-context {
  display: flex;
  gap: $spacing-xlarge;
  margin-bottom: $spacing-medium;
}

.ap-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 140px;
}

.ap-field-label {
  font-size: $font-size-small;
  color: $color-text-secondary;
}

.ap-field-value {
  font-size: $font-size-body;
  color: $color-text-primary;
}

.bl-file-chip {
  padding: 0 8px;
  margin-bottom: $spacing-medium;

  :deep(.v-chip__content) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .bl-file-chip-icon {
    color: $color-neutral-white;
    flex-shrink: 0;
  }

  .bl-file-chip-label {
    color: $color-neutral-white;
    font-size: $font-size-small;
  }

  .bl-file-chip-close {
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

    &:hover {
      opacity: 1;
    }
  }
}

.upload-review-line {
  margin-top: $spacing-medium;
  color: $color-text-secondary;
}

.ap-checkbox-toggle {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  cursor: pointer;
  user-select: none;

  &:hover .ap-checkbox-icon {
    color: $color-primary;
  }
}

.ap-checkbox-icon {
  color: $color-border;
  &--checked { color: $color-primary; }
}

.upload-phi-ack {
  margin-top: $spacing-medium;
  align-items: flex-start;

  .ap-checkbox-icon {
    margin-top: 2px;
    flex-shrink: 0;
  }
}
</style>
