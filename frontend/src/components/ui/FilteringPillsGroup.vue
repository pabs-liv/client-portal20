<script setup lang="ts">
import FilteringPill from './FilteringPill.vue';
import type { FilterPill } from './FilteringPill.vue';

interface Props {
  filters: FilterPill[];
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closable: false,
});

const emit = defineEmits<{
  (e: 'click:filter', filter: FilterPill): void;
  (e: 'close:filter', filter: FilterPill): void;
}>();
</script>

<template>
  <div class="d-flex w-100 flex-wrap ga-2 mb-5">
    <div v-for="(filter, index) in props.filters" :key="index" class="d-flex">
      <v-divider v-if="filter.prependDivider" vertical opacity=".7" class="ml-2 mr-4" />
      <FilteringPill
        :key="filter.label"
        :is-active="filter.isActive"
        :closable="props.closable"
        @click="emit('click:filter', filter)"
        @click:close="emit('close:filter', filter)"
      >
        {{ filter.label }}
      </FilteringPill>
    </div>
  </div>
</template>

<style scoped></style>
