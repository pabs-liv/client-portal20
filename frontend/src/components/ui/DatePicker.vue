<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="auto"
    :z-index="3000"
  >
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        v-bind="{ ...$attrs, ...menuProps }"
        :label="hasRequiredMarker ? undefined : label"
        :model-value="formattedDate"
        :readonly="readonly"
        :variant="variant"
        :density="density"
        @update:model-value="handleManualInput"
        class="custom-date-picker"
      >
        <template v-if="hasRequiredMarker" #label>{{ labelWithoutAsterisk }}<span class="date-picker-required-asterisk">*</span></template>
        <template #append-inner>
          <Calendar :size="20" :stroke-width="1.5" class="calendar-icon" @click.stop="readonly ? null : (menu = !menu)" />
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :color="color"
      :min="min"
      @update:model-value="handleDateSelection"
      :readonly="readonly"
    ></v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { VMenu, VTextField, VDatePicker } from 'vuetify/components';
import { Calendar } from 'lucide-vue-next';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  label?: string;
  modelValue?: string;
  readonly?: boolean;
  color?: string;
  variant?: string;
  density?: string;
  min?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  modelValue: '',
  readonly: false,
  color: 'primary',
  variant: 'outlined',
  density: 'compact',
  min: undefined,
});

const emit = defineEmits(['update:modelValue']);

// Same issue as TextField.vue/Select.vue: a trailing "*" typed into the label inherits the
// label's muted color, making it an invisible required-field cue. Split it out so it can be
// colored independently.
const hasRequiredMarker = computed(() => /\*\s*$/.test(props.label ?? ''));
const labelWithoutAsterisk = computed(() => (props.label ?? '').replace(/\*\s*$/, '').trimEnd());

const menu = ref(false);
const date = ref<Date | null>(null);

// Parse modelValue into a Date object for the date picker
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const parts = newVal.split('/');
    if (parts.length === 3) {
      date.value = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    }
  } else {
    date.value = null;
  }
}, { immediate: true });

const formattedDate = computed(() => {
  if (date.value) {
    const month = String(date.value.getMonth() + 1).padStart(2, '0');
    const day = String(date.value.getDate()).padStart(2, '0');
    const year = date.value.getFullYear();
    return `${month}/${day}/${year}`;
  }
  return props.modelValue;
});

const handleManualInput = (value: string) => {
  const parts = value.split('/');
  if (parts.length === 3) {
    const newDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    if (!isNaN(newDate.getTime())) {
      date.value = newDate;
      emit('update:modelValue', formattedDate.value);
    } else {
      emit('update:modelValue', value);
    }
  } else {
    emit('update:modelValue', value);
  }
};

const handleDateSelection = (newDate: Date) => {
  date.value = newDate;
  emit('update:modelValue', formattedDate.value);
  menu.value = false; // Close menu after selection
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.date-picker-required-asterisk {
  color: $color-error;
  margin-left: 2px;
}

.custom-date-picker {
  .calendar-icon {
    cursor: pointer;
    color: $color-text-secondary;
  }
}
</style>