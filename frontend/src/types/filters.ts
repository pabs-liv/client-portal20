export type FilterGroup = {
  type: string;
  label: string;
  multiselect: boolean;
  options: { text: string; value: unknown; active: boolean }[];
  modelValue: unknown;
};
