<template>
  <div>
    <h1 class="text-h1 mb-large">Test Results</h1>
    <div class="widgets-container mb-large">
      <SummaryWidget
        title="Total Reports for This Period"
        :count="totalReports"
        description="All test reports available"
        icon-background-color="rgba(44, 130, 203, 0.2)"
        icon-color="#2C82CB"
        :show-icon="true"
        :icon="FileText"
        :clickable="false"
      />
      <SummaryWidget
        title="Reports Pending Approval"
        :count="pendingReports"
        description="Test reports awaiting your review"
        icon-background-color="rgba(253, 214, 113, 0.2)"
        icon-color="#FBBA13"
        :show-icon="true"
        :icon="Hourglass"
        :clickable="false"
      />
    </div>
    <PageCard
      headerText="Test Results"
      descriptionText="Review and manage test report results from plan design configurations."
    >
      <ReportDataTable
        :headers="processedTestResultsHeaders"
        :items="processedTestResultsData"
        :show-search-bar="true"
        search-placeholder="Search test results"
        :show-row-actions="true"
        :show-action-icons="isExternal"
        :action-icons="actionIcons"
        :show-internal-user-actions="!isExternal"
        :internal-user-action-formatter="formatInternalUserAction"
        :internal-user-action-click-handler="handleInternalInfoClick"
        :show-filter-button="false"
      />
    </PageCard>

    <Dialog
      :model-value="showApproveDialog"
      @update:model-value="showApproveDialog = $event"
      :icon="CircleCheckBig"
      heading="Approve Test Result"
      :text="`Are you sure you want to approve the test result for ${selectedTestResult?.report}?`"
      :actions="approveDialogActions"
    />

    <Dialog
      :model-value="showRejectDialog"
      @update:model-value="showRejectDialog = $event"
      :icon="BanknoteX"
      heading="Reject Test Result"
      :text="`Are you sure you want to reject the test result for ${selectedTestResult?.report}?`"
      :actions="rejectDialogActions"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Dialog from '@/components/ui/Dialog.vue';
import SummaryWidget from '@/components/common/SummaryWidget.vue';
import { CircleCheckBig, BanknoteX, FileText, Hourglass } from 'lucide-vue-next';
import { useUserType } from '@/composables/useUserType';

const { isExternal } = useUserType();

const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const selectedTestResult = ref<any>(null);

const handleApproveClick = (item: any) => {
  selectedTestResult.value = item;
  showApproveDialog.value = true;
};

const handleRejectClick = (item: any) => {
  selectedTestResult.value = item;
  showRejectDialog.value = true;
};

const actionIcons = ref([
  { icon: CircleCheckBig, tooltip: 'Approve', onClick: handleApproveClick, type: 'approve' as const },
  { icon: BanknoteX, tooltip: 'Reject', onClick: handleRejectClick, type: 'reject' as const },
]);

const approveDialogActions = [
  { text: 'Cancel', onClick: () => (showApproveDialog.value = false), variant: 'text' as const },
  { text: 'Approve', onClick: () => { console.log('approved'); showApproveDialog.value = false; }, color: 'primary', variant: 'flat' as const }
];

const rejectDialogActions = [
  { text: 'Cancel', onClick: () => (showRejectDialog.value = false), variant: 'text' as const },
  { text: 'Reject', onClick: () => { console.log('rejected'); showRejectDialog.value = false; }, color: 'error', variant: 'flat' as const, type: 'destructive' as const }
];

const formatInternalUserAction = (item: any) => {
  if (item.status === 'Pending' || item.status === 'Rejected') {
    return 'Information Requested';
  } else {
    return '-';
  }
};

const handleInternalInfoClick = (item: any) => {
  selectedTestResult.value = item;
  // Implement internal info click logic
  console.log('Internal info click for:', item);
};

const testResultsHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'Report Type', key: 'reportType' },
  { title: 'Report', key: 'report' },
  { title: 'Date Range', key: 'dateRange' },
  { title: 'Status', key: 'status' },
  { title: 'Approved By', key: 'approvedBy' },
  { title: 'Approved Date', key: 'approvedDate', align: 'end' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]);

const processedTestResultsHeaders = computed(() => {
  if (isExternal.value) {
    return testResultsHeaders.value.filter(header => header.key !== 'approvedBy' && header.key !== 'approvedDate');
  } else {
    return testResultsHeaders.value.filter(header => header.key !== 'actions');
  }
});

const testResultsData = ref([
  {
    accountName: 'Company A',
    reportType: 'Configuration',
    report: 'Plan Design 2025',
    dateRange: '2025-01-01 - 2025-12-31',
    status: 'Approved',
    approvedBy: 'John Doe',
    approvedDate: '2025-07-20',
  },
  {
    accountName: 'Company B',
    reportType: 'Formulary',
    report: 'Formulary Review Q1',
    dateRange: '2025-01-01 - 2025-03-31',
    status: 'Pending',
    approvedBy: '-',
    approvedDate: '-',
  },
  {
    accountName: 'Company C',
    reportType: 'Benefit Design',
    report: 'Benefit Design Update',
    dateRange: '2025-07-01 - 2025-07-31',
    status: 'Rejected',
    approvedBy: 'Jane Smith',
    approvedDate: '2025-07-21',
  },
  {
    accountName: 'Company D',
    reportType: 'Configuration',
    report: 'Network Setup 2025',
    dateRange: '2025-01-01 - 2025-12-31',
    status: 'Approved',
    approvedBy: 'John Doe',
    approvedDate: '2025-07-22',
  },
  {
    accountName: 'Company E',
    reportType: 'Formulary',
    report: 'Formulary Review Q2',
    dateRange: '2025-04-01 - 2025-06-30',
    status: 'Pending',
    approvedBy: '-',
    approvedDate: '-',
  },
  {
    accountName: 'Company F',
    reportType: 'Benefit Design',
    report: 'Benefit Design Audit',
    dateRange: '2025-01-01 - 2025-06-30',
    status: 'Rejected',
    approvedBy: 'Jane Smith',
    approvedDate: '2025-07-23',
  },
  {
    accountName: 'Company G',
    reportType: 'Configuration',
    report: 'Claim Rules Test',
    dateRange: '2025-07-15 - 2025-07-20',
    status: 'Approved',
    approvedBy: 'John Doe',
    approvedDate: '2025-07-24',
  },
  {
    accountName: 'Company H',
    reportType: 'Formulary',
    report: 'Formulary Review Q3',
    dateRange: '2025-07-01 - 2025-09-30',
    status: 'Pending',
    approvedBy: '-',
    approvedDate: '-',
  },
  {
    accountName: 'Company I',
    reportType: 'Benefit Design',
    report: 'Benefit Design Proposal',
    dateRange: '2025-08-01 - 2025-08-31',
    status: 'Rejected',
    approvedBy: 'Jane Smith',
    approvedDate: '2025-07-25',
  },
  {
    accountName: 'Company J',
    reportType: 'Configuration',
    report: 'System Integration Test',
    dateRange: '2025-07-01 - 2025-07-05',
    status: 'Approved',
    approvedBy: 'John Doe',
    approvedDate: '2025-07-26',
  },
]);

const processedTestResultsData = computed(() => {
  if (isExternal.value) {
    return testResultsData.value.map(item => ({
      accountName: item.accountName,
      reportType: item.reportType,
      report: item.report,
      dateRange: item.dateRange,
      status: item.status,
      actions: item.actions, // Keep actions for external users
    }));
  } else {
    return testResultsData.value;
  }
});

const totalReports = computed(() => testResultsData.value.length);
const pendingReports = computed(() => testResultsData.value.filter(item => item.status === 'Pending').length);
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
}
</style>