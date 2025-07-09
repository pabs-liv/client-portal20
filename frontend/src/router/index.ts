
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ApprovalsPage from '@/views/ApprovalsPage.vue';
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
  { path: '/', name: 'Home', component: HomePage },
  { path: '/approvals', name: 'Approvals', component: ApprovalsPage },
  { path: '/reports', name: 'Reports', component: ReportsPage },
  { path: '/documents', name: 'Documents', component: DocumentsPage },
  { path: '/high-cost-claims', name: 'Claims', component: HighCostClaimsPage },
  { path: '/prior-auths', name: 'PriorAuths', component: PriorAuthsPage },
  { path: '/billing', name: 'Billing', component: BillingPage },
  { path: '/plan-explorer', name: 'PlanExplorer', component: PlanExplorerPage },
  { path: '/test-results', name: 'TestResults', component: TestResultsPage },
  { path: '/added-value', name: 'AddedValue', component: AddedValuePage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
