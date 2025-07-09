
<template>
  <v-app-bar app color="white" flat dense border>
    <v-spacer></v-spacer>
    <v-btn variant="outlined" color="black" class="mr-2 help-button">Get Help</v-btn>
    <v-btn icon class="mr-2">
      <v-icon color="#0F285B">mdi-cog-outline</v-icon>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="36">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User" />
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
// No script needed for this static component
</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid #e0e0e0 !important;
}
.help-button {
  border-radius: 100px;
  text-transform: none; /* Enforce title case */
}
</style>
