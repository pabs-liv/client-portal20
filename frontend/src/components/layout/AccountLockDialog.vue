<template>
  <Dialog
    :model-value="modelValue"
    heading="Account Lock"
    text="Select an account to set as default."
    :actions="dialogActions"
    show-secondary-button
    max-width="500"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <Select
      class="mt-6"
      :items="accountItems"
      item-title="label"
      item-value="id"
      item-status="status"
      label="Account"
      variant="outlined"
      searchable
      :model-value="selectedAccountId"
      @update:model-value="selectedAccountId = $event"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dialog from '@/components/ui/Dialog.vue';
import Select from '@/components/ui/Select.vue';
import { LOCKABLE_ACCOUNTS, useAccountLock } from '@/composables/useAccountLock';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { lockedAccountId, lockAccount } = useAccountLock();

const selectedAccountId = ref<number | null>(null);

const accountItems = LOCKABLE_ACCOUNTS.map((account) => ({
  id: account.id,
  label: `(${account.id}) - ${account.name}`,
  status: account.status,
}));

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) selectedAccountId.value = lockedAccountId.value;
  },
);

const close = () => emit('update:modelValue', false);

const handleLockAccount = () => {
  if (selectedAccountId.value == null) return;
  lockAccount(selectedAccountId.value);
  close();
};

const dialogActions = computed(() => [
  { text: 'Cancel', styleType: 'secondary' as const, onClick: close },
  { text: 'Lock Account', disabled: selectedAccountId.value == null, onClick: handleLockAccount },
]);
</script>
