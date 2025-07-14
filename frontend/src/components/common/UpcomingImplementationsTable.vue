<template>
  <v-card class="upcoming-implementations-table">
    <v-card-title class="d-flex justify-space-between align-center">
      <h3>{{ headerText }}</h3>
      <Button v-if="showViewAllButton" variant="secondary" label="View All" />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      hide-default-footer
      class=""
    >
      <template v-slot:item.accountName="{ item }">
        <a href="#" class="account-link">{{ item.accountName }}</a>
      </template>
      <template v-slot:item.implementationStatus="{ item }">
        {{ item.implementationStatus }}
      </template>
      <template v-slot:item.goLiveDate="{ item }">
        {{ item.goLiveDate }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import Button from './Button.vue'; // Import our custom Button component

defineProps({
  headerText: {
    type: String,
    default: 'Upcoming Implementations Next 90 Days',
  },
  showViewAllButton: {
    type: Boolean,
    default: false,
  },
});

const headers = ref([
  { title: 'Account Name', key: 'accountName', headerProps: { style: { fontWeight: 'bold' } } },
  { title: 'Implementation Status', key: 'implementationStatus', headerProps: { style: { fontWeight: 'bold' } } },
  { title: 'Go Live Date', key: 'goLiveDate', headerProps: { style: { fontWeight: 'bold' } } },
]);

const items = ref([
  { accountName: 'Acme Corp', implementationStatus: 'Pending Documents', goLiveDate: '2025-07-20' },
  { accountName: 'Globex Inc.', implementationStatus: 'Clinical Setup', goLiveDate: '2025-08-05' },
  { accountName: 'Soylent Corp', implementationStatus: 'Systems Configuration', goLiveDate: '2025-08-15' },
  { accountName: 'Umbrella Corp', implementationStatus: 'Eligibility Review', goLiveDate: '2025-09-01' },
  { accountName: 'Weyland-Yutani', implementationStatus: 'Card Production', goLiveDate: '2025-09-10' },
  { accountName: 'Initech', implementationStatus: 'Pending Documents', goLiveDate: '2025-09-25' },
  { accountName: 'Cyberdyne Systems', implementationStatus: 'Clinical Setup', goLiveDate: '2025-10-01' },
]);
</script>

<style scoped>
.upcoming-implementations-table {
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--color-neutral-white);
  padding: var(--spacing-medium);
}

.upcoming-implementations-table .v-card-title {
  padding-bottom: 0;
}

.upcoming-implementations-table .v-card-title h3 {
  margin-bottom: 0; /* Remove default bottom margin */
}

.upcoming-implementations-table h3 {
  margin-bottom: var(--spacing-medium);
  text-align: left;
}

.upcoming-implementations-table .v-table > .v-table__wrapper > table > thead > tr > th {
  font-weight: bold !important;
}

/* Remove the old view-all-link styles as it's replaced by Button component */
.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  padding: var(--spacing-small);
}

.account-link {
  color: var(--color-link);
  text-decoration: none;
}

.account-link:hover {
  text-decoration: underline;
}

</style>
