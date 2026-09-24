<template>
  <div class="login-page">
    <div class="login-card">
      <img src="/icons/Logo.svg" alt="Client Portal Logo" class="login-logo" />

      <h1 class="login-title">Client Portal</h1>
      <p class="login-tagline">Sign in to view your reports, claims, and account details.</p>

      <Banner
        variant="info"
        :always-show="true"
        class="login-alert"
        message="Logging in for the first time? Select 'Reset password' after clicking Login below to complete a one-time password update."
      />

      <Button variant="primary" label="Login" class="login-btn" @click="onContinue" />

      <div class="vendor-callout">
        <UserPlus :size="20" :stroke-width="1.5" class="vendor-callout-icon" />
        <div class="vendor-callout-text">
          <p class="vendor-callout-title">First time accessing the new Client Portal as a vendor?</p>
          <p class="vendor-callout-body">
            If you haven't logged in here before, you'll need to request access first.
            <button type="button" class="vendor-link" @click="showVendorDialog = true">
              Request vendor access
            </button>
          </p>
        </div>
      </div>
    </div>

    <Dialog
      v-model="showVendorDialog"
      heading="Request vendor access"
      :actions="dialogActions"
      show-secondary-button
      max-width="440"
    >
      <p v-if="!submitted" class="text-body vendor-dialog-text">
        Enter your details below and we'll create a ticket to review your request.
      </p>

      <template v-if="!submitted">
        <TextField v-model="vendorForm.firstName" label="First name" class="vendor-field" />
        <TextField v-model="vendorForm.lastName" label="Last name" class="vendor-field" />
        <TextField v-model="vendorForm.email" label="Email address" type="email" class="vendor-field" />
        <TextField v-model="vendorForm.vendorName" label="Vendor name" class="vendor-field" />
      </template>
      <p v-else class="text-body vendor-dialog-text">
        Your request has been submitted. A ticket has been created and the Client Portal team will follow up by email once your access is approved.
      </p>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { UserPlus } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Banner from '@/components/common/Banner.vue';
import TextField from '@/components/ui/TextField.vue';

const router = useRouter();

const showVendorDialog = ref(false);
const submitted = ref(false);

const vendorForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  vendorName: '',
});

function onContinue() {
  router.push('/home');
}

function submitVendorRequest() {
  submitted.value = true;
}

function closeVendorDialog() {
  showVendorDialog.value = false;
  submitted.value = false;
  vendorForm.firstName = '';
  vendorForm.lastName = '';
  vendorForm.email = '';
  vendorForm.vendorName = '';
}

const dialogActions = computed(() => submitted.value
  ? [{ text: 'Close', onClick: closeVendorDialog }]
  : [
    { text: 'Cancel', styleType: 'secondary', onClick: closeVendorDialog },
    { text: 'Submit request', onClick: submitVendorRequest },
  ]);
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  padding: $spacing-large;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 440px;
  width: 100%;
  background: $color-neutral-white;
  border: 1px solid $color-border;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  padding: $spacing-xlarge $spacing-large;
  text-align: center;
}

.login-logo {
  max-width: 200px;
  height: auto;
  margin-bottom: $spacing-medium;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $color-text-primary;
  margin: 0 0 $spacing-medium;
}

.login-tagline {
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: 0 0 $spacing-medium;
}

.login-alert {
  margin-bottom: $spacing-medium;
  text-align: left;

  :deep(.banner) {
    align-items: flex-start;
  }
}

.login-btn {
  width: 100%;
}

.vendor-callout {
  display: flex;
  align-items: flex-start;
  gap: $spacing-small;
  width: 100%;
  margin-top: $spacing-medium;
  padding: $spacing-small;
  border: 1px solid $color-border;
  border-radius: 4px;
  text-align: left;
}

.vendor-callout-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: $color-text-secondary;
}

.vendor-callout-title {
  font-size: $font-size-small;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin: 0 0 $spacing-nano;
}

.vendor-callout-body {
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: 0;
}

.vendor-link {
  background: none;
  border: none;
  padding: 0;
  color: $color-link;
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  white-space: nowrap;
}

.vendor-dialog-text {
  margin-bottom: $spacing-small;
}

.vendor-field {
  margin-bottom: $spacing-small;
}
</style>
