<template>
  <v-dialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800"
  >
    <v-card class="pa-medium dialog-card">
      <v-card-title class="d-flex align-center">
        <component :is="icon" v-if="icon" :size="24" class="mr-2 text-primary" />
        <span class="text-h3 text-primary">{{ heading }}</span>
      </v-card-title>
      <v-card-text class="text-body dialog-text">
        <slot></slot>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          v-for="(action, index) in (showSecondaryButton ? actions : [actions[actions.length - 1]])"
          :key="index"
          :color="action.styleType === 'primary' ? 'primary' : action.styleType === 'secondary' ? 'primary' : action.type === 'destructive' ? 'error' : action.color"
          :variant="action.styleType === 'primary' ? 'elevated' : action.styleType === 'secondary' ? 'outlined' : action.variant || 'text'"
          :rounded="true"
          :class="{'dialog-button': true, 'text-white': action.styleType === 'primary' || action.type === 'destructive'}"
          :disabled="action.disabled"
          @click="action.onClick"
        >
          {{ action.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Icon as LucideIcon } from 'lucide-vue-next';

interface Header {
  title: string;
  key: string;
  [key: string]: any;
}

interface Action {
  text: string;
  onClick: () => void;
  color?: string;
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain';
  type?: 'default' | 'destructive';
  styleType?: 'primary' | 'secondary' | 'text' | 'destructive';
}

interface Props {
  modelValue: boolean;
  persistent?: boolean;
  icon?: LucideIcon;
  heading: string;
  actions?: Action[];
  showSecondaryButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  persistent: false,
  actions: () => [],
  showSecondaryButton: false,
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.dialog-card {
  border: 1px solid $color-border;

  .v-card-title,
  .v-btn {
    letter-spacing: normal;
    white-space: normal;
  }

  .v-card-text {
    letter-spacing: normal !important;
  }
}

.v-btn.dialog-button {
  text-transform: none;
  padding-left: $spacing-small;
  padding-right: $spacing-small;
}
</style>
