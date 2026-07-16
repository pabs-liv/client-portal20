<template>
  <div class="home-page-container">
    <Banner
      variant="info"
      :always-show="true"
      message="<strong>Executive Summary</strong> For June 2026, pharmacy utilization was 49%, with 1.3M paid claims year-to-date and $17.70M in total YTD savings. Paid plan and PMPM trends reflect activity through the most recent completed month."
    />

    <div class="kpi-container">
      <KpiStatCard
        label="Total Savings"
        value="$17.70M"
        deltaValue="3%"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Claims"
        value="1.3M"
        deltaValue="3%"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Utilization"
        value="49%"
        deltaValue="1 pts"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Paid"
        value="$293M"
        deltaValue="6%"
        deltaDirection="up"
      />
      <KpiStatCard
        label="PMPM"
        value="$293.03"
        deltaValue="7%"
        deltaDirection="up"
      />
    </div>

    <div class="two-column-layout">
      <PageCard headerText="Savings Story" descriptionText="YTD total">
        <SavingsBreakdownChart
          :breakdown-items="savingsBreakdownItems"
          :claims-counts="claimsCounts"
        />
      </PageCard>

      <PageCard headerText="Monthly Utilization, Spend, and Volume Drivers" descriptionText="June 2026">
        <UtilizationDriversChart
          :utilization-percent="utilizationPercent"
          :dispense-rate="dispenseRate"
          :paid-plan="paidPlan"
        />
      </PageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Banner from '../components/common/Banner.vue';
import PageCard from '../components/common/PageCard.vue';
import KpiStatCard from '../components/common/KpiStatCard.vue';
import SavingsBreakdownChart from '../components/common/SavingsBreakdownChart.vue';
import UtilizationDriversChart from '../components/common/UtilizationDriversChart.vue';

const savingsBreakdownItems = ref([
  { label: 'VCP', value: '$6.91M', percent: 39, color: '#0F285B' },
  { label: 'Avoided Fees', value: '$3.62M', percent: 20, color: '#2C82CB' },
  { label: 'Biosimilar', value: '$3.22M', percent: 18, color: '#60B0E0' },
  { label: 'Clinical', value: '$3.95M', percent: 22, color: '#9AA0B4' },
]);

const claimsCounts = ref([
  { month: 'Jan', count: 223000 },
  { month: 'Feb', count: 214000 },
  { month: 'Mar', count: 232000 },
  { month: 'Apr', count: 220000 },
  { month: 'May', count: 216000 },
  { month: 'Jun', count: 223000 },
]);

const utilizationPercent = ref(49);

const dispenseRate = ref([
  { category: 'Specialty', value: 1.5 },
  { category: 'Generic', value: 85.7 },
  { category: 'Brand', value: 12.7 },
]);

const paidPlan = ref([
  { category: 'Specialty', value: 24.67 },
  { category: 'Generic', value: 3.89 },
  { category: 'Brand', value: 22.82 },
]);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.home-page-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.kpi-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-medium;
}

.two-column-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-medium;
  align-items: start;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .kpi-container {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .kpi-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .two-column-layout {
    grid-template-columns: 1fr;
  }
}
</style>
