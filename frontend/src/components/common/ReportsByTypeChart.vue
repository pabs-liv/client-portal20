<template>
  <div class="chart-card">
    <h3 class="text-h4">Reports by Type</h3>
    <apexchart type="bar" height="250" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const series = ref([{
  data: [6, 8, 4, 9]
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
      distributed: true,
    }
  },
  colors: ['#0F285B', '#5CB85C', '#FBBA13', '#B80909'],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ['Quarterly', 'Monthly', 'Ad-Hoc', 'Annual'],
  },
  yaxis: {
    labels: {
      formatter: (val: number) => Math.floor(val),
    }
  },
  tooltip: {
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
