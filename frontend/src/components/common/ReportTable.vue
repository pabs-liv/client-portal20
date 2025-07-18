<template>
  <div class="report-table-container">
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

<style lang="scss" scoped>
.report-table-container {
  /* Basic styling for the container */
  width: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600; /* semi-bold */
  padding-bottom: var(--spacing-small);
  border-bottom: 1px solid #eee;
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-small) 0;
}

.table-row span {
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
