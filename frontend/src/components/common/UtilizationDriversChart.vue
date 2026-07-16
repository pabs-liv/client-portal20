<template>
  <div class="utilization-drivers">
    <div class="driver-block">
      <apexchart
        v-if="showMonthlyUtilization && monthlyUtilization && monthlyUtilization.length"
        type="bar"
        height="160"
        :options="monthlyUtilizationOptions"
        :series="monthlyUtilizationSeries"
      ></apexchart>
      <div v-else class="utilization-donut-column">
        <div class="donut-fixed-size">
          <apexchart type="donut" height="180" width="180" :options="utilizationDonutOptions" :series="utilizationDonutSeries"></apexchart>
        </div>
        <div v-if="utilizationDelta" class="utilization-donut-delta">
          <component :is="TrendingUp" :stroke-width="1.5" class="delta-icon" />
          <span class="text-small">{{ utilizationDelta }} vs prior month</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { TrendingUp } from 'lucide-vue-next';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

interface Props {
  utilizationPercent: number;
  utilizationDelta?: string;
  monthlyUtilization?: { month: string; value: number }[];
  showMonthlyUtilization?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  utilizationDelta: '',
  monthlyUtilization: () => [],
  showMonthlyUtilization: false,
});

const baseChartConfig = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  const gridColor = isDark.value ? '#2C3147' : '#E0E0E0';
  return { textColor, gridColor };
});

const utilizationDonutSeries = computed(() => [
  props.utilizationPercent,
  100 - props.utilizationPercent,
]);

const utilizationDonutOptions = computed(() => {
  const { textColor } = baseChartConfig.value;
  return {
    chart: {
      type: 'donut',
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    colors: ['#0F285B', isDark.value ? '#2C3147' : '#E0E0E0'],
    labels: ['Utilization', 'Remaining'],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              color: textColor,
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#0F285B',
              offsetY: 4,
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: 'Utilization',
              color: textColor,
              fontSize: '14px',
              formatter: () => `${props.utilizationPercent}%`,
            },
          },
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  };
});

const monthlyUtilizationSeries = computed(() => [
  { name: 'Utilization', data: props.monthlyUtilization.map((item) => item.value) },
]);

const monthlyUtilizationOptions = computed(() => {
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
        columnWidth: '50%',
        dataLabels: { position: 'top' },
      },
    },
    colors: ['#0F285B'],
    dataLabels: {
      enabled: true,
      offsetY: -18,
      formatter: (val: number) => `${val}%`,
      style: { fontSize: '11px', colors: [textColor] },
    },
    xaxis: {
      categories: props.monthlyUtilization.map((item) => item.month),
      labels: { style: { colors: textColor } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
      max: 100,
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
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.utilization-drivers {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.utilization-donut-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-small;
  width: 100%;
}

.donut-fixed-size {
  width: 180px;
  height: 180px;

  :deep(.apexcharts-canvas) {
    margin: 0 auto;
  }
}

.utilization-donut-delta {
  display: flex;
  align-items: center;
  gap: $spacing-nano;
  color: $color-text-secondary;

  .delta-icon {
    width: 16px;
    height: 16px;
    color: $color-success;
    flex-shrink: 0;
  }
}
</style>
