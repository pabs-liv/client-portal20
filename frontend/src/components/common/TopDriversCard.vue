<template>
  <div class="top-drivers-card">
    <div class="top-drivers-column">
      <h4 class="text-h4">Top Brand Medications</h4>
      <div v-for="item in topBrandMedications" :key="item.name" class="driver-row">
        <div class="driver-row-header">
          <span class="driver-label text-small">{{ item.name }}</span>
          <span class="driver-value text-small">{{ item.percentOfCost.toFixed(1) }}% of plan cost</span>
        </div>
        <div class="driver-bar-track">
          <div class="driver-bar-fill" :style="{ width: item.percentOfCost + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="top-drivers-column">
      <h4 class="text-h4">Top Therapeutic Classes</h4>
      <div v-for="item in topTherapeuticClasses" :key="item.name" class="driver-row">
        <div class="driver-row-header">
          <span class="driver-label text-small">{{ item.name }}</span>
          <span class="driver-value text-small">{{ item.percentOfCost.toFixed(1) }}% of plan cost</span>
        </div>
        <div class="driver-bar-track">
          <div class="driver-bar-fill driver-bar-fill--alt" :style="{ width: item.percentOfCost + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface DriverItem {
  name: string;
  percentOfCost: number;
}

interface Props {
  topBrandMedications: DriverItem[];
  topTherapeuticClasses: DriverItem[];
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.top-drivers-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-large;
}

.top-drivers-column h4 {
  margin-bottom: $spacing-medium;
  color: $color-text-primary;
}

.driver-row {
  margin-bottom: $spacing-small;
}

.driver-row-header {
  display: flex;
  justify-content: space-between;
  gap: $spacing-small;
  margin-bottom: $spacing-nano;
}

.driver-label {
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.driver-value {
  color: $color-text-secondary;
  white-space: nowrap;
}

.driver-bar-track {
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background-color: $color-border;
  overflow: hidden;
}

.driver-bar-fill {
  height: 100%;
  border-radius: 4px;
  background-color: $color-primary;
  transition: width 0.3s ease;

  &--alt {
    background-color: #2C82CB;
  }
}

@media (max-width: 640px) {
  .top-drivers-card {
    grid-template-columns: 1fr;
  }
}
</style>
