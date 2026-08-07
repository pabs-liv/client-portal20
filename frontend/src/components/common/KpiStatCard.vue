<template>
  <div class="chart-card kpi-stat-card">
    <span class="kpi-label text-small">{{ label }}</span>
    <span class="kpi-value text-h2">{{ value }}</span>
    <div class="kpi-delta">
      <component :is="deltaDirection === 'up' ? TrendingUp : TrendingDown" :stroke-width="1.5" class="delta-icon" :class="deltaDirection" />
      <span class="delta-text text-small">{{ deltaValue }} {{ deltaLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';

interface Props {
  label: string;
  value: string;
  deltaValue: string;
  deltaDirection: 'up' | 'down';
  deltaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  deltaLabel: 'vs prior month',
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
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :global(html.dark) & {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}

.kpi-stat-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-nano;
}

.kpi-label {
  color: $color-text-secondary;
  font-weight: $font-weight-semibold;
}

.kpi-value {
  color: $color-primary;

  :global(html.dark) & {
    color: #7BA7E0;
  }
}

.kpi-delta {
  display: flex;
  align-items: center;
  gap: $spacing-nano;
  margin-top: $spacing-nano;
}

.delta-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  &.up {
    color: $color-success;
  }

  &.down {
    color: $color-error;
  }
}

.delta-text {
  color: $color-text-secondary;
}
</style>
