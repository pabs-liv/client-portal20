
<template>
  <div>
    <h1 class="text-h1 mb-large">Added Value Programs</h1>
    <PageCard
      headerText="Program Selector"
      descriptionText="Explore added-value programs to enrich the lives and improve the health of your members."
    >
      <div class="programs-in-use programs-in-use-section">
        <h3 class="text-h3 text-primary mb-medium">Programs In Use</h3>
        <v-row>
          <v-col cols="12" sm="6" md="3" v-for="i in 2" :key="i">
            <Card
              :title="['Anti-Obesity Management Program', 'Liviniti Pharmacogenomics', 'Liviniti Delivery on Demand', 'LivLite'][i - 1]"
              :subtitle="['Wellness', 'Wellness', 'Savings', 'Wellness'][i - 1]"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              :actions="[{ text: 'Learn More', onClick: () => console.log('Learn More clicked for Program '+i) }]"
              :selected="true"
            />
          </v-col>
        </v-row>
      </div>
      <div class="programs-available">
        <h3 class="text-h3 text-primary mb-medium">Available Programs</h3>
        <v-row>
          <v-col cols="12" sm="6" md="3" v-for="i in [3, 4]" :key="i">
            <Card
              :title="['Anti-Obesity Management Program', 'Liviniti Pharmacogenomics', 'Liviniti Delivery on Demand', 'LivLite'][i - 1]"
              :subtitle="['Wellness', 'Wellness', 'Savings', 'Wellness'][i - 1]"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              :actions="[{ text: 'Learn More', onClick: () => console.log('Learn More clicked for Program '+i) }]"
              :selected="false"
            />
          </v-col>
        </v-row>
      </div>
    </PageCard>
  </div>
</template>
<script setup lang="ts">
import PageCard from '@/components/common/PageCard.vue';
import Card from '@/components/ui/Card.vue';
import { VRow, VCol } from 'vuetify/components';
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
</style>
