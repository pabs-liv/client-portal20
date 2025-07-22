
<template>
  <div>
    <PageCard
      headerText="Prior Authorizations"
      descriptionText="Review prior authorizations and stay on top of your members."
    >
      <ReportDataTable
        :headers="priorAuthHeaders"
        :items="priorAuthData"
        :show-search-bar="true"
        :show-filter-button="false"
        :show-filter-pills="true"
        search-placeholder="Search prior authorizations"
        :initial-filter-pills="priorAuthFilterPills"
      />
    </PageCard>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';

const priorAuthHeaders = ref([
  { title: 'Account Name', key: 'accountName', width: '25%' },
  { title: 'EOC ID', key: 'eocId' },
  { title: 'Drug Name', key: 'drugName', width: '25%' },
  { title: 'Submission Date', key: 'submissionDate', align: 'end', width: '15%' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]);

const priorAuthData = ref([
  {
    accountName: 'Blue Cross Blue Shield',
    eocId: 'EOC12345',
    drugName: 'Drug A',
    status: 'Pending',
    submissionDate: '2025-07-01',
  },
  {
    accountName: 'Aetna',
    eocId: 'EOC67890',
    drugName: 'Drug B',
    status: 'Approved',
    submissionDate: '2025-06-25',
  },
  {
    accountName: 'Cigna',
    eocId: 'EOC11223',
    drugName: 'Drug C',
    status: 'Denied',
    submissionDate: '2025-06-20',
  },
  {
    accountName: 'UnitedHealthcare',
    eocId: 'EOC44556',
    drugName: 'Drug D',
    status: 'Pending',
    submissionDate: '2025-07-05',
  },
  {
    accountName: 'Humana',
    eocId: 'EOC77889',
    drugName: 'Drug E',
    status: 'Approved',
    submissionDate: '2025-06-18',
  },
  {
    accountName: 'Kaiser Permanente',
    eocId: 'EOC99001',
    drugName: 'Drug F',
    status: 'Pending',
    submissionDate: '2025-07-10',
  },
  {
    accountName: 'Anthem',
    eocId: 'EOC22334',
    drugName: 'Drug G',
    status: 'Denied',
    submissionDate: '2025-06-15',
  },
  {
    accountName: 'Molina Healthcare',
    eocId: 'EOC55667',
    drugName: 'Drug H',
    status: 'Approved',
    submissionDate: '2025-07-02',
  },
  {
    accountName: 'Centene',
    eocId: 'EOC88990',
    drugName: 'Drug I',
    status: 'Pending',
    submissionDate: '2025-06-28',
  },
  {
    accountName: 'WellCare',
    eocId: 'EOC10112',
    drugName: 'Drug J',
    status: 'Approved',
    submissionDate: '2025-07-08',
  },
]);

const priorAuthFilterPills = ref([
  { type: 'status', value: 'all', label: 'All', isActive: true },
  { type: 'status', value: 'Approved', label: 'Approved' },
  { type: 'status', value: 'Pending', label: 'Pending' },
  { type: 'status', value: 'Denied', label: 'Denied' },
]);
</script>
