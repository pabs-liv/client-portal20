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
        :description="`Requests needing review · Avg TAT ${activeData.priorAuthAvgTat}`"
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

    <p class="dashboard-context-line text-small">
      {{ activeData.memberCount }} Members · {{ activeData.employeeCount }} Employees · {{ activeData.prescriptionCount }} Prescriptions
    </p>

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
      <KpiStatCard
        label="Rx PMPM"
        :value="activeData.rxPmpm.value"
        :deltaValue="activeData.rxPmpm.delta"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Rx PEPM"
        :value="activeData.rxPepm.value"
        :deltaValue="activeData.rxPepm.delta"
        deltaDirection="up"
      />
      <KpiStatCard
        label="Member Cost Share"
        :value="activeData.memberCostShare.value"
        :deltaValue="activeData.memberCostShare.delta"
        deltaDirection="up"
      />
    </div>

    <PageCard headerText="Savings Story" :descriptionText="activeData.summaryLabel">
      <SavingsBreakdownChart
        :breakdown-items="activeData.savingsBreakdownItems"
        :claims-counts="activeData.claimsCounts"
      />
    </PageCard>

    <div class="drivers-row" :class="{ 'drivers-row--columns': selectedPeriod === 'month' }">
      <PageCard headerText="Utilization" :descriptionText="activeData.summaryLabel">
        <UtilizationDriversChart
          :utilization-percent="activeData.utilization.value"
          :utilization-delta="activeData.utilization.delta"
          :monthly-utilization="activeData.monthlyUtilization"
          :show-monthly-utilization="selectedPeriod === 'ytd'"
        />
      </PageCard>

      <PageCard headerText="Dispense Rate" :descriptionText="activeData.summaryLabel">
        <CategoryTrendChart
          :current-values="activeData.dispenseRate"
          :monthly-data="activeData.monthlyDispenseRate"
          :show-monthly-trend="selectedPeriod === 'ytd'"
          unit="percent"
        />
      </PageCard>

      <PageCard headerText="Paid Plan" :descriptionText="activeData.summaryLabel">
        <CategoryTrendChart
          :current-values="activeData.paidPlan"
          :monthly-data="activeData.monthlyPaidPlan"
          :show-monthly-trend="selectedPeriod === 'ytd'"
          unit="dollarM"
        />
      </PageCard>
    </div>

    <PageCard headerText="Top Cost Drivers" :descriptionText="activeData.summaryLabel">
      <TopDriversCard
        :top-brand-medications="activeData.topBrandMedications"
        :top-therapeutic-classes="activeData.topTherapeuticClasses"
      />
    </PageCard>
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
import CategoryTrendChart from '../components/common/CategoryTrendChart.vue';
import TopDriversCard from '../components/common/TopDriversCard.vue';
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
  memberCount: string;
  employeeCount: string;
  prescriptionCount: string;
  rxPmpm: { value: string; delta: string };
  rxPepm: { value: string; delta: string };
  memberCostShare: { value: string; delta: string };
  priorAuthAvgTat: string;
  savingsBreakdownItems: { label: string; value: string; percent: number; color: string }[];
  claimsCounts: { month: string; count: number }[];
  monthlyUtilization?: { month: string; value: number }[];
  dispenseRate: { category: string; value: number }[];
  paidPlan: { category: string; value: number }[];
  monthlyDispenseRate?: { month: string; Specialty: number; Generic: number; Brand: number }[];
  monthlyPaidPlan?: { month: string; Specialty: number; Generic: number; Brand: number }[];
  topBrandMedications: { name: string; percentOfCost: number }[];
  topTherapeuticClasses: { name: string; percentOfCost: number }[];
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
      memberCount: '12,400',
      employeeCount: '340',
      prescriptionCount: '1.3M',
      rxPmpm: { value: '$248.60', delta: '6%' },
      rxPepm: { value: '$897.40', delta: '5%' },
      memberCostShare: { value: '18.2%', delta: '1 pts' },
      priorAuthAvgTat: '2.1 days',
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
      monthlyUtilization: [
        { month: 'Jan', value: 46 },
        { month: 'Feb', value: 47 },
        { month: 'Mar', value: 48 },
        { month: 'Apr', value: 48 },
        { month: 'May', value: 49 },
        { month: 'Jun', value: 49 },
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
      monthlyDispenseRate: [
        { month: 'Jan', Specialty: 1.3, Generic: 86.4, Brand: 12.3 },
        { month: 'Feb', Specialty: 1.4, Generic: 86.0, Brand: 12.6 },
        { month: 'Mar', Specialty: 1.4, Generic: 85.9, Brand: 12.7 },
        { month: 'Apr', Specialty: 1.5, Generic: 85.8, Brand: 12.7 },
        { month: 'May', Specialty: 1.5, Generic: 85.7, Brand: 12.8 },
        { month: 'Jun', Specialty: 1.5, Generic: 85.7, Brand: 12.7 },
      ],
      monthlyPaidPlan: [
        { month: 'Jan', Specialty: 22.10, Generic: 3.55, Brand: 20.90 },
        { month: 'Feb', Specialty: 22.80, Generic: 3.62, Brand: 21.30 },
        { month: 'Mar', Specialty: 23.40, Generic: 3.70, Brand: 21.90 },
        { month: 'Apr', Specialty: 23.90, Generic: 3.78, Brand: 22.20 },
        { month: 'May', Specialty: 24.30, Generic: 3.83, Brand: 22.50 },
        { month: 'Jun', Specialty: 24.67, Generic: 3.89, Brand: 22.82 },
      ],
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.4 },
        { name: 'Ozempic', percentOfCost: 7.1 },
        { name: 'Trulicity', percentOfCost: 5.6 },
        { name: 'Skyrizi', percentOfCost: 4.2 },
        { name: 'Eliquis', percentOfCost: 3.8 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 14.2 },
        { name: 'Autoimmune', percentOfCost: 11.8 },
        { name: 'Oncology', percentOfCost: 9.5 },
        { name: 'Cardiovascular', percentOfCost: 7.3 },
        { name: 'Respiratory', percentOfCost: 5.1 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$2.95M', delta: '4%' },
      claims: { value: '223K', delta: '3%' },
      utilization: { value: 51, delta: '2 pts' },
      paid: { value: '$51.2M', delta: '8%' },
      pmpm: { value: '$298.10', delta: '5%' },
      memberCount: '12,400',
      employeeCount: '340',
      prescriptionCount: '223K',
      rxPmpm: { value: '$252.90', delta: '5%' },
      rxPepm: { value: '$914.20', delta: '6%' },
      memberCostShare: { value: '18.6%', delta: '1 pts' },
      priorAuthAvgTat: '1.9 days',
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
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.1 },
        { name: 'Ozempic', percentOfCost: 7.4 },
        { name: 'Trulicity', percentOfCost: 5.8 },
        { name: 'Skyrizi', percentOfCost: 4.3 },
        { name: 'Eliquis', percentOfCost: 3.6 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 14.6 },
        { name: 'Autoimmune', percentOfCost: 11.5 },
        { name: 'Oncology', percentOfCost: 9.7 },
        { name: 'Cardiovascular', percentOfCost: 7.1 },
        { name: 'Respiratory', percentOfCost: 4.9 },
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
      memberCount: '1,200',
      employeeCount: '32',
      prescriptionCount: '84K',
      rxPmpm: { value: '$226.40', delta: '4%' },
      rxPepm: { value: '$798.10', delta: '4%' },
      memberCostShare: { value: '17.4%', delta: '1 pts' },
      priorAuthAvgTat: '2.4 days',
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
      monthlyUtilization: [
        { month: 'Jan', value: 41 },
        { month: 'Feb', value: 42 },
        { month: 'Mar', value: 43 },
        { month: 'Apr', value: 43 },
        { month: 'May', value: 44 },
        { month: 'Jun', value: 44 },
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
      monthlyDispenseRate: [
        { month: 'Jan', Specialty: 1.0, Generic: 87.8, Brand: 11.2 },
        { month: 'Feb', Specialty: 1.1, Generic: 87.5, Brand: 11.4 },
        { month: 'Mar', Specialty: 1.1, Generic: 87.3, Brand: 11.6 },
        { month: 'Apr', Specialty: 1.2, Generic: 87.2, Brand: 11.6 },
        { month: 'May', Specialty: 1.2, Generic: 87.1, Brand: 11.7 },
        { month: 'Jun', Specialty: 1.2, Generic: 87.1, Brand: 11.7 },
      ],
      monthlyPaidPlan: [
        { month: 'Jan', Specialty: 1.68, Generic: 0.27, Brand: 1.52 },
        { month: 'Feb', Specialty: 1.74, Generic: 0.28, Brand: 1.58 },
        { month: 'Mar', Specialty: 1.80, Generic: 0.29, Brand: 1.63 },
        { month: 'Apr', Specialty: 1.85, Generic: 0.30, Brand: 1.68 },
        { month: 'May', Specialty: 1.89, Generic: 0.31, Brand: 1.71 },
        { month: 'Jun', Specialty: 1.92, Generic: 0.31, Brand: 1.74 },
      ],
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 7.8 },
        { name: 'Ozempic', percentOfCost: 6.9 },
        { name: 'Trulicity', percentOfCost: 5.2 },
        { name: 'Skyrizi', percentOfCost: 3.9 },
        { name: 'Eliquis', percentOfCost: 3.4 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 13.5 },
        { name: 'Autoimmune', percentOfCost: 10.9 },
        { name: 'Oncology', percentOfCost: 8.8 },
        { name: 'Cardiovascular', percentOfCost: 6.7 },
        { name: 'Respiratory', percentOfCost: 4.6 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.24M', delta: '2%' },
      claims: { value: '14.1K', delta: '7%' },
      utilization: { value: 46, delta: '1 pts' },
      paid: { value: '$3.68M', delta: '4%' },
      pmpm: { value: '$271.90', delta: '3%' },
      memberCount: '1,200',
      employeeCount: '32',
      prescriptionCount: '14.1K',
      rxPmpm: { value: '$229.80', delta: '3%' },
      rxPepm: { value: '$806.50', delta: '4%' },
      memberCostShare: { value: '17.6%', delta: '1 pts' },
      priorAuthAvgTat: '2.2 days',
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
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.0 },
        { name: 'Ozempic', percentOfCost: 7.0 },
        { name: 'Trulicity', percentOfCost: 5.3 },
        { name: 'Skyrizi', percentOfCost: 4.0 },
        { name: 'Eliquis', percentOfCost: 3.5 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 13.8 },
        { name: 'Autoimmune', percentOfCost: 11.1 },
        { name: 'Oncology', percentOfCost: 9.0 },
        { name: 'Cardiovascular', percentOfCost: 6.9 },
        { name: 'Respiratory', percentOfCost: 4.7 },
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
      memberCount: '4,400',
      employeeCount: '120',
      prescriptionCount: '312K',
      rxPmpm: { value: '$249.30', delta: '7%' },
      rxPepm: { value: '$885.60', delta: '7%' },
      memberCostShare: { value: '17.9%', delta: '1 pts' },
      priorAuthAvgTat: '2.0 days',
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
      monthlyUtilization: [
        { month: 'Jan', value: 49 },
        { month: 'Feb', value: 50 },
        { month: 'Mar', value: 51 },
        { month: 'Apr', value: 51 },
        { month: 'May', value: 52 },
        { month: 'Jun', value: 52 },
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
      monthlyDispenseRate: [
        { month: 'Jan', Specialty: 1.6, Generic: 85.2, Brand: 13.2 },
        { month: 'Feb', Specialty: 1.7, Generic: 84.9, Brand: 13.4 },
        { month: 'Mar', Specialty: 1.7, Generic: 84.7, Brand: 13.6 },
        { month: 'Apr', Specialty: 1.8, Generic: 84.6, Brand: 13.6 },
        { month: 'May', Specialty: 1.8, Generic: 84.5, Brand: 13.7 },
        { month: 'Jun', Specialty: 1.8, Generic: 84.5, Brand: 13.7 },
      ],
      monthlyPaidPlan: [
        { month: 'Jan', Specialty: 5.42, Generic: 0.82, Brand: 4.96 },
        { month: 'Feb', Specialty: 5.60, Generic: 0.85, Brand: 5.13 },
        { month: 'Mar', Specialty: 5.78, Generic: 0.87, Brand: 5.29 },
        { month: 'Apr', Specialty: 5.92, Generic: 0.89, Brand: 5.42 },
        { month: 'May', Specialty: 6.03, Generic: 0.91, Brand: 5.52 },
        { month: 'Jun', Specialty: 6.12, Generic: 0.92, Brand: 5.61 },
      ],
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.7 },
        { name: 'Ozempic', percentOfCost: 7.6 },
        { name: 'Trulicity', percentOfCost: 6.1 },
        { name: 'Skyrizi', percentOfCost: 4.5 },
        { name: 'Eliquis', percentOfCost: 3.9 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 14.9 },
        { name: 'Autoimmune', percentOfCost: 12.1 },
        { name: 'Oncology', percentOfCost: 9.9 },
        { name: 'Cardiovascular', percentOfCost: 7.5 },
        { name: 'Respiratory', percentOfCost: 5.3 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.66M', delta: '5%' },
      claims: { value: '52.3K', delta: '4%' },
      utilization: { value: 54, delta: '2 pts' },
      paid: { value: '$11.9M', delta: '9%' },
      pmpm: { value: '$305.20', delta: '6%' },
      memberCount: '4,400',
      employeeCount: '120',
      prescriptionCount: '52.3K',
      rxPmpm: { value: '$253.70', delta: '6%' },
      rxPepm: { value: '$898.90', delta: '7%' },
      memberCostShare: { value: '18.1%', delta: '1 pts' },
      priorAuthAvgTat: '1.8 days',
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
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.9 },
        { name: 'Ozempic', percentOfCost: 7.8 },
        { name: 'Trulicity', percentOfCost: 6.3 },
        { name: 'Skyrizi', percentOfCost: 4.7 },
        { name: 'Eliquis', percentOfCost: 4.0 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 15.2 },
        { name: 'Autoimmune', percentOfCost: 12.4 },
        { name: 'Oncology', percentOfCost: 10.1 },
        { name: 'Cardiovascular', percentOfCost: 7.7 },
        { name: 'Respiratory', percentOfCost: 5.4 },
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
      memberCount: '7,100',
      employeeCount: '195',
      prescriptionCount: '498K',
      rxPmpm: { value: '$239.80', delta: '5%' },
      rxPepm: { value: '$851.30', delta: '6%' },
      memberCostShare: { value: '16.8%', delta: '1 pts' },
      priorAuthAvgTat: '2.3 days',
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
      monthlyUtilization: [
        { month: 'Jan', value: 44 },
        { month: 'Feb', value: 45 },
        { month: 'Mar', value: 46 },
        { month: 'Apr', value: 46 },
        { month: 'May', value: 47 },
        { month: 'Jun', value: 47 },
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
      monthlyDispenseRate: [
        { month: 'Jan', Specialty: 1.4, Generic: 86.5, Brand: 12.1 },
        { month: 'Feb', Specialty: 1.5, Generic: 86.2, Brand: 12.3 },
        { month: 'Mar', Specialty: 1.5, Generic: 86.0, Brand: 12.5 },
        { month: 'Apr', Specialty: 1.6, Generic: 85.9, Brand: 12.5 },
        { month: 'May', Specialty: 1.6, Generic: 85.9, Brand: 12.5 },
        { month: 'Jun', Specialty: 1.6, Generic: 85.9, Brand: 12.5 },
      ],
      monthlyPaidPlan: [
        { month: 'Jan', Specialty: 7.85, Generic: 1.21, Brand: 6.74 },
        { month: 'Feb', Specialty: 8.10, Generic: 1.25, Brand: 6.96 },
        { month: 'Mar', Specialty: 8.38, Generic: 1.29, Brand: 7.20 },
        { month: 'Apr', Specialty: 8.60, Generic: 1.33, Brand: 7.39 },
        { month: 'May', Specialty: 8.74, Generic: 1.35, Brand: 7.51 },
        { month: 'Jun', Specialty: 8.87, Generic: 1.37, Brand: 7.62 },
      ],
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.3 },
        { name: 'Ozempic', percentOfCost: 7.2 },
        { name: 'Trulicity', percentOfCost: 5.7 },
        { name: 'Skyrizi', percentOfCost: 4.1 },
        { name: 'Eliquis', percentOfCost: 3.7 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 14.0 },
        { name: 'Autoimmune', percentOfCost: 11.6 },
        { name: 'Oncology', percentOfCost: 9.3 },
        { name: 'Cardiovascular', percentOfCost: 7.0 },
        { name: 'Respiratory', percentOfCost: 4.8 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.94M', delta: '4%' },
      claims: { value: '83.6K', delta: '3%' },
      utilization: { value: 49, delta: '1 pts' },
      paid: { value: '$15.8M', delta: '7%' },
      pmpm: { value: '$292.75', delta: '5%' },
      memberCount: '7,100',
      employeeCount: '195',
      prescriptionCount: '83.6K',
      rxPmpm: { value: '$243.10', delta: '4%' },
      rxPepm: { value: '$862.70', delta: '5%' },
      memberCostShare: { value: '17.0%', delta: '1 pts' },
      priorAuthAvgTat: '2.1 days',
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
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.5 },
        { name: 'Ozempic', percentOfCost: 7.4 },
        { name: 'Trulicity', percentOfCost: 5.9 },
        { name: 'Skyrizi', percentOfCost: 4.2 },
        { name: 'Eliquis', percentOfCost: 3.8 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 14.3 },
        { name: 'Autoimmune', percentOfCost: 11.9 },
        { name: 'Oncology', percentOfCost: 9.5 },
        { name: 'Cardiovascular', percentOfCost: 7.2 },
        { name: 'Respiratory', percentOfCost: 5.0 },
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
      memberCount: '2,500',
      employeeCount: '70',
      prescriptionCount: '176K',
      rxPmpm: { value: '$229.60', delta: '4%' },
      rxPepm: { value: '$811.90', delta: '5%' },
      memberCostShare: { value: '17.2%', delta: '1 pts' },
      priorAuthAvgTat: '2.5 days',
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
      monthlyUtilization: [
        { month: 'Jan', value: 42 },
        { month: 'Feb', value: 43 },
        { month: 'Mar', value: 44 },
        { month: 'Apr', value: 44 },
        { month: 'May', value: 45 },
        { month: 'Jun', value: 45 },
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
      monthlyDispenseRate: [
        { month: 'Jan', Specialty: 1.2, Generic: 87.0, Brand: 11.8 },
        { month: 'Feb', Specialty: 1.3, Generic: 86.7, Brand: 12.0 },
        { month: 'Mar', Specialty: 1.3, Generic: 86.5, Brand: 12.2 },
        { month: 'Apr', Specialty: 1.4, Generic: 86.4, Brand: 12.2 },
        { month: 'May', Specialty: 1.4, Generic: 86.3, Brand: 12.3 },
        { month: 'Jun', Specialty: 1.4, Generic: 86.3, Brand: 12.3 },
      ],
      monthlyPaidPlan: [
        { month: 'Jan', Specialty: 2.93, Generic: 0.47, Brand: 2.68 },
        { month: 'Feb', Specialty: 3.02, Generic: 0.48, Brand: 2.77 },
        { month: 'Mar', Specialty: 3.12, Generic: 0.50, Brand: 2.86 },
        { month: 'Apr', Specialty: 3.20, Generic: 0.51, Brand: 2.93 },
        { month: 'May', Specialty: 3.26, Generic: 0.52, Brand: 2.98 },
        { month: 'Jun', Specialty: 3.31, Generic: 0.53, Brand: 3.03 },
      ],
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 7.9 },
        { name: 'Ozempic', percentOfCost: 6.8 },
        { name: 'Trulicity', percentOfCost: 5.4 },
        { name: 'Skyrizi', percentOfCost: 3.8 },
        { name: 'Eliquis', percentOfCost: 3.3 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 13.3 },
        { name: 'Autoimmune', percentOfCost: 10.7 },
        { name: 'Oncology', percentOfCost: 8.6 },
        { name: 'Cardiovascular', percentOfCost: 6.5 },
        { name: 'Respiratory', percentOfCost: 4.4 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.37M', delta: '3%' },
      claims: { value: '29.5K', delta: '2%' },
      utilization: { value: 46, delta: '1 pts' },
      paid: { value: '$5.96M', delta: '6%' },
      pmpm: { value: '$278.40', delta: '4%' },
      memberCount: '2,500',
      employeeCount: '70',
      prescriptionCount: '29.5K',
      rxPmpm: { value: '$232.90', delta: '3%' },
      rxPepm: { value: '$823.40', delta: '4%' },
      memberCostShare: { value: '17.5%', delta: '1 pts' },
      priorAuthAvgTat: '2.3 days',
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
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.0 },
        { name: 'Ozempic', percentOfCost: 6.9 },
        { name: 'Trulicity', percentOfCost: 5.5 },
        { name: 'Skyrizi', percentOfCost: 3.9 },
        { name: 'Eliquis', percentOfCost: 3.4 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 13.6 },
        { name: 'Autoimmune', percentOfCost: 10.9 },
        { name: 'Oncology', percentOfCost: 8.8 },
        { name: 'Cardiovascular', percentOfCost: 6.7 },
        { name: 'Respiratory', percentOfCost: 4.5 },
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
      memberCount: '4,000',
      employeeCount: '110',
      prescriptionCount: '287K',
      rxPmpm: { value: '$247.20', delta: '6%' },
      rxPepm: { value: '$877.50', delta: '7%' },
      memberCostShare: { value: '17.7%', delta: '2 pts' },
      priorAuthAvgTat: '1.9 days',
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
      monthlyUtilization: [
        { month: 'Jan', value: 48 },
        { month: 'Feb', value: 49 },
        { month: 'Mar', value: 50 },
        { month: 'Apr', value: 50 },
        { month: 'May', value: 51 },
        { month: 'Jun', value: 51 },
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
      monthlyDispenseRate: [
        { month: 'Jan', Specialty: 1.5, Generic: 85.6, Brand: 12.9 },
        { month: 'Feb', Specialty: 1.6, Generic: 85.3, Brand: 13.1 },
        { month: 'Mar', Specialty: 1.6, Generic: 85.1, Brand: 13.3 },
        { month: 'Apr', Specialty: 1.7, Generic: 85.0, Brand: 13.3 },
        { month: 'May', Specialty: 1.7, Generic: 84.9, Brand: 13.4 },
        { month: 'Jun', Specialty: 1.7, Generic: 84.9, Brand: 13.4 },
      ],
      monthlyPaidPlan: [
        { month: 'Jan', Specialty: 6.61, Generic: 1.02, Brand: 6.05 },
        { month: 'Feb', Specialty: 6.82, Generic: 1.06, Brand: 6.25 },
        { month: 'Mar', Specialty: 7.05, Generic: 1.09, Brand: 6.46 },
        { month: 'Apr', Specialty: 7.24, Generic: 1.12, Brand: 6.63 },
        { month: 'May', Specialty: 7.38, Generic: 1.14, Brand: 6.75 },
        { month: 'Jun', Specialty: 7.49, Generic: 1.16, Brand: 6.85 },
      ],
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.6 },
        { name: 'Ozempic', percentOfCost: 7.5 },
        { name: 'Trulicity', percentOfCost: 6.0 },
        { name: 'Skyrizi', percentOfCost: 4.4 },
        { name: 'Eliquis', percentOfCost: 3.9 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 14.7 },
        { name: 'Autoimmune', percentOfCost: 12.0 },
        { name: 'Oncology', percentOfCost: 9.8 },
        { name: 'Cardiovascular', percentOfCost: 7.4 },
        { name: 'Respiratory', percentOfCost: 5.2 },
      ],
    },
    month: {
      summaryLabel: 'June 2026',
      totalSavings: { value: '$0.76M', delta: '4%' },
      claims: { value: '48.3K', delta: '3%' },
      utilization: { value: 53, delta: '2 pts' },
      paid: { value: '$13.4M', delta: '8%' },
      pmpm: { value: '$300.85', delta: '6%' },
      memberCount: '4,000',
      employeeCount: '110',
      prescriptionCount: '48.3K',
      rxPmpm: { value: '$251.50', delta: '5%' },
      rxPepm: { value: '$891.10', delta: '6%' },
      memberCostShare: { value: '17.9%', delta: '2 pts' },
      priorAuthAvgTat: '1.8 days',
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
      topBrandMedications: [
        { name: 'Humira', percentOfCost: 8.8 },
        { name: 'Ozempic', percentOfCost: 7.7 },
        { name: 'Trulicity', percentOfCost: 6.2 },
        { name: 'Skyrizi', percentOfCost: 4.6 },
        { name: 'Eliquis', percentOfCost: 4.0 },
      ],
      topTherapeuticClasses: [
        { name: 'Diabetes', percentOfCost: 15.0 },
        { name: 'Autoimmune', percentOfCost: 12.3 },
        { name: 'Oncology', percentOfCost: 10.0 },
        { name: 'Cardiovascular', percentOfCost: 7.6 },
        { name: 'Respiratory', percentOfCost: 5.3 },
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

.dashboard-context-line {
  color: $color-text-secondary;
  font-size: 1.2rem !important;
  margin: 0;
}

.kpi-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-medium;
}

.drivers-row {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.drivers-row--columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-medium;
  align-items: stretch;

  :deep(.page-card) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :deep(.page-card-content) {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .widgets-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .kpi-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .drivers-row--columns {
    grid-template-columns: 1fr 1fr;
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

  .drivers-row--columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .kpi-container {
    grid-template-columns: 1fr;
  }
}
</style>
