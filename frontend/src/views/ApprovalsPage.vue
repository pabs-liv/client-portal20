
"""<template>
  <div class="approvals-page">
    <h1 class="text-h1">Approvals</h1>

    <div class="widgets-container">
      <SummaryWidget
        title="Quarterly Reports"
        :count="quarterlyCount"
        description="Reports awaiting approval"
        :show-icon="true"
        :icon="CalendarClock"
        iconBackgroundColor="#E0F2F7"
        iconColor="#2196F3"
      />
      <SummaryWidget
        title="Monthly Reports"
        :count="monthlyCount"
        description="Reports awaiting approval"
        :show-icon="true"
        :icon="Calendar"
        iconBackgroundColor="#E6F4EA"
        iconColor="#4CAF50"
      />
      <SummaryWidget
        title="Ad-Hoc Reports"
        :count="adHocCount"
        description="Reports awaiting approval"
        :show-icon="true"
        :icon="Wrench"
        iconBackgroundColor="#FFF3E0"
        iconColor="#FF9800"
      />
      <SummaryWidget
        title="Annual Reports"
        :count="annualCount"
        description="Reports awaiting approval"
        :show-icon="true"
        :icon="Award"
        iconBackgroundColor="#F3E5F5"
        iconColor="#9C27B0"
      />
    </div>

    <PageCard>
      <ReportDataTable
        :headers="reportHeaders"
        :items="reportItems"
        :show-search-bar="true"
        search-placeholder="Search by account, report name, or type"
        :show-filter-pills="true"
        :initial-filter-pills="reportFilterPills"
        :show-selection-checkboxes="true"
        :show-row-actions="true"
      />
    </PageCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import SummaryWidget from '@/components/common/SummaryWidget.vue';
import { CalendarClock, Calendar, Wrench, Award } from 'lucide-vue-next';

const reportHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'Report Name', key: 'reportName' },
  { title: 'Type', key: 'type' },
  { title: 'Reporting Period', key: 'reportingPeriod' },
  { title: 'Last Edited By', key: 'lastEditedBy' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]);

const reportItems = ref([
  { id: 1, accountName: 'Stark Industries', reportName: 'Q1 Financials', type: 'Quarterly', reportingPeriod: 'Q1 2025', lastEditedBy: 'T. Stark', status: 'Pending Approval' },
  { id: 2, accountName: 'Wayne Enterprises', reportName: 'Monthly Security Audit', type: 'Monthly', reportingPeriod: 'July 2025', lastEditedBy: 'B. Wayne', status: 'Pending Approval' },
  { id: 3, accountName: 'Oscorp', reportName: 'Genetics Research Summary', type: 'Ad-Hoc', reportingPeriod: 'N/A', lastEditedBy: 'N. Osborn', status: 'Pending Approval' },
  { id: 4, accountName: 'Cyberdyne Systems', reportName: 'Project Skynet Update', type: 'Monthly', reportingPeriod: 'July 2025', lastEditedBy: 'M. Dyson', status: 'Pending Approval' },
  { id: 5, accountName: 'LexCorp', reportName: 'Real Estate Holdings', type: 'Annual', reportingPeriod: '2024', lastEditedBy: 'L. Luthor', status: 'Pending Approval' },
  { id: 6, accountName: 'Queen Consolidated', reportName: 'Applied Sciences Inventory', type: 'Quarterly', reportingPeriod: 'Q2 2025', lastEditedBy: 'O. Queen', status: 'Pending Approval' },
  { id: 7, accountName: 'Kord Industries', reportName: 'Blue Beetle Project', type: 'Ad-Hoc', reportingPeriod: 'N/A', lastEditedBy: 'T. Kord', status: 'Pending Approval' },
  { id: 8, accountName: 'Rand Enterprises', reportName: 'Mystical Artifacts', type: 'Annual', reportingPeriod: '2024', lastEditedBy: 'D. Rand', status: 'Pending Approval' },
  { id: 9, accountName: 'Parker Industries', reportName: 'Web Fluid Formula', type: 'Monthly', reportingPeriod: 'July 2025', lastEditedBy: 'P. Parker', status: 'Pending Approval' },
  { id: 10, accountName: 'Richards Industries', reportName: 'Unstable Molecules Report', type: 'Quarterly', reportingPeriod: 'Q2 2025', lastEditedBy: 'R. Richards', status: 'Pending Approval' },
]);

const reportFilterPills = ref([
  { type: 'tab', value: 'all', label: 'All', isActive: true },
  { type: 'tab', value: 'quarterly', label: 'Quarterly' },
  { type: 'tab', value: 'monthly', label: 'Monthly' },
  { type: 'tab', value: 'ad-hoc', label: 'Ad-Hoc' },
  { type: 'tab', value: 'annual', label: 'Annual' },
]);

const quarterlyCount = computed(() => reportItems.value.filter(item => item.type === 'Quarterly').length);
const monthlyCount = computed(() => reportItems.value.filter(item => item.type === 'Monthly').length);
const adHocCount = computed(() => reportItems.value.filter(item => item.type === 'Ad-Hoc').length);
const annualCount = computed(() => reportItems.value.filter(item => item.type === 'Annual').length);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.approvals-page {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
}
</style>
""
