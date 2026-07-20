
<template>
  <div>
    <AccountSelector
      heading="Plan Explorer"
      subheading="Track account implementations. Select an account to view its current status."
      :items="accountOptions"
      label="Select Account"
      item-title="name"
      item-value="id"
      :searchable="true"
      v-model="selectedAccount"
      :show-slot="false"
      variant="outlined"
    />

    <PageCard
      v-if="selectedAccount"
      :header-text="selectedAccountName"
      :description-text="selectedAccountDescription"
    >
      <!-- Wayne Enterprises: Active/fully-implemented view -->
      <div v-if="isWayneEnterprises" class="gap-view">
        <div class="gap-meta">
          <Building2 :size="14" :stroke-width="1.5" class="gap-meta-icon" />
          <span>Wayne Enterprises – 11250</span>
          <span class="gap-meta-dot">•</span>
          <span>Effective: 01/01/2026</span>
        </div>

        <div class="gap-search">
          <Search :size="16" :stroke-width="1.5" class="gap-search-icon" />
          <input class="gap-search-input" placeholder="Search for any field or value..." />
        </div>

        <div class="gap-accordion-list">
          <div class="gap-accordion-item" v-for="section in gapSections" :key="section.label">
            <component :is="section.icon" :size="18" :stroke-width="1.5" class="gap-accordion-icon" />
            <span class="gap-accordion-label">{{ section.label }}</span>
            <ChevronDown :size="18" :stroke-width="1.5" class="gap-accordion-chevron" />
          </div>
        </div>
      </div>

      <div v-else class="plan-explorer-content">
        <v-row :align="wizardActive && isWizardAccount ? 'start' : undefined" no-gutters>
          <!-- LEFT: Timeline -->
          <v-col cols="12" md="auto" :class="{ 'plan-col--sticky': wizardActive && isWizardAccount }">
            <div :class="['plan-timeline-wrapper', { 'plan-timeline-wrapper--sticky': wizardActive && isWizardAccount }]">
            <v-timeline side="start" class="plan-timeline">
              <v-timeline-item
                v-for="(step, index) in implementationSteps"
                :key="index"
                :dot-color="step.status === 'completed' ? 'success' : step.status === 'in-progress' ? 'primary' : 'grey-lighten-1'"
                size="small"
                :class="{ 'v-timeline-item--has-sub-steps': step.title === 'Plan Setup' && isWizardAccount && step.active }"
                @click="selectTimelineItem(step)"
              >
                <v-card class="timeline-card" :class="{ 'active-card': step.active }">
                  <v-card-title class="text-h4">{{ step.title }}</v-card-title>
                  <v-card-text>{{ step.description }}</v-card-text>
                </v-card>

                <!-- Wizard sub-steps nested below Plan Setup (wizard accounts only) -->
                <div
                  v-if="step.title === 'Plan Setup' && isWizardAccount && step.active"
                  class="wizard-sub-steps"
                >
                  <ul class="wizard-sub-step-list">
                    <li
                      v-for="(wStep, wIndex) in wizardSteps"
                      :key="wIndex"
                      :class="['wizard-sub-step-item', {
                        'wizard-sub-step-item--active': wizardActive && currentWizardStep === wIndex,
                        'wizard-sub-step-item--complete': wStep.status === 'complete',
                      }]"
                      @click.stop="selectWizardStep(wIndex)"
                    >
                      <span class="wizard-sub-step-number">
                        <Check v-if="wStep.status === 'complete'" :size="12" :stroke-width="2.5" />
                        <template v-else>{{ wIndex + 1 }}</template>
                      </span>
                      <span class="wizard-sub-step-name">{{ wStep.name }}</span>
                    </li>
                  </ul>
                </div>
              </v-timeline-item>
            </v-timeline>
            </div>
          </v-col>

          <!-- RIGHT: Content panel -->
          <v-col cols="12" class="plan-col--right">

            <!-- Wizard step content (wizard accounts, Plan Setup active, sub-step selected) -->
            <div v-if="wizardActive && isWizardAccount && activeTimelineItem?.title === 'Plan Setup'">
              <div class="wizard-step-header">
                <div class="wizard-step-header-meta">
                  <span class="wizard-step-counter">Step {{ currentWizardStep + 1 }} of {{ wizardSteps.length }}</span>
                </div>
                <h2 class="text-h2 wizard-step-title">{{ wizardSteps[currentWizardStep].name }}</h2>
                <p class="text-body wizard-step-description">{{ wizardSteps[currentWizardStep].description }}</p>
              </div>

              <div class="wizard-step-body">
                <!-- Step 1: Account Profile -->
                <template v-if="currentWizardStep === 0">

                  <!-- Section: Account Profile -->
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Account Profile</h4>
                      <button v-if="!editingAccountProfile" class="button button-thirtiary" @click="startEditAccountProfile">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>

                    <div class="ap-fields">
                      <template v-if="!editingAccountProfile">
                        <div class="ap-field-row ap-field-row--multi ap-field-row--thirds">
                          <div class="ap-field">
                            <span class="ap-field-label">Account name</span>
                            <span class="ap-field-value">{{ accountProfile.accountName || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Legal Name</span>
                            <span class="ap-field-value">{{ accountProfile.legalName || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">DBA</span>
                            <span class="ap-field-value">{{ accountProfile.dba || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row ap-field-row--multi">
                          <div class="ap-field">
                            <span class="ap-field-label">Effective start date</span>
                            <span class="ap-field-value">{{ accountProfile.effectiveStartDate || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Effective end date</span>
                            <span class="ap-field-value">{{ accountProfile.effectiveEndDate || '—' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="form-row">
                          <TextField v-model="editableAccountProfile.accountName" label="Account name" />
                          <TextField v-model="editableAccountProfile.legalName" label="Legal Name" />
                          <TextField v-model="editableAccountProfile.dba" label="DBA" />
                        </div>
                        <div class="form-row">
                          <TextField v-model="editableAccountProfile.effectiveStartDate" label="Effective start date" placeholder="MM/DD/YYYY" />
                          <TextField v-model="editableAccountProfile.effectiveEndDate" label="Effective end date" placeholder="MM/DD/YYYY" />
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="saveAccountProfile">Save Changes</button>
                          <button class="button button-secondary" @click="cancelEditAccountProfile">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Section: About This Company -->
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">About This Company</h4>
                      <button v-if="!editingCompanyInfo" class="button button-thirtiary" @click="startEditCompanyInfo">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>

                    <div class="ap-fields">
                      <template v-if="!editingCompanyInfo">
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">SIC Code</span>
                            <span class="ap-field-value">{{ companyInfo.sicCode || '—' }}</span>
                          </div>
                        </div>
                        <h5 class="ap-subsection-heading">Physical Address</h5>
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Address 1</span>
                            <span class="ap-field-value">{{ companyInfo.physicalAddress1 || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Address 2</span>
                            <span class="ap-field-value">{{ companyInfo.physicalAddress2 || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row ap-field-row--multi ap-field-row--thirds">
                          <div class="ap-field">
                            <span class="ap-field-label">City</span>
                            <span class="ap-field-value">{{ companyInfo.physicalCity || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">State</span>
                            <span class="ap-field-value">{{ companyInfo.physicalState || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">ZIP</span>
                            <span class="ap-field-value">{{ companyInfo.physicalZip || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Country</span>
                            <span class="ap-field-value">{{ companyInfo.physicalCountry || '—' }}</span>
                          </div>
                        </div>
                        <h5 class="ap-subsection-heading">Mailing Address</h5>
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Address 1</span>
                            <span class="ap-field-value">{{ companyInfo.mailingAddress1 || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Address 2</span>
                            <span class="ap-field-value">{{ companyInfo.mailingAddress2 || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row ap-field-row--multi ap-field-row--thirds">
                          <div class="ap-field">
                            <span class="ap-field-label">City</span>
                            <span class="ap-field-value">{{ companyInfo.mailingCity || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">State</span>
                            <span class="ap-field-value">{{ companyInfo.mailingState || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">ZIP</span>
                            <span class="ap-field-value">{{ companyInfo.mailingZip || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Country</span>
                            <span class="ap-field-value">{{ companyInfo.mailingCountry || '—' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.sicCode" label="SIC Code" />
                        </div>
                        <h5 class="ap-subsection-heading">Physical Address</h5>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.physicalAddress1" label="Address 1" />
                        </div>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.physicalAddress2" label="Address 2" />
                        </div>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.physicalCity" label="City" />
                          <TextField v-model="editableCompanyInfo.physicalState" label="State" />
                          <TextField v-model="editableCompanyInfo.physicalZip" label="ZIP" />
                        </div>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.physicalCountry" label="Country" />
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
                          <TextField v-model="editableCompanyInfo.mailingAddress1" label="Address 1" :disabled="sameAsPhysical" />
                        </div>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.mailingAddress2" label="Address 2" :disabled="sameAsPhysical" />
                        </div>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.mailingCity" label="City" :disabled="sameAsPhysical" />
                          <TextField v-model="editableCompanyInfo.mailingState" label="State" :disabled="sameAsPhysical" />
                          <TextField v-model="editableCompanyInfo.mailingZip" label="ZIP" :disabled="sameAsPhysical" />
                        </div>
                        <div class="form-row">
                          <TextField v-model="editableCompanyInfo.mailingCountry" label="Country" :disabled="sameAsPhysical" />
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="saveCompanyInfo">Save Changes</button>
                          <button class="button button-secondary" @click="cancelEditCompanyInfo">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Section: Client Contacts -->
                  <v-card class="ap-contacts-card">
                    <v-card-title class="d-flex align-center justify-space-between">
                      <span class="text-h4">Client Contacts</span>
                      <button v-if="apClientContacts.length > 0" class="button button-primary" @click="apShowAddContactDialog = true">+ Add Contact</button>
                    </v-card-title>
                    <v-card-text>
                      <div v-if="apClientContacts.length > 0">
                        <ReportDataTable
                          :headers="apClientContactHeaders"
                          :items="apClientContacts"
                          :show-search-bar="false"
                          :show-filter-button="false"
                          :show-filter-pills="false"
                          :show-selection-checkboxes="false"
                          :show-row-actions="true"
                          :row-action-items="apClientContactRowActions"
                          :show-table-footer="false"
                          @row-action="handleApClientContactRowAction"
                        />
                      </div>
                      <div v-else class="nc-empty-state">
                        <img :src="EmptyStateImg" alt="No data" class="nc-empty-icon" />
                        <p class="nc-empty-title">Nothing to see here</p>
                        <p class="nc-empty-subtitle">No client contacts have been added yet.</p>
                        <button class="button button-secondary" @click="apShowAddContactDialog = true">+ Add Contact</button>
                      </div>
                    </v-card-text>
                  </v-card>

                  <!-- Add Client Contact Dialog -->
                  <Dialog
                    v-model="apShowAddContactDialog"
                    heading="Add Client Contact"
                    :show-secondary-button="true"
                    :actions="apContactDialogActions"
                  >
                    <v-row class="mt-1">
                      <v-col cols="6"><TextField v-model="apContactForm.firstName" label="First Name" :error-messages="apContactErrors.firstName" /></v-col>
                      <v-col cols="6"><TextField v-model="apContactForm.lastName" label="Last Name" :error-messages="apContactErrors.lastName" /></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12"><TextField v-model="apContactForm.title" label="Title" /></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12"><TextField v-model="apContactForm.email" label="Email" :error-messages="apContactErrors.email" /></v-col>
                    </v-row>
                    <div v-for="(ph, idx) in apContactForm.phones" :key="idx" class="nl-repeatable-row">
                      <div v-if="apContactForm.phones.length > 1" class="nl-repeatable-row-header">
                        <span class="nl-repeatable-row-label">Phone {{ idx + 1 }}</span>
                        <button class="nl-remove-row-btn" @click="apContactForm.phones.splice(idx, 1); if (apContactForm.primaryPhoneIdx >= apContactForm.phones.length) apContactForm.primaryPhoneIdx = 0" title="Remove">
                          <Trash2 :size="16" :stroke-width="1.75" />
                        </button>
                      </div>
                      <v-row>
                        <v-col cols="5"><TextField v-model="ph.number" label="Number" /></v-col>
                        <v-col cols="4">
                          <Select v-model="ph.type" :items="apPhoneTypes" label="Type" />
                        </v-col>
                        <v-col cols="3"><TextField v-model="ph.ext" label="Ext" /></v-col>
                      </v-row>
                      <label class="ap-radio-option">
                        <input type="radio" :value="idx" v-model="apContactForm.primaryPhoneIdx" class="ap-radio-input" />
                        <span class="ap-radio-custom" :class="{ active: apContactForm.primaryPhoneIdx === idx }">
                          <span v-if="apContactForm.primaryPhoneIdx === idx" class="ap-radio-dot" />
                        </span>
                        <span class="ap-radio-label">Primary</span>
                      </label>
                      <v-divider v-if="idx < apContactForm.phones.length - 1" class="nl-row-divider" />
                    </div>
                    <button v-if="apContactForm.phones.length < 3" class="nl-add-link" @click="apContactForm.phones.push(apNewPhone())">+ Add Phone Number</button>
                  </Dialog>

                  <!-- Edit Client Contact Dialog -->
                  <Dialog
                    v-model="apShowEditContactDialog"
                    heading="Edit Client Contact"
                    :show-secondary-button="true"
                    :actions="apEditContactDialogActions"
                  >
                    <v-row class="mt-1">
                      <v-col cols="6"><TextField v-model="apEditContactForm.firstName" label="First Name" :error-messages="apEditContactErrors.firstName" /></v-col>
                      <v-col cols="6"><TextField v-model="apEditContactForm.lastName" label="Last Name" :error-messages="apEditContactErrors.lastName" /></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12"><TextField v-model="apEditContactForm.title" label="Title" /></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12"><TextField v-model="apEditContactForm.email" label="Email" :error-messages="apEditContactErrors.email" /></v-col>
                    </v-row>
                    <div v-for="(ph, idx) in apEditContactForm.phones" :key="idx" class="nl-repeatable-row">
                      <div v-if="apEditContactForm.phones.length > 1" class="nl-repeatable-row-header">
                        <span class="nl-repeatable-row-label">Phone {{ idx + 1 }}</span>
                        <button class="nl-remove-row-btn" @click="apEditContactForm.phones.splice(idx, 1); if (apEditContactForm.primaryPhoneIdx >= apEditContactForm.phones.length) apEditContactForm.primaryPhoneIdx = 0" title="Remove">
                          <Trash2 :size="16" :stroke-width="1.75" />
                        </button>
                      </div>
                      <v-row>
                        <v-col cols="5"><TextField v-model="ph.number" label="Number" /></v-col>
                        <v-col cols="4">
                          <Select v-model="ph.type" :items="apPhoneTypes" label="Type" />
                        </v-col>
                        <v-col cols="3"><TextField v-model="ph.ext" label="Ext" /></v-col>
                      </v-row>
                      <label class="ap-radio-option">
                        <input type="radio" :value="idx" v-model="apEditContactForm.primaryPhoneIdx" class="ap-radio-input" />
                        <span class="ap-radio-custom" :class="{ active: apEditContactForm.primaryPhoneIdx === idx }">
                          <span v-if="apEditContactForm.primaryPhoneIdx === idx" class="ap-radio-dot" />
                        </span>
                        <span class="ap-radio-label">Primary</span>
                      </label>
                      <v-divider v-if="idx < apEditContactForm.phones.length - 1" class="nl-row-divider" />
                    </div>
                    <button v-if="apEditContactForm.phones.length < 3" class="nl-add-link" @click="apEditContactForm.phones.push(apNewPhone())">+ Add Phone Number</button>
                  </Dialog>

                  <!-- Section: Vendor Contacts -->
                  <v-card class="ap-contacts-card">
                    <v-card-title class="d-flex align-center justify-space-between">
                      <span class="text-h4">Vendor Contacts</span>
                      <button v-if="apVendorContacts.length > 0" class="button button-primary" @click="apShowVendorContactDialog = true">+ Add Contact</button>
                    </v-card-title>
                    <v-card-text>
                      <div v-if="apVendorContacts.length > 0">
                        <v-data-table
                          :headers="apVendorContactHeaders"
                          :items="apVendorContacts"
                          density="compact"
                          hide-default-footer
                          class="ap-contacts-table"
                        >
                          <template #item.actions="{ item }">
                            <v-btn icon variant="plain" size="small" color="error" @click="apRemoveVendorContact(item)">
                              <Trash2 :size="16" :stroke-width="1.75" />
                            </v-btn>
                          </template>
                        </v-data-table>
                      </div>
                      <div v-else class="nc-empty-state">
                        <img :src="EmptyStateImg" alt="No data" class="nc-empty-icon" />
                        <p class="nc-empty-title">Nothing to see here</p>
                        <p class="nc-empty-subtitle">No vendor contacts have been added yet.</p>
                        <button class="button button-secondary" @click="apShowVendorContactDialog = true">+ Add Contact</button>
                      </div>
                    </v-card-text>
                  </v-card>

                  <!-- Add Vendor Contact Dialog -->
                  <Dialog
                    v-model="apShowVendorContactDialog"
                    heading="Add Vendor Contact"
                    :show-secondary-button="true"
                    :actions="apVendorContactDialogActions"
                  >
                    <p class="text-body mb-4">The contacts below are from vendors already linked to this account.</p>
                    <Autocomplete
                      v-model="apVendorContactSelections"
                      :items="apVendorContactOptions"
                      :multiple="true"
                      label="Select vendor contacts"
                    />
                  </Dialog>

                </template>

                <!-- Step 2: Network Configuration -->
                <template v-else-if="currentWizardStep === 1">

                  <!-- Preferred Networks -->
                  <div class="nc-section">
                    <div class="nc-section-header">
                      <h4 class="text-h4">Preferred Networks</h4>
                      <button v-if="currentNetworkRows.length > 0" class="button button-primary" @click="networkLinkMode = 'add'; showNetworkLinkDialog = true">+ Add Network Link</button>
                    </div>
                    <div v-if="currentNetworkRows.length > 0">
                      <ReportDataTable
                        :headers="networkHeaders"
                        :items="currentNetworkRows"
                        :show-search-bar="true"
                        :show-filter-button="false"
                        :show-filter-pills="false"
                        :show-selection-checkboxes="false"
                        :show-row-actions="true"
                        :row-action-items="networkRowActions"
                        :show-table-footer="true"
                        search-placeholder="Search by network name"
                        @row-action="handleNetworkRowAction"
                      />
                    </div>
                    <div v-else class="nc-empty-state">
                      <img :src="EmptyStateImg" alt="No data" class="nc-empty-icon" />
                      <p class="nc-empty-title">Nothing to see here</p>
                      <p class="nc-empty-subtitle">No preferred networks have been configured yet.</p>
                      <button class="button button-secondary" @click="networkLinkMode = 'add'; showNetworkLinkDialog = true">+ Add Network Link</button>
                    </div>
                  </div>

                  <!-- Preferred Pharmacies -->
                  <div class="nc-section">
                    <div class="nc-section-header">
                      <h4 class="text-h4">Preferred Pharmacies</h4>
                    </div>

                    <div class="nc-tabs">
                      <button
                        v-for="tab in pharmacyTabs"
                        :key="tab"
                        :class="['nc-tab', { 'nc-tab--active': activePharmacyTab === tab }]"
                        @click="activePharmacyTab = tab"
                      >{{ tab }}</button>
                    </div>

                    <!-- Populated state -->
                    <div v-if="pharmacyData[activePharmacyTab].length > 0">
                      <div class="nc-section-header">
                        <span class="nc-tab-title">Assigned {{ activePharmacyTab }} Pharmacies</span>
                        <button class="button button-primary" @click="openPharmacyDialog(activePharmacyTab)">+ Add New</button>
                      </div>
                      <ReportDataTable
                        :headers="pharmacyHeadersForTab"
                        :items="pharmacyData[activePharmacyTab]"
                        :show-search-bar="false"
                        :show-filter-pills="false"
                        :show-selection-checkboxes="false"
                        :show-row-actions="true"
                        :row-action-items="pharmacyRowActions"
                        :interactive-boolean-columns="pharmacyBooleanColumnsForTab"
                        :show-table-footer="true"
                        @row-action="handlePharmacyRowAction"
                        @toggle-cell="handlePharmacyToggleCell"
                      />
                    </div>
                    <!-- Empty state -->
                    <div v-else class="nc-empty-state nc-empty-state--tab">
                      <img :src="EmptyStateImg" alt="No data" class="nc-empty-icon" />
                      <p class="nc-empty-title">Nothing to see here</p>
                      <p class="nc-empty-subtitle">There are no Assigned {{ activePharmacyTab }} Pharmacies.</p>
                      <button class="button button-secondary" @click="openPharmacyDialog(activePharmacyTab)">Assign {{ activePharmacyTab }} Pharmacies</button>
                    </div>
                  </div>

                </template>

                <!-- Step 3: Plan Design -->
                <template v-else-if="currentWizardStep === 2">
                  <div class="ap-section">
                    <div class="ap-section-header ap-section-header--space-between">
                      <h4 class="text-h4">All Plans</h4>
                      <button class="button button-primary">Create New Plan</button>
                    </div>

                  <div class="pd-accordion-list">
                    <div
                      v-for="plan in planDesignPlans"
                      :key="plan.id"
                      class="pd-accordion"
                    >
                      <div class="pd-accordion-header" @click="togglePlan(plan.id)">
                        <div class="pd-accordion-header-left">
                          <span class="pd-plan-name">{{ plan.name }}</span>
                          <span class="pd-plan-id">ID - {{ plan.id }}</span>
                          <span :class="['pd-status-badge', `pd-status-badge--${plan.status.toLowerCase()}`]">{{ plan.status }}</span>
                        </div>
                        <ChevronDown
                          :class="['pd-accordion-chevron', { 'pd-accordion-chevron--open': expandedPlans.includes(plan.id) }]"
                          :size="20"
                          :stroke-width="1.5"
                        />
                      </div>
                      <div v-if="expandedPlans.includes(plan.id)" class="pd-accordion-body">

                        <!-- Plan Overview -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Plan Overview</h4>
                            <button class="button button-thirtiary">
                              <Pencil :size="14" :stroke-width="1.5" /> Edit
                            </button>
                          </div>
                          <div class="ap-field-row ap-field-row--multi ap-field-row--five">
                            <div class="ap-field">
                              <span class="ap-field-label">Plan Name</span>
                              <span class="ap-field-value">{{ plan.name }}</span>
                              <span class="ap-field-sub">ID - {{ plan.id }}</span>
                            </div>
                            <div class="ap-field">
                              <span class="ap-field-label">Plan Status</span>
                              <span :class="['pd-status-badge', `pd-status-badge--${plan.status.toLowerCase()}`]">{{ plan.status }}</span>
                            </div>
                            <div class="ap-field">
                              <span class="ap-field-label">Eff. start date</span>
                              <span class="ap-field-value">{{ plan.effStartDate || '—' }}</span>
                            </div>
                            <div class="ap-field">
                              <span class="ap-field-label">Eff. end date</span>
                              <span class="ap-field-value">{{ plan.effEndDate || '—' }}</span>
                            </div>
                            <div class="ap-field">
                              <span class="ap-field-label">Benefit reset to $0</span>
                              <span class="ap-field-value">{{ plan.benefitReset || '—' }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="pd-section-divider" />

                        <!-- Plan Parameters -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Plan Parameters</h4>
                          </div>
                          <div class="pd-param-add-card">
                            <div class="pd-param-add-icon">
                              <PlusCircle :size="28" :stroke-width="1" />
                            </div>
                            <div class="pd-param-add-text">
                              <span class="pd-param-add-title">Add Plan Parameter Option</span>
                              <span class="pd-param-add-subtitle">Set applicable plan parameters to enforce as part of this plan's configuration.</span>
                            </div>
                          </div>

                          <!-- OCC field shown after a parameter is added -->
                          <div class="ap-field-row" style="margin-top: 16px;">
                            <div class="ap-field">
                              <span class="ap-field-label">OCC(Other coverage code)</span>
                              <span class="ap-field-value">1 - No other c...</span>
                            </div>
                          </div>
                        </div>

                        <div class="pd-section-divider" />

                        <!-- Plan Max Spend Parameters -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Plan Max Spend Parameters</h4>
                          </div>
                          <div class="pd-toggle-row">
                            <div class="pd-toggle-text">
                              <p class="pd-toggle-description">Enables additional configuration to set the maximum amount of money that a plan will spend on covered medications within a specific...</p>
                              <button class="pd-show-more">Show More</button>
                            </div>
                            <v-switch
                              v-model="plan.maxSpendEnabled"
                              density="compact"
                              hide-details
                              color="primary"
                              class="pd-toggle-switch"
                            />
                          </div>
                        </div>

                        <div class="pd-section-divider" />

                        <!-- Coordination of Benefits -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Coordination of Benefits</h4>
                          </div>
                          <div class="ap-field-row">
                            <div class="ap-checkbox-row">
                              <CheckSquare v-if="plan.allowSecondaryPayer" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" @click="plan.allowSecondaryPayer = !plan.allowSecondaryPayer" style="cursor:pointer" />
                              <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" @click="plan.allowSecondaryPayer = !plan.allowSecondaryPayer" style="cursor:pointer" />
                              <span class="ap-field-value">Allow Secondary Payer</span>
                            </div>
                          </div>
                          <div class="ap-field-row">
                            <div class="ap-field">
                              <span class="ap-field-label">COB configuration</span>
                              <span class="ap-field-value">{{ plan.cobConfiguration || '—' }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Applicable Benefit Period -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Applicable Benefit Period</h4>
                            <button class="button button-thirtiary">
                              <Pencil :size="14" :stroke-width="1.5" /> Edit
                            </button>
                          </div>
                          <div class="ap-field-row">
                            <div class="ap-field">
                              <span class="ap-field-label">Benefit period</span>
                            </div>
                          </div>
                          <div class="ap-field-row">
                            <div class="ap-checkbox-row">
                              <CheckSquare v-if="plan.benefitByFlag" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" @click="plan.benefitByFlag = !plan.benefitByFlag" style="cursor:pointer" />
                              <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" @click="plan.benefitByFlag = !plan.benefitByFlag" style="cursor:pointer" />
                              <span class="ap-field-value">Determine benefit stage by flag in eligibility file, not by accumulator data</span>
                            </div>
                          </div>
                        </div>

                        <!-- BPG Configuration -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">BPG Configuration</h4>
                            <button class="button button-thirtiary">
                              <Pencil :size="14" :stroke-width="1.5" /> Edit
                            </button>
                          </div>
                          <ReportDataTable
                            :headers="bpgHeaders"
                            :items="plan.bpgRows"
                            :show-search-bar="false"
                            :show-filter-pills="false"
                            :show-selection-checkboxes="false"
                            :show-row-actions="false"
                            :show-table-footer="false"
                          />
                        </div>

                        <div class="pd-section-divider" />

                        <!-- Associated Plan Codes -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Associated Plan Codes</h4>
                            <button class="button button-thirtiary">
                              <Pencil :size="14" :stroke-width="1.5" /> Edit
                            </button>
                          </div>
                          <ReportDataTable
                            :headers="planCodesHeaders"
                            :items="plan.planCodes"
                            :show-search-bar="false"
                            :show-filter-pills="false"
                            :show-selection-checkboxes="false"
                            :show-row-actions="false"
                            :show-table-footer="false"
                          >
                            <template #status="{ item }">
                              <span :class="['pd-status-badge', `pd-status-badge--${item.status.toLowerCase()}`]">{{ item.status }}</span>
                            </template>
                          </ReportDataTable>
                        </div>

                        <div class="pd-section-divider" />

                        <!-- Associated Benefit Codes -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Associated Benefit Codes</h4>
                            <button class="button button-thirtiary">
                              <Pencil :size="14" :stroke-width="1.5" /> Edit
                            </button>
                          </div>
                          <ReportDataTable
                            :headers="benefitCodesHeaders"
                            :items="plan.benefitCodes"
                            :show-search-bar="false"
                            :show-filter-pills="false"
                            :show-selection-checkboxes="false"
                            :show-row-actions="false"
                            :show-table-footer="false"
                          >
                            <template #empty-state>
                              <div class="nc-empty-state">
                                <img :src="EmptyStateImg" alt="No data" class="nc-empty-icon" />
                                <p class="nc-empty-title">Nothing configured yet</p>
                                <button class="button button-secondary pd-empty-cta">Configure Benefit Codes</button>
                              </div>
                            </template>
                          </ReportDataTable>
                        </div>

                        <div class="pd-section-divider" />

                        <!-- Associated Accumulators -->
                        <div class="pd-section">
                          <div class="pd-section-header">
                            <h4 class="text-h4">Associated Accumulators</h4>
                            <button class="button button-thirtiary">
                              <Pencil :size="14" :stroke-width="1.5" /> Edit
                            </button>
                          </div>
                          <ReportDataTable
                            :headers="accumulatorsHeaders"
                            :items="plan.accumulators"
                            :show-search-bar="false"
                            :show-filter-pills="false"
                            :show-selection-checkboxes="false"
                            :show-row-actions="false"
                            :show-table-footer="false"
                          />
                        </div>

                        <div class="pd-section-divider" />

                        <!-- Copay Structure card -->
                        <div class="cs-card">
                          <div class="cs-card-header">
                            <h4 class="text-h4">Copay Structure</h4>
                            <div class="cs-card-actions">
                              <button class="button button-secondary">+ Add Source</button>
                              <button class="button button-secondary">Notes</button>
                            </div>
                          </div>

                          <div class="nc-tabs">
                            <button
                              v-for="tab in copayTabs"
                              :key="tab"
                              :class="['nc-tab', { 'nc-tab--active': activeCopayTab === tab }]"
                              @click="activeCopayTab = tab"
                            >{{ tab }}</button>
                          </div>

                          <div class="cs-network-header">
                            <span class="cs-network-title">{{ activeCopayTab }} Pharmacy Network</span>
                            <button class="button button-thirtiary">
                              <Pencil :size="14" :stroke-width="1.5" /> Edit
                            </button>
                          </div>

                          <ReportDataTable
                            :headers="copayStructureHeaders"
                            :items="copayStructureRows"
                            :show-search-bar="false"
                            :show-filter-pills="false"
                            :show-selection-checkboxes="false"
                            :show-row-actions="false"
                            :show-table-footer="false"
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                  </div>
                </template>

                <!-- Step 4: Transition of Care -->
                <template v-else-if="currentWizardStep === 3">
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Transition of Care</h4>
                    </div>
                    <p class="text-body toc-intro">We understand the importance of providing the best onboarding experience to your members. As you transition, there are options available to help minimize disruption.</p>

                    <!-- Historical Claims -->
                    <div class="toc-question">
                      <p class="toc-question-label">Will Historical Claims be provided?</p>
                      <div class="toc-toggle-group">
                        <button
                          :class="['button', 'toc-toggle', { 'toc-toggle--selected': tocHistoricalClaims === false }]"
                          @click="tocHistoricalClaims = false"
                        >No</button>
                        <button
                          :class="['button', 'toc-toggle', { 'toc-toggle--selected': tocHistoricalClaims === true }]"
                          @click="tocHistoricalClaims = true"
                        >Yes</button>
                      </div>
                    </div>

                    <div v-if="tocHistoricalClaims === false" class="toc-info-box">
                      <p class="toc-info-text">If historical claims data is not received and a member is currently on a medication regimen that requires a Prior Authorization, the system actively observes rejected claims for 60 days post go-live, provides transition of care overrides for members with ongoing therapies, delivers written communication to disrupted members, and initiates prior authorizations. This allows an override for the member for a period of 30, 60, or 90 days.</p>
                      <div class="toc-toggle-group">
                        <button
                          :class="['button', 'toc-toggle', { 'toc-toggle--selected': tocRxWatchtower === false }]"
                          @click="tocRxWatchtower = false"
                        >Allow</button>
                        <button
                          :class="['button', 'toc-toggle', { 'toc-toggle--selected': tocRxWatchtower === true }]"
                          @click="tocRxWatchtower = true"
                        >Do Not Allow</button>
                      </div>
                    </div>

                    <!-- Prior Authorization -->
                    <div class="toc-question">
                      <p class="toc-question-label">Will Prior Authorization file be provided?</p>
                      <div class="toc-toggle-group">
                        <button
                          :class="['button', 'toc-toggle', { 'toc-toggle--selected': tocPriorAuth === false }]"
                          @click="tocPriorAuth = false"
                        >No</button>
                        <button
                          :class="['button', 'toc-toggle', { 'toc-toggle--selected': tocPriorAuth === true }]"
                          @click="tocPriorAuth = true"
                        >Yes</button>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Step 5: Programs -->
                <template v-else-if="currentWizardStep === 4">
                  <div class="ap-section">
                    <div class="ap-section-header ap-section-header--space-between">
                      <h4 class="text-h4">Configured Programs</h4>
                    </div>

                  <!-- Filter pills -->
                  <div class="prog-filters">
                    <FilteringPill
                      v-for="f in progFilters"
                      :key="f"
                      :is-active="progActiveFilter === f"
                      @click="progActiveFilter = f"
                    >{{ f }}</FilteringPill>
                  </div>

                  <ReportDataTable
                    :headers="progHeaders"
                    :items="filteredPrograms"
                    :show-search-bar="true"
                    :show-filter-button="false"
                    :show-filter-pills="false"
                    :show-selection-checkboxes="false"
                    :show-row-actions="false"
                    :show-table-footer="true"
                    :show-expand="true"
                    search-placeholder="Search by program name"
                  >
                    <template #expanded-row="{ item, columns }">
                      <tr>
                        <td :colspan="columns.length" class="prog-detail-td">
                          <div class="prog-detail">
                            <h5 class="prog-detail-title">Program Details</h5>
                            <div class="prog-detail-cols">
                              <div>
                                <p class="prog-detail-label">Program Option Name</p>
                                <p class="prog-detail-value">{{ item.optionName }}</p>
                              </div>
                              <div>
                                <p class="prog-detail-label">Invoice</p>
                                <p class="prog-detail-value">{{ item.invoice }}</p>
                              </div>
                            </div>
                            <ReportDataTable
                              :headers="progRatesHeaders"
                              :items="item.rates"
                              :show-search-bar="false"
                              :show-filter-pills="false"
                              :show-selection-checkboxes="false"
                              :show-row-actions="false"
                              :show-table-footer="true"
                            />
                            <div class="prog-detail-merp">
                              <p class="prog-detail-label">MERP Administrator Name</p>
                              <p class="prog-detail-value">{{ item.merpAdmin || '-' }}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </ReportDataTable>
                  </div>
                </template>

                <!-- Step 6: Limits & Controls -->
                <template v-else-if="currentWizardStep === 5">
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Limits &amp; Controls</h4>
                    </div>
                  <p class="text-body lc-intro">Standard dispensing limitations are shown below.</p>

                  <div class="toc-toggle-group lc-toggle-group">
                    <button
                      :class="['button', 'toc-toggle', { 'toc-toggle--selected': !lcRequestChange }]"
                      @click="lcRequestChange = false"
                    >Keep Standard</button>
                    <button
                      :class="['button', 'toc-toggle', { 'toc-toggle--selected': lcRequestChange }]"
                      @click="lcRequestChange = true"
                    >Request Change</button>
                  </div>

                  <div class="lc-fields">
                    <div v-for="field in lcFields" :key="field.key" class="lc-field-row">
                      <span class="lc-field-label">{{ field.label }}</span>
                      <span v-if="!lcRequestChange" class="lc-field-value">{{ field.value }}</span>
                      <input v-else v-model="field.value" class="lc-field-input" />
                    </div>
                  </div>

                  <div class="lc-section-divider" />

                  <!-- High Cost Notifications -->
                  <p class="text-body lc-hcn-intro">Before a high cost claim exceeding the specified notify amount is processed, a notification will be sent to the indicated users below. Users will have 24 hours to acknowledge the claim before it will automatically be processed.</p>

                  <div class="lc-hcn-field">
                    <p class="lc-hcn-label">Notify threshold amount:</p>
                    <input v-model="lcNotifyThreshold" class="lc-field-input lc-hcn-input" />
                  </div>

                  <div class="lc-hcn-field">
                    <p class="lc-hcn-label">Who should receive high cost notifications?</p>
                    <div
                      v-for="(recipient, idx) in lcRecipients"
                      :key="idx"
                      class="lc-recipient-row"
                    >
                      <input v-model="lcRecipients[idx]" class="lc-field-input lc-recipient-input" />
                      <X :size="16" :stroke-width="1.5" class="lc-recipient-remove" @click="lcRecipients.splice(idx, 1)" />
                    </div>
                    <button class="button lc-add-btn" @click="lcRecipients.push('')">ADD</button>
                  </div>

                  <div class="lc-section-divider" />

                  <!-- Overrides & Edits -->
                  <p class="text-body lc-hcn-intro">We recommend the standard management setup for overrides and edits, as shown below. Changes to clinical edits may impact cost savings and plan performance.</p>

                  <div class="lc-fields">
                    <div v-for="item in lcOverrides" :key="item" class="lc-field-row">
                      <span class="lc-field-label">{{ item }}</span>
                      <Check :size="16" :stroke-width="2" class="lc-check-icon" />
                    </div>
                  </div>

                  <div class="lc-section-divider" />

                  <!-- DAW Penalties -->
                  <p class="text-body lc-hcn-intro">Dispense as Written standards are below, please indicate if you'd like to apply these penalties.</p>

                  <div v-for="daw in lcDawPenalties" :key="daw.key" class="lc-daw-block">
                    <h5 class="lc-daw-title">{{ daw.label }}</h5>
                    <p class="text-body lc-daw-desc">{{ daw.description }}</p>
                    <div class="toc-toggle-group">
                      <button
                        :class="['button', 'toc-toggle', { 'toc-toggle--selected': daw.value === false }]"
                        @click="daw.value = false"
                      >Not Applied</button>
                      <button
                        :class="['button', 'toc-toggle', { 'toc-toggle--selected': daw.value === true }]"
                        @click="daw.value = true"
                      >Applied</button>
                    </div>
                  </div>

                  <textarea v-model="lcDawNotes" class="lc-daw-notes" placeholder="DAW Notes" />
                  </div>
                </template>

                <!-- Step 7: Billing -->
                <template v-else-if="currentWizardStep === 6">

                  <!-- Card 1: Billing Setup -->
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Billing Setup</h4>
                      <button v-if="!blEditingSetup" class="button button-thirtiary" @click="blEditingSetup = true">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>
                    <div class="ap-fields">
                      <template v-if="!blEditingSetup">
                        <div class="ap-field-row ap-field-row--multi">
                          <div class="ap-field">
                            <span class="ap-field-label">EIN Number</span>
                            <span class="ap-field-value">{{ blEinNumber || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Billing managed by a third party</span>
                            <span class="ap-field-value">{{ blExistingParty === 'yes' ? 'Yes' : 'No' }}</span>
                          </div>
                          <div v-if="blExistingParty === 'yes'" class="ap-field">
                            <span class="ap-field-label">Billing Party</span>
                            <span class="ap-field-value">{{ blSelectedTpa || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Responsible Party</span>
                            <span class="ap-field-value">{{ blResponsibleContacts.length ? blResponsibleContacts.join(', ') : '—' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="form-row">
                          <TextField :model-value="blEinNumber" label="EIN Number" placeholder="00-0000000" @update:model-value="blEinNumber = formatEin($event)" />
                        </div>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Is billing managed by a third party?</p>
                          <div class="toc-toggle-group">
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blExistingParty === 'yes' }]" @click="blExistingParty = 'yes'">Yes</button>
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blExistingParty === 'no' }]" @click="blExistingParty = 'no'">No</button>
                          </div>
                          <div v-if="blExistingParty === 'yes'" class="bl-subsection">
                            <div class="bl-field-narrow">
                              <Select v-model="blSelectedTpa" :items="blTpaOptions" label="Select billing party" />
                            </div>
                            <p class="text-body bl-note">Don't see the billing party? Third party vendors must be added in SoloRx before they appear here.</p>
                            <p v-if="blSelectedTpa" class="text-body bl-note">Contacts from the selected billing party will populate the Responsible Party field below.</p>
                          </div>
                        </div>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Responsible Party</p>
                          <div class="bl-field-narrow">
                            <Autocomplete v-model="blResponsibleContacts" :items="blResponsibleContactOptions" label="Select contacts" :multiple="true" />
                          </div>
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="blEditingSetup = false">Save Changes</button>
                          <button class="button button-secondary" @click="blEditingSetup = false">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Card 2: Payment Method (hidden when third party = Yes) -->
                  <div v-if="blExistingParty === 'no'" class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Payment Method</h4>
                      <button v-if="!blEditingPayment" class="button button-thirtiary" @click="blEditingPayment = true">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>
                    <div class="ap-fields">
                      <template v-if="!blEditingPayment">
                        <div class="ap-field-row ap-field-row--multi">
                          <div class="ap-field">
                            <span class="ap-field-label">Payment Method</span>
                            <span class="ap-field-value">{{ blPaymentMethod || '—' }}</span>
                          </div>
                          <div v-if="blPaymentMethod === 'ACH'" class="ap-field">
                            <span class="ap-field-label">ACH Method</span>
                            <span class="ap-field-value">{{ blAchMethod === 'send' ? 'Send to Liviniti' : blAchMethod === 'debit' ? 'Debited by Liviniti' : '—' }}</span>
                          </div>
                          <div v-if="blAchMethod === 'debit'" class="ap-field">
                            <span class="ap-field-label">Debit Pull Timing</span>
                            <span class="ap-field-value">{{ blDebitTiming || '—' }}</span>
                          </div>
                        </div>
                        <div v-if="blAchMethod === 'debit'" class="ap-field-row ap-field-row--multi">
                          <div class="ap-field">
                            <span class="ap-field-label">Completed W-9</span>
                            <span class="ap-field-value">{{ blW9File || 'Not uploaded' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Completed ACH Authorization</span>
                            <span class="ap-field-value">{{ blAchAuthFile || 'Not uploaded' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Payment Method</p>
                          <div class="toc-toggle-group">
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blPaymentMethod === 'ACH' }]" @click="blPaymentMethod = 'ACH'">ACH</button>
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blPaymentMethod === 'Check' }]" @click="blPaymentMethod = 'Check'">Check</button>
                          </div>
                          <div v-if="blPaymentMethod === 'ACH'" class="bl-subsection">
                            <p class="lc-hcn-label">ACH Method <span class="bl-required">*</span></p>
                            <div class="toc-toggle-group">
                              <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blAchMethod === 'send' }]" @click="blAchMethod = 'send'">Send to Liviniti</button>
                              <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blAchMethod === 'debit' }]" @click="blAchMethod = 'debit'">Debited by Liviniti</button>
                            </div>
                            <div v-if="blAchMethod === 'send'" class="bl-subsection">
                              <p class="text-body bl-note">Download Liviniti's completed W-9 and ACH forms for your records.</p>
                              <div class="bl-download-group">
                                <button class="button bl-download-btn" @click.prevent>
                                  <CloudDownload :size="16" :stroke-width="2" />Download W-9 (Liviniti)
                                </button>
                                <button class="button bl-download-btn" @click.prevent>
                                  <CloudDownload :size="16" :stroke-width="2" />Download ACH Form (Liviniti)
                                </button>
                              </div>
                            </div>
                            <div v-else-if="blAchMethod === 'debit'" class="bl-subsection">
                              <p class="text-body bl-note">Download, complete, and upload the signed W-9 and ACH authorization forms.</p>
                              <div class="bl-download-group">
                                <button class="button bl-download-btn" @click.prevent>
                                  <CloudDownload :size="16" :stroke-width="2" />Download Blank W-9
                                </button>
                                <button class="button bl-download-btn" @click.prevent>
                                  <CloudDownload :size="16" :stroke-width="2" />Download ACH Authorization Form
                                </button>
                              </div>
                              <div class="bl-upload-item">
                                <p class="lc-hcn-label">Completed W-9</p>
                                <template v-if="blW9File && !blPendingW9Removal">
                                  <v-chip color="primary" variant="flat" class="bl-file-chip">
                                    <Paperclip :size="12" :stroke-width="2" class="bl-file-chip-icon" />
                                    <span class="bl-file-chip-label">{{ blW9File }}</span>
                                    <span class="bl-file-chip-close" @click.stop="blPendingW9Removal = true"><X :size="10" :stroke-width="2.5" /></span>
                                  </v-chip>
                                </template>
                                <FileUploader v-else :show-document-type-selection="false" @file-selected="(name) => { blW9File = name; blPendingW9Removal = false }" />
                              </div>
                              <div class="bl-upload-item">
                                <p class="lc-hcn-label">Completed ACH Authorization</p>
                                <template v-if="blAchAuthFile && !blPendingAchAuthRemoval">
                                  <v-chip color="primary" variant="flat" class="bl-file-chip">
                                    <Paperclip :size="12" :stroke-width="2" class="bl-file-chip-icon" />
                                    <span class="bl-file-chip-label">{{ blAchAuthFile }}</span>
                                    <span class="bl-file-chip-close" @click.stop="blPendingAchAuthRemoval = true"><X :size="10" :stroke-width="2.5" /></span>
                                  </v-chip>
                                </template>
                                <FileUploader v-else :show-document-type-selection="false" @file-selected="(name) => { blAchAuthFile = name; blPendingAchAuthRemoval = false }" />
                              </div>
                            </div>
                            <div v-if="blAchMethod === 'debit'" class="bl-subsection">
                              <p class="lc-hcn-label">Debit Pull Timing</p>
                              <div class="bl-field-narrow">
                                <Select v-model="blDebitTiming" :items="blDebitTimingOptions" label="Select timing" />
                              </div>
                              <div v-if="blDebitTiming === 'Prior approval required'" class="bl-subsection">
                                <TextField v-model="blDebitApprovalEmail" label="Approval notification email" />
                              </div>
                              <div v-if="blDebitTiming === 'Custom'" class="bl-subsection">
                                <v-textarea v-model="blDebitTimingNote" label="Describe the debit pull schedule" variant="outlined" density="compact" rows="2" auto-grow hide-details class="bl-notes-textarea" />
                              </div>
                            </div>
                          </div>
                          <div v-if="blPaymentMethod === 'Check'" class="bl-subsection">
                            <p class="text-body bl-note">Please send all checks to the following address:</p>
                            <div class="bl-address">
                              <p>Liviniti</p>
                              <p>PO Box 896599</p>
                              <p>Charlotte, NC 28289</p>
                            </div>
                          </div>
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="savePaymentCard">Save Changes</button>
                          <button class="button button-secondary" @click="cancelPaymentCard">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Card 3: Invoice Configuration -->
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Invoice Configuration</h4>
                      <button v-if="!blEditingInvoice" class="button button-thirtiary" @click="blEditingInvoice = true">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>
                    <div class="ap-fields">
                      <template v-if="!blEditingInvoice">
                        <div class="ap-field-row ap-field-row--multi">
                          <div class="ap-field">
                            <span class="ap-field-label">Billing Cycle</span>
                            <span class="ap-field-value">{{ blBillingCycle || '—' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Separate Invoices</span>
                            <span class="ap-field-value">{{ blSeparateInvoices === 'yes' ? `Yes — ${blSeparateInvoicesSplit || 'split not set'}` : 'No' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Invoice Breakout</span>
                            <span class="ap-field-value">{{ blInvoiceBreakout === 'yes' ? `Yes — ${blInvoiceBreakoutSelection || 'type not set'}` : 'No' }}</span>
                          </div>
                        </div>
                        <div v-if="blBillingCycle === 'Custom'" class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Billing Schedule Note</span>
                            <span class="ap-field-value">{{ blCustomCycleNote || '—' }}</span>
                          </div>
                        </div>
                        <div v-if="blInvoiceBreakoutSelection === 'Custom'" class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Custom Breakout Note</span>
                            <span class="ap-field-value">{{ blInvoiceBreakoutNote || '—' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Billing Cycle</p>
                          <div class="bl-field-narrow">
                            <Select v-model="blBillingCycle" :items="blCycleOptions" label="Billing Cycle" />
                          </div>
                          <div v-if="blBillingCycle === 'Custom'" class="bl-subsection">
                            <v-textarea v-model="blCustomCycleNote" label="Describe the billing schedule" variant="outlined" density="compact" rows="2" auto-grow hide-details class="bl-notes-textarea" />
                          </div>
                        </div>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Are separate invoices required?</p>
                          <div class="toc-toggle-group">
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blSeparateInvoices === 'no' }]" @click="blSeparateInvoices = 'no'">No</button>
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blSeparateInvoices === 'yes' }]" @click="blSeparateInvoices = 'yes'">Yes</button>
                          </div>
                          <div v-if="blSeparateInvoices === 'yes'" class="bl-subsection-select">
                            <Select v-model="blSeparateInvoicesSplit" :items="blInvoiceSplitOptions" label="Split invoices by" />
                          </div>
                        </div>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Are invoice breakouts required?</p>
                          <div class="toc-toggle-group">
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blInvoiceBreakout === 'no' }]" @click="blInvoiceBreakout = 'no'">No</button>
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blInvoiceBreakout === 'yes' }]" @click="blInvoiceBreakout = 'yes'">Yes</button>
                          </div>
                          <div v-if="blInvoiceBreakout === 'yes'" class="bl-subsection">
                            <div class="bl-field-narrow">
                              <Select v-model="blInvoiceBreakoutSelection" :items="blInvoiceBreakoutItems" label="Select breakout type" />
                            </div>
                            <div v-if="blInvoiceBreakoutSelection === 'Custom'" class="bl-custom-warning">
                              <TriangleAlert :size="16" :stroke-width="2" class="bl-warning-icon" />
                              <p class="text-body bl-warning-text">Custom invoice breakouts require coordination with Accounting. Open a ticket with Accounting to coordinate setup before proceeding.</p>
                            </div>
                            <div v-if="blInvoiceBreakoutSelection === 'Custom'" class="bl-subsection">
                              <v-textarea v-model="blInvoiceBreakoutNote" label="Describe the custom breakout requirement" variant="outlined" density="compact" rows="2" auto-grow hide-details class="bl-notes-textarea" />
                            </div>
                          </div>
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="blEditingInvoice = false">Save Changes</button>
                          <button class="button button-secondary" @click="blEditingInvoice = false">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Card 4: Report Configuration -->
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Report Configuration</h4>
                      <button v-if="!blEditingReport" class="button button-thirtiary" @click="blEditingReport = true">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>
                    <div class="ap-fields">
                      <template v-if="!blEditingReport">
                        <div class="ap-field-row ap-field-row--multi">
                          <div class="ap-field">
                            <span class="ap-field-label">Show PHI in Billing Reports</span>
                            <span class="ap-field-value">{{ blIncludePhi === 'yes' ? 'Yes' : 'No' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Reporting Breakouts Required</span>
                            <span class="ap-field-value">{{ blReportingBreakouts === 'yes' ? 'Yes' : 'No' }}</span>
                          </div>
                        </div>
                        <div v-if="blReportingBreakouts === 'yes'" class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Breakout Types</span>
                            <span class="ap-field-value">{{ blReportingBreakoutSelections.length ? blReportingBreakoutSelections.join(', ') : '—' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Show PHI in Billing Reports</p>
                          <div class="toc-toggle-group">
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blIncludePhi === 'no' }]" @click="blIncludePhi = 'no'">No</button>
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blIncludePhi === 'yes' }]" @click="blIncludePhi = 'yes'">Yes</button>
                          </div>
                        </div>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Are reporting breakouts required?</p>
                          <div class="toc-toggle-group">
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blReportingBreakouts === 'no' }]" @click="blReportingBreakouts = 'no'">No</button>
                            <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blReportingBreakouts === 'yes' }]" @click="blReportingBreakouts = 'yes'">Yes</button>
                          </div>
                          <div v-if="blReportingBreakouts === 'yes'" class="bl-subsection">
                            <div class="bl-field-narrow">
                              <Autocomplete v-model="blReportingBreakoutSelections" :items="blReportingBreakoutItems" :multiple="true" label="Select breakout types" />
                            </div>
                          </div>
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="blEditingReport = false">Save Changes</button>
                          <button class="button button-secondary" @click="blEditingReport = false">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Card 5: Rebate Setup -->
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Rebate Setup</h4>
                      <button v-if="!blEditingRebate" class="button button-thirtiary" @click="blEditingRebate = true">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>
                    <div class="ap-fields">
                      <template v-if="!blEditingRebate">
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Rebate Notification Contacts</span>
                            <span class="ap-field-value">{{ blRebateContacts.length ? blRebateContacts.join(', ') : '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row ap-field-row--multi">
                          <div class="ap-field">
                            <span class="ap-field-label">Completed W-9</span>
                            <span class="ap-field-value">{{ blRebateW9File || 'Not uploaded' }}</span>
                          </div>
                          <div class="ap-field">
                            <span class="ap-field-label">Completed ACH Authorization</span>
                            <span class="ap-field-value">{{ blRebateAchAuthFile || 'Not uploaded' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Who should receive rebate notifications?</p>
                          <p class="text-body bl-note">Selected contacts will be notified when rebates are issued.</p>
                          <div class="bl-field-narrow">
                            <Autocomplete v-model="blRebateContacts" :items="blRebateContactOptions" label="Select contacts" :multiple="true" />
                          </div>
                        </div>
                        <div class="bl-section">
                          <p class="lc-hcn-label">Rebate ACH Setup</p>
                          <p class="text-body bl-note">Download, complete, and upload the signed W-9 and ACH authorization forms for rebate payments.</p>
                          <div class="bl-download-group">
                            <button class="button bl-download-btn" @click.prevent>
                              <CloudDownload :size="16" :stroke-width="2" />Download Blank W-9
                            </button>
                            <button class="button bl-download-btn" @click.prevent>
                              <CloudDownload :size="16" :stroke-width="2" />Download ACH Authorization Form
                            </button>
                          </div>
                          <div class="bl-upload-item">
                            <p class="lc-hcn-label">Completed W-9</p>
                            <template v-if="blRebateW9File && !blPendingRebateW9Removal">
                              <v-chip color="primary" variant="flat" class="bl-file-chip">
                                <Paperclip :size="12" :stroke-width="2" class="bl-file-chip-icon" />
                                <span class="bl-file-chip-label">{{ blRebateW9File }}</span>
                                <span class="bl-file-chip-close" @click.stop="blPendingRebateW9Removal = true"><X :size="10" :stroke-width="2.5" /></span>
                              </v-chip>
                            </template>
                            <FileUploader v-else :show-document-type-selection="false" @file-selected="(name) => { blRebateW9File = name; blPendingRebateW9Removal = false }" />
                          </div>
                          <div class="bl-upload-item">
                            <p class="lc-hcn-label">Completed ACH Authorization</p>
                            <template v-if="blRebateAchAuthFile && !blPendingRebateAchAuthRemoval">
                              <v-chip color="primary" variant="flat" class="bl-file-chip">
                                <Paperclip :size="12" :stroke-width="2" class="bl-file-chip-icon" />
                                <span class="bl-file-chip-label">{{ blRebateAchAuthFile }}</span>
                                <span class="bl-file-chip-close" @click.stop="blPendingRebateAchAuthRemoval = true"><X :size="10" :stroke-width="2.5" /></span>
                              </v-chip>
                            </template>
                            <FileUploader v-else :show-document-type-selection="false" @file-selected="(name) => { blRebateAchAuthFile = name; blPendingRebateAchAuthRemoval = false }" />
                          </div>
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="saveRebateCard">Save Changes</button>
                          <button class="button button-secondary" @click="cancelRebateCard">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Card 6: Billing Notes -->
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Billing Notes</h4>
                      <button v-if="!blEditingNotes" class="button button-thirtiary" @click="blEditingNotes = true">
                        <Pencil :size="14" :stroke-width="1.5" />Edit
                      </button>
                    </div>
                    <div class="ap-fields">
                      <template v-if="!blEditingNotes">
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-value">{{ blNotes || '—' }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="bl-section">
                          <v-textarea v-model="blNotes" label="Billing Notes" hint="For special billing instructions only." persistent-hint variant="outlined" density="compact" rows="3" auto-grow class="bl-notes-textarea" />
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="blEditingNotes = false">Save Changes</button>
                          <button class="button button-secondary" @click="blEditingNotes = false">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                </template>

                <!-- Step 8: ID Cards -->
                <template v-else-if="currentWizardStep === 7">
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">ID Cards</h4>
                    </div>

                  <!-- Vendor -->
                  <div class="bl-section bl-section--no-gap">
                    <div class="id-two-col-row">
                      <Select
                        v-model="idVendorType"
                        :items="idVendorTypeOptions"
                        label="Vendor type"
                      />
                      <TextField
                        v-if="idVendorType === 'Internal'"
                        model-value="Liviniti"
                        label="Vendor name"
                        :readonly="true"
                      />
                      <Autocomplete
                        v-else-if="idVendorType === 'Carrier'"
                        v-model="idCarrierVendorName"
                        :items="idCarrierVendorOptions"
                        label="Vendor name"
                      />
                    </div>
                  </div>

                  <!-- Internal-only fields -->
                  <div v-if="idVendorType === 'Internal'" class="id-internal-fields">

                    <!-- Combine Rx + File upload -->
                    <div class="bl-section">
                      <v-checkbox
                        v-model="idCombineRxMedical"
                        label="Combine Rx and Medical information"
                        color="primary"
                        density="compact"
                        hide-details
                      />
                    </div>

                    <div class="bl-section">
                      <p class="lc-hcn-label">ID Card file upload</p>
                      <FileUploader :show-document-type-selection="false" />
                    </div>

                    <!-- Send cards + Days to send -->
                    <div class="bl-section">
                      <div class="id-two-col-row id-two-col-row--checkbox-pair">
                        <v-checkbox
                          v-model="idSendCards"
                          label="Send cards"
                          color="primary"
                          density="compact"
                          hide-details
                        />
                        <TextField
                          v-if="idSendCards"
                          v-model="idDaysToSend"
                          label="Days to send cards before"
                        />
                      </div>
                    </div>

                    <!-- Processing ID + Person code characters -->
                    <div class="bl-section">
                      <div class="id-two-col-row">
                        <Select
                          v-model="idProcessingId"
                          :items="idProcessingIdOptions"
                          label="Processing ID"
                        />
                        <TextField
                          v-model="idPersonCodeChars"
                          label="Person code characters"
                        />
                      </div>
                    </div>

                    <div class="lc-section-divider" />

                    <!-- Mailing Preference -->
                    <h4 class="text-h4 bl-section-heading">Mailing Preference</h4>

                    <div class="bl-section">
                      <div class="id-two-col-row">
                        <Select
                          v-model="idInitialMailing"
                          :items="idMailingOptions"
                          label="Initial mailing preference"
                          hint="Optional"
                          persistent-hint
                        />
                        <Select
                          v-model="idAdditionalCard"
                          :items="idMailingOptions"
                          label="Additional/new card"
                          hint="Optional"
                          persistent-hint
                        />
                      </div>
                    </div>

                    <!-- Attention -->
                    <div class="bl-section">
                      <TextField
                        v-model="idAttention"
                        label="Attention"
                        hint="Optional"
                        persistent-hint
                      />
                    </div>

                    <!-- Mailing address -->
                    <div class="bl-section">
                      <TextField
                        v-model="idMailingAddress"
                        label="Mailing address"
                        hint="Optional"
                        persistent-hint
                      />
                    </div>

                    <!-- Notes/Special instructions -->
                    <div class="bl-section">
                      <TextField
                        v-model="idNotes"
                        label="Notes/Special instructions"
                        hint="Optional"
                        persistent-hint
                      />
                    </div>

                    <!-- Auto-generate cards -->
                    <div class="bl-section">
                      <p class="id-autogen-heading">Automatically generate cards when any of the following occur:</p>
                      <div class="id-autogen-grid">
                        <div class="id-autogen-item">
                          <v-checkbox v-model="idAutoGenCards.nameChange" label="Name Change" color="primary" density="compact" hide-details />
                        </div>
                        <div class="id-autogen-item">
                          <v-checkbox v-model="idAutoGenCards.addressChange" color="primary" density="compact" hide-details>
                            <template #label>
                              <span>Address Change <span class="id-autogen-sublabel">(Primary Cardholder ONLY)</span></span>
                            </template>
                          </v-checkbox>
                        </div>
                        <div class="id-autogen-item">
                          <v-checkbox v-model="idAutoGenCards.dependentChange" color="primary" density="compact" hide-details>
                            <template #label>
                              <span>Dependent Change <span class="id-autogen-sublabel">(Added/Removed)</span></span>
                            </template>
                          </v-checkbox>
                        </div>
                        <div class="id-autogen-item">
                          <v-checkbox v-model="idAutoGenCards.locationChange" label="Location Change" color="primary" density="compact" hide-details />
                        </div>
                        <div class="id-autogen-item">
                          <v-checkbox v-model="idAutoGenCards.effectiveDateChange" label="Effective Date Change" color="primary" density="compact" hide-details />
                        </div>
                      </div>
                    </div>

                    <!-- Effective dates -->
                    <div class="bl-section">
                      <div class="id-two-col-row">
                        <DatePicker v-model="idEffectiveStart" label="Effective start date" />
                        <DatePicker v-model="idEffectiveEnd" label="Effective end date" />
                      </div>
                    </div>

                  </div>

                  <!-- Carrier-only fields -->
                  <div v-else-if="idVendorType === 'Carrier'" class="id-internal-fields">

                    <!-- Carrier disclaimer -->
                    <div class="bl-section">
                      <div class="id-carrier-kit__disclaimer">
                        <div class="id-carrier-kit__disclaimer-icon">
                          <TriangleAlert :size="16" :stroke-width="1.5" />
                        </div>
                        <span><strong>Please Note:</strong> Walgreens is unable to process Cardholder IDs and Group Numbers that contain special characters, i.e. dashes.</span>
                      </div>
                    </div>

                    <!-- Carrier branding kit info -->
                    <div class="bl-section">
                      <div class="id-carrier-kit">
                        <div class="id-carrier-kit__info">
                          <div class="id-carrier-kit__header">
                            <p class="lc-hcn-label">
                              Carrier Branding Information
                              <span class="id-carrier-kit__optional">(Optional)</span>
                            </p>
                            <div class="id-carrier-kit__download">
                              <button class="button button-secondary id-carrier-kit__btn" @click="downloadCarrierKit">
                                <CloudDownload :size="16" :stroke-width="1.5" />
                                Download Kit
                              </button>
                              <span class="id-carrier-kit__hint">Includes print-ready templates · PDF + logo file · 4.2 MB</span>
                            </div>
                          </div>
                          <div class="id-carrier-kit__logo-wrap">
                            <img src="/icons/Liviniti-logo.svg" alt="Liviniti Logo" class="id-carrier-kit__logo" />
                          </div>
                          <p class="wizard-step-description">
                            Please provide the following information when producing your own ID cards:
                          </p>
                          <table class="id-carrier-kit__table">
                            <tbody>
                              <tr>
                                <td class="id-carrier-kit__table-label">Liviniti Customer Service Phone Number:</td>
                                <td class="id-carrier-kit__table-value">1.800.710.9341</td>
                              </tr>
                              <tr>
                                <td class="id-carrier-kit__table-label">Liviniti Help Desk Phone Number:</td>
                                <td class="id-carrier-kit__table-value">1.800.710.9341</td>
                              </tr>
                              <tr>
                                <td class="id-carrier-kit__table-label">Liviniti Website URL:</td>
                                <td class="id-carrier-kit__table-value">www.liviniti.com</td>
                              </tr>
                              <tr>
                                <td class="id-carrier-kit__table-label">Rx BIN:</td>
                                <td class="id-carrier-kit__table-value">015433</td>
                              </tr>
                              <tr>
                                <td class="id-carrier-kit__table-label">Rx PCN:</td>
                                <td class="id-carrier-kit__table-value">SSN</td>
                              </tr>
                              <tr>
                                <td class="id-carrier-kit__table-label">Rx Group Number:</td>
                                <td class="id-carrier-kit__table-value id-carrier-kit__table-value--note">The Rx Group # will mirror the Group # assigned by your administrator.</td>
                              </tr>
                              <tr>
                                <td class="id-carrier-kit__table-label">Effective Date:</td>
                                <td class="id-carrier-kit__table-value id-carrier-kit__table-value--note">The member's effective date.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <!-- Processing ID + Person code characters -->
                    <div class="bl-section">
                      <div class="id-two-col-row">
                        <Select
                          v-model="idProcessingId"
                          :items="idProcessingIdOptions"
                          label="Processing ID"
                        />
                        <TextField
                          v-model="idPersonCodeChars"
                          label="Person code characters"
                        />
                      </div>
                    </div>

                    <!-- Effective dates -->
                    <div class="bl-section">
                      <div class="id-two-col-row">
                        <DatePicker v-model="idEffectiveStart" label="Effective start date" />
                        <DatePicker v-model="idEffectiveEnd" label="Effective end date" />
                      </div>
                    </div>

                  </div>
                  </div>

                </template>

                <!-- Step 9: Verification & Summary -->
                <template v-else-if="currentWizardStep === 8">
                  <p class="vs-completion" :class="{ 'vs-completion--done': wizardCompletionPercent === 100 }">
                    {{ wizardCompletionPercent }}% Complete
                  </p>
                  <div class="vs-step-list">
                    <div
                      v-for="(step, index) in wizardSteps.slice(0, 8)"
                      :key="index"
                      class="vs-step-row"
                      :class="`vs-step-row--${step.status}`"
                    >
                      <span class="vs-step-number">{{ index + 1 }}</span>
                      <span class="vs-step-name">{{ step.name }}</span>
                      <div class="vs-step-actions">
                        <span class="vs-step-badge" :class="`vs-step-badge--${step.status}`">
                          {{ step.status === 'complete' ? 'Complete' : step.status === 'in-progress' ? 'In Progress' : 'Not Started' }}
                        </span>
                        <button
                          v-if="step.status !== 'complete'"
                          class="button vs-edit-btn"
                          @click="currentWizardStep = index"
                        >Edit</button>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Other steps: placeholder -->
                <template v-else>
                  <div class="wizard-placeholder">
                    <p class="text-body" style="color: var(--color-neutral-disabled);">
                      Content for <strong>{{ wizardSteps[currentWizardStep].name }}</strong> coming soon.
                    </p>
                  </div>
                </template>
              </div>

              <div class="wizard-footer">
                <button v-if="currentWizardStep > 0" class="button button-secondary" @click="prevWizardStep">Previous</button>
                <span v-else></span>
                <div class="wizard-footer-actions">
                  <button
                    v-if="wizardSteps[currentWizardStep].status !== 'complete'"
                    class="button button-secondary"
                    @click="markCurrentStepComplete"
                  >Mark as Complete</button>
                  <button
                    v-else
                    class="button button-secondary"
                    @click="markCurrentStepIncomplete"
                  >Mark as Incomplete</button>
                  <button v-if="currentWizardStep < wizardSteps.length - 1" class="button button-primary" @click="nextWizardStep">Next</button>
                  <button v-if="currentWizardStep === wizardSteps.length - 1" class="button button-primary" @click="finishPlanSetup">Finish Plan Setup</button>
                </div>
              </div>
            </div>

            <!-- Overview card (wizard accounts, Plan Setup selected, no sub-step yet) -->
            <div
              v-else-if="activeTimelineItem?.title === 'Plan Setup' && isWizardAccount"
              class="wizard-overview"
            >
              <div class="wizard-overview-header">
                <h2 class="wizard-overview-title">Client Implementation</h2>
                <p class="wizard-overview-subtitle">
                  This guided workflow will walk you through configuring
                  <strong>{{ selectedAccountName.replace('Implementation Tracker for ', '') }}</strong>
                  from start to finish.
                </p>
              </div>

              <div class="wizard-overview-body">
                <p class="wizard-overview-section-label">WHAT YOU'LL CONFIGURE</p>
                <div class="wizard-steps-grid">
                  <div v-for="(step, index) in wizardSteps" :key="index" class="wizard-grid-item">
                    <span class="wizard-grid-number">{{ index + 1 }}</span>
                    <span class="wizard-grid-name">{{ step.name }}</span>
                  </div>
                </div>
                <div class="wizard-info-list">
                  <div class="wizard-info-item">
                    <SaveIcon :size="18" :stroke-width="1.5" class="wizard-info-icon" />
                    <p class="text-small">Your progress is saved automatically as you move between steps. You can exit and return at any time.</p>
                  </div>
                  <div class="wizard-info-item">
                    <LayoutListIcon :size="18" :stroke-width="1.5" class="wizard-info-icon" />
                    <p class="text-small">Once started, you can jump to any step using the sidebar navigation.</p>
                  </div>
                  <div class="wizard-info-item">
                    <CircleCheckIcon :size="18" :stroke-width="1.5" class="wizard-info-icon" />
                    <p class="text-small">Required steps must be completed before you can submit for review.</p>
                  </div>
                </div>
              </div>

              <div class="wizard-overview-footer">
                <button class="button button-primary" @click="selectWizardStep(0)">
                  Get Started <ArrowRightIcon :size="16" :stroke-width="2" />
                </button>
              </div>
            </div>

            <!-- Standard details panel (all other steps / accounts) -->
            <div v-else-if="activeTimelineItem" class="timeline-details-card">
              <div class="d-flex justify-space-between align-center mb-small">
                <div class="timeline-text-content d-flex flex-column timeline-text-content-gap">
                  <h3 class="text-h3">{{ activeTimelineItem.title }} Details</h3>
                  <p class="text-body">{{ activeTimelineItem.description }}</p>
                </div>
                <div class="d-flex flex-column align-center progress-chip-container">
                  <v-progress-circular
                    v-model="activeTimelineProgress"
                    :color="progressCircularColor"
                    bg-color="grey-lighten-3"
                    rotate="360"
                    size="100"
                    width="10"
                  >{{ activeTimelineProgress }}%</v-progress-circular>
                  <v-chip
                    :color="activeTimelineItem.status === 'completed' ? 'success' : activeTimelineItem.status === 'in-progress' ? 'primary' : 'grey-lighten-1'"
                    :text-color="activeTimelineItem.status === 'completed' || activeTimelineItem.status === 'in-progress' ? 'white' : 'black'"
                    variant="flat"
                    label
                    size="small"
                    class="status-chip-uppercase"
                  >{{ activeTimelineItem.status }}</v-chip>
                </div>
              </div>
            </div>

            <div v-else class="timeline-details-placeholder">
              <p class="text-body text-neutral-disabled">Select a step on the timeline to view its details.</p>
            </div>

          </v-col>
        </v-row>
      </div>
    </PageCard>

  </div>

  <!-- ── Network Linking Dialog ──────────────────────────────────────────── -->
  <v-dialog v-model="showNetworkLinkDialog" :max-width="networkLinkMode === 'edit' ? '800' : '620'" persistent>
    <v-card class="nl-dialog-card">
      <v-card-title class="nl-dialog-header">
        <Globe :size="22" :stroke-width="1.5" class="nl-dialog-icon" />
        <span class="text-h3 text-primary">Pharmacy Network Linking</span>
        <v-spacer />
        <v-btn icon variant="text" size="small" @click="closeNetworkLinkDialog"><X :size="18" /></v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text class="nl-dialog-body">
        <!-- Step 1: linking level + dates -->
        <div v-if="networkLinkStep === 1">
          <p class="text-body nl-dialog-intro">
            <template v-if="networkLinkMode === 'edit'">Review the network link details below and update the effective dates as needed. The network and linking configuration cannot be changed after creation.</template>
            <template v-else>Start by selecting the type of linking you would like to configure. Then, set the linking effective date.</template>
          </p>
          <div v-if="networkLinkMode === 'edit'" class="nl-edit-field-row nl-edit-field-row--network">
            <span class="nl-edit-field-label">Network</span>
            <span class="nl-edit-field-value">{{ networkLinkForm.selectedNetwork }}</span>
          </div>
          <div class="nl-toggle-group">
            <button
              v-for="level in ['Account Level', 'Group Level']"
              :key="level"
              :class="['toc-toggle', 'nl-level-btn', { 'toc-toggle--selected': networkLinkForm.linkingLevel === level, 'nl-level-btn--disabled': networkLinkMode === 'edit' }]"
              :disabled="networkLinkMode === 'edit'"
              @click="networkLinkForm.linkingLevel = level"
            >
              <span>{{ level }}</span>
              <Check v-if="networkLinkForm.linkingLevel === level" :size="13" :stroke-width="2.5" class="nl-level-check" />
            </button>
          </div>
          <div v-if="networkLinkForm.linkingLevel === 'Account Level'" class="nl-alert">
            <div class="nl-alert-badge"><TriangleAlert :size="20" :stroke-width="2" /></div>
            <span><strong>Linking a network at the account level will apply to all existing and future groups and plans.</strong></span>
          </div>
          <div v-else class="nl-alert nl-alert--warning">
            <div class="nl-alert-badge"><TriangleAlert :size="20" :stroke-width="2" /></div>
            <span>Linking a network at the group level will apply to all existing and future plans under the selected group(s).<br><strong>Group level linking will override any configurations at the account level.</strong></span>
          </div>
          <div v-if="networkLinkForm.linkingLevel === 'Group Level'" class="nl-bpg-section">
            <p class="text-body-2 nl-bpg-label">
              {{ networkLinkMode === 'edit' ? 'Linked BIN, PCN, and Group number combinations' : 'Select the appropriate BIN, PCN, and Group number combinations for this plan' }}
            </p>
            <div class="nl-bpg-table-wrap">
              <table class="nl-bpg-table">
                <thead>
                  <tr>
                    <th class="nl-bpg-th-check">
                      <component
                        v-if="networkLinkMode !== 'edit'"
                        :is="allBpgSelected ? CheckSquare : Square"
                        :size="16" :stroke-width="1.5" class="nl-bpg-check-icon"
                        :class="{ 'nl-bpg-check-icon--checked': allBpgSelected }"
                        style="cursor:pointer"
                        @click="allBpgSelected = !allBpgSelected; networkLinkForm.selectedGroupIds = allBpgSelected ? currentNetworkBpgOptions.map(r => r.id) : []"
                      />
                    </th>
                    <th>BIN</th>
                    <th>PCN</th>
                    <th>Group Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="(networkLinkMode === 'edit' ? currentNetworkBpgOptions.filter(r => networkLinkForm.selectedGroupIds.includes(r.id)) : currentNetworkBpgOptions).length === 0">
                    <td colspan="4" class="nl-bpg-empty">No records found</td>
                  </tr>
                  <tr
                    v-for="row in (networkLinkMode === 'edit' ? currentNetworkBpgOptions.filter(r => networkLinkForm.selectedGroupIds.includes(r.id)) : currentNetworkBpgOptions)"
                    :key="row.id"
                    class="nl-bpg-row"
                    :style="networkLinkMode === 'edit' ? 'cursor:default' : ''"
                    @click="networkLinkMode !== 'edit' && (networkLinkForm.selectedGroupIds = networkLinkForm.selectedGroupIds.includes(row.id) ? networkLinkForm.selectedGroupIds.filter(id => id !== row.id) : [...networkLinkForm.selectedGroupIds, row.id])"
                  >
                    <td class="nl-bpg-th-check">
                      <component
                        :is="networkLinkForm.selectedGroupIds.includes(row.id) ? CheckSquare : Square"
                        :size="16" :stroke-width="1.5" class="nl-bpg-check-icon"
                        :class="{ 'nl-bpg-check-icon--checked': networkLinkForm.selectedGroupIds.includes(row.id) }"
                      />
                    </td>
                    <td>{{ row.bin }}</td>
                    <td>{{ row.pcn }}</td>
                    <td>{{ row.groupNumber }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="networkLinkMode !== 'edit' && networkLinkTouched && !networkLinkForm.selectedGroupIds.length" class="nl-bpg-error">At least one group must be selected</p>
          </div>
          <div class="nl-date-row">
            <DatePicker v-model="networkLinkForm.startDate" label="Eff. start date" variant="underlined" :readonly="networkEditStartDateReadOnly" :min="todayStr"
              :error="networkLinkTouched && !networkLinkForm.startDate"
              :error-messages="networkLinkTouched && !networkLinkForm.startDate ? ['Required'] : []" />
            <DatePicker v-model="networkLinkForm.endDate" label="Eff. end date" variant="underlined"
              :error="endDateBeforeStartError(networkLinkForm.startDate, networkLinkForm.endDate)"
              :error-messages="endDateBeforeStartError(networkLinkForm.startDate, networkLinkForm.endDate) ? ['Must be after start date'] : []" />
          </div>
        </div>

        <!-- Step 2: choose network -->
        <div v-else-if="networkLinkStep === 2">
          <p class="text-body nl-dialog-intro">Now, select the pharmacy network you would like to link.</p>
          <div class="nl-network-grid">
            <button
              v-for="net in availableNetworks"
              :key="net"
              :class="['toc-toggle', 'nl-network-btn', { 'toc-toggle--selected': networkLinkForm.selectedNetwork === net }]"
              @click="networkLinkForm.selectedNetwork = net"
            >
              <span>{{ net }}</span>
              <Check v-if="networkLinkForm.selectedNetwork === net" :size="13" :stroke-width="2.5" class="nl-level-check" />
            </button>
          </div>
        </div>
      </v-card-text>

      <v-divider />
      <v-card-actions class="nl-dialog-footer">
        <template v-if="networkLinkMode === 'edit'">
          <button class="button button-secondary" @click="closeNetworkLinkDialog">Cancel</button>
          <button class="button button-primary" @click="saveNetworkLink">Update Network</button>
        </template>
        <template v-else-if="networkLinkStep === 1">
          <button class="button button-secondary" @click="closeNetworkLinkDialog">Cancel</button>
          <button class="button button-primary" @click="advanceNetworkStep">Next</button>
        </template>
        <template v-else>
          <button class="button button-secondary" @click="networkLinkStep = 1">Back</button>
          <button class="button button-primary" :disabled="!networkLinkForm.selectedNetwork" @click="saveNetworkLink">Link Network</button>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ── Pharmacy Dialog (all 4 types, add + edit mode) ─────────────────── -->
  <v-dialog v-model="showPharmacyDialog" max-width="500" persistent>
    <v-card class="nl-dialog-card">
      <v-card-title class="nl-dialog-header">
        <Building2 :size="22" :stroke-width="1.5" class="nl-dialog-icon" />
        <span class="text-h3 text-primary">{{ pharmacyDialogTitle }}</span>
        <v-spacer />
        <v-btn icon variant="text" size="small" @click="showPharmacyDialog = false"><X :size="18" /></v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text class="nl-dialog-body">

        <!-- ── EDIT MODE ──────────────────────────────────────────────────── -->
        <template v-if="pharmacyDialogMode === 'edit'">

          <!-- Mail Order edit -->
          <template v-if="pharmacyDialogTab === 'Mail Order'">
            <p class="text-body nl-dialog-intro">Select the applicable Mail Order vendor(s) and complete the form below to configure.</p>
            <div class="nl-edit-field-row">
              <span class="nl-edit-field-label">NPI</span>
              <span class="nl-edit-field-value">{{ editingPharmacyItem?.npi || '—' }}</span>
            </div>
            <div class="nl-edit-field-row">
              <span class="nl-edit-field-label">Vendor Name</span>
              <span class="nl-edit-field-value">{{ editingPharmacyItem?.vendor || '—' }}</span>
            </div>
            <label class="nl-checkbox">
              <input type="checkbox" v-model="mailOrderEditForm.noBillNoPay" class="nl-checkbox-input" />
              <component :is="mailOrderEditForm.noBillNoPay ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
              <span class="nl-checkbox-label">Set to no bill/no pay</span>
            </label>
            <label class="nl-checkbox">
              <input type="checkbox" v-model="mailOrderEditForm.displayInPortals" class="nl-checkbox-input" />
              <component :is="mailOrderEditForm.displayInPortals ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
              <span class="nl-checkbox-label">Display in portals</span>
            </label>
            <div class="nl-date-row nl-date-row--mt">
              <DatePicker
                v-model="mailOrderEditForm.startDate"
                label="Effective start date"
                variant="underlined"
                :min="todayStr"
                :error="mailOrderEditTouched && !mailOrderEditForm.startDate"
                :error-messages="mailOrderEditTouched && !mailOrderEditForm.startDate ? ['Required'] : []"
              />
              <DatePicker
                v-model="mailOrderEditForm.endDate"
                label="Effective end date"
                variant="underlined"
                :error="endDateBeforeStartError(mailOrderEditForm.startDate, mailOrderEditForm.endDate)"
                :error-messages="endDateBeforeStartError(mailOrderEditForm.startDate, mailOrderEditForm.endDate) ? ['Must be after start date'] : []"
              />
            </div>
            <p class="nl-date-hint">Optional - Leave blank to keep active</p>
          </template>

          <!-- In-House / Custom / Specialty edit -->
          <template v-else>
            <div class="nl-edit-field-row">
              <span class="nl-edit-field-label">NPI</span>
              <span class="nl-edit-field-value">{{ editingPharmacyItem?.ncpdp || editingPharmacyItem?.npis || '—' }}</span>
            </div>
            <div class="nl-edit-field-row">
              <span class="nl-edit-field-label">Pharmacy name</span>
              <span class="nl-edit-field-value">{{ editingPharmacyItem?.pharmacyName || '—' }}</span>
            </div>
            <label class="nl-checkbox">
              <input type="checkbox" v-model="inhouseEditForm.noBillNoPay" class="nl-checkbox-input" />
              <component :is="inhouseEditForm.noBillNoPay ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
              <span class="nl-checkbox-label">Set to no bill/no pay</span>
            </label>
            <div class="nl-date-row nl-date-row--mt">
              <DatePicker
                v-model="inhouseEditForm.startDate"
                label="Effective start date"
                variant="underlined"
                :min="todayStr"
                :error="inhouseEditTouched && !inhouseEditForm.startDate"
                :error-messages="inhouseEditTouched && !inhouseEditForm.startDate ? ['Required'] : []"
              />
              <DatePicker
                v-model="inhouseEditForm.endDate"
                label="Effective end date"
                variant="underlined"
                :error="endDateBeforeStartError(inhouseEditForm.startDate, inhouseEditForm.endDate)"
                :error-messages="endDateBeforeStartError(inhouseEditForm.startDate, inhouseEditForm.endDate) ? ['Must be after start date'] : []"
              />
            </div>
          </template>

        </template>

        <!-- ── ADD MODE ───────────────────────────────────────────────────── -->
        <template v-else>

          <!-- In-House -->
          <template v-if="pharmacyDialogTab === 'In-House'">
            <div v-for="(form, idx) in inhouseCustomForms" :key="idx" class="nl-repeatable-row">
              <div v-if="inhouseCustomForms.length > 1" class="nl-repeatable-row-header">
                <span class="nl-repeatable-row-label">Pharmacy {{ idx + 1 }}</span>
                <button class="nl-remove-row-btn" @click="removeInhouseForm(idx)" title="Remove this pharmacy">
                  <Trash2 :size="16" :stroke-width="1.75" />
                </button>
              </div>
              <p class="nl-dialog-field-label">NPI</p>
              <v-textarea
                v-model="form.ncpdp"
                variant="underlined"
                density="compact"
                :messages="inhouseAddTouched && !form.ncpdp ? '' : 'Enter one NPI per line'"
                :error="inhouseAddTouched && !form.ncpdp"
                :error-messages="inhouseAddTouched && !form.ncpdp ? ['Required'] : []"
                rows="3"
                class="nl-textarea"
                @blur="form.npiChips = generateNpiChips(form.ncpdp)"
              />
              <div v-if="form.npiChips.length" class="nl-npi-chips">
                <span v-for="chip in form.npiChips" :key="chip.npi" class="nl-npi-chip">{{ chip.name }}</span>
              </div>
              <label class="nl-checkbox nl-checkbox--mt">
                <input type="checkbox" v-model="form.noBillNoPay" class="nl-checkbox-input" />
                <component :is="form.noBillNoPay ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
                <span class="nl-checkbox-label">Set to no bill/no pay</span>
              </label>
              <div class="nl-date-row nl-date-row--mt">
                <DatePicker
                  v-model="form.startDate"
                  label="Effective start date"
                  variant="underlined"
                  :min="todayStr"
                  :error="inhouseAddTouched && !form.startDate"
                  :error-messages="inhouseAddTouched && !form.startDate ? ['Required'] : []"
                />
                <DatePicker v-model="form.endDate" label="Effective end date" variant="underlined" />
              </div>
              <v-divider v-if="idx < inhouseCustomForms.length - 1" class="nl-row-divider" />
            </div>
            <button class="nl-add-link" @click="addInhouseForm">+ Add New Pharmacy</button>
          </template>

          <!-- Specialty -->
          <template v-else-if="pharmacyDialogTab === 'Specialty'">
            <div v-for="(form, idx) in specialtyForms" :key="idx" class="nl-repeatable-row">
              <div class="nl-specialty-row-header">
                <span class="nl-dialog-field-label">Specialty pharmacy type</span>
                <button v-if="specialtyForms.length > 1" class="nl-remove-btn" @click="specialtyForms.splice(idx, 1)">
                  <Trash2 :size="16" :stroke-width="1.5" />
                </button>
              </div>
              <div class="nl-level-btn-group nl-level-btn-group--wrap">
                <button
                  v-for="opt in specialtyTypeOptions"
                  :key="opt"
                  :class="['toc-toggle', 'nl-level-btn', { 'toc-toggle--selected': form.pharmacyType === opt }]"
                  @click="form.pharmacyType = opt"
                >
                  <Check v-if="form.pharmacyType === opt" :size="13" :stroke-width="2.5" class="nl-level-check" />
                  {{ opt }}
                </button>
              </div>
              <div v-if="form.pharmacyType === 'Specific Pharmacies'" class="nl-npi-section">
                <label class="nl-dialog-field-label">NPI</label>
                <textarea
                  v-model="form.npis"
                  :class="['nl-npi-textarea', { 'nl-npi-textarea--error': specialtyNpiError(form) }]"
                  rows="3"
                  @blur="form.npiChips = generateNpiChips(form.npis)"
                />
                <p v-if="specialtyNpiError(form)" class="nl-field-error">Required</p>
                <p v-else class="nl-npi-hint">Enter one NPI per line</p>
                <div v-if="form.npiChips.length" class="nl-npi-chips">
                  <span v-for="chip in form.npiChips" :key="chip.npi" class="nl-npi-chip">{{ chip.name }}</span>
                </div>
              </div>
              <label class="nl-checkbox nl-checkbox--mt">
                <input type="checkbox" v-model="form.noBillNoPay" class="nl-checkbox-input" />
                <component :is="form.noBillNoPay ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
                <span class="nl-checkbox-label">Set to no bill/no pay</span>
              </label>
              <div class="nl-date-row nl-date-row--mt">
                <DatePicker
                  v-model="form.startDate"
                  label="Effective start date"
                  variant="underlined"
                  :min="todayStr"
                  :error="specialtyStartDateError(form)"
                  :error-messages="specialtyStartDateError(form) ? ['Required'] : []"
                />
                <DatePicker v-model="form.endDate" label="Effective end date" variant="underlined" />
              </div>
              <v-divider v-if="idx < specialtyForms.length - 1" class="nl-row-divider" />
            </div>
            <button class="nl-add-link" @click="addSpecialtyForm">+ Add new pharmacy type</button>
          </template>

          <!-- Mail Order -->
          <template v-else-if="pharmacyDialogTab === 'Mail Order'">
            <p class="text-body nl-dialog-intro">Select the applicable Mail Order vendor(s) and complete the form below to configure.</p>
            <div v-for="(form, idx) in mailOrderForms" :key="idx" class="nl-repeatable-row">
              <div v-if="mailOrderForms.length > 1" class="nl-repeatable-row-header">
                <span class="nl-repeatable-row-label">Provider {{ idx + 1 }}</span>
                <button class="nl-remove-row-btn" @click="removeMailOrderForm(idx)" title="Remove this provider">
                  <Trash2 :size="16" :stroke-width="1.75" />
                </button>
              </div>
              <div v-if="form.vendors.length" class="nl-vendor-chips mb-2">
                <v-chip
                  v-for="vendor in form.vendors"
                  :key="vendor"
                  variant="flat"
                  color="primary"
                  class="nl-autocomplete-chip"
                >
                  {{ vendor }}
                  <span class="nl-chip-close ml-1" @click.stop="form.vendors = form.vendors.filter(v => v !== vendor)">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0F285B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </span>
                </v-chip>
              </div>
              <p v-if="mailOrderAddTouched && !form.vendors.length" class="nl-field-error">Required</p>
              <div class="nl-vendor-picker-wrap">
                <div class="nl-account-search-field" :class="{ 'nl-account-search-field--active': form.showVendorList }">
                  <input
                    v-model="form.vendorSearch"
                    type="text"
                    class="nl-account-search-input"
                    placeholder="Vendor name"
                    @mousedown="form.showVendorList = true"
                    @blur="hideVendorList(form)"
                  />
                </div>
                <div v-if="form.showVendorList" class="nl-account-dropdown">
                  <div
                    v-for="vendor in filteredVendorOptions(idx)"
                    :key="vendor"
                    class="nl-account-option"
                    @mousedown.prevent
                    @click="toggleVendor(form, vendor)"
                  >
                    <div class="nl-acct-checkbox mr-2" :class="{ active: form.vendors.includes(vendor) }">
                      <Check v-if="form.vendors.includes(vendor)" :size="12" :stroke-width="3" />
                    </div>
                    <span>{{ vendor }}</span>
                  </div>
                  <div v-if="filteredVendorOptions(idx).length === 0" class="nl-no-vendor-results">
                    No vendors found
                  </div>
                </div>
              </div>
              <label class="nl-checkbox nl-checkbox--mt">
                <input type="checkbox" v-model="form.noBillNoPay" class="nl-checkbox-input" />
                <component :is="form.noBillNoPay ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
                <span class="nl-checkbox-label">Set to no bill/no pay</span>
              </label>
              <label class="nl-checkbox">
                <input type="checkbox" v-model="form.displayInPortals" class="nl-checkbox-input" />
                <component :is="form.displayInPortals ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
                <span class="nl-checkbox-label">Display in portals</span>
              </label>
              <div class="nl-date-row nl-date-row--mt">
                <DatePicker
                  v-model="form.startDate"
                  label="Effective start date"
                  variant="underlined"
                  :min="todayStr"
                  :error="mailOrderAddTouched && !form.startDate"
                  :error-messages="mailOrderAddTouched && !form.startDate ? ['Required'] : []"
                />
                <DatePicker v-model="form.endDate" label="Effective end date" variant="underlined" />
              </div>
              <p class="nl-date-hint">Optional - Leave blank to keep active</p>
              <v-divider v-if="idx < mailOrderForms.length - 1" class="nl-row-divider" />
            </div>
            <button v-if="canAddMoreMailOrders" class="nl-add-link" @click="addMailOrderForm">+ Add New Provider</button>
          </template>

          <!-- Custom -->
          <template v-else-if="pharmacyDialogTab === 'Custom'">
            <div v-for="(form, idx) in inhouseCustomForms" :key="idx" class="nl-repeatable-row">
              <div v-if="inhouseCustomForms.length > 1" class="nl-repeatable-row-header">
                <span class="nl-repeatable-row-label">Pharmacy {{ idx + 1 }}</span>
                <button class="nl-remove-row-btn" @click="removeInhouseForm(idx)" title="Remove this pharmacy">
                  <Trash2 :size="16" :stroke-width="1.75" />
                </button>
              </div>
              <p class="nl-dialog-field-label">NPI</p>
              <v-textarea
                v-model="form.ncpdp"
                variant="underlined"
                density="compact"
                :messages="inhouseAddTouched && !form.ncpdp ? '' : 'Enter one NPI per line'"
                :error="inhouseAddTouched && !form.ncpdp"
                :error-messages="inhouseAddTouched && !form.ncpdp ? ['Required'] : []"
                rows="3"
                class="nl-textarea"
                @blur="form.npiChips = generateNpiChips(form.ncpdp)"
              />
              <div v-if="form.npiChips.length" class="nl-npi-chips">
                <span v-for="chip in form.npiChips" :key="chip.npi" class="nl-npi-chip">{{ chip.name }}</span>
              </div>
              <label class="nl-checkbox nl-checkbox--mt">
                <input type="checkbox" v-model="form.noBillNoPay" class="nl-checkbox-input" />
                <component :is="form.noBillNoPay ? CheckSquare : Square" :size="18" :stroke-width="1.5" class="nl-checkbox-icon" />
                <span class="nl-checkbox-label">Set to no bill/no pay</span>
              </label>
              <div class="nl-date-row nl-date-row--mt">
                <DatePicker
                  v-model="form.startDate"
                  label="Effective start date"
                  variant="underlined"
                  :min="todayStr"
                  :error="inhouseAddTouched && !form.startDate"
                  :error-messages="inhouseAddTouched && !form.startDate ? ['Required'] : []"
                />
                <DatePicker v-model="form.endDate" label="Effective end date" variant="underlined" />
              </div>
              <v-divider v-if="idx < inhouseCustomForms.length - 1" class="nl-row-divider" />
            </div>
            <button class="nl-add-link" @click="addInhouseForm">+ Add New Pharmacy</button>
          </template>

        </template>

      </v-card-text>

      <v-divider />
      <v-card-actions class="nl-dialog-footer">
        <button class="button button-secondary" @click="showPharmacyDialog = false">Cancel</button>
        <button v-if="pharmacyDialogMode === 'edit'" class="button button-primary" @click="savePharmacyEdit">Update Pharmacy</button>
        <button v-else class="button button-primary" @click="savePharmacy">Add Pharmacies</button>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ── TOAST NOTIFICATIONS ───────────────────────────────────────────── -->
  <v-snackbar
    v-model="toast.show"
    :color="toast.color"
    location="top right"
    :timeout="3000"
    rounded="lg"
  >
    {{ toast.message }}
  </v-snackbar>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import AccountSelector from '@/components/common/AccountSelector.vue';
import PageCard from '@/components/common/PageCard.vue';
import Button from '@/components/ui/Button.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import FilteringPill from '@/components/ui/FilteringPill.vue';
import Select from '@/components/ui/Select.vue';
import Dialog from '@/components/ui/Dialog.vue';
import TextField from '@/components/ui/TextField.vue';
import FileUploader from '@/components/ui/FileUploader.vue';
import Autocomplete from '@/components/ui/Autocomplete.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import {
  Hourglass, CircleCheckBig, XCircle,
  Save as SaveIcon, LayoutList as LayoutListIcon, CircleCheck as CircleCheckIcon,
  ArrowRight as ArrowRightIcon, Pencil, CheckSquare, Square, ChevronDown, PlusCircle, X, Check, CloudDownload, TriangleAlert,
  Building2, Shield, Link2, Users, FileText, Search, Globe, Trash2, Paperclip,
} from 'lucide-vue-next';
import EmptyStateImg from '@/assets/EmptyState.svg';
import { VRow, VCol, VProgressCircular } from 'vuetify/components';

const STARK_INDUSTRIES_ID = 1;
const WAYNE_ENTERPRISES_ID = 2;
const OSCORP_ID = 4;

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);
const wizardActive = ref(false);


const currentWizardStep = ref(0);

// Step 4: Transition of Care
const tocHistoricalClaims = ref<boolean | null>(false);
const tocRxWatchtower = ref<boolean | null>(true);
const tocPriorAuth = ref<boolean | null>(false);

// ─── Step 5: Programs ─────────────────────────────────────────────────────────

const progFilters = ['All', 'Active', 'Terminated'];
const progActiveFilter = ref('All');

const programs = ref([
  {
    id: 1,
    name: 'Liviniti',
    status: 'Active',
    effStartDate: '03/01/2026',
    effEndDate: '',
    optionName: 'Southern Scripts',
    invoice: 'Yes',
    merpAdmin: '',
    rates: [
      { rate: 'Admin Fee',                    type: 'CLAIM',      amount: '$8',     groupBy: 'Admin Fee', payTo: '-',            comment: '-', effStartDate: '03/01/2026', effEndDate: '02/28/2027' },
      { rate: 'Admin Fee',                    type: 'CLAIM',      amount: '$8.25',  groupBy: 'Admin Fee', payTo: '-',            comment: '-', effStartDate: '03/01/2027', effEndDate: '02/29/2028' },
      { rate: 'Admin Fee',                    type: 'CLAIM',      amount: '$8.5',   groupBy: 'Admin Fee', payTo: '-',            comment: '-', effStartDate: '03/01/2028', effEndDate: '-' },
      { rate: 'Southern Scripts Monthly Minimum', type: 'MONTHLYMIN', amount: '$1200', groupBy: '-',        payTo: '-',            comment: '-', effStartDate: '03/01/2026', effEndDate: '-' },
      { rate: 'Consultant Fees',              type: 'CLAIM',      amount: '$1',     groupBy: 'Admin Fee', payTo: 'EPIC Brokers', comment: '-', effStartDate: '03/01/2026', effEndDate: '-' },
    ],
  },
  {
    id: 2,
    name: 'RxCompass Entity',
    status: 'Active',
    effStartDate: '03/01/2026',
    effEndDate: '',
    optionName: 'RxCompass Entity',
    invoice: 'Yes',
    merpAdmin: '',
    rates: [],
  },
  {
    id: 3,
    name: 'RxCompass OLP',
    status: 'Active',
    effStartDate: '03/01/2026',
    effEndDate: '',
    optionName: 'RxCompass OLP',
    invoice: 'No',
    merpAdmin: '',
    rates: [],
  },
]);

const filteredPrograms = computed(() =>
  progActiveFilter.value === 'All'
    ? programs.value
    : programs.value.filter(p => p.status === progActiveFilter.value)
);

const progHeaders = [
  { title: 'Program Name',    key: 'name' },
  { title: 'Eff. Start Date', key: 'effStartDate' },
  { title: 'Eff. End Date',   key: 'effEndDate' },
];

const progRatesHeaders = [
  { title: 'Rate',             key: 'rate' },
  { title: 'Type',             key: 'type' },
  { title: 'Amount',           key: 'amount' },
  { title: 'Group By',         key: 'groupBy' },
  { title: 'Pay To',           key: 'payTo' },
  { title: 'Comment',          key: 'comment' },
  { title: 'Eff. Start Date',  key: 'effStartDate' },
  { title: 'Eff. End Date',    key: 'effEndDate' },
];

// ─── Step 6: Limits & Controls ────────────────────────────────────────────────

const lcRequestChange = ref(false);

const lcNotifyThreshold = ref('10000');
const lcRecipients = ref<string[]>([]);

const lcDawNotes = ref('');
const lcDawPenalties = ref([
  {
    key: 'daw1',
    label: 'DAW Penalty 1',
    description: 'The member requests a brand name drug when a generic equivalent is available and the prescriber has not indicated "dispense as written." The member pays the brand copay plus the difference between the brand and generic price.',
    value: true,
  },
  {
    key: 'daw2',
    label: 'DAW Penalty 2',
    description: 'The prescriber indicates "dispense as written" for a brand name drug when a generic equivalent is available. The member pays the brand copay plus the difference between the brand and generic price.',
    value: true,
  },
]);

// ─── Step 7: Billing ─────────────────────────────────────────────────────────

const blEinNumber = ref('');
const formatEin = (val: string) => {
  const digits = val.replace(/\D/g, '').slice(0, 9);
  return digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
};

// B-21: Existing billing party
const blExistingParty = ref('no');
const blTpaOptions = ['Southern Scripts TPA', 'Acclaim Benefits', 'Benefit Advantage'];
const blSelectedTpa = ref('');

// B-01/B-02: Payment method
const blPaymentMethod = ref('ACH');
const blAchMethod = ref('debit');

// B-04: Debit pull timing
const blDebitTiming = ref('');
const blDebitTimingOptions = ['3–5 business days after billing complete', '10 business days', 'Prior approval required', 'Custom'];
const blDebitApprovalEmail = ref('');
const blDebitTimingNote = ref('');

// B-05/B-14: Contacts
const blResponsibleContactOptions = computed(() => {
  if (blExistingParty.value === 'yes' && blSelectedTpa.value) {
    return apVendorContacts.value
      .filter(c => c.vendor === blSelectedTpa.value)
      .map(c => c.name);
  }
  return apClientContacts.value.map(c => c.name);
});
const blRebateContactOptions = computed(() => apClientContacts.value.map(c => c.name));
const blResponsibleContacts = ref<string[]>([]);
const blRebateContacts = ref<string[]>([]);
watch([() => blExistingParty.value, () => blSelectedTpa.value], () => {
  blResponsibleContacts.value = [];
});

// B-07: PHI toggle
const blIncludePhi = ref('no');

// B-11: Billing cycle
const blBillingCycle = ref('');
const blCycleOptions = ['Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly', 'Quad-Monthly', 'Custom'];
const blCustomCycleNote = ref('');

// B-20: Separate invoices
const blSeparateInvoices = ref('no');
const blSeparateInvoicesSplit = ref('');
const blInvoiceSplitOptions = ['AR Type', 'Employee Location', 'Member', 'Employee Status'];

// B-08/B-09: Reporting breakouts
const blReportingBreakouts = ref('no');
const blReportingBreakoutSelections = ref<string[]>([]);
const blReportingBreakoutItems = [
  'Detail by AR Type',
  'Detail by Employee Location',
  'Detail by Employee Location and AR Type',
  'Detail by Employee Location and Member',
  'Detail by Employee Status',
  'Detail by Group ID',
  'Detail by Member',
  'Summary by AR Type',
  'Summary by Employee Location',
  'Summary by Employee Status',
];

// B-12: Invoice breakout
const blInvoiceBreakout = ref('no');
const blInvoiceBreakoutSelection = ref('');
const blInvoiceBreakoutItems = ['AR Type', 'Employee Location', 'Member', 'Employee Status', 'Custom'];
const blInvoiceBreakoutNote = ref('');

const blNotes = ref('');

const blEditingSetup = ref(false);
const blEditingPayment = ref(false);
const blEditingInvoice = ref(false);
const blEditingReport = ref(false);
const blEditingRebate = ref(false);
const blEditingNotes = ref(false);

// ACH upload state — Payment Method card
const blW9File = ref<string | null>(null);
const blAchAuthFile = ref<string | null>(null);
const blPendingW9Removal = ref(false);
const blPendingAchAuthRemoval = ref(false);

const savePaymentCard = () => {
  if (blPendingW9Removal.value) blW9File.value = null;
  blPendingW9Removal.value = false;
  if (blPendingAchAuthRemoval.value) blAchAuthFile.value = null;
  blPendingAchAuthRemoval.value = false;
  blEditingPayment.value = false;
};
const cancelPaymentCard = () => {
  blPendingW9Removal.value = false;
  blPendingAchAuthRemoval.value = false;
  blEditingPayment.value = false;
};

// ACH upload state — Rebate Setup card
const blRebateW9File = ref<string | null>(null);
const blRebateAchAuthFile = ref<string | null>(null);
const blPendingRebateW9Removal = ref(false);
const blPendingRebateAchAuthRemoval = ref(false);

const saveRebateCard = () => {
  if (blPendingRebateW9Removal.value) blRebateW9File.value = null;
  blPendingRebateW9Removal.value = false;
  if (blPendingRebateAchAuthRemoval.value) blRebateAchAuthFile.value = null;
  blPendingRebateAchAuthRemoval.value = false;
  blEditingRebate.value = false;
};
const cancelRebateCard = () => {
  blPendingRebateW9Removal.value = false;
  blPendingRebateAchAuthRemoval.value = false;
  blEditingRebate.value = false;
};

// ─── Step 8: ID Cards ─────────────────────────────────────────────────────────
const idVendorType = ref('Internal');
const idVendorTypeOptions = ['Internal', 'Carrier', 'N/A'];
const idCarrierVendorName = ref('');
const idCarrierVendorOptions = [
  'Aetna', 'Anthem', 'Blue Cross Blue Shield', 'Cigna', 'CVS Caremark',
  'Express Scripts', 'Humana', 'Medco', 'OptumRx', 'United Healthcare',
];
const downloadCarrierKit = () => {
  console.log('Download carrier kit');
  // Production: trigger zip download from server
};
const idCombineRxMedical = ref(false);
const idSendCards = ref(false);
const idDaysToSend = ref('');
const idProcessingId = ref('Cardholder ID');
const idProcessingIdOptions = ['Cardholder ID', 'Alternate ID', 'Newtech Family ID'];
const idPersonCodeChars = ref('3');
const idInitialMailing = ref('');
const idAdditionalCard = ref('');
const idMailingOptions = ['Mail to member', 'Mail to employer', 'Mail to HR', 'No mailing'];
const idAttention = ref('');
const idMailingAddress = ref('');
const idNotes = ref('');
const idAutoGenCards = ref({
  nameChange: true,
  addressChange: true,
  dependentChange: true,
  locationChange: true,
  effectiveDateChange: true,
});
const idEffectiveStart = ref('');
const idEffectiveEnd = ref('');

const lcOverrides = [
  'Vacation Supply',
  'Lost/Stolen Meds',
  'Dosage Change',
  '2 Overrides Allowed Per Year',
  '30 Days Supply Override',
];

const lcFields = ref([
  { key: 'refillRetail',    label: 'Refill Too Soon – Retail',     value: '75%' },
  { key: 'refillMail',      label: 'Refill Too Soon – Mail',       value: '80%' },
  { key: 'maxClaimDays',    label: 'Max Claim Days',               value: '99' },
  { key: 'maxDaySupply',    label: 'Max Day Supply',               value: '90' },
  { key: 'maxDollarRetail', label: 'Max Dollar – Retail',          value: '$1,500' },
  { key: 'maxDollarCmpd',   label: 'Max Dollar Per Compound',      value: '$200' },
  { key: 'maxDollarMail',   label: 'Max Dollar – Mail',            value: '$1,500' },
]);

const isStarkIndustries = computed(() => selectedAccount.value === STARK_INDUSTRIES_ID);
const isWayneEnterprises = computed(() => selectedAccount.value === WAYNE_ENTERPRISES_ID);
const isOscorp = computed(() => selectedAccount.value === OSCORP_ID);
const isWizardAccount = computed(() => isStarkIndustries.value || isOscorp.value);

const gapSections = [
  { label: 'Account Information',  icon: Building2  },
  { label: 'Plan Design',          icon: Shield     },
  { label: 'Benefit Information',  icon: Link2      },
  { label: 'Account Contacts',     icon: Users      },
  { label: 'Third Party Vendors',  icon: FileText   },
];

const selectedAccountName = computed(() => {
  const account = accountOptions.value.find(acc => acc.id === selectedAccount.value);
  if (!account) return '';
  return isWayneEnterprises.value
    ? `Plan Configuration for ${account.name}`
    : `Implementation Tracker for ${account.name}`;
});

const selectedAccountDescription = computed(() =>
  isWayneEnterprises.value ? '' : 'Implementation progress.'
);

const wizardSteps = ref([
  { name: 'Account Profile',        required: true,  status: 'not-started',  description: 'Confirm account details, set effective dates, and review or update account contacts.' },
  { name: 'Network Configuration',  required: true,  status: 'not-started',  description: 'Define the pharmacy network and coverage settings for this account.' },
  { name: 'Plan Design',            required: true,  status: 'not-started',  description: 'Configure the benefit structure, cost-sharing rules, and coverage tiers.' },
  { name: 'Transition of Care',     required: false, status: 'not-started',  description: 'Set up transition of care rules for members moving from another plan.' },
  { name: 'Programs',               required: false, status: 'not-started',  description: 'Select and configure clinical and specialty programs for this account.' },
  { name: 'Limits & Controls',      required: false, status: 'not-started',  description: 'Define quantity limits, step therapy rules, and utilization management controls.' },
  { name: 'Billing',                required: false, status: 'not-started',  description: 'Configure billing preferences, payment terms, and invoice settings.' },
  { name: 'ID Cards',               required: false, status: 'not-started',  description: 'Set up member ID card design and distribution preferences.' },
  { name: 'Verification & Summary', required: false, status: 'not-started',  description: 'Review the completion status of all configuration steps before finishing plan setup.' },
]);

const wizardCompletionPercent = computed(() => {
  const completed = wizardSteps.value.filter(s => s.status === 'complete').length;
  return Math.round((completed / wizardSteps.value.length) * 100);
});

const implementationSteps = ref([
  {
    title: 'Plan Setup',
    description: 'Initial setup of the account configurations.',
    status: 'in-progress',
    icon: CircleCheckBig,
    active: true,
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    assignedTo: 'John Doe',
    notes: 'All initial plan parameters have been configured and approved.',
  },
  {
    title: 'Contract Status',
    description: 'Review and finalization of contractual agreements.',
    status: 'in-progress',
    icon: Hourglass,
    active: false,
    startDate: '2025-01-16',
    endDate: '2025-02-10',
    assignedTo: 'Jane Smith',
    notes: 'Awaiting final signatures on the master service agreement.',
  },
  {
    title: 'Clinical Setup',
    description: 'Configuration of clinical programs and formularies.',
    status: 'pending',
    icon: XCircle,
    active: false,
    startDate: '2025-02-11',
    endDate: '2025-03-05',
    assignedTo: 'Dr. Alex Lee',
    notes: 'Formulary review in progress. PBM integration pending.',
  },
  {
    title: 'System Configuration',
    description: 'Technical setup and integration of systems.',
    status: 'pending',
    icon: XCircle,
    active: false,
    startDate: '2025-03-06',
    endDate: '2025-03-25',
    assignedTo: 'Tech Team',
    notes: 'System readiness checks scheduled for next week.',
  },
  {
    title: 'Eligibility',
    description: 'Processing and verification of member eligibility.',
    status: 'pending',
    icon: XCircle,
    active: false,
    startDate: '2025-03-26',
    endDate: '2025-04-10',
    assignedTo: 'Data Entry Team',
    notes: 'Initial member data received. Validation to begin shortly.',
  },
  {
    title: 'Cards',
    description: 'Issuance and distribution of member ID cards.',
    status: 'pending',
    icon: XCircle,
    active: false,
    startDate: '2025-04-11',
    endDate: '2025-04-30',
    assignedTo: 'Operations Team',
    notes: 'Card design approved. Production to start after eligibility is finalized.',
  },
]);

const activeTimelineItem = ref<any>(null);

const selectTimelineItem = (item: any) => {
  implementationSteps.value.forEach(step => { step.active = (step === item); });
  activeTimelineItem.value = item;
  // Collapse wizard sub-steps when switching away from Plan Setup
  if (item.title !== 'Plan Setup') {
    wizardActive.value = false;
  }
};

const selectWizardStep = (index: number) => {
  currentWizardStep.value = index;
  wizardActive.value = true;
};

const nextWizardStep = () => {
  if (wizardSteps.value[currentWizardStep.value].status === 'not-started') {
    wizardSteps.value[currentWizardStep.value].status = 'in-progress';
  }
  currentWizardStep.value++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const prevWizardStep = () => {
  // Always land on the previous step in read-only mode
  editingAccountProfile.value = false;
  editingCompanyInfo.value = false;
  currentWizardStep.value--;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const markCurrentStepComplete = () => {
  wizardSteps.value[currentWizardStep.value].status = 'complete';
  if (currentWizardStep.value < wizardSteps.value.length - 1) {
    currentWizardStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const markCurrentStepIncomplete = () => {
  wizardSteps.value[currentWizardStep.value].status = 'not-started';
};

const finishPlanSetup = () => {
  wizardActive.value = false;
  const contractStatus = implementationSteps.value.find(s => s.title === 'Contract Status');
  if (contractStatus) selectTimelineItem(contractStatus);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ─── Step 1 data ──────────────────────────────────────────────────────────────

const statusOptions = ['Implementation', 'Active', 'Inactive', 'Pending'];

// ── Account Profile — Client Contacts ─────────────────────────────────────────
const apClientContactHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Title', key: 'title' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: '', key: 'actions', sortable: false },
];
const apPhoneTypes = ['Office', 'Cell', 'Fax'];
const apNewPhone = () => ({ number: '', type: 'Office', ext: '' });
const apClientContacts = ref([
  { name: 'Nick Johnson', title: 'Benefits Manager', email: 'nick.johnson@starkind.com', phone: '(555) 234-5678', phones: [{ number: '(555) 234-5678', type: 'Office', ext: '' }] },
]);
const apShowAddContactDialog = ref(false);
const apContactForm = ref({ firstName: '', lastName: '', title: '', email: '', phones: [apNewPhone()], primaryPhoneIdx: 0 });
const apContactErrors = ref({ firstName: '', lastName: '', email: '' });
const apEditContactErrors = ref({ firstName: '', lastName: '', email: '' });
const apValidateContact = (form: { firstName: string; lastName: string; email: string }) => {
  const e = { firstName: '', lastName: '', email: '' };
  if (!form.firstName.trim()) e.firstName = 'First name is required.';
  if (!form.lastName.trim()) e.lastName = 'Last name is required.';
  if (!form.email.trim()) e.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
  return e;
};
const apResetContactForm = () => {
  apContactForm.value = { firstName: '', lastName: '', title: '', email: '', phones: [apNewPhone()], primaryPhoneIdx: 0 };
  apContactErrors.value = { firstName: '', lastName: '', email: '' };
};
const formatPhone = (val: string): string => {
  const d = val.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};
watch(() => apContactForm.value.phones, phones => {
  phones.forEach(ph => { const f = formatPhone(ph.number); if (f !== ph.number) ph.number = f; });
}, { deep: true });
const apSaveContact = () => {
  const errors = apValidateContact(apContactForm.value);
  apContactErrors.value = errors;
  if (Object.values(errors).some(e => e)) return;
  const phones = apContactForm.value.phones.filter(p => p.number);
  const primaryIdx = apContactForm.value.primaryPhoneIdx;
  apClientContacts.value.push({
    name: `${apContactForm.value.firstName} ${apContactForm.value.lastName}`,
    title: apContactForm.value.title,
    email: apContactForm.value.email,
    phones,
    primaryPhoneIdx: primaryIdx,
    phone: phones[primaryIdx]?.number ?? phones[0]?.number ?? '',
  });
  apShowAddContactDialog.value = false;
  apResetContactForm();
};
const apClientContactRowActions = [
  { label: 'Edit',   action: 'edit'   },
  { label: 'Remove', action: 'remove' },
];
const apEditingContactIndex = ref(-1);
const apShowEditContactDialog = ref(false);
const apEditContactForm = ref({ firstName: '', lastName: '', title: '', email: '', phones: [apNewPhone()], primaryPhoneIdx: 0 });
watch(() => apEditContactForm.value.phones, phones => {
  phones.forEach(ph => { const f = formatPhone(ph.number); if (f !== ph.number) ph.number = f; });
}, { deep: true });
const handleApClientContactRowAction = ({ action, item }: { action: string; item: any }) => {
  const idx = apClientContacts.value.indexOf(item);
  if (action === 'remove') {
    if (idx > -1) apClientContacts.value.splice(idx, 1);
  } else if (action === 'edit') {
    const nameParts = (item.name as string).split(' ');
    apEditContactForm.value = {
      firstName: nameParts[0] ?? '',
      lastName:  nameParts.slice(1).join(' '),
      title:     item.title ?? '',
      email:     item.email ?? '',
      phones:    item.phones?.length ? item.phones.map((p: any) => ({ ...p })) : [apNewPhone()],
      primaryPhoneIdx: item.primaryPhoneIdx ?? 0,
    };
    apEditingContactIndex.value = idx;
    apShowEditContactDialog.value = true;
  }
};
const apSaveEditContact = () => {
  const errors = apValidateContact(apEditContactForm.value);
  apEditContactErrors.value = errors;
  if (Object.values(errors).some(e => e)) return;
  const idx = apEditingContactIndex.value;
  if (idx > -1) {
    const phones = apEditContactForm.value.phones.filter(p => p.number);
    const primaryIdx = apEditContactForm.value.primaryPhoneIdx;
    apClientContacts.value[idx] = {
      name:  `${apEditContactForm.value.firstName} ${apEditContactForm.value.lastName}`,
      title: apEditContactForm.value.title,
      email: apEditContactForm.value.email,
      phones,
      primaryPhoneIdx: primaryIdx,
      phone: phones[primaryIdx]?.number ?? phones[0]?.number ?? '',
    };
  }
  apShowEditContactDialog.value = false;
};
const apEditContactDialogActions = computed(() => [
  { text: 'Cancel', styleType: 'secondary' as const, onClick: () => { apShowEditContactDialog.value = false; apEditContactErrors.value = { firstName: '', lastName: '', email: '' }; } },
  { text: 'Save Changes', styleType: 'primary' as const, onClick: apSaveEditContact },
]);
const apContactDialogActions = computed(() => [
  { text: 'Cancel', styleType: 'secondary' as const, onClick: () => { apShowAddContactDialog.value = false; apResetContactForm(); } },
  { text: 'Add Contact', styleType: 'primary' as const, onClick: apSaveContact },
]);

// ── Account Profile — Vendor Contacts ─────────────────────────────────────────
const apVendorContactHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Vendor', key: 'vendor' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: '', key: 'actions', sortable: false },
];
const apVendorContacts = ref<{ name: string; vendor: string; email: string; phone: string }[]>([
  { name: 'Mark Tillman', vendor: 'Southern Scripts TPA', email: 'mtillman@sstpa.com', phone: '(704) 555-0121' },
  { name: 'Dana Osei', vendor: 'Southern Scripts TPA', email: 'dosei@sstpa.com', phone: '(704) 555-0122' },
  { name: 'Rachel Vance', vendor: 'Acclaim Benefits', email: 'rvance@acclaim.com', phone: '(615) 555-0188' },
  { name: 'James Pruitt', vendor: 'Acclaim Benefits', email: 'jpruitt@acclaim.com', phone: '(615) 555-0189' },
  { name: 'Tara Mendez', vendor: 'Benefit Advantage', email: 'tmendez@benefitadv.com', phone: '(512) 555-0144' },
]);
const apShowVendorContactDialog = ref(false);
const apVendorContactSelections = ref<string[]>([]);
const apVendorContactData = [
  { name: 'Jordan Mills', title: 'Account Manager',    vendor: '90 Degree Benefits', email: 'jordan.mills@90degreebenefits.com', phone: '(555) 234-5678' },
  { name: 'Bob Carter',   title: 'Client Specialist',  vendor: '90 Degree Benefits', email: 'bob.carter@90degreebenefits.com',    phone: '(555) 345-6789' },
  { name: 'Sarah Lee',    title: 'Account Executive',  vendor: 'Acclaim Benefits',   email: 'sarah.lee@acclaimbenefits.com',      phone: '(555) 876-5432' },
  { name: 'Mark Davis',   title: 'Benefits Consultant',vendor: 'Acclaim Benefits',   email: 'mark.davis@acclaimbenefits.com',     phone: '(555) 456-7890' },
];
const apVendorContactOptions = computed(() => {
  const addedNames = new Set(apVendorContacts.value.map(c => c.name));
  const byVendor = new Map<string, string[]>();
  [...apVendorContactData]
    .filter(c => !addedNames.has(c.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(c => {
      if (!byVendor.has(c.vendor)) byVendor.set(c.vendor, []);
      byVendor.get(c.vendor)!.push(c.name);
    });
  const result: (string | { type: string; title: string })[] = [];
  [...byVendor.keys()].sort().forEach(vendor => {
    result.push({ type: 'subheader', title: vendor });
    byVendor.get(vendor)!.forEach(opt => result.push(opt));
  });
  return result;
});
const apRemoveVendorContact = (item: any) => {
  const idx = apVendorContacts.value.indexOf(item);
  if (idx > -1) apVendorContacts.value.splice(idx, 1);
};
const apSaveVendorContacts = () => {
  apVendorContactSelections.value.forEach(selection => {
    const already = apVendorContacts.value.some(c => c.name === selection);
    if (!already) {
      const data = apVendorContactData.find(c => c.name === selection);
      if (data) apVendorContacts.value.push({ name: data.name, vendor: data.vendor, email: data.email, phone: data.phone });
    }
  });
  apVendorContactSelections.value = [];
  apShowVendorContactDialog.value = false;
};
const apVendorContactDialogActions = computed(() => [
  { text: 'Cancel', styleType: 'secondary' as const, onClick: () => { apShowVendorContactDialog.value = false; apVendorContactSelections.value = []; } },
  { text: 'Add Contact', styleType: 'primary' as const, onClick: apSaveVendorContacts },
]);

const accountProfile = ref({
  accountName: 'Stark Industries',
  legalName: 'Stark Industries, Inc.',
  dba: '',
  effectiveStartDate: '03/22/2026',
  effectiveEndDate: '',
  testAccount: false,
  status: 'Implementation',
  isRxWatchtower: false,
  manualClaims: false,
});
const editableAccountProfile = ref({ ...accountProfile.value });
const editingAccountProfile = ref(false);
const startEditAccountProfile = () => { editableAccountProfile.value = { ...accountProfile.value }; editingAccountProfile.value = true; };
const saveAccountProfile = () => { accountProfile.value = { ...editableAccountProfile.value }; editingAccountProfile.value = false; };
const cancelEditAccountProfile = () => { editingAccountProfile.value = false; };

const companyInfo = ref({
  sicCode: '',
  physicalAddress1: '10880 Malibu Point',
  physicalAddress2: '',
  physicalCity: 'Malibu',
  physicalState: 'CA',
  physicalZip: '90265',
  physicalCountry: '',
  mailingAddress1: '',
  mailingAddress2: '',
  mailingCity: '',
  mailingState: '',
  mailingZip: '',
  mailingCountry: '',
});
const editableCompanyInfo = ref({ ...companyInfo.value });
const editingCompanyInfo = ref(false);
const sameAsPhysical = ref(false);

const toggleSameAsPhysical = () => {
  sameAsPhysical.value = !sameAsPhysical.value;
  if (sameAsPhysical.value) {
    editableCompanyInfo.value.mailingAddress1 = editableCompanyInfo.value.physicalAddress1;
    editableCompanyInfo.value.mailingAddress2 = editableCompanyInfo.value.physicalAddress2;
    editableCompanyInfo.value.mailingCity = editableCompanyInfo.value.physicalCity;
    editableCompanyInfo.value.mailingState = editableCompanyInfo.value.physicalState;
    editableCompanyInfo.value.mailingZip = editableCompanyInfo.value.physicalZip;
    editableCompanyInfo.value.mailingCountry = editableCompanyInfo.value.physicalCountry;
  }
};

const startEditCompanyInfo = () => {
  editableCompanyInfo.value = { ...companyInfo.value };
  sameAsPhysical.value = false;
  editingCompanyInfo.value = true;
};
const saveCompanyInfo = () => { companyInfo.value = { ...editableCompanyInfo.value }; editingCompanyInfo.value = false; };
const cancelEditCompanyInfo = () => { editingCompanyInfo.value = false; sameAsPhysical.value = false; };

// ─── Step 2: Network Configuration ───────────────────────────────────────────

const networkHeaders = [
  { title: 'Network Name', key: 'networkName' },
  { title: 'Status',       key: 'status' },
  { title: 'Linking Level', key: 'linkingLevel' },
  { title: 'Linked Groups', key: 'linkedGroups' },
  { title: 'Linked Plans',  key: 'linkedPlans' },
  { title: 'BIN',           key: 'bin' },
  { title: 'Eff. Start Date', key: 'effStartDate' },
  { title: 'End Date',      key: 'endDate' },
  { title: '',              key: 'actions', sortable: false },
];

const networkFilterPills = [
  { type: 'status', value: 'active',     label: 'Active',     isActive: true },
  { type: 'status', value: 'scheduled',  label: 'Scheduled',  isActive: false },
  { type: 'status', value: 'terminated', label: 'Terminated', isActive: false },
];

const networkRowsByAccount = ref<Record<number, any[]>>({
  1: [
    { networkName: 'First Choice Broad',  status: 'Scheduled', linkingLevel: 'Account', linkedGroups: 'All', linkedPlans: 'All', bin: '—', effStartDate: '09/01/2026', endDate: '—' },
    { networkName: 'Mail Order - Network', status: 'Scheduled', linkingLevel: 'Account', linkedGroups: 'All', linkedPlans: 'All', bin: '—', effStartDate: '09/01/2026', endDate: '—' },
    { networkName: 'Compliance',          status: 'Scheduled', linkingLevel: 'Account', linkedGroups: 'All', linkedPlans: 'All', bin: '—', effStartDate: '09/01/2026', endDate: '—' },
  ],
  2: [],
  3: [],
  4: [],
  5: [],
});

const currentNetworkRows = computed(() =>
  selectedAccount.value ? (networkRowsByAccount.value[selectedAccount.value] ?? []) : []
);

const pharmacyTabs = ['In-House', 'Specialty', 'Mail Order', 'Custom'];
const activePharmacyTab = ref('In-House');

// ─── Step 2: Network Linking dialog ───────────────────────────────────────────

const showNetworkLinkDialog = ref(false);
const networkLinkStep = ref(1);
const networkLinkMode = ref<'add' | 'edit'>('add');
const editingNetworkItem = ref<any>(null);
const editingNetworkIndex = ref(-1);
const networkBpgOptionsByAccount: Record<number, Array<{id: string, bin: string, pcn: string, groupNumber: string}>> = {
  1: [{ id: 'g1', bin: '025945', pcn: 'SSN', groupNumber: '1275' }],
  4: [{ id: 'g1', bin: '015433', pcn: 'SSN', groupNumber: 'BG3HW' }],
};
const currentNetworkBpgOptions = computed(() => networkBpgOptionsByAccount[selectedAccount.value] ?? []);
const networkEditStartDateReadOnly = computed(() => {
  if (networkLinkMode.value !== 'edit' || !networkLinkForm.value.startDate) return false;
  return new Date(networkLinkForm.value.startDate) < new Date();
});
const allBpgSelected = ref(false);
const networkLinkTouched = ref(false);
const networkBpgHeaders = [
  { title: 'BIN', key: 'bin', sortable: true },
  { title: 'PCN', key: 'pcn', sortable: true },
  { title: 'Group Number', key: 'groupNumber', sortable: true },
];

const toast = ref({ show: false, message: '', color: 'success' });
const showToast = (message: string, color: 'success' | 'error' | 'warning') => {
  toast.value = { show: true, message, color };
};

const todayStr = new Date().toISOString().split('T')[0];

const deriveStatus = (startDate: string, endDate: string): string => {
  if (!startDate) return 'Scheduled';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [sm, sd, sy] = startDate.split('/').map(Number);
  const start = new Date(sy, sm - 1, sd);
  if (start > today) return 'Scheduled';
  if (endDate && endDate !== '—') {
    const [em, ed, ey] = endDate.split('/').map(Number);
    if (new Date(ey, em - 1, ed) < today) return 'Terminated';
  }
  return 'Active';
};

const networkLinkForm = ref({ linkingLevel: 'Account Level', selectedGroupIds: [] as string[], startDate: '', endDate: '', selectedNetwork: '' });
const availableNetworks = ['First Choice Broad', 'First Choice Preferred', 'First Choice Limited', 'Mail Order - Network', 'Specialty Pharmacies', 'Variable Copay', 'SavePlus'];

const closeNetworkLinkDialog = () => {
  showNetworkLinkDialog.value = false;
  networkLinkStep.value = 1;
  networkLinkMode.value = 'add';
  editingNetworkItem.value = null;
  editingNetworkIndex.value = -1;
  networkLinkForm.value = { linkingLevel: 'Account Level', selectedGroupIds: [], startDate: '', endDate: '', selectedNetwork: '' };
  allBpgSelected.value = false;
  networkLinkTouched.value = false;
};

const advanceNetworkStep = () => {
  const groupInvalid = networkLinkForm.value.linkingLevel === 'Group Level' && !networkLinkForm.value.selectedGroupIds.length;
  if (!networkLinkForm.value.startDate || groupInvalid) {
    networkLinkTouched.value = true;
    return;
  }
  networkLinkTouched.value = false;
  networkLinkStep.value = 2;
};

const saveNetworkLink = () => {
  if (!networkLinkForm.value.startDate || !selectedAccount.value ||
      endDateBeforeStartError(networkLinkForm.value.startDate, networkLinkForm.value.endDate)) {
    networkLinkTouched.value = true;
    return;
  }
  if (!networkRowsByAccount.value[selectedAccount.value]) {
    networkRowsByAccount.value[selectedAccount.value] = [];
  }
  const arr = networkRowsByAccount.value[selectedAccount.value];

  if (networkLinkMode.value === 'edit' && editingNetworkIndex.value !== -1) {
    arr[editingNetworkIndex.value] = {
      ...editingNetworkItem.value,
      linkingLevel: networkLinkForm.value.linkingLevel === 'Account Level' ? 'Account' : 'Group',
      linkedGroups: networkLinkForm.value.linkingLevel === 'Account Level'
        ? 'All'
        : currentNetworkBpgOptions.value
            .filter(r => networkLinkForm.value.selectedGroupIds.includes(r.id))
            .map(r => r.groupNumber)
            .join(', ') || '—',
      effStartDate: networkLinkForm.value.startDate,
      endDate: networkLinkForm.value.endDate || '—',
    };
  } else {
    if (!networkLinkForm.value.selectedNetwork) return;
    arr.push({
      networkName: networkLinkForm.value.selectedNetwork,
      status: deriveStatus(networkLinkForm.value.startDate, networkLinkForm.value.endDate),
      linkingLevel: networkLinkForm.value.linkingLevel === 'Account Level' ? 'Account' : 'Group',
      linkedGroups: networkLinkForm.value.linkingLevel === 'Account Level'
        ? 'All'
        : currentNetworkBpgOptions.value
            .filter(r => networkLinkForm.value.selectedGroupIds.includes(r.id))
            .map(r => r.groupNumber)
            .join(', ') || '—',
      linkedPlans: networkLinkForm.value.linkingLevel === 'Account Level' ? 'All' : '—',
      bin: '—',
      effStartDate: networkLinkForm.value.startDate,
      endDate: networkLinkForm.value.endDate || '—',
    });
  }
  const wasEdit = networkLinkMode.value === 'edit';
  closeNetworkLinkDialog();
  showToast(wasEdit ? 'Pharmacy Network Updated Successfully' : 'Pharmacy Network Linking Successful', 'success');
};

// ─── Step 2: Preferred Pharmacy dialogs ──────────────────────────────────────

const pharmacyDataByAccount = ref<Record<number, Record<string, any[]>>>({
  1: {
    // Stark Industries — in implementation, all Scheduled with future dates
    'In-House': [
      { ncpdp: '1234567', pharmacyName: 'CVS Pharmacy #4821', status: 'Scheduled', noBillNoPay: false, startDate: '09/01/2026', endDate: '—' },
      { ncpdp: '7654321', pharmacyName: 'Walgreens #1093',    status: 'Scheduled', noBillNoPay: true,  startDate: '09/01/2026', endDate: '—' },
    ],
    'Specialty': [
      { pharmacyType: 'Specific Pharmacies', pharmacyName: 'Accredo Health Group', npis: '1562047839', noBillNoPay: false, status: 'Scheduled', startDate: '09/01/2026', endDate: '—' },
    ],
    'Mail Order': [
      { vendor: 'PILLPACK, LLC', status: 'Scheduled', noBillNoPay: false, displayInPortals: true, startDate: '09/01/2026', endDate: '—' },
    ],
    'Custom': [],
  },
  2: { 'In-House': [], 'Specialty': [], 'Mail Order': [], 'Custom': [] },
  3: { 'In-House': [], 'Specialty': [], 'Mail Order': [], 'Custom': [] },
  4: {
    // Oscorp — in implementation, all Scheduled with future dates
    'In-House': [
      { ncpdp: '1122334', pharmacyName: 'Rite Aid #5247',       status: 'Scheduled', noBillNoPay: false, startDate: '10/01/2026', endDate: '—' },
      { ncpdp: '9988776', pharmacyName: 'Costco Pharmacy #1190', status: 'Scheduled', noBillNoPay: false, startDate: '10/01/2026', endDate: '—' },
    ],
    'Specialty': [
      { pharmacyType: 'Specific Pharmacies', pharmacyName: 'Walgreens Specialty', npis: '1487263940', noBillNoPay: false, status: 'Scheduled', startDate: '10/01/2026', endDate: '—' },
      { pharmacyType: 'Specific Pharmacies', pharmacyName: 'CVS Specialty',       npis: '0934718265', noBillNoPay: false, status: 'Scheduled', startDate: '10/01/2026', endDate: '—' },
    ],
    'Mail Order': [
      { vendor: 'POSTAL PRESCRIPTION SERVICES', status: 'Scheduled', noBillNoPay: false, displayInPortals: false, startDate: '10/01/2026', endDate: '—' },
    ],
    'Custom': [],
  },
  5: { 'In-House': [], 'Specialty': [], 'Mail Order': [], 'Custom': [] },
});

const pharmacyData = computed(() => {
  if (!selectedAccount.value) return { 'In-House': [], 'Specialty': [], 'Mail Order': [], 'Custom': [] };
  return pharmacyDataByAccount.value[selectedAccount.value] ?? { 'In-House': [], 'Specialty': [], 'Mail Order': [], 'Custom': [] };
});

const pharmacyHeadersForTab = computed(() => {
  if (activePharmacyTab.value === 'Specialty') {
    return [
      { title: 'Pharmacy Name(s)',   key: 'pharmacyName' },
      { title: 'NPI',               key: 'npis' },
      { title: 'Status',            key: 'status' },
      { title: 'No Bill/No Pay',    key: 'noBillNoPay' },
      { title: 'Eff. Start Date',   key: 'startDate' },
      { title: 'Eff. End Date',     key: 'endDate' },
      { title: '',                  key: 'actions', sortable: false },
    ];
  }
  if (activePharmacyTab.value === 'Mail Order') {
    return [
      { title: 'Pharmacy Name(s)',   key: 'vendor' },
      { title: 'Status',             key: 'status' },
      { title: 'No Bill/No Pay',     key: 'noBillNoPay' },
      { title: 'Display in Portals', key: 'displayInPortals' },
      { title: 'Eff. Start Date',    key: 'startDate' },
      { title: 'Eff. End Date',      key: 'endDate' },
      { title: '',                   key: 'actions', sortable: false },
    ];
  }
  return [
    { title: 'Pharmacy Name(s)', key: 'pharmacyName' },
    { title: 'NPI',              key: 'ncpdp' },
    { title: 'Status',           key: 'status' },
    { title: 'No Bill/No Pay',   key: 'noBillNoPay' },
    { title: 'Eff. Start Date',  key: 'startDate' },
    { title: 'Eff. End Date',    key: 'endDate' },
    { title: '',                 key: 'actions', sortable: false },
  ];
});

const pharmacyBooleanColumnsForTab = computed(() => {
  if (activePharmacyTab.value === 'Mail Order') return ['noBillNoPay', 'displayInPortals'];
  return ['noBillNoPay'];
});

const showPharmacyDialog = ref(false);
const pharmacyDialogTab = ref('In-House');
const pharmacyDialogMode = ref<'add' | 'edit'>('add');
const editingPharmacyItem = ref<any>(null);
const editingPharmacyIndex = ref(-1);

const pharmacyDialogTitle = computed(() => `${pharmacyDialogTab.value} Pharmacies`);

const mockPharmacyBaseNames = ['CVS Pharmacy', 'Walgreens', 'Rite Aid', 'Walmart Pharmacy', 'Kroger Pharmacy', 'Costco Pharmacy'];
const generateNpiChips = (text: string): { npi: string; name: string }[] =>
  text.split('\n').map(l => l.trim()).filter(Boolean)
    .map((npi, i) => ({ npi, name: mockPharmacyBaseNames[i % mockPharmacyBaseNames.length] }));

const inhouseAddTouched = ref(false);
const inhouseEditTouched = ref(false);
const mailOrderAddTouched = ref(false);
const mailOrderEditTouched = ref(false);

type InhouseForm = { ncpdp: string; noBillNoPay: boolean; startDate: string; endDate: string; npiChips: { npi: string; name: string }[] };
const newInhouseForm = (): InhouseForm => ({ ncpdp: '', noBillNoPay: false, startDate: '', endDate: '', npiChips: [] });
const inhouseCustomForms = ref<InhouseForm[]>([newInhouseForm()]);
const addInhouseForm = () => {
  const allValid = inhouseCustomForms.value.every(f => !!f.ncpdp && !!f.startDate);
  if (!allValid) { inhouseAddTouched.value = true; return; }
  inhouseAddTouched.value = false;
  inhouseCustomForms.value.push(newInhouseForm());
};
const removeInhouseForm = (idx: number) => { inhouseCustomForms.value.splice(idx, 1); };
const inhouseEditForm = ref({ noBillNoPay: false, startDate: '', endDate: '' });
const mailOrderEditForm = ref({ noBillNoPay: false, displayInPortals: false, startDate: '', endDate: '' });
const specialtyForms = ref([{ pharmacyType: 'Liviniti', noBillNoPay: false, npis: '', npiChips: [] as { npi: string; name: string }[], startDate: '', endDate: '' }]);
const specialtyTouched = ref(false);
const specialtyStartDateError = (form: { startDate: string }) =>
  specialtyTouched.value && !form.startDate;
const specialtyNpiError = (form: { pharmacyType: string; npis: string }) =>
  specialtyTouched.value && form.pharmacyType === 'Specific Pharmacies' && !form.npis.trim();
const addSpecialtyForm = () => {
  const allValid = specialtyForms.value.every(f =>
    !!f.startDate && (f.pharmacyType !== 'Specific Pharmacies' || !!f.npis.trim())
  );
  if (!allValid) {
    specialtyTouched.value = true;
    return;
  }
  specialtyTouched.value = false;
  specialtyForms.value.push({ pharmacyType: 'Liviniti', noBillNoPay: false, npis: '', npiChips: [], startDate: '', endDate: '' });
};
type MailOrderForm = { vendors: string[]; noBillNoPay: boolean; displayInPortals: boolean; startDate: string; endDate: string; vendorSearch: string; showVendorList: boolean; };
const newMailOrderForm = (): MailOrderForm => ({ vendors: [], noBillNoPay: false, displayInPortals: false, startDate: '', endDate: '', vendorSearch: '', showVendorList: false });
const mailOrderForms = ref<MailOrderForm[]>([newMailOrderForm()]);
const selectedMailOrderVendors = computed(() => mailOrderForms.value.flatMap(f => f.vendors));
const filteredVendorOptions = (idx: number): string[] => {
  const otherSelected = mailOrderForms.value.filter((_, i) => i !== idx).flatMap(f => f.vendors);
  const available = mailOrderVendorOptions.filter(v => !otherSelected.includes(v));
  const q = mailOrderForms.value[idx]?.vendorSearch?.toLowerCase() ?? '';
  return q ? available.filter(v => v.toLowerCase().includes(q)) : available;
};
const toggleVendor = (form: MailOrderForm, vendor: string) => {
  const i = form.vendors.indexOf(vendor);
  if (i === -1) form.vendors.push(vendor);
  else form.vendors.splice(i, 1);
};
const hideVendorList = (form: MailOrderForm) => setTimeout(() => { form.showVendorList = false; }, 150);
const removeMailOrderForm = (idx: number) => { mailOrderForms.value.splice(idx, 1); };
const canAddMoreMailOrders = computed(() => selectedMailOrderVendors.value.length < mailOrderVendorOptions.length);
const addMailOrderForm = () => {
  const allValid = mailOrderForms.value.every(f => f.vendors.length > 0 && !!f.startDate);
  if (!allValid) { mailOrderAddTouched.value = true; return; }
  mailOrderAddTouched.value = false;
  mailOrderForms.value.push(newMailOrderForm());
};
const endDateBeforeStartError = (start: string, end: string) => {
  if (!end || !start) return false;
  const p = (s: string) => { const [m, d, y] = s.split('/'); return new Date(+y, +m - 1, +d); };
  return p(end) <= p(start);
};

const specialtyTypeOptions = ['Liviniti', 'Specific Pharmacies'];
const mailOrderVendorOptions = ['MIRX PHARMACY', 'POSTAL PRESCRIPTION SERVICES', 'DRUG SOURCE INC', 'TRUEPILL NY LLC', 'ENVISION PHARMACY', 'HEALTHDYNE', 'PILLPACK, LLC', 'PROACT PHARMACY'];

const pharmacyRowActions = [
  { label: 'Edit',   action: 'edit'   },
  { label: 'Remove', action: 'remove' },
];

const networkRowActions = [
  { label: 'Edit',   action: 'edit'   },
  { label: 'Remove', action: 'remove' },
];

const openPharmacyDialog = (tab: string) => {
  pharmacyDialogTab.value = tab;
  pharmacyDialogMode.value = 'add';
  editingPharmacyItem.value = null;
  editingPharmacyIndex.value = -1;
  inhouseCustomForms.value = [newInhouseForm()];
  inhouseAddTouched.value = false;
  specialtyForms.value = [{ pharmacyType: 'Liviniti', noBillNoPay: false, npis: '', npiChips: [], startDate: '', endDate: '' }];
  specialtyTouched.value = false;
  mailOrderForms.value = [newMailOrderForm()];
  mailOrderAddTouched.value = false;
  showPharmacyDialog.value = true;
};

const handlePharmacyRowAction = ({ action, item }: { action: string; item: any }) => {
  if (action === 'remove') {
    if (!selectedAccount.value) return;
    const arr = pharmacyDataByAccount.value[selectedAccount.value]?.[activePharmacyTab.value];
    if (arr) {
      const idx = arr.indexOf(item);
      if (idx !== -1) arr.splice(idx, 1);
    }
    return;
  }
  if (action === 'edit') {
    pharmacyDialogTab.value = activePharmacyTab.value;
    pharmacyDialogMode.value = 'edit';
    editingPharmacyItem.value = item;
    const arr = pharmacyDataByAccount.value[selectedAccount.value!]?.[activePharmacyTab.value] ?? [];
    editingPharmacyIndex.value = arr.indexOf(item);
    if (activePharmacyTab.value === 'Mail Order') {
      mailOrderEditForm.value = {
        noBillNoPay: !!item.noBillNoPay,
        displayInPortals: !!item.displayInPortals,
        startDate: item.startDate === '—' ? '' : item.startDate,
        endDate: item.endDate === '—' ? '' : item.endDate,
      };
    } else {
      inhouseEditForm.value = {
        noBillNoPay: !!item.noBillNoPay,
        startDate: item.startDate === '—' ? '' : item.startDate,
        endDate: item.endDate === '—' ? '' : item.endDate,
      };
    }
    inhouseEditTouched.value = false;
    mailOrderEditTouched.value = false;
    showPharmacyDialog.value = true;
  }
};

const handlePharmacyToggleCell = ({ key, item }: { key: string; item: any }) => {
  item[key] = !item[key];
};

const handleNetworkRowAction = ({ action, item }: { action: string; item: any }) => {
  if (action === 'remove' && selectedAccount.value) {
    const arr = networkRowsByAccount.value[selectedAccount.value];
    if (arr) {
      const idx = arr.indexOf(item);
      if (idx !== -1) arr.splice(idx, 1);
    }
    return;
  }
  if (action === 'edit' && selectedAccount.value) {
    const arr = networkRowsByAccount.value[selectedAccount.value] ?? [];
    editingNetworkItem.value = item;
    editingNetworkIndex.value = arr.indexOf(item);
    networkLinkMode.value = 'edit';
    const linkedGroupNumbers = item.linkingLevel === 'Group' && item.linkedGroups && item.linkedGroups !== 'All' && item.linkedGroups !== '—'
      ? item.linkedGroups.split(',').map((g: string) => g.trim())
      : [];
    networkLinkForm.value = {
      linkingLevel: item.linkingLevel === 'Account' ? 'Account Level' : 'Group Level',
      selectedGroupIds: (networkBpgOptionsByAccount[selectedAccount.value] ?? [])
        .filter(r => linkedGroupNumbers.includes(r.groupNumber))
        .map(r => r.id),
      startDate: item.effStartDate === '—' ? '' : item.effStartDate,
      endDate: item.endDate === '—' ? '' : item.endDate,
      selectedNetwork: item.networkName,
    };
    networkLinkStep.value = 1;
    showNetworkLinkDialog.value = true;
  }
};

const savePharmacyEdit = () => {
  if (editingPharmacyIndex.value === -1 || !selectedAccount.value) return;
  const arr = pharmacyDataByAccount.value[selectedAccount.value]?.[activePharmacyTab.value];
  if (!arr) return;
  if (activePharmacyTab.value === 'Mail Order') {
    if (!mailOrderEditForm.value.startDate) { mailOrderEditTouched.value = true; return; }
    mailOrderEditTouched.value = false;
    arr[editingPharmacyIndex.value] = {
      ...editingPharmacyItem.value,
      noBillNoPay: mailOrderEditForm.value.noBillNoPay,
      displayInPortals: mailOrderEditForm.value.displayInPortals,
      startDate: mailOrderEditForm.value.startDate || '—',
      endDate: mailOrderEditForm.value.endDate || '—',
    };
  } else {
    if (!inhouseEditForm.value.startDate) { inhouseEditTouched.value = true; return; }
    inhouseEditTouched.value = false;
    arr[editingPharmacyIndex.value] = {
      ...editingPharmacyItem.value,
      noBillNoPay: inhouseEditForm.value.noBillNoPay,
      startDate: inhouseEditForm.value.startDate || '—',
      endDate: inhouseEditForm.value.endDate || '—',
    };
  }
  showPharmacyDialog.value = false;
  showToast('Pharmacy Updated Successfully', 'success');
};

const savePharmacy = () => {
  if (!selectedAccount.value) return;
  const tab = pharmacyDialogTab.value;
  if (!pharmacyDataByAccount.value[selectedAccount.value]) {
    pharmacyDataByAccount.value[selectedAccount.value] = { 'In-House': [], 'Specialty': [], 'Mail Order': [], 'Custom': [] };
  }
  const accountData = pharmacyDataByAccount.value[selectedAccount.value];
  if (tab === 'In-House' || tab === 'Custom') {
    const allValid = inhouseCustomForms.value.every(f => !!f.ncpdp && !!f.startDate);
    if (!allValid) { inhouseAddTouched.value = true; return; }
    inhouseAddTouched.value = false;
    inhouseCustomForms.value.forEach(f => {
      accountData[tab].push({
        ncpdp: f.ncpdp,
        pharmacyName: f.npiChips[0]?.name || '—',
        status: deriveStatus(f.startDate, f.endDate),
        noBillNoPay: f.noBillNoPay,
        startDate: f.startDate,
        endDate: f.endDate || '—',
      });
    });
  } else if (tab === 'Specialty') {
    const specialtyValid = specialtyForms.value.every(f =>
      !!f.startDate && (f.pharmacyType !== 'Specific Pharmacies' || !!f.npis.trim())
    );
    if (!specialtyValid) {
      specialtyTouched.value = true;
      return;
    }
    specialtyForms.value.forEach(f => {
      if (f.pharmacyType === 'Specific Pharmacies') {
        const chips = generateNpiChips(f.npis);
        chips.forEach(chip => {
          accountData[tab].push({
            pharmacyType: f.pharmacyType,
            npis: chip.npi,
            pharmacyName: chip.name,
            noBillNoPay: f.noBillNoPay,
            status: deriveStatus(f.startDate, f.endDate),
            startDate: f.startDate,
            endDate: f.endDate || '—',
          });
        });
      } else {
        accountData[tab].push({
          pharmacyType: f.pharmacyType,
          npis: '',
          pharmacyName: 'Liviniti',
          noBillNoPay: f.noBillNoPay,
          status: deriveStatus(f.startDate, f.endDate),
          startDate: f.startDate,
          endDate: f.endDate || '—',
        });
      }
    });
  } else if (tab === 'Mail Order') {
    const mailOrderValid = mailOrderForms.value.every(f => f.vendors.length > 0 && !!f.startDate);
    if (!mailOrderValid) {
      mailOrderAddTouched.value = true;
      return;
    }
    mailOrderAddTouched.value = false;
    mailOrderForms.value.forEach(f => {
      f.vendors.forEach(vendor => {
        accountData[tab].push({
          vendor,
          status: deriveStatus(f.startDate, f.endDate),
          noBillNoPay: f.noBillNoPay,
          displayInPortals: f.displayInPortals,
          startDate: f.startDate,
          endDate: f.endDate || '—',
        });
      });
    });
  }
  showPharmacyDialog.value = false;
  showToast('Pharmacy Added Successfully', 'success');
};

// ─── Step 3: Plan Design ──────────────────────────────────────────────────────

const planDesignPlans = ref([
  {
    id: 70953,
    name: 'pablo test',
    status: 'Active',
    effStartDate: '03/06/2026',
    effEndDate: '',
    benefitReset: 'February 1',
    maxSpendEnabled: false,
    allowSecondaryPayer: false,
    cobConfiguration: '',
    benefitByFlag: false,
    bpgRows: [
      { bin: '025945', pcn: 'SSN', groupId: '1275', groupName: 'Allied Finishing, Inc', effStartDate: '03/01/2026', effEndDate: '' },
    ],
    planCodes: [
      { planCode: '1423T', status: 'Active', effStartDate: '03/05/2026', effEndDate: '' },
    ],
    benefitCodes: [] as { benefitCode: string; description: string; effStartDate: string; effEndDate: string }[],
    accumulators: [] as { accumulatorName: string; status: string; effStartDate: string; effEndDate: string }[],
  },
  {
    id: 70954,
    name: 'Silver Plan',
    status: 'Active',
    effStartDate: '03/06/2026',
    effEndDate: '',
    benefitReset: 'February 1',
    maxSpendEnabled: false,
    allowSecondaryPayer: false,
    cobConfiguration: '',
    benefitByFlag: false,
    bpgRows: [
      { bin: '025945', pcn: 'SSN', groupId: '1275', groupName: 'Allied Finishing, Inc', effStartDate: '03/01/2026', effEndDate: '' },
    ],
    planCodes: [
      { planCode: '1423T', status: 'Active', effStartDate: '03/05/2026', effEndDate: '' },
    ],
    benefitCodes: [] as { benefitCode: string; description: string; effStartDate: string; effEndDate: string }[],
    accumulators: [] as { accumulatorName: string; status: string; effStartDate: string; effEndDate: string }[],
  },
]);

const expandedPlans = ref<number[]>([]);

const bpgHeaders = [
  { title: 'BIN',            key: 'bin' },
  { title: 'PCN',            key: 'pcn' },
  { title: 'Group ID',       key: 'groupId' },
  { title: 'Group Name',     key: 'groupName' },
  { title: 'Eff. Start Date', key: 'effStartDate' },
  { title: 'Eff. End Date',  key: 'effEndDate' },
];

const planCodesHeaders = [
  { title: 'Plan Code',       key: 'planCode' },
  { title: 'Status',          key: 'status' },
  { title: 'Eff. Start Date', key: 'effStartDate' },
  { title: 'Eff. End Date',   key: 'effEndDate' },
];

const benefitCodesHeaders = [
  { title: 'Benefit Code',    key: 'benefitCode' },
  { title: 'Description',     key: 'description' },
  { title: 'Eff. Start Date', key: 'effStartDate' },
  { title: 'Eff. End Date',   key: 'effEndDate' },
];

const accumulatorsHeaders = [
  { title: 'Accumulator Name', key: 'accumulatorName' },
  { title: 'Status',           key: 'status' },
  { title: 'Eff. Start Date',  key: 'effStartDate' },
  { title: 'Eff. End Date',    key: 'effEndDate' },
];

// ─── Copay Structure ──────────────────────────────────────────────────────────

const copayTabs = ['First Choice Broad', 'Standard', 'Mail Order'];
const activeCopayTab = ref('First Choice Broad');

const copayStructureHeaders = [
  { title: '1 - 30 Day Supply',  key: 'tierName' },
  { title: 'Formula',            key: 'formula' },
  { title: 'Copay',              key: 'copay' },
  { title: 'Coinsurance',        key: 'coinsurance' },
  { title: 'Coins. Min',         key: 'coinsMin' },
  { title: 'Coins. Max',         key: 'coinsMax' },
  { title: 'Incentive Min',      key: 'incentiveMin' },
  { title: 'Incentive Max',      key: 'incentiveMax' },
  { title: 'Patient Pay Max',    key: 'patientPayMax' },
  { title: 'Ded. Waived',        key: 'dedWaived' },
  { title: 'OOP Waived',         key: 'oopWaived' },
];

const copayStructureRows = [
  { tierName: 'Generic',               formula: 'Copay', copay: '$1.00', coinsurance: '2%',  coinsMin: '$1.00', coinsMax: '$3.00', incentiveMin: '$2.00', incentiveMax: '$5.00', patientPayMax: '$6.00', dedWaived: 'No',  oopWaived: 'No' },
  { tierName: 'Brand-Preferred',       formula: '',      copay: '-',     coinsurance: '-',    coinsMin: '-',     coinsMax: '-',     incentiveMin: '-',     incentiveMax: '-',     patientPayMax: '-',     dedWaived: '',    oopWaived: '' },
  { tierName: 'Brand-NonPreferred',    formula: '',      copay: '-',     coinsurance: '-',    coinsMin: '-',     coinsMax: '-',     incentiveMin: '-',     incentiveMax: '-',     patientPayMax: '-',     dedWaived: '',    oopWaived: '' },
  { tierName: 'Specialty-Generic',     formula: '',      copay: '-',     coinsurance: '-',    coinsMin: '-',     coinsMax: '-',     incentiveMin: '-',     incentiveMax: '-',     patientPayMax: '-',     dedWaived: '',    oopWaived: '' },
  { tierName: 'Specialty-Preferred',   formula: '',      copay: '-',     coinsurance: '-',    coinsMin: '-',     coinsMax: '-',     incentiveMin: '-',     incentiveMax: '-',     patientPayMax: '-',     dedWaived: '',    oopWaived: '' },
  { tierName: 'Specialty-NonPreferred',formula: '',      copay: '-',     coinsurance: '-',    coinsMin: '-',     coinsMax: '-',     incentiveMin: '-',     incentiveMax: '-',     patientPayMax: '-',     dedWaived: '',    oopWaived: '' },
  { tierName: 'Compound',              formula: '',      copay: '-',     coinsurance: '-',    coinsMin: '-',     coinsMax: '-',     incentiveMin: '-',     incentiveMax: '-',     patientPayMax: '-',     dedWaived: '',    oopWaived: '' },
];

const togglePlan = (id: number) => {
  const idx = expandedPlans.value.indexOf(id);
  if (idx === -1) {
    expandedPlans.value.push(id);
  } else {
    expandedPlans.value.splice(idx, 1);
  }
};

// ─── Timeline helpers ─────────────────────────────────────────────────────────

const activeTimelineProgress = computed(() => {
  if (!activeTimelineItem.value) return 0;
  switch (activeTimelineItem.value.status) {
    case 'completed': return 100;
    case 'in-progress': return 50;
    default: return 0;
  }
});

const progressCircularColor = computed(() => {
  if (!activeTimelineItem.value) return 'grey';
  return activeTimelineItem.value.status === 'completed' ? 'success' : 'primary';
});

const markAsComplete = (item: any) => { item.status = 'completed'; item.endDate = new Date().toISOString().slice(0, 10); };
const markAsInProgress = (item: any) => { item.status = 'in-progress'; item.startDate = new Date().toISOString().slice(0, 10); item.endDate = ''; };
const markAsPending = (item: any) => { item.status = 'pending'; item.startDate = ''; item.endDate = ''; };

watch(selectedAccount, (newVal) => {
  wizardActive.value = false;
  currentWizardStep.value = 0;
  if (newVal) {
    implementationSteps.value.forEach((step, index) => { step.active = (index === 0); });
    activeTimelineItem.value = implementationSteps.value[0];
  } else {
    implementationSteps.value.forEach(step => { step.active = false; });
    activeTimelineItem.value = null;
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
@import '@/style.scss';

// ─── Layout ───────────────────────────────────────────────────────────────────

.plan-explorer-content {
  padding: $spacing-medium;

  :deep(.v-row) {
    overflow: visible;
  }
}

// ─── Timeline sticky wrapper ──────────────────────────────────────────────────

.plan-timeline-wrapper {
  // default: no special behavior
}

.plan-col--sticky {
  align-self: flex-start !important;
  padding: 0 !important;
}

.plan-col--right {
  padding: 0 !important;
  padding-left: 16px !important;
  @media (min-width: 960px) {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    max-width: none !important;
  }
}

.plan-timeline-wrapper--sticky {
  @media (min-width: 960px) {
    position: sticky;
    top: 68px; // 48px app bar + 20px breathing room
  }

  // Suppress vertical connector line when only one item is visible
  :deep(.v-timeline::before),
  :deep(.v-timeline-item::before) {
    display: none;
  }
}

// ─── Timeline (left column) ───────────────────────────────────────────────────

.plan-timeline {
  // The .plan-timeline class is on the v-timeline root element (which IS the CSS grid).
  // Cap the body column at 360px and collapse the empty opposite column to 0.
  grid-template-columns: minmax(min-content, 360px) min-content 0 !important;

  // Body: fill the capped column, reduce Vuetify's 24px gap to keep cards compact
  :deep(.v-timeline-item__body) {
    width: 100%;
    padding-inline-end: 8px !important;
  }

  // Pin the dot to the top for the Plan Setup item when sub-steps are expanded
  .v-timeline-item--has-sub-steps {
    :deep(.v-timeline-item__body) {
      align-self: flex-start;
    }
    :deep(.v-timeline-item__dot) {
      margin-top: 16px;
    }
  }

  // Zero out the empty opposite slot's padding so it takes no space
  :deep(.v-timeline-item__opposite) {
    padding-inline-start: 0 !important;
    min-width: 0 !important;
    overflow: hidden;
  }

  .v-timeline-item {
    :deep(.v-timeline-item__body) {
      width: 100%;
    }

    .timeline-card {
      width: 100%;
      border: 1px solid $color-border;
      box-shadow: none;
      cursor: pointer;
      transition: box-shadow 0.3s ease;

      &:hover { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }

      .v-card-title { color: $color-primary; }
      .v-card-text { letter-spacing: 0 !important; white-space: normal; }
    }

    .active-card { border-color: $color-primary; }
  }
}

// ─── Wizard sub-steps (nested below Plan Setup card) ─────────────────────────

.wizard-sub-steps {
  margin-top: $spacing-xsmall;
  padding-left: $spacing-xsmall;
}

.wizard-sub-step-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wizard-sub-step-item {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  padding: $spacing-xsmall $spacing-small;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover { background-color: rgba($color-primary, 0.06); }

  &--active {
    background-color: rgba($color-primary, 0.1);

    .wizard-sub-step-number {
      background-color: $color-primary;
      border-color: $color-primary;
      color: $color-neutral-white;
    }

    .wizard-sub-step-name {
      color: $color-primary;
      font-weight: $font-weight-semibold;
    }
  }

  &--complete {
    .wizard-sub-step-number {
      background-color: $color-success;
      border-color: $color-success;
      color: $color-neutral-white;
    }

    .wizard-sub-step-name {
      color: $color-success;
    }
  }
}

.wizard-sub-step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1.5px solid $color-border;
  font-family: $font-family-base;
  font-size: 0.7rem;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;
  transition: background-color 0.15s, color 0.15s;
}

.wizard-sub-step-name {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-primary;
  line-height: 1.3;
}

// ─── Standard timeline detail panel ──────────────────────────────────────────

.timeline-details-card {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
}

.status-chip-uppercase { text-transform: uppercase; }
.progress-chip-container { gap: $spacing-xsmall; }
.timeline-text-content-gap { gap: $spacing-medium; }

// ─── Wizard overview card ─────────────────────────────────────────────────────

.wizard-overview {
  border: 1px solid $color-border;
  border-radius: 8px;
  overflow: hidden;
}

.wizard-overview-header {
  background-color: $color-primary;
  padding: $spacing-large $spacing-medium;
  text-align: center;

  .wizard-overview-title {
    font-family: $font-family-base;
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-neutral-white;
    margin-bottom: $spacing-xsmall;
  }

  .wizard-overview-subtitle {
    font-family: $font-family-base;
    font-size: $font-size-body;
    color: rgba($color-neutral-white, 0.85);
    line-height: 1.5;
    strong { color: $color-neutral-white; }
  }
}

.wizard-overview-body {
  padding: $spacing-medium;
  background-color: $color-neutral-white;
}

.wizard-overview-section-label {
  font-family: $font-family-base;
  font-size: $font-size-small;
  font-weight: $font-weight-bold;
  color: $color-text-secondary;
  letter-spacing: 0.06em;
  margin-bottom: $spacing-medium;
}

.wizard-steps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid $color-border;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: $spacing-medium;
}

.wizard-grid-item {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  padding: $spacing-small $spacing-medium;
  border-bottom: 1px solid $color-border;

  &:nth-child(odd) { border-right: 1px solid $color-border; }
  &:last-child {
    grid-column: 1 / -1;
    border-bottom: none;
    border-right: none;
  }
}

.wizard-grid-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid $color-border;
  font-family: $font-family-base;
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;
  flex-shrink: 0;
}

.wizard-grid-name {
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
  flex: 1;
}

.wizard-required-badge {
  font-family: $font-family-base;
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;
  color: $color-link;
  background-color: rgba($color-link, 0.08);
  border-radius: 100px;
  padding: 2px 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.wizard-info-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
  background-color: rgba($color-border, 0.3);
  border-radius: 8px;
  padding: $spacing-medium;
}

.wizard-info-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-small;
}

.wizard-info-icon {
  color: $color-text-secondary;
  flex-shrink: 0;
  margin-top: 1px;
}

.wizard-overview-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: $spacing-medium;
  border-top: 1px solid $color-border;
  background-color: $color-neutral-white;

  .button { display: inline-flex; align-items: center; gap: 6px; }
}

// ─── Wizard step content (right column) ──────────────────────────────────────

.wizard-step-header {
  margin-bottom: $spacing-large;
  padding-bottom: $spacing-medium;
  border-bottom: 1px solid $color-border;
}

.wizard-step-body {
  padding-top: 0;
}

.wizard-step-header-meta {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  margin-bottom: $spacing-xsmall;
}

.wizard-step-counter {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
}

.wizard-step-title {
  color: $color-primary !important;
  margin-bottom: $spacing-xsmall;
}

.wizard-step-description {
  color: $color-text-secondary;
  margin-bottom: $spacing-medium;
}

.wizard-placeholder {
  border: 1px dashed $color-border;
  border-radius: 8px;
  padding: $spacing-xlarge $spacing-medium;
  text-align: center;
  background-color: rgba($color-border, 0.15);
}

.wizard-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: $spacing-medium;
  margin-top: $spacing-medium;
  border-top: 1px solid $color-border;
}

.wizard-footer-actions {
  display: flex;
  gap: $spacing-small;
}

// ─── Step 1: Account Profile sections ────────────────────────────────────────

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
    justify-content: space-between;
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
    gap: $spacing-xlarge;
  }

  &--thirds .ap-field { flex: 1; }
}

.ap-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ap-field-label {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
}

.ap-field-value {
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
}

.ap-checkbox-row {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
}

.ap-checkbox-icon {
  color: $color-border;
  &--checked { color: $color-primary; }
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

.ap-subsection-heading {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  margin: $spacing-medium 0 $spacing-small;
}

.ap-edit-checkboxes {
  display: flex;
  flex-direction: column;
  gap: $spacing-xsmall;
  margin-top: $spacing-small;
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

.ap-contacts-card {
  margin-top: $spacing-large;
  border: 1px solid $color-border;

  .v-card-title {
    padding-bottom: $spacing-small;
  }
}

.ap-contacts-table {
  font-size: $font-size-small;
}

.ap-section-footer {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  margin-top: $spacing-medium;
}

// ─── Shared buttons ───────────────────────────────────────────────────────────

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-small $spacing-medium;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: $font-family-base;
  font-size: $font-size-body;
  line-height: 120%;
  font-weight: $font-weight-normal;
  transition: background-color 0.2s, opacity 0.2s;
  white-space: nowrap;
  border-radius: 100px;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.button-primary {
  background-color: $color-primary;
  color: $color-neutral-white;
}

.button-secondary {
  background-color: transparent;
  border-color: $color-primary;
  color: $color-primary;
}

.button-thirtiary {
  background-color: transparent;
  border: 1px solid $color-primary;
  color: $color-primary;
  border-radius: 4px;
  padding: $spacing-nano $spacing-xsmall;
  font-size: $font-size-small;
  gap: $spacing-nano;
}

// ─── Step 2: Network Configuration ───────────────────────────────────────────

.nc-section {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  margin-bottom: $spacing-medium;
}

.nc-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-medium;
}

.nc-table-controls {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  margin-bottom: $spacing-medium;
  flex-wrap: wrap;
}

.nc-search {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  border: 1px solid $color-border;
  border-radius: 6px;
  padding: $spacing-xsmall $spacing-small;
  min-width: 240px;
}

.nc-search-icon {
  color: $color-text-secondary;
  flex-shrink: 0;
}

.nc-search-input {
  border: none;
  outline: none;
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
  width: 100%;
  background: transparent;

  &::placeholder {
    color: $color-neutral-disabled;
  }
}

.nc-pills {
  display: flex;
  gap: $spacing-xsmall;
}

.nc-pill {
  font-family: $font-family-base;
  font-size: $font-size-small;
  padding: $spacing-nano $spacing-small;
  border-radius: 100px;
  border: 1.5px solid $color-border;
  color: $color-text-primary;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;

  &--active {
    background-color: $color-primary;
    border-color: $color-primary;
    color: $color-neutral-white;
  }

  &:not(.nc-pill--active):hover {
    border-color: $color-primary;
    color: $color-primary;
  }
}

.nc-table-wrapper {
  border: 1px solid $color-border;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: $spacing-small;
}

.nc-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-family-base;
  font-size: $font-size-small;

  thead tr {
    background-color: rgba($color-border, 0.3);
  }

  th {
    text-align: left;
    padding: $spacing-small $spacing-medium;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    border-bottom: 1px solid $color-border;
    white-space: nowrap;
  }

  td {
    padding: $spacing-small $spacing-medium;
    color: $color-text-primary;
    border-bottom: 1px solid rgba($color-border, 0.5);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.nc-table-actions {
  color: $color-text-secondary;
  cursor: pointer;
  text-align: right;
}

.nc-status-badge {
  display: inline-block;
  padding: 2px $spacing-small;
  border-radius: 4px;
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;

  &--active {
    background-color: $color-success-background;
    color: $color-success;
  }
}

.nc-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: $spacing-small;
}

.nc-per-page-select {
  font-family: $font-family-base;
  font-size: $font-size-small;
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: 2px $spacing-xsmall;
  margin: 0 $spacing-nano;
}

// Pharmacy tabs
.nc-tabs {
  display: flex;
  border-bottom: 1px solid $color-border;
  margin-bottom: $spacing-medium;
  gap: 0;
}

.nc-tab {
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-secondary;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: $spacing-xsmall $spacing-medium;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;

  &--active {
    color: $color-primary;
    border-bottom-color: $color-primary;
    font-weight: $font-weight-semibold;
  }

  &:not(.nc-tab--active):hover {
    color: $color-text-primary;
  }
}

// ─── Step 3: Plan Design ──────────────────────────────────────────────────────

.pd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-medium;
}


.pd-accordion-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
}

.pd-accordion {
  border: 1px solid $color-border;
  border-radius: 8px;
  overflow: hidden;
}

.pd-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-small $spacing-medium;
  cursor: pointer;
  background-color: $color-neutral-white;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba($color-border, 0.3);
  }
}

.pd-accordion-header-left {
  display: flex;
  align-items: center;
  gap: $spacing-small;
}

.pd-plan-name {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.pd-plan-id {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
}

.pd-status-badge {
  display: inline-block;
  align-self: flex-start;
  width: fit-content;
  padding: 2px $spacing-small;
  border-radius: 4px;
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;

  &--active {
    background-color: $color-success-background;
    color: $color-success;
  }

  &--inactive {
    background-color: rgba(133, 133, 133, 0.12);
    color: $color-neutral-disabled;
  }

  &--pending {
    background-color: $color-warning-background;
    color: $color-warning;
  }
}

.pd-accordion-chevron {
  color: $color-text-secondary;
  transition: transform 0.2s ease;

  &--open {
    transform: rotate(180deg);
  }
}

.pd-accordion-body {
  padding: $spacing-medium;
  border-top: 1px solid $color-border;
  background-color: $color-neutral-white;
}

.pd-section {
  padding: $spacing-large 0;
}

.pd-empty-cta {
  margin-top: $spacing-small;
}

.pd-section-header {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  margin-bottom: $spacing-medium;
}

.pd-section-divider {
  border: none;
  border-top: 1px solid $color-border;
  margin: 0;
}

.ap-field-row--five .ap-field {
  flex: 1;
}

.ap-field-sub {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin-top: 2px;
}

.pd-param-add-card {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  padding: $spacing-medium;
  border: 1px solid $color-border;
  border-radius: 8px;
  cursor: pointer;
  max-width: 400px;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: $color-primary;
    background-color: rgba($color-primary, 0.03);
  }
}

.pd-param-add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid $color-border;
  color: $color-primary;
  flex-shrink: 0;
}

.pd-param-add-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pd-param-add-title {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.pd-param-add-subtitle {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  line-height: 1.4;
}

.pd-toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-medium;
}

.pd-toggle-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.pd-toggle-description {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: 0;
  line-height: 1.5;
}

.pd-show-more {
  background: none;
  border: none;
  padding: 0;
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-link;
  cursor: pointer;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
}

.pd-toggle-switch {
  flex-shrink: 0;
  margin-top: -4px;
}


// Empty states
.nc-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-large $spacing-medium;
  gap: $spacing-xsmall;
  text-align: center;

  &--tab {
    padding: $spacing-xlarge $spacing-medium;
  }
}

.nc-empty-icon {
  width: 160px;
  margin-bottom: $spacing-small;
}

.nc-empty-title {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0;
}

.nc-empty-subtitle {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: 0 0 $spacing-small;
}

// ─── Copay Structure card ─────────────────────────────────────────────────────

.cs-card {
  background-color: $color-neutral-white;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  margin-top: $spacing-medium;
}

.cs-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-medium;
}

.cs-card-actions {
  display: flex;
  gap: $spacing-xsmall;
}

.cs-network-header {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  margin-bottom: $spacing-small;

  .cs-network-title {
    font-size: $font-size-body;
    font-weight: $font-weight-semibold;
    color: $color-primary;
  }
}

// ─── Step 4: Transition of Care ───────────────────────────────────────────────

.toc-intro {
  color: $color-text-secondary;
  margin-bottom: $spacing-large;
}

.toc-question {
  margin-bottom: $spacing-medium;

  .toc-question-label {
    font-size: $font-size-body;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-small;
  }
}

.toc-toggle-group {
  display: flex;
  gap: $spacing-xsmall;
}

.toc-toggle {
  border: 1px solid $color-border;
  border-radius: 6px;
  padding: 6px $spacing-medium;
  background: $color-neutral-white;
  color: $color-text-primary;
  font-size: $font-size-body;
  cursor: pointer;
  min-width: 72px;

  &--selected {
    border-color: $color-primary;
    color: $color-primary;
    font-weight: $font-weight-semibold;
  }
}

.toc-info-box {
  background-color: #f5f5f5;
  border-left: 3px solid $color-border;
  border-radius: 4px;
  padding: $spacing-medium;
  margin-bottom: $spacing-large;

  .toc-info-text {
    font-size: $font-size-small;
    color: $color-text-secondary;
    font-style: italic;
    margin-bottom: $spacing-medium;
  }
}

// ─── Step 5: Programs ─────────────────────────────────────────────────────────

.prog-title {
  margin-bottom: $spacing-medium;
}

.prog-filters {
  display: flex;
  gap: $spacing-xsmall;
  margin-bottom: $spacing-medium;
}

.prog-detail-td {
  padding: 0 !important;
}

.prog-detail {
  background-color: #f5f5f5;
  padding: $spacing-medium $spacing-large;
}

.prog-detail-title {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-bottom: $spacing-medium;
}

.prog-detail-cols {
  display: flex;
  gap: $spacing-xlarge;
  margin-bottom: $spacing-medium;
}

.prog-detail-label {
  font-size: $font-size-small;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: 2px;
}

.prog-detail-value {
  font-size: $font-size-small;
  color: $color-text-secondary;
}

.prog-detail-merp {
  margin-top: $spacing-medium;
}

// ─── Step 6: Limits & Controls ────────────────────────────────────────────────

.lc-intro {
  color: $color-text-secondary;
  font-style: italic;
  margin-bottom: $spacing-medium;
}

.lc-toggle-group {
  margin-bottom: $spacing-large;
}

.lc-fields {
  border-top: 1px solid $color-border;
}

.lc-field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-small 0;
  border-bottom: 1px solid $color-border;
}

.lc-field-label {
  font-size: $font-size-body;
  color: $color-text-primary;
}

.lc-field-value {
  font-size: $font-size-body;
  color: $color-text-primary;
  min-width: 80px;
  text-align: right;
}

.lc-field-input {
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: 6px $spacing-small;
  font-size: $font-size-body;
  font-family: $font-family-base;
  color: $color-text-primary;
  min-width: 120px;
  text-align: left;

  &:focus {
    outline: none;
    border-color: $color-primary;
  }
}

.lc-section-divider {
  border: none;
  border-top: 1px solid $color-border;
  margin: $spacing-large 0;
}

.lc-hcn-intro {
  color: $color-text-secondary;
  font-style: italic;
  margin-bottom: $spacing-large;
}

.lc-hcn-field {
  margin-bottom: $spacing-large;
}

.lc-hcn-label {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-small;
}

.lc-hcn-input {
  min-width: 200px;
}

.lc-recipient-row {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  margin-bottom: $spacing-small;
}

.lc-recipient-input {
  flex: 1;
  min-width: unset;
}

.lc-recipient-remove {
  cursor: pointer;
  color: $color-text-secondary;
  flex-shrink: 0;

  &:hover {
    color: $color-error;
  }
}

.lc-check-icon {
  color: $color-text-primary;
  flex-shrink: 0;
}

.lc-daw-block {
  margin-bottom: $spacing-large;
}

.lc-daw-title {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-bottom: $spacing-small;
}

.lc-daw-desc {
  color: $color-text-secondary;
  margin-bottom: $spacing-small;
}

.lc-daw-notes {
  width: 100%;
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: $spacing-small;
  font-size: $font-size-body;
  font-family: $font-family-base;
  color: $color-text-primary;
  min-height: 80px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: $color-primary;
  }

  &::placeholder {
    color: $color-neutral-disabled;
  }
}

.lc-add-btn {
  width: 100%;
  border: 1px solid $color-border;
  border-radius: 20px;
  padding: $spacing-small;
  background: $color-neutral-white;
  color: $color-text-primary;
  font-size: $font-size-body;
  font-family: $font-family-base;
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.05em;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }
}

// ─── Step 7: Billing ─────────────────────────────────────────────────────────

.bl-section {
  margin-bottom: $spacing-large;

  &--no-gap {
    margin-bottom: 0;
  }
}

.bl-subsection {
  margin-top: $spacing-medium;
  margin-left: $spacing-large;
}

.bl-note {
  color: $color-text-secondary;
  margin: $spacing-small 0;
}

.bl-required {
  color: $color-error;
  margin-left: 2px;
}

.bl-upload-label {
  font-size: $font-size-body;
  color: $color-text-primary;

  .bl-upload-link {
    color: $color-link;
    font-weight: $font-weight-semibold;
    text-decoration: underline;
    cursor: pointer;
  }
}

.bl-upload-item {
  margin-top: $spacing-medium;
}

.bl-file-chip {
  padding: 0 8px;

  :deep(.v-chip__content) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .bl-file-chip-icon {
    color: $color-neutral-white;
    flex-shrink: 0;
  }

  .bl-file-chip-label {
    color: $color-neutral-white;
    font-size: $font-size-small;
  }

  .bl-file-chip-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: $color-neutral-white;
    color: $color-primary;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }
}

.bl-address {
  margin-top: $spacing-xsmall;
  padding-left: $spacing-large;

  p {
    font-size: $font-size-body;
    color: $color-text-primary;
    margin: 0;
    line-height: 1.6;
  }
}

.bl-contact-group {
  margin-top: $spacing-medium;
}

.bl-download-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-small;
  margin-top: $spacing-small;
}

.bl-download-btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xsmall;
  padding: $spacing-xsmall $spacing-medium;
  border: 1px solid $color-primary;
  border-radius: 6px;
  color: $color-primary;
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;
  background: transparent;
  cursor: pointer;

  &:hover {
    background-color: rgba($color-primary, 0.06);
  }
}

.bl-custom-warning {
  display: flex;
  align-items: flex-start;
  gap: $spacing-small;
  margin-top: $spacing-medium;
  padding: $spacing-small $spacing-medium;
  background-color: rgba($color-warning, 0.12);
  border-left: 3px solid $color-warning;
  border-radius: 6px;
}

.bl-warning-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: $color-warning;
}

.bl-warning-text {
  color: $color-text-primary;
  margin: 0;
}

.bl-section-heading {
  margin-bottom: $spacing-large;
}

.bl-field-narrow {
  max-width: 340px;
}

.bl-subsection-select {
  margin-top: $spacing-small;
  max-width: 340px;
}

.bl-notes-textarea {
  :deep(.v-field__input) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
  }

  :deep(.v-label) {
    font-family: $font-family-base !important;
    letter-spacing: 0 !important;
    color: $color-neutral-disabled !important;
  }
}

// ─── Step 8: ID Cards ─────────────────────────────────────────────────────────

.id-two-col-row {
  display: flex;
  gap: $spacing-medium;
  align-items: flex-start;

  > * {
    flex: 1;
  }

  &--checkbox-pair {
    align-items: center;
  }
}


.id-autogen-heading {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-bottom: $spacing-medium;
}

.id-autogen-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-small $spacing-large;
}

.id-autogen-sublabel {
  font-size: $font-size-small;
  color: $color-text-secondary;
  display: block;
}

.id-carrier-kit {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  background-color: $color-information-background;

  &__logo-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-small $spacing-medium;
    background: $color-neutral-white;
    border: 1px solid $color-border;
    border-radius: 6px;
    margin: $spacing-small 0 $spacing-medium;
  }

  &__logo {
    height: 32px;
    width: auto;
  }

  &__info {
    width: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-medium;
  }

  &__download {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-nano;
    flex-shrink: 0;
  }

  &__hint {
    font-size: $font-size-small;
    color: $color-neutral-disabled;
  }

  &__optional {
    font-weight: $font-weight-normal;
    color: $color-neutral-disabled;
    font-size: $font-size-small;
    margin-left: $spacing-xsmall;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: $spacing-small;
    font-size: $font-size-small;

    tr {
      border-bottom: 1px solid $color-border;

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: $spacing-xsmall $spacing-small;
      vertical-align: top;
      line-height: 1.6;
    }
  }

  &__table-label {
    color: $color-text-primary;
    width: 50%;
    padding-left: 0 !important;
  }

  &__table-value {
    color: $color-text-primary;
    text-align: right;

    &--note {
      color: $color-text-secondary;
      font-style: italic;
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xsmall;
  }

  &__disclaimer {
    display: flex;
    align-items: center;
    gap: $spacing-xsmall;
    padding: $spacing-nano $spacing-xsmall;
    border: 1px solid $color-warning;
    border-radius: 4px;
    background-color: $color-warning-background;
    font-size: $font-size-body;
    color: $color-text-primary;
    line-height: 1.5;
  }

  &__disclaimer-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: $color-warning;
    flex-shrink: 0;

    svg {
      color: $color-neutral-white;
    }
  }
}

.id-internal-fields {
  :deep(.v-selection-control__input input) {
    opacity: 1 !important;
    width: 16px !important;
  }

  :deep(.v-selection-control__wrapper) {
    color: $color-primary !important;
    opacity: 1 !important;
  }

  :deep(.v-checkbox .v-icon) {
    opacity: 1 !important;
  }

  :deep(.v-checkbox .v-selection-control__off-icon) {
    color: $color-border !important;
    opacity: 1 !important;
  }

  :deep(.v-checkbox .v-selection-control__on-icon) {
    color: $color-primary !important;
    opacity: 1 !important;
  }
}

// ─── Step 9: Verification & Summary ───────────────────────────────────────────

.vs-completion {
  font-size: $font-size-h3;
  font-weight: $font-weight-bold;
  color: $color-warning;
  margin-bottom: $spacing-medium;

  &--done {
    color: $color-success;
  }
}

.vs-step-list {
  display: flex;
  flex-direction: column;
}

.vs-step-row {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  padding: $spacing-small $spacing-xsmall;
  border-bottom: 1px solid $color-border;
  border-left: 3px solid transparent;

  &:last-child {
    border-bottom: none;
  }

  &--in-progress {
    border-left-color: $color-warning;
  }

  &--complete {
    border-left-color: $color-success;
  }

  &--not-started {
    border-left-color: $color-border;
  }
}

.vs-step-number {
  font-size: $font-size-body;
  color: $color-text-secondary;
  width: 20px;
  flex-shrink: 0;
}

.vs-step-name {
  flex: 1;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.vs-step-actions {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  flex-shrink: 0;
}

.vs-step-badge {
  font-size: $font-size-small;
  padding: 2px $spacing-xsmall;
  border-radius: 100px;

  &--in-progress {
    background-color: rgba($color-warning, 0.15);
    color: darken($color-warning, 20%);
  }

  &--complete {
    background-color: rgba($color-success, 0.15);
    color: darken($color-success, 10%);
  }

  &--not-started {
    background-color: rgba($color-neutral-disabled, 0.12);
    color: $color-neutral-disabled;
  }
}

.vs-edit-btn {
  border: 1px solid $color-primary;
  border-radius: 100px;
  background: transparent;
  color: $color-primary;
  padding: $spacing-nano $spacing-medium;
  font-size: $font-size-body;
  cursor: pointer;

  &:hover {
    background-color: rgba($color-primary, 0.05);
  }
}

// ─── Wayne Enterprises: Group Account Profile (GAP) view ──────────────────────

.gap-view {
  padding: $spacing-small 0;
}

.gap-meta {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin-bottom: $spacing-medium;
}

.gap-meta-icon {
  color: $color-text-secondary;
  flex-shrink: 0;
}

.gap-meta-dot {
  color: $color-neutral-disabled;
}

.gap-search {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  border: 1px solid $color-border;
  border-radius: 6px;
  padding: $spacing-small $spacing-medium;
  margin-bottom: $spacing-medium;
  background: $color-neutral-white;
}

.gap-search-icon {
  color: $color-neutral-disabled;
  flex-shrink: 0;
}

.gap-search-input {
  flex: 1;
  border: none;
  outline: none;
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
  background: transparent;

  &::placeholder {
    color: $color-neutral-disabled;
  }
}

.gap-accordion-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
}

.gap-accordion-item {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  padding: $spacing-medium;
  border: 1px solid $color-border;
  border-radius: 8px;
  background: $color-neutral-white;
  cursor: pointer;

  &:hover {
    background-color: rgba($color-primary, 0.03);
  }
}

.gap-accordion-icon {
  color: $color-primary;
  flex-shrink: 0;
}

.gap-accordion-label {
  flex: 1;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.gap-accordion-chevron {
  color: $color-text-secondary;
  flex-shrink: 0;
}

// ─── Network Link + Pharmacy Dialogs ─────────────────────────────────────────

.nl-dialog-card {
  border: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.nl-dialog-header {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  padding: $spacing-medium !important;
  letter-spacing: normal !important;
  white-space: normal !important;
}

.nl-dialog-icon {
  color: $color-primary;
  flex-shrink: 0;
}

.nl-dialog-body {
  padding: $spacing-medium !important;
  letter-spacing: normal !important;
  min-height: 280px;
  overflow-y: auto;
  flex: 1 1 auto;
}

.nl-dialog-intro {
  color: $color-text-secondary;
  margin-bottom: $spacing-medium;
}

.nl-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-small;
  padding: $spacing-medium !important;
}

.nl-dialog-field-label {
  font-family: $font-family-base;
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: $spacing-xsmall;
}

.nl-toggle-group {
  display: flex;
  gap: $spacing-xsmall;
  flex-wrap: wrap;
  margin-bottom: $spacing-medium;
}

.nl-level-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xsmall;
  min-width: 120px;

  &.toc-toggle--selected {
    background-color: $color-information-background;
  }

  &.nl-level-btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.nl-level-check {
  color: $color-primary;
  flex-shrink: 0;
}

.nl-network-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xsmall;
  margin-bottom: $spacing-small;
}

.nl-network-btn {
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xsmall;

  &.toc-toggle--selected {
    background-color: $color-information-background;
  }
}

.nl-alert {
  display: flex;
  align-items: flex-start;
  gap: $spacing-xsmall;
  background-color: rgba($color-warning, 0.08);
  border: 1px solid rgba($color-warning, 0.3);
  border-radius: 6px;
  padding: $spacing-small $spacing-medium;
  margin-bottom: $spacing-medium;
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-primary;
  line-height: 1.5;
}

.nl-alert-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba($color-warning, 0.25);
  color: darken($color-warning, 10%);
  flex-shrink: 0;
  align-self: flex-start;
}

.nl-date-row {
  display: flex;
  gap: $spacing-medium;

  > * { flex: 1; }

  &--mt { margin-top: $spacing-medium; }
}

.nl-textarea {
  margin-bottom: $spacing-medium;
}

.nl-checkbox {
  display: flex;
  align-items: center;
  gap: $spacing-xsmall;
  cursor: pointer;
  margin-top: $spacing-small;
  margin-bottom: $spacing-small;

  &-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &-icon {
    color: $color-primary;
    flex-shrink: 0;
  }

  &-label {
    font-family: $font-family-base;
    font-size: $font-size-body;
    color: $color-text-primary;
    user-select: none;
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

.nl-specialty-row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xsmall;
}

.nl-remove-btn {
  background: none;
  border: none;
  padding: $spacing-xsmall;
  cursor: pointer;
  color: $color-text-secondary;
  display: flex;
  align-items: center;
  border-radius: 4px;

  &:hover { color: $color-error; background-color: rgba($color-error, 0.08); }
}

.nl-level-btn-group {
  display: flex;
  gap: $spacing-xsmall;

  &--wrap { flex-wrap: wrap; }
}

.nl-checkbox--mt {
  margin-top: $spacing-medium;
}

.nl-dialog-intro {
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
  margin-bottom: $spacing-medium;
  line-height: 1.5;
}

.nl-edit-field-row {
  display: flex;
  flex-direction: column;
  margin-bottom: $spacing-small;
}

.nl-edit-field-label {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin-bottom: 2px;
}

.nl-edit-field-value {
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
  font-weight: $font-weight-semibold;
}

.nl-checkbox--mt {
  margin-top: $spacing-medium;
}

.nl-npi-section {
  margin-top: $spacing-medium;
}

.nl-npi-textarea {
  width: 100%;
  border: none;
  border-bottom: 1px solid $color-border;
  resize: vertical;
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
  padding: $spacing-xsmall 0;
  outline: none;
  background: transparent;

  &:focus { border-bottom-color: $color-primary; }

  &--error { border-bottom-color: $color-error; }
}

.nl-field-error {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-error;
  margin-top: $spacing-xsmall;
}

.nl-npi-hint {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin-top: $spacing-xsmall;
}

.nl-npi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xsmall;
  margin-top: $spacing-small;
}

.nl-npi-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  background-color: #E8EDF5;
  border-radius: 12px;
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-primary;
}

.nl-date-hint {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin-top: $spacing-xsmall;
  margin-bottom: 0;
}

.nl-bpg-section {
  margin-top: $spacing-medium;
  margin-bottom: $spacing-small;
}

.nl-bpg-label {
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: $color-text-primary;
  margin-bottom: $spacing-small;
}

.nl-bpg-table-wrap {
  border: 1px solid $color-border;
  border-radius: 8px;
  overflow: hidden;
  max-height: 240px;
  overflow-y: auto;
}

.nl-bpg-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-family-base;
  font-size: $font-size-small;

  thead tr {
    background-color: #F5F5F5;
    border-bottom: 1px solid $color-border;
  }

  th, td {
    padding: 10px 14px;
    text-align: left;
  }

  th {
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
    font-size: $font-size-small;
  }

  tbody tr {
    border-bottom: 1px solid $color-border;
    cursor: pointer;

    &:last-child { border-bottom: none; }
    &:hover { background-color: #F5F5F5; }
  }
}

.nl-bpg-empty {
  padding: 20px 14px;
  text-align: center;
  color: $color-text-secondary;
  font-family: $font-family-base;
  font-size: $font-size-small;
}

.nl-bpg-error {
  font-family: $font-family-base;
  font-size: $font-size-small;
  color: $color-error;
  margin-top: $spacing-xsmall;
}

.nl-edit-field-row--network {
  margin-bottom: $spacing-medium;
  padding-bottom: $spacing-small;
  border-bottom: 1px solid $color-border;
}

.nl-bpg-th-check {
  width: 40px;
  text-align: center !important;
}

.nl-bpg-check-icon {
  color: $color-text-secondary;
  display: block;
  margin: 0 auto;

  &--checked { color: $color-primary; }
}

.nc-tab-title {
  font-family: $font-family-base;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

// ─── Mail Order vendor picker ──────────────────────────────────────────────────

.nl-vendor-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.nl-autocomplete-chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.nl-chip-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: $color-neutral-white;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.9;

  &:hover { opacity: 1; }
}

.nl-vendor-picker-wrap {
  position: relative;
  margin-bottom: $spacing-small;
}

.nl-account-search-field {
  border: 1px solid var(--color-input-border);
  border-radius: 4px;
  background-color: var(--color-input-bg);
  padding: 6px $spacing-small;
  transition: border-color 0.15s;

  &--active,
  &:focus-within { border-color: $color-primary; }
}

.nl-account-search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: $font-family-base;
  font-size: $font-size-body;
  color: var(--color-text-primary);

  &::placeholder { color: $color-neutral-disabled; }
}

.nl-account-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.nl-account-option {
  display: flex;
  align-items: center;
  padding: $spacing-xsmall $spacing-small;
  cursor: pointer;

  &:hover { background-color: rgba(0, 0, 0, 0.04); }
}

.nl-acct-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid $color-border;
  border-radius: 3px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background-color: $color-primary;
    border-color: $color-primary;
    color: $color-neutral-white;
  }
}

.nl-no-vendor-results {
  padding: $spacing-small;
  color: $color-text-secondary;
  font-size: $font-size-small;
  text-align: center;
}

.nl-field-error {
  color: $color-error;
  font-size: $font-size-small;
  margin: 2px 0 4px;
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
</style>

<!-- Non-scoped dark mode overrides — bypasses Vue scoping to apply correctly -->
<style lang="scss">
html.dark {
  // ── Timeline cards ──────────────────────────────────────────────────────────
  .timeline-card {
    background-color: var(--color-card-bg) !important;
    border-color: var(--color-border) !important;
    color: var(--color-text-primary) !important;

    .v-card-title { color: #7BA7E0 !important; }
    .v-card-text  { color: var(--color-text-secondary) !important; }
  }

  .active-card { border-color: #7BA7E0 !important; }

  // ── Timeline detail panel ───────────────────────────────────────────────────
  .timeline-details-card {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    color: var(--color-text-primary);
  }

  // ── Wizard sub-steps ────────────────────────────────────────────────────────
  .wizard-sub-step-name { color: var(--color-text-primary); }
  .wizard-sub-step-number {
    border-color: var(--color-border);
    color: var(--color-text-secondary);
  }

  // Active step: #0F285B (navy) on dark bg is ~2.6:1 — swap to light blue (6.9:1) ✓
  .wizard-sub-step-item--active {
    background-color: rgba(123, 167, 224, 0.12);

    .wizard-sub-step-number {
      background-color: #7BA7E0;
      border-color: #7BA7E0;
      color: #0F1117; // dark text on light blue — contrast ~8:1 ✓
    }

    .wizard-sub-step-name {
      color: #7BA7E0 !important; // 6.9:1 on dark bg ✓
    }
  }

  // ── Wizard overview (intro card) ─────────────────────────────────────────────
  .wizard-overview {
    border-color: var(--color-border);
  }

  .wizard-overview-body {
    background-color: var(--color-card-bg);
  }

  .wizard-overview-footer {
    background-color: var(--color-card-bg);
    border-top-color: var(--color-border);
  }

  .wizard-overview-section-label { color: var(--color-text-secondary); }

  .wizard-steps-grid {
    border-color: var(--color-border);
  }

  .wizard-grid-item {
    border-color: var(--color-border) !important;
  }

  .wizard-grid-number {
    border-color: var(--color-border);
    color: var(--color-text-secondary);
  }

  .wizard-grid-name { color: var(--color-text-primary); }

  .wizard-info-list {
    background-color: rgba(255, 255, 255, 0.04);
  }

  .wizard-info-icon { color: var(--color-text-secondary); }

  // ── Wizard step content ──────────────────────────────────────────────────────
  .wizard-step-counter { color: var(--color-text-secondary); }
  .wizard-step-title   { color: var(--color-text-primary) !important; }
  .wizard-step-description { color: var(--color-text-secondary); }

  // ── Account profile fields ───────────────────────────────────────────────────
  .ap-section {
    border-color: var(--color-border);
    background-color: var(--color-card-bg);
  }

  .ap-section-header { border-color: var(--color-border); }

  .ap-field-label { color: var(--color-text-secondary) !important; }
  .ap-field-value { color: var(--color-text-primary) !important; }

  .ap-fields-divider { border-color: var(--color-border); }

  // ── Inputs and form elements ─────────────────────────────────────────────────
  .ap-input, .ap-select, .ap-textarea {
    background-color: var(--color-input-bg) !important;
    border-color: var(--color-input-border) !important;
    color: var(--color-text-primary) !important;

    &::placeholder { color: var(--color-text-secondary); }
    &:focus { border-color: #7BA7E0 !important; }
  }

  // ── Checkboxes / radio-style elements ───────────────────────────────────────
  .ap-checkbox-label, .ap-radio-label { color: var(--color-text-primary); }

  // ── Step section headers ─────────────────────────────────────────────────────
  .step-section-title,
  .ap-subsection-title,
  .step-heading { color: var(--color-text-primary) !important; }

  .step-section-divider { border-color: var(--color-border); }

  // ── Review / summary panels ──────────────────────────────────────────────────
  .review-panel, .summary-panel, .completion-panel {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);
    color: var(--color-text-primary);
  }

  // ── Navigation buttons ───────────────────────────────────────────────────────
  .button-thirtiary {
    color: var(--color-text-secondary) !important;
    border-color: var(--color-border) !important;
    background-color: transparent !important;

    &:hover { background-color: rgba(255, 255, 255, 0.05) !important; }
  }

  // ── GAP view (Wayne Enterprises active view) ─────────────────────────────────
  .gap-view { color: var(--color-text-primary); }
  .gap-meta  { color: var(--color-text-secondary); }

  .gap-search-input {
    background-color: var(--color-input-bg);
    border-color: var(--color-input-border);
    color: var(--color-text-primary);
  }

  .gap-accordion-item {
    border-color: var(--color-border);
    background-color: var(--color-card-bg);
    color: var(--color-text-primary);
  }

  .gap-accordion-label { color: var(--color-text-primary); }
  .gap-accordion-chevron { color: var(--color-text-secondary); }

  // ── General text inside plan explorer ────────────────────────────────────────
  .plan-explorer-content h1,
  .plan-explorer-content h2,
  .plan-explorer-content h3,
  .plan-explorer-content h4,
  .plan-explorer-content p,
  .plan-explorer-content span,
  .plan-explorer-content label {
    color: var(--color-text-primary);
  }

  // Vuetify timeline dot connector lines
  .v-timeline .v-timeline-divider__after,
  .v-timeline .v-timeline-divider__before {
    background-color: var(--color-border) !important;
  }
}
</style>
