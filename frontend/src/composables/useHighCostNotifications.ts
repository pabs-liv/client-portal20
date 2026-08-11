import { ref } from 'vue';

// Shared module-level state so the High Cost Notifications widget stays in sync between
// Plan Explorer > Limits & Controls and Settings > Company Information — same underlying
// setting, surfaced in two places, not two independent copies.
const lcEditingHcn = ref(false);
const lcNotifyThreshold = ref('10000');
const lcRecipients = ref<string[]>([]);
let lcHcnSnapshot = { threshold: '', recipients: [] as string[] };

function lcHcnStartEdit() {
  lcHcnSnapshot = { threshold: lcNotifyThreshold.value, recipients: [...lcRecipients.value] };
  lcEditingHcn.value = true;
}

function lcHcnSaveEdit() {
  lcEditingHcn.value = false;
}

function lcHcnCancelEdit() {
  lcNotifyThreshold.value = lcHcnSnapshot.threshold;
  lcRecipients.value = [...lcHcnSnapshot.recipients];
  lcEditingHcn.value = false;
}

export function useHighCostNotifications() {
  return { lcEditingHcn, lcNotifyThreshold, lcRecipients, lcHcnStartEdit, lcHcnSaveEdit, lcHcnCancelEdit };
}
