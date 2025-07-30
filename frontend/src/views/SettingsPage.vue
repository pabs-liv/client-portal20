
<template>
  <div>
    <AccountSelector
      heading="Account Settings"
      subheading="Manage client account settings. Select an account to get started."
      :items="accountOptions"
      label="Select Account"
      item-title="name"
      item-value="id"
      :searchable="true"
      v-model="selectedAccount"
      :show-slot="true"
    >
      <div class="account-settings">
        <Tabs :tabs="settingTabs" @tab-selected="handleTabSelected" />
        <div v-if="selectedAccount && activeTab === 'company-information'">
          <div class="general-information-container">
            <div class="tab-header">
              <h3 class="text-h3">General Information</h3>
              <p class="text-body">Keep company information up to date.</p>
            </div>
            <div class="form-row">
              <TextField
                label="Company name"
                :model-value="selectedAccountData.companyName"
                readonly
              />
              <TextField
                label="Doing business as"
                :model-value="selectedAccountData.dba"
                readonly
              />
            </div>
          </div>
          <div class="high-cost-container">
            <div class="tab-header">
              <h3 class="text-h3">High Cost Notification Settings</h3>
              <p class="text-body">Set a high-cost claim limit to get notifications when adjudicated claims surpass the limit.</p>
            </div>
            <div class="form-row">
              <TextField
                label="Notification threshold"
                :model-value="editableThreshold"
                @update:model-value="updateThreshold"
                prefix="$"
              />
            </div>
          </div>
          <div class="form-actions">
            <v-btn :disabled="!isChanged" color="primary" @click="saveChanges">Save</v-btn>
            <v-btn v-if="isChanged" variant="text" @click="cancelChanges">Cancel</v-btn>
          </div>
        </div>
        <div v-if="selectedAccount && activeTab === 'user-administration'">
          <ReportDataTable
            :headers="userAdminHeaders"
            :items="userAdminData"
            :show-search-bar="true"
            :show-filter-button="false"
            search-placeholder="Search users"
            :show-row-actions="true"
            :show-table-footer="true"
            :show-selection-checkboxes="false"
            :boolean-columns="['activated', 'mainPoc', 'surveyContact']"
          >
          </ReportDataTable>
        </div>
        <div v-if="selectedAccount && activeTab === 'caa-drug-cost-reporting'">
          <div class="caa-settings">
            <div class="tab-header">
              <h3 class="text-h3">Consolidated Appropriations Act Reporting</h3>
              <p class="text-body">DISCLAIMER: With the reporting option 2 (D3-D8), Liviniti will be providing and/or utilizing data for the time period that the Plan Sponsor is active with Liviniti. If Plan Sponsors utilized another PBM during any of the reporting period, the Plan Sponsor will need to coordinate with each PBM.</p>
            </div>
            <div class="benefit-details">
              <h3 class="text-h3">Benefit Details</h3>
              <div class="form-row">
                <TextField
                  label="Group health plan #"
                  model-value="12345678"
                  readonly
                />
                <TextField
                  label="Carve-out benefit"
                  model-value="Pharmacy Only"
                  readonly
                />
                <TextField
                  label="Form 5500 plan #"
                  model-value="501"
                  readonly
                />
              </div>
              <div class="form-row">
                <Autocomplete
                  label="States"
                  :items="states"
                  multiple
                  readonly
                  :model-value="selectedAccountData.states"
                ></Autocomplete>
              </div>
              <div class="form-row">
                <Autocomplete
                  label="Market segment"
                  :items="marketSegments"
                  readonly
                  :model-value="selectedAccountData.marketSegment"
                ></Autocomplete>
              </div>
              <div class="form-row">
                <DatePicker
                  label="Plan year begin date"
                  :model-value="selectedAccountData.planYearBeginDate"
                  readonly
                />
                <DatePicker
                  label="Plan year end date"
                  :model-value="selectedAccountData.planYearEndDate"
                  readonly
                />
              </div>
              <div class="form-row">
                <TextField
                  label="Members as of 12/31 of the reference year"
                  :model-value="selectedAccountData.membersAsOf"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountSelector>
    <v-snackbar v-model="showSnackbar" :timeout="3000" color="success">
      Settings saved successfully!
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import AccountSelector from '@/components/common/AccountSelector.vue';
import Tabs from '@/components/common/Tabs.vue';
import TextField from '@/components/ui/TextField.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import Autocomplete from '@/components/ui/Autocomplete.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import { ref, computed, watch } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);

const companyData: { [key: number]: { companyName: string; dba: string; notificationThreshold: string; groupHealthPlan: string; carveOutBenefit: string; form5500Plan: string; states: string[]; marketSegment: string; planYearBeginDate: string; planYearEndDate: string; membersAsOf: string } } = {
  1: { companyName: 'Stark Industries', dba: 'Stark Industries', notificationThreshold: '15000', groupHealthPlan: '12345678', carveOutBenefit: 'Pharmacy Only', form5500Plan: '501', states: ['CA', 'NY'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '257' },
  2: { companyName: 'Wayne Enterprises', dba: 'Wayne Foundation', notificationThreshold: '25000', groupHealthPlan: '87654321', carveOutBenefit: 'Medical & Pharmacy', form5500Plan: '502', states: ['TX', 'FL'], marketSegment: 'Commercial Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '500' },
  3: { companyName: 'Cyberdyne Systems', dba: 'Cyberdyne', notificationThreshold: '10000', groupHealthPlan: '11223344', carveOutBenefit: 'Pharmacy Only', form5500Plan: '503', states: ['IL', 'GA'], marketSegment: 'Government Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '100' },
  4: { companyName: 'Oscorp', dba: 'Oscorp Industries', notificationThreshold: '20000', groupHealthPlan: '44332211', carveOutBenefit: 'Medical & Pharmacy', form5500Plan: '504', states: ['PA', 'OH'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '750' },
  5: { companyName: 'Tyrell Corporation', dba: 'Tyrell', notificationThreshold: '30000', groupHealthPlan: '99887766', carveOutBenefit: 'Pharmacy Only', form5500Plan: '505', states: ['WA', 'OR'], marketSegment: 'Commercial Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '300' },
};

const selectedAccountData = computed(() => {
  if (selectedAccount.value && companyData[selectedAccount.value]) {
    return companyData[selectedAccount.value];
  }
  return { companyName: '', dba: '', notificationThreshold: '', groupHealthPlan: '', carveOutBenefit: '', form5500Plan: '', states: [], marketSegment: '', planYearBeginDate: '', planYearEndDate: '', membersAsOf: '' };
});

const editableThreshold = ref('');
const isChanged = ref(false);
const showSnackbar = ref(false);

watch(selectedAccount, (newVal) => {
  if (newVal && companyData[newVal]) {
    editableThreshold.value = companyData[newVal].notificationThreshold;
    isChanged.value = false;
  } else {
    editableThreshold.value = '';
    isChanged.value = false;
  }
}, { immediate: true });

const updateThreshold = (newValue: string) => {
  editableThreshold.value = newValue;
  isChanged.value = true;
};

const saveChanges = () => {
  if (selectedAccount.value) {
    companyData[selectedAccount.value].notificationThreshold = editableThreshold.value;
    isChanged.value = false;
    showSnackbar.value = true;
  }
};

const cancelChanges = () => {
  if (selectedAccount.value) {
    editableThreshold.value = companyData[selectedAccount.value].notificationThreshold;
    isChanged.value = false;
  }
};

const settingTabs = ref([
  { label: 'Company Information', key: 'company-information' },
  { label: 'User Administration', key: 'user-administration' },
  { label: 'CAA Drug Cost Reporting', key: 'caa-drug-cost-reporting' },
  { label: 'CAA Gag Clause Attestation', key: 'caa-gag-clause-attestation' },
]);

const states = ref([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]);

const marketSegments = ref([
  'SF Large Employer Plans',
  'Commercial Plans',
  'Government Plans',
  'Individual Plans',
]);

const activeTab = ref('company-information');

const handleTabSelected = (tabKey: string) => {
  activeTab.value = tabKey;
};

const userAdminHeaders = ref([
  { title: 'Account Name', key: 'accountName' },
  { title: 'User', key: 'user' },
  { title: 'Role', key: 'role' },
  { title: 'Email', key: 'email' },
  { title: 'Permissions', key: 'permissions' },
  { title: 'Activated', key: 'activated', align: 'center' },
  { title: 'Main POC', key: 'mainPoc', align: 'center' },
  { title: 'Survey Contact', key: 'surveyContact', align: 'center' },
  { title: '', key: 'actions', align: 'end', sortable: false },
]);

const userAdminData = ref([
  {
    accountName: 'Stark Industries',
    user: 'Tony Stark',
    role: 'Admin',
    email: 'tony.stark@starkindustries.com',
    permissions: 'All',
    activated: true,
    mainPoc: true,
    surveyContact: false,
  },
  {
    accountName: 'Stark Industries',
    user: 'Pepper Potts',
    role: 'Admin',
    email: 'pepper.potts@starkindustries.com',
    permissions: 'All',
    activated: true,
    mainPoc: false,
    surveyContact: true,
  },
  {
    accountName: 'Wayne Enterprises',
    user: 'Bruce Wayne',
    role: 'Admin',
    email: 'bruce.wayne@wayneenterprises.com',
    permissions: 'All',
    activated: true,
    mainPoc: true,
    surveyContact: false,
  },
]);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.account-settings {
  display: flex;
  flex-direction: column;
  
}

.general-information-container {
  margin-bottom: $spacing-large;
  max-width: 500px;
}

.tab-header {
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
  margin-bottom: $spacing-large;

  h3 {
    color: $color-primary !important;
    margin-bottom: 0;
  }
}

.form-row {
  display: flex;
  flex-direction: row;
  gap: $spacing-medium;

  @media (max-width: 768px) { /* Adjust breakpoint as needed */
    flex-wrap: wrap;

    .v-input {
      width: 100%; /* Ensure fields take full width on mobile */
    }
  }
}

.form-actions {
  display: flex;
  gap: $spacing-medium;
  align-items: center;
}

.high-cost-container {
  padding-bottom: $spacing-large;
  max-width: 500px;
  
}

.caa-settings {
  display: flex;
  flex-direction: column;

}

.benefit-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-medium;
  max-width: 500px;

  h3 {
    color: $color-primary !important;
  }
}
</style>
