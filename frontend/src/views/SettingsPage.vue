
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
        <div v-if="!selectedAccount" class="pa-4 text-center text-body">
          <p>Please select an account to view or modify settings.</p>
        </div>
      </div>
    </AccountSelector>
  </div>
</template>

<script setup lang="ts">
import AccountSelector from '@/components/common/AccountSelector.vue';
import Tabs from '@/components/common/Tabs.vue';
import TextField from '@/components/ui/TextField.vue';
import { ref, computed } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref(null);

const companyData: { [key: number]: { companyName: string; dba: string } } = {
  1: { companyName: 'Stark Industries', dba: 'Stark Industries' },
  2: { companyName: 'Wayne Enterprises', dba: 'Wayne Foundation' },
  3: { companyName: 'Cyberdyne Systems', dba: 'Cyberdyne' },
  4: { companyName: 'Oscorp', dba: 'Oscorp Industries' },
  5: { companyName: 'Tyrell Corporation', dba: 'Tyrell' },
};

const selectedAccountData = computed(() => {
  if (selectedAccount.value && companyData[selectedAccount.value]) {
    return companyData[selectedAccount.value];
  }
  return { companyName: '', dba: '' };
});

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
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.account-settings {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.tab-header {
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
  margin-bottom: $spacing-large;

  h3 {
    color: $color-primary;
    margin-bottom: 0;
  }
}

.form-row {
  display: flex;
  flex-direction: row;
  gap: $spacing-medium;
}
</style>
