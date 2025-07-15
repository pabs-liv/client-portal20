<template>
  <div class="tabs-container">
    <div class="tabs-wrapper">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { 'active': selectedTab === tab.key }]"
        @click="selectTab(tab.key)"
      >
        <span>{{ tab.label }}</span>
        <span v-if="tab.count" class="tab-count"> ({{ tab.count }})</span>
        <ChevronDown v-if="tab.hasDropdown" :stroke-width="1" class="dropdown-icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return value.every(tab =>
        typeof tab.label === 'string' &&
        typeof tab.key === 'string' &&
        (tab.count === undefined || typeof tab.count === 'number') &&
        (tab.hasDropdown === undefined || typeof tab.hasDropdown === 'boolean')
      );
    },
  },
});

const emit = defineEmits(['tab-selected']);

const selectedTab = ref(props.tabs.length > 0 ? props.tabs[0].key : null);

const selectTab = (key) => {
  selectedTab.value = key;
  emit('tab-selected', key);
};
</script>

<style scoped>
.tabs-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
  border-bottom: 1px solid #eee; /* Subtle line below tabs */
}

.tabs-wrapper {
  display: flex;
  flex-wrap: nowrap; /* Prevent tabs from wrapping to next line */
  gap: var(--spacing-medium); /* Spacing between tabs */
  padding-bottom: var(--spacing-nano); /* Space for underline */
}

.tab-item {
  cursor: pointer;
  padding: var(--spacing-small) 0;
  white-space: nowrap; /* Prevent text from wrapping */
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
  transition: color 0.2s ease-in-out;
  position: relative; /* For the underline */
}

.tab-item:hover {
  color: var(--color-primary);
}

.tab-item.active {
  font-weight: bold;
  color: var(--color-primary);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px; /* Position just above the border-bottom of tabs-container */
  left: 0;
  width: 100%;
  height: 2px; /* Thickness of the underline */
  background-color: var(--color-primary);
}

.tab-count {
  margin-left: var(--spacing-nano);
  font-size: 0.8rem;
}

.dropdown-icon {
  margin-left: var(--spacing-nano);
  font-size: 1rem;
}
</style>
