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
    <template v-if="!readonly" #append-inner>
      <ChevronDown :size="20" :stroke-width="1.5" />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { VAutocomplete } from 'vuetify/components';
import { ChevronDown } from 'lucide-vue-next';

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
</style>