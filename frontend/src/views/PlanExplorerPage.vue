
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
    >
    </AccountSelector>

    <PageCard
      v-if="selectedAccount"
      :header-text="selectedAccountName"
      description-text="Implementation progress."
    >
      <div class="plan-explorer-content">
        <v-row>
          <v-col cols="12" md="4">
            <v-timeline side="start" class="plan-timeline">
              <v-timeline-item
                v-for="(step, index) in implementationSteps"
                :key="index"
                :dot-color="step.status === 'completed' ? 'success' : step.status === 'in-progress' ? 'primary' : 'grey-lighten-1'"
                size="small"
                @click="selectTimelineItem(step)"
              >
                <v-card class="timeline-card" :class="{'active-card': step.active}">
                  <v-card-title class="text-h4">{{ step.title }}</v-card-title>
                  <v-card-text>{{ step.description }}</v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-col>
          <v-col cols="12" md="8">
            <div v-if="activeTimelineItem" class="timeline-details-card">
              <div class="d-flex justify-space-between align-center mb-small">
                <div class="timeline-text-content d-flex flex-column timeline-text-content-gap">
                  <h3 class="text-h3">{{ activeTimelineItem.title }} Details</h3>
                  <p class="text-body">{{ activeTimelineItem.description }}</p>
                  <p class="text-body mb-xsmall"><strong>Start Date:</strong> {{ activeTimelineItem.startDate }}</p>
                  <p class="text-body mb-xsmall"><strong>End Date:</strong> {{ activeTimelineItem.endDate }}</p>
                  <p class="text-body mb-xsmall"><strong>Assigned To:</strong> {{ activeTimelineItem.assignedTo }}</p>
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

              <Button
                v-if="activeTimelineItem.status === 'in-progress'"
                @click="markAsComplete(activeTimelineItem)"
                label="Mark as Complete"
                variant="elevated"
                color="primary"
              />
              <Button
                v-if="activeTimelineItem.status === 'pending'"
                @click="markAsInProgress(activeTimelineItem)"
                label="Mark as In-Progress"
                variant="elevated"
                color="primary"
              />
              <Button
                v-if="activeTimelineItem.status === 'completed'"
                @click="markAsPending(activeTimelineItem)"
                label="Mark as Pending"
                variant="outlined"
                color="primary"
              />
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
import { Hourglass, CircleCheckBig, XCircle } from 'lucide-vue-next';
import { VRow, VCol, VProgressCircular } from 'vuetify/components';

const accountOptions = ref([
  { id: 1, name: 'Stark Industries' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Cyberdyne Systems' },
  { id: 4, name: 'Oscorp' },
  { id: 5, name: 'Tyrell Corporation' },
]);

const selectedAccount = ref<number | null>(null);

const selectedAccountName = computed(() => {
  const account = accountOptions.value.find(acc => acc.id === selectedAccount.value);
  return account ? `Implementation Tracker for ${account.name}` : '';
});

const implementationSteps = ref([
  {
    title: 'Plan Setup',
    description: 'Initial setup of the plan details and configurations.',
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
  implementationSteps.value.forEach(step => {
    step.active = (step === item);
  });
  activeTimelineItem.value = item;
};

const activeTimelineProgress = computed(() => {
  if (!activeTimelineItem.value) return 0;

  switch (activeTimelineItem.value.status) {
    case 'completed':
      return 100;
    case 'in-progress':
      return 50;
    case 'pending':
      return 0;
    default:
      return 0;
  }
});

const progressCircularColor = computed(() => {
  if (!activeTimelineItem.value) return 'grey';

  switch (activeTimelineItem.value.status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'primary';
    case 'pending':
      return 'primary'; // Set to primary for pending as well
    default:
      return 'grey';
  }
});

const markAsComplete = (item: any) => {
  item.status = 'completed';
  item.active = true; // Keep it active after marking as complete
  // Optionally, update other properties like endDate
  item.endDate = new Date().toISOString().slice(0, 10); // Set current date as end date
};

const markAsInProgress = (item: any) => {
  item.status = 'in-progress';
  item.startDate = new Date().toISOString().slice(0, 10); // Set current date as start date
  item.endDate = ''; // Clear end date
};

const markAsPending = (item: any) => {
  item.status = 'pending';
  item.startDate = ''; // Clear start date
  item.endDate = ''; // Clear end date
};

watch(selectedAccount, (newVal) => {
  if (newVal) {
    implementationSteps.value.forEach((step, index) => {
      step.active = (index === 0);
    });
    activeTimelineItem.value = implementationSteps.value[0];
  } else {
    implementationSteps.value.forEach(step => {
      step.active = false;
    });
    activeTimelineItem.value = null;
  }
}, { immediate: true });
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.plan-explorer-content {
  padding: $spacing-medium;
}

.timeline-details-card {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
}

.plan-timeline {
  .v-timeline-item {
    .timeline-card {
      width: 100%;
      width: 350px; /* Adjust as needed */
      border: 1px solid $color-border;
      box-shadow: none; /* Remove default shadow */
      cursor: pointer;
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .v-card-title {
        color: $color-primary;
      }

      .v-card-text {
        letter-spacing: 0 !important;
      }
    }

    .active-card {
      border-color: $color-primary;
    }
  }
}

@media (max-width: 768px) {
  .plan-timeline {
  }
}

.status-chip-uppercase {
  text-transform: uppercase;
}

.progress-chip-container {
  gap: $spacing-xsmall;
}

.timeline-text-content-gap {
  gap: $spacing-medium;
}
</style>
