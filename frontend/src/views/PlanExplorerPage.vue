
<template>
  <div>
    <AccountSelector
      heading="Plan Explorer"
      subheading="Track account implementations. Select an account to view it's current status."
      :items="accountOptions"
      label="Select Account"
      item-title="name"
      item-value="id"
      :searchable="true"
      v-model="selectedAccount"
      :show-slot="true"
      variant="outlined"
    >
      <!-- Content for the slot can go here -->
    </AccountSelector>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import AccountSelector from '@/components/common/AccountSelector.vue';

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);
</script>
