<template>
  <div class="category-trend-chart">
    <apexchart
      v-if="showMonthlyTrend && monthlyData && monthlyData.length"
      type="line"
      height="280"
      :options="trendOptions"
      :series="trendSeries"
    ></apexchart>
    <div v-else class="breakdown-donut-row">
      <div class="donut-fixed-size">
        <apexchart type="donut" height="180" width="180" :options="donutOptions" :series="donutSeries"></apexchart>
      </div>
      <div class="breakdown-list">
        <div v-for="item in currentValues" :key="item.category" class="breakdown-row">
          <span class="breakdown-swatch" :style="{ backgroundColor: categoryColor(item.category) }"></span>
          <span class="breakdown-label text-small">{{ item.category }}</span>
          <span class="breakdown-value text-small">{{ valueFormatter(item.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

interface CategoryValue {
  category: string;
  value: number;
}

interface MonthlyCategoryValue {
  month: string;
  Specialty: number;
  Generic: number;
  Brand: number;
}

interface Props {
  currentValues: CategoryValue[];
  monthlyData?: MonthlyCategoryValue[];
  showMonthlyTrend?: boolean;
  unit?: 'percent' | 'dollarM';
}

const props = withDefaults(defineProps<Props>(), {
  monthlyData: () => [],
  showMonthlyTrend: false,
  unit: 'percent',
});

const CATEGORY_COLORS: Record<string, string> = {
  Specialty: '#0F285B',
  Generic: '#2C82CB',
  Brand: '#60B0E0',
};

const categoryColor = (category: string) => CATEGORY_COLORS[category] ?? '#9AA0B4';

const valueFormatter = (val: number) => (props.unit === 'dollarM' ? `$${val.toFixed(2)}M` : `${val.toFixed(1)}%`);

const totalValueFormatter = (total: number) => (props.unit === 'dollarM' ? `$${total.toFixed(2)}M` : '100%');

const baseChartConfig = computed(() => {
  const textColor = isDark.value ? '#B0B8D0' : '#1A1A1A';
  const gridColor = isDark.value ? '#2C3147' : '#E0E0E0';
  return { textColor, gridColor };
});

const donutSeries = computed(() => props.currentValues.map((item) => item.value));

const donutOptions = computed(() => {
  const { textColor } = baseChartConfig.value;
  const total = props.currentValues.reduce((sum, item) => sum + item.value, 0);
  return {
    chart: {
      type: 'donut',
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    colors: props.currentValues.map((item) => categoryColor(item.category)),
    labels: props.currentValues.map((item) => item.category),
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
          size: '68%',
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
              formatter: () => totalValueFormatter(total),
            },
            total: {
              show: true,
              label: 'Total',
              color: textColor,
              fontSize: '14px',
              formatter: () => totalValueFormatter(total),
            },
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: isDark.value ? 'dark' : 'light',
      y: { formatter: (val: number) => valueFormatter(val) },
    },
  };
});

const trendSeries = computed(() => [
  { name: 'Specialty', data: props.monthlyData.map((item) => item.Specialty) },
  { name: 'Generic', data: props.monthlyData.map((item) => item.Generic) },
  { name: 'Brand', data: props.monthlyData.map((item) => item.Brand) },
]);

const trendOptions = computed(() => {
  const { textColor, gridColor } = baseChartConfig.value;
  return {
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: isDark.value ? '#1A1D27' : '#FFFFFF',
      foreColor: textColor,
    },
    colors: [CATEGORY_COLORS.Specialty, CATEGORY_COLORS.Generic, CATEGORY_COLORS.Brand],
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    markers: {
      size: 4,
      strokeWidth: 0,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: props.monthlyData.map((item) => item.month),
      labels: { style: { colors: textColor } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: textColor },
        formatter: (val: number) => valueFormatter(val),
      },
    },
    grid: {
      show: true,
      borderColor: gridColor,
    },
    legend: {
      show: true,
      position: 'bottom',
      labels: { colors: textColor },
    },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    tooltip: {
      enabled: true,
      theme: isDark.value ? 'dark' : 'light',
      y: { formatter: (val: number) => valueFormatter(val) },
    },
  };
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.breakdown-donut-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-medium;
  width: 100%;
}

.donut-fixed-size {
  width: 180px;
  height: 180px;

  :deep(.apexcharts-canvas) {
    margin: 0 auto;
  }
}

.breakdown-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-medium;
}

.breakdown-row {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
}

.breakdown-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.breakdown-label {
  color: $color-text-primary;
  font-weight: $font-weight-semibold;
}

.breakdown-value {
  color: $color-text-secondary;
}
</style>
