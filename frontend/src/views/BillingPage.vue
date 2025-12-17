<template>
  <div>
    <h1 class="text-h1 mb-large">Billing</h1>
    <div class="mt-large chart-container mb-large">
      <h3 class="text-h3">Billed Amount Over Time</h3>
      <apexchart
        type="area"
        height="200"
        :options="chartOptions"
        :series="billedAmountOverTime.series"
      ></apexchart>
    </div>
    <PageCard
      headerText="Statement & Invoice Explorer"
      descriptionText="View and download invoices and statements with ease."
    >
      <ReportDataTable
        :headers="billingHeaders"
        :items="billingData"
        :show-search-bar="true"
        :show-filter-button="false"
        :show-row-actions="true"
        :show-filter-pills="true"
        :initial-filter-pills="billingFilterPills"
        search-placeholder="Search invoices and statements"
      />
    </PageCard>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import VueApexCharts from 'vue3-apexcharts';

const billingHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'Billing Type', key: 'billingType' },
  { title: 'ID', key: 'id', align: 'end' },
  { title: 'Invoice/Statement Detail', key: 'detail' },
  { title: 'Billing Period', key: 'billingPeriod' },
  { title: 'Amount', key: 'amount', align: 'end' },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]);

const billingData = ref([
  {
    accountName: 'Company A',
    billingType: 'Invoice',
    id: 'INV001',
    detail: 'Monthly Services',
    billingPeriod: '2025-06',
    amount: '$1,500.00',
  },
  {
    accountName: 'Company B',
    billingType: 'Statement',
    id: 'STM002',
    detail: 'Q2 Summary',
    billingPeriod: '2025-Q2',
    amount: '$3,200.00',
  },
  {
    accountName: 'Company C',
    billingType: 'Invoice',
    id: 'INV003',
    detail: 'Consulting Fees',
    billingPeriod: '2025-07',
    amount: '$800.00',
  },
  {
    accountName: 'Company D',
    billingType: 'Statement',
    id: 'STM004',
    detail: 'Annual Report',
    billingPeriod: '2025-FY',
    amount: '$5,000.00',
  },
  {
    accountName: 'Company E',
    billingType: 'Invoice',
    id: 'INV005',
    detail: 'Service Adjustment',
    billingPeriod: '2025-06',
    amount: '$250.00',
  },
  {
    accountName: 'Company F',
    billingType: 'Statement',
    id: 'STM006',
    detail: 'Monthly Summary',
    billingPeriod: '2025-07',
    amount: '$1,100.00',
  },
  {
    accountName: 'Company G',
    billingType: 'Invoice',
    id: 'INV007',
    detail: 'New Client Setup',
    billingPeriod: '2025-07',
    amount: '$750.00',
  },
  {
    accountName: 'Company H',
    billingType: 'Statement',
    id: 'STM008',
    detail: 'Q1 Review',
    billingPeriod: '2025-Q1',
    amount: '$2,900.00',
  },
  {
    accountName: 'Company I',
    billingType: 'Invoice',
    id: 'INV009',
    detail: 'Ad-hoc Request',
    billingPeriod: '2025-07',
    amount: '$400.00',
  },
  {
    accountName: 'Company J',
    billingType: 'Statement',
    id: 'STM010',
    detail: 'Mid-Year Report',
    billingPeriod: '2025-H1',
    amount: '$4,500.00',
  },
]);

const billingFilterPills = ref([
  { type: 'billingType', value: 'all', label: 'All', isActive: true },
  { type: 'billingType', value: 'Invoice', label: 'Invoice' },
  { type: 'billingType', value: 'Statement', label: 'Statement' },
]);

const billedAmountOverTime = computed(() => {
  const dataMap = new Map<string, number>();

  billingData.value.forEach(item => {
    const period = item.billingPeriod;
    const amount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ''));
    dataMap.set(period, (dataMap.get(period) || 0) + (isNaN(amount) ? 0 : amount));
  });

  const sortedPeriods = Array.from(dataMap.keys()).sort();
  const seriesData = sortedPeriods.map(period => dataMap.get(period) || 0);

  return {
    categories: sortedPeriods,
    series: [{ name: 'Billed Amount', data: seriesData }]
  };
});

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 350,
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    categories: billedAmountOverTime.value.categories,
    labels: { style: { colors: 'var(--color-text-primary)' } },
  },
  yaxis: {
    title: { text: 'Amount' },
    labels: {
      formatter: function (value: number) {
        return "$" + value.toFixed(2);
      },
      style: { colors: 'var(--color-text-primary)' },
    },
  },
  tooltip: {
    y: {
      formatter: function (value: number) {
        return "$" + value.toFixed(2);
      },
    },
  },
  grid: {
    show: true,
    borderColor: 'var(--color-border)',
    strokeDashArray: 0,
    position: 'back',
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  theme: { palette: 'palette1' },
}));
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.chart-container {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  background-color: $color-neutral-white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>