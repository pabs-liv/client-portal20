<template>
  <v-tabs
    v-model="selectedTab"
    color="primary"
    slider-color="primary"
    show-arrows
    class="custom-vuetify-tabs"
  >
    <v-tab
      v-for="tab in tabs"
      :key="tab.key"
      :value="tab.key"
      @click="selectTab(tab.key)"
      class="text-capitalize"
    >
      {{ tab.label }}
      <span v-if="tab.count" class="tab-count"> ({{ tab.count }})</span>
      <ChevronDown v-if="tab.hasDropdown" :stroke-width="1" class="dropdown-icon" />
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

interface Tab {
  label: string;
  key: string;
  count?: number;
  hasDropdown?: boolean;
}

interface Props {
  tabs: Tab[];
  initialTab?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['tab-selected']);

// initialTab lets a caller deep-link straight to a specific tab (e.g. another page's
// "go to Settings" CTA) instead of always landing on the first tab.
const initialTabValid = props.initialTab && props.tabs.some(tab => tab.key === props.initialTab);
const selectedTab = ref<string | null>(
  initialTabValid ? props.initialTab! : (props.tabs.length > 0 ? props.tabs[0].key : null)
);

watch(() => props.tabs, (newTabs) => {
  if (newTabs.length > 0 && !newTabs.some(tab => tab.key === selectedTab.value)) {
    selectedTab.value = newTabs[0].key;
  } else if (newTabs.length === 0) {
    selectedTab.value = null;
  }
}, { immediate: true });

watch(selectedTab, (newVal) => {
  if (newVal) {
    emit('tab-selected', newVal);
  }
});

const selectTab = (key: string) => {
  selectedTab.value = key;
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.custom-vuetify-tabs {
  border-bottom: 1px solid $color-border;
  margin-bottom: $spacing-large; // Add margin-bottom here instead of parent

  .v-tab {
    font-weight: $font-weight-normal;
    color: $color-text-primary;
    transition: all 0.2s ease-in-out;
    padding: $spacing-small $spacing-medium;
    font-family: $font-family-base !important;
    letter-spacing: normal !important;

    &.v-tab--selected {
      font-weight: $font-weight-bold;
      color: $color-primary;
    }

    .tab-count {
      margin-left: $spacing-nano;
      font-size: $font-size-small;
    }

    .dropdown-icon {
      margin-left: $spacing-nano;
      font-size: 1rem;
    }
  }
}
</style>