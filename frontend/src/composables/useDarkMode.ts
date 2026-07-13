import { ref, watch } from 'vue';

const isDark = ref<boolean>(
  localStorage.getItem('darkMode') === 'true' ||
  (localStorage.getItem('darkMode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
);

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('darkMode', String(dark));
};

// Apply immediately on load
applyTheme(isDark.value);

watch(isDark, applyTheme);

export const useDarkMode = () => {
  const toggleDarkMode = () => { isDark.value = !isDark.value; };
  return { isDark, toggleDarkMode };
};
