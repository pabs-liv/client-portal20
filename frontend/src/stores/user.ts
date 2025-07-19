import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const userType = ref<'internal' | 'external'>('external');

  function setUserType(type: 'internal' | 'external') {
    userType.value = type;
  }

  return { userType, setUserType };
});
