<template>
  <div
    class="summary-widget"
    :class="{ 'clickable': clickable }"
    :style="isDark ? { backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' } : {}"
  >
    <div v-if="showIcon" class="widget-icon-wrapper" :style="{ backgroundColor: iconBackgroundColor }">
      <component :is="icon" :stroke-width="1" class="widget-icon" />
    </div>
    <div class="widget-content">
      <div class="widget-header">
        <h4 class="widget-title text-h4">{{ title }}</h4>
        <span class="widget-count text-h3">{{ count }}</span>
      </div>
      <div class="widget-body">
        <p class="text-body">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { Flame } from 'lucide-vue-next';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

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
    type: Function,
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
  clickable: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.summary-widget {
  display: flex;
  align-items: flex-start;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  background-color: $color-neutral-white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :global(html.dark) & {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}

.clickable {
  cursor: pointer;
}

.widget-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px; /* Slightly larger than icon */
  height: 48px; /* Slightly larger than icon */
  border-radius: 50%;
  margin-right: $spacing-medium;
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
  margin-bottom: $spacing-small;
}

.widget-title {
  /* font-weight is now handled by global h4 style */
}

.widget-body p {
  margin: 0;
}

</style>
