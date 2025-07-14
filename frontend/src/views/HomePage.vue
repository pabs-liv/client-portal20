
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
      />
      <SummaryWidget
        title="High-Cost Claims"
        count="2"
        description="New claims requiring attention"
        :showIcon="true"
        :icon="ChartNoAxesCombined"
        iconBackgroundColor="#FFF3E0"
        iconColor="#FF9800"
      />
      <SummaryWidget
        title="Prior Authorizations"
        count="8"
        description="Requests needing review"
        :showIcon="true"
        :icon="RotateCcwKey"
        iconBackgroundColor="#E0F2F7"
        iconColor="#2196F3"
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

    <ReportExplorer
      :reports="[
        { id: 1, name: 'Monthly Value Report', dateGenerated: '2025-07-01', status: 'Completed' },
        { id: 2, name: 'Quarterly Executive Summary', dateGenerated: '2025-06-30', status: 'Completed' },
        { id: 3, name: 'Ad-Hoc Savings Analysis', dateGenerated: '2025-07-05', status: 'Processing' },
      ]"
    />

    

  </div>
</template>

<script setup lang="ts">
import Banner from '../components/common/Banner.vue';
import SummaryWidget from '../components/common/SummaryWidget.vue';
import ReportExplorer from '../components/common/ReportExplorer.vue';
import ImplementationStatusChart from '../components/common/ImplementationStatusChart.vue';
import UpcomingImplementationsTable from '../components/common/UpcomingImplementationsTable.vue';
import QuickAccessCard from '../components/common/QuickAccessCard.vue';
import {
  CircleCheckBig,
  ChartNoAxesCombined,
  RotateCcwKey,
  FileText, Folder, CircleDollarSign, Settings
} from 'lucide-vue-next';
</script>

<style scoped>
.home-page-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-large);
}

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-medium);
}

.two-column-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-medium);
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

