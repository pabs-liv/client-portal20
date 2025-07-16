<template>
  <div class="summary-widget">
    <div v-if="showIcon" class="widget-icon-wrapper" :style="{ backgroundColor: iconBackgroundColor }">
      <component :is="icon" :stroke-width="1" class="widget-icon" />
    </div>
    <div class="widget-content">
      <div class="widget-header">
        <h4 class="widget-title">{{ title }}</h4>
        <span class="widget-count">{{ count }}</span>
      </div>
      <div class="widget-body">
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { Flame } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: [String, Number],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Object,
    default: () => Flame,
  },
  iconBackgroundColor: {
    type: String,
    default: 'transparent', // Default to transparent if no color is provided
  },
  iconColor: {
    type: String,
    default: 'var(--color-primary)',
  },
});
</script>

<style scoped>
.summary-widget {
  display: flex;
  align-items: flex-start;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: var(--spacing-medium);
  background-color: var(--color-neutral-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.widget-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px; /* Slightly larger than icon */
  height: 48px; /* Slightly larger than icon */
  border-radius: 50%;
  margin-right: var(--spacing-medium);
  flex-shrink: 0;
}

.widget-icon {
  color: v-bind(iconColor);
  font-size: 1.7rem;
}

.widget-content {
  flex-grow: 1;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-small);
}

.widget-title {
  /* font-weight is now handled by global h4 style */
}

.widget-count {
  font-size: 1.44rem; /* H3 */
  font-weight: 700; /* bold */
  color: var(--color-primary);
}

.widget-body p {
  margin: 0;
}
</style>
