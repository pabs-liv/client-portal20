<template>
  <div class="chart-card">
    <h3 class="text-h3">Top 5 - Pending Reports by Account</h3>
    <apexchart type="bar" height="250" width="100%" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

const series = ref([{
  data: [12, 8, 7, 5, 4]
}]);
const chartOptions = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  return {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    theme: {
      palette: 'palette1',
      mode: isDark.value ? 'dark' : 'light',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    colors: ['rgb(0, 143, 251)'],
    dataLabels: {
      enabled: false,
      style: {
        colors: [textColor],
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: isDark.value ? '#2C3147' : '#E0E0E0',
    },
    xaxis: {
      categories: ['Acme Corp', 'Globex Inc.', 'Soylent Corp', 'Initech', 'Umbrella Corp'],
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [textColor],
        },
      },
    },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
      x: {
        formatter: (val: string) => val,
      },
      y: {
        formatter: (val: number) => `${val} Reports`,
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
