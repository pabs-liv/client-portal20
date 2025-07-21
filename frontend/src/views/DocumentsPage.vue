<template>
  <div class="documents-page">
    <h1 class="text-h1">Documents</h1>

    <div v-if="isInternal">
      <PageCard
        header-text="Document Explorer"
        description-text="Select and upload documents that will appear on the member site. Accepted formats are: .xls, .doc, .docx, .pdf, and .csv. Uploaded documents are immediately visible on the client portal."
      >
        <Tabs :tabs="documentTabs" @tab-selected="handleTabSelected" class="mb-large" />
        <div v-if="selectedTabKey === 'Document Uploader'">
          <FileUploader class="mb-large" />
          <ReportDataTable
            :headers="uploadedDocumentHeaders"
            :items="uploadedDocumentItems"
            :show-search-bar="false"
            :show-filter-pills="false"
            :show-selection-checkboxes="false"
            :show-row-actions="true"
          >
            <template v-slot:item.documentName="{ item }">
              <a :href="item.url" target="_blank" class="document-link">{{ item.documentName }}</a>
            </template>
          </ReportDataTable>
        </div>
        <div v-else>
          <ReportDataTable
            :headers="documentHeaders"
            :items="filteredDocumentItems"
            :show-search-bar="true"
            :show-filter-pills="false"
            :initial-filter-pills="documentFilterPills"
            :show-selection-checkboxes="true"
            :show-row-actions="true"
          />
        </div>
      </PageCard>
    </div>
    <div v-else>
      <PageCard
        header-text="Document Explorer"
        description-text="View and download documents relevant to your account(s)."
      >
        <Tabs :tabs="documentTabs" @tab-selected="handleTabSelected" class="mb-large" />
        <div v-if="selectedTabKey === 'Document Uploader'">
          <FileUploader :show-document-type-selection="true" class="mb-large" />
          <ReportDataTable
            :headers="uploadedDocumentHeaders"
            :items="uploadedDocumentItems"
            :show-search-bar="false"
            :show-filter-pills="false"
            :show-selection-checkboxes="false"
            :show-row-actions="true"
          >
            <template v-slot:item.documentName="{ item }">
              <a :href="item.url" target="_blank" class="document-link">{{ item.documentName }}</a>
            </template>
          </ReportDataTable>
        </div>
        <div v-else>
          <ReportDataTable
            :headers="documentHeaders"
            :items="filteredDocumentItems"
            :show-search-bar="true"
            :show-filter-pills="false"
            :initial-filter-pills="documentFilterPills"
            :show-selection-checkboxes="false"
            :show-row-actions="true"
          />
        </div>
      </PageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Tabs from '@/components/common/Tabs.vue';
import FileUploader from '@/components/ui/FileUploader.vue';
import { useUserType } from '@/composables/useUserType';

const { isInternal } = useUserType();

const documentHeaders = ref([
  { title: 'Document Name', key: 'documentName' },
  { title: 'Type', key: 'type' },
  { title: 'Upload Date', key: 'uploadDate' },
  { title: 'Last Modified By', key: 'lastModifiedBy' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false }, // Empty title for actions column
]);

const allDocumentItems = ref([
  { id: 1, documentName: '2025 Benefit Guide', type: 'pdf', uploadDate: '2025-01-15', lastModifiedBy: 'Admin', status: 'Published', category: 'All Documents' },
  { id: 2, documentName: 'Q1 2025 Performance Report', type: 'xls', uploadDate: '2025-04-01', lastModifiedBy: 'Analyst', status: 'Published', category: 'Billing' },
  { id: 3, documentName: 'Pharmacy Network Update', type: 'doc', uploadDate: '2025-03-10', lastModifiedBy: 'Admin', status: 'Draft', category: 'Notifications' },
  { id: 4, documentName: 'Claim Submission Form', type: 'pdf', uploadDate: '2024-11-20', lastModifiedBy: 'Admin', status: 'Published', category: 'PHI Documents' },
  { id: 5, documentName: 'Annual Review Summary', type: 'csv', uploadDate: '2025-02-28', lastModifiedBy: 'Analyst', status: 'Published', category: 'Billing' },
  { id: 6, documentName: 'HIPAA Compliance Doc', type: 'pdf', uploadDate: '2025-06-01', lastModifiedBy: 'Admin', status: 'Published', category: 'PHI Documents' },
  { id: 7, documentName: 'New User Onboarding', type: 'doc', uploadDate: '2025-07-01', lastModifiedBy: 'Admin', status: 'Draft', category: 'Document Uploader' },
]);

const documentTabs = ref([
  { label: 'All Documents', key: 'All Documents' },
  { label: 'PHI Documents', key: 'PHI Documents' },
  { label: 'Billing', key: 'Billing' },
  { label: 'Notifications', key: 'Notifications' },
  { label: 'Document Uploader', key: 'Document Uploader' },
]);

const selectedTabKey = ref('All Documents'); // Set initial active tab

const handleTabSelected = (key: string) => {
  selectedTabKey.value = key;
};

const filteredDocumentItems = computed(() => {
  if (selectedTabKey.value === 'All Documents') {
    return allDocumentItems.value;
  }
  return allDocumentItems.value.filter(item => item.category === selectedTabKey.value);
});

const uploadedDocumentHeaders = ref([
  { title: 'Document Name', key: 'documentName' },
  { title: 'Upload Date', key: 'uploadDate' },
  { title: 'Uploaded By', key: 'uploadedBy' },
  { title: '', key: 'actions', sortable: false }, // Empty title for actions column
]);

const uploadedDocumentItems = ref([
  { id: 1, documentName: 'Uploaded Document 1.pdf', uploadDate: '2025-07-19', uploadedBy: 'User A', url: '#' },
  { id: 2, documentName: 'Uploaded Document 2.xls', uploadDate: '2025-07-19', uploadedBy: 'User B', url: '#' },
  { id: 3, documentName: 'Uploaded Document 3.docx', uploadDate: '2025-07-20', uploadedBy: 'User A', url: '#' },
]);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.documents-page {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.document-link {
  color: $color-link;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>