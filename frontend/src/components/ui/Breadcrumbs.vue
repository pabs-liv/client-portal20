<template>
  <v-breadcrumbs :items="breadcrumbs" class="custom-breadcrumbs">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface Breadcrumb {
  title: string;
  disabled: boolean;
  to: string;
}

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const matched = route.matched;
  return matched
    .filter(r => r.meta && r.meta.breadcrumb)
    .map((r, index) => ({
      title: r.meta.breadcrumb as string,
      disabled: index === matched.length - 1, // Disable the last item
      to: r.path,
    }));
});
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.custom-breadcrumbs {
  :deep(.v-breadcrumbs-item--disabled) {
    color: $color-primary;
    opacity: 1; // Ensure full color intensity
  }

  :deep(.v-breadcrumbs-item:not(.v-breadcrumbs-item--disabled)) {
    color: $color-neutral-disabled;
  }

  :deep(.v-breadcrumbs-divider) {
    color: $color-neutral-disabled;
  }
}
</style>
