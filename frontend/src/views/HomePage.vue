<template>
  <div class="home-page-container">
    <Banner
      variant="warning"
      message="<strong>IMPORTANT NOTICE!</strong> Consolidated Appropriations Act (CAA) RxDC reports are due on or before June 1, 2025. Please select the cog (gear) located on the top right hand of the tool bar and then select CAA RxDC Reports. You will only be able to make a selection through April 30, 2025."
    />
    <h1>Welcome back, Pablo! Here's what's new...</h1>

    <div class="widgets-container">
      <SummaryWidget
        title="Pending Approvals"
        count="5"
        description="Reports waiting for your approval"
        :showIcon="true"
        :icon="CircleCheckBig"
        iconBackgroundColor="#E6F4EA"
        iconColor="#4CAF50"
        @click="goToReports"
      />
      <SummaryWidget
        title="High-Cost Claims"
        count="2"
        description="New claims requiring attention"
        :showIcon="true"
        :icon="ChartNoAxesCombined"
        iconBackgroundColor="#FFF3E0"
        iconColor="#FF9800"
        @click="goToApprovals"
      />
      <SummaryWidget
        title="Prior Authorizations"
        count="8"
        description="Requests needing review"
        :showIcon="true"
        :icon="RotateCcwKey"
        iconBackgroundColor="#E0F2F7"
        iconColor="#2196F3"
        @click="goToPriorAuths"
      />
    </div>

    <div class="two-column-layout">
      <ImplementationStatusChart
        headerText="Implementations Overview"
        :data="{
          new: 5,
          inProgress: 12,
          pendingAction: 7,
          completed: 20,
        }"
      />
      <UpcomingImplementationsTable headerText="Upcoming Implementations Next 90 Days" :showViewAllButton="true" />
    </div>

    <AccordionCard
      headerText="Report Explorer"
      descriptionText="Find, view and approve any report by account, name type or date."
    >
      <template v-slot:content>
        <ReportDataTable
          :headers="reportHeaders"
          :items="reportItems"
          :showNavigationTabs="true"
          :showSearchBar="true"
          :showFilterButton="false"
          :showSelectionCheckboxes="true"
          :showFilterPills="true"
          :initialFilterPills="reportFilterPills"
        />
      </template>
    </AccordionCard>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Banner from '../components/common/Banner.vue';
import SummaryWidget from '../components/common/SummaryWidget.vue';
import AccordionCard from '../components/common/AccordionCard.vue';
import ReportDataTable from '../components/common/ReportDataTable.vue';
import ImplementationStatusChart from '../components/common/ImplementationStatusChart.vue';
import UpcomingImplementationsTable from '../components/common/UpcomingImplementationsTable.vue';
import {
  CircleCheckBig,
  ChartNoAxesCombined,
  RotateCcwKey,
  FileText, Folder, CircleDollarSign, Settings
} from 'lucide-vue-next';

const reportFilterPills = ref([
  { type: 'tab', value: 'all', label: 'All', isActive: true },
  { type: 'tab', value: 'quarterly', label: 'Quarterly' },
  { type: 'tab', value: 'monthly', label: 'Monthly' },
  { type: 'tab', value: 'ad-hoc', label: 'Ad-Hoc' },
  { type: 'tab', value: 'rebate', label: 'Rebate' },
  { type: 'tab', value: 'caa', label: 'CAA' },
  { type: 'status', value: 'pending approval', label: 'Pending Approval' },
]);

const reportHeaders = ref([
  { title: 'Account Name', key: 'accountName', headerProps: { style: { fontWeight: 'bold' } } },
  { title: 'Report Name', key: 'reportName', headerProps: { style: { fontWeight: 'bold' } } },
  { title: 'Type', key: 'type', headerProps: { style: { fontWeight: 'bold' } } },
  { title: 'Reporting Period', key: 'reportingPeriod', headerProps: { style: { fontWeight: 'bold' } } },
  { title: 'Last Edited By', key: 'lastEditedBy', headerProps: { style: { fontWeight: 'bold' } } },
  { title: 'Status', key: 'status', headerProps: { style: { fontWeight: 'bold' } } },
  { title: '', key: 'actions', sortable: false, align: 'end', headerProps: { style: { fontWeight: 'bold' } } },
]);

const reportItems = ref([
  { id: 1, accountName: 'Acme Corp', reportName: 'Monthly Value Report', type: 'Monthly', reportingPeriod: 'July 2025', lastEditedBy: 'John Doe', status: 'Completed' },
  { id: 2, accountName: 'Globex Inc.', reportName: 'Quarterly Executive Summary', type: 'Quarterly', reportingPeriod: 'Q2 2025', lastEditedBy: 'Jane Smith', status: 'Approved' },
  { id: 3, accountName: 'Soylent Corp', reportName: 'Ad-Hoc Savings Analysis', type: 'Ad-Hoc', reportingPeriod: 'June 2025', lastEditedBy: 'Peter Jones', status: 'Processing' },
  { id: 4, accountName: 'Umbrella Corp', reportName: 'Rebate Report', type: 'Rebate', reportingPeriod: '2024', lastEditedBy: 'Alice Brown', status: 'Pending Approval' },
  { id: 5, accountName: 'Initech', reportName: 'CAA Report', type: 'CAA', reportingPeriod: '2025', lastEditedBy: 'Bob White', status: 'Draft' },
]);

const router = useRouter();

const goToReports = () => {
  router.push('/reports');
};

const goToApprovals = () => {
  router.push('/approvals');
};

const goToPriorAuths = () => {
  router.push('/prior-auths');
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.home-page-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
}

.two-column-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-medium;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .widgets-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .widgets-container {
    grid-template-columns: 1fr;
  }

  .two-column-layout {
    grid-template-columns: 1fr;
  }
}
</style>