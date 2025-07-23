
<template>
  <div>
    <h1 class="text-h1 mb-large">High-Cost Claims</h1>
    <div v-if="isExternal" class="widgets-container mb-large">
      <SummaryWidget
        title="Claims Pending Approval"
        :count="claimsPendingApprovalCount"
        description="Claims awaiting your review"
        icon-background-color="rgba(253, 214, 113, 0.2)"
        icon-color="#FBBA13"
        :show-icon="true"
        :icon="ClockFading"
        :clickable="false"
      />
      <SummaryWidget
        title="Total Cost"
        :count="totalClaimsCost"
        description="Total estimated cost of all claims"
        icon-background-color="rgba(190, 227, 190, 0.4)"
        icon-color="#5CB85C"
        :show-icon="true"
        :icon="DollarSign"
        :clickable="false"
      />
      <SummaryWidget
        title="Average Claim Cost"
        :count="averageClaimCost"
        description="Average estimated cost per claim"
        icon-background-color="rgba(200, 220, 240, 0.4)"
        icon-color="#2C82CB"
        :show-icon="true"
        :icon="Calculator"
        :clickable="false"
      />
    </div>
    <div class="mt-large chart-container mb-large">
      <h3 class="text-h3">Top 5 Accounts by High-Cost Claim Amount</h3>
      <apexchart
        type="bar"
        height="200"
        :options="chartOptions"
        :series="top5AccountsByClaimAmount.series"
      ></apexchart>
    </div>

    <PageCard
      headerText="Recent High-Cost Claims Activity"
      :descriptionText="isExternal ? 'Review claims, acknowledge or ask questions about high cost claims and take advantage of savings for your members.' : 'Review claims and acknowledge client questions about high cost claims.'"
    >
      <Banner
        variant="warning"
        message="For high-cost claims, please acknowledge within 24 hours. If this claim is not acknowledged within 24 hours, it will automatically be processed to be filled in order to avoid member disruption and a delay in treatment with the approved therapy. If you have any questions, please select the Help button on that claim or contact your Account Management team."
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
        :search-placeholder="'Search high-cost claims'"
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
      heading="Approve High-Cost Claim"
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
        :model-value="showInternalInfoDialog"
        @update:model-value="showInternalInfoDialog = $event"
        :icon="Info"
        heading="Claim Information Requested"
        :actions="internalInfoDialogActions"
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

      <Dialog
        :model-value="showExternalInfoDialog"
        @update:model-value="showExternalInfoDialog = $event"
        :icon="Info"
        heading="Request Additional Information"
        :actions="externalInfoDialogActions"
      >
        <p class="text-body mb-small">
          Would like to know more about this high-cost claim? We are here to help! Submit your request to prompt your account manager to get more details about this claim.
        </p>
      </Dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { CircleCheckBig, BanknoteX, Info, Hourglass, ClockFading, DollarSign, Calculator } from 'lucide-vue-next';
import PageCard from '@/components/common/PageCard.vue';
import Banner from '@/components/common/Banner.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Dialog from '@/components/ui/Dialog.vue';
import SummaryWidget from '@/components/common/SummaryWidget.vue';
import VueApexCharts from 'vue3-apexcharts';
import { useUserType } from '@/composables/useUserType';

const { isExternal } = useUserType();

const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const showInternalInfoDialog = ref(false);
const showExternalInfoDialog = ref(false);

const handleApproveClick = (item: any) => {
  selectedClaim.value = item;
  showApproveDialog.value = true;
};

const handleRejectClick = (item: any) => {
  selectedClaim.value = item;
  showRejectDialog.value = true;
};

const handleRequestInfo = (item: any) => {
  selectedClaim.value = item;
  if (isExternal.value) {
    showExternalInfoDialog.value = true;
  } else {
    showInternalInfoDialog.value = true;
  }
};

const actionIcons = ref([
  { icon: CircleCheckBig, tooltip: 'Approve', onClick: handleApproveClick, type: 'approve' as const },
  { icon: BanknoteX, tooltip: 'Reject', onClick: handleRejectClick, type: 'reject' as const },
  { icon: Info, tooltip: 'Request Info', onClick: handleRequestInfo, type: 'info' as const },
]);

const approveDialogActions = [
  { text: 'Cancel', onClick: () => (showApproveDialog.value = false), variant: 'text' as const },
  { text: 'Approve', onClick: () => { console.log('approved'); showApproveDialog.value = false; }, color: 'primary', variant: 'flat' as const }
];

const rejectDialogActions = [
  { text: 'Cancel', onClick: () => (showRejectDialog.value = false), variant: 'text' as const },
  { text: 'Reject', onClick: () => { console.log('rejected'); showRejectDialog.value = false; }, color: 'error', variant: 'flat' as const, type: 'destructive' as const }
];

const internalInfoDialogActions = [
  { text: 'Acknowledge', onClick: () => (showInternalInfoDialog.value = false), color: 'primary', variant: 'flat' as const }
];

const externalInfoDialogActions = [
  { text: 'Cancel', onClick: () => (showExternalInfoDialog.value = false), variant: 'text' as const },
  { text: 'Send Request', onClick: () => { console.log('Send Request clicked'); showExternalInfoDialog.value = false; }, color: 'primary', variant: 'flat' as const }
];

const formatInternalUserAction = (item: any) => {
  if (item.status === 'Pending' || item.status === 'Rejected') {
    return 'Information Requested';
  } else {
    return '-';
  }
};

const selectedClaim = ref<any>(null);

const claimsHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'EOC ID', key: 'eocId', align: 'end' },
  { title: 'Drug Name', key: 'drugName' },
  { title: 'Cost', key: 'cost', align: 'end' },
  { title: 'Claim Date', key: 'claimDate', align: 'end' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'start', width: '180px' },
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

const claimsPendingApprovalCount = computed(() => {
  return claimsData.value.filter(claim => claim.status === 'Pending').length;
});

const totalClaimsCost = computed(() => {
  const total = claimsData.value.reduce((sum, claim) => {
    const cost = parseFloat(claim.cost.replace(/[^0-9.-]+/g," "));
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);
  return `${total.toFixed(2)}`;
});

const averageClaimCost = computed(() => {
  if (claimsData.value.length === 0) return '$0.00';
  const total = claimsData.value.reduce((sum, claim) => {
    const cost = parseFloat(claim.cost.replace(/[^0-9.-]+/g," "));
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);
  const average = total / claimsData.value.length;
  return `${average.toFixed(2)}`;
});

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: top5AccountsByClaimAmount.value.categories,
    labels: { style: { colors: 'var(--color-text-primary)' } },
  },
  yaxis: {
    title: { text: 'Claim Amount' },
    labels: { style: { colors: 'var(--color-text-primary)' } },
  },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return "$" + val.toFixed(2);
      }
    }
  },
  theme: { palette: 'palette1' },
  grid: {
    show: true,
    borderColor: 'var(--color-border)',
    strokeDashArray: 0,
    position: 'back',
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    row: { colors: undefined, opacity: 0.5 },
    column: { colors: undefined, opacity: 0.5 },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  },
}));

const top5AccountsByClaimAmount = computed(() => {
  const accountMap = new Map<string, number>();
  claimsData.value.forEach(claim => {
    const cost = parseFloat(claim.cost.replace(/[$,]/g, ''));
    const currentCost = accountMap.get(claim.accountName) || 0;
    accountMap.set(claim.accountName, currentCost + (isNaN(cost) ? 0 : cost));
  });

  const sortedAccounts = Array.from(accountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    categories: sortedAccounts.map(entry => entry[0]),
    series: [{ name: 'Claim Amount', data: sortedAccounts.map(entry => entry[1]) }]
  };
});
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.disclaimer-text {
  color: $color-neutral-disabled;
}

.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-medium;
}

.chart-container {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  background-color: $color-neutral-white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
