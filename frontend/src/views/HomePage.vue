
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

    <ReportExplorer />

  </div>
</template>

<script setup lang="ts">
import Banner from '../components/common/Banner.vue';
import SummaryWidget from '../components/common/SummaryWidget.vue';
import ReportExplorer from '../components/common/ReportExplorer.vue';
import {
  CircleCheckBig,
  ChartNoAxesCombined,
  RotateCcwKey,
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
</style>
