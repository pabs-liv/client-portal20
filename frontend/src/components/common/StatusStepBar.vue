<template>
  <div class="status-step-bar">
    <div class="segments" :class="categoryClass">
      <span v-for="n in 3" :key="n" class="segment" :class="{ filled: step >= n }" />
    </div>
    <span class="status-step-bar-label text-small">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  step: 1 | 2 | 3;
  category: 'review' | 'approved' | 'denied';
  label: string;
}

const props = defineProps<Props>();

const categoryClass = computed(() => `category-${props.category}`);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.status-step-bar {
  display: flex;
  flex-direction: column;
  gap: $spacing-nano;
  min-width: 180px;
}

.segments {
  display: flex;
  gap: 2px;
  height: 8px;
}

.segment {
  flex: 1;
  border-radius: 4px;
  background-color: $color-border;
  opacity: 0.5;

  &.filled {
    opacity: 1;
  }
}

.segments.category-review .segment.filled {
  background-color: $color-primary;
}

.segments.category-approved .segment.filled {
  background-color: $color-success;
}

.segments.category-denied .segment.filled {
  background-color: $color-error;
}

.status-step-bar-label {
  color: $color-text-primary;
}
</style>
