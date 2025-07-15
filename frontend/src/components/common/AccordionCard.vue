<template>
  <v-expansion-panels class="accordion-card">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="d-flex flex-column align-start">
          <h2 class="accordion-card-title">{{ headerText }}</h2>
          <p class="accordion-card-description">{{ descriptionText }}</p>
        </div>
        <template v-slot:actions="{ expanded }">
          <component
            v-if="showChevron"
            :is="expanded ? ChevronUp : ChevronRight"
            :stroke-width="1"
            class="chevron-icon"
          />
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot name="content"></slot>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { defineProps } from 'vue';
import { ChevronRight, ChevronUp } from 'lucide-vue-next';

defineProps({
  showChevron: {
    type: Boolean,
    default: true,
  },
  headerText: {
    type: String,
    default: 'Accordion Card',
  },
  descriptionText: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.accordion-card {
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--color-neutral-white);
}

.accordion-card .v-expansion-panel-title {
  padding: var(--spacing-medium);
}

.accordion-card .v-expansion-panel-text {
  padding: 0 var(--spacing-medium) var(--spacing-medium) var(--spacing-medium);
  overflow: visible; /* Ensure content is not hidden */
  height: auto; /* Allow content to define height */
}

.accordion-card .accordion-card-title {
  color: var(--color-primary);
  margin-bottom: var(--spacing-nano); /* Small gap between title and description */
}

.accordion-card .accordion-card-description {
  font-size: 1rem; /* p styling */
  line-height: 120%; /* p styling */
  font-weight: 400; /* p styling */
  margin-bottom: var(--spacing-medium); /* Gap below description */
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.accordion-card :deep(.v-expansion-panel__shadow) {
  box-shadow: none !important;
}

.accordion-card :deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}
</style>

