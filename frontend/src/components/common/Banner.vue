<template>
  <div :class="['banner', variant]">
    <div class="icon-wrapper">
      <component :is="iconComponent" :stroke-width="1" class="icon" />
    </div>
    <p class="message" v-html="message"></p>
    <Button
      v-if="showButton"
      v-bind="buttonProps"
      class="banner-button"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Info, TriangleAlert } from 'lucide-vue-next';
import Button from './Button.vue';

const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: (value) => ['info', 'warning'].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
  infoIcon: {
    type: Object,
    default: () => Info,
  },
  showButton: {
    type: Boolean,
    default: false,
  },
  buttonProps: {
    type: Object,
    default: () => ({}),
  },
});

const iconComponent = computed(() => {
  if (props.variant === 'warning') {
    return TriangleAlert;
  }
  return props.infoIcon;
});
</script>

<style scoped>
.banner {
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid;
  border-radius: 4px;
  padding: var(--spacing-nano) var(--spacing-xsmall);
  box-sizing: border-box;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px; /* Adjust size as needed */
  height: 32px; /* Adjust size as needed */
  border-radius: 50%;
  margin-right: var(--spacing-xsmall);
  flex-shrink: 0;
}

.icon {
  color: var(--color-neutral-white); /* Set icon color to white */
  font-size: 1.2rem;
}

.message {
  flex-grow: 1; /* Allow message to take up available space */
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 120%;
  margin: 0;
}

.banner-button {
  margin-left: var(--spacing-small);
  flex-shrink: 0; /* Prevent button from shrinking */
}

/* Variant Styles */
.banner.info {
  border-color: var(--color-primary);
  background-color: transparent;
  color: inherit;
}

.banner.info .icon-wrapper {
  background-color: var(--color-primary);
}

.banner.warning {
  border-color: var(--color-warning);
  background-color: var(--color-warning-background);
  color: var(--color-text-primary);
}

.banner.warning .icon-wrapper {
  background-color: var(--color-warning);
}
</style>
