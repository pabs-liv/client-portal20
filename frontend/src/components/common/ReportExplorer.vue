<template>
  <v-expansion-panels class="report-explorer-accordion">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="d-flex flex-column align-start">
          <h2 class="report-explorer-title">{{ headerText }}</h2>
          <p class="report-explorer-description">{{ descriptionText }}</p>
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
        <div class="report-table">
          <div class="table-header">
            <span>Report Name</span>
            <span>Date Generated</span>
            <span>Status</span>
          </div>
          <div v-for="report in reports" :key="report.id" class="table-row">
            <span>{{ report.name }}</span>
            <span>{{ report.dateGenerated }}</span>
            <span>{{ report.status }}</span>
          </div>
          <div v-if="reports.length === 0" class="no-reports">
            No reports available.
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { defineProps } from 'vue';
import { ChevronRight, ChevronUp } from 'lucide-vue-next';

defineProps({
  reports: {
    type: Array,
    default: () => [],
  },
  showChevron: {
    type: Boolean,
    default: true,
  },
  headerText: {
    type: String,
    default: 'Report Explorer',
  },
  descriptionText: {
    type: String,
    default: 'Find, view and approve any report by account, name tyepe or date.',
  },
});
</script>

<style scoped>
.report-explorer-accordion {
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--color-neutral-white);
}

.report-explorer-accordion .v-expansion-panel-title {
  padding: var(--spacing-medium);
}

.report-explorer-accordion .v-expansion-panel-text {
  padding: var(--spacing-medium);
}

.report-explorer-accordion .report-explorer-title {
  color: var(--color-primary);
  margin-bottom: var(--spacing-nano); /* Small gap between title and description */
}

.report-explorer-accordion .report-explorer-description {
  font-size: 1rem; /* p styling */
  line-height: 120%; /* p styling */
  font-weight: 400; /* p styling */
  margin-bottom: var(--spacing-medium); /* Gap below description */
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.report-table .table-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600; /* semi-bold */
  padding-bottom: var(--spacing-small);
  border-bottom: 1px solid #eee;
}

.report-table .table-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-small) 0;
}

.report-table span {
  flex: 1;
  text-align: left;
  padding: 0 var(--spacing-xsmall);
}

.no-reports {
  text-align: center;
  padding: var(--spacing-medium);
  color: #888;
}

.report-explorer-accordion :deep(.v-expansion-panel__shadow) {
  box-shadow: none !important;
}
</style>

