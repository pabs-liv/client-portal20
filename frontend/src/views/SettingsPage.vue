
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
      variant="outlined"
    >
      <div class="account-settings">
        <Tabs :tabs="settingTabs" @tab-selected="handleTabSelected" />
        <div v-if="selectedAccount && activeTab === 'company-information'">
          <div class="general-information-container">
            <div class="tab-header">
              <div class="heading-and-button-wrapper">
                <h3 class="text-h3">General Information</h3>
                <Button v-if="!isEditingCompany" @click="isEditingCompany = true" label="Edit" variant="thirtiary" />
              </div>
              <p class="text-body">Keep company information up to date.</p>
            </div>
            <div class="form-row">
              <TextField
                label="Company name"
                :model-value="editableCompanyData.companyName"
                :readonly="!isEditingCompany"
                @update:model-value="updateCompanyField('companyName', $event)"
              />
              <TextField
                label="Doing business as"
                :model-value="editableCompanyData.dba"
                :readonly="!isEditingCompany"
                @update:model-value="updateCompanyField('dba', $event)"
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
                :model-value="editableCompanyData.notificationThreshold"
                @update:model-value="updateCompanyField('notificationThreshold', $event)"
                :readonly="!isEditingCompany"
                prefix="$"
              />
            </div>
          </div>
          <div v-if="isEditingCompany" class="form-actions">
            <v-btn :disabled="!isCompanyChanged" color="primary" @click="saveCompanyChanges">Save</v-btn>
            <v-btn variant="text" @click="cancelCompanyChanges">Cancel</v-btn>
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
              <div class="heading-and-button-wrapper">
                <h3 class="text-h3">Consolidated Appropriations Act Reporting</h3>
                <Button v-if="!isEditingCaa" @click="isEditingCaa = true" label="Edit" variant="thirtiary" />
              </div>
              <p class="text-body">DISCLAIMER: With the reporting option 2 (D3-D8), Liviniti will be providing and/or utilizing data for the time period that the Plan Sponsor is active with Liviniti. If Plan Sponsors utilized another PBM during any of the reporting period, the Plan Sponsor will need to coordinate with each PBM.</p>
            </div>
            <div class="benefit-details">
              <h3 class="text-h3">Benefit Details</h3>
              <div class="form-row">
                <TextField
                  label="Group health plan #"
                  :model-value="editableCaaData.groupHealthPlan"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('groupHealthPlan', $event)"
                />
                <TextField
                  label="Carve-out benefit"
                  :model-value="editableCaaData.carveOutBenefit"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('carveOutBenefit', $event)"
                />
                <TextField
                  label="Form 5500 plan #"
                  :model-value="editableCaaData.form5500Plan"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('form5500Plan', $event)"
                />
              </div>
              <div class="form-row">
                <Autocomplete
                  label="States"
                  :items="states"
                  multiple
                  :readonly="!isEditingCaa"
                  :model-value="editableCaaData.states"
                  @update:model-value="updateCaaField('states', $event)"
                ></Autocomplete>
              </div>
              <div class="form-row">
                <Autocomplete
                  label="Market segment"
                  :items="marketSegments"
                  :readonly="!isEditingCaa"
                  :model-value="editableCaaData.marketSegment"
                  @update:model-value="updateCaaField('marketSegment', $event)"
                ></Autocomplete>
              </div>
              <div class="form-row">
                <DatePicker
                  label="Plan year begin date"
                  :model-value="editableCaaData.planYearBeginDate"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('planYearBeginDate', $event)"
                />
                <DatePicker
                  label="Plan year end date"
                  :model-value="editableCaaData.planYearEndDate"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('planYearEndDate', $event)"
                />
              </div>
              <div class="form-row">
                <TextField
                  label="Members as of 12/31 of the reference year"
                  :model-value="editableCaaData.membersAsOf"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('membersAsOf', $event)"
                  hint="Report the number of members as of 12/31. Enter 0 if there aren’t any members."
                  persistent-hint
                />
              </div>
            </div>
            <div class="plan-sponsor-details">
              <h3 class="text-h3">Plan Sponsor Details</h3>
              <div class="form-row">
                <TextField
                  label="Plan sponsor name"
                  :model-value="editableCaaData.planSponsorLegalName"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('planSponsorLegalName', $event)"
                />
                <TextField
                  label="Plan Sponsor EIN"
                  :model-value="editableCaaData.planSponsorEin"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('planSponsorEin', $event)"
                />
              </div>
              <div class="form-row">
                <TextField
                  label="TPA name"
                  :model-value="editableCaaData.tpaName"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('tpaName', $event)"
                />
                <TextField
                  label="TPA EIN"
                  :model-value="editableCaaData.tpaEin"
                  :readonly="!isEditingCaa"
                  @update:model-value="updateCaaField('tpaEin', $event)"
                />
              </div>
            </div>
            <div v-if="isEditingCaa" class="form-actions">
              <v-btn :disabled="!isCaaChanged" color="primary" @click="saveCaaChanges">Save</v-btn>
              <v-btn variant="text" @click="cancelCaaChanges">Cancel</v-btn>
            </div>
          </div>
        </div>
        <div v-if="selectedAccount && activeTab === 'caa-gag-clause-attestation'">
          <div class="tab-header">
            <div class="heading-and-button-wrapper">
              <h3 class="text-h3">CAA Gag Clause Prohibition Compliance Attestation</h3>
              <Button v-if="!isEditingGagClause" @click="isEditingGagClause = true" label="Edit" variant="thirtiary" />
            </div>
          </div>
          <div class="CAA-config">
            <v-form>
              <div class="form-row">
                <div>
                  <p>Do you authorize Liviniti to submit the CAA Gag Clause Prohibition Compliance Attestation on your behalf?</p>
                  <p class="disclaimer">By selecting Yes, you authorize Liviniti to submit the CAA Gag Clause Prohibition Compliance Attestation on your behalf, for a charge of $250, for this calendar year.</p>
                </div>
              </div>
              <v-item-group v-model="editableGagClauseData.authorize" mandatory class="mt-small">
                <div class="form-row">
                  <v-item v-slot="{ isSelected, toggle }" value="yes">
                    <v-btn :color="isSelected ? 'primary' : ''" @click="toggle">Yes</v-btn>
                  </v-item>
                  <v-item v-slot="{ isSelected, toggle }" value="no">
                    <v-btn :color="isSelected ? 'primary' : ''" @click="toggle">No</v-btn>
                  </v-item>
                </div>
              </v-item-group>
              <div class="reporting-period">
                <h4 class="text-h4">Reporting Period</h4>
                <div class="form-row reporting-period-row">
                  <Select
                    label="Select period"
                    :items="periodOptions"
                    v-model="editableGagClauseData.reportingPeriod"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('reportingPeriod', $event)"
                  />
                  <DatePicker
                    label="Eff. start date - Starting coverage"
                    v-model="editableGagClauseData.effectiveStartDate"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('effectiveStartDate', $event)"
                  />
                  <DatePicker
                    label="Eff. end date - Starting coverage"
                    v-model="editableGagClauseData.effectiveEndDate"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('effectiveEndDate', $event)"
                  />
                </div>
              </div>
              <div v-if="isEditingGagClause" class="form-actions">
                <v-btn :disabled="!isGagClauseChanged" color="primary" @click="saveGagClauseChanges">Save</v-btn>
                <v-btn variant="text" @click="cancelGagClauseChanges">Cancel</v-btn>
              </div>
            </v-form>
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
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import { ref, computed, watch } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);

const companyData: { [key: number]: { companyName: string; dba: string; notificationThreshold: string; groupHealthPlan: string; carveOutBenefit: string; form5500Plan: string; states: string[]; marketSegment: string; planYearBeginDate: string; planYearEndDate: string; membersAsOf: string; planSponsorLegalName: string; planSponsorEin: string; tpaName: string; tpaEin: string; authorize: string | null; reportingPeriod: string | null; effectiveStartDate: string | null; effectiveEndDate: string | null } } = {
  1: { companyName: 'Stark Industries', dba: 'Stark Industries', notificationThreshold: '15000', groupHealthPlan: '12345678', carveOutBenefit: 'Pharmacy Only', form5500Plan: '501', states: ['CA', 'NY'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '257', planSponsorLegalName: 'Stark Industries Inc.', planSponsorEin: '12-3456789', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '12/31/2025' },
  2: { companyName: 'Wayne Enterprises', dba: 'Wayne Foundation', notificationThreshold: '25000', groupHealthPlan: '87654321', carveOutBenefit: 'Medical & Pharmacy', form5500Plan: '502', states: ['TX', 'FL'], marketSegment: 'Commercial Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '500', planSponsorLegalName: 'Wayne Enterprises LLC', planSponsorEin: '98-7654321', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '09/30/2024' },
  3: { companyName: 'Cyberdyne Systems', dba: 'Cyberdyne', notificationThreshold: '10000', groupHealthPlan: '11223344', carveOutBenefit: 'Pharmacy Only', form5500Plan: '503', states: ['IL', 'GA'], marketSegment: 'Government Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '100', planSponsorLegalName: 'Cyberdyne Systems Corp.', planSponsorEin: '11-2233445', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '01/31/2025' },
  4: { companyName: 'Oscorp', dba: 'Oscorp Industries', notificationThreshold: '20000', groupHealthPlan: '44332211', carveOutBenefit: 'Medical & Pharmacy', form5500Plan: '504', states: ['PA', 'OH'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '750', planSponsorLegalName: 'Oscorp Industries', planSponsorEin: '44-3322110', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '06/30/2025' },
  5: { companyName: 'Tyrell Corporation', dba: 'Tyrell', notificationThreshold: '30000', groupHealthPlan: '99887766', carveOutBenefit: 'Pharmacy Only', form5500Plan: '505', states: ['WA', 'OR'], marketSegment: 'Commercial Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '300', planSponsorLegalName: 'Tyrell Corporation', planSponsorEin: '99-8877665', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '03/31/2025' },
};

const selectedAccountData = computed(() => {
  if (selectedAccount.value && companyData[selectedAccount.value]) {
    return companyData[selectedAccount.value];
  }
  return { companyName: '', dba: '', notificationThreshold: '', groupHealthPlan: '', carveOutBenefit: '', form5500Plan: '', states: [], marketSegment: '', planYearBeginDate: '', planYearEndDate: '', membersAsOf: '', planSponsorLegalName: '', planSponsorEin: '', tpaName: '', tpaEin: '' };
});

const editableThreshold = ref('');
const isChanged = ref(false);
const showSnackbar = ref(false);

const isEditingCompany = ref(false);
const isCompanyChanged = ref(false);

const editableCompanyData = ref({
  companyName: '',
  dba: '',
  notificationThreshold: '',
});

const isEditingCaa = ref(false);
const isCaaChanged = ref(false);

const isEditingGagClause = ref(false);
const isGagClauseChanged = ref(false);

const editableGagClauseData = ref({
  authorize: null as string | null,
  reportingPeriod: 'plan-year' as string | null,
  effectiveStartDate: null as string | null,
  effectiveEndDate: null as string | null,
});

const editableCaaData = ref({
  groupHealthPlan: '',
  carveOutBenefit: '',
  form5500Plan: '',
  states: [],
  marketSegment: '',
  planYearBeginDate: '',
  planYearEndDate: '',
  membersAsOf: '',
  planSponsorLegalName: '',
  planSponsorEin: '',
  tpaName: '',
  tpaEin: '',
});

watch(selectedAccount, (newVal) => {
  if (newVal && companyData[newVal]) {
    editableThreshold.value = companyData[newVal].notificationThreshold;
    isChanged.value = false;
    // Initialize Company data
    editableCompanyData.value = {
      companyName: companyData[newVal].companyName,
      dba: companyData[newVal].dba,
      notificationThreshold: companyData[newVal].notificationThreshold,
    };
    isEditingCompany.value = false;
    isCompanyChanged.value = false;
    // Initialize CAA data
    editableCaaData.value = {
      groupHealthPlan: companyData[newVal].groupHealthPlan,
      carveOutBenefit: companyData[newVal].carveOutBenefit,
      form5500Plan: companyData[newVal].form5500Plan,
      states: companyData[newVal].states,
      marketSegment: companyData[newVal].marketSegment,
      planYearBeginDate: companyData[newVal].planYearBeginDate,
      planYearEndDate: companyData[newVal].planYearEndDate,
      membersAsOf: companyData[newVal].membersAsOf,
      planSponsorLegalName: companyData[newVal].planSponsorLegalName,
      planSponsorEin: companyData[newVal].planSponsorEin,
      tpaName: companyData[newVal].tpaName,
      tpaEin: companyData[newVal].tpaEin,
    };
    isEditingCaa.value = false;
    isCaaChanged.value = false;
    // Initialize Gag Clause data
    editableGagClauseData.value = { authorize: companyData[newVal].authorize, reportingPeriod: companyData[newVal].reportingPeriod, effectiveStartDate: companyData[newVal].effectiveStartDate, effectiveEndDate: companyData[newVal].effectiveEndDate };
    isEditingGagClause.value = false;
    isGagClauseChanged.value = false;
  } else {
    editableThreshold.value = '';
    isChanged.value = false;
    // Reset Company data
    editableCompanyData.value = {
      companyName: '',
      dba: '',
      notificationThreshold: '',
    };
    isEditingCompany.value = false;
    isCompanyChanged.value = false;
    // Reset CAA data
    editableCaaData.value = {
      groupHealthPlan: '',
      carveOutBenefit: '',
      form5500Plan: '',
      states: [],
      marketSegment: '',
      planYearBeginDate: '',
      planYearEndDate: '',
      membersAsOf: '',
      planSponsorLegalName: '',
      planSponsorEin: '',
      tpaName: '',
      tpaEin: '',
    };
    isEditingCaa.value = false;
    isCaaChanged.value = false;
    // Reset Gag Clause data
    editableGagClauseData.value = { authorize: null, reportingPeriod: null, effectiveStartDate: null, effectiveEndDate: null };
    isEditingGagClause.value = false;
    isGagClauseChanged.value = false;
  }
}, { immediate: true });

const updateThreshold = (newValue: string) => {
  editableThreshold.value = newValue;
  isChanged.value = true;
};

const updateCompanyField = (field: string, value: any) => {
  (editableCompanyData.value as any)[field] = value;
  isCompanyChanged.value = true;
};

const updateCaaField = (field: string, value: any) => {
  (editableCaaData.value as any)[field] = value;
  isCaaChanged.value = true;
};

const updateGagClauseField = (field: string, value: any) => {
  (editableGagClauseData.value as any)[field] = value;
  isGagClauseChanged.value = true;
};

const saveCompanyChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCompanyData.value);
    isCompanyChanged.value = false;
    isEditingCompany.value = false;
    showSnackbar.value = true;
  }
};

const saveCaaChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCaaData.value);
    isCaaChanged.value = false;
    isEditingCaa.value = false;
    showSnackbar.value = true;
  }
};

const saveGagClauseChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableGagClauseData.value);
    isGagClauseChanged.value = false;
    isEditingGagClause.value = false;
    showSnackbar.value = true;
  }
};

const cancelCompanyChanges = () => {
  if (selectedAccount.value) {
    editableCompanyData.value = {
      companyName: companyData[selectedAccount.value].companyName,
      dba: companyData[selectedAccount.value].dba,
      notificationThreshold: companyData[selectedAccount.value].notificationThreshold,
    };
    isCompanyChanged.value = false;
    isEditingCompany.value = false;
  }
};

const cancelCaaChanges = () => {
  if (selectedAccount.value) {
    editableCaaData.value = { ...companyData[selectedAccount.value] };
    isCaaChanged.value = false;
    isEditingCaa.value = false;
  }
};

const cancelGagClauseChanges = () => {
  if (selectedAccount.value) {
    editableGagClauseData.value = {
      authorize: companyData[selectedAccount.value].authorize,
      reportingPeriod: companyData[selectedAccount.value].reportingPeriod,
      effectiveStartDate: companyData[selectedAccount.value].effectiveStartDate,
      effectiveEndDate: companyData[selectedAccount.value].effectiveEndDate,
    };
    isGagClauseChanged.value = false;
    isEditingGagClause.value = false;
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

const periodOptions = ref([
  { title: 'Plan year', value: 'plan-year' },
  { title: 'Benefit period', value: 'benefit-period' },
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
  max-width: 500px;
  
}

.caa-settings {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;

  .tab-header {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
    margin-bottom: $spacing-large;

    h3 {
      margin-bottom: 0;
    }

    p {
      flex-basis: 100%;
    }
  }
}

.benefit-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-medium;
  max-width: 500px;
  margin-bottom: $spacing-large;

  
}

.plan-sponsor-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-medium;
  max-width: 500px;
  margin-bottom: $spacing-large;
}

.CAA-config {
  .form-row {
    .v-select {
      .v-field {
        flex-grow: 1;
        width: 100%;
      }
    }

    .v-input {
      flex-grow: 1;
      width: 100%;
      min-width: 0;
    }
  }

  }
  

  .reporting-period {
    display: flex;
    flex-direction: column;
    gap: $spacing-large;
    margin-top: $spacing-xlarge;
  }

  .reporting-period-row {
    & > * {
      flex: 1;
    }
  }


</style>
