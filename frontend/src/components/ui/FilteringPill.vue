<script setup lang="ts">
import { X } from 'lucide-vue-next';

export type FilterPill = {
  type: string;
  value: unknown;
  label: string;
  isActive: boolean;
  prependDivider?: boolean;
};

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  isActive?: boolean;
  closable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'click:close'): void;
}>();
</script>

<template>
  <v-chip
    v-bind="$attrs"
    :color="props.isActive ? 'primary' : undefined"
    :variant="props.isActive ? 'flat' : 'outlined'"
    class="filtering-pill"
    @click="emit('click')"
  >
    <slot></slot>
    <span
      v-if="props.closable"
      class="pill-close"
      @click.stop="emit('click:close')"
    >
      <X :size="10" :stroke-width="2.5" />
    </span>
  </v-chip>
</template>

<style lang="scss" scoped>
@import '@/style.scss';

.filtering-pill {
  :deep(.v-chip__content) {
    gap: 6px;
    align-items: center;
  }
}

.filtering-pill.v-chip--variant-outlined {
  .v-chip__content {
    color: $color-text-primary;
  }

  .pill-close {
    background-color: $color-primary;
    color: $color-neutral-white;
  }

  :global(html.dark) & {
    border-color: var(--color-border) !important;

    .v-chip__content {
      color: var(--color-text-primary);
    }
  }
}

.filtering-pill.v-chip--variant-flat {
  .v-chip__content {
    color: $color-neutral-white;
  }

  .pill-close {
    background-color: $color-neutral-white;
    color: $color-primary;
  }
}

.pill-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
}
</style>
