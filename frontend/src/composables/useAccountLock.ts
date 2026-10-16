import { computed, onMounted, ref, watch } from 'vue';

export type AccountStatus = 'active' | 'implementation' | 'termed';

export interface LockableAccount {
  id: number;
  name: string;
  /** The name the same account goes by on pages that use the Stark Industries mock data set. */
  altName: string | null;
  status: AccountStatus;
}

// One master account list for the lock. Each account has a single status (as in the live app) and
// each page decides which statuses it offers. Ids 1-5 line up with the per-id mock data already on
// Home, Settings, Added Value, Documents and Plan Explorer. Company F is an invented Termed account
// so the "Account Not Available" behavior can be clicked through.
export const LOCKABLE_ACCOUNTS: LockableAccount[] = [
  { id: 1, name: 'Company A', altName: 'Stark Industries', status: 'active' },
  { id: 2, name: 'Company B', altName: 'Wayne Enterprises', status: 'active' },
  { id: 3, name: 'Company C', altName: 'Cyberdyne Systems', status: 'implementation' },
  { id: 4, name: 'Company D', altName: 'Oscorp', status: 'active' },
  { id: 5, name: 'Company E', altName: 'Tyrell Corporation', status: 'active' },
  { id: 6, name: 'Company F', altName: 'Massive Dynamic', status: 'termed' },
];

export type LockPageKey =
  | 'dashboard'
  | 'billing'
  | 'highCostClaims'
  | 'priorAuths'
  | 'testResults'
  | 'reports'
  | 'caaReports'
  | 'documents'
  | 'settings'
  | 'addedValue'
  | 'planExplorer';

// Mirrors the account statuses each page loads in Liv.ClientPortal (ACCOUNT_STATUS_IDS). Reports and
// CAA Reports take their account list from a report-specific endpoint, so they offer every status here.
const PAGE_STATUS_RULES: Record<LockPageKey, AccountStatus[]> = {
  dashboard: ['active', 'termed'],
  billing: ['active'],
  highCostClaims: ['active'],
  priorAuths: ['active'],
  testResults: ['active', 'implementation'],
  reports: ['active', 'implementation', 'termed'],
  caaReports: ['active', 'implementation', 'termed'],
  documents: ['active', 'implementation'],
  settings: ['active', 'implementation', 'termed'],
  addedValue: ['active'],
  planExplorer: ['active', 'implementation'],
};

const STORAGE_KEY = 'cp2-prototype-account-lock';

function loadStoredLock(): number | null {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    return LOCKABLE_ACCOUNTS.some((account) => account.id === stored) ? stored : null;
  } catch {
    return null;
  }
}

// Module-level state so the header and every page share the same lock.
const lockedAccountId = ref<number | null>(loadStoredLock());

const lockedAccount = computed(() => LOCKABLE_ACCOUNTS.find((account) => account.id === lockedAccountId.value) ?? null);

function lockAccount(id: number) {
  lockedAccountId.value = id;
  try {
    localStorage.setItem(STORAGE_KEY, String(id));
  } catch {
    // Storage unavailable — the lock still works for this session.
  }
}

function unlockAccount() {
  lockedAccountId.value = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — nothing to clear.
  }
}

export function isStatusAllowedOn(pageKey: LockPageKey, status: AccountStatus) {
  return PAGE_STATUS_RULES[pageKey].includes(status);
}

/** True unless the name belongs to a lockable account whose status this page does not offer. */
export function isAccountNameAllowedOn(pageKey: LockPageKey, accountName: string) {
  const account = LOCKABLE_ACCOUNTS.find((a) => a.name === accountName || a.altName === accountName);
  return !account || isStatusAllowedOn(pageKey, account.status);
}

/** The name a page knows the account by, when the page's own account names include it. */
export function resolveAccountName(account: LockableAccount, pageAccountNames: string[]) {
  return [account.name, account.altName].find((name): name is string => !!name && pageAccountNames.includes(name)) ?? null;
}

export function useAccountLock() {
  return { lockedAccountId, lockedAccount, lockAccount, unlockAccount };
}

interface LockedDefaultOptions {
  /** Whether this page's own account list contains the account (defaults to true). */
  isPresent?: (account: LockableAccount) => boolean;
  /** Sets the page's account selection/filter to the locked account. */
  apply: (account: LockableAccount) => void;
}

/**
 * Makes the locked account the page's default account: applied when the page opens and whenever the
 * lock changes while the page is open. If the page does not offer the locked account, the
 * "Account Not Available" dialog opens instead and the selection is left alone.
 */
export function useLockedAccountDefault(pageKey: LockPageKey, options: LockedDefaultOptions) {
  const isUnavailableDialogOpen = ref(false);
  const unavailableAccountName = ref('');

  function sync() {
    const account = lockedAccount.value;
    if (!account) return;

    const isAvailable = isStatusAllowedOn(pageKey, account.status) && (options.isPresent?.(account) ?? true);

    if (isAvailable) {
      options.apply(account);
    } else {
      unavailableAccountName.value = account.name;
      isUnavailableDialogOpen.value = true;
    }
  }

  onMounted(sync);

  // Unlocking (transition to null) never changes the current selection.
  watch(lockedAccountId, (newId) => {
    if (newId != null) sync();
  });

  return { isUnavailableDialogOpen, unavailableAccountName };
}
