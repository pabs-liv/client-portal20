
<template>
  <div>
    <h1 class="text-h1 mb-large">Prior Authorizations</h1>
    <div class="widgets-container mb-large">
      <SummaryWidget
        title="Pending"
        :count="pendingCount"
        description="Authorizations awaiting review"
        icon-background-color="rgba(253, 214, 113, 0.2)"
        icon-color="#FBBA13"
        :show-icon="true"
        :icon="Hourglass"
        :clickable="false"
      />
      <SummaryWidget
        title="Approved"
        :count="approvedCount"
        description="Authorizations that have been approved"
        icon-background-color="rgba(190, 227, 190, 0.4)"
        icon-color="#5CB85C"
        :show-icon="true"
        :icon="CircleCheckBig"
        :clickable="false"
      />
      <SummaryWidget
        title="Denied"
        :count="deniedCount"
        description="Authorizations that have been denied"
        icon-background-color="rgba(212, 107, 107, 0.4)"
        icon-color="#B80909"
        :show-icon="true"
        :icon="XCircle"
        :clickable="false"
      />
    </div>
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
        search-placeholder="Search by account, EOC ID, or drug name"
        :initial-filter-pills="priorAuthFilterPills"
        :show-action-icons="isExternal"
        :action-icons="actionIcons"
        :show-internal-user-actions="!isExternal"
        :internal-user-action-formatter="formatInternalUserAction"
        :internal-user-action-click-handler="handleInternalInfoClick"
        :show-row-actions="false"
      />
    </PageCard>
    <Dialog
      :model-value="showInfoDialog"
      @update:model-value="showInfoDialog = $event"
      :icon="Info"
      heading="Request Additional Information"
      text="Would like to know more about this prior authorization? We are here to help! Submit your request to prompt your account manager to get more details about this claim."
      :actions="infoDialogActions"
      :show-secondary-button="true"
    />
    <Dialog
      :model-value="showInternalInfoDialog"
      @update:model-value="showInternalInfoDialog = $event"
      :icon="Info"
      heading="PA Information Requested"
      :actions="internalInfoDialogActions"
    >
      <p class="text-body mb-small">
        Additional information about this PA claim has been requested. Please contact the client as soon as possible.
      </p>
      <p class="text-small text-neutral-disabled mt-small">
        Requested By: {add placeholder user name - email}
        <br />
        Requested Date: {placeholder date and time}
      </p>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import PageCard from '@/components/common/PageCard.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import SummaryWidget from '@/components/common/SummaryWidget.vue';
import Dialog from '@/components/ui/Dialog.vue';
import { useUserType } from '@/composables/useUserType';
import { Hourglass, CircleCheckBig, XCircle, Info } from 'lucide-vue-next';

const priorAuthHeaders = ref([
  { title: 'Account Name', key: 'accountName', width: '25%' },
  { title: 'EOC ID', key: 'eocId' },
  { title: 'Drug Name', key: 'drugName', width: '25%' },
  { title: 'Submission Date', key: 'submissionDate', align: 'end', width: '15%' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]);

const priorAuthData = ref([
  {
    accountName: 'Company A',
    eocId: 'EOC12345',
    drugName: 'Drug A',
    status: 'Pending',
    submissionDate: '2025-07-01',
  },
  {
    accountName: 'Company B',
    eocId: 'EOC67890',
    drugName: 'Drug B',
    status: 'Approved',
    submissionDate: '2025-06-25',
  },
  {
    accountName: 'Company C',
    eocId: 'EOC11223',
    drugName: 'Drug C',
    status: 'Denied',
    submissionDate: '2025-06-20',
  },
  {
    accountName: 'Company D',
    eocId: 'EOC44556',
    drugName: 'Drug D',
    status: 'Pending',
    submissionDate: '2025-07-05',
  },
  {
    accountName: 'Company E',
    eocId: 'EOC77889',
    drugName: 'Drug E',
    status: 'Approved',
    submissionDate: '2025-06-18',
  },
  {
    accountName: 'Company F',
    eocId: 'EOC99001',
    drugName: 'Drug F',
    status: 'Pending',
    submissionDate: '2025-07-10',
  },
  {
    accountName: 'Company G',
    eocId: 'EOC22334',
    drugName: 'Drug G',
    status: 'Denied',
    submissionDate: '2025-06-15',
  },
  {
    accountName: 'Company H',
    eocId: 'EOC55667',
    drugName: 'Drug H',
    status: 'Approved',
    submissionDate: '2025-07-02',
  },
  {
    accountName: 'Company I',
    eocId: 'EOC88990',
    drugName: 'Drug I',
    status: 'Pending',
    submissionDate: '2025-06-28',
  },
  {
    accountName: 'Company J',
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

const pendingCount = computed(() => priorAuthData.value.filter(item => item.status === 'Pending').length);
const approvedCount = computed(() => priorAuthData.value.filter(item => item.status === 'Approved').length);
const deniedCount = computed(() => priorAuthData.value.filter(item => item.status === 'Denied').length);

const { isExternal } = useUserType();

const showInfoDialog = ref(false);
const showInternalInfoDialog = ref(false);
const selectedAuth = ref<any>(null);

const handleInfoClick = (item: any) => {
  selectedAuth.value = item;
  showInfoDialog.value = true;
};

const handleInternalInfoClick = (item: any) => {
  selectedAuth.value = item;
  showInternalInfoDialog.value = true;
};

const actionIcons = ref([
  { icon: Info, tooltip: 'Request Info', onClick: handleInfoClick },
]);

const infoDialogActions = [
  { text: 'Cancel', onClick: () => (showInfoDialog.value = false), styleType: 'secondary' },
  { text: 'Send Request', onClick: () => { console.log('Send Request clicked'); showInfoDialog.value = false; }, styleType: 'primary' }
];

const internalInfoDialogActions = [
  { text: 'Acknowledge', onClick: () => (showInternalInfoDialog.value = false), color: 'primary', variant: 'flat' as const }
];

const formatInternalUserAction = (item: any) => {
  if (item.status === 'Pending' || item.status === 'Denied') {
    return 'Information Requested';
  } else {
    return '-';
  }
};
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
}
</style>
