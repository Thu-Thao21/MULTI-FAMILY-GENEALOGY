/**
 * Centralized Route Constants & Host Configuration for Frontend
 */

export const API_HOST_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api',
  AUTH: '/auth',
  USERS: '/users',
  FAMILIES: '/families',
  MEMBERS: '/members',
  NETWORKS: '/networks',
  APPROVALS: '/change-requests',
  AUDIT_LOGS: '/audit-logs',
  BACKUP: '/backup',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  USER: {
    ROOT: '/user',
    DASHBOARD: '/user/dashboard',
    TREE: '/user/tree',
    TREE_VERTICAL: '/user/tree/vertical',
    TREE_HORIZONTAL: '/user/tree/horizontal',
    TREE_FOCUS: '/user/tree/focus',
    NETWORK: '/user/network',
    NETWORK_NOI: '/user/network/noi',
    NETWORK_NGOAI: '/user/network/ngoai',
    NETWORK_DAU_RE: '/user/network/dau-re',
    NETWORK_THONG_GIA: '/user/network/thong-gia',
    MEMBERS: '/user/members',
    MEMBER_PROFILE: '/user/members/profile',
    RELATIONSHIP: '/user/relationship',
    ANNIVERSARIES: '/user/anniversaries',
    REPORTS: '/user/reports',
    PROPOSALS: '/user/proposals',
    // Family Management (For owners)
    FAMILY_MANAGEMENT: '/user/family-management',
    FAMILY_BRANCHES: '/user/family-management/branches',
    FAMILY_APPROVALS: '/user/family-management/approvals',
    FAMILY_IMPORT_EXPORT: '/user/family-management/import-export',
    FAMILY_LOGS: '/user/family-management/logs',
    MY_PROFILE: '/user/my-profile',
    SETTINGS: '/user/settings',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    BUSINESS_REQUESTS: '/admin/business-requests',
    BUSINESSES: '/admin/businesses',
    PLANS: '/admin/plans',
    PAYMENTS: '/admin/payments',
    ACCOUNTS: '/admin/accounts',
    USERS: '/admin/users',
    MANAGER_TRANSFER: '/admin/manager-transfer',
    REPORTS: '/admin/reports',
    SECURITY_LOGS: '/admin/security-logs',
    AUDIT_LOGS: '/admin/audit-logs',
    BACKUP: '/admin/backup',
    SUPPORT_ACCESS: '/admin/support-access',
    SECURITY: '/admin/security',
    MY_PROFILE: '/admin/my-profile',
    SETTINGS: '/admin/settings',
    // Backwards compatibility
    FAMILIES: '/admin/families',
    MEMBERS: '/admin/members',
    FAMILY_LINKS: '/admin/family-links',
    APPROVALS: '/admin/approvals',
  },
};

export default ROUTES;
