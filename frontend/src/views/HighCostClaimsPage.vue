
<template>
  <div>
    <h1 class="text-h1 mb-large">High Cost Claims</h1>
    <PageCard
      headerText="Recent High-Cost Claims Activity"
      descriptionText="Review claims, acknowledge or ask questions about high cost claims and take advantage of savings for your members."
    >
      <Banner
        variant="warning"
        message="For high cost claims, please acknowledge within 24 hours. If this claim is not acknowledged within 24 hours, it will automatically be processed to be filled in order to avoid member disruption and a delay in treatment with the approved therapy. If you have any questions, please select the Help button on that claim or contact your Account Management team."
      />
      <p class="text-small disclaimer-text mt-small mb-large">
        Disclaimer: Cost represents estimated total cost of the medication, not inclusive of tax, member cost share, applicable program savings, etc.
      </p>
      <ReportDataTable
        :headers="claimsHeaders"
        :items="claimsData"
        :show-row-actions="false"
        :show-selection-checkboxes="false"
        :show-action-icons="true"
        :action-icons="actionIcons"
      >
      </ReportDataTable>
    </PageCard>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheckBig, BanknoteX, Info } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import Banner from '@/components/common/Banner.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';

const claimsHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'EOC ID', key: 'eocId', align: 'end' },
  { title: 'Drug Name', key: 'drugName' },
  { title: 'Cost', key: 'cost', align: 'end' },
  { title: 'Claim Date', key: 'claimDate', align: 'end' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]);

const claimsData = ref([
  {
    accountName: 'Blue Cross Blue Shield',
    eocId: 'EOC12345',
    drugName: 'Drug A',
    cost: '$1,200.00',
    claimDate: '2025-07-15',
    status: 'Pending',
  },
  {
    accountName: 'Aetna',
    eocId: 'EOC67890',
    drugName: 'Drug B',
    cost: '$800.00',
    claimDate: '2025-07-14',
    status: 'Approved',
  },
  {
    accountName: 'Cigna',
    eocId: 'EOC11223',
    drugName: 'Drug C',
    cost: '$2,500.00',
    claimDate: '2025-07-13',
    status: 'Pending',
  },
  {
    accountName: 'UnitedHealthcare',
    eocId: 'EOC44556',
    drugName: 'Drug D',
    cost: '$1,500.00',
    claimDate: '2025-07-12',
    status: 'Rejected',
  },
]);

const handleApprove = (item: any) => {
  console.log('Approve:', item);
  // Implement approve logic
};

const handleReject = (item: any) => {
  console.log('Reject:', item);
  // Implement reject logic
};

const handleRequestInfo = (item: any) => {
  console.log('Request Info:', item);
  // Implement request info logic
};

const actionIcons = ref([
  {
    icon: CircleCheckBig,
    tooltip: 'Approve',
    onClick: handleApprove,
    class: 'approve-icon',
  },
  {
    icon: BanknoteX,
    tooltip: 'Reject',
    onClick: handleReject,
    class: 'reject-icon',
  },
  {
    icon: Info,
    tooltip: 'Request Info',
    onClick: handleRequestInfo,
    class: 'info-icon',
  },
]);
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.disclaimer-text {
  color: $color-neutral-disabled;
}
</style>
