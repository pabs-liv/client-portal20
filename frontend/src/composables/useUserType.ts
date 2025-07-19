import { computed } from 'vue';
import { useUserStore } from '../stores/user';

export function useUserType() {
  const userStore = useUserStore();

  const userType = computed(() => userStore.userType);
  const isInternal = computed(() => userStore.userType === 'internal');
  const isExternal = computed(() => userStore.userType === 'external');

  return { userType, isInternal, isExternal, setUserType: userStore.setUserType };
}
