<template>
  <div class="savings-breakdown">
    <div class="savings-top">
      <div class="donut-wrapper">
        <apexchart type="donut" height="240" :options="donutOptions" :series="donutSeries"></apexchart>
      </div>

      <div class="breakdown-list">
        <h4 class="text-h4">Savings Breakdown</h4>
        <div v-for="item in breakdownItems" :key="item.label" class="breakdown-row">
          <div class="breakdown-row-header">
            <span class="breakdown-label text-small">{{ item.label }}</span>
            <span class="breakdown-value text-small">{{ item.value }} &middot; {{ item.percent }}%</span>
          </div>
          <div class="breakdown-bar-track">
            <div class="breakdown-bar-fill" :style="{ width: item.percent + '%', backgroundColor: item.color }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="claims-count">
      <h4 class="text-h4">Count of Claims (#)</h4>
      <apexchart type="bar" height="160" :options="claimsOptions" :series="claimsSeries"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

interface BreakdownItem {
  label: string;
  value: string;
  percent: number;
  color: string;
}

interface Props {
  breakdownItems: BreakdownItem[];
  claimsCounts: { month: string; count: number }[];
}

const props = defineProps<Props>();

const donutSeries = computed(() => props.breakdownItems.map((item) => item.percent));

const donutOptions = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  return {
    chart: {
      type: 'donut',
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    colors: props.breakdownItems.map((item) => item.color),
    theme: {
      mode: isDark.value ? 'dark' : 'light',
    },
    labels: props.breakdownItems.map((item) => item.label),
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: textColor,
      },
    },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'YTD Total',
              formatter: () => '100%',
            },
          },
        },
      },
    },
  };
});

const claimsSeries = computed(() => [
  {
    name: 'Claims',
    data: props.claimsCounts.map((item) => item.count),
  },
]);

const claimsOptions = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  const gridColor = isDark.value ? '#2C3147' : '#E0E0E0';

  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        dataLabels: { position: 'top' },
      },
    },
    colors: ['#0F285B'],
    dataLabels: {
      enabled: true,
      offsetY: -18,
      formatter: (val: number) => `${Math.round(val / 1000)}K`,
      style: {
        fontSize: '11px',
        colors: [textColor],
      },
    },
    xaxis: {
      categories: props.claimsCounts.map((item) => item.month),
      labels: { style: { colors: textColor } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
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
      y: { formatter: (val: number) => `${val.toLocaleString()} claims` },
    },
  };
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.savings-breakdown {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.savings-top {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(220px, 1fr);
  gap: $spacing-medium;
  align-items: center;
}

.breakdown-list h4,
.claims-count h4 {
  margin-bottom: $spacing-small;
  color: $color-text-primary;
}

.breakdown-row {
  margin-bottom: $spacing-small;
}

.breakdown-row-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-nano;
}

.breakdown-label {
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.breakdown-value {
  color: $color-text-secondary;
}

.breakdown-bar-track {
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background-color: $color-border;
  overflow: hidden;
}

.breakdown-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

@media (max-width: 640px) {
  .savings-top {
    grid-template-columns: 1fr;
  }
}
</style>
