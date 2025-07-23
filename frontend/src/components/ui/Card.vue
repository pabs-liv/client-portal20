<template>
  <v-card class="custom-card" :class="{ selected: selected }">
    <v-card-title v-if="title" class="text-h4">{{ title }}</v-card-title>
    <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>
    <v-card-text v-if="text && !selected">{{ text }}</v-card-text>
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
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  text: '',
  actions: () => [],
  selected: false,
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.custom-card {
  border: 1px solid $color-border;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: $color-neutral-white;
  border-radius: 8px;
  padding: $spacing-small;

  &.selected {
    border: 1px solid rgba(15, 40, 91, 0.6);
    box-shadow: none !important;

    .v-card-title,
    .v-card-subtitle,
    .v-card-text {
      opacity: 0.8;
    }
  }

  .v-card-title {
    color: $color-primary;
    font-weight: $font-weight-bold;
    letter-spacing: 0 !important;
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