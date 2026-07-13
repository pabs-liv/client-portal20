<script setup lang="ts">
import { computed } from 'vue';
import { type LucideIcon } from 'lucide-vue-next';
import type { FilterGroup } from '@/types/filters';

export interface DialogAction {
  text: string;
  type: 'confirm' | 'cancel';
  onClick: () => void;
  color?: string;
  variant?: string;
  disabled?: boolean;
}

interface Props {
  modelValue: boolean;
  persistent?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  heading: string;
  text?: string;
  actions: DialogAction[];
  filters?: FilterGroup[];
}

const props = withDefaults(defineProps<Props>(), {
  persistent: false,
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const confirmAction = computed(() => props.actions.find((a) => a.type === 'confirm'));
const cancelAction = computed(() => props.actions.find((a) => a.type === 'cancel'));

function handleConfirm() {
  confirmAction.value?.onClick();
  emit('confirm');
}

function handleCancel() {
  cancelAction.value?.onClick();
  emit('cancel');
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800"
  >
    <v-card class="pa-5 dialog-card">
      <v-card-title class="d-flex align-center">
        <component :is="icon" v-if="icon" :size="24" class="mr-2 text-primary" :style="{ color: iconColor }" />
        <span class="text-h3 text-primary">{{ heading }}</span>
      </v-card-title>
      <v-card-text class="dialog-text">
        <template v-for="filter in filters" :key="filter.type">
          <slot :name="`filter-${filter.type}`" :filter="filter">
            <v-autocomplete
              color="primary"
              :label="filter.label"
              :items="filter.options"
              item-title="text"
              item-value="value"
              v-model="filter.modelValue"
              :multiple="filter.multiselect"
              variant="outlined"
              clearable
              closable-chips
              class="mb-2"
            >
              <template v-slot:chip="{ props: chipProps, item }">
                <v-chip v-bind="chipProps" :text="item.raw.text" variant="flat" color="primary" />
              </template>
            </v-autocomplete>
          </slot>
        </template>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          v-if="cancelAction"
          color="primary"
          variant="outlined"
          rounded
          :disabled="cancelAction.disabled"
          class="dialog-button"
          @click="handleCancel"
        >
          {{ cancelAction.text }}
        </v-btn>
        <v-btn
          v-if="confirmAction"
          color="primary"
          variant="flat"
          rounded
          :disabled="confirmAction.disabled"
          class="dialog-button"
          @click="handleConfirm"
        >
          {{ confirmAction.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

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
  padding-left: $spacing-medium;
  padding-right: $spacing-medium;
  font-size: $font-size-body !important;
}
</style>
