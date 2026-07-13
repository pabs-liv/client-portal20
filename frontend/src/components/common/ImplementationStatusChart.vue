<template>
  <div class="implementation-status-chart">
    <h3 class="text-h3">{{ headerText }}</h3>
    <apexchart type="bar" height="100%" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import apexchart from 'vue3-apexcharts';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        typeof value.new === 'number' &&
        typeof value.inProgress === 'number' &&
        typeof value.pendingAction === 'number' &&
        typeof value.completed === 'number'
      );
    },
  },
  headerText: {
    type: String,
    default: 'Implementations Overview',
  },
});

const series = computed(() => [
  {
    data: [
      {
        x: 'New',
        y: props.data.new,
        fillColor: '#847EC1', // Consider replacing with a themed color if available
      },
      {
        x: 'In Progress',
        y: props.data.inProgress,
        fillColor: '#60B0E0', // Consider replacing with a themed color if available
      },
      {
        x: 'Pending Action',
        y: props.data.pendingAction,
        fillColor: '#FBBA13', // Warning color
      },
      {
        x: 'Completed',
        y: props.data.completed,
        fillColor: '#69C969', // Consider replacing with a themed color if available
      },
    ],
  },
]);

const chartOptions = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  const bgColor   = isDark.value ? '#1A1D27' : '#FFFFFF';
  const gridColor = isDark.value ? '#2C3147' : '#E0E0E0';

  return {
    chart: {
      type: 'bar',
      height: '100%',
      toolbar: { show: false },
      background: bgColor,
      foreColor: textColor,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 40,
      style: {
        fontSize: '12px',
        colors: [textColor],
      },
    },
    xaxis: {
      categories: ['New', 'In Progress', 'Pending Action', 'Completed'],
      labels: { show: true, style: { colors: textColor } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: '12px', colors: [textColor] },
      },
    },
    grid: {
      show: true,
      borderColor: gridColor,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    legend: { show: false },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    tooltip: {
      enabled: true,
      theme: isDark.value ? 'dark' : 'light',
      y: { formatter: (val) => val + ' accounts' },
    },
  };
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.implementation-status-chart {
  width: 100%;
  background-color: $color-neutral-white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: $spacing-medium;
  border: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :global(html.dark) & {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}

.implementation-status-chart h3 {
  margin-bottom: $spacing-medium;
  text-align: left;
}
</style>