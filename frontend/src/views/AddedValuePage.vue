<template>
  <div>
    <Dialog
      :model-value="showAccountSelectionDialog"
      heading="Select Account to Manage"
      :persistent="true"
      :actions="dialogActions"
    >
      <Select
        :items="accountOptions"
        label="Select Account"
        item-title="name"
        item-value="id"
        :searchable="true"
        v-model="selectedAccount"
        class="account-select"
      />
    </Dialog>

    <AccountSelector
      heading="Added Value Programs"
      subheading="Explore added-value programs to enrich the lives and improve the health of your members. Select an account to get started."
      :items="accountOptions"
      label="Select Account"
      item-title="name"
      item-value="id"
      :searchable="true"
      v-model="selectedAccount"
      @update:model-value="updateDisplayAccountType"
    />
    <div class="no-program mb-large" v-if="displayAccountType === 'no-program'">
      <h2 class="text-h2">This Account Does Not Have Any Programs</h2>
      <p class="text-body">Choose from the available programs below to help your clients reduce costs and improve care for their members.</p>
      <v-row>
        <v-col cols="12" sm="6" md="3" v-for="i in 4" :key="i">
            <Card
              :title="['Anti-Obesity Management Program', 'Liviniti Pharmacogenomics', 'Liviniti Delivery on Demand', 'LivLite'][i - 1]"
              :subtitle="['Wellness', 'Wellness', 'Savings', 'Savings'][i - 1]"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              :selected="selectedPrograms[i - 1]"
              variant="checkbox"
              @update:selected="selectedPrograms[i - 1] = $event"
            />
        </v-col>
      </v-row>
      <v-btn v-if="isAnyCardSelected" color="primary" rounded>Request Program Details</v-btn>
    </div>
    <div class="account-programs" v-if="displayAccountType === 'account-programs'">
      <v-row>
        <v-col cols="12" md="8" class="d-flex justify-center align-center">
          <AccountPrescriptionCard
            accountName="Stark Industries"
            carrier="Blue Cross Blue Shield"
            :livesCovered="5000"
            startDate="01/01/2024"
            endDate="12/31/2024"
            routingBin="610455"
            status="active"
          />
        </v-col>
        <v-col cols="12" md="4" class="programs-column">
          <h2 class="text-h2 programs-title">Programs</h2>
          <div class="programs-in-use">
            <h4 class="text-h4">In Use</h4>
            <Card
              title="Anti-Obesity Management Program"
              subtitle="Wellness"
              class="hug-content"
              :flat="true"
            />
          </div>
          <div class="programs-available">
            <h4 class="text-h4">Available</h4>
            <p class="text-body">Choose from the available programs below to help your clients reduce costs and improve care for their members.</p>
            <Card
              title="Liviniti Delivery on Demand"
              subtitle="Savings"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              class="hug-content"
              variant="checkbox"
              :selected="selectedPrograms[2]"
              @update:selected="selectedPrograms[2] = $event"
            />
            <Card
              title="LivLite"
              subtitle="Savings"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              class="hug-content"
              variant="checkbox"
              :selected="selectedPrograms[3]"
              @update:selected="selectedPrograms[3] = $event"
            />
            <v-btn v-if="isAnyAvailableCardSelected" color="primary" rounded>Request Program Details</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import AccountPrescriptionCard from '@/components/common/AccountPrescriptionCard.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Card from '@/components/ui/Card.vue';
import AccountSelector from '@/components/common/AccountSelector.vue';
import Select from '@/components/ui/Select.vue';
import { VRow, VCol, VBtn } from 'vuetify/components';
import { ref, computed, onMounted } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Blue Cross Blue Shield' },
  { id: 2, name: 'Aetna' },
  { id: 3, name: 'Cigna' },
  { id: 4, name: 'UnitedHealthcare' },
  { id: 5, name: 'Humana' },
]);

const selectedAccount = ref(null);
const showAccountSelectionDialog = ref(false);
const displayAccountType = ref<string | null>(null);

const dialogActions = computed(() => [
  {
    text: 'Continue',
    onClick: handleAccountSelection,
    color: 'primary',
    variant: 'elevated',
    disabled: !selectedAccount.value,
  },
]);

const selectedPrograms = ref<boolean[]>([false, false, false, false]);

const isAnyCardSelected = computed(() => selectedPrograms.value.some(selected => selected));

const isAnyAvailableCardSelected = computed(() => selectedPrograms.value.slice(2).some(selected => selected));

const handleAccountSelection = () => {
  console.log('Selected Account:', selectedAccount.value);
  showAccountSelectionDialog.value = false;
  updateDisplayAccountType(selectedAccount.value);
};

const updateDisplayAccountType = (accountId: number) => {
  if (accountId === 1) { // Blue Cross Blue Shield
    displayAccountType.value = 'no-program';
  } else if (accountId === 2) { // Aetna
    displayAccountType.value = 'account-programs';
  } else {
    displayAccountType.value = null;
  }
};

onMounted(() => {
  showAccountSelectionDialog.value = true;
});
</script>
<style lang="scss" scoped>
@import '@/style.scss';

.programs-in-use-section {
  margin-bottom: $spacing-xlarge !important;
}

.programs-in-use h3,
.programs-available h3 {
  margin-bottom: $spacing-medium !important;
}

.account-selector {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Ensure vertical centering of items */
  border: 1px solid $color-border;
  padding: $spacing-medium;
  border-radius: 8px;
  min-height: 80px; /* Added to give a defined height for centering */

  .title {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
    flex-grow: 1; /* Allow title to take available space */

    h1 {
      margin-bottom: 0; /* Remove default h1 margin */
    }

    p {
      margin-bottom: 0; /* Remove default p margin */
    }
  }

  .account-select {
    max-width: 300px; /* Adjust as needed */
  }
}

@media (max-width: 768px) {
  .account-selector {
    flex-direction: column;
    align-items: flex-start; /* Align items to start in column layout */
    gap: $spacing-medium; /* Add gap between items in column */

    .title {
      width: 100%; /* Full width for title in mobile */
    }

    .account-select {
      max-width: 100%; /* Full width for select in mobile */
      width: 100%;
    }
  }
}

.no-program {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: $spacing-large;
  gap: $spacing-large;

  h2 {
    color: $color-primary;
  }

  p {
    margin-bottom: 0;
  }
}

.programs-column {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.programs-title {
  color: $color-primary;
}

.programs-in-use,
.programs-available {
  display: flex;
  flex-direction: column;
  gap: $spacing-medium;
}
</style>