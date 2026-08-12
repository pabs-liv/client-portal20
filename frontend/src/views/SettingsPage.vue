
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
        <Tabs v-if="selectedAccount" :tabs="settingTabs" @tab-selected="handleTabSelected" />
        <div v-if="selectedAccount && activeTab === 'company-information'">
          <!-- Mirrors Plan Explorer > Account Profile step (Account Profile + About This
               Company cards) — see project_settings_master_divergences.md. High Cost
               Notifications widget re-added 2026-08-10 per Alex: needs to stay editable
               post-go-live, not just during Implementation. Shares state with Plan
               Explorer > Limits & Controls via useHighCostNotifications() — same setting,
               not a duplicate. -->

          <!-- Section: Account Profile -->
          <div class="ap-section">
            <div class="ap-section-header ap-section-header--space-between">
              <h4 class="text-h4">Account Profile</h4>
              <Button v-if="!isEditingAccountProfile" @click="isEditingAccountProfile = true" label="Edit" variant="thirtiary" />
            </div>
            <div class="ap-fields">
              <template v-if="!isEditingAccountProfile">
                <div class="ap-field-row ap-field-row--multi ap-field-row--thirds">
                  <div class="ap-field">
                    <span class="ap-field-label">Account name</span>
                    <span class="ap-field-value">{{ editableCompanyData.companyName || '—' }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">Legal Name</span>
                    <span class="ap-field-value">{{ editableCompanyData.apLegalName || '—' }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">DBA</span>
                    <span class="ap-field-value">{{ editableCompanyData.dba || '—' }}</span>
                  </div>
                </div>
                <div class="ap-field-row ap-field-row--multi">
                  <div class="ap-field">
                    <span class="ap-field-label">Effective start date</span>
                    <span class="ap-field-value">{{ editableCompanyData.apEffectiveStartDate || '—' }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">Effective end date</span>
                    <span class="ap-field-value">{{ editableCompanyData.apEffectiveEndDate || '—' }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.companyName" label="Account name" />
                  <TextField v-model="editableCompanyData.apLegalName" label="Legal Name" />
                  <TextField v-model="editableCompanyData.dba" label="DBA" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apEffectiveStartDate" label="Effective start date" placeholder="MM/DD/YYYY" />
                  <TextField v-model="editableCompanyData.apEffectiveEndDate" label="Effective end date" placeholder="MM/DD/YYYY" />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="saveAccountProfileChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelAccountProfileChanges" />
                </div>
              </template>
            </div>
          </div>

          <!-- Section: About This Company -->
          <div class="ap-section">
            <div class="ap-section-header ap-section-header--space-between">
              <h4 class="text-h4">About This Company</h4>
              <Button v-if="!isEditingAboutCompany" @click="isEditingAboutCompany = true" label="Edit" variant="thirtiary" />
            </div>
            <div class="ap-fields">
              <template v-if="!isEditingAboutCompany">
                <div class="ap-field-row">
                  <div class="ap-field">
                    <span class="ap-field-label">SIC Code</span>
                    <span class="ap-field-value">{{ editableCompanyData.apSicCode || '—' }}</span>
                  </div>
                </div>
                <h5 class="ap-subsection-heading">Physical Address</h5>
                <div class="ap-field-row">
                  <div class="ap-field">
                    <span class="ap-field-label">Address 1</span>
                    <span class="ap-field-value">{{ editableCompanyData.apPhysicalAddress1 || '—' }}</span>
                  </div>
                </div>
                <div class="ap-field-row">
                  <div class="ap-field">
                    <span class="ap-field-label">Address 2</span>
                    <span class="ap-field-value">{{ editableCompanyData.apPhysicalAddress2 || '—' }}</span>
                  </div>
                </div>
                <div class="ap-field-row ap-field-row--multi ap-field-row--thirds">
                  <div class="ap-field">
                    <span class="ap-field-label">City</span>
                    <span class="ap-field-value">{{ editableCompanyData.apPhysicalCity || '—' }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">State</span>
                    <span class="ap-field-value">{{ editableCompanyData.apPhysicalState || '—' }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">ZIP</span>
                    <span class="ap-field-value">{{ editableCompanyData.apPhysicalZip || '—' }}</span>
                  </div>
                </div>
                <div class="ap-field-row">
                  <div class="ap-field">
                    <span class="ap-field-label">Country</span>
                    <span class="ap-field-value">{{ editableCompanyData.apPhysicalCountry || '—' }}</span>
                  </div>
                </div>
                <h5 class="ap-subsection-heading">Mailing Address</h5>
                <div class="ap-field-row">
                  <div class="ap-field">
                    <span class="ap-field-label">Address 1</span>
                    <span class="ap-field-value">{{ editableCompanyData.apMailingAddress1 || '—' }}</span>
                  </div>
                </div>
                <div class="ap-field-row">
                  <div class="ap-field">
                    <span class="ap-field-label">Address 2</span>
                    <span class="ap-field-value">{{ editableCompanyData.apMailingAddress2 || '—' }}</span>
                  </div>
                </div>
                <div class="ap-field-row ap-field-row--multi ap-field-row--thirds">
                  <div class="ap-field">
                    <span class="ap-field-label">City</span>
                    <span class="ap-field-value">{{ editableCompanyData.apMailingCity || '—' }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">State</span>
                    <span class="ap-field-value">{{ editableCompanyData.apMailingState || '—' }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">ZIP</span>
                    <span class="ap-field-value">{{ editableCompanyData.apMailingZip || '—' }}</span>
                  </div>
                </div>
                <div class="ap-field-row">
                  <div class="ap-field">
                    <span class="ap-field-label">Country</span>
                    <span class="ap-field-value">{{ editableCompanyData.apMailingCountry || '—' }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apSicCode" label="SIC Code" />
                </div>
                <h5 class="ap-subsection-heading">Physical Address</h5>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apPhysicalAddress1" label="Address 1" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apPhysicalAddress2" label="Address 2" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apPhysicalCity" label="City" />
                  <TextField v-model="editableCompanyData.apPhysicalState" label="State" />
                  <TextField v-model="editableCompanyData.apPhysicalZip" label="ZIP" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apPhysicalCountry" label="Country" />
                </div>
                <div class="ap-mailing-header">
                  <h5 class="ap-subsection-heading">Mailing Address</h5>
                  <div class="ap-checkbox-toggle" @click="toggleSameAsPhysical">
                    <CheckSquare v-if="sameAsPhysical" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" />
                    <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" />
                    <span class="text-small">Same as physical address</span>
                  </div>
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apMailingAddress1" label="Address 1" :disabled="sameAsPhysical" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apMailingAddress2" label="Address 2" :disabled="sameAsPhysical" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apMailingCity" label="City" :disabled="sameAsPhysical" />
                  <TextField v-model="editableCompanyData.apMailingState" label="State" :disabled="sameAsPhysical" />
                  <TextField v-model="editableCompanyData.apMailingZip" label="ZIP" :disabled="sameAsPhysical" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableCompanyData.apMailingCountry" label="Country" :disabled="sameAsPhysical" />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="saveAboutCompanyChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelAboutCompanyChanges" />
                </div>
              </template>
            </div>
          </div>

          <!-- Section: High Cost Notifications — shares state with Plan Explorer > Limits & Controls -->
          <div class="ap-section">
            <div class="ap-section-header ap-section-header--space-between">
              <h4 class="text-h4">High Cost Notifications</h4>
              <Button v-if="!lcEditingHcn" @click="lcHcnStartEdit" label="Edit" variant="thirtiary" />
            </div>
            <div class="ap-fields">
              <template v-if="!lcEditingHcn">
                <div class="ap-field-row ap-field-row--multi">
                  <div class="ap-field">
                    <span class="ap-field-label">Notify Threshold Amount</span>
                    <span class="ap-field-value">${{ lcNotifyThreshold }}</span>
                  </div>
                  <div class="ap-field">
                    <span class="ap-field-label">Notification Recipients</span>
                    <span class="ap-field-value">{{ lcRecipients.length ? lcRecipients.join(', ') : '—' }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="text-body">Before a high cost claim exceeding the notify amount is processed, the contacts below are notified. They have 24 hours to acknowledge before the claim is automatically processed.</p>
                <div class="form-row">
                  <TextField v-model="lcNotifyThreshold" label="Notify threshold amount" />
                </div>
                <div class="form-row">
                  <Autocomplete v-model="lcRecipients" :items="lcHcnContactOptions" label="Select contacts" :multiple="true" />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="lcHcnSaveEdit" />
                  <Button variant="secondary" label="Cancel" @click="lcHcnCancelEdit" />
                </div>
              </template>
            </div>
          </div>
        </div>
        <div v-if="selectedAccount && activeTab === 'user-administration'">
          <div class="ua-header">
            <p v-if="isClientUserAdminView" class="text-body ua-header-note">You have view-only access to this account's Client Portal users. To add, edit, or remove access, please contact your Liviniti Account Manager.</p>
            <p v-else class="text-body ua-header-note">Client Portal users are managed in SoloRx. To add, edit, or remove access, navigate to the Contacts tab for this account in SoloRx.</p>
          </div>
          <ReportDataTable
            :headers="userAdminHeaders"
            :items="userAdminData"
            :show-search-bar="true"
            :show-filter-button="false"
            search-placeholder="Search users"
            :show-row-actions="false"
            :row-action-items="userAdminRowActions"
            @row-action="handleUserAdminRowAction"
            :show-table-footer="true"
            :show-selection-checkboxes="false"
          >
            <template #item.permissionsLabel="{ item }"><span class="ua-permissions-cell">{{ item.permissionsLabel }}</span></template>
            <template #item.activated="{ item }">{{ item.activated ? 'Yes' : 'No' }}</template>
            <template #item.mainPoc="{ item }">
              <Check v-if="item.mainPoc" :size="16" :stroke-width="2" class="ua-table-check" />
              <span v-else>—</span>
            </template>
            <template #item.surveyContact="{ item }">
              <Check v-if="item.surveyContact" :size="16" :stroke-width="2" class="ua-table-check" />
              <span v-else>—</span>
            </template>
          </ReportDataTable>

          <!-- Add/Edit User Dialog -->
          <Dialog
            v-model="showUserAdminDialog"
            :heading="userAdminDialogMode === 'add' ? 'Add User' : 'Edit User'"
            :show-secondary-button="true"
            :actions="userAdminDialogActions"
          >
            <p class="ua-required-legend">Fields marked <span class="ua-required-asterisk">*</span> are required.</p>
            <v-row class="mt-1">
              <v-col cols="12" sm="6">
                <Select
                  v-model="userAdminForm.role"
                  :items="userAdminDialogMode === 'edit' ? (userAdminEditingIsVendorSourced ? userAdminExternalRoles : ['Client']) : userAdminRoleOptions"
                  label="Role *"
                />
              </v-col>
            </v-row>

            <template v-if="userAdminExternalRoles.includes(userAdminForm.role)">
              <template v-if="userAdminDialogMode === 'add'">
                <p class="text-small ua-role-note">Vendor contacts are sourced from vendors already associated to this account.</p>
                <v-row>
                  <v-col cols="12" sm="8"><Autocomplete v-model="userAdminVendorSelection" :items="userAdminVendorOptions" label="Select vendor contact" /></v-col>
                </v-row>
              </template>
              <template v-else>
                <div class="ap-field">
                  <span class="ap-field-label">Name</span>
                  <span class="ap-field-value">{{ userAdminForm.firstName }} {{ userAdminForm.lastName }}</span>
                </div>
              </template>
            </template>
            <template v-else>
              <v-row class="mt-1">
                <v-col cols="6"><TextField v-model="userAdminForm.firstName" label="First Name" :error-messages="userAdminErrors.firstName" /></v-col>
                <v-col cols="6"><TextField v-model="userAdminForm.lastName" label="Last Name" :error-messages="userAdminErrors.lastName" /></v-col>
              </v-row>
              <v-row>
                <v-col cols="12"><TextField v-model="userAdminForm.email" label="Email" :error-messages="userAdminErrors.email" /></v-col>
              </v-row>
              <div v-for="(ph, idx) in userAdminForm.phones" :key="idx" class="nl-repeatable-row">
                <div v-if="userAdminForm.phones.length > 1" class="nl-repeatable-row-header">
                  <span class="nl-repeatable-row-label">Phone {{ idx + 1 }}</span>
                  <button class="nl-remove-row-btn" @click="userAdminForm.phones.splice(idx, 1); if (userAdminForm.primaryPhoneIdx >= userAdminForm.phones.length) userAdminForm.primaryPhoneIdx = 0" title="Remove">
                    <Trash2 :size="16" :stroke-width="1.75" />
                  </button>
                </div>
                <v-row>
                  <v-col cols="5"><TextField v-model="ph.number" label="Number" /></v-col>
                  <v-col cols="4">
                    <Select v-model="ph.type" :items="uaPhoneTypes" label="Type" />
                  </v-col>
                  <v-col cols="3"><TextField v-model="ph.ext" label="Ext" /></v-col>
                </v-row>
                <label class="ap-radio-option">
                  <input type="radio" :value="idx" v-model="userAdminForm.primaryPhoneIdx" class="ap-radio-input" />
                  <span class="ap-radio-custom" :class="{ active: userAdminForm.primaryPhoneIdx === idx }">
                    <span v-if="userAdminForm.primaryPhoneIdx === idx" class="ap-radio-dot" />
                  </span>
                  <span class="ap-radio-label">Primary</span>
                </label>
                <v-divider v-if="idx < userAdminForm.phones.length - 1" class="nl-row-divider" />
              </div>
              <button v-if="userAdminForm.phones.length < 3" class="nl-add-link" @click="userAdminForm.phones.push(uaNewPhone())">+ Add Phone Number</button>
            </template>

            <div v-if="userAdminExternalRoles.includes(userAdminForm.role)" class="ua-checkbox-toggle" @click="userAdminForm.ackConfirmed = !userAdminForm.ackConfirmed">
              <CheckSquare v-if="userAdminForm.ackConfirmed" :size="18" :stroke-width="1.5" class="ua-checkbox-icon ua-checkbox-icon--checked" />
              <Square v-else :size="18" :stroke-width="1.5" class="ua-checkbox-icon" />
              <span class="text-small">I confirm this external vendor has signed the required data transfer agreement.<span class="ua-required-asterisk">*</span></span>
            </div>
            <h5 class="ua-subsection-heading">Client Portal Permissions<span class="ua-required-asterisk">*</span></h5>
            <p class="text-small ua-role-note">At least one permission is required.</p>
            <div class="ua-permission-grid">
              <div v-for="perm in userAdminPermissionOptions" :key="perm.key" class="ua-checkbox-toggle" @click="userAdminForm.permissions[perm.key] = !userAdminForm.permissions[perm.key]">
                <CheckSquare v-if="userAdminForm.permissions[perm.key]" :size="18" :stroke-width="1.5" class="ua-checkbox-icon ua-checkbox-icon--checked" />
                <Square v-else :size="18" :stroke-width="1.5" class="ua-checkbox-icon" />
                <span class="text-small">{{ perm.label }}</span>
              </div>
            </div>
            <div class="ua-checkbox-toggle" @click="userAdminForm.allowPhi = !userAdminForm.allowPhi">
              <CheckSquare v-if="userAdminForm.allowPhi" :size="18" :stroke-width="1.5" class="ua-checkbox-icon ua-checkbox-icon--checked" />
              <Square v-else :size="18" :stroke-width="1.5" class="ua-checkbox-icon" />
              <span class="text-small">Allow PHI access</span>
            </div>
            <h5 class="ua-subsection-heading">Contact Designations</h5>
            <div
              class="ua-checkbox-toggle"
              :class="{ 'ua-checkbox-toggle--disabled': otherUserIsMainPoc(userAdminDialogMode === 'edit' ? userAdminEditingIndex : -1) }"
              @click="!otherUserIsMainPoc(userAdminDialogMode === 'edit' ? userAdminEditingIndex : -1) && (userAdminForm.mainPoc = !userAdminForm.mainPoc)"
            >
              <CheckSquare v-if="userAdminForm.mainPoc" :size="18" :stroke-width="1.5" class="ua-checkbox-icon ua-checkbox-icon--checked" />
              <Square v-else :size="18" :stroke-width="1.5" class="ua-checkbox-icon" />
              <span class="text-small">Main Point of Contact</span>
            </div>
            <p v-if="otherUserIsMainPoc(userAdminDialogMode === 'edit' ? userAdminEditingIndex : -1)" class="text-small ua-role-note">{{ otherUserIsMainPoc(userAdminDialogMode === 'edit' ? userAdminEditingIndex : -1) }} is already the Main Point of Contact for this account. Remove that designation from them before assigning a new one.</p>
            <div class="ua-checkbox-toggle" @click="userAdminForm.surveyContact = !userAdminForm.surveyContact">
              <CheckSquare v-if="userAdminForm.surveyContact" :size="18" :stroke-width="1.5" class="ua-checkbox-icon ua-checkbox-icon--checked" />
              <Square v-else :size="18" :stroke-width="1.5" class="ua-checkbox-icon" />
              <span class="text-small">Survey Contact</span>
            </div>
          </Dialog>

          <!-- Remove User Confirmation Dialog -->
          <Dialog
            v-model="showRemoveUserDialog"
            :icon="Trash2"
            heading="Remove User"
            :text="`Are you sure you want to remove ${userAdminPendingRemoval?.user} from this account? They will lose Client Portal access immediately.`"
            :actions="removeUserDialogActions"
            :show-secondary-button="true"
          />
        </div>
        <div v-if="selectedAccount && activeTab === 'caa-drug-cost-reporting'">
          <div class="caa-settings">
            <h3 class="text-h3">Consolidated Appropriations Act Reporting</h3>
            <Banner
              v-if="!canEditCaaDrugCostReporting"
              variant="warning"
              message="The deadline to edit CAA Drug Cost Reporting has passed. This tab is now read-only."
              :always-show="true"
              class="mb-3"
            />

            <!-- Widget 1: Reporting Option -->
            <div class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Reporting Option</h4>
                <Button v-if="!isEditingCaaOption && canEditCaaDrugCostReporting" @click="isEditingCaaOption = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingCaaOption">
                <div v-if="caaOptionSelected" class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Reporting option selection</span>
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
                <Button v-if="!isEditingBenefitDetails && canEditCaaDrugCostReporting" @click="isEditingBenefitDetails = true" label="Edit" variant="thirtiary" />
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
                <Button v-if="!isEditingPlanSponsor && canEditCaaDrugCostReporting" @click="isEditingPlanSponsor = true" label="Edit" variant="thirtiary" />
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
                      <span class="ap-field-label">Carrier name</span>
                      <span class="ap-field-value">{{ editableCaaData.tpaName || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Carrier EIN</span>
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
                    :error-messages="caaEinErrors.planSponsorEin"
                    hint="9 digits per EIN; separate multiple with a semicolon"
                    persistent-hint
                  />
                  <TextField
                    label="Carrier name"
                    :model-value="editableCaaData.tpaName"
                    @update:model-value="updateCaaField('tpaName', $event)"
                  />
                  <TextField
                    label="Carrier EIN"
                    :model-value="editableCaaData.tpaEin"
                    @update:model-value="updateCaaField('tpaEin', $event)"
                    :error-messages="caaEinErrors.tpaEin"
                    hint="9 digits per EIN; separate multiple with a semicolon"
                    persistent-hint
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
                    <th>Plan Sponsor/Carrier Information</th>
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
                      <p class="caa-narrative-label">Plan Sponsors/Carriers are responsible for providing narrative responses for the following:</p>
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
          <div class="caa-settings">
            <h3 class="text-h3">CAA Gag Clause Prohibition Compliance Attestation</h3>
            <Banner
              v-if="!canEditGagClauseAttestation"
              variant="warning"
              message="The deadline to edit the CAA Gag Clause Attestation has passed. This tab is now read-only."
              :always-show="true"
              class="mb-3"
            />

            <!-- Widget 1: Authorization -->
            <div class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Authorization</h4>
                <Button v-if="!isEditingGagAuthorization && canEditGagClauseAttestation" @click="isEditingGagAuthorization = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingGagAuthorization">
                <div class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Do you want Liviniti to submit a Gag Attestation on your behalf?</span>
                      <span class="ap-field-value">{{ editableGagClauseData.authorize === 'yes' ? 'Yes' : 'No' }}</span>
                    </div>
                  </div>
                  <div v-if="editableGagClauseData.authorize === 'yes'" class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Fee of $250 per reporting period</span>
                      <span class="ap-field-value">Acknowledged: {{ editableGagClauseData.gagFeeAcknowledged ? 'Yes' : 'No' }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="ap-fields">
                  <div class="caa-option-section">
                    <p>Do you want Liviniti to submit a Gag Attestation on your behalf?</p>
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
                  <div v-if="editableGagClauseData.authorize === 'yes'" class="caa-fee-ack">
                    <p class="caa-fee-ack__notice">You acknowledge that a fee of $250 will be charged per reporting period.</p>
                    <label class="caa-checkbox-label">
                      <input
                        type="checkbox"
                        v-model="editableGagClauseData.gagFeeAcknowledged"
                      />
                      I Accept
                    </label>
                  </div>
                  <div class="ap-section-footer">
                    <Button variant="primary" label="Save Changes" @click="saveGagAuthorizationChanges" />
                    <Button variant="secondary" label="Cancel" @click="cancelGagAuthorizationChanges" />
                  </div>
                </div>
              </template>
            </div>

            <!-- Widget 2: Reporting Period -->
            <div v-if="editableGagClauseData.authorize === 'yes'" class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Reporting Period</h4>
                <Button v-if="!isEditingGagReportingPeriod && canEditGagClauseAttestation" @click="isEditingGagReportingPeriod = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingGagReportingPeriod">
                <div class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Reporting period</span>
                      <span class="ap-field-value">{{ periodOptions.find(p => p.value === editableGagClauseData.reportingPeriod)?.title || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Eff. start date</span>
                      <span class="ap-field-value">{{ editableGagClauseData.effectiveStartDate || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Eff. end date</span>
                      <span class="ap-field-value">{{ editableGagClauseData.effectiveEndDate || '—' }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-row">
                  <Select label="Select period" :items="periodOptions" v-model="editableGagClauseData.reportingPeriod" />
                  <DatePicker label="Eff. start date" v-model="editableGagClauseData.effectiveStartDate" />
                  <DatePicker label="Eff. end date" v-model="editableGagClauseData.effectiveEndDate" />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="saveGagReportingPeriodChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelGagReportingPeriodChanges" />
                </div>
              </template>
            </div>

            <!-- Widget 3: Reporting Entity Details (Details + Mailing Address + Primary Contact) -->
            <div v-if="editableGagClauseData.authorize === 'yes'" class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Reporting Entity Details</h4>
                <Button v-if="!isEditingGagEntityDetails && canEditGagClauseAttestation" @click="isEditingGagEntityDetails = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingGagEntityDetails">
                <div class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Reporting entity type</span>
                      <span class="ap-field-value">{{ editableGagClauseData.reportingEntityType || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Report entity name</span>
                      <span class="ap-field-value">{{ editableGagClauseData.reportingEntityName || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Employer identification number (EIN)</span>
                      <span class="ap-field-value">{{ editableGagClauseData.reportingEntityEin || '—' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Attestation agreement</span>
                      <span class="ap-field-value">{{ editableGagClauseData.attestationAgreement?.length ? editableGagClauseData.attestationAgreement.join(', ') : '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Agreement types</span>
                      <span class="ap-field-value">{{ editableGagClauseData.agreementTypes || '—' }}</span>
                    </div>
                  </div>
                  <h5 class="ap-subsection-heading">Mailing Address</h5>
                  <div class="ap-field-row">
                    <div class="ap-field">
                      <span class="ap-field-label">Address 1</span>
                      <span class="ap-field-value">{{ editableGagClauseData.mailingAddress1 || '—' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row">
                    <div class="ap-field">
                      <span class="ap-field-label">Address 2</span>
                      <span class="ap-field-value">{{ editableGagClauseData.mailingAddress2 || '—' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row ap-field-row--multi ap-field-row--thirds">
                    <div class="ap-field">
                      <span class="ap-field-label">City</span>
                      <span class="ap-field-value">{{ editableGagClauseData.city || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">State</span>
                      <span class="ap-field-value">{{ editableGagClauseData.mailingState || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">ZIP</span>
                      <span class="ap-field-value">{{ editableGagClauseData.zipCode || '—' }}</span>
                    </div>
                  </div>
                  <h5 class="ap-subsection-heading">Primary Contact</h5>
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">First name</span>
                      <span class="ap-field-value">{{ editableGagClauseData.contactFirstName || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Last name</span>
                      <span class="ap-field-value">{{ editableGagClauseData.contactLastName || '—' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Email</span>
                      <span class="ap-field-value">{{ editableGagClauseData.contactEmail || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Phone number</span>
                      <span class="ap-field-value">{{ editableGagClauseData.contactPhoneNumber || '—' }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-row">
                  <Select label="Reporting entity type" :items="reportingEntityTypeOptions" v-model="editableGagClauseData.reportingEntityType" />
                  <TextField v-model="editableGagClauseData.reportingEntityName" label="Report entity name" />
                  <TextField
                    v-model="editableGagClauseData.reportingEntityEin"
                    label="Employer identification number (EIN)"
                    :error-messages="gagClauseEinError"
                    hint="9 digits per EIN; separate multiple with a semicolon"
                    persistent-hint
                  />
                </div>
                <div class="form-row">
                  <Autocomplete label="Attestation agreement" :items="attestationAgreements" v-model="editableGagClauseData.attestationAgreement" :multiple="true" />
                  <Select label="Agreement types" :items="agreementTypes" v-model="editableGagClauseData.agreementTypes" />
                </div>
                <h5 class="ap-subsection-heading">Mailing Address</h5>
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.mailingAddress1" label="Address 1" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.mailingAddress2" label="Address 2" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.city" label="City" />
                  <Select label="State" :items="states" v-model="editableGagClauseData.mailingState" />
                  <TextField v-model="editableGagClauseData.zipCode" label="ZIP" />
                </div>
                <h5 class="ap-subsection-heading">Primary Contact</h5>
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.contactFirstName" label="First name" />
                  <TextField v-model="editableGagClauseData.contactLastName" label="Last name" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.contactEmail" label="Email" />
                  <TextField v-model="editableGagClauseData.contactPhoneNumber" label="Phone number" />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="saveGagEntityDetailsChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelGagEntityDetailsChanges" />
                </div>
              </template>
            </div>

            <!-- Widget 4: Billing Contact -->
            <div v-if="editableGagClauseData.authorize === 'yes'" class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Billing Contact</h4>
                <Button v-if="!isEditingGagBillingContact && canEditGagClauseAttestation" @click="isEditingGagBillingContact = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingGagBillingContact">
                <div class="ap-fields">
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Organization</span>
                      <span class="ap-field-value">{{ editableGagClauseData.billingOrganization || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">First name</span>
                      <span class="ap-field-value">{{ editableGagClauseData.billingFirstName || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Last name</span>
                      <span class="ap-field-value">{{ editableGagClauseData.billingLastName || '—' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Email</span>
                      <span class="ap-field-value">{{ editableGagClauseData.billingEmail || '—' }}</span>
                    </div>
                    <div class="ap-field">
                      <span class="ap-field-label">Phone number</span>
                      <span class="ap-field-value">{{ editableGagClauseData.billingPhoneNumber || '—' }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.billingOrganization" label="Organization" />
                  <TextField v-model="editableGagClauseData.billingFirstName" label="First name" />
                  <TextField v-model="editableGagClauseData.billingLastName" label="Last name" />
                </div>
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.billingEmail" label="Email" />
                  <TextField v-model="editableGagClauseData.billingPhoneNumber" label="Phone number" />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="saveGagBillingContactChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelGagBillingContactChanges" />
                </div>
              </template>
            </div>

            <!-- Widget 5: Acknowledgement and Signature -->
            <div class="ap-section">
              <div class="ap-section-header ap-section-header--space-between">
                <h4 class="text-h4">Acknowledgement and Signature</h4>
                <Button v-if="!isEditingGagAcknowledgement && canEditGagClauseAttestation" @click="isEditingGagAcknowledgement = true" label="Edit" variant="thirtiary" />
              </div>
              <template v-if="!isEditingGagAcknowledgement">
                <div class="ap-fields">
                  <div v-if="editableGagClauseData.authorize === 'yes'" class="ap-field-row ap-field-row--multi">
                    <div class="ap-field">
                      <span class="ap-field-label">Legal terms</span>
                      <span class="ap-field-value">Acknowledged: {{ editableGagClauseData.gagAuthorityAcknowledged ? 'Yes' : 'No' }}</span>
                    </div>
                  </div>
                  <div class="ap-field-row">
                    <div class="ap-field">
                      <span class="ap-field-label">e-Signature</span>
                      <span class="ap-field-value">{{ editableGagClauseData.eSignature || '—' }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-if="editableGagClauseData.authorize === 'yes'" class="caa-legal-text">
                  <p>In connection with this service provided by Liviniti to Client, Client hereby acknowledges and affirms its agreements/obligations, including the following:</p>
                  <ul>
                    <li>Client shall timely pay Liviniti two-hundred and fifty dollars ($250) for submitting the Federal Gag Clause Prohibition Compliance Attestation on Client's behalf.</li>
                    <li>Client shall indemnify and hold harmless Liviniti for any and all damages resulting directly or indirectly from the following:
                      <ul>
                        <li>Fees, penalties, costs, fines, assessed by CMS and/or the federal government related to the submission of the Federal Gag Clause Prohibition Compliance Attestation that are attributed to Client's actions.</li>
                        <li>Damages related to inaccurate or incomplete information provided by Client to Liviniti.</li>
                        <li>Damages related to a late or incomplete submission that is caused by Client.</li>
                        <li>Damages related to any action taken by Liviniti at the direction of Client.</li>
                        <li>Any other costs or expenses associated with these services.</li>
                      </ul>
                    </li>
                  </ul>
                  <p>Client hereby acknowledges its understanding and agreement of the above.</p>
                  <label class="caa-checkbox-label">
                    <input
                      type="checkbox"
                      v-model="editableGagClauseData.gagAuthorityAcknowledged"
                    />
                    I acknowledge my understanding and agreement of the above.
                  </label>
                </div>
                <Banner
                  variant="info"
                  message="Each individual signing this form represents and warrants that he/she is signing with full and complete authority to bind the party on whose behalf he/she is signing with respect to the matters contained herein."
                  class="mb-3"
                />
                <div class="form-row">
                  <TextField v-model="editableGagClauseData.eSignature" label="e-Signature" />
                </div>
                <div class="ap-section-footer">
                  <Button variant="primary" label="Save Changes" @click="saveGagAcknowledgementChanges" />
                  <Button variant="secondary" label="Cancel" @click="cancelGagAcknowledgementChanges" />
                </div>
              </template>
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
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import Banner from '@/components/common/Banner.vue';
import { ChevronDown, CheckSquare, Square, Trash2, Check } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';
import { ref, computed, watch } from 'vue';
import { useHighCostNotifications } from '@/composables/useHighCostNotifications';

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
  // Removed 2026-08-07: notificationThreshold (High Cost Notification Settings) — this
  // is Solo2-owned and already editable via Plan Explorer > Limits & Controls; the
  // Settings tab should not have a second, separate editable copy of it.
  // Account Profile / About This Company — mirrors Plan Explorer's Account Profile
  // step (PlanExplorerPage.vue). "ap" prefix avoids colliding with the Gag Clause
  // fields below, which have their own effectiveStartDate/mailingAddress1/etc.
  apLegalName: string;
  apEffectiveStartDate: string;
  apEffectiveEndDate: string;
  apSicCode: string;
  apPhysicalAddress1: string;
  apPhysicalAddress2: string;
  apPhysicalCity: string;
  apPhysicalState: string;
  apPhysicalZip: string;
  apPhysicalCountry: string;
  apMailingAddress1: string;
  apMailingAddress2: string;
  apMailingCity: string;
  apMailingState: string;
  apMailingZip: string;
  apMailingCountry: string;
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
  gagFeeAcknowledged: boolean;
  gagAuthorityAcknowledged: boolean;
  reportingPeriod: string | null;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
  reportingEntityType: string;
  reportingEntityName: string;
  reportingEntityEin: string;
  planNumber: string;
  attestationAgreement: string[];
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
  1: { companyName: 'Company A', dba: 'Company A', apLegalName: 'Company A Inc.', apEffectiveStartDate: '01/01/2025', apEffectiveEndDate: '', apSicCode: '3812', apPhysicalAddress1: '10880 Malibu Point', apPhysicalAddress2: '', apPhysicalCity: 'Malibu', apPhysicalState: 'CA', apPhysicalZip: '90265', apPhysicalCountry: 'USA', apMailingAddress1: '10880 Malibu Point', apMailingAddress2: '', apMailingCity: 'Malibu', apMailingState: 'CA', apMailingZip: '90265', apMailingCountry: 'USA', planSponsorOptions: 'Option 2 - D3-D8, PBM portion of narrative submitted to CMS on behalf of client, fee applicable', reportingPeriodOccurance: 'Annually', groupHealthPlanName: 'Company A Health Plan', groupHealthPlan: '12345678', carveOutBenefit: 'Pharmacy Only', form5500Plan: '501', states: ['CA', 'NY'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '257', option2Acknowledged: true, legalAcknowledged: true, planSponsorLegalName: 'Company A Inc.', planSponsorEin: '123456789', tpaName: 'Allied Benefit Solutions', tpaEin: '368799581', authorize: 'yes', gagFeeAcknowledged: true, gagAuthorityAcknowledged: true, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '12/31/2025', reportingEntityType: 'ERISA group health plan (GHP)', planNumber: '501', reportingEntityName: 'Company A Inc.', reportingEntityEin: '123456789', attestationAgreement: ['Medical'], agreementTypes: 'Type 1', mailingAddress1: '10880 Malibu Point', mailingAddress2: '', city: 'Malibu', mailingState: 'CA', zipCode: '90265', contactFirstName: 'Tony', contactLastName: 'Stark', contactEmail: 'tony.stark@companya.com', contactPhoneNumber: '555-123-4567', billingOrganization: 'Company A', billingFirstName: 'Pepper', billingLastName: 'Potts', billingEmail: 'pepper.potts@companya.com', billingPhoneNumber: '555-987-6543', eSignature: 'Tony Stark' },
  2: { companyName: 'Company B', dba: 'Company B Foundation', apLegalName: 'Company B LLC', apEffectiveStartDate: '07/01/2024', apEffectiveEndDate: '', apSicCode: '6311', apPhysicalAddress1: '1007 Mountain Drive', apPhysicalAddress2: '', apPhysicalCity: 'Gotham', apPhysicalState: 'NY', apPhysicalZip: '10001', apPhysicalCountry: 'USA', apMailingAddress1: '1007 Mountain Drive', apMailingAddress2: '', apMailingCity: 'Gotham', apMailingState: 'NY', apMailingZip: '10001', apMailingCountry: 'USA', planSponsorOptions: 'Option 1 - D3-D8 and PBM portion of narrative posted to Liviniti Client Portal for retrieval', reportingPeriodOccurance: 'Annually', groupHealthPlanName: 'Company B Health Plan', groupHealthPlan: '87654321', carveOutBenefit: 'Pharmacy Only', form5500Plan: '502', states: ['TX', 'FL'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '500', option2Acknowledged: false, legalAcknowledged: false, planSponsorLegalName: 'Company B LLC', planSponsorEin: '987654321', tpaName: 'Allied Benefit Solutions', tpaEin: '368799581', authorize: 'no', gagFeeAcknowledged: false, gagAuthorityAcknowledged: false, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '09/30/2024', reportingEntityType: 'Church plan', planNumber: '', reportingEntityName: 'Company B LLC', reportingEntityEin: '987654321', attestationAgreement: ['Pharmacy Benefits'], agreementTypes: 'Type 2', mailingAddress1: '1007 Mountain Drive', mailingAddress2: '', city: 'Gotham', mailingState: 'NY', zipCode: '10001', contactFirstName: 'Bruce', contactLastName: 'Wayne', contactEmail: 'bruce.wayne@companyb.com', contactPhoneNumber: '555-234-5678', billingOrganization: 'Company B', billingFirstName: 'Alfred', billingLastName: 'Pennyworth', billingEmail: 'alfred.pennyworth@companyb.com', billingPhoneNumber: '555-876-5432', eSignature: 'Bruce Wayne' },
  3: { companyName: 'Company C', dba: 'Company C', apLegalName: 'Company C Corp.', apEffectiveStartDate: '01/01/2025', apEffectiveEndDate: '', apSicCode: '2836', apPhysicalAddress1: '21440 Chase Dr', apPhysicalAddress2: '', apPhysicalCity: 'Fremont', apPhysicalState: 'CA', apPhysicalZip: '94539', apPhysicalCountry: 'USA', apMailingAddress1: '21440 Chase Dr', apMailingAddress2: '', apMailingCity: 'Fremont', apMailingState: 'CA', apMailingZip: '94539', apMailingCountry: 'USA', planSponsorOptions: 'Option 1 - D3-D8 and PBM portion of narrative posted to Liviniti Client Portal for retrieval', reportingPeriodOccurance: 'Current Reporting Period', groupHealthPlanName: 'Company C Health Plan', groupHealthPlan: '11223344', carveOutBenefit: 'Specialty Drug Only', form5500Plan: '503', states: ['IL', 'GA'], marketSegment: 'Commercial Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '100', option2Acknowledged: false, legalAcknowledged: false, planSponsorLegalName: 'Company C Corp.', planSponsorEin: '112233445', tpaName: 'Allied Benefit Solutions', tpaEin: '368799581', authorize: 'no', gagFeeAcknowledged: false, gagAuthorityAcknowledged: false, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '01/31/2025', reportingEntityType: '(Non-Federal) governmental group health plan', planNumber: '', reportingEntityName: 'Company C Corp.', reportingEntityEin: '112233445', attestationAgreement: ['Behavioral Health'], agreementTypes: 'Type 3', mailingAddress1: '21440 Chase Dr', mailingAddress2: '', city: 'Fremont', mailingState: 'CA', zipCode: '94539', contactFirstName: 'Miles', contactLastName: 'Dyson', contactEmail: 'miles.dyson@companyc.com', contactPhoneNumber: '555-345-6789', billingOrganization: 'Company C', billingFirstName: 'Sarah', billingLastName: 'Connor', billingEmail: 'sarah.connor@companyc.com', billingPhoneNumber: '555-765-4321', eSignature: 'Miles Dyson' },
  4: { companyName: 'Company D', dba: 'Company D Industries', apLegalName: 'Company D Industries', apEffectiveStartDate: '07/01/2024', apEffectiveEndDate: '', apSicCode: '3827', apPhysicalAddress1: '200 Park Ave', apPhysicalAddress2: '', apPhysicalCity: 'New York', apPhysicalState: 'NY', apPhysicalZip: '10166', apPhysicalCountry: 'USA', apMailingAddress1: '200 Park Ave', apMailingAddress2: '', apMailingCity: 'New York', apMailingState: 'NY', apMailingZip: '10166', apMailingCountry: 'USA', planSponsorOptions: 'Option 2 - D3-D8, PBM portion of narrative submitted to CMS on behalf of client, fee applicable', reportingPeriodOccurance: 'Annually', groupHealthPlanName: 'Company D Industries Health Plan', groupHealthPlan: '44332211', carveOutBenefit: 'Fertility Only', form5500Plan: '504', states: ['PA', 'OH'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '07/01/2024', planYearEndDate: '06/30/2025', membersAsOf: '750', option2Acknowledged: true, legalAcknowledged: true, planSponsorLegalName: 'Company D Industries', planSponsorEin: '443322110', tpaName: 'Allied Benefit Solutions', tpaEin: '368799581', authorize: 'no', gagFeeAcknowledged: false, gagAuthorityAcknowledged: false, reportingPeriod: 'benefit-period', effectiveStartDate: '07/01/2024', effectiveEndDate: '06/30/2025', reportingEntityType: 'ERISA group health plan (GHP)', planNumber: '502', reportingEntityName: 'Company D Industries', reportingEntityEin: '443322110', attestationAgreement: ['Medical', 'Pharmacy Benefits'], agreementTypes: 'Type 4', mailingAddress1: '200 Park Ave', mailingAddress2: '', city: 'New York', mailingState: 'NY', zipCode: '10166', contactFirstName: 'Norman', contactLastName: 'Osborn', contactEmail: 'norman.osborn@companyd.com', contactPhoneNumber: '555-456-7890', billingOrganization: 'Company D', billingFirstName: 'Harry', billingLastName: 'Osborn', billingEmail: 'harry.osborn@companyd.com', billingPhoneNumber: '555-654-3210', eSignature: 'Norman Osborn' },
  5: { companyName: 'Company E', dba: 'Company E', apLegalName: 'Company E Corporation', apEffectiveStartDate: '01/01/2025', apEffectiveEndDate: '', apSicCode: '8731', apPhysicalAddress1: '1238 W 6th St', apPhysicalAddress2: '', apPhysicalCity: 'Los Angeles', apPhysicalState: 'CA', apPhysicalZip: '90017', apPhysicalCountry: 'USA', apMailingAddress1: '1238 W 6th St', apMailingAddress2: '', apMailingCity: 'Los Angeles', apMailingState: 'CA', apMailingZip: '90017', apMailingCountry: 'USA', planSponsorOptions: '', reportingPeriodOccurance: '', groupHealthPlanName: '', groupHealthPlan: '99887766', carveOutBenefit: 'Pharmacy Only', form5500Plan: '505', states: ['WA', 'OR'], marketSegment: 'SF Large Employer Plans', planYearBeginDate: '01/01/2025', planYearEndDate: '12/31/2025', membersAsOf: '300', option2Acknowledged: false, legalAcknowledged: false, planSponsorLegalName: 'Company E Corporation', planSponsorEin: '998877665', tpaName: 'Allied Benefit Solutions', tpaEin: '368799581', authorize: 'no', gagFeeAcknowledged: false, gagAuthorityAcknowledged: false, reportingPeriod: 'plan-year', effectiveStartDate: '01/01/2025', effectiveEndDate: '03/31/2025', reportingEntityType: 'Church plan', planNumber: '', reportingEntityName: 'Company E Corporation', reportingEntityEin: '998877665', attestationAgreement: ['All'], agreementTypes: 'Type 5', mailingAddress1: '1238 W 6th St', mailingAddress2: '', city: 'Los Angeles', mailingState: 'CA', zipCode: '90017', contactFirstName: 'Eldon', contactLastName: 'Tyrell', contactEmail: 'eldon.tyrell@companye.com', contactPhoneNumber: '555-567-8901', billingOrganization: 'Company E', billingFirstName: 'Rachael', billingLastName: 'Tyrell', billingEmail: 'rachael.tyrell@companye.com', billingPhoneNumber: '555-543-2109', eSignature: 'Eldon Tyrell' },
};

const selectedAccountData = computed<CompanyData>(() => {
  if (selectedAccount.value && companyData[selectedAccount.value]) {
    return companyData[selectedAccount.value];
  }
  return {
    companyName: '',
    dba: '',
    apLegalName: '',
    apEffectiveStartDate: '',
    apEffectiveEndDate: '',
    apSicCode: '',
    apPhysicalAddress1: '',
    apPhysicalAddress2: '',
    apPhysicalCity: '',
    apPhysicalState: '',
    apPhysicalZip: '',
    apPhysicalCountry: '',
    apMailingAddress1: '',
    apMailingAddress2: '',
    apMailingCity: '',
    apMailingState: '',
    apMailingZip: '',
    apMailingCountry: '',
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
    authorize: 'no',
    gagFeeAcknowledged: false,
    gagAuthorityAcknowledged: false,
    reportingPeriod: null,
    effectiveStartDate: null,
    effectiveEndDate: null,
    reportingEntityType: '',
    reportingEntityName: '',
    reportingEntityEin: '',
    planNumber: '',
    attestationAgreement: [],
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

const isEditingAccountProfile = ref(false);
const isEditingAboutCompany = ref(false);
const sameAsPhysical = ref(false);

const editableCompanyData = ref<Partial<CompanyData>>({
  companyName: '',
  dba: '',
  apLegalName: '',
  apEffectiveStartDate: '',
  apEffectiveEndDate: '',
  apSicCode: '',
  apPhysicalAddress1: '',
  apPhysicalAddress2: '',
  apPhysicalCity: '',
  apPhysicalState: '',
  apPhysicalZip: '',
  apPhysicalCountry: '',
  apMailingAddress1: '',
  apMailingAddress2: '',
  apMailingCity: '',
  apMailingState: '',
  apMailingZip: '',
  apMailingCountry: '',
});

const toggleSameAsPhysical = () => {
  sameAsPhysical.value = !sameAsPhysical.value;
  if (sameAsPhysical.value) {
    editableCompanyData.value.apMailingAddress1 = editableCompanyData.value.apPhysicalAddress1;
    editableCompanyData.value.apMailingAddress2 = editableCompanyData.value.apPhysicalAddress2;
    editableCompanyData.value.apMailingCity = editableCompanyData.value.apPhysicalCity;
    editableCompanyData.value.apMailingState = editableCompanyData.value.apPhysicalState;
    editableCompanyData.value.apMailingZip = editableCompanyData.value.apPhysicalZip;
    editableCompanyData.value.apMailingCountry = editableCompanyData.value.apPhysicalCountry;
  }
};

const isEditingCaaOption = ref(false);
const isEditingBenefitDetails = ref(false);
const isEditingPlanSponsor = ref(false);
const isCaaReportingFilesOpen = ref(false);

// Editing-deadline lockout, aligned to Master's CAA*LockoutDateInclusive config gate
// (enforced server-side there; here it's just a UI flag since this prototype has no backend).
// Defaults to editable — flip to false to preview the locked/read-only state.
const canEditCaaDrugCostReporting = ref(true);
const canEditGagClauseAttestation = ref(true);

// Same EIN format rule as Master's settingsFormat.ts einListRule — 9 digits per EIN,
// multiple EINs separated by a semicolon.
const einListRule = (value: string | null | undefined, maxLength?: number): string => {
  if (!value) return '';
  if (maxLength && value.length > maxLength) return `Must be ${maxLength} characters or fewer`;
  const segments = value.split(';');
  const allValid = segments.every(segment => /^\d{9}$/.test(segment));
  return allValid ? '' : 'Enter each EIN as exactly 9 digits; separate multiple EINs with a semicolon (e.g. 123456789;987654321)';
};
const caaEinErrors = ref({ planSponsorEin: '', tpaEin: '' });
const gagClauseEinError = ref('');

const isEditingGagAuthorization = ref(false);
const isEditingGagReportingPeriod = ref(false);
const isEditingGagEntityDetails = ref(false);
const isEditingGagBillingContact = ref(false);
const isEditingGagAcknowledgement = ref(false);

const editableGagClauseData = ref<Partial<CompanyData>>({
  authorize: 'no',
  gagFeeAcknowledged: false,
  gagAuthorityAcknowledged: false,
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
      apLegalName: companyData[newVal].apLegalName,
      apEffectiveStartDate: companyData[newVal].apEffectiveStartDate,
      apEffectiveEndDate: companyData[newVal].apEffectiveEndDate,
      apSicCode: companyData[newVal].apSicCode,
      apPhysicalAddress1: companyData[newVal].apPhysicalAddress1,
      apPhysicalAddress2: companyData[newVal].apPhysicalAddress2,
      apPhysicalCity: companyData[newVal].apPhysicalCity,
      apPhysicalState: companyData[newVal].apPhysicalState,
      apPhysicalZip: companyData[newVal].apPhysicalZip,
      apPhysicalCountry: companyData[newVal].apPhysicalCountry,
      apMailingAddress1: companyData[newVal].apMailingAddress1,
      apMailingAddress2: companyData[newVal].apMailingAddress2,
      apMailingCity: companyData[newVal].apMailingCity,
      apMailingState: companyData[newVal].apMailingState,
      apMailingZip: companyData[newVal].apMailingZip,
      apMailingCountry: companyData[newVal].apMailingCountry,
    };
    isEditingAccountProfile.value = false;
    isEditingAboutCompany.value = false;
    sameAsPhysical.value = false;
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
      gagFeeAcknowledged: companyData[newVal].gagFeeAcknowledged,
      gagAuthorityAcknowledged: companyData[newVal].gagAuthorityAcknowledged,
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
    isEditingGagAuthorization.value = false;
    isEditingGagReportingPeriod.value = false;
    isEditingGagEntityDetails.value = false;
    isEditingGagBillingContact.value = false;
    isEditingGagAcknowledgement.value = false;
  } else {
    // Reset Company data
    editableCompanyData.value = {
      companyName: '',
      dba: '',
      apLegalName: '',
      apEffectiveStartDate: '',
      apEffectiveEndDate: '',
      apSicCode: '',
      apPhysicalAddress1: '',
      apPhysicalAddress2: '',
      apPhysicalCity: '',
      apPhysicalState: '',
      apPhysicalZip: '',
      apPhysicalCountry: '',
      apMailingAddress1: '',
      apMailingAddress2: '',
      apMailingCity: '',
      apMailingState: '',
      apMailingZip: '',
      apMailingCountry: '',
    };
    isEditingAccountProfile.value = false;
    isEditingAboutCompany.value = false;
    sameAsPhysical.value = false;
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
      authorize: 'no',
      gagFeeAcknowledged: false,
      gagAuthorityAcknowledged: false,
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
    isEditingGagAuthorization.value = false;
    isEditingGagReportingPeriod.value = false;
    isEditingGagEntityDetails.value = false;
    isEditingGagBillingContact.value = false;
    isEditingGagAcknowledgement.value = false;
  }
}, { immediate: true });

const updateCaaField = (field: string, value: any) => {
  (editableCaaData.value as any)[field] = value;
};

const caaOptionSelected = computed(() => !!editableCaaData.value.planSponsorOptions);
const caaIsOption1 = computed(() => editableCaaData.value.planSponsorOptions?.includes('Option 1'));
const caaIsOption2 = computed(() => editableCaaData.value.planSponsorOptions?.includes('Option 2'));

const saveAccountProfileChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCompanyData.value);
    isEditingAccountProfile.value = false;
    showSnackbar.value = true;
  }
};

const cancelAccountProfileChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    editableCompanyData.value.companyName = saved.companyName;
    editableCompanyData.value.dba = saved.dba;
    editableCompanyData.value.apLegalName = saved.apLegalName;
    editableCompanyData.value.apEffectiveStartDate = saved.apEffectiveStartDate;
    editableCompanyData.value.apEffectiveEndDate = saved.apEffectiveEndDate;
    isEditingAccountProfile.value = false;
  }
};

const saveAboutCompanyChanges = () => {
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCompanyData.value);
    isEditingAboutCompany.value = false;
    sameAsPhysical.value = false;
    showSnackbar.value = true;
  }
};

const cancelAboutCompanyChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    editableCompanyData.value.apSicCode = saved.apSicCode;
    editableCompanyData.value.apPhysicalAddress1 = saved.apPhysicalAddress1;
    editableCompanyData.value.apPhysicalAddress2 = saved.apPhysicalAddress2;
    editableCompanyData.value.apPhysicalCity = saved.apPhysicalCity;
    editableCompanyData.value.apPhysicalState = saved.apPhysicalState;
    editableCompanyData.value.apPhysicalZip = saved.apPhysicalZip;
    editableCompanyData.value.apPhysicalCountry = saved.apPhysicalCountry;
    editableCompanyData.value.apMailingAddress1 = saved.apMailingAddress1;
    editableCompanyData.value.apMailingAddress2 = saved.apMailingAddress2;
    editableCompanyData.value.apMailingCity = saved.apMailingCity;
    editableCompanyData.value.apMailingState = saved.apMailingState;
    editableCompanyData.value.apMailingZip = saved.apMailingZip;
    editableCompanyData.value.apMailingCountry = saved.apMailingCountry;
    isEditingAboutCompany.value = false;
    sameAsPhysical.value = false;
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
  const planSponsorEinError = einListRule(editableCaaData.value.planSponsorEin);
  const tpaEinError = einListRule(editableCaaData.value.tpaEin);
  caaEinErrors.value = { planSponsorEin: planSponsorEinError, tpaEin: tpaEinError };
  if (planSponsorEinError || tpaEinError) return;
  if (selectedAccount.value) {
    Object.assign(companyData[selectedAccount.value], editableCaaData.value);
    isEditingPlanSponsor.value = false;
    showSnackbar.value = true;
  }
};

const saveGagAuthorizationChanges = () => {
  if (selectedAccount.value) {
    if (editableGagClauseData.value.authorize !== 'yes') editableGagClauseData.value.gagFeeAcknowledged = false;
    companyData[selectedAccount.value].authorize = editableGagClauseData.value.authorize ?? 'no';
    companyData[selectedAccount.value].gagFeeAcknowledged = editableGagClauseData.value.gagFeeAcknowledged ?? false;
    isEditingGagAuthorization.value = false;
    showSnackbar.value = true;
  }
};

const saveGagReportingPeriodChanges = () => {
  if (selectedAccount.value) {
    companyData[selectedAccount.value].reportingPeriod = editableGagClauseData.value.reportingPeriod ?? null;
    companyData[selectedAccount.value].effectiveStartDate = editableGagClauseData.value.effectiveStartDate ?? null;
    companyData[selectedAccount.value].effectiveEndDate = editableGagClauseData.value.effectiveEndDate ?? null;
    isEditingGagReportingPeriod.value = false;
    showSnackbar.value = true;
  }
};

const saveGagEntityDetailsChanges = () => {
  gagClauseEinError.value = einListRule(editableGagClauseData.value.reportingEntityEin, 50);
  if (gagClauseEinError.value) return;
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    saved.reportingEntityType = editableGagClauseData.value.reportingEntityType ?? '';
    saved.reportingEntityName = editableGagClauseData.value.reportingEntityName ?? '';
    saved.reportingEntityEin = editableGagClauseData.value.reportingEntityEin ?? '';
    saved.attestationAgreement = editableGagClauseData.value.attestationAgreement ?? [];
    saved.agreementTypes = editableGagClauseData.value.agreementTypes ?? '';
    saved.mailingAddress1 = editableGagClauseData.value.mailingAddress1 ?? '';
    saved.mailingAddress2 = editableGagClauseData.value.mailingAddress2 ?? '';
    saved.city = editableGagClauseData.value.city ?? '';
    saved.mailingState = editableGagClauseData.value.mailingState ?? '';
    saved.zipCode = editableGagClauseData.value.zipCode ?? '';
    saved.contactFirstName = editableGagClauseData.value.contactFirstName ?? '';
    saved.contactLastName = editableGagClauseData.value.contactLastName ?? '';
    saved.contactEmail = editableGagClauseData.value.contactEmail ?? '';
    saved.contactPhoneNumber = editableGagClauseData.value.contactPhoneNumber ?? '';
    isEditingGagEntityDetails.value = false;
    showSnackbar.value = true;
  }
};

const saveGagBillingContactChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    saved.billingOrganization = editableGagClauseData.value.billingOrganization ?? '';
    saved.billingFirstName = editableGagClauseData.value.billingFirstName ?? '';
    saved.billingLastName = editableGagClauseData.value.billingLastName ?? '';
    saved.billingEmail = editableGagClauseData.value.billingEmail ?? '';
    saved.billingPhoneNumber = editableGagClauseData.value.billingPhoneNumber ?? '';
    isEditingGagBillingContact.value = false;
    showSnackbar.value = true;
  }
};

const saveGagAcknowledgementChanges = () => {
  if (selectedAccount.value) {
    companyData[selectedAccount.value].gagAuthorityAcknowledged = editableGagClauseData.value.gagAuthorityAcknowledged ?? false;
    companyData[selectedAccount.value].eSignature = editableGagClauseData.value.eSignature ?? '';
    isEditingGagAcknowledgement.value = false;
    showSnackbar.value = true;
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
    caaEinErrors.value = { planSponsorEin: '', tpaEin: '' };
  }
};

const cancelGagAuthorizationChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    editableGagClauseData.value.authorize = saved.authorize;
    editableGagClauseData.value.gagFeeAcknowledged = saved.gagFeeAcknowledged;
    isEditingGagAuthorization.value = false;
  }
};

const cancelGagReportingPeriodChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    editableGagClauseData.value.reportingPeriod = saved.reportingPeriod;
    editableGagClauseData.value.effectiveStartDate = saved.effectiveStartDate;
    editableGagClauseData.value.effectiveEndDate = saved.effectiveEndDate;
    isEditingGagReportingPeriod.value = false;
  }
};

const cancelGagEntityDetailsChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    editableGagClauseData.value.reportingEntityType = saved.reportingEntityType;
    editableGagClauseData.value.reportingEntityName = saved.reportingEntityName;
    editableGagClauseData.value.reportingEntityEin = saved.reportingEntityEin;
    editableGagClauseData.value.attestationAgreement = saved.attestationAgreement;
    editableGagClauseData.value.agreementTypes = saved.agreementTypes;
    editableGagClauseData.value.mailingAddress1 = saved.mailingAddress1;
    editableGagClauseData.value.mailingAddress2 = saved.mailingAddress2;
    editableGagClauseData.value.city = saved.city;
    editableGagClauseData.value.mailingState = saved.mailingState;
    editableGagClauseData.value.zipCode = saved.zipCode;
    editableGagClauseData.value.contactFirstName = saved.contactFirstName;
    editableGagClauseData.value.contactLastName = saved.contactLastName;
    editableGagClauseData.value.contactEmail = saved.contactEmail;
    editableGagClauseData.value.contactPhoneNumber = saved.contactPhoneNumber;
    isEditingGagEntityDetails.value = false;
    gagClauseEinError.value = '';
  }
};

const cancelGagBillingContactChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    editableGagClauseData.value.billingOrganization = saved.billingOrganization;
    editableGagClauseData.value.billingFirstName = saved.billingFirstName;
    editableGagClauseData.value.billingLastName = saved.billingLastName;
    editableGagClauseData.value.billingEmail = saved.billingEmail;
    editableGagClauseData.value.billingPhoneNumber = saved.billingPhoneNumber;
    isEditingGagBillingContact.value = false;
  }
};

const cancelGagAcknowledgementChanges = () => {
  if (selectedAccount.value) {
    const saved = companyData[selectedAccount.value];
    editableGagClauseData.value.gagAuthorityAcknowledged = saved.gagAuthorityAcknowledged;
    editableGagClauseData.value.eSignature = saved.eSignature;
    isEditingGagAcknowledgement.value = false;
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

// Aligned to Master (Alex's build) 2026-08-07 — was ['SF Small Employer Plans', 'SF Large Employer Plans']
const marketSegments = ref([
  'SF Large Employer Plans',
  'Commercial Plans',
  'Government Plans',
  'Individual Plans',
]);

// "Specialty Drug Only" (no "s") aligned to Master's wording 2026-08-07
const carveOutBenefits = ref([
  'Pharmacy Only',
  'Fertility Only',
  'Specialty Drug Only',
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

const reportingEntityTypeOptions = ref([
  'Church plan',
  'ERISA group health plan (GHP)',
  '(Non-Federal) governmental group health plan',
]);

const attestationAgreements = ref([
  'All',
  'Medical',
  'Pharmacy Benefits',
  'Behavioral Health',
  'Other',
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
  { title: 'User', key: 'user' },
  { title: 'Role', key: 'role' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Permissions', key: 'permissionsLabel', width: '260px' },
  { title: 'Activated', key: 'activated', align: 'center' },
  { title: 'Main POC', key: 'mainPoc', align: 'center' },
  { title: 'Survey Contact', key: 'surveyContact', align: 'center' },
  { title: '', key: 'actions', align: 'end', sortable: false },
]);

// Same permission taxonomy as Account Profile > Client/Vendor Contacts — see
// project_contacts_roles_design_decisions.md. Kept in sync manually since this
// prototype has no shared store; a real build would source both from one place.
const userAdminPermissionOptions = [
  { key: 'reports', label: 'Reports' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'rebates', label: 'Rebates' },
  { key: 'highCostNotifications', label: 'High Cost Notifications' },
  { key: 'planChanges', label: 'Plan Changes' },
  { key: 'planApproval', label: 'Plan Approval' },
  { key: 'overrides', label: 'Overrides' },
  { key: 'vcpClaims', label: 'VCP Claims' },
];
// Client Portal only assigns Client and external Carrier/vendor roles — Administrator and
// Liviniti internal staff roles (Account Manager, Implementation Coordinator, etc.) are
// assigned in SoloRx, not here.
const userAdminRoleOptions = ['Client', 'Broker', 'Consultant', 'Carrier', 'TPV'];
const userAdminExternalRoles = ['Broker', 'Consultant', 'Carrier', 'TPV'];
const newUserAdminPermissions = (): Record<string, boolean> => ({ reports: false, invoices: false, rebates: false, highCostNotifications: false, planChanges: false, planApproval: false, overrides: false, vcpClaims: false });
const permissionsLabel = (_role: string, permissions: Record<string, boolean>) => {
  const selected = userAdminPermissionOptions.filter(p => permissions[p.key]).map(p => p.label);
  return selected.length ? selected.join(', ') : 'None';
};

interface UserAdminEntry {
  user: string;
  email: string;
  phone: string;
  phones?: { number: string; type: string; ext: string }[];
  primaryPhoneIdx?: number;
  vendor?: string;
  role: string;
  permissions: Record<string, boolean>;
  permissionsLabel: string;
  allowPhi: boolean;
  activated: boolean;
  mainPoc: boolean;
  surveyContact: boolean;
  ackConfirmed: boolean;
}

const allUserAdminPermissions = (): Record<string, boolean> => ({ reports: true, invoices: true, rebates: true, highCostNotifications: true, planChanges: true, planApproval: true, overrides: true, vcpClaims: true });
const userAdminByAccount = ref<{ [key: number]: UserAdminEntry[] }>({
  1: [
    { user: 'Tony Stark', email: 'tony.stark@companya.com', phone: '(555) 234-5678', phones: [{ number: '(555) 234-5678', type: 'Office', ext: '' }], primaryPhoneIdx: 0, role: 'Client', permissions: allUserAdminPermissions(), permissionsLabel: 'All', allowPhi: true, activated: true, mainPoc: true, surveyContact: false, ackConfirmed: false },
    { user: 'Pepper Potts', email: 'pepper.potts@companya.com', phone: '(555) 234-5679', phones: [{ number: '(555) 234-5679', type: 'Office', ext: '' }], primaryPhoneIdx: 0, role: 'Client', permissions: allUserAdminPermissions(), permissionsLabel: 'All', allowPhi: true, activated: true, mainPoc: false, surveyContact: true, ackConfirmed: false },
  ],
  2: [
    { user: 'Bruce Wayne', email: 'bruce.wayne@companyb.com', phone: '(555) 876-5432', phones: [{ number: '(555) 876-5432', type: 'Office', ext: '' }], primaryPhoneIdx: 0, role: 'Client', permissions: allUserAdminPermissions(), permissionsLabel: 'All', allowPhi: true, activated: true, mainPoc: true, surveyContact: false, ackConfirmed: false },
    { user: 'Lucius Fox', email: 'lucius.fox@companyb.com', phone: '(555) 876-5433', phones: [{ number: '(555) 876-5433', type: 'Office', ext: '' }], primaryPhoneIdx: 0, role: 'Client', permissions: { reports: true, invoices: true, rebates: true, highCostNotifications: true, planChanges: false, planApproval: false, overrides: false, vcpClaims: false }, permissionsLabel: 'Reports, Invoices, Rebates, High Cost Notifications', allowPhi: false, activated: true, mainPoc: false, surveyContact: true, ackConfirmed: false },
    { user: 'Alfred Pennyworth', email: 'alfred.pennyworth@companyb.com', phone: '(555) 876-5434', phones: [{ number: '(555) 876-5434', type: 'Office', ext: '' }], primaryPhoneIdx: 0, role: 'Client', permissions: { reports: true, invoices: false, rebates: false, highCostNotifications: true, planChanges: false, planApproval: false, overrides: false, vcpClaims: false }, permissionsLabel: 'Reports, High Cost Notifications', allowPhi: true, activated: false, mainPoc: false, surveyContact: false, ackConfirmed: false },
    { user: 'Alicia Reyes', email: 'areyes@gothamhealth.com', phone: '(212) 555-0177', phones: [{ number: '(212) 555-0177', type: 'Office', ext: '' }], primaryPhoneIdx: 0, role: 'Carrier', vendor: 'Gotham Health Partners', permissions: { reports: true, invoices: false, rebates: false, highCostNotifications: false, planChanges: false, planApproval: false, overrides: false, vcpClaims: false }, permissionsLabel: 'Reports', allowPhi: false, activated: true, mainPoc: false, surveyContact: true, ackConfirmed: false },
  ],
  3: [],
  4: [],
  5: [],
});

// Vendor contacts already associated to the account in SoloRx (Solo2) — sourced from a
// dropdown here rather than typed manually, same pattern as Account Profile > Vendor
// Contacts. Kept as a local mock per-account directory since this prototype has no
// shared store; a real build would pull this from Solo2.
const userAdminVendorDirectory: { [key: number]: { name: string; vendor: string; email: string; phone: string }[] } = {
  1: [
    { name: 'Mark Tillman', vendor: 'Southern Scripts Carrier', email: 'mtillman@sstpa.com', phone: '(704) 555-0121' },
    { name: 'Dana Osei', vendor: 'Southern Scripts Carrier', email: 'dosei@sstpa.com', phone: '(704) 555-0122' },
    { name: 'Rachel Vance', vendor: 'Acclaim Benefits', email: 'rvance@acclaim.com', phone: '(615) 555-0188' },
    { name: 'James Pruitt', vendor: 'Acclaim Benefits', email: 'jpruitt@acclaim.com', phone: '(615) 555-0189' },
    { name: 'Tara Mendez', vendor: 'Benefit Advantage', email: 'tmendez@benefitadv.com', phone: '(512) 555-0144' },
  ],
  2: [
    { name: 'Alicia Reyes', vendor: 'Gotham Health Partners', email: 'areyes@gothamhealth.com', phone: '(212) 555-0177' },
  ],
  3: [],
  4: [],
  5: [],
};

const userAdminData = computed<UserAdminEntry[]>(() => (selectedAccount.value ? userAdminByAccount.value[selectedAccount.value] ?? [] : []));

// Company B (account id 2) is used to demo the client-side, read-only User Admin view
// (AM-09: clients see who has access but can't edit it). Picked over Company A/id 1
// since Plan Explorer's Account Profile is a single hardcoded object (not per-account)
// and always shows "Implementation" status — there's no real "Active" account to tie
// this to yet, so this is just a populated account (has a seeded user + vendor contact)
// rather than one of the empty ones (3-5).
const CLIENT_READONLY_USER_ADMIN_ACCOUNT_ID = 2;
const isClientUserAdminView = computed(() => selectedAccount.value === CLIENT_READONLY_USER_ADMIN_ACCOUNT_ID);

// Only vendor contacts not already added as a User Admin entry — mirrors Account Profile >
// Vendor Contacts' "already added" filter.
const userAdminVendorOptions = computed(() => {
  const directory = selectedAccount.value ? userAdminVendorDirectory[selectedAccount.value] ?? [] : [];
  const addedNames = new Set(userAdminData.value.map(u => u.user));
  const byVendor = new Map<string, string[]>();
  directory.filter(c => !addedNames.has(c.name)).forEach(c => {
    if (!byVendor.has(c.vendor)) byVendor.set(c.vendor, []);
    byVendor.get(c.vendor)!.push(c.name);
  });
  const result: (string | { type: string; title: string })[] = [];
  [...byVendor.keys()].sort().forEach(vendor => {
    result.push({ type: 'subheader', title: vendor });
    byVendor.get(vendor)!.forEach(name => result.push(name));
  });
  return result;
});

const { lcEditingHcn, lcNotifyThreshold, lcRecipients, lcHcnStartEdit, lcHcnSaveEdit, lcHcnCancelEdit } = useHighCostNotifications();
// Recipient choices sourced from this account's activated portal users — a previously
// selected name from Plan Explorer's broader contact list still displays even if it
// isn't a portal user here (see useHighCostNotifications.ts for why this stays synced).
const lcHcnContactOptions = computed(() => {
  const names = new Set(userAdminData.value.map(u => u.user));
  lcRecipients.value.forEach(name => names.add(name));
  return [...names].sort();
});

const userAdminRowActions = [
  { label: 'Edit', action: 'edit' },
  { label: 'Remove', action: 'remove' },
];

const uaPhoneTypes = ['Office', 'Cell', 'Fax'];
const uaNewPhone = () => ({ number: '', type: 'Office', ext: '' });
const formatPhone = (val: string): string => {
  const d = val.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const showUserAdminDialog = ref(false);
const userAdminDialogMode = ref<'add' | 'edit'>('add');
const userAdminEditingIndex = ref(-1);
const userAdminVendorSelection = ref('');
// Locked once a vendor-sourced user is being edited — their identity comes from the
// vendor's own record, not something Client Portal lets you rename.
const userAdminEditingIsVendorSourced = ref(false);
const newUserAdminForm = () => ({ firstName: '', lastName: '', email: '', phones: [uaNewPhone()], primaryPhoneIdx: 0, role: '', permissions: newUserAdminPermissions(), allowPhi: false, mainPoc: false, surveyContact: false, ackConfirmed: false });
const userAdminForm = ref(newUserAdminForm());
const userAdminErrors = ref({ firstName: '', lastName: '', email: '' });
watch(() => userAdminForm.value.phones, phones => {
  phones.forEach(ph => { const f = formatPhone(ph.number); if (f !== ph.number) ph.number = f; });
}, { deep: true });

const validateUserAdminForm = (form: { firstName: string; lastName: string; email: string }) => {
  const e = { firstName: '', lastName: '', email: '' };
  if (!form.firstName.trim()) e.firstName = 'First name is required.';
  if (!form.lastName.trim()) e.lastName = 'Last name is required.';
  if (!form.email.trim()) e.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
  return e;
};

// Mirrors the old portal's rule: only one Main Point of Contact per account.
const enforceSingleMainPoc = (entries: UserAdminEntry[], keepIdx: number) => {
  entries.forEach((entry, i) => { if (i !== keepIdx) entry.mainPoc = false; });
};
// Returns the other Main Point of Contact's name (old portal shows who to find and
// change), or '' if none — matches old Client Portal behavior.
const otherUserIsMainPoc = (excludeIdx: number): string => {
  const entries = selectedAccount.value ? userAdminByAccount.value[selectedAccount.value] : undefined;
  if (!entries) return '';
  const other = entries.find((entry, i) => i !== excludeIdx && entry.mainPoc);
  return other?.user ?? '';
};

const openAddUser = () => {
  userAdminDialogMode.value = 'add';
  userAdminForm.value = newUserAdminForm();
  userAdminVendorSelection.value = '';
  userAdminEditingIsVendorSourced.value = false;
  userAdminErrors.value = { firstName: '', lastName: '', email: '' };
  showUserAdminDialog.value = true;
};

const handleUserAdminRowAction = ({ action, item }: { action: string; item: UserAdminEntry }) => {
  const entries = selectedAccount.value ? userAdminByAccount.value[selectedAccount.value] : undefined;
  if (!entries) return;
  const idx = entries.indexOf(item);
  if (action === 'remove') {
    userAdminPendingRemoval.value = item;
    showRemoveUserDialog.value = true;
  } else if (action === 'edit') {
    const nameParts = item.user.split(' ');
    userAdminForm.value = {
      firstName: nameParts[0] ?? '',
      lastName: nameParts.slice(1).join(' '),
      email: item.email,
      phones: item.phones?.length ? item.phones.map(p => ({ ...p })) : [uaNewPhone()],
      primaryPhoneIdx: item.primaryPhoneIdx ?? 0,
      role: item.role,
      permissions: { ...item.permissions },
      allowPhi: item.allowPhi,
      mainPoc: item.mainPoc,
      surveyContact: item.surveyContact,
      ackConfirmed: item.ackConfirmed,
    };
    userAdminEditingIndex.value = idx;
    userAdminEditingIsVendorSourced.value = userAdminExternalRoles.includes(item.role);
    userAdminDialogMode.value = 'edit';
    userAdminErrors.value = { firstName: '', lastName: '', email: '' };
    showUserAdminDialog.value = true;
  }
};

const showRemoveUserDialog = ref(false);
const userAdminPendingRemoval = ref<UserAdminEntry | null>(null);

const cancelRemoveUser = () => {
  showRemoveUserDialog.value = false;
  userAdminPendingRemoval.value = null;
};

const confirmRemoveUser = () => {
  const entries = selectedAccount.value ? userAdminByAccount.value[selectedAccount.value] : undefined;
  if (entries && userAdminPendingRemoval.value) {
    const idx = entries.indexOf(userAdminPendingRemoval.value);
    if (idx > -1) entries.splice(idx, 1);
  }
  cancelRemoveUser();
};

const removeUserDialogActions = [
  { text: 'Cancel', onClick: cancelRemoveUser, styleType: 'secondary' as const },
  { text: 'Remove', onClick: confirmRemoveUser, type: 'destructive' as const },
];

const saveUserAdmin = () => {
  const f = userAdminForm.value;
  const isVendorRole = userAdminExternalRoles.includes(f.role);
  const isNewVendorPick = isVendorRole && userAdminDialogMode.value === 'add';

  if (isNewVendorPick) {
    userAdminErrors.value = { firstName: '', lastName: '', email: '' };
    if (!userAdminVendorSelection.value) return;
  } else if (!userAdminEditingIsVendorSourced.value) {
    const errors = validateUserAdminForm(f);
    userAdminErrors.value = errors;
    if (Object.values(errors).some(e => e)) return;
  }
  if (isVendorRole && !f.ackConfirmed) return;
  if (!selectedAccount.value) return;
  if (!userAdminByAccount.value[selectedAccount.value]) userAdminByAccount.value[selectedAccount.value] = [];
  const entries = userAdminByAccount.value[selectedAccount.value];

  let identity: { user: string; email: string; phone: string; phones?: { number: string; type: string; ext: string }[]; primaryPhoneIdx?: number; vendor?: string };
  if (isNewVendorPick) {
    const directory = userAdminVendorDirectory[selectedAccount.value] ?? [];
    const picked = directory.find(c => c.name === userAdminVendorSelection.value);
    if (!picked) return;
    identity = { user: picked.name, email: picked.email, phone: picked.phone, vendor: picked.vendor };
  } else if (userAdminEditingIsVendorSourced.value && userAdminEditingIndex.value > -1) {
    const existing = entries[userAdminEditingIndex.value];
    identity = { user: existing.user, email: existing.email, phone: existing.phone, vendor: existing.vendor };
  } else {
    const phones = f.phones.filter(p => p.number);
    const primaryIdx = f.primaryPhoneIdx;
    identity = {
      user: `${f.firstName} ${f.lastName}`,
      email: f.email,
      phones,
      primaryPhoneIdx: primaryIdx,
      phone: phones[primaryIdx]?.number ?? phones[0]?.number ?? '',
    };
  }

  const entry: UserAdminEntry = {
    ...identity,
    role: f.role,
    permissions: { ...f.permissions },
    permissionsLabel: permissionsLabel(f.role, f.permissions),
    allowPhi: f.allowPhi,
    activated: false,
    mainPoc: f.mainPoc,
    surveyContact: f.surveyContact,
    ackConfirmed: f.ackConfirmed,
  };
  if (userAdminDialogMode.value === 'edit' && userAdminEditingIndex.value > -1) {
    entry.activated = entries[userAdminEditingIndex.value].activated;
    entries[userAdminEditingIndex.value] = entry;
    if (entry.mainPoc) enforceSingleMainPoc(entries, userAdminEditingIndex.value);
  } else {
    entries.push(entry);
    if (entry.mainPoc) enforceSingleMainPoc(entries, entries.length - 1);
  }
  showUserAdminDialog.value = false;
};

const hasAnyPermission = (permissions: Record<string, boolean>) => Object.values(permissions).some(v => v);

const userAdminDialogActions = computed(() => [
  { text: 'Cancel', styleType: 'secondary' as const, onClick: () => { showUserAdminDialog.value = false; } },
  {
    text: userAdminDialogMode.value === 'add' ? 'Add User' : 'Save Changes',
    styleType: 'primary' as const,
    onClick: saveUserAdmin,
    disabled:
      !userAdminForm.value.role ||
      (userAdminExternalRoles.includes(userAdminForm.value.role) && !userAdminForm.value.ackConfirmed) ||
      (userAdminExternalRoles.includes(userAdminForm.value.role) && userAdminDialogMode.value === 'add' && !userAdminVendorSelection.value) ||
      !hasAnyPermission(userAdminForm.value.permissions),
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

  &--thirds .ap-field { flex: 1; }
}

.ap-subsection-heading {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  margin: $spacing-medium 0 $spacing-small;
}

.ap-mailing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: $spacing-medium 0 $spacing-small;

  .ap-subsection-heading {
    margin: 0;
  }
}

.ap-checkbox-toggle {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  cursor: pointer;
  user-select: none;

  &:hover .ap-checkbox-icon {
    color: $color-primary;
  }
}

.ap-checkbox-icon {
  color: $color-border;
  &--checked { color: $color-primary; }
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

.ua-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-medium;
  margin-bottom: $spacing-medium;
}

.ua-header-note {
  color: $color-text-secondary;
  margin: 0;
}

.ua-subsection-heading {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  margin: $spacing-medium 0 $spacing-small;
}

.ua-permission-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: $spacing-xsmall $spacing-medium;
  margin: $spacing-small 0;
}

.ua-role-note {
  color: $color-text-secondary;
  margin: $spacing-xsmall 0 $spacing-small;
}

.ua-required-asterisk {
  color: $color-error;
  margin-left: 2px;
}

.ua-required-legend {
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: $spacing-small 0;
}

.ua-checkbox-toggle {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  cursor: pointer;
  user-select: none;
  margin-bottom: $spacing-xsmall;

  &:hover .ua-checkbox-icon {
    color: $color-primary;
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;

    &:hover .ua-checkbox-icon {
      color: inherit;
    }
  }
}

.ua-checkbox-icon {
  color: $color-border;
  &--checked { color: $color-primary; }
}

.ua-table-check {
  color: $color-primary;
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
  margin-bottom: $spacing-medium;
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

.nl-repeatable-row {
  margin-bottom: $spacing-small;
}

.nl-row-divider {
  margin: $spacing-medium 0;
}

.nl-add-link {
  background: none;
  border: none;
  padding: 0;
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-link;
  cursor: pointer;
  margin-top: $spacing-small;

  &:hover { text-decoration: underline; }
}

.nl-repeatable-row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-small;
}

.nl-repeatable-row-label {
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.nl-remove-row-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: $color-text-secondary;
  border-radius: 4px;
  transition: color 0.15s, background-color 0.15s;

  &:hover {
    color: $color-error;
    background-color: rgba($color-error, 0.08);
  }
}

.ap-radio-option {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  padding: $spacing-xsmall 0;
  cursor: pointer;
}

.ap-radio-input {
  display: none;
}

.ap-radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid $color-border;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;

  &.active {
    border-color: $color-primary;
  }
}

.ap-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: $color-primary;
}

.ap-radio-label {
  font-size: $font-size-body;
  color: var(--color-text-primary);
}

.ua-permissions-cell {
  display: block;
  max-width: 260px;
  white-space: normal;
  word-break: break-word;
}

</style>
