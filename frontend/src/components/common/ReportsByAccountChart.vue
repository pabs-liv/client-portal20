<template>
  <div class="chart-card">
    <h3 class="text-h3">Top 5 - Pending Reports by Account</h3>
    <apexchart type="bar" height="250" width="100%" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const series = ref([{
  data: [12, 8, 7, 5, 4]
}]);
const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    }
  },
  theme: {
    palette: 'palette1',
  },
  plotOptions: {
    bar: {
      horizontal: true,
    }
  },
  colors: ['rgb(0, 143, 251)'],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ['Acme Corp', 'Globex Inc.', 'Soylent Corp', 'Initech', 'Umbrella Corp'],
  },
  tooltip: {
    x: {
      formatter: (val: string) => val,
    },
    y: {
      formatter: (val: number) => `${val} Reports`,
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
