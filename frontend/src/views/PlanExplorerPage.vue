
<template>
  <div>
    <AccountSelector
      heading="Plan Explorer"
      subheading="Track account implementations. Select an account to view it's current status."
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
      description-text="Implementation progress."
    >
      <div class="plan-explorer-content">
        <v-row :align="wizardActive && isStarkIndustries ? 'start' : undefined">
          <!-- LEFT: Timeline -->
          <v-col cols="12" md="3" :class="{ 'plan-col--sticky': wizardActive && isStarkIndustries }">
            <div :class="['plan-timeline-wrapper', { 'plan-timeline-wrapper--sticky': wizardActive && isStarkIndustries }]">
            <v-timeline side="start" class="plan-timeline">
              <v-timeline-item
                v-for="(step, index) in implementationSteps"
                :key="index"
                v-show="!wizardActive || !isStarkIndustries || step.title === 'Plan Setup'"
                :dot-color="step.status === 'completed' ? 'success' : step.status === 'in-progress' ? 'primary' : 'grey-lighten-1'"
                size="small"
                :class="{ 'v-timeline-item--has-sub-steps': step.title === 'Plan Setup' && isStarkIndustries && step.active }"
                @click="selectTimelineItem(step)"
              >
                <v-card class="timeline-card" :class="{ 'active-card': step.active }">
                  <v-card-title class="text-h4">{{ step.title }}</v-card-title>
                  <v-card-text>{{ step.description }}</v-card-text>
                </v-card>

                <!-- Wizard sub-steps nested below Plan Setup (Stark Industries only) -->
                <div
                  v-if="step.title === 'Plan Setup' && isStarkIndustries && step.active"
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
          <v-col cols="12" md="9">

            <!-- Wizard step content (Stark Industries, Plan Setup active, sub-step selected) -->
            <div v-if="wizardActive && isStarkIndustries && activeTimelineItem?.title === 'Plan Setup'">
              <div class="wizard-step-header">
                <div class="wizard-step-header-meta">
                  <span class="wizard-step-counter">Step {{ currentWizardStep + 1 }} of {{ wizardSteps.length }}</span>
                  <span v-if="wizardSteps[currentWizardStep].required" class="wizard-required-badge">Required</span>
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
                        <div class="ap-field-row">
                          <div class="ap-field">
                            <span class="ap-field-label">Status</span>
                            <span class="ap-field-value">{{ accountProfile.status || '—' }}</span>
                          </div>
                        </div>
                        <div class="ap-field-row">
                          <div class="ap-checkbox-row">
                            <CheckSquare v-if="accountProfile.isRxWatchtower" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" />
                            <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" />
                            <span class="ap-field-value">IsRxWatchtower</span>
                          </div>
                        </div>
                        <div class="ap-field-row">
                          <div class="ap-checkbox-row">
                            <CheckSquare v-if="accountProfile.manualClaims" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" />
                            <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" />
                            <span class="ap-field-value">Manual Claims</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="form-row">
                          <v-text-field v-model="editableAccountProfile.accountName" label="Account name" variant="outlined" density="compact" />
                          <v-text-field v-model="editableAccountProfile.legalName" label="Legal Name" variant="outlined" density="compact" />
                          <v-text-field v-model="editableAccountProfile.dba" label="DBA" variant="outlined" density="compact" />
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableAccountProfile.effectiveStartDate" label="Effective start date" variant="outlined" density="compact" placeholder="MM/DD/YYYY" />
                          <v-text-field v-model="editableAccountProfile.effectiveEndDate" label="Effective end date" variant="outlined" density="compact" placeholder="MM/DD/YYYY" />
                        </div>
                        <div class="form-row">
                          <v-select v-model="editableAccountProfile.status" :items="statusOptions" label="Status" variant="outlined" density="compact" />
                        </div>
                        <div class="ap-edit-checkboxes">
                          <div class="ap-checkbox-toggle" @click="editableAccountProfile.isRxWatchtower = !editableAccountProfile.isRxWatchtower">
                            <CheckSquare v-if="editableAccountProfile.isRxWatchtower" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" />
                            <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" />
                            <span class="ap-field-value">IsRxWatchtower</span>
                          </div>
                          <div class="ap-checkbox-toggle" @click="editableAccountProfile.manualClaims = !editableAccountProfile.manualClaims">
                            <CheckSquare v-if="editableAccountProfile.manualClaims" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" />
                            <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" />
                            <span class="ap-field-value">Manual Claims</span>
                          </div>
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
                          <v-text-field v-model="editableCompanyInfo.sicCode" label="SIC Code" variant="outlined" density="compact" />
                        </div>
                        <h5 class="ap-subsection-heading">Physical Address</h5>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.physicalAddress1" label="Address 1" variant="outlined" density="compact" />
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.physicalAddress2" label="Address 2" variant="outlined" density="compact" />
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.physicalCity" label="City" variant="outlined" density="compact" />
                          <v-text-field v-model="editableCompanyInfo.physicalState" label="State" variant="outlined" density="compact" />
                          <v-text-field v-model="editableCompanyInfo.physicalZip" label="ZIP" variant="outlined" density="compact" />
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.physicalCountry" label="Country" variant="outlined" density="compact" />
                        </div>
                        <div class="ap-mailing-header">
                          <h5 class="ap-subsection-heading">Mailing Address</h5>
                          <div class="ap-checkbox-toggle" @click="toggleSameAsPhysical">
                            <CheckSquare v-if="sameAsPhysical" :size="18" :stroke-width="1.5" class="ap-checkbox-icon ap-checkbox-icon--checked" />
                            <Square v-else :size="18" :stroke-width="1.5" class="ap-checkbox-icon" />
                            <span class="text-small" style="color: var(--v-theme-on-surface, #1A1A1A);">Same as physical address</span>
                          </div>
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.mailingAddress1" label="Address 1" variant="outlined" density="compact" :disabled="sameAsPhysical" />
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.mailingAddress2" label="Address 2" variant="outlined" density="compact" :disabled="sameAsPhysical" />
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.mailingCity" label="City" variant="outlined" density="compact" :disabled="sameAsPhysical" />
                          <v-text-field v-model="editableCompanyInfo.mailingState" label="State" variant="outlined" density="compact" :disabled="sameAsPhysical" />
                          <v-text-field v-model="editableCompanyInfo.mailingZip" label="ZIP" variant="outlined" density="compact" :disabled="sameAsPhysical" />
                        </div>
                        <div class="form-row">
                          <v-text-field v-model="editableCompanyInfo.mailingCountry" label="Country" variant="outlined" density="compact" :disabled="sameAsPhysical" />
                        </div>
                        <div class="ap-section-footer">
                          <button class="button button-primary" @click="saveCompanyInfo">Save Changes</button>
                          <button class="button button-secondary" @click="cancelEditCompanyInfo">Cancel</button>
                        </div>
                      </template>
                    </div>
                  </div>

                </template>

                <!-- Step 2: Network Configuration -->
                <template v-else-if="currentWizardStep === 1">

                  <!-- Preferred Networks -->
                  <div class="nc-section">
                    <div class="nc-section-header">
                      <h4 class="text-h4">Preferred Networks</h4>
                      <button class="button button-primary">Add Network Link</button>
                    </div>
                    <ReportDataTable
                      :headers="networkHeaders"
                      :items="networkRows"
                      :show-search-bar="true"
                      :show-filter-button="false"
                      :show-filter-pills="true"
                      :initial-filter-pills="networkFilterPills"
                      :show-selection-checkboxes="false"
                      :show-row-actions="true"
                      :show-table-footer="true"
                      search-placeholder="Search by network name"
                    />
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

                    <div class="nc-empty-state nc-empty-state--tab">
                      <img :src="EmptyStateImg" alt="No data" class="nc-empty-icon" />
                      <p class="nc-empty-title">Nothing to see here</p>
                      <p class="nc-empty-subtitle">There are no Assigned {{ activePharmacyTab }} Pharmacies.</p>
                      <button class="button button-secondary">Assign {{ activePharmacyTab }} Pharmacies</button>
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
                  <div class="ap-section">
                    <div class="ap-section-header">
                      <h4 class="text-h4">Billing</h4>
                    </div>

                  <!-- EIN Number -->
                  <div class="bl-section bl-section--no-gap">
                    <p class="wizard-step-description">Review and confirm this account's EIN Number to ensure proper billing.</p>
                    <div class="bl-field-narrow">
                      <TextField
                        v-model="blEinNumber"
                        label="EIN Number"
                      />
                    </div>
                  </div>

                  <div class="lc-section-divider" />

                  <!-- Payment Method -->
                  <div class="bl-section">
                    <p class="lc-hcn-label">Payment Method</p>
                    <div class="toc-toggle-group">
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blPaymentMethod === 'ACH' }]" @click="blPaymentMethod = 'ACH'">ACH</button>
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blPaymentMethod === 'Check' }]" @click="blPaymentMethod = 'Check'">Check</button>
                    </div>

                    <div v-if="blPaymentMethod === 'ACH'" class="bl-subsection">
                      <p class="lc-hcn-label">ACH Method</p>
                      <div class="toc-toggle-group">
                        <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blAchMethod === 'send' }]" @click="blAchMethod = 'send'">Send to Liviniti</button>
                        <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blAchMethod === 'debit' }]" @click="blAchMethod = 'debit'">Debited by Liviniti</button>
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

                    <div class="bl-subsection">
                      <FileUploader :show-document-type-selection="false">
                        <template #label>
                          <p class="bl-upload-label">
                            Upload <a href="#" class="bl-upload-link" @click.prevent>W-9 form</a> or drag and drop
                          </p>
                        </template>
                      </FileUploader>
                    </div>
                  </div>

                  <div class="lc-section-divider" />

                  <!-- Responsible Party -->
                  <div class="bl-section">
                    <p class="lc-hcn-label">Responsible Party</p>
                    <div class="toc-toggle-group">
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blResponsibleParty === 'existing' }]" @click="blResponsibleParty = 'existing'">Existing Contact</button>
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blResponsibleParty === 'new' }]" @click="blResponsibleParty = 'new'">New Contact</button>
                    </div>
                    <div class="lc-fields bl-contact-list">
                      <div
                        v-for="contact in blContactOptions"
                        :key="contact"
                        :class="['lc-field-row', 'bl-contact-row', { 'bl-contact-row--selected': blResponsibleContact === contact }]"
                        @click="blResponsibleContact = contact"
                      >
                        <span class="lc-field-label">{{ contact }}</span>
                        <Check v-if="blResponsibleContact === contact" :size="16" :stroke-width="2" class="lc-check-icon" />
                      </div>
                    </div>
                  </div>

                  <div class="lc-section-divider" />

                  <!-- Billing Report Configuration -->
                  <h4 class="text-h4 bl-section-heading">Billing Report Configuration</h4>

                  <!-- Include Claim Details -->
                  <div class="bl-section">
                    <p class="lc-hcn-label">Include Claim Details in Billing Reports</p>
                    <div class="toc-toggle-group">
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blClaimDetails === 'no' }]" @click="blClaimDetails = 'no'">No</button>
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blClaimDetails === 'yes' }]" @click="blClaimDetails = 'yes'">Yes</button>
                    </div>

                    <div v-if="blClaimDetails === 'yes'" class="bl-subsection">
                      <p class="lc-hcn-label">Include PHI in Claim Details</p>
                      <div class="toc-toggle-group">
                        <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blIncludePhi === 'no' }]" @click="blIncludePhi = 'no'">No</button>
                        <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blIncludePhi === 'yes' }]" @click="blIncludePhi = 'yes'">Yes</button>
                      </div>
                    </div>
                  </div>

                  <!-- Billing Cycle -->
                  <div class="bl-section">
                    <p class="lc-hcn-label">Billing Cycle</p>
                    <div class="bl-field-narrow">
                      <Select
                        v-model="blBillingCycle"
                        :items="blCycleOptions"
                        label="Billing Cycle"
                      />
                    </div>
                  </div>

                  <!-- Division/Location breakdown -->
                  <div class="bl-section">
                    <p class="lc-hcn-label">Does reporting need to be broken down by division or location?</p>
                    <div class="toc-toggle-group">
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blDivisionBreakdown === 'no' }]" @click="blDivisionBreakdown = 'no'">No</button>
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blDivisionBreakdown === 'yes' }]" @click="blDivisionBreakdown = 'yes'">Yes</button>
                    </div>
                    <div v-if="blDivisionBreakdown === 'yes'" class="bl-subsection-select">
                      <Select
                        v-model="blDivisionOption"
                        :items="blDivisionOptions"
                        label="Select option"
                      />
                    </div>
                  </div>

                  <!-- Member level breakdown -->
                  <div class="bl-section">
                    <p class="lc-hcn-label">Does reporting need to be broken down at the member level?</p>
                    <div class="toc-toggle-group">
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blMemberBreakdown === 'no' }]" @click="blMemberBreakdown = 'no'">No</button>
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blMemberBreakdown === 'yes' }]" @click="blMemberBreakdown = 'yes'">Yes</button>
                    </div>
                  </div>

                  <!-- Invoice breakout -->
                  <div class="bl-section">
                    <p class="lc-hcn-label">Do invoices need to be broken out?</p>
                    <div class="toc-toggle-group">
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blInvoiceBreakout === 'no' }]" @click="blInvoiceBreakout = 'no'">No</button>
                      <button :class="['button', 'toc-toggle', { 'toc-toggle--selected': blInvoiceBreakout === 'yes' }]" @click="blInvoiceBreakout = 'yes'">Yes</button>
                    </div>
                  </div>

                  <div class="lc-section-divider" />

                  <!-- Billing Notes -->
                  <div class="bl-section">
                    <v-textarea
                      v-model="blNotes"
                      label="Billing Notes"
                      variant="outlined"
                      density="compact"
                      rows="3"
                      auto-grow
                      hide-details
                      class="bl-notes-textarea"
                    />
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
                  <button v-if="currentWizardStep < wizardSteps.length - 1" class="button button-primary" @click="nextWizardStep">Next</button>
                  <button v-if="currentWizardStep === wizardSteps.length - 1" class="button button-primary" @click="finishPlanSetup">Finish Plan Setup</button>
                </div>
              </div>
            </div>

            <!-- Overview card (Stark Industries, Plan Setup selected, no sub-step yet) -->
            <div
              v-else-if="activeTimelineItem?.title === 'Plan Setup' && isStarkIndustries"
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
                  Get Started <ArrowRightIcon :size="16" :stroke-width="2" style="margin-left: 6px;" />
                </button>
              </div>
            </div>

            <!-- Standard details panel (all other steps / accounts) -->
            <div v-else-if="activeTimelineItem" class="timeline-details-card">
              <div class="d-flex justify-space-between align-center mb-small">
                <div class="timeline-text-content d-flex flex-column timeline-text-content-gap">
                  <h3 class="text-h3">{{ activeTimelineItem.title }} Details</h3>
                  <p class="text-body">{{ activeTimelineItem.description }}</p>
                  <p class="text-body mb-xsmall"><strong>Start Date:</strong> {{ activeTimelineItem.startDate }}</p>
                  <p class="text-body mb-xsmall"><strong>End Date:</strong> {{ activeTimelineItem.endDate }}</p>
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import AccountSelector from '@/components/common/AccountSelector.vue';
import PageCard from '@/components/common/PageCard.vue';
import Button from '@/components/ui/Button.vue';
import ReportDataTable from '@/components/common/ReportDataTable.vue';
import FilteringPill from '@/components/ui/FilteringPill.vue';
import Select from '@/components/ui/Select.vue';
import TextField from '@/components/ui/TextField.vue';
import FileUploader from '@/components/ui/FileUploader.vue';
import Autocomplete from '@/components/ui/Autocomplete.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import {
  Hourglass, CircleCheckBig, XCircle,
  Save as SaveIcon, LayoutList as LayoutListIcon, CircleCheck as CircleCheckIcon,
  ArrowRight as ArrowRightIcon, Pencil, CheckSquare, Square, ChevronDown, PlusCircle, X, Check, CloudDownload, TriangleAlert,
} from 'lucide-vue-next';
import EmptyStateImg from '@/assets/EmptyState.svg';
import { VRow, VCol, VProgressCircular } from 'vuetify/components';

const STARK_INDUSTRIES_ID = 1;

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

const blPaymentMethod = ref('ACH');
const blAchMethod = ref('send');
const blResponsibleParty = ref('existing');
const blResponsibleContact = ref('Nick Johnson');
const blContactOptions = ['Nick Johnson', 'Sarah Lee', 'Mark Davis'];
const blClaimDetails = ref('yes');
const blIncludePhi = ref('no');
const blBillingCycle = ref('Weekly');
const blCycleOptions = ['Weekly', 'Bi-Weekly', 'Monthly'];
const blDivisionBreakdown = ref('no');
const blDivisionOption = ref('');
const blDivisionOptions = ['Division', 'Location', 'Both'];
const blMemberBreakdown = ref('yes');
const blInvoiceBreakout = ref('no');
const blEinNumber = ref('111111111');
const blNotes = ref('');

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

const selectedAccountName = computed(() => {
  const account = accountOptions.value.find(acc => acc.id === selectedAccount.value);
  return account ? `Implementation Tracker for ${account.name}` : '';
});

const wizardSteps = ref([
  { name: 'Account Profile',        required: true,  status: 'not-started',  description: 'Confirm the account details, set effective dates and set notes or alerts if applicable.' },
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
    status: 'completed',
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

const finishPlanSetup = () => {
  wizardActive.value = false;
  const contractStatus = implementationSteps.value.find(s => s.title === 'Contract Status');
  if (contractStatus) selectTimelineItem(contractStatus);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ─── Step 1 data ──────────────────────────────────────────────────────────────

const statusOptions = ['Implementation', 'Active', 'Inactive', 'Pending'];

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

const networkRows = ref([
  { networkName: 'First Choice Broad',  status: 'active', linkingLevel: 'Account', linkedGroups: 'All', linkedPlans: 'All', bin: '—', effStartDate: '03/01/2026', endDate: '—' },
  { networkName: 'Mail Order - Network', status: 'active', linkingLevel: 'Account', linkedGroups: 'All', linkedPlans: 'All', bin: '—', effStartDate: '03/01/2026', endDate: '—' },
  { networkName: 'Compliance',          status: 'active', linkingLevel: 'Account', linkedGroups: 'All', linkedPlans: 'All', bin: '—', effStartDate: '03/01/2026', endDate: '—' },
]);

const pharmacyTabs = ['In-House', 'Specialty', 'Mail Order', 'Custom'];
const activePharmacyTab = ref('In-House');

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
  // Pin the dot to the top for the Plan Setup item when sub-steps are expanded
  .v-timeline-item--has-sub-steps {
    :deep(.v-timeline-item__body) {
      align-self: flex-start;
    }
    :deep(.v-timeline-item__dot) {
      margin-top: 16px;
    }
  }

  .v-timeline-item {
    .timeline-card {
      width: 100%;
      border: 1px solid $color-border;
      box-shadow: none;
      cursor: pointer;
      transition: box-shadow 0.3s ease;

      &:hover { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }

      .v-card-title { color: $color-primary; }
      .v-card-text { letter-spacing: 0 !important; }
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

  .button { display: inline-flex; align-items: center; }
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
  gap: 32px;
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

.bl-contact-list {
  margin-top: $spacing-small;
}

.bl-contact-row {
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }

  &--selected .lc-field-label {
    color: $color-primary;
    font-weight: $font-weight-semibold;
  }
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
</style>
