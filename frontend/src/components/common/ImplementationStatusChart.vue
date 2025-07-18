<template>
  <div class="implementation-status-chart">
    <h3 class="text-h3">{{ headerText }}</h3>
    <apexchart type="bar" height="100%" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import apexchart from 'vue3-apexcharts';

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

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: '100%', // Set chart height to 100%
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: 40,
    style: {
      fontSize: '12px',
      colors: ['#fff'],
    },
  },
  xaxis: {
    categories: ['New', 'In Progress', 'Pending Action', 'Completed'],
    labels: { show: true },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
        colors: ['var(--color-text-primary)'],
      },
    },
  },
  grid: {
    show: true,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  legend: {
    show: false, // Legend is not typically used for single series bar charts with categories
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function (val) {
        return val + " accounts";
      },
    },
  },
}));
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
  display: flex; /* Enable flexbox for vertical alignment */
  flex-direction: column;
  flex-grow: 1; /* Allow it to grow in height */
}

.implementation-status-chart h3 {
  margin-bottom: $spacing-medium;
  text-align: left;
}
</style>