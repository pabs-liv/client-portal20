<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
</script>

<template>
  <v-btn class="text-body-large" v-bind="$attrs" text="Edit" variant="outlined" color="primary" density="comfortable" slim>
    <template #prepend>
      <Pencil :size="16" />
    </template>
  </v-btn>
</template>
