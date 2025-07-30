<template>
  <button
    :class="['button', `button-${variant}`]"
    :disabled="disabled"
    :style="buttonStyle"
  >
    <span>{{ label }}</span>
    <!-- Specific icon for thirtiary variant -->
    <Pencil v-if="variant === 'thirtiary'" :size="16" :stroke-width="1" class="icon" />
    <!-- Optional icon for other variants -->
    <component
      v-if="showIcon && icon && variant !== 'thirtiary'"
      :is="icon"
      :stroke-width="1"
      class="icon"
    />
  </button>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { MoveRight, Pencil } from 'lucide-vue-next';

const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: (value) => ['alert', 'primary', 'secondary', 'thirtiary'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  textColor: {
    type: String,
    default: 'var(--color-primary)', // Default for secondary variant
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Object,
    default: null,
  },
});

const buttonStyle = computed(() => {
  if (props.variant === 'secondary') {
    return { color: props.textColor };
  }
  return {};
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-small $spacing-medium;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-size: 1rem; /* p base style */
  line-height: 120%;
  font-weight: 400; /* p base style */
  transition: background-color 0.3s, opacity 0.3s;
  white-space: nowrap;
}

.icon {
  margin-left: $spacing-nano;
}

/* Variant Styles */
.button-alert {
  background-color: $color-error;
  color: $color-neutral-white;
  border-radius: 100px;
}

.button-primary {
  background-color: $color-primary;
  color: $color-neutral-white;
  border-radius: 100px;
}

.button-secondary {
  background-color: transparent;
  border: 1px solid $color-primary;
  border-radius: 100px;
}

.button-thirtiary {
  background-color: transparent;
  color: $color-primary;
  padding: $spacing-nano;
  border: 1px solid $color-primary;
  border-radius: 4px;
}

/* Disabled State */
.button:disabled {
  opacity: 0.5;
  cursor: no-drop;
}
</style>
