<template>
  <div class="chart-card kpi-card">
    <h4 class="text-h4">Total Pending Reports</h4>
    <div class="kpi-value">125</div>
    <p>Across all clients</p>
  </div>
</template>

<script setup lang="ts"></script>

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
  justify-content: center;
  align-items: center;
  text-align: center;

  h4 {
    @extend .text-h4;
    color: $color-text-primary;
    font-weight: $font-weight-semibold;
  }

  .kpi-value {
    font-size: 2.5rem;
    font-weight: $font-weight-bold;
    color: $color-primary;
    margin: $spacing-xsmall 0;
  }

  p {
    color: $color-neutral-disabled;
    font-size: $font-size-small;
  }
}
</style>
