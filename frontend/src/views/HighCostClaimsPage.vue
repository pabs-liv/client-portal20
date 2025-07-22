
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
      <p v-if="isExternal" class="text-small disclaimer-text mt-small mb-large">
        Disclaimer: Cost represents estimated total cost of the medication, not inclusive of tax, member cost share, applicable program savings, etc.
      </p>
      <ReportDataTable
        :headers="claimsHeaders"
        :items="claimsData"
        :show-row-actions="false"
        :show-selection-checkboxes="false"
        :show-action-icons="isExternal"
        :action-icons="actionIcons"
        :search-placeholder="'Search high cost claims'"
        :show-filter-button="false"
        :show-internal-user-actions="!isExternal"
        :internal-user-action-formatter="formatInternalUserAction"
        :internal-user-action-click-handler="handleRequestInfo"
      >
      </ReportDataTable>
    </PageCard>

    <Dialog
      :model-value="showApproveDialog"
      @update:model-value="showApproveDialog = $event"
      :icon="CircleCheckBig"
      heading="Approve High Cost Claim"
      :text="`Are you sure you want to approve the claim for ${selectedClaim?.drugName} with a cost of ${selectedClaim?.cost}?`"
      :actions="approveDialogActions"
    />

    <Dialog
      :model-value="showRejectDialog"
      @update:model-value="showRejectDialog = $event"
      :icon="BanknoteX"
      heading="Reject Claim"
      :text="`Are you sure you want to reject the claim for ${selectedClaim?.drugName}?`"
      :actions="rejectDialogActions"
    />

    <Dialog
        :model-value="showRequestInfoDialog"
        @update:model-value="showRequestInfoDialog = $event"
        :icon="Info"
        heading="Claim Information Requested"
        :actions="requestInfoDialogActions"
      >
        <p class="text-body mb-small">
          Additional information about this high cost claim has been requested. Please contact the client as soon as possible.
        </p>
        <p class="text-small text-neutral-disabled mt-small">
          Requested By: {add placeholder user name - email}
        </p>
        <p class="text-small text-neutral-disabled">
          Requested Date: {placeholder date and time}
        </p>
      </Dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheckBig, BanknoteX, Info } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import Banner from '@/components/common/Banner.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Dialog from '@/components/ui/Dialog.vue';
import { useUserType } from '@/composables/useUserType';

const { isExternal } = useUserType();

const formatInternalUserAction = (item: any) => {
  if (item.status === 'Pending' || item.status === 'Rejected') {
    return 'Information Requested';
  } else {
    return '-';
  }
};

const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const showRequestInfoDialog = ref(false);
const selectedClaim = ref<any>(null);

const claimsHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'EOC ID', key: 'eocId', align: 'end' },
  { title: 'Drug Name', key: 'drugName' },
  { title: 'Cost', key: 'cost', align: 'end' },
  { title: 'Claim Date', key: 'claimDate', align: 'end' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'start', width: '1px' },
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
  selectedClaim.value = item;
  showApproveDialog.value = true;
};

const handleReject = (item: any) => {
  selectedClaim.value = item;
  showRejectDialog.value = true;
};

const handleRequestInfo = (item: any) => {
  selectedClaim.value = item;
  showRequestInfoDialog.value = true;
};

const approveDialogActions = [
  { text: 'Cancel', onClick: () => showApproveDialog.value = false, color: 'primary', variant: 'outlined' },
  { text: 'Approve Claim', onClick: () => {
    console.log('Claim Approved:', selectedClaim.value);
    showApproveDialog.value = false;
    // Implement actual approve logic here
  }, color: 'primary', variant: 'elevated' },
];

const rejectDialogActions = [
  { text: 'Cancel', onClick: () => showRejectDialog.value = false, color: 'primary', variant: 'outlined' },
  { text: 'Reject', onClick: () => {
    console.log('Claim Rejected:', selectedClaim.value);
    showRejectDialog.value = false;
    // Implement actual reject logic here
  }, type: 'destructive', variant: 'elevated' },
];

const requestInfoDialogActions = [
  { text: 'Cancel', onClick: () => showRequestInfoDialog.value = false, color: 'primary', variant: 'outlined' },
  { text: 'Acknowledge', onClick: () => {
    console.log('Request Info for Claim:', selectedClaim.value);
    showRequestInfoDialog.value = false;
    // Implement actual request info logic here
  }, color: 'primary', variant: 'elevated' },
];

const actionIcons = ref([
  {
    icon: CircleCheckBig,
    tooltip: 'Approve',
    onClick: handleApprove,
    class: 'approve-icon',
    size: 25,
  },
  {
    icon: BanknoteX,
    tooltip: 'Reject',
    onClick: handleReject,
    class: 'reject-icon',
    size: 25,
  },
  {
    icon: Info,
    tooltip: 'Request Info',
    onClick: handleRequestInfo,
    class: 'info-icon',
    size: 25,
  },
]);
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.disclaimer-text {
  color: $color-neutral-disabled;
}
</style>
