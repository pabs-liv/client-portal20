<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        v-bind="{ ...$attrs, ...menuProps }"
        :label="label"
        :model-value="formattedDate"
        :readonly="readonly"
        :variant="variant"
        :density="density"
        @update:model-value="handleManualInput"
        class="custom-date-picker"
      >
        <template #append-inner>
          <Calendar :size="20" :stroke-width="1.5" class="calendar-icon" @click="menu = !menu" />
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :color="color"
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
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  modelValue: '',
  readonly: false,
  color: 'primary',
  variant: 'outlined',
  density: 'compact',
});

const emit = defineEmits(['update:modelValue']);

const menu = ref(false);
const date = ref<Date | null>(null);

// Parse modelValue into a Date object for the date picker
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const parts = newVal.split('/');
    if (parts.length === 3) {
      date.value = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } else {
    date.value = null;
  }
}, { immediate: true });

const formattedDate = computed(() => {
  if (date.value) {
    const day = String(date.value.getDate()).padStart(2, '0');
    const month = String(date.value.getMonth() + 1).padStart(2, '0');
    const year = date.value.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return props.modelValue;
});

const handleManualInput = (value: string) => {
  const parts = value.split('/');
  if (parts.length === 3) {
    const newDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    if (!isNaN(newDate.getTime())) {
      date.value = newDate;
      emit('update:modelValue', formattedDate.value);
    } else {
      emit('update:modelValue', value); // Emit invalid date as is
    }
  } else {
    emit('update:modelValue', value); // Emit partial or invalid date as is
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

.custom-date-picker {
  .v-field__input {
    min-height: var(--v-input-control-height, 40px); // Match TextField height
  }

  .calendar-icon {
    cursor: pointer;
    color: var(--color-text-secondary);
  }
}
</style>