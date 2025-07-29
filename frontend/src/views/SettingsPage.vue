
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
        <div v-if="!selectedAccount" class="pa-4 text-center text-body">
          <p>Please select an account to view or modify settings.</p>
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
import { ref, computed, watch } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);

const companyData: { [key: number]: { companyName: string; dba: string; notificationThreshold: string } } = {
  1: { companyName: 'Stark Industries', dba: 'Stark Industries', notificationThreshold: '15000' },
  2: { companyName: 'Wayne Enterprises', dba: 'Wayne Foundation', notificationThreshold: '25000' },
  3: { companyName: 'Cyberdyne Systems', dba: 'Cyberdyne', notificationThreshold: '10000' },
  4: { companyName: 'Oscorp', dba: 'Oscorp Industries', notificationThreshold: '20000' },
  5: { companyName: 'Tyrell Corporation', dba: 'Tyrell', notificationThreshold: '30000' },
};

const selectedAccountData = computed(() => {
  if (selectedAccount.value && companyData[selectedAccount.value]) {
    return companyData[selectedAccount.value];
  }
  return { companyName: '', dba: '', notificationThreshold: '' };
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
}

.form-actions {
  display: flex;
  gap: $spacing-medium;
  align-items: center;
}

.high-cost-container {
  padding-bottom: $spacing-large;
  
}
</style>
