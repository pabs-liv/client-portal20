<template>
  <div>
    <div class="account-selector mb-large">
      <div class="title">
        <h1 class="text-h1">Added Value Programs</h1>
        <p class="text-body">
          Explore added-value programs to enrich the lives and improve the health of your members. Select an account to get started.
        </p>
      </div>
      <Select
        :items="accountOptions"
        label="Select Account"
        item-title="name"
        item-value="id"
        :searchable="true"
        v-model="selectedAccount"
        class="account-select"
      />
    </div>
    <div class="no-program mb-large">
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
  </div>
</template>
<script setup lang="ts">
import PageCard from '@/components/common/PageCard.vue';
import Card from '@/components/ui/Card.vue';
import Select from '@/components/ui/Select.vue';
import { VRow, VCol, VBtn } from 'vuetify/components';
import { ref, computed } from 'vue';

const accountOptions = ref([
  { id: 1, name: 'Blue Cross Blue Shield' },
  { id: 2, name: 'Aetna' },
  { id: 3, name: 'Cigna' },
  { id: 4, name: 'UnitedHealthcare' },
  { id: 5, name: 'Humana' },
]);

const selectedAccount = ref(null);

const selectedPrograms = ref<boolean[]>([false, false, false, false]);

const isAnyCardSelected = computed(() => selectedPrograms.value.some(selected => selected));
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
</style>