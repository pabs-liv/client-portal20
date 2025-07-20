
<template>
  <div class="reports-page">
    <h1 class="text-h1">Reports</h1>

    <!-- External User Charts -->
    <div v-if="isExternal" class="external-charts-layout">
      <div class="chart-item-large">
        <ReportStatusChart />
      </div>
      <div class="chart-item-large">
        <ReportsByTypeChart />
      </div>
    </div>

    <!-- Internal User Charts -->
    <div v-if="isInternal" class="internal-charts-layout">
      <div class="kpi-column">
        <TotalPendingChart />
        <AvgApprovalTimeChart />
      </div>
      <div class="bar-chart-column">
        <ReportsByAccountChart />
      </div>
    </div>

    <PageCard header-text="All Reports" description-text="Browse and manage all available reports.">
      <ReportDataTable
        :headers="reportHeaders"
        :items="reportItems"
        :show-search-bar="true"
        :show-filter-pills="true"
        :initial-filter-pills="reportFilterPills"
        :show-selection-checkboxes="true"
        :show-row-actions="true"
      />
    </PageCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import { useUserType } from '@/composables/useUserType';
import ReportStatusChart from '@/components/common/ReportStatusChart.vue';
import ReportsByTypeChart from '@/components/common/ReportsByTypeChart.vue';
import TotalPendingChart from '@/components/common/TotalPendingChart.vue';
import AvgApprovalTimeChart from '@/components/common/AvgApprovalTimeChart.vue';
import ReportsByAccountChart from '@/components/common/ReportsByAccountChart.vue';

const { isInternal, isExternal } = useUserType();

const reportHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'Report Name', key: 'reportName' },
  { title: 'Type', key: 'type' },
  { title: 'Reporting Period', key: 'reportingPeriod' },
  { title: 'Last Edited By', key: 'lastEditedBy' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false },
]);

const reportItems = ref([
  { id: 1, accountName: 'Acme Corp', reportName: 'Monthly Value Report', type: 'Monthly', reportingPeriod: 'July 2025', lastEditedBy: 'John Doe', status: 'Completed' },
  { id: 2, accountName: 'Globex Inc.', reportName: 'Quarterly Executive Summary', type: 'Quarterly', reportingPeriod: 'Q2 2025', lastEditedBy: 'Jane Smith', status: 'Approved' },
  { id: 3, accountName: 'Soylent Corp', reportName: 'Ad-Hoc Savings Analysis', type: 'Ad-Hoc', reportingPeriod: 'June 2025', lastEditedBy: 'Peter Jones', status: 'Processing' },
  { id: 4, accountName: 'Umbrella Corp', reportName: 'Rebate Report', type: 'Rebate', reportingPeriod: '2024', lastEditedBy: 'Alice Brown', status: 'Pending Approval' },
  { id: 5, accountName: 'Initech', reportName: 'CAA Report', type: 'CAA', reportingPeriod: '2025', lastEditedBy: 'Bob White', status: 'Draft' },
]);

const reportFilterPills = ref([
  { type: 'tab', value: 'all', label: 'All', isActive: true },
  { type: 'tab', value: 'quarterly', label: 'Quarterly' },
  { type: 'tab', value: 'monthly', label: 'Monthly' },
  { type: 'tab', value: 'ad-hoc', label: 'Ad-Hoc' },
  { type: 'tab', value: 'rebate', label: 'Rebate' },
  { type: 'tab', value: 'caa', label: 'CAA' },
  { type: 'status', value: 'pending approval', label: 'Pending Approval' },
]);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.reports-page {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.external-charts-layout {
  display: grid;
  gap: $spacing-medium;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.internal-charts-layout {
  display: grid;
  grid-template-columns: 30% 70%;
  gap: $spacing-medium;

  .kpi-column {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
  }
}

@media (max-width: 768px) {
  .external-charts-layout,
  .internal-charts-layout {
    grid-template-columns: 1fr;
  }
}
</style>
