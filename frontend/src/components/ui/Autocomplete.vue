<template>
  <v-autocomplete
    v-bind="$attrs"
    :variant="variant"
    :density="density"
    :items="items"
    :label="label"
    :multiple="multiple"
    :readonly="readonly"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    class="custom-autocomplete"
  >
    <template v-if="multiple" #chip="{ item, props: chipProps }">
      <v-chip color="primary" variant="flat" class="ac-chip">
        <span class="ac-chip-label">{{ item.title }}</span>
        <span class="ac-chip-close" @click.stop="chipProps['onClick:close']">
          <X :size="10" :stroke-width="2.5" />
        </span>
      </v-chip>
    </template>
    <template #item="{ item, props }">
      <v-list-item v-bind="props" :title="item.title">
        <template v-if="multiple" #prepend>
          <div class="ac-check-box" :class="{ 'ac-check-box--checked': Array.isArray(modelValue) && modelValue.includes(item.value) }">
            <Check v-if="Array.isArray(modelValue) && modelValue.includes(item.value)" :size="12" :stroke-width="2.5" />
          </div>
        </template>
      </v-list-item>
    </template>
    <template v-if="!readonly" #append-inner>
      <ChevronDown :size="20" :stroke-width="1.5" />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { VAutocomplete } from 'vuetify/components';
import { ChevronDown, X, Check } from 'lucide-vue-next';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  items: any[];
  label?: string;
  multiple?: boolean;
  readonly?: boolean;
  modelValue?: any;
  variant?: string;
  density?: string;
}

withDefaults(defineProps<Props>(), {
  label: '',
  multiple: false,
  readonly: false,
  variant: 'outlined',
  density: 'compact',
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.custom-autocomplete {
  .v-field__append-inner {
    .v-icon {
      color: $color-text-secondary;
    }
  }
}

.ac-check-box {
  width: 18px;
  height: 18px;
  border: 2px solid $color-neutral-disabled;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-xsmall;
  flex-shrink: 0;

  &--checked {
    background-color: $color-primary;
    border-color: $color-primary;
    color: $color-neutral-white;
  }
}

.ac-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;

  .ac-chip-label {
    color: $color-neutral-white;
    font-size: $font-size-small;
  }

  .ac-chip-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: $color-neutral-white;
    color: $color-primary;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }
}
</style>