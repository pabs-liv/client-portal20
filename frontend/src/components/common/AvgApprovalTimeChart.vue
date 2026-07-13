<template>
  <div class="chart-card kpi-card">
    <h3 class="text-h3">Avg. Approval Time</h3>
    <div class="kpi-value">2.5 Days</div>
    <p>Last 30 days</p>
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
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :global(html.dark) & {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  h4 {
    @extend .text-h3;
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
