<template>
  <v-card class="custom-card" :class="{ selected: selected, flat: flat }">
    <v-card-title v-if="title" class="text-h4 d-flex justify-space-between align-start">
      <span class="card-title-text">{{ title }}</span>
      <div v-if="variant === 'checkbox'" @click="toggleSelection" class="ml-2 cursor-pointer flex-shrink-0">
        <CheckSquare v-if="selected" :size="24" :stroke-width="1" />
        <Square v-else :size="24" :stroke-width="1" />
      </div>
    </v-card-title>
    <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>
    <v-card-text v-if="text">{{ text }}</v-card-text>
    <v-card-actions v-if="actions && actions.length && !selected">
      <v-btn
        v-for="(action, index) in actions"
        :key="index"
        :color="action.color || 'primary'"
        :variant="action.variant || 'outlined'"
        :rounded="true"
        :disabled="selected"
      >
        {{ selected ? 'Added to Account' : action.text }}
      </v-btn>
    </v-card-actions>
    <slot></slot>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { CheckSquare, Square } from 'lucide-vue-next';

interface Action {
  text: string;
  onClick: () => void;
  color?: string;
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain';
}

interface Props {
  title?: string;
  subtitle?: string;
  text?: string;
  actions?: Action[];
  selected?: boolean;
  selectable?: boolean;
  variant?: 'default' | 'checkbox';
  flat?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  text: '',
  actions: () => [],
  selected: false,
  selectable: false,
  variant: 'default',
  flat: false,
});

const emit = defineEmits(['update:selected']);

const toggleSelection = () => {
  emit('update:selected', !props.selected);
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.custom-card {
  border: 1px solid $color-border;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: $color-neutral-white;
  border-radius: 8px;
  padding: $spacing-small;

  &:not(.hug-content) {
    min-height: 220px;
  }

  &.selected {
    border: 1px solid $color-primary !important;
    box-shadow: none !important;
  }

  &.flat {
    box-shadow: none !important;
  }

  .v-card-title {
    color: $color-primary;
    font-weight: $font-weight-bold;
    letter-spacing: 0 !important;
    line-height: 1.2;

    .card-title-text {
      white-space: normal;
      word-break: break-word;
    }
  }

  .v-card-subtitle {
    color: $color-neutral-disabled;
    letter-spacing: 0 !important;
  }

  .v-card-text {
    color: $color-text-primary;
    letter-spacing: 0 !important;
  }

  .v-btn {
    text-transform: none !important;
    color: $color-primary !important;
    letter-spacing: 0 !important;
  }
}
</style>