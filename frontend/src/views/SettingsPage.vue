
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
              <div class="report-entity-details">
                <h4 class="text-h4">Reporting Entity Details</h4>
                <div class="form-row">
                  <TextField
                    label="Reporting entitiy type"
                    :model-value="editableGagClauseData.reportingEntityType"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('reportingEntityType', $event)"
                  />
                  <TextField
                    label="Report entity name"
                    :model-value="editableGagClauseData.reportingEntityName"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('reportingEntityName', $event)"
                  />
                  <TextField
                    label="Employer identification number (EIN)"
                    :model-value="editableGagClauseData.reportingEntityEin"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('reportingEntityEin', $event)"
                  />
                </div>
                <div class="form-row">
                  <Select
                    label="Attestation agreement"
                    :items="attestationAgreements"
                    v-model="editableGagClauseData.attestationAgreement"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('attestationAgreement', $event)"
                  />
                  <Select
                    label="Agreement types"
                    :items="agreementTypes"
                    v-model="editableGagClauseData.agreementTypes"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('agreementTypes', $event)"
                  />
                </div>
              </div>
              <div class="reporting-entity-mailing-address">
                <h4 class="text-h4">Reporting Entity Mailing Address</h4>
                <div class="form-row">
                  <TextField
                    label="Reporting entity mailing address 1"
                    :model-value="editableGagClauseData.mailingAddress1"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('mailingAddress1', $event)"
                  />
                  <TextField
                    label="Reporting entity mailing address 2"
                    :model-value="editableGagClauseData.mailingAddress2"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('mailingAddress2', $event)"
                  />
                </div>
                <div class="form-row">
                  <TextField
                    label="City"
                    :model-value="editableGagClauseData.city"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('city', $event)"
                  />
                  <Select
                    label="State"
                    :items="states"
                    v-model="editableGagClauseData.mailingState"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('mailingState', $event)"
                  />
                  <TextField
                    label="Zip code"
                    :model-value="editableGagClauseData.zipCode"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('zipCode', $event)"
                  />
                </div>
              </div>
              <div class="reporting-primary-contacts">
                <h4 class="text-h4">Reporting Primary Contact</h4>
                <div class="form-row">
                  <TextField
                    label="First name"
                    :model-value="editableGagClauseData.contactFirstName"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('contactFirstName', $event)"
                  />
                  <TextField
                    label="Last name"
                    :model-value="editableGagClauseData.contactLastName"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('contactLastName', $event)"
                  />
                </div>
                <div class="form-row">
                  <TextField
                    label="Email"
                    :model-value="editableGagClauseData.contactEmail"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('contactEmail', $event)"
                  />
                  <TextField
                    label="Phone number"
                    :model-value="editableGagClauseData.contactPhoneNumber"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('contactPhoneNumber', $event)"
                  />
                </div>
              </div>
              <div class="billing-contact">
                <h4 class="text-h4">Billing Contact</h4>
                <div class="form-row">
                  <TextField
                    label="Organization"
                    :model-value="editableGagClauseData.billingOrganization"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('billingOrganization', $event)"
                  />
                  <TextField
                    label="First name"
                    :model-value="editableGagClauseData.billingFirstName"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('billingFirstName', $event)"
                  />
                  <TextField
                    label="Last name"
                    :model-value="editableGagClauseData.billingLastName"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('billingLastName', $event)"
                  />
                </div>
                <div class="form-row">
                  <TextField
                    label="Email"
                    :model-value="editableGagClauseData.billingEmail"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('billingEmail', $event)"
                  />
                  <TextField
                    label="Phone number"
                    :model-value="editableGagClauseData.billingPhoneNumber"
                    :readonly="!isEditingGagClause"
                    @update:model-value="updateGagClauseField('billingPhoneNumber', $event)"
                  />
                </div>
              </div>
              <div class="disclaimer-box">
                <p>In connection with this service provided by Liviniti to Client, Client hereby acknowledges and affirms its agreements/obligations, including the following:</p>
                <ul>
                  <li>Client shall timely pay Liviniti two-hundred and fifty dollars ($250) for submitting the Federal Gag Clause Prohibition Compliance Attestation on Client’s behalf.</li>
                  <li>Client shall indemnify and hold harmless Liviniti for any and all damages resulting directly or indirectly from the following:</li>
                  <ul>
                    <li>Fees, penalties, costs, fines, assessed by CMS and/or the federal government related to the submission of the Federal Gag Clause Prohibition Compliance Attestation that are attributed to Client’s actions.</li>
                    <li>Damages related to inaccurate or incomplete information provided by Client to Liviniti.</li>
                    <li>Damages related to a late or incomplete submission that is caused by Client.</li>
                    <li>Damages related to any action taken by Liviniti at the direction of Client.</li>
                    <li>Any other costs or expenses associated with these services.</li>
                  </ul>
                </ul>
              </div>
              <div class="electronic-signature">
                <h4 class="text-h4">Electronic Signature</h4>
                <Banner
                  variant="info"
                  message="Each individual signing this form represents and warrants that he/she is signing with full and complete authority to bind the party on whose behalf he/she is signing with respect to the matters contained herein."
                />
                <TextField
                  label="e-Signature"
                  :model-value="editableGagClauseData.eSignature"
                  :readonly="!isEditingGagClause"
                  @update:model-value="updateGagClauseField('eSignature', $event)"
                />
              </div>
              <div v-if="isEditingGagClause" class="form-actions">
                <v-btn :disabled="!isGagClauseChanged" color="primary" @click="saveGagClauseChanges">Save</v-btn>
                <v-btn variant="text" @click="cancelGagClauseChanges">Cancel</v-btn>
              </div>
            </v-form>
          </div>
        </div>
        <div v-if="selectedAccount && activeTab === 'claim-edit-rules'">
          <ReportDataTable
            :headers="claimEditRulesHeaders"
            :items="claimEditRulesData"
            :show-search-bar="true"
            :show-filter-button="false"
            search-placeholder="Search rules"
            :show-row-actions="true"
            :show-table-footer="true"
            :show-selection-checkboxes="false"
          >
            <template v-slot:item.ruleChangeLog="{ item }">
              <span class="link" @click="openChangeLogDialog(item)">View Log</span>
            </template>
          </ReportDataTable>
        </div>
      </div>
    </AccountSelector>
    <v-snackbar v-model="showSnackbar" :timeout="3000" color="success">
      Settings saved successfully!
    </v-snackbar>

    <Dialog
      :model-value="showChangeLogDialog"
      @update:model-value="showChangeLogDialog = $event"
      heading="Change Log Details"
      :actions="[
        { text: 'Cancel', onClick: () => showChangeLogDialog = false, styleType: 'secondary' },
        { text: 'Done', onClick: () => showChangeLogDialog = false, styleType: 'primary' }
      ]"
      :show-secondary-button="false"
    >
      <ReportDataTable
        :headers="changeLogTableHeaders"
        :items="currentChangeLogData"
        :show-search-bar="false"
        :show-filter-button="false"
        :show-row-actions="false"
        :show-table-footer="false"
        :show-selection-checkboxes="false"
      />
    </Dialog>
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
import Banner from '@/components/common/Banner.vue';
import Dialog from '@/components/ui/Dialog.vue';
import { ref, computed, watch } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);

interface CompanyData {
  companyName: string;
  dba: string;
  notificationThreshold: string;
  groupHealthPlan: string;
  carveOutBenefit: string;
  form5500Plan: string;
  states: string[];
  marketSegment: string;
  planYearBeginDate: string;
  planYearEndDate: string;
  membersAsOf: string;
  planSponsorLegalName: string;
  planSponsorEin: string;
  tpaName: string;
  tpaEin: string;
  authorize: string | null;
  reportingPeriod: string | null;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
  reportingEntityType: string;
  reportingEntityName: string;
  reportingEntityEin: string;
  attestationAgreement: string;
  agreementTypes: string;
  mailingAddress1: string;
  mailingAddress2: string;
  city: string;
  mailingState: string;
  zipCode: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  billingOrganization: string;
  billingFirstName: string;
  billingLastName: string;
  billingEmail: string;
  billingPhoneNumber: string;
  eSignature: string;
}

const companyData: { [key: number]: CompanyData } = {
  1: { companyName: 'Stark Industries', dba: 'Stark Industries', notificationThreshold: '15000', groupHealthPlan: '12345678', carveOutBenefit: 'Pharmacy Only', form5500Plan: '501', states: ['CA', 'NY'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '257', planSponsorLegalName: 'Stark Industries Inc.', planSponsorEin: '12-3456789', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '12/31/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Stark Industries Inc.', reportingEntityEin: '12-3456789', attestationAgreement: 'Agreement A', agreementTypes: 'Type 1', mailingAddress1: '10880 Malibu Point', mailingAddress2: '', city: 'Malibu', mailingState: 'CA', zipCode: '90265', contactFirstName: 'Tony', contactLastName: 'Stark', contactEmail: 'tony.stark@starkindustries.com', contactPhoneNumber: '555-123-4567', billingOrganization: 'Stark Industries', billingFirstName: 'Pepper', billingLastName: 'Potts', billingEmail: 'pepper.potts@starkindustries.com', billingPhoneNumber: '555-987-6543', eSignature: 'Tony Stark' },
  2: { companyName: 'Wayne Enterprises', dba: 'Wayne Foundation', notificationThreshold: '25000', groupHealthPlan: '87654321', carveOutBenefit: 'Medical & Pharmacy', form5500Plan: '502', states: ['TX', 'FL'], marketSegment: 'Commercial Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '500', planSponsorLegalName: 'Wayne Enterprises LLC', planSponsorEin: '98-7654321', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '09/30/2024', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Wayne Enterprises LLC', reportingEntityEin: '98-7654321', attestationAgreement: 'Agreement B', agreementTypes: 'Type 2', mailingAddress1: '1007 Mountain Drive', mailingAddress2: '', city: 'Gotham', mailingState: 'NY', zipCode: '10001', contactFirstName: 'Bruce', contactLastName: 'Wayne', contactEmail: 'bruce.wayne@wayneenterprises.com', contactPhoneNumber: '555-234-5678', billingOrganization: 'Wayne Enterprises', billingFirstName: 'Alfred', billingLastName: 'Pennyworth', billingEmail: 'alfred.pennyworth@wayneenterprises.com', billingPhoneNumber: '555-876-5432', eSignature: 'Bruce Wayne' },
  3: { companyName: 'Cyberdyne Systems', dba: 'Cyberdyne', notificationThreshold: '10000', groupHealthPlan: '11223344', carveOutBenefit: 'Pharmacy Only', form5500Plan: '503', states: ['IL', 'GA'], marketSegment: 'Government Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '100', planSponsorLegalName: 'Cyberdyne Systems Corp.', planSponsorEin: '11-2233445', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '01/31/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Cyberdyne Systems Corp.', reportingEntityEin: '11-2233445', attestationAgreement: 'Agreement C', agreementTypes: 'Type 3', mailingAddress1: '21440 Chase Dr', mailingAddress2: '', city: 'Fremont', mailingState: 'CA', zipCode: '94539', contactFirstName: 'Miles', contactLastName: 'Dyson', contactEmail: 'miles.dyson@cyberdyne.com', contactPhoneNumber: '555-345-6789', billingOrganization: 'Cyberdyne Systems', billingFirstName: 'Sarah', billingLastName: 'Connor', billingEmail: 'sarah.connor@cyberdyne.com', billingPhoneNumber: '555-765-4321', eSignature: 'Miles Dyson' },
  4: { companyName: 'Oscorp', dba: 'Oscorp Industries', notificationThreshold: '20000', groupHealthPlan: '44332211', carveOutBenefit: 'Medical & Pharmacy', form5500Plan: '504', states: ['PA', 'OH'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '750', planSponsorLegalName: 'Oscorp Industries', planSponsorEin: '44-3322110', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '06/30/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Oscorp Industries', reportingEntityEin: '44-3322110', attestationAgreement: 'Agreement D', agreementTypes: 'Type 4', mailingAddress1: '200 Park Ave', mailingAddress2: '', city: 'New York', mailingState: 'NY', zipCode: '10166', contactFirstName: 'Norman', contactLastName: 'Osborn', contactEmail: 'norman.osborn@oscorp.com', contactPhoneNumber: '555-456-7890', billingOrganization: 'Oscorp', billingFirstName: 'Harry', billingLastName: 'Osborn', billingEmail: 'harry.osborn@oscorp.com', billingPhoneNumber: '555-654-3210', eSignature: 'Norman Osborn' },
  5: { companyName: 'Tyrell Corporation', dba: 'Tyrell', notificationThreshold: '30000', groupHealthPlan: '99887766', carveOutBenefit: 'Pharmacy Only', form5500Plan: '505', states: ['WA', 'OR'], marketSegment: 'Commercial Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '300', planSponsorLegalName: 'Tyrell Corporation', planSponsorEin: '99-8877665', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '03/31/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Tyrell Corporation', reportingEntityEin: '99-8877665', attestationAgreement: 'Agreement E', agreementTypes: 'Type 5', mailingAddress1: '1238 W 6th St', mailingAddress2: '', city: 'Los Angeles', mailingState: 'CA', zipCode: '90017', contactFirstName: 'Eldon', contactLastName: 'Tyrell', contactEmail: 'eldon.tyrell@tyrell.com', contactPhoneNumber: '555-567-8901', billingOrganization: 'Tyrell Corporation', billingFirstName: 'Rachael', billingLastName: 'Tyrell', billingEmail: 'rachael.tyrell@tyrell.com', billingPhoneNumber: '555-543-2109', eSignature: 'Eldon Tyrell' },
};

const selectedAccountData = computed<CompanyData>(() => {
  if (selectedAccount.value && companyData[selectedAccount.value]) {
    return companyData[selectedAccount.value];
  }
  return {
    companyName: '',
    dba: '',
    notificationThreshold: '',
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
    authorize: null,
    reportingPeriod: null,
    effectiveStartDate: null,
    effectiveEndDate: null,
    reportingEntityType: '',
    reportingEntityName: '',
    reportingEntityEin: '',
    attestationAgreement: '',
    agreementTypes: '',
    mailingAddress1: '',
    mailingAddress2: '',
    city: '',
    mailingState: '',
    zipCode: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhoneNumber: '',
    billingOrganization: '',
    billingFirstName: '',
    billingLastName: '',
    billingEmail: '',
    billingPhoneNumber: '',
    eSignature: '',
  };
});

const showSnackbar = ref(false);

const isEditingCompany = ref(false);
const isCompanyChanged = ref(false);

const editableCompanyData = ref<Partial<CompanyData>>({
  companyName: '',
  dba: '',
  notificationThreshold: '',
});

const isEditingCaa = ref(false);
const isCaaChanged = ref(false);

const isEditingGagClause = ref(false);
const isGagClauseChanged = ref(false);

const editableGagClauseData = ref<Partial<CompanyData>>({
  authorize: null,
  reportingPeriod: 'plan-year',
  effectiveStartDate: null,
  effectiveEndDate: null,
  reportingEntityType: '',
  reportingEntityName: '',
  reportingEntityEin: '',
  attestationAgreement: '',
  agreementTypes: '',
  mailingAddress1: '',
  mailingAddress2: '',
  city: '',
  mailingState: '',
  zipCode: '',
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhoneNumber: '',
  billingOrganization: '',
  billingFirstName: '',
  billingLastName: '',
  billingEmail: '',
  billingPhoneNumber: '',
  eSignature: '',
});

const showChangeLogDialog = ref(false);
const currentChangeLogData = ref<any>(null);

const openChangeLogDialog = (item: any) => {
  currentChangeLogData.value = item.changeLogDetails;
  showChangeLogDialog.value = true;
};

const editableCaaData = ref<Partial<CompanyData>>({
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
    editableGagClauseData.value = {
      authorize: companyData[newVal].authorize,
      reportingPeriod: companyData[newVal].reportingPeriod,
      effectiveStartDate: companyData[newVal].effectiveStartDate,
      effectiveEndDate: companyData[newVal].effectiveEndDate,
      reportingEntityType: companyData[newVal].reportingEntityType,
      reportingEntityName: companyData[newVal].reportingEntityName,
      reportingEntityEin: companyData[newVal].reportingEntityEin,
      attestationAgreement: companyData[newVal].attestationAgreement,
      agreementTypes: companyData[newVal].agreementTypes,
      mailingAddress1: companyData[newVal].mailingAddress1,
      mailingAddress2: companyData[newVal].mailingAddress2,
      city: companyData[newVal].city,
      mailingState: companyData[newVal].mailingState,
      zipCode: companyData[newVal].zipCode,
      contactFirstName: companyData[newVal].contactFirstName,
      contactLastName: companyData[newVal].contactLastName,
      contactEmail: companyData[newVal].contactEmail,
      contactPhoneNumber: companyData[newVal].contactPhoneNumber,
      billingOrganization: companyData[newVal].billingOrganization,
      billingFirstName: companyData[newVal].billingFirstName,
      billingLastName: companyData[newVal].billingLastName,
      billingEmail: companyData[newVal].billingEmail,
      billingPhoneNumber: companyData[newVal].billingPhoneNumber,
      eSignature: companyData[newVal].eSignature,
    };
    isEditingGagClause.value = false;
    isGagClauseChanged.value = false;
  } else {
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
    editableGagClauseData.value = {
      authorize: null,
      reportingPeriod: null,
      effectiveStartDate: null,
      effectiveEndDate: null,
      reportingEntityType: '',
      reportingEntityName: '',
      reportingEntityEin: '',
      attestationAgreement: '',
      agreementTypes: '',
      mailingAddress1: '',
      mailingAddress2: '',
      city: '',
      mailingState: '',
      zipCode: '',
      contactFirstName: '',
      contactLastName: '',
      contactEmail: '',
      contactPhoneNumber: '',
      billingOrganization: '',
      billingFirstName: '',
      billingLastName: '',
      billingEmail: '',
      billingPhoneNumber: '',
      eSignature: '',
    };
    isEditingGagClause.value = false;
    isGagClauseChanged.value = false;
  }
}, { immediate: true });

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
    editableCaaData.value = JSON.parse(JSON.stringify(companyData[selectedAccount.value]));
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
      reportingEntityType: companyData[selectedAccount.value].reportingEntityType,
      reportingEntityName: companyData[selectedAccount.value].reportingEntityName,
      reportingEntityEin: companyData[selectedAccount.value].reportingEntityEin,
      attestationAgreement: companyData[selectedAccount.value].attestationAgreement,
      agreementTypes: companyData[selectedAccount.value].agreementTypes,
      mailingAddress1: companyData[selectedAccount.value].mailingAddress1,
      mailingAddress2: companyData[selectedAccount.value].mailingAddress2,
      city: companyData[selectedAccount.value].city,
      mailingState: companyData[selectedAccount.value].mailingState,
      zipCode: companyData[selectedAccount.value].zipCode,
      contactFirstName: companyData[selectedAccount.value].contactFirstName,
      contactLastName: companyData[selectedAccount.value].contactLastName,
      contactEmail: companyData[selectedAccount.value].contactEmail,
      contactPhoneNumber: companyData[selectedAccount.value].contactPhoneNumber,
      billingOrganization: companyData[selectedAccount.value].billingOrganization,
      billingFirstName: companyData[selectedAccount.value].billingFirstName,
      billingLastName: companyData[selectedAccount.value].billingLastName,
      billingEmail: companyData[selectedAccount.value].billingEmail,
      billingPhoneNumber: companyData[selectedAccount.value].billingPhoneNumber,
      eSignature: companyData[selectedAccount.value].eSignature,
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
  { label: 'Claim Edit Rules', key: 'claim-edit-rules' },
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
  { title: 'Quarterly', value: 'quarterly' },
  { title: 'Monthly', value: 'monthly' },
]);

const attestationAgreements = ref([
  'Agreement A',
  'Agreement B',
  'Agreement C',
]);

const agreementTypes = ref([
  'Type 1',
  'Type 2',
  'Type 3',
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

const claimEditRulesHeaders = ref([
  { title: 'Rule Name', key: 'ruleName' },
  { title: 'Rule Status', key: 'ruleStatus' },
  { title: 'Rule Action', key: 'ruleAction' },
  { title: 'Change Log', key: 'ruleChangeLog' },
]);

const claimEditRulesData = ref([
  {
    ruleName: 'Rule 1',
    ruleStatus: 'Active',
    ruleAction: 'Approve',
    ruleChangeLog: 'View Log',
    changeLogDetails: [
      { change: 'Created', changeDescription: 'Initial rule creation', editedBy: 'John Doe', editDate: '2023-01-01' },
      { change: 'Modified', changeDescription: 'Updated rule criteria', editedBy: 'Jane Smith', editDate: '2023-03-15' },
    ],
  },
  {
    ruleName: 'Rule 2',
    ruleStatus: 'Inactive',
    ruleAction: 'Deny',
    ruleChangeLog: 'View Log',
    changeLogDetails: [
      { change: 'Created', changeDescription: 'Initial rule creation', editedBy: 'Jane Smith', editDate: '2022-11-01' },
      { change: 'Modified', changeDescription: 'Deactivated rule', editedBy: 'John Doe', editDate: '2023-02-20' },
    ],
  },
]);

const changeLogTableHeaders = ref([
  { title: 'Change', key: 'change' },
  { title: 'Change Description', key: 'changeDescription' },
  { title: 'Edited By', key: 'editedBy' },
  { title: 'Edit Date', key: 'editDate' },
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

  .report-entity-details {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    margin-top: $spacing-xlarge;
  }

  .reporting-entity-mailing-address {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    margin-top: $spacing-xlarge;
  }

  .reporting-primary-contacts {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    margin-top: $spacing-xlarge;
  }

  .billing-contact {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    margin-top: $spacing-xlarge;
  }

  .disclaimer-box {
    border: 1px solid $color-primary;
    border-radius: $spacing-nano;
    padding: $spacing-medium;
    margin-top: $spacing-xlarge;
    background-color: $color-information-background;

    p,
    ul {
      font-size: $font-size-small;
      color: $color-text-primary;
    }

    ul {
      padding-left: $spacing-medium;
    }
  }

  .electronic-signature {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    margin-top: $spacing-xlarge;
  }

.link {
  color: $color-link;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

</style>
