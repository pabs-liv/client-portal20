<template>
  <div class="page-card">
    <div class="page-card-header">
      <h2 class="page-card-title text-h2">{{ headerText }}</h2>
      <p v-if="descriptionText" class="page-card-description text-body">{{ descriptionText }}</p>
    </div>
    <div class="page-card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  headerText?: string;
  descriptionText?: string;
}

withDefaults(defineProps<Props>(), {
  headerText: 'Reports Awaiting Approval',
  descriptionText: 'View and approve reports for visibility to the client.',
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.page-card {
  background-color: $color-neutral-white;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-card-header {
  margin-bottom: $spacing-medium;
}

.page-card-title {
  @extend .text-h2;
  color: $color-primary;
  margin-bottom: $spacing-xsmall;
}

.page-card-description {
  color: $color-text-primary;
  margin-bottom: $spacing-large;
}
</style>
