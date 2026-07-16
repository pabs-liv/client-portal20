<template>
  <div class="utilization-drivers">
    <div class="driver-block">
      <h4 class="text-h4">Utilization</h4>
      <apexchart type="bar" height="90" :options="utilizationOptions" :series="utilizationSeries"></apexchart>
    </div>

    <div class="driver-block">
      <h4 class="text-h4">Dispense Rate (%)</h4>
      <apexchart type="bar" height="150" :options="dispenseOptions" :series="dispenseSeries"></apexchart>
    </div>

    <div class="driver-block">
      <h4 class="text-h4">Paid Plan ($M)</h4>
      <apexchart type="bar" height="150" :options="paidPlanOptions" :series="paidPlanSeries"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

interface Props {
  utilizationPercent: number;
  dispenseRate: { category: string; value: number }[];
  paidPlan: { category: string; value: number }[];
}

const props = defineProps<Props>();

const baseChartConfig = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  const gridColor = isDark.value ? '#2C3147' : '#E0E0E0';
  return { textColor, gridColor };
});

const utilizationSeries = computed(() => [
  { data: [props.utilizationPercent] },
]);

const utilizationOptions = computed(() => {
  const { textColor } = baseChartConfig.value;
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '45%',
        dataLabels: { position: 'top' },
      },
    },
    colors: ['#0F285B'],
    dataLabels: {
      enabled: true,
      offsetX: 24,
      formatter: (val: number) => `${val}%`,
      style: { fontSize: '13px', colors: [textColor] },
    },
    xaxis: {
      categories: ['Utilization'],
      max: 100,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    grid: {
      show: false,
    },
    legend: { show: false },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    tooltip: {
      enabled: true,
      theme: isDark.value ? 'dark' : 'light',
      y: { formatter: (val: number) => `${val}%` },
    },
  };
});

const dispenseSeries = computed(() => [
  { name: 'Dispense Rate', data: props.dispenseRate.map((item) => item.value) },
]);

const dispenseOptions = computed(() => {
  const { textColor, gridColor } = baseChartConfig.value;
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '55%',
        dataLabels: { position: 'top' },
      },
    },
    colors: ['#2C82CB'],
    dataLabels: {
      enabled: true,
      offsetX: 24,
      formatter: (val: number) => `${val}%`,
      style: { fontSize: '12px', colors: [textColor] },
    },
    xaxis: {
      categories: props.dispenseRate.map((item) => item.category),
      max: 100,
      labels: { style: { colors: textColor } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: [textColor] } },
    },
    grid: {
      show: true,
      borderColor: gridColor,
      yaxis: { lines: { show: false } },
    },
    legend: { show: false },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    tooltip: {
      enabled: true,
      theme: isDark.value ? 'dark' : 'light',
      y: { formatter: (val: number) => `${val}%` },
    },
  };
});

const paidPlanSeries = computed(() => [
  { name: 'Paid Plan', data: props.paidPlan.map((item) => item.value) },
]);

const paidPlanOptions = computed(() => {
  const { textColor, gridColor } = baseChartConfig.value;
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '55%',
        dataLabels: { position: 'top' },
      },
    },
    colors: ['#0F285B'],
    dataLabels: {
      enabled: true,
      offsetX: 24,
      formatter: (val: number) => `$${val.toFixed(2)}M`,
      style: { fontSize: '12px', colors: [textColor] },
    },
    xaxis: {
      categories: props.paidPlan.map((item) => item.category),
      labels: { style: { colors: textColor } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: [textColor] } },
    },
    grid: {
      show: true,
      borderColor: gridColor,
      yaxis: { lines: { show: false } },
    },
    legend: { show: false },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    tooltip: {
      enabled: true,
      theme: isDark.value ? 'dark' : 'light',
      y: { formatter: (val: number) => `$${val.toFixed(2)}M` },
    },
  };
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.utilization-drivers {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.driver-block h4 {
  margin-bottom: $spacing-small;
  color: $color-text-primary;
}
</style>
