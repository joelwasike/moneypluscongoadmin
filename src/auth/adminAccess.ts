export type AdminRole = 'super_admin' | 'finance' | 'customer_service' | 'compliance';

export type AdminPermission =
  | 'view_dashboard'
  | 'view_analytics'
  | 'view_users'
  | 'create_user'
  | 'delete_user'
  | 'view_agents'
  | 'view_agencies'
  | 'view_transactions'
  | 'view_compliance'
  | 'review_kyc'
  | 'view_wallets'
  | 'view_exchange_rates'
  | 'manage_fees'
  | 'view_countries'
  | 'manage_crypto'
  | 'view_support'
  | 'manage_help_articles'
  | 'manage_settings'
  | 'manage_admins'
  | 'view_audit_log';

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  finance: 'Finance Team',
  customer_service: 'Customer Service',
  compliance: 'Compliance Team',
};

export const ADMIN_ROLE_OPTIONS: AdminRole[] = [
  'super_admin',
  'finance',
  'customer_service',
  'compliance',
];

export const ROLE_HOME: Record<AdminRole, string> = {
  super_admin: '/dashboard',
  finance: '/dashboard/finance',
  customer_service: '/dashboard/support',
  compliance: '/dashboard/compliance',
};

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'view_dashboard',
    'view_analytics',
    'view_users',
    'create_user',
    'delete_user',
    'view_agents',
    'view_agencies',
    'view_transactions',
    'view_compliance',
    'review_kyc',
    'view_wallets',
    'view_exchange_rates',
    'manage_fees',
    'view_countries',
    'manage_crypto',
    'view_support',
    'manage_help_articles',
    'manage_settings',
    'manage_admins',
    'view_audit_log',
  ],
  finance: [
    'view_dashboard',
    'view_analytics',
    'view_users',
    'view_agents',
    'view_agencies',
    'view_transactions',
    'view_wallets',
    'view_exchange_rates',
    'manage_fees',
    'view_countries',
    'manage_crypto',
  ],
  customer_service: [
    'view_dashboard',
    'view_analytics',
    'view_users',
    'view_transactions',
    'view_compliance',
    'review_kyc',
    'view_support',
    'manage_help_articles',
  ],
  compliance: [
    'view_dashboard',
    'view_analytics',
    'view_users',
    'view_transactions',
    'view_compliance',
    'review_kyc',
    'view_audit_log',
  ],
};

export const ROLE_PAGE_ACCESS: Record<string, AdminRole[]> = {
  '/dashboard': ['super_admin'],
  '/dashboard/finance': ['finance'],
  '/dashboard/support': ['customer_service'],
  '/dashboard/compliance': ['compliance'],
  '/analytics': ['super_admin', 'finance', 'customer_service', 'compliance'],
  '/users': ['super_admin', 'finance', 'customer_service', 'compliance'],
  '/agents': ['super_admin', 'finance'],
  '/agencies': ['super_admin', 'finance'],
  '/transactions': ['super_admin', 'finance', 'customer_service', 'compliance'],
  '/compliance': ['super_admin', 'compliance'],
  '/kyc': ['super_admin', 'customer_service', 'compliance'],
  '/wallets': ['super_admin', 'finance'],
  '/chat-support': ['super_admin', 'customer_service'],
  '/help-articles': ['super_admin', 'customer_service'],
  '/exchange-rates': ['super_admin', 'finance'],
  '/fees': ['super_admin', 'finance'],
  '/countries': ['super_admin', 'finance'],
  '/crypto-settings': ['super_admin', 'finance'],
  '/settings': ['super_admin'],
  '/admin-accounts': ['super_admin'],
  '/audit-log': ['super_admin', 'compliance'],
  '/profile': ['super_admin', 'finance', 'customer_service', 'compliance'],
};

export function normalizeAdminRole(role?: string | null): AdminRole {
  if (role === 'finance' || role === 'customer_service' || role === 'compliance' || role === 'super_admin') {
    return role;
  }
  return 'super_admin';
}

export function canAccessRole(role: AdminRole, permission: AdminPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAccessPath(role: AdminRole, path: string): boolean {
  const normalized = path.split('?')[0];
  const allowed = ROLE_PAGE_ACCESS[normalized];
  if (!allowed) return true;
  return allowed.includes(role);
}

