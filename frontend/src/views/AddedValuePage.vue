<template>
  <div :style="{ paddingBottom: selectedAvailableIds.length > 0 ? '88px' : '0', transition: 'padding-bottom 0.3s ease' }">
    <AccountSelector
      heading="Added Value Programs"
      subheading="Explore added-value programs to enrich the lives and improve the health of your members. Select an account to get started."
      :items="accountOptions"
      label="Select Account"
      item-title="name"
      item-value="id"
      :searchable="true"
      v-model="selectedAccount"
      variant="outlined"
    />

    <div v-if="selectedAccountData">

      <!-- ── Your Programs (table / list style) ── -->
      <div v-if="activePrograms.length > 0" class="programs-section mb-large">
        <div class="programs-section-header">
          <h2 class="text-h2 section-title">Your Programs</h2>
        </div>
        <p class="text-body section-description">Review the programs currently active for your account.</p>

        <div class="program-list-scroll" :style="isDark ? { borderColor: 'var(--color-border)' } : {}">
          <div class="program-list">
            <div
              v-for="program in activePrograms"
              :key="program.id"
              class="program-list-item"
              :style="darkRow"
            >
              <div class="program-list-main">
                <div class="program-name-col">
                  <span class="program-name" :style="isDark ? { color: '#7BA7E0' } : {}">{{ program.name }}</span>
                </div>
                <div class="program-desc" :style="isDark ? { color: 'var(--color-text-secondary)' } : {}">{{ program.description }}</div>
                <button class="view-details-link" :style="isDark ? { color: '#7BA7E0' } : {}" @click.stop="toggleExpandActive(program.id)">
                  {{ expandedActiveId === program.id ? 'Hide Details ▲' : 'View Details ▼' }}
                </button>
              </div>

              <div v-if="expandedActiveId === program.id" class="program-expanded" :style="darkPanel">
                <div class="detail-field">
                  <span class="detail-label">Program Option</span>
                  <span class="detail-value">{{ program.optionName }}</span>
                </div>

                <div
                  v-if="program.details.paragraphs?.length || program.details.bullets?.length || program.details.configItems?.length || program.details.note"
                  class="detail-field detail-field--full"
                >
                  <span class="detail-label">Program Details</span>

                  <p
                    v-for="(para, i) in program.details.paragraphs"
                    :key="'p'+i"
                    class="detail-para"
                    :style="isDark ? { color: 'var(--color-text-primary)' } : {}"
                  >{{ para }}</p>

                  <ul v-if="program.details.bullets?.length" class="detail-bullets">
                    <li
                      v-for="(bullet, i) in program.details.bullets"
                      :key="'b'+i"
                      :style="isDark ? { color: 'var(--color-text-primary)' } : {}"
                    >{{ bullet }}</li>
                  </ul>

                  <p
                    v-for="(item, i) in program.details.configItems"
                    :key="'c'+i"
                    class="detail-config-item"
                    :style="isDark ? { color: 'var(--color-text-primary)' } : {}"
                  >{{ item }}</p>

                  <p v-if="program.details.note" class="detail-note" :style="isDark ? { backgroundColor: 'rgba(44,130,203,0.12)', color: 'var(--color-text-secondary)' } : {}">
                    {{ program.details.note }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Available Programs (tile grid) ── -->
      <div v-if="availablePrograms.length > 0" class="programs-section mb-large">
        <div class="programs-section-header">
          <h2 class="text-h2 section-title">Available Programs</h2>
        </div>
        <p class="text-body section-description">Browse programs available to add for your account. Click a program to select it, then submit a request to learn more.</p>

        <div class="program-tiles">
          <div
            v-for="program in availablePrograms"
            :key="program.id"
            class="program-tile"
            :class="{
              'program-tile--selected': selectedAvailableIds.includes(program.id),
              'program-tile--pending': currentPendingIds.includes(program.id)
            }"
            :style="isDark ? {
              backgroundColor: 'var(--color-card-bg)',
              borderColor: currentPendingIds.includes(program.id)
                ? 'rgba(76, 175, 80, 0.5)'
                : selectedAvailableIds.includes(program.id) ? '#7BA7E0' : 'var(--color-border)'
            } : {}"
            @click="!currentPendingIds.includes(program.id) && toggleCart(program.id)"
            role="checkbox"
            :aria-checked="selectedAvailableIds.includes(program.id) || currentPendingIds.includes(program.id)"
            :aria-disabled="currentPendingIds.includes(program.id) || undefined"
            :tabindex="currentPendingIds.includes(program.id) ? -1 : 0"
            @keydown.space.prevent="!currentPendingIds.includes(program.id) && toggleCart(program.id)"
            @keydown.enter.prevent="!currentPendingIds.includes(program.id) && toggleCart(program.id)"
          >
            <!-- Pending "Requested" badge -->
            <div v-if="currentPendingIds.includes(program.id)" class="tile-requested-badge">
              <Check :size="12" :stroke-width="3" />
            </div>
            <!-- Selected checkmark badge -->
            <div v-else-if="selectedAvailableIds.includes(program.id)" class="tile-check-badge" :style="isDark ? { backgroundColor: '#7BA7E0', color: '#0F1117' } : {}">
              <Check :size="12" :stroke-width="3" />
            </div>

            <div class="tile-header">
              <span class="tile-name" :style="isDark ? { color: '#7BA7E0' } : {}">{{ program.name }}</span>
            </div>

            <p class="tile-description" :style="isDark ? { color: 'var(--color-text-secondary)' } : {}">{{ program.description }}</p>

            <div class="tile-footer">
              <button
                class="view-details-link"
                :style="isDark ? { color: '#7BA7E0' } : {}"
                @click.stop="openDetailModal(program)"
              >
                View Details
              </button>
              <span v-if="currentPendingIds.includes(program.id)" class="tile-requested-label">
                <Check :size="13" :stroke-width="2.5" class="tile-added-check" /> Requested
              </span>
              <span v-else-if="selectedAvailableIds.includes(program.id)" class="tile-added-label" :style="isDark ? { color: '#7BA7E0' } : {}">
                <Check :size="13" :stroke-width="2.5" class="tile-added-check" /> Added
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- All enrolled state -->
      <div v-if="activePrograms.length > 0 && availablePrograms.length === 0" class="all-enrolled-message">
        <p class="text-body">This account is enrolled in all available programs.</p>
      </div>

    </div>

    <!-- ── Cart Bar ── -->
    <Transition name="cart-slide">
      <div
        v-if="selectedAvailableIds.length > 0"
        class="cart-bar"
        :style="isDark ? { backgroundColor: '#1A2744', borderTopColor: '#2C3147' } : {}"
      >
        <div class="cart-bar-chips">
          <v-chip
            v-for="id in selectedAvailableIds"
            :key="id"
            size="small"
            variant="outlined"
            class="cart-chip"
            :style="isDark ? { borderColor: 'rgba(255,255,255,0.3)', color: '#E8EAF0' } : {}"
          >
            {{ getProgramName(id) }}
            <template #append>
              <button class="cart-chip-close" @click.stop="removeFromCart(id)" aria-label="Remove program">
                <X :size="11" :stroke-width="2.5" />
              </button>
            </template>
          </v-chip>
        </div>
        <div class="cart-bar-right">
          <span class="cart-count">{{ selectedAvailableIds.length }} {{ selectedAvailableIds.length === 1 ? 'program' : 'programs' }} selected</span>
          <button class="cart-cta-btn" @click="showConfirmModal = true">
            Request Program Information
          </button>
        </div>
      </div>
    </Transition>

    <!-- ── View Details Modal ── -->
    <v-dialog v-model="showDetailModal" max-width="640" :scrim="isDark ? 'rgba(0,0,0,0.7)' : undefined">
      <v-card v-if="detailModalProgram" :style="isDark ? { backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-primary)' } : {}">
        <v-card-title class="modal-title-row" :style="isDark ? { borderBottomColor: 'var(--color-border)' } : {}">
          <span class="modal-program-name" :style="isDark ? { color: '#7BA7E0' } : {}">{{ detailModalProgram.name }}</span>
        </v-card-title>

        <v-card-text class="modal-body" :style="isDark ? { color: 'var(--color-text-primary)' } : {}">
          <p class="text-body modal-lead" :style="isDark ? { color: 'var(--color-text-secondary)' } : {}">{{ detailModalProgram.description }}</p>

          <div class="modal-detail-content" v-if="detailModalProgram.details.paragraphs?.length || detailModalProgram.details.bullets?.length || detailModalProgram.details.configItems?.length">
            <p
              v-for="(para, i) in detailModalProgram.details.paragraphs"
              :key="'p'+i"
              class="detail-para"
              :style="isDark ? { color: 'var(--color-text-primary)' } : {}"
            >{{ para }}</p>

            <ul v-if="detailModalProgram.details.bullets?.length" class="detail-bullets">
              <li
                v-for="(bullet, i) in detailModalProgram.details.bullets"
                :key="'b'+i"
                :style="isDark ? { color: 'var(--color-text-primary)' } : {}"
              >{{ bullet }}</li>
            </ul>

            <p
              v-for="(item, i) in detailModalProgram.details.configItems"
              :key="'c'+i"
              class="detail-config-item"
              :style="isDark ? { color: 'var(--color-text-primary)' } : {}"
            >{{ item }}</p>
          </div>

          <p v-if="detailModalProgram.details.note" class="detail-note" :style="isDark ? { backgroundColor: 'rgba(44,130,203,0.12)', color: 'var(--color-text-secondary)' } : {}">
            {{ detailModalProgram.details.note }}
          </p>
        </v-card-text>

        <v-card-actions class="modal-actions" :style="isDark ? { borderTopColor: 'var(--color-border)' } : {}">
          <v-spacer />
          <button class="modal-btn modal-btn--secondary" :style="isDark ? { color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' } : {}" @click="showDetailModal = false">
            Close
          </button>
          <button
            v-if="currentPendingIds.includes(detailModalProgram.id)"
            class="modal-btn modal-btn--requested"
            disabled
          >
            <Check :size="14" :stroke-width="2.5" /> Requested
          </button>
          <button
            v-else
            class="modal-btn modal-btn--primary"
            :class="{ 'modal-btn--remove': selectedAvailableIds.includes(detailModalProgram.id) }"
            @click="addFromModal(detailModalProgram.id)"
          >
            {{ selectedAvailableIds.includes(detailModalProgram.id) ? 'Remove from Request' : '+ Add to Request' }}
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Confirm Request Modal ── -->
    <v-dialog v-model="showConfirmModal" max-width="480" :scrim="isDark ? 'rgba(0,0,0,0.7)' : undefined">
      <v-card :style="isDark ? { backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-primary)' } : {}">
        <v-card-title class="modal-title-row" :style="isDark ? { borderBottomColor: 'var(--color-border)' } : {}">
          <span :style="isDark ? { color: 'var(--color-text-primary)' } : {}">Request Program Information</span>
        </v-card-title>

        <v-card-text class="modal-body" :style="isDark ? { color: 'var(--color-text-primary)' } : {}">
          <p class="text-body" :style="isDark ? { color: 'var(--color-text-secondary)' } : {}">
            You're requesting information on the following {{ selectedAvailableIds.length === 1 ? 'program' : 'programs' }}:
          </p>
          <ul class="confirm-program-list">
            <li
              v-for="id in selectedAvailableIds"
              :key="id"
              class="confirm-program-item"
              :style="isDark ? { color: 'var(--color-text-primary)', borderLeftColor: '#7BA7E0' } : {}"
            >
              {{ getProgramName(id) }}
            </li>
          </ul>
          <p class="text-body confirm-note" :style="isDark ? { color: 'var(--color-text-secondary)' } : {}">
            A Liviniti representative will follow up with details on your selections within 2 business days.
          </p>
        </v-card-text>

        <v-card-actions class="modal-actions" :style="isDark ? { borderTopColor: 'var(--color-border)' } : {}">
          <v-spacer />
          <button class="modal-btn modal-btn--secondary" :style="isDark ? { color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' } : {}" @click="showConfirmModal = false">
            Cancel
          </button>
          <button class="modal-btn modal-btn--primary" @click="confirmRequest">
            Confirm Request
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Success Snackbar ── -->
    <v-snackbar
      v-model="showSuccessToast"
      color="success"
      :timeout="4000"
      location="bottom right"
    >
      <div class="toast-content">
        <CheckCircle :size="18" :stroke-width="2" />
        <span>Your request has been submitted. A Liviniti representative will be in touch shortly.</span>
      </div>
    </v-snackbar>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import AccountSelector from '@/components/common/AccountSelector.vue';
import { Check, CheckCircle, X } from 'lucide-vue-next';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();
const darkRow   = computed(() => isDark.value ? { backgroundColor: 'var(--color-card-bg)', borderBottomColor: 'var(--color-border)' } : {});
const darkPanel = computed(() => isDark.value ? { backgroundColor: 'var(--color-bg-surface)', borderTopColor: 'var(--color-border)' } : {});

interface Fee {
  rate: string;
  type: string;
  amount: string;
  effStartDate: string;
  effEndDate: string;
}

interface ProgramDetails {
  paragraphs?: string[];
  bullets?: string[];
  configItems?: string[];
  note: string;
}

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  optionName: string;
  invoice: boolean;
  merpAdminName: string;
  fees: Fee[];
  details: ProgramDetails;
}

interface Account {
  id: number;
  name: string;
  carrier: string;
  bin: string;
  livesCovered: number;
  startDate: string;
  endDate: string;
  status: string;
  activePrograms: string[];
}

const programs: Program[] = [
  {
    id: 'noom',
    name: 'Noom',
    category: 'Wellness',
    description: 'A clinically proven digital health program that uses psychology-based coaching and cognitive behavioral techniques to help members build lasting habits, manage weight, and improve overall wellbeing.',
    optionName: 'Noom Standard',
    invoice: true,
    merpAdminName: '—',
    fees: [
      { rate: 'Admin Fee', type: 'CLAIM', amount: '$5.00', effStartDate: '01/01/2025', effEndDate: '—' },
    ],
    details: {
      paragraphs: [
        'Noom is a digital health platform rooted in cognitive behavioral science, designed to help members understand and change the behaviors that drive unhealthy habits. Unlike traditional diet programs, Noom focuses on the psychology behind eating and lifestyle choices — giving members the tools to make sustainable changes that last.',
        'When enrolling in Noom, your account manager will work with you to configure program options for your group.',
      ],
      configItems: [
        'Coverage eligibility — All prescription plan members aged 18 and older, or prescription plan employees only',
        'Program tier selection — e.g., Noom Weight, Noom Weight + Diabetes Prevention Program, or GLP-1 Companion',
        'Whether the plan includes coverage for weight loss medications alongside the program',
        'Optional add-on: Noom Mood (mental health and stress management)',
      ],
      note: 'Please allow up to 30 days from the date of completed documentation and agreements for your program selection to take effect.',
    },
  },
  {
    id: 'sync-plus',
    name: 'Sync+',
    category: 'Wellness',
    description: 'A comprehensive diabetes management program that combines wearable device integration, real-time health data, and GLP-1 medication coverage to help members manage Type 2 diabetes and improve long-term outcomes.',
    optionName: 'Sync+ Standard',
    invoice: false,
    merpAdminName: '—',
    fees: [],
    details: {
      paragraphs: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Sync+ includes coverage for GLP-1 medications as part of the diabetes management program. This coverage is specific to members diagnosed with Type 2 diabetes and is not applicable for weight loss or obesity management outside of a diabetes diagnosis.',
      ],
      configItems: [
        'Lorem ipsum dolor sit amet — consectetur adipiscing elit, sed do eiusmod tempor',
        'GLP-1 medication coverage — Included for members with a Type 2 diabetes diagnosis; not applicable for weight management outside of a diabetes diagnosis',
        'Lorem ipsum dolor sit amet — consectetur adipiscing elit, sed do eiusmod tempor',
      ],
      note: 'Please allow up to 30 days from the date of completed documentation and agreements for your program selection to take effect.',
    },
  },
  {
    id: 'liviniti-pharmacogenomics',
    name: 'Liviniti Pharmacogenomics',
    category: 'Wellness',
    description: 'Genetic testing that analyzes how each member\'s DNA affects their response to medications, helping optimize drug therapy and reduce adverse reactions.',
    optionName: 'Liviniti Pharmacogenomics Standard',
    invoice: false,
    merpAdminName: '—',
    fees: [],
    details: {
      paragraphs: [
        'The shift to personalized medicine has been in the works for quite some time now. As medications become more complex, the prescribing method of trial and failure is no longer cost effective, especially as specialty medications begin to dominate the market for complex disease states.',
        'The Mindera Mind.Px test uses a dermal biomarker patch that takes only minutes to extract RNA allowing a genetic snapshot of the skin. This rich, patient-specific data set is then analyzed to predict the appropriate class of psoriasis biologic for an individual patient prior to therapeutic selection and treatment.',
      ],
      note: 'Please allow up to 30 days from the date of completed documentation and agreements for your program selection to take effect.',
    },
  },
  {
    id: 'liviniti-delivery',
    name: 'Liviniti Delivery on Demand',
    category: 'Savings',
    description: 'Same-day and next-day prescription delivery connecting members with local pharmacies for convenient, fast access to their medications.',
    optionName: 'Liviniti Delivery on Demand Standard',
    invoice: false,
    merpAdminName: '—',
    fees: [],
    details: {
      paragraphs: [
        'Now offering prescription delivery to your members\' doors, from their local pharmacy. Introducing Liviniti Delivery on Demand, Powered by ScriptDrop!',
      ],
      bullets: [
        'No transferring prescriptions to a new pharmacy',
        'No need to opt into mail order',
        'No worries if the pharmacy doesn\'t offer delivery',
      ],
      configItems: [
        'We have partnered with a delivery technology company to offer secure, compliant delivery to members\' homes. Liviniti Prescription Delivery on Demand powered by ScriptDrop will deliver medications to your members!',
        'ScriptDrop is a web application-based prescription service that allows patients to securely receive their medication at a location of their choice. They partner with HIPAA-compliant, background checked, and professional courier companies.',
      ],
      note: 'Please allow up to 30 days from the date of completed documentation and agreements for your program selection to take effect. Additionally, members are required to pay all member responsibility related to their prescriptions directly to the pharmacy prior to requesting delivery.',
    },
  },
];

const accountOptions = ref<Account[]>([
  { id: 1, name: 'Company A', carrier: 'Carrier A', bin: '025945', livesCovered: 1200, startDate: '09/01/2026', endDate: '12/31/2099', status: 'implementation', activePrograms: [] },
  { id: 2, name: 'Company B', carrier: 'Carrier A', bin: '025945', livesCovered: 5000, startDate: '01/01/2026', endDate: '01/01/2099', status: 'active', activePrograms: ['noom', 'liviniti-delivery'] },
  { id: 3, name: 'Company C', carrier: 'Carrier B', bin: '025945', livesCovered: 8500, startDate: '07/01/2024', endDate: '06/30/2025', status: 'active', activePrograms: ['noom', 'sync-plus', 'liviniti-pharmacogenomics', 'liviniti-delivery'] },
  { id: 4, name: 'Company D', carrier: 'Carrier C', bin: '025945', livesCovered: 3200, startDate: '01/01/2025', endDate: '12/31/2025', status: 'active', activePrograms: ['liviniti-pharmacogenomics'] },
  { id: 5, name: 'Company E', carrier: 'Carrier A', bin: '025945', livesCovered: 2800, startDate: '04/01/2024', endDate: '03/31/2025', status: 'active', activePrograms: ['noom', 'liviniti-delivery'] },
]);

const selectedAccount        = ref<number | null>(null);
const selectedAvailableIds   = ref<string[]>([]);
const expandedActiveId       = ref<string | null>(null);
const detailModalProgram     = ref<Program | null>(null);
const showDetailModal        = ref(false);
const showConfirmModal       = ref(false);
const showSuccessToast       = ref(false);
const pendingProgramIds      = ref<Record<number, string[]>>({ 2: ['liviniti-pharmacogenomics'] });

const selectedAccountData = computed<Account | null>(() =>
  accountOptions.value.find(a => a.id === selectedAccount.value) ?? null
);

const activePrograms = computed<Program[]>(() =>
  programs.filter(p => selectedAccountData.value?.activePrograms.includes(p.id))
);

const availablePrograms = computed<Program[]>(() =>
  programs.filter(p => !selectedAccountData.value?.activePrograms.includes(p.id))
);

const currentPendingIds = computed<string[]>(() =>
  selectedAccount.value !== null ? (pendingProgramIds.value[selectedAccount.value] ?? []) : []
);

watch(selectedAccount, () => {
  selectedAvailableIds.value = [];
  expandedActiveId.value = null;
  showDetailModal.value = false;
  showConfirmModal.value = false;
});

const getProgramName = (id: string): string =>
  programs.find(p => p.id === id)?.name ?? id;

const toggleExpandActive = (id: string) => {
  expandedActiveId.value = expandedActiveId.value === id ? null : id;
};

const toggleCart = (id: string) => {
  if (selectedAvailableIds.value.includes(id)) {
    selectedAvailableIds.value = selectedAvailableIds.value.filter(i => i !== id);
  } else {
    selectedAvailableIds.value = [...selectedAvailableIds.value, id];
  }
};

const removeFromCart = (id: string) => {
  selectedAvailableIds.value = selectedAvailableIds.value.filter(i => i !== id);
};

const openDetailModal = (program: Program) => {
  detailModalProgram.value = program;
  showDetailModal.value = true;
};

const addFromModal = (id: string) => {
  toggleCart(id);
  showDetailModal.value = false;
};

const confirmRequest = () => {
  const acctId = selectedAccount.value!;
  const existing = pendingProgramIds.value[acctId] ?? [];
  pendingProgramIds.value = { ...pendingProgramIds.value, [acctId]: [...existing, ...selectedAvailableIds.value] };
  showConfirmModal.value = false;
  selectedAvailableIds.value = [];
  showSuccessToast.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

// ─── Shared section layout ────────────────────────────────────────────────────
.programs-section {
  margin-bottom: $spacing-xlarge;
}

.programs-section {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: $spacing-medium;
  background-color: $color-neutral-white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.programs-section-header {
  padding-bottom: $spacing-small;
  margin-bottom: $spacing-medium;
  border-bottom: 1px solid $color-border;
}

.section-title {
  color: $color-primary;
  margin-bottom: 0;
}

.section-description {
  margin-bottom: $spacing-medium;
  color: $color-text-primary;
}

// ─── Your Programs: scrollable list ──────────────────────────────────────────
.program-list-scroll {
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  border: 1px solid $color-border;
  border-radius: 8px;
}

.program-list {
  display: flex;
  flex-direction: column;
}

.program-list-item {
  background-color: $color-neutral-white;
  border-bottom: 1px solid $color-border;
  overflow: hidden;
  transition: background-color 0.15s ease;

  &:last-child { border-bottom: none; }
}

.program-list-main {
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
  padding: $spacing-medium;
}


.program-name-col {
  display: flex;
  align-items: center;
  gap: $spacing-small;
}

.program-name {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.program-desc {
  font-size: $font-size-body;
  color: $color-text-secondary;
  line-height: 1.5;
  max-width: calc(100% - 110px);
}

.view-details-link {
  align-self: flex-end;
  background: none;
  border: none;
  color: $color-primary;
  font-size: $font-size-small;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  &:hover { text-decoration: underline; }
}

.program-expanded {
  border-top: 1px solid $color-border;
  padding: $spacing-medium;
  padding-left: calc(#{$spacing-medium} + 20px + #{$spacing-medium});
  background-color: $color-neutral-white;
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-medium;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;

  &--full {
    flex: 1 1 100%;
  }
}

.detail-label {
  font-size: $font-size-small;
  color: $color-text-secondary;
  font-weight: $font-weight-bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: $font-size-body;
  color: $color-text-primary;
}

.selected-options-list {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selected-option-item {
  font-size: $font-size-body;
  color: $color-text-primary;
  padding-left: $spacing-small;
  border-left: 2px solid $color-border;
  line-height: 1.5;
}

.fees-table {
  border: 1px solid $color-border;
  border-radius: 4px;
  font-size: $font-size-small;
  min-width: 400px;
}

// ─── Available Programs: tile grid ───────────────────────────────────────────
.program-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: $spacing-medium;
  align-items: stretch;
}

.program-tile {
  position: relative;
  background-color: $color-neutral-white;
  border: 1.5px solid $color-border;
  border-radius: 10px;
  padding: $spacing-medium;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
  outline: none;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: $color-primary;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba($color-primary, 0.25);
    border-color: $color-primary;
  }

  &--selected {
    border-color: $color-primary;
    background-color: rgba($color-primary, 0.03);
    box-shadow: 0 2px 8px rgba($color-primary, 0.12);
  }

  &--pending {
    border-color: rgba($color-success, 0.5);
    background-color: rgba($color-success, 0.02);
    cursor: default;
    pointer-events: none;

    &:hover {
      box-shadow: none;
      border-color: rgba($color-success, 0.5);
    }

    .view-details-link {
      pointer-events: auto;
    }
  }
}

// Checkmark badge (top-right corner of selected tile)
.tile-check-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: $color-primary;
  color: $color-neutral-white;
  display: flex;
  align-items: center;
  justify-content: center;
}

// "Requested" badge (top-right corner of pending tile)
.tile-requested-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: $color-success;
  color: $color-neutral-white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile-requested-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-small;
  color: $color-success;
  font-weight: $font-weight-bold;
}

.tile-header {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  flex-wrap: wrap;
  padding-right: 28px; // keep clear of check badge
}

.tile-name {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  line-height: 1.3;
}

.tile-description {
  font-size: $font-size-small;
  color: $color-text-secondary;
  line-height: 1.5;
  flex: 1;
}

.tile-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: $spacing-small;
  border-top: 1px solid $color-border;
}

.tile-added-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-small;
  color: $color-primary;
  font-weight: $font-weight-bold;
}

.tile-added-check {
  flex-shrink: 0;
}

// ─── Cart Bar (fixed bottom) ──────────────────────────────────────────────────
.cart-bar {
  position: fixed;
  bottom: 0;
  left: 120px; // sidebar width
  right: 0;
  z-index: 200;
  background-color: $color-primary-dark;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: $spacing-small $spacing-large;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-medium;
  min-height: 68px;
}

.cart-bar-chips {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.cart-chip {
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: $color-neutral-white !important;
}

.cart-chip-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  line-height: 0;

  &:hover {
    color: $color-neutral-white;
  }
}

.cart-bar-right {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  flex-shrink: 0;
}

.cart-count {
  font-size: $font-size-small;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
}

.cart-cta-btn {
  background-color: transparent;
  color: $color-neutral-white;
  border: 1px solid $color-neutral-white;
  border-radius: 100px;
  padding: 8px $spacing-medium;
  font-size: $font-size-body;
  font-weight: $font-weight-normal;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

// Cart bar slide transition
.cart-slide-enter-active,
.cart-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.cart-slide-enter-from,
.cart-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

// ─── Modal shared styles ──────────────────────────────────────────────────────
.modal-title-row {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  padding: $spacing-medium $spacing-medium $spacing-small;
  border-bottom: 1px solid $color-border;
  flex-wrap: wrap;
}

.modal-program-name {
  font-size: 1.125rem;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.modal-body {
  padding: $spacing-medium !important;
}

.modal-lead {
  color: $color-text-secondary;
  margin-bottom: $spacing-medium;
  line-height: 1.6;
}

.modal-detail-content {
  margin-top: $spacing-medium;
}

.detail-para {
  margin-bottom: $spacing-small;
  color: $color-text-primary;
  line-height: 1.6;
  font-size: $font-size-body;
}

.detail-config-item {
  margin-bottom: $spacing-small;
  color: $color-text-primary;
  line-height: 1.6;
  font-size: $font-size-small;
  padding-left: $spacing-small;
  border-left: 2px solid $color-border;
}

.detail-bullets {
  margin: $spacing-small 0 $spacing-small $spacing-medium;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    color: $color-text-primary;
    line-height: 1.5;
    font-size: $font-size-body;
  }
}

.detail-note {
  margin-top: $spacing-medium;
  padding: $spacing-small $spacing-medium;
  background-color: $color-information-background;
  border-left: 3px solid $color-link;
  border-radius: 4px;
  font-size: $font-size-small;
  color: $color-text-secondary;
  line-height: 1.5;
}

.modal-actions {
  padding: $spacing-small $spacing-medium !important;
  border-top: 1px solid $color-border;
  gap: $spacing-small;
}

.modal-btn {
  padding: 8px 20px;
  border-radius: 100px;
  font-size: $font-size-body;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &--secondary {
    background: transparent;
    border: 1px solid $color-border;
    color: $color-text-secondary;
    &:hover { background-color: rgba(0, 0, 0, 0.04); }
  }

  &--primary {
    background-color: $color-primary;
    border: 1px solid $color-primary;
    color: $color-neutral-white;
    &:hover { background-color: $color-primary-dark; border-color: $color-primary-dark; }
  }

  &--remove {
    background-color: transparent;
    border-color: $color-error;
    color: $color-error;
    &:hover { background-color: rgba($color-error, 0.06); }
  }

  &--requested {
    background-color: rgba($color-success, 0.08);
    border: 1px solid $color-success;
    color: $color-success;
    cursor: default;
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

// ─── Confirm modal program list ───────────────────────────────────────────────
.confirm-program-list {
  list-style: none;
  padding: 0;
  margin: $spacing-small 0 $spacing-medium;
  display: flex;
  flex-direction: column;
  gap: $spacing-small;
}

.confirm-program-item {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  padding: $spacing-small $spacing-medium;
  border-left: 3px solid $color-primary;
  background-color: rgba($color-primary, 0.04);
  border-radius: 0 4px 4px 0;
}

.confirm-note {
  color: $color-text-secondary;
  font-size: $font-size-small;
  line-height: 1.5;
}

// ─── Success toast ────────────────────────────────────────────────────────────
.toast-content {
  display: flex;
  align-items: center;
  gap: $spacing-small;
}

// ─── All enrolled ─────────────────────────────────────────────────────────────
.all-enrolled-message {
  text-align: center;
  padding: $spacing-large;
  color: $color-text-secondary;
}

// ─── Dark mode ────────────────────────────────────────────────────────────────
:global(html.dark) {
  .program-list-scroll {
    border-color: var(--color-border);
  }

  .program-list-item {
    background-color: var(--color-card-bg);
    border-bottom-color: var(--color-border);
  }

  .program-name { color: #7BA7E0; }
  .program-desc { color: var(--color-text-secondary); }
  .view-details-link { color: #7BA7E0; }

  .program-expanded {
    background-color: var(--color-bg-surface);
    border-top-color: var(--color-border);
  }

  .detail-value { color: var(--color-text-primary); }
  .detail-label { color: var(--color-text-secondary); }
  .selected-option-item { color: var(--color-text-primary); border-left-color: var(--color-border); }

  .detail-note {
    background-color: rgba(44, 130, 203, 0.12);
    color: var(--color-text-secondary);
  }

  .fees-table { border-color: var(--color-border); }

  .section-description { color: var(--color-text-primary); }

  // Tiles
  .program-tile {
    background-color: var(--color-card-bg);
    border-color: var(--color-border);

    &:hover { border-color: #7BA7E0; }
    &:focus-visible { box-shadow: 0 0 0 3px rgba(123, 167, 224, 0.25); border-color: #7BA7E0; }
    &--selected { border-color: #7BA7E0 !important; background-color: rgba(123, 167, 224, 0.06); }
  }

  .tile-name { color: #7BA7E0; }
  .tile-description { color: var(--color-text-secondary); }
  .tile-footer { border-top-color: var(--color-border); }
  .tile-added-label { color: #7BA7E0; }
  .tile-requested-label { color: #81C784; }
  .tile-requested-badge { background-color: #4CAF50; }

  .program-tile--pending {
    border-color: rgba(76, 175, 80, 0.4);
    background-color: rgba(76, 175, 80, 0.03);
  }

  // Modal internals
  .modal-title-row { border-bottom-color: var(--color-border); }
  .modal-program-name { color: #7BA7E0; }
  .modal-lead { color: var(--color-text-secondary); }
  .detail-para, .detail-bullets li { color: var(--color-text-primary); }
  .detail-config-item { color: var(--color-text-primary); border-left-color: var(--color-border); }
  .modal-actions { border-top-color: var(--color-border); }

  .modal-btn--secondary {
    border-color: var(--color-border);
    color: var(--color-text-secondary);
    &:hover { background-color: rgba(255,255,255,0.05); }
  }

  .confirm-program-item {
    color: #7BA7E0;
    border-left-color: #7BA7E0;
    background-color: rgba(123, 167, 224, 0.08);
  }

  .confirm-note { color: var(--color-text-secondary); }
}
</style>
