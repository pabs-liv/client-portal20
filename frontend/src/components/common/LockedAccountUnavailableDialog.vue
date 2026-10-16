<template>
  <Dialog
    :model-value="modelValue"
    :icon="TriangleAlert"
    heading="Account Not Available"
    :text="`Locked account ${accountName} is not available for this page. Please select a different account to proceed.`"
    :actions="actions"
    max-width="500"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';

interface Props {
  modelValue: boolean;
  accountName: string | null;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const actions = [
  {
    text: 'OK',
    onClick: () => emit('update:modelValue', false),
  },
];
</script>
