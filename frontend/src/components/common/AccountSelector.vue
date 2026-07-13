<template>
  <div class="account-selector mb-large">
    <div class="account-selector-header">
      <div class="title">
        <h1 class="text-h1">{{ heading }}</h1>
        <p class="text-body">
          {{ subheading }}
        </p>
      </div>
      <Select
        :items="items"
        :label="label"
        :item-title="itemTitle"
        :item-value="itemValue"
        :searchable="searchable"
        :model-value="modelValue"
        :variant="variant"
        class="account-select"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
    <v-row class="mt-4" v-if="showSlot">
      <v-col cols="12">
        <slot></slot>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import Select from '@/components/ui/Select.vue';
import { VRow, VCol } from 'vuetify/components';

interface Props {
  heading: string;
  subheading: string;
  items: any[];
  label: string;
  itemTitle: string;
  itemValue: string;
  searchable: boolean;
  modelValue: any;
  showSlot?: boolean;
  variant?: string;
}

withDefaults(defineProps<Props>(), {
  showSlot: false,
});
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.account-selector {
  display: flex;
  flex-direction: column;
  border: 1px solid $color-border;
  padding: $spacing-medium;
  border-radius: 8px;
  min-height: 80px;
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :global(html.dark) & {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    color: var(--color-text-primary);

    h1, p {
      color: var(--color-text-primary);
    }
  }

  .account-selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .title {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
    flex-grow: 1; /* Allow title to take available space */

    h1 {
      margin-bottom: 0; /* Remove default h1 margin */
    }

    p {
      margin-bottom: 0; /* Remove default p margin */
    }
  }

  .account-select {
    max-width: 300px; /* Adjust as needed */
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  .account-selector {
    .account-selector-header {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-medium;
    }

    .title {
      width: 100%; /* Full width for title in mobile */
    }

    .account-select {
      max-width: 100%; /* Full width for select in mobile */
      width: 100%;
      margin-left: 0; /* Reset margin for mobile */
    }
  }
}
</style>
