<template>
  <div class="report-explorer">
    <h3>Report Explorer</h3>
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
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  reports: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.report-explorer {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: var(--spacing-medium);
  background-color: var(--color-neutral-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: var(--spacing-medium);
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
</style>

