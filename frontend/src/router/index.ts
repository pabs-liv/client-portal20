
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ReportsPage from '@/views/ReportsPage.vue';
import DocumentsPage from '@/views/DocumentsPage.vue';
import HighCostClaimsPage from '@/views/HighCostClaimsPage.vue';
import PriorAuthsPage from '@/views/PriorAuthsPage.vue';
import BillingPage from '@/views/BillingPage.vue';
import PlanExplorerPage from '@/views/PlanExplorerPage.vue';
import TestResultsPage from '@/views/TestResultsPage.vue';
import AddedValuePage from '@/views/AddedValuePage.vue';
import SettingsPage from '@/views/SettingsPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage, meta: { breadcrumb: 'Home' } },
  { path: '/reports', name: 'Reports', component: ReportsPage, meta: { breadcrumb: 'Reports' } },
  { path: '/documents', name: 'Documents', component: DocumentsPage, meta: { breadcrumb: 'Documents' } },
  { path: '/high-cost-claims', name: 'Claims', component: HighCostClaimsPage, meta: { breadcrumb: 'High-Cost Claims' } },
  { path: '/prior-auths', name: 'PriorAuths', component: PriorAuthsPage, meta: { breadcrumb: 'Prior Authorizations' } },
  { path: '/billing', name: 'Billing', component: BillingPage, meta: { breadcrumb: 'Billing' } },
  { path: '/plan-explorer', name: 'PlanExplorer', component: PlanExplorerPage, meta: { breadcrumb: 'Plan Explorer' } },
  { path: '/test-results', name: 'TestResults', component: TestResultsPage, meta: { breadcrumb: 'Test Results' } },
  { path: '/added-value', name: 'AddedValue', component: AddedValuePage, meta: { breadcrumb: 'Added Value' } },
  { path: '/settings', name: 'Settings', component: SettingsPage, meta: { breadcrumb: 'Settings' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
