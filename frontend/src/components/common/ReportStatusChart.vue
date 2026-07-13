<template>
  <div class="chart-card">
    <h3 class="text-h4">Reports by Status</h3>
    <apexchart type="donut" height="250" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

const series = ref([3, 1, 1, 1]);
const chartOptions = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  return {
    chart: {
      type: 'donut',
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    theme: {
      palette: 'palette2',
      mode: isDark.value ? 'dark' : 'light',
    },
    labels: ['Completed', 'Approved', 'Pending', 'Draft'],
    dataLabels: {
      enabled: false,
      style: {
        colors: [textColor],
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: textColor,
      },
    },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
      y: {
        formatter: (val: number) => `${val} Reports`,
      },
    },
    grid: {
      borderColor: isDark.value ? '#2C3147' : '#E0E0E0',
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: (w: any) => {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              },
            },
          },
        },
      },
    },
  };
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.chart-card {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  background-color: $color-neutral-white;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :global(html.dark) & {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  h3 {
    @extend .text-h3;
    margin-bottom: $spacing-medium;
  }
}
</style>
