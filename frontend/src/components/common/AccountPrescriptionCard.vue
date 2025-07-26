<template>
  <v-card class="account-prescription-card" max-width="700">
    <v-card-text>
      <v-row align="center" no-gutters class="card-header">
        <v-col cols="auto">
          <v-avatar size="64" rounded="circle">
            <v-img :src="livAvatar" alt="Carrier Logo"></v-img>
          </v-avatar>
        </v-col>
        <v-col class="ml-4 title-section">
          <h2 class="text-h2 font-weight-bold primary--text">{{ accountName }}</h2>
          <p class="text-body-1">{{ carrier }}</p>
        </v-col>
        <v-col cols="auto" class="status-section">
          <v-chip :class="statusClass" class="status-chip" label small>
            {{ formattedStatus }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row class="mt-4 info-row">
        
        <v-col cols="6" sm="3">
          <div class="info-item">
            <span class="info-label">Start Date</span>
            <span class="info-value">{{ startDate }}</span>
          </div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="info-item">
            <span class="info-label">End Date</span>
            <span class="info-value">{{ endDate }}</span>
          </div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="info-item">
            <span class="info-label">BIN</span>
            <span class="info-value">{{ routingBin }}</span>
          </div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="info-item">
            <span class="info-label">Lives Covered</span>
            <span class="info-value">{{ livesCovered }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-footer class="card-footer">
      <p class="text-small">Incorrect information? Contact your account manager for assistance.</p>
    </v-footer>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VCard, VCardText, VRow, VCol, VAvatar, VImg, VChip, VFooter } from 'vuetify/components';
import livAvatar from '@/assets/livAvatar.png';

const props = defineProps<{
  accountName: string;
  carrier: string;
  livesCovered: number;
  startDate: string;
  endDate: string;
  routingBin: string;
  status: 'active' | 'inactive' | 'implementing';
}>();

const formattedStatus = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1);
});

const statusClass = computed(() => {
  return `status-${props.status}`;
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.account-prescription-card {
  border: 1px solid $color-border;
  border-radius: 8px;
  background-color: $color-neutral-white;
  box-shadow: none;
  width: 100%;

  .primary--text {
    color: $color-primary;
  }

  .status-chip {
    color: $color-neutral-white;
    font-weight: $font-weight-bold;
    text-transform: uppercase;

    &.status-active {
      background-color: $color-approved;
    }
    &.status-inactive {
      background-color: $color-denied;
    }
    &.status-implementing {
      background-color: $color-pending;
    }
  }

  .info-item {
    display: flex;
    flex-direction: column;
  }

  .info-label {
    font-size: $font-size-small;
    color: $color-neutral-disabled;
    margin-bottom: $spacing-nano;
  }

  .info-value {
    font-size: $font-size-body;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
  
  .card-footer {
    background-color: transparent;
    padding: $spacing-small $spacing-medium;
    
    p {
        color: $color-neutral-disabled;
    }
  }
}

@media (max-width: 600px) {
  .account-prescription-card {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-medium;
      position: relative;
    }

    .title-section {
      margin-left: 0 !important;
    }

    .status-section {
      align-self: flex-end;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
