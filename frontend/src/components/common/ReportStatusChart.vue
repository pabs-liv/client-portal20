<template>
  <div class="chart-card">
    <h3 class="text-h4">Reports by Status</h3>
    <apexchart type="donut" height="250" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const series = ref([3, 1, 1, 1]);
const chartOptions = ref({
  chart: {
    type: 'donut',
  },
  theme: {
    palette: 'palette2',
  },
  labels: ['Completed', 'Approved', 'Pending', 'Draft'],
  
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: 'bottom',
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} Reports`,
    },
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

  h3 {
    @extend .text-h3;
    margin-bottom: $spacing-medium;
  }
}
</style>
