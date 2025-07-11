<template>
  <div class="report-explorer">
    <h3>Report Explorer</h3>
    <div class="report-table-placeholder">
      <div class="table-header">
        <span>Report Name</span>
        <span>Date Generated</span>
        <span>Status</span>
      </div>
      <div class="table-row">
        <span>Monthly Value Report</span>
        <span>2025-07-01</span>
        <span>Completed</span>
      </div>
      <div class="table-row">
        <span>Quarterly Executive Summary</span>
        <span>2025-06-30</span>
        <span>Completed</span>
      </div>
      <div class="table-row">
        <span>Ad-Hoc Savings Analysis</span>
        <span>2025-07-05</span>
        <span>Processing</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for this placeholder
</script>

<style scoped>
.report-explorer {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: var(--spacing-medium);
  background-color: var(--color-neutral-white);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h3 {
  margin-bottom: var(--spacing-medium);
}

.report-table-placeholder .table-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600; /* semi-bold */
  padding-bottom: var(--spacing-small);
  border-bottom: 1px solid #eee;
}

.report-table-placeholder .table-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-small) 0;
}

.report-table-placeholder span {
  flex: 1;
  text-align: left;
  padding: 0 var(--spacing-xsmall);
}
</style>
