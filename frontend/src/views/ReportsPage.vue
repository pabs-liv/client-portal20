
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
import { ref, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import { useUserType } from '@/composables/useUserType';
import ReportStatusChart from '@/components/common/ReportStatusChart.vue';
import ReportsByTypeChart from '@/components/common/ReportsByTypeChart.vue';
import TotalPendingChart from '@/components/common/TotalPendingChart.vue';
import AvgApprovalTimeChart from '@/components/common/AvgApprovalTimeChart.vue';
import ReportsByAccountChart from '@/components/common/ReportsByAccountChart.vue';

const { isInternal, isExternal } = useUserType();

const reportHeaders = computed(() => {
  const baseHeaders = [
    { title: 'Account Name', key: 'accountName' },
    { title: 'Report Name', key: 'reportName' },
    { title: 'Type', key: 'type' },
    { title: 'Reporting Period', key: 'reportingPeriod' },
    { title: 'Status', key: 'status' },
    { title: '', key: 'actions', sortable: false },
  ];

  if (isExternal.value) {
    baseHeaders.splice(4, 0, 
      { title: 'Approved By', key: 'approvedBy' },
      { title: 'Approved Date', key: 'approvedDate', align: 'end' }
    );
  }
  return baseHeaders;
});

const reportItems = ref([
  { id: 1, accountName: 'Company A', reportName: 'Monthly Value Report', type: 'Monthly', reportingPeriod: 'July 2025', approvedBy: 'John Doe', approvedDate: '2025-07-10', status: 'Completed' },
  { id: 2, accountName: 'Company B', reportName: 'Quarterly Executive Summary', type: 'Quarterly', reportingPeriod: 'Q2 2025', approvedBy: 'Jane Smith', approvedDate: '2025-07-05', status: 'Approved' },

  { id: 4, accountName: 'Company C', reportName: 'Rebate Report', type: 'Rebate', reportingPeriod: '2024', approvedBy: 'Alice Brown', approvedDate: '2025-01-15', status: 'Pending Approval' },
  { id: 5, accountName: 'Company D', reportName: 'CAA Report', type: 'CAA', reportingPeriod: '2025', approvedBy: 'Bob White', approvedDate: '2025-03-20', status: 'Draft' },
  { id: 6, accountName: 'Company E', reportName: 'Colony Expansion Plan', type: 'Annual', reportingPeriod: '2024', approvedBy: 'Ellen Ripley', approvedDate: '2025-02-01', status: 'Approved' },
  { id: 7, accountName: 'Company F', reportName: 'Replicant Production Metrics', type: 'Monthly', reportingPeriod: 'July 2025', approvedBy: 'Rick Deckard', approvedDate: '2025-07-18', status: 'Completed' },
  { id: 8, accountName: 'Company G', reportName: 'RoboCop Project Status', type: 'Quarterly', reportingPeriod: 'Q2 2025', approvedBy: 'Clarence Boddicker', approvedDate: '2025-06-10', status: 'Pending Approval' },
  { id: 9, accountName: 'Company H', reportName: 'Arc Reactor Efficiency', type: 'Ad-Hoc', reportingPeriod: 'N/A', approvedBy: 'Tony Stark', approvedDate: '2025-07-20', status: 'Processing' },
  { id: 10, accountName: 'Company I', reportName: 'Bat-Gadget Inventory', type: 'Monthly', reportingPeriod: 'July 2025', approvedBy: 'Bruce Wayne', approvedDate: '2025-07-19', status: 'Approved' },
]);

const reportFilterPills = ref([
  { type: 'tab', value: 'all', label: 'All', isActive: true },
  { type: 'tab', value: 'quarterly', label: 'Quarterly' },
  { type: 'tab', value: 'monthly', label: 'Monthly' },
  
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
