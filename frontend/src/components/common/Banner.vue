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
import Button from '../ui/Button.vue';

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
    type: Function,
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

<style lang="scss" scoped>
@import '@/style.scss';

.banner {
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid;
  border-radius: 4px;
  padding: $spacing-nano $spacing-xsmall;
  box-sizing: border-box;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px; /* Adjust size as needed */
  height: 32px; /* Adjust size as needed */
  border-radius: 50%;
  margin-right: $spacing-xsmall;
  flex-shrink: 0;
}

.icon {
  color: $color-neutral-white; /* Set icon color to white */
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
  margin-left: $spacing-small;
  flex-shrink: 0; /* Prevent button from shrinking */
}

/* Variant Styles */
.banner.info {
  border-color: $color-primary;
  background-color: transparent;
  color: inherit;
}

.banner.info .icon-wrapper {
  background-color: $color-primary;
}

.banner.warning {
  border-color: $color-warning;
  background-color: $color-warning-background;
  color: $color-text-primary;
}

.banner.warning .icon-wrapper {
  background-color: $color-warning;
}
</style>
