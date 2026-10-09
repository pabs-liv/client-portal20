<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
    @keydown="onKeydown"
    :max-width="maxWidth"
  >
    <v-card class="pa-medium dialog-card">
      <v-card-title class="d-flex align-center">
        <component :is="icon" v-if="icon" :size="24" class="mr-2 text-primary" />
        <span class="text-h3 text-primary">{{ heading }}</span>
        <v-spacer />
        <v-btn icon variant="text" size="small" density="comfortable" aria-label="Close" @click="handleClose">
          <X :size="20" />
        </v-btn>
      </v-card-title>
      <v-card-text class="text-body dialog-text">
        <p v-if="text">{{ text }}</p>
        <slot></slot>
      </v-card-text>
      <v-card-actions class="justify-end gap-small">
        <Button
          v-for="(action, index) in (showSecondaryButton ? actions : actions.slice(-1))"
          :key="index"
          :variant="action.type === 'destructive' ? 'alert' : action.styleType === 'secondary' ? 'secondary' : 'primary'"
          :label="action.text"
          :disabled="action.disabled ?? false"
          @click="action.onClick"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Icon as LucideIcon, X } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';

interface Action {
  text: string;
  onClick: () => void;
  type?: 'default' | 'destructive';
  styleType?: 'primary' | 'secondary' | 'text' | 'destructive';
  disabled?: boolean;
}

interface Props {
  modelValue: boolean;
  icon?: LucideIcon;
  heading: string;
  text?: string;
  actions?: Action[];
  showSecondaryButton?: boolean;
  maxWidth?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  showSecondaryButton: false,
  maxWidth: '800',
});

const emit = defineEmits(['update:modelValue']);

// Dialogs are always persistent (clicking outside never closes them), so they only close via
// the X, Esc, or Cancel. The X and Esc behave like Cancel: run the secondary action if there
// is one, otherwise just close. (Vuetify's persistent also blocks Esc, hence the handler.)
function handleClose() {
  const cancelAction = props.actions.find((action) => action.styleType === 'secondary');
  if (cancelAction) {
    cancelAction.onClick();
  } else {
    emit('update:modelValue', false);
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') handleClose();
}
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.dialog-card {
  border: 1px solid $color-border;

  .v-card-title {
    letter-spacing: normal;
    white-space: normal;
  }

  .v-card-text {
    letter-spacing: normal !important;
  }
}

.gap-small {
  gap: $spacing-small;
}
</style>
