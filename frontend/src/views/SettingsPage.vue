
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
            <h3 class="text-h3">Consolidated Appropriations Act Reporting</h3>

            <!-- Widget 1: Reporting Option -->
            <div class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Reporting Option</h4>
                <Button v-if="!isEditingCaaOption" @click="isEditingCaaOption = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingCaaOption">
                <div v-if="caaOptionSelected" class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Liviniti will support our Plan Sponsors with the following offerings</span>
                      <span class="ap-field-value">{{ editableCaaData.planSponsorOptions || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Reporting period</span>
                      <span class="ap-field-value">{{ editableCaaData.reportingPeriodOccurance || '—' }}</span>
                    </div>
                  </div>
                  <div v-if="caaIsOption2" class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Fee of $500 per reporting period</span>
                      <span class="ap-field-value">Acknowledged: {{ editableCaaData.option2Acknowledged ? 'Yes' : 'No' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Legal terms</span>
                      <span class="ap-field-value">Acknowledged: {{ editableCaaData.legalAcknowledged ? 'Yes' : 'No' }}</span>
                    </div>
                  </div>
                </div>
                <p v-else class="caa-no-option">No reporting option selected.</p>
              </template>
              <template v-else>
                <div class="ap-fields">
                <div class="caa-option-section">
                  <Autocomplete
                    label="Liviniti will support our Plan Sponsors with the following offerings:"
                    :items="planSponsorOptionsList"
                    :model-value="editableCaaData.planSponsorOptions"
                    @update:model-value="updateCaaField('planSponsorOptions', $event)"
                  />
                </div>
                <div v-if="caaOptionSelected" class="caa-disclaimer-callout">
                  <p>DISCLAIMER: Under either option above, Liviniti will be providing and/or utilizing data for the time period that the Plan Sponsor is active with Liviniti. If Plan Sponsors utilized another PBM during any of the reporting period, the Plan Sponsor will need to coordinate with each PBM.</p>
                </div>
                <div v-if="caaOptionSelected" class="caa-option-section">
                  <Autocomplete
                    label="Reporting period"
                    :items="reportingPeriodOptions"
                    :model-value="editableCaaData.reportingPeriodOccurance"
                    @update:model-value="updateCaaField('reportingPeriodOccurance', $event)"
                    style="max-width: 420px"
                  />
                </div>
                <div v-if="caaIsOption2" class="caa-fee-ack">
                  <p class="caa-fee-ack__notice">You acknowledge that a fee of $500 will be charged per reporting period.</p>
                  <label class="caa-checkbox-label">
                    <input
                      type="checkbox"
                      :checked="editableCaaData.option2Acknowledged"
                      @change="updateCaaField('option2Acknowledged', ($event.target as HTMLInputElement).checked)"
                    />
                    I Accept
                  </label>
                </div>
                <div v-if="caaIsOption1" class="caa-legal-text">
                  <p>The D3-D8 Reports and the PBM portion of the narrative will be available to the Plan Sponsor and/or a designated party via the Liviniti client portal in advance of June 1st. Liviniti will be providing these files in the format required for submission to CMS and at no cost to Plan Sponsors. Liviniti will be providing this data at the plan level. Liviniti will not submit data to CMS on behalf of the Plan Sponsor under this option.</p>
                  <p>Plan Sponsors and/or their representatives must consult with their legal counsel as to the application of any particular law or regulation to their health plan. The information provided does not, and is not intended to, constitute legal advice. All information is for general informational purposes only. The following constitutes Liviniti's interpretation only and should not be relied upon without independent legal consultation. Only a party's individual attorney can provide assurances that the information contained herein - and your interpretation of it - is applicable or appropriate to your particular situation. All liability with respect to actions taken or not taken based on the contents of this site are hereby expressly disclaimed. The content on this communication is provided "as is;" no representations are made that the content is error-free, or that it has been updated to reflect any subsequent changes to the law or the various applicability dates. Plan Sponsors are solely responsible for complying with the reporting and filing deadlines under the Consolidated Appropriations Act as it relates to their health plan. THIS DOES NOT CONSTITUTE LEGAL ADVICE.</p>
                </div>
                <div v-if="caaIsOption2" class="caa-legal-text">
                  <p>Liviniti will submit a P2 file, D3-D8 files and the PBM portion of the narrative response outlined below to CMS in advance of the deadline. In order to elect this option, Plan Sponsors must submit all requested information to Liviniti by April 30, 2027 via the client portal. There will be a fee of $500 per reporting year for this option. If the requested information is not received by April 30, 2027 the files will be available via the client portal and submission is not an available option.</p>
                  <p>Customer, as Plan Sponsor, is required to submit certain prescription drug reporting data to CMS on an annual basis pursuant to the Consolidated Appropriations Act ("CAA"). Customer requests that Liviniti compile and submit the prescription drug reporting portion of the required data directly to CMS on the Customer's behalf. In connection with this service provided by Liviniti to Customer, Customer hereby acknowledges and affirms its agreements/obligations, including but not limited to the following:</p>
                  <p>Customer shall provide Liviniti with all requested information by April 30, 2027 to ensure a timely submission to CMS.</p>
                  <p>Customer acknowledges that Liviniti may utilize a third-party vendor(s) in connection with these services. Customer grants Liviniti permission to provide any and all data required for submission to CMS to such third-party vendor(s) in connection with these services.</p>
                  <p>Customer acknowledges that Liviniti agrees to submit Liviniti-specific prescription drug reporting data for the time period that Customer is active with Liviniti. Liviniti is under no obligation to coordinate with additional vendors/PBMs in connection with this reporting.</p>
                  <p>Customer shall indemnify and hold harmless Liviniti for any and all damages resulting directly or indirectly from the following:</p>
                  <ul>
                    <li>Fees, penalties, costs, fines, assessed by CMS and/or the federal government related to the submission of Customer's data to CMS</li>
                    <li>Damages related to inaccurate or incomplete information provided by Customer to Liviniti</li>
                    <li>Damages related to a late or incomplete submission that is caused by Customer</li>
                    <li>Damages related to any action taken by Liviniti at the direction of the Customer</li>
                    <li>Any other costs or expenses associated with these services</li>
                  </ul>
                  <p>Customer hereby acknowledges its understanding and agreement of the above.</p>
                  <label class="caa-checkbox-label">
                    <input
                      type="checkbox"
                      :checked="editableCaaData.legalAcknowledged"
                      @change="updateCaaField('legalAcknowledged', ($event.target as HTMLInputElement).checked)"
                    />
                    I acknowledge my understanding and agreement of the above.
                  </label>
                </div>
                </div>
                <div class="ap-section-footer">
                  <Button
                    variant="primary"
                    label="Save Changes"
                    :disabled="caaIsOption2 && (!editableCaaData.option2Acknowledged || !editableCaaData.legalAcknowledged)"
                    @click="saveCaaOptionChanges"
                  />
                  <Button variant="secondary" label="Cancel" @click="cancelCaaOptionChanges" />
                </div>
              </template>
            </div>

            <!-- Widget 2: Benefit Details -->
            <div class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Benefit Details</h4>
                <Button v-if="!isEditingBenefitDetails" @click="isEditingBenefitDetails = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingBenefitDetails">
                <div class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Group health plan name</span>
                      <span class="ap-field-value">{{ editableCaaData.groupHealthPlanName || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Group health plan #</span>
                      <span class="ap-field-value">{{ editableCaaData.groupHealthPlan || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Carve-out benefit</span>
                      <span class="ap-field-value">{{ editableCaaData.carveOutBenefit || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Form 5500 plan #</span>
                      <span class="ap-field-value">{{ editableCaaData.form5500Plan || '—' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">States</span>
                      <span class="ap-field-value">{{ editableCaaData.states && editableCaaData.states.length ? editableCaaData.states.join(', ') : '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Market segment</span>
                      <span class="ap-field-value">{{ editableCaaData.marketSegment || '—' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Plan year begin date</span>
                      <span class="ap-field-value">{{ editableCaaData.planYearBeginDate || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Plan year end date</span>
                      <span class="ap-field-value">{{ editableCaaData.planYearEndDate || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Members as of 12/31 of the reference year</span>
                      <span class="ap-field-value">{{ editableCaaData.membersAsOf || '—' }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="caa-form-grid">
                  <TextField
                    label="Group health plan name"
                    :model-value="editableCaaData.groupHealthPlanName"
                    @update:model-value="updateCaaField('groupHealthPlanName', $event)"
                  />
                  <TextField
                    label="Group health plan #"
                    :model-value="editableCaaData.groupHealthPlan"
                    @update:model-value="updateCaaField('groupHealthPlan', $event)"
                  />
                  <Autocomplete
                    label="Carve-out benefit"
                    :items="carveOutBenefits"
                    :model-value="editableCaaData.carveOutBenefit"
                    @update:model-value="updateCaaField('carveOutBenefit', $event)"
                  />
                  <TextField
                    label="Form 5500 plan #"
                    :model-value="editableCaaData.form5500Plan"
                    @update:model-value="updateCaaField('form5500Plan', $event)"
                  />
                  <div class="caa-form-grid__span2">
                    <Autocomplete
                      label="States"
                      :items="states"
                      multiple
                      :model-value="editableCaaData.states"
                      @update:model-value="updateCaaField('states', $event)"
                    />
                  </div>
                  <div class="caa-field-with-hint">
                    <Autocomplete
                      label="Market segment"
                      :items="marketSegments"
                      :model-value="editableCaaData.marketSegment"
                      @update:model-value="updateCaaField('marketSegment', $event)"
                      hide-details
                    />
                    <p class="caa-field-hint">Small is <strong>50 or fewer</strong> employees &nbsp;|&nbsp; Large is <strong>51 or more</strong> employees</p>
                  </div>
                  <DatePicker
                    label="Plan year begin date"
                    :model-value="editableCaaData.planYearBeginDate"
                    @update:model-value="updateCaaField('planYearBeginDate', $event)"
                  />
                  <DatePicker
                    label="Plan year end date"
                    :model-value="editableCaaData.planYearEndDate"
                    @update:model-value="updateCaaField('planYearEndDate', $event)"
                  />
                  <TextField
                    label="Members as of 12/31 of the reference year"
                    :model-value="editableCaaData.membersAsOf"
                    @update:model-value="updateCaaField('membersAsOf', $event)"
                    hint="Report the number of members as of 12/31. Enter 0 if there aren't any members."
                    persistent-hint
                  />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="saveBenefitDetailsChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelBenefitDetailsChanges" />
                </div>
              </template>
            </div>

            <!-- Widget 3: Plan Sponsor Details -->
            <div class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Plan Sponsor Details</h4>
                <Button v-if="!isEditingPlanSponsor" @click="isEditingPlanSponsor = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingPlanSponsor">
                <div class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Plan sponsor name</span>
                      <span class="ap-field-value">{{ editableCaaData.planSponsorLegalName || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Plan sponsor EIN</span>
                      <span class="ap-field-value">{{ editableCaaData.planSponsorEin || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">TPA name</span>
                      <span class="ap-field-value">{{ editableCaaData.tpaName || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">TPA EIN</span>
                      <span class="ap-field-value">{{ editableCaaData.tpaEin || '—' }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="caa-form-grid">
                  <TextField
                    label="Plan sponsor name"
                    :model-value="editableCaaData.planSponsorLegalName"
                    @update:model-value="updateCaaField('planSponsorLegalName', $event)"
                  />
                  <TextField
                    label="Plan Sponsor EIN"
                    :model-value="editableCaaData.planSponsorEin"
                    @update:model-value="updateCaaField('planSponsorEin', $event)"
                  />
                  <TextField
                    label="TPA name"
                    :model-value="editableCaaData.tpaName"
                    @update:model-value="updateCaaField('tpaName', $event)"
                  />
                  <TextField
                    label="TPA EIN"
                    :model-value="editableCaaData.tpaEin"
                    @update:model-value="updateCaaField('tpaEin', $event)"
                  />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="savePlanSponsorChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelPlanSponsorChanges" />
                </div>
              </template>
            </div>

            <!-- Widget 4: Reporting File Responsibilities (accordion, collapsed by default) -->
            <div class="ap-section">
              <button class="caa-accordion-trigger" @click="isCaaReportingFilesOpen = !isCaaReportingFilesOpen">
                <h4 class="text-h4">Reporting File Responsibilities</h4>
                <ChevronDown :size="20" :stroke-width="1.5" class="caa-chevron" :class="{ 'caa-chevron--open': isCaaReportingFilesOpen }" />
              </button>
              <div v-if="isCaaReportingFilesOpen">
                <table class="caa-reporting-table">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Plan Sponsor/TPA Information</th>
                    <th>Information Posted to Client Portal or Submitted on Client's Behalf Pending Client Election by Liviniti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>P1: Individual and Student Market Plan List</td>
                    <td>Yes; N/A to self-funded plans</td>
                    <td class="caa-cell--no">No</td>
                  </tr>
                  <tr>
                    <td>P2: Group Health Plan List</td>
                    <td>Yes</td>
                    <td class="caa-cell--no">No</td>
                  </tr>
                  <tr>
                    <td>P3: FEHB Plan List</td>
                    <td>Yes; N/A to self-funded plans</td>
                    <td class="caa-cell--no">No</td>
                  </tr>
                  <tr>
                    <td>D1: Premium and Life Years</td>
                    <td>Yes</td>
                    <td class="caa-cell--no">No</td>
                  </tr>
                  <tr>
                    <td>D2: Spending by Category</td>
                    <td>Yes</td>
                    <td class="caa-cell--no">No</td>
                  </tr>
                  <tr>
                    <td>D3: Top 50 Most Frequent Brand Drugs</td>
                    <td class="caa-cell--no">No</td>
                    <td class="caa-cell--yes">Yes, all data elements</td>
                  </tr>
                  <tr>
                    <td>D4: Top 50 Most Costly Drugs</td>
                    <td class="caa-cell--no">No</td>
                    <td class="caa-cell--yes">Yes, all data elements</td>
                  </tr>
                  <tr>
                    <td>D5: Top 50 Drugs by Spending Increase</td>
                    <td class="caa-cell--no">No</td>
                    <td class="caa-cell--yes">Yes, all data elements</td>
                  </tr>
                  <tr>
                    <td>D6: Rx Totals</td>
                    <td class="caa-cell--no">No</td>
                    <td class="caa-cell--yes">Yes, all data elements</td>
                  </tr>
                  <tr>
                    <td>D7: Rx Rebates by Therapeutic Class</td>
                    <td class="caa-cell--no">No</td>
                    <td class="caa-cell--yes">Yes, all data elements</td>
                  </tr>
                  <tr>
                    <td>D8: Rx Rebates for the Top 25 Drugs</td>
                    <td class="caa-cell--no">No</td>
                    <td class="caa-cell--yes">Yes, all data elements</td>
                  </tr>
                  <tr class="caa-row--narrative">
                    <td>Narrative Response File</td>
                    <td>
                      <p class="caa-narrative-label">Plan Sponsors/TPAs are responsible for providing narrative responses for the following:</p>
                      <ul>
                        <li>Employer size for self-funded plans</li>
                        <li>Net payments from federal or state reinsurance or cost-sharing reduction programs</li>
                        <li>Medical benefits drugs</li>
                        <li>Impact of prescription drug rebates</li>
                      </ul>
                    </td>
                    <td>
                      <p class="caa-narrative-label">Liviniti will be providing narrative responses for the following:</p>
                      <ul>
                        <li>Drugs missing from CMS crosswalk</li>
                        <li>Prescription drug rebate descriptions</li>
                        <li>Allocation methods for prescription drug rebates</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
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
                  <li>Client shall timely pay Liviniti two-hundred and fifty dollars ($250) for submitting the Federal Gag Clause Prohibition Compliance Attestation on Client's behalf.</li>
                  <li>Client shall indemnify and hold harmless Liviniti for any and all damages resulting directly or indirectly from the following:</li>
                  <ul>
                    <li>Fees, penalties, costs, fines, assessed by CMS and/or the federal government related to the submission of the Federal Gag Clause Prohibition Compliance Attestation that are attributed to Client's actions.</li>
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
import { ChevronDown } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';
import { ref, computed, watch } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Company A' },
  { id: 2, name: 'Company B' },
  { id: 3, name: 'Company C' },
  { id: 4, name: 'Company D' },
  { id: 5, name: 'Company E' },
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
  planSponsorOptions: string;
  reportingPeriodOccurance: string;
  groupHealthPlanName: string;
  option2Acknowledged: boolean;
  legalAcknowledged: boolean;
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
  1: { companyName: 'Company A', dba: 'Company A', notificationThreshold: '15000', planSponsorOptions: 'Option 2 - D3-D8, PBM portion of narrative submitted to CMS on behalf of client, fee applicable', reportingPeriodOccurance: 'Annually', groupHealthPlanName: 'Company A Health Plan', groupHealthPlan: '12345678', carveOutBenefit: 'Pharmacy Only', form5500Plan: '501', states: ['CA', 'NY'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '257', option2Acknowledged: true, legalAcknowledged: true, planSponsorLegalName: 'Company A Inc.', planSponsorEin: '12-3456789', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '12/31/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Company A Inc.', reportingEntityEin: '12-3456789', attestationAgreement: 'Agreement A', agreementTypes: 'Type 1', mailingAddress1: '10880 Malibu Point', mailingAddress2: '', city: 'Malibu', mailingState: 'CA', zipCode: '90265', contactFirstName: 'Tony', contactLastName: 'Stark', contactEmail: 'tony.stark@companya.com', contactPhoneNumber: '555-123-4567', billingOrganization: 'Company A', billingFirstName: 'Pepper', billingLastName: 'Potts', billingEmail: 'pepper.potts@companya.com', billingPhoneNumber: '555-987-6543', eSignature: 'Tony Stark' },
  2: { companyName: 'Company B', dba: 'Company B Foundation', notificationThreshold: '25000', planSponsorOptions: 'Option 1 - D3-D8 and PBM portion of narrative posted to Liviniti Client Portal for retrieval', reportingPeriodOccurance: 'Annually', groupHealthPlanName: 'Company B Health Plan', groupHealthPlan: '87654321', carveOutBenefit: 'Pharmacy Only', form5500Plan: '502', states: ['TX', 'FL'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '500', option2Acknowledged: false, legalAcknowledged: false, planSponsorLegalName: 'Company B LLC', planSponsorEin: '98-7654321', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '09/30/2024', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Company B LLC', reportingEntityEin: '98-7654321', attestationAgreement: 'Agreement B', agreementTypes: 'Type 2', mailingAddress1: '1007 Mountain Drive', mailingAddress2: '', city: 'Gotham', mailingState: 'NY', zipCode: '10001', contactFirstName: 'Bruce', contactLastName: 'Wayne', contactEmail: 'bruce.wayne@companyb.com', contactPhoneNumber: '555-234-5678', billingOrganization: 'Company B', billingFirstName: 'Alfred', billingLastName: 'Pennyworth', billingEmail: 'alfred.pennyworth@companyb.com', billingPhoneNumber: '555-876-5432', eSignature: 'Bruce Wayne' },
  3: { companyName: 'Company C', dba: 'Company C', notificationThreshold: '10000', planSponsorOptions: 'Option 1 - D3-D8 and PBM portion of narrative posted to Liviniti Client Portal for retrieval', reportingPeriodOccurance: 'Current Reporting Period', groupHealthPlanName: 'Company C Health Plan', groupHealthPlan: '11223344', carveOutBenefit: 'Specialty Drugs Only', form5500Plan: '503', states: ['IL', 'GA'], marketSegment: 'SF Small Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '100', option2Acknowledged: false, legalAcknowledged: false, planSponsorLegalName: 'Company C Corp.', planSponsorEin: '11-2233445', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '01/31/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Company C Corp.', reportingEntityEin: '11-2233445', attestationAgreement: 'Agreement C', agreementTypes: 'Type 3', mailingAddress1: '21440 Chase Dr', mailingAddress2: '', city: 'Fremont', mailingState: 'CA', zipCode: '94539', contactFirstName: 'Miles', contactLastName: 'Dyson', contactEmail: 'miles.dyson@companyc.com', contactPhoneNumber: '555-345-6789', billingOrganization: 'Company C', billingFirstName: 'Sarah', billingLastName: 'Connor', billingEmail: 'sarah.connor@companyc.com', billingPhoneNumber: '555-765-4321', eSignature: 'Miles Dyson' },
  4: { companyName: 'Company D', dba: 'Company D Industries', notificationThreshold: '20000', planSponsorOptions: 'Option 2 - D3-D8, PBM portion of narrative submitted to CMS on behalf of client, fee applicable', reportingPeriodOccurance: 'Annually', groupHealthPlanName: 'Company D Industries Health Plan', groupHealthPlan: '44332211', carveOutBenefit: 'Fertility Only', form5500Plan: '504', states: ['PA', 'OH'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '750', option2Acknowledged: true, legalAcknowledged: true, planSponsorLegalName: 'Company D Industries', planSponsorEin: '44-3322110', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '06/30/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Company D Industries', reportingEntityEin: '44-3322110', attestationAgreement: 'Agreement D', agreementTypes: 'Type 4', mailingAddress1: '200 Park Ave', mailingAddress2: '', city: 'New York', mailingState: 'NY', zipCode: '10166', contactFirstName: 'Norman', contactLastName: 'Osborn', contactEmail: 'norman.osborn@companyd.com', contactPhoneNumber: '555-456-7890', billingOrganization: 'Company D', billingFirstName: 'Harry', billingLastName: 'Osborn', billingEmail: 'harry.osborn@companyd.com', billingPhoneNumber: '555-654-3210', eSignature: 'Norman Osborn' },
  5: { companyName: 'Company E', dba: 'Company E', notificationThreshold: '30000', planSponsorOptions: '', reportingPeriodOccurance: '', groupHealthPlanName: '', groupHealthPlan: '99887766', carveOutBenefit: 'Pharmacy Only', form5500Plan: '505', states: ['WA', 'OR'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '300', option2Acknowledged: false, legalAcknowledged: false, planSponsorLegalName: 'Company E Corporation', planSponsorEin: '99-8877665', tpaName: 'Allied Benefit Solutions', tpaEin: '36879958', authorize: null, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '03/31/2025', reportingEntityType: 'Plan Sponsor', reportingEntityName: 'Company E Corporation', reportingEntityEin: '99-8877665', attestationAgreement: 'Agreement E', agreementTypes: 'Type 5', mailingAddress1: '1238 W 6th St', mailingAddress2: '', city: 'Los Angeles', mailingState: 'CA', zipCode: '90017', contactFirstName: 'Eldon', contactLastName: 'Tyrell', contactEmail: 'eldon.tyrell@companye.com', contactPhoneNumber: '555-567-8901', billingOrganization: 'Company E', billingFirstName: 'Rachael', billingLastName: 'Tyrell', billingEmail: 'rachael.tyrell@companye.com', billingPhoneNumber: '555-543-2109', eSignature: 'Eldon Tyrell' },
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

const isEditingCaaOption = ref(false);
const isEditingBenefitDetails = ref(false);
const isEditingPlanSponsor = ref(false);
const isCaaReportingFilesOpen = ref(false);

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
  planSponsorOptions: '',
  reportingPeriodOccurance: '',
  groupHealthPlanName: '',
  groupHealthPlan: '',
  carveOutBenefit: '',
  form5500Plan: '',
  states: [],
  marketSegment: '',
  planYearBeginDate: '',
  planYearEndDate: '',
  membersAsOf: '',
  option2Acknowledged: false,
  legalAcknowledged: false,
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
      planSponsorOptions: companyData[newVal].planSponsorOptions,
      reportingPeriodOccurance: companyData[newVal].reportingPeriodOccurance,
      groupHealthPlanName: companyData[newVal].groupHealthPlanName,
      groupHealthPlan: companyData[newVal].groupHealthPlan,
      carveOutBenefit: companyData[newVal].carveOutBenefit,
      form5500Plan: companyData[newVal].form5500Plan,
      states: companyData[newVal].states,
      marketSegment: companyData[newVal].marketSegment,
      planYearBeginDate: companyData[newVal].planYearBeginDate,
      planYearEndDate: companyData[newVal].planYearEndDate,
      membersAsOf: companyData[newVal].membersAsOf,
      option2Acknowledged: companyData[newVal].option2Acknowledged,
      legalAcknowledged: companyData[newVal].legalAcknowledged,
      planSponsorLegalName: companyData[newVal].planSponsorLegalName,
      planSponsorEin: companyData[newVal].planSponsorEin,
      tpaName: companyData[newVal].tpaName,
      tpaEin: companyData[newVal].tpaEin,
    };
    isEditingCaaOption.value = false;
    isEditingBenefitDetails.value = false;
    isEditingPlanSponsor.value = false;
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
    isEditingCaaOption.value = false;
    isEditingBenefitDetails.value = false;
    isEditingPlanSponsor.value = false;
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

const updateCompanyField = (field: string, value: any) => {
  (editableCompanyData.value as any)[field] = value;
  isCompanyChanged.value = true;
};

const updateCaaField = (field: string, value: any) => {
  (editableCaaData.value as any)[field] = value;
};

const caaOptionSelected = computed(() => !!editableCaaData.value.planSponsorOptions);
const caaIsOption1 = computed(() => editableCaaData.value.planSponsorOptions?.includes('Option 1'));
const caaIsOption2 = computed(() => editableCaaData.value.planSponsorOptions?.includes('Option 2'));

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

const saveCaaOptionChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCaaData.value);
    isEditingCaaOption.value = false;
    showSnackbar.value = true;
  }
};

const saveBenefitDetailsChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCaaData.value);
    isEditingBenefitDetails.value = false;
    showSnackbar.value = true;
  }
};

const savePlanSponsorChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCaaData.value);
    isEditingPlanSponsor.value = false;
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

const cancelCaaOptionChanges = () => {
  if (selectedAccount.value) {
    editableCaaData.value = JSON.parse(JSON.stringify(companyData[selectedAccount.value]));
    isEditingCaaOption.value = false;
  }
};

const cancelBenefitDetailsChanges = () => {
  if (selectedAccount.value) {
    editableCaaData.value = JSON.parse(JSON.stringify(companyData[selectedAccount.value]));
    isEditingBenefitDetails.value = false;
  }
};

const cancelPlanSponsorChanges = () => {
  if (selectedAccount.value) {
    editableCaaData.value = JSON.parse(JSON.stringify(companyData[selectedAccount.value]));
    isEditingPlanSponsor.value = false;
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
  'SF Small Employer Plans',
  'SF Large Employer Plans',
]);

const carveOutBenefits = ref([
  'Pharmacy Only',
  'Fertility Only',
  'Specialty Drugs Only',
]);

const planSponsorOptionsList = ref([
  'Option 1 - D3-D8 and PBM portion of narrative posted to Liviniti Client Portal for retrieval',
  'Option 2 - D3-D8, PBM portion of narrative submitted to CMS on behalf of client, fee applicable',
]);

const reportingPeriodOptions = ref([
  'Annually',
  'Current Reporting Period',
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
    accountName: 'Company A',
    user: 'Tony Stark',
    role: 'Admin',
    email: 'tony.stark@companya.com',
    permissions: 'All',
    activated: true,
    mainPoc: true,
    surveyContact: false,
  },
  {
    accountName: 'Company A',
    user: 'Pepper Potts',
    role: 'Admin',
    email: 'pepper.potts@companya.com',
    permissions: 'All',
    activated: true,
    mainPoc: false,
    surveyContact: true,
  },
  {
    accountName: 'Company B',
    user: 'Bruce Wayne',
    role: 'Admin',
    email: 'bruce.wayne@companyb.com',
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

  &--right {
    justify-content: flex-end;
  }
}

.high-cost-container {
  padding-bottom: $spacing-large;
  max-width: 500px;
  
}

.caa-settings {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;

  h3 {
    margin-bottom: 0;
  }
}

.ap-fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.ap-field-row {
  &--multi {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xlarge;
  }
}

.ap-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 140px;
}

.ap-field-label {
  font-size: $font-size-small;
  color: $color-text-secondary;
}

.ap-field-value {
  font-size: $font-size-body;
  color: $color-text-primary;
}

.caa-no-option {
  font-size: $font-size-small;
  color: $color-neutral-disabled;
}

.caa-option-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-medium;
  max-width: 700px;
}

.caa-disclaimer-callout {
  padding: $spacing-medium;
  border-radius: 4px;
  background-color: $color-information-background;
  border-left: 3px solid $color-link;
  font-size: $font-size-small;
  line-height: 1.6;
  color: var(--color-text-primary);

  p { margin: 0; }
}

.caa-fee-ack {
  max-width: 700px;
  padding: $spacing-medium;
  border-radius: 4px;
  background-color: $color-warning-background;
  border-left: 3px solid $color-warning;
  font-size: $font-size-small;
  line-height: 1.5;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: $spacing-small;

  &__notice { font-weight: $font-weight-semibold; margin: 0; }
  &__label { font-weight: $font-weight-semibold; margin: 0; }
  &__status { margin: 0; }
}

.caa-legal-text {
  font-size: $font-size-small;
  line-height: 1.6;
  color: var(--color-text-primary);

  p { margin: 0 0 $spacing-small; &:last-child { margin-bottom: 0; } }
  ul { margin: 0 0 $spacing-small; padding-left: $spacing-large; li { line-height: 1.6; } }
}

.caa-checkbox-label {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  margin-bottom: $spacing-xsmall;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: $color-primary;
    cursor: pointer;
  }

  &--readonly {
    cursor: default;
    input[type="checkbox"] { cursor: default; }
  }
}


.caa-field-with-hint {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.caa-field-hint {
  font-size: $font-size-small;
  color: var(--color-text-secondary);
  margin: 0;
}

.caa-form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-medium;
  align-items: start;

  &__span2 { grid-column: span 2; }
  &__span3 { grid-column: span 3; }
  &__span4 { grid-column: span 4; }
}

.ap-section {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
}

.ap-section-header {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  margin-bottom: $spacing-medium;
  padding-bottom: $spacing-small;
  border-bottom: 1px solid $color-border;

  &--space-between {
    justify-content: flex-start;
  }

  h4 {
    margin-bottom: 0;
  }
}

.ap-section-footer {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  margin-top: $spacing-medium;
}

.caa-accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $spacing-small;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;

  h4 {
    margin-bottom: 0;
    color: $color-text-primary;
  }
}

.caa-chevron {
  color: $color-text-secondary;
  transition: transform 0.2s ease;
  flex-shrink: 0;

  &--open {
    transform: rotate(180deg);
  }
}

.caa-reporting-table {
  width: 100%;
  margin-top: $spacing-medium;
  border-collapse: collapse;
  font-family: $font-family-base;
  font-size: $font-size-small;
  border: 1px solid $color-border;
  border-radius: 4px;
  overflow: hidden;

  thead tr {
    background-color: $color-primary;

    th {
      padding: $spacing-small $spacing-medium;
      text-align: left;
      font-size: $font-size-small;
      font-weight: $font-weight-bold;
      color: $color-neutral-white;
      line-height: 1.4;
      vertical-align: bottom;

      &:first-child { width: 22%; }
      &:nth-child(2) { width: 36%; }
      &:last-child { width: 42%; }
    }
  }

  tbody tr {
    border-bottom: 1px solid $color-border;

    &:nth-child(even) {
      background-color: var(--color-bg-surface);
    }

    &:last-child {
      border-bottom: none;
    }

    td {
      padding: $spacing-small $spacing-medium;
      vertical-align: top;
      color: var(--color-text-primary);
      line-height: 1.5;
    }
  }

  .caa-cell--no {
    color: $color-neutral-disabled;
  }

  .caa-cell--yes {
    color: $color-primary;
    font-weight: $font-weight-semibold;
  }

  .caa-row--narrative td {
    vertical-align: top;
  }

  .caa-narrative-label {
    margin-bottom: $spacing-xsmall;
    font-size: $font-size-small;
  }

  ul {
    margin: 0;
    padding-left: $spacing-medium;

    li {
      font-size: $font-size-small;
      line-height: 1.6;
    }
  }
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
