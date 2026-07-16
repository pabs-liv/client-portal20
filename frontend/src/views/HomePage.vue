<template>
  <div class="home-page-container">
    <div class="home-header">
      <h1 class="text-h1">Welcome back, Pablo! Here's what's new...</h1>
      <div class="home-header-controls">
        <SegmentedToggle
          :options="periodOptions"
          :model-value="selectedPeriod"
          @update:model-value="selectedPeriod = $event as PeriodKey"
        />
        <Select
          :items="accountOptions"
          item-title="name"
          item-value="id"
          label="Account"
          :model-value="selectedAccountId"
          class="account-select"
          @update:model-value="selectedAccountId = $event"
        />
      </div>
    </div>

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

    <Banner
      variant="info"
      :always-show="true"
      :message="executiveSummaryMessage"
    />

    <div class="kpi-container">
      <KpiStatCard
        label="Total Savings"
        :value="activeData.totalSavings.value"
        :deltaValue="activeData.totalSavings.delta"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Claims"
        :value="activeData.claims.value"
        :deltaValue="activeData.claims.delta"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Utilization"
        :value="activeData.utilization.value + '%'"
        :deltaValue="activeData.utilization.delta"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Paid"
        :value="activeData.paid.value"
        :deltaValue="activeData.paid.delta"
        deltaDirection="up"
      />
      <KpiStatCard
        label="PMPM"
        :value="activeData.pmpm.value"
        :deltaValue="activeData.pmpm.delta"
        deltaDirection="up"
      />
    </div>

    <div class="two-column-layout">
      <PageCard headerText="Savings Story" :descriptionText="activeData.summaryLabel">
        <SavingsBreakdownChart
          :breakdown-items="activeData.savingsBreakdownItems"
          :claims-counts="activeData.claimsCounts"
        />
      </PageCard>

      <PageCard headerText="Utilization, Spend, and Volume Drivers" :descriptionText="activeData.summaryLabel">
        <UtilizationDriversChart
          :utilization-percent="activeData.utilization.value"
          :dispense-rate="activeData.dispenseRate"
          :paid-plan="activeData.paidPlan"
        />
      </PageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Banner from '../components/common/Banner.vue';
import PageCard from '../components/common/PageCard.vue';
import KpiStatCard from '../components/common/KpiStatCard.vue';
import SummaryWidget from '../components/common/SummaryWidget.vue';
import SavingsBreakdownChart from '../components/common/SavingsBreakdownChart.vue';
import UtilizationDriversChart from '../components/common/UtilizationDriversChart.vue';
import Select from '../components/ui/Select.vue';
import SegmentedToggle from '../components/ui/SegmentedToggle.vue';
import { CircleCheckBig, ChartNoAxesCombined, RotateCcwKey } from 'lucide-vue-next';

type PeriodKey = 'ytd' | 'month';

const selectedPeriod = ref<PeriodKey>('ytd');

const periodOptions = [
  { label: 'Year to Date', value: 'ytd' },
  { label: 'This Month', value: 'month' },
];

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

const BOOK_OF_BUSINESS_ID = null;

const accountOptions = ref([
  { id: BOOK_OF_BUSINESS_ID, name: 'All Accounts' },
  { id: 1, name: 'Company A' },
  { id: 2, name: 'Company B' },
  { id: 3, name: 'Company C' },
  { id: 4, name: 'Company D' },
  { id: 5, name: 'Company E' },
]);

const selectedAccountId = ref<number | null>(BOOK_OF_BUSINESS_ID);

interface PeriodDashboardData {
  summaryLabel: string;
  totalSavings: { value: string; delta: string };
  claims: { value: string; delta: string };
  utilization: { value: number; delta: string };
  paid: { value: string; delta: string };
  pmpm: { value: string; delta: string };
  savingsBreakdownItems: { label: string; value: string; percent: number; color: string }[];
  claimsCounts: { month: string; count: number }[];
  dispenseRate: { category: string; value: number }[];
  paidPlan: { category: string; value: number }[];
}

type AccountDashboardData = Record<PeriodKey, PeriodDashboardData>;

const dashboardDataByAccount: Record<string, AccountDashboardData> = {
  'book-of-business': {
    ytd: {
      summaryLabel: 'YTD through June 2026',
      totalSavings: { value: '$17.70M', delta: '3%' },
      claims: { value: '1.3M', delta: '3%' },
      utilization: { value: 49, delta: '1 pts' },
      paid: { value: '$293M', delta: '6%' },
      pmpm: { value: '$293.03', delta: '7%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$6.91M', percent: 39, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$3.62M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$3.22M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$3.95M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Jan', count: 223000 },
        { month: 'Feb', count: 214000 },
        { month: 'Mar', count: 232000 },
        { month: 'Apr', count: 220000 },
        { month: 'May', count: 216000 },
        { month: 'Jun', count: 223000 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.5 },
        { category: 'Generic', value: 85.7 },
        { category: 'Brand', value: 12.7 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 24.67 },
        { category: 'Generic', value: 3.89 },
        { category: 'Brand', value: 22.82 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$2.95M', delta: '4%' },
      claims: { value: '223K', delta: '3%' },
      utilization: { value: 51, delta: '2 pts' },
      paid: { value: '$51.2M', delta: '8%' },
      pmpm: { value: '$298.10', delta: '5%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$1.18M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.58M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.53M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.66M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Week 1', count: 54200 },
        { month: 'Week 2', count: 57800 },
        { month: 'Week 3', count: 55600 },
        { month: 'Week 4', count: 55400 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.6 },
        { category: 'Generic', value: 85.2 },
        { category: 'Brand', value: 13.2 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 4.35 },
        { category: 'Generic', value: 0.68 },
        { category: 'Brand', value: 4.02 },
      ],
    },
  },
  '1': {
    ytd: {
      summaryLabel: 'YTD through June 2026',
      totalSavings: { value: '$1.42M', delta: '2%' },
      claims: { value: '84K', delta: '4%' },
      utilization: { value: 44, delta: '2 pts' },
      paid: { value: '$21.6M', delta: '5%' },
      pmpm: { value: '$268.11', delta: '4%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$0.58M', percent: 41, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.28M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.24M', percent: 17, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.32M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Jan', count: 13800 },
        { month: 'Feb', count: 13200 },
        { month: 'Mar', count: 14500 },
        { month: 'Apr', count: 13600 },
        { month: 'May', count: 13100 },
        { month: 'Jun', count: 14100 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.2 },
        { category: 'Generic', value: 87.1 },
        { category: 'Brand', value: 11.7 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 1.92 },
        { category: 'Generic', value: 0.31 },
        { category: 'Brand', value: 1.74 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.24M', delta: '2%' },
      claims: { value: '14.1K', delta: '7%' },
      utilization: { value: 46, delta: '1 pts' },
      paid: { value: '$3.68M', delta: '4%' },
      pmpm: { value: '$271.90', delta: '3%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$0.10M', percent: 41, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.05M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.04M', percent: 17, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.05M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Week 1', count: 3300 },
        { month: 'Week 2', count: 3600 },
        { month: 'Week 3', count: 3500 },
        { month: 'Week 4', count: 3700 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.3 },
        { category: 'Generic', value: 86.5 },
        { category: 'Brand', value: 12.2 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 0.33 },
        { category: 'Generic', value: 0.05 },
        { category: 'Brand', value: 0.30 },
      ],
    },
  },
  '2': {
    ytd: {
      summaryLabel: 'YTD through June 2026',
      totalSavings: { value: '$3.95M', delta: '5%' },
      claims: { value: '312K', delta: '2%' },
      utilization: { value: 52, delta: '1 pts' },
      paid: { value: '$68.4M', delta: '7%' },
      pmpm: { value: '$301.55', delta: '8%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$1.58M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.79M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.75M', percent: 19, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.83M', percent: 21, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Jan', count: 52000 },
        { month: 'Feb', count: 49800 },
        { month: 'Mar', count: 54200 },
        { month: 'Apr', count: 51600 },
        { month: 'May', count: 50400 },
        { month: 'Jun', count: 52300 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.8 },
        { category: 'Generic', value: 84.5 },
        { category: 'Brand', value: 13.7 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 6.12 },
        { category: 'Generic', value: 0.92 },
        { category: 'Brand', value: 5.61 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.66M', delta: '5%' },
      claims: { value: '52.3K', delta: '4%' },
      utilization: { value: 54, delta: '2 pts' },
      paid: { value: '$11.9M', delta: '9%' },
      pmpm: { value: '$305.20', delta: '6%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$0.26M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.13M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.13M', percent: 19, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.14M', percent: 21, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Week 1', count: 12600 },
        { month: 'Week 2', count: 13400 },
        { month: 'Week 3', count: 13000 },
        { month: 'Week 4', count: 13300 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.9 },
        { category: 'Generic', value: 83.9 },
        { category: 'Brand', value: 14.2 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 1.07 },
        { category: 'Generic', value: 0.16 },
        { category: 'Brand', value: 0.98 },
      ],
    },
  },
  '3': {
    ytd: {
      summaryLabel: 'YTD through June 2026',
      totalSavings: { value: '$5.61M', delta: '4%' },
      claims: { value: '498K', delta: '3%' },
      utilization: { value: 47, delta: '1 pts' },
      paid: { value: '$91.2M', delta: '6%' },
      pmpm: { value: '$289.40', delta: '6%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$2.24M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$1.12M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$1.01M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$1.24M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Jan', count: 83200 },
        { month: 'Feb', count: 79600 },
        { month: 'Mar', count: 86700 },
        { month: 'Apr', count: 82400 },
        { month: 'May', count: 80900 },
        { month: 'Jun', count: 83600 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.6 },
        { category: 'Generic', value: 85.9 },
        { category: 'Brand', value: 12.5 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 8.87 },
        { category: 'Generic', value: 1.37 },
        { category: 'Brand', value: 7.62 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.94M', delta: '4%' },
      claims: { value: '83.6K', delta: '3%' },
      utilization: { value: 49, delta: '1 pts' },
      paid: { value: '$15.8M', delta: '7%' },
      pmpm: { value: '$292.75', delta: '5%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$0.38M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.19M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.17M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.20M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Week 1', count: 20200 },
        { month: 'Week 2', count: 21500 },
        { month: 'Week 3', count: 20800 },
        { month: 'Week 4', count: 21100 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.7 },
        { category: 'Generic', value: 85.3 },
        { category: 'Brand', value: 13.0 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 1.55 },
        { category: 'Generic', value: 0.24 },
        { category: 'Brand', value: 1.32 },
      ],
    },
  },
  '4': {
    ytd: {
      summaryLabel: 'YTD through June 2026',
      totalSavings: { value: '$2.18M', delta: '3%' },
      claims: { value: '176K', delta: '2%' },
      utilization: { value: 45, delta: '1 pts' },
      paid: { value: '$34.9M', delta: '5%' },
      pmpm: { value: '$275.02', delta: '5%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$0.87M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.44M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.39M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.48M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Jan', count: 29400 },
        { month: 'Feb', count: 28100 },
        { month: 'Mar', count: 30600 },
        { month: 'Apr', count: 29100 },
        { month: 'May', count: 28500 },
        { month: 'Jun', count: 29500 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.4 },
        { category: 'Generic', value: 86.3 },
        { category: 'Brand', value: 12.3 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 3.31 },
        { category: 'Generic', value: 0.53 },
        { category: 'Brand', value: 3.03 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.37M', delta: '3%' },
      claims: { value: '29.5K', delta: '2%' },
      utilization: { value: 46, delta: '1 pts' },
      paid: { value: '$5.96M', delta: '6%' },
      pmpm: { value: '$278.40', delta: '4%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$0.15M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.07M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.07M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.08M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Week 1', count: 7100 },
        { month: 'Week 2', count: 7500 },
        { month: 'Week 3', count: 7300 },
        { month: 'Week 4', count: 7600 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.5 },
        { category: 'Generic', value: 85.8 },
        { category: 'Brand', value: 12.7 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 0.55 },
        { category: 'Generic', value: 0.09 },
        { category: 'Brand', value: 0.50 },
      ],
    },
  },
  '5': {
    ytd: {
      summaryLabel: 'YTD through June 2026',
      totalSavings: { value: '$4.54M', delta: '4%' },
      claims: { value: '287K', delta: '3%' },
      utilization: { value: 51, delta: '2 pts' },
      paid: { value: '$76.9M', delta: '7%' },
      pmpm: { value: '$296.95', delta: '7%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$1.81M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.91M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.83M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.99M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Jan', count: 48100 },
        { month: 'Feb', count: 46000 },
        { month: 'Mar', count: 50200 },
        { month: 'Apr', count: 47700 },
        { month: 'May', count: 46800 },
        { month: 'Jun', count: 48300 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.7 },
        { category: 'Generic', value: 84.9 },
        { category: 'Brand', value: 13.4 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 7.49 },
        { category: 'Generic', value: 1.16 },
        { category: 'Brand', value: 6.85 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.76M', delta: '4%' },
      claims: { value: '48.3K', delta: '3%' },
      utilization: { value: 53, delta: '2 pts' },
      paid: { value: '$13.4M', delta: '8%' },
      pmpm: { value: '$300.85', delta: '6%' },
      savingsBreakdownItems: [
        { label: 'VCP', value: '$0.30M', percent: 40, color: '#0F285B' },
        { label: 'Avoided Fees', value: '$0.15M', percent: 20, color: '#2C82CB' },
        { label: 'Biosimilar', value: '$0.14M', percent: 18, color: '#60B0E0' },
        { label: 'Clinical', value: '$0.17M', percent: 22, color: '#9AA0B4' },
      ],
      claimsCounts: [
        { month: 'Week 1', count: 11600 },
        { month: 'Week 2', count: 12300 },
        { month: 'Week 3', count: 11900 },
        { month: 'Week 4', count: 12500 },
      ],
      dispenseRate: [
        { category: 'Specialty', value: 1.8 },
        { category: 'Generic', value: 84.4 },
        { category: 'Brand', value: 13.9 },
      ],
      paidPlan: [
        { category: 'Specialty', value: 1.31 },
        { category: 'Generic', value: 0.20 },
        { category: 'Brand', value: 1.19 },
      ],
    },
  },
};

const activeData = computed<PeriodDashboardData>(() => {
  const key = selectedAccountId.value === BOOK_OF_BUSINESS_ID ? 'book-of-business' : String(selectedAccountId.value);
  const accountData = dashboardDataByAccount[key] ?? dashboardDataByAccount['book-of-business'];
  return accountData[selectedPeriod.value];
});

const selectedAccountName = computed(() =>
  accountOptions.value.find((a) => a.id === selectedAccountId.value)?.name ?? 'All Accounts'
);

const executiveSummaryMessage = computed(() => {
  const scope = selectedAccountId.value === BOOK_OF_BUSINESS_ID ? '' : ` for ${selectedAccountName.value}`;
  const d = activeData.value;
  const periodLabel = selectedPeriod.value === 'ytd' ? 'year-to-date' : 'for the month';
  return `<strong>Executive Summary</strong> For ${d.summaryLabel}${scope}, pharmacy utilization was ${d.utilization.value}%, with ${d.claims.value} paid claims ${periodLabel} and ${d.totalSavings.value} in total savings. Paid plan and PMPM trends reflect activity through the most recent completed period.`;
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.home-page-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-medium;

  h1 {
    margin-bottom: 0;
    margin-top: 6px;
  }
}

.home-header-controls {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  margin-left: auto;
  flex-shrink: 0;
}

.account-select {
  max-width: 300px;
  min-width: 220px;
  flex-shrink: 0;

  :deep(.v-input__details) {
    display: none;
  }
}

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
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
  .widgets-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .kpi-container {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .home-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .home-header-controls {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-left: 0;
  }

  .account-select {
    max-width: 100%;
    width: 100%;
  }

  .widgets-container {
    grid-template-columns: 1fr;
  }

  .kpi-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .two-column-layout {
    grid-template-columns: 1fr;
  }
}
</style>
