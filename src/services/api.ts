function normalizeBaseUrl(raw: string): string {
  let url = raw.trim();
  url = url.replace(/\/+$/, '');
  url = url.replace(/\/dashboard$/, '');
  return url;
}

// Keep in sync with Flutter app default API base:
// lib/services/api_service.dart -> https://moneyplusapi.theliberec.com/api/v1
const BASE_URL = normalizeBaseUrl('https://moneyplusapi.theliberec.com/api/v1/admin');

function getToken(): string | null {
  return localStorage.getItem('moneyplus_token');
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request(method: string, path: string, body?: any) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    return json;
  } catch (e: any) {
    return { success: false, message: 'Connection error: ' + e.message };
  }
}

const api = {
  // Auth
  login: (email: string, password: string) => request('POST', '/login', { email, password }),
  seed: () => request('POST', '/seed'),

  // Dashboard
  dashboard: () => request('GET', '/dashboard'),

  // Users
  listUsers: (params = '') => request('GET', `/users${params ? '?' + params : ''}`),
  getUser: (id: number) => request('GET', `/users/${id}`),
  updateUser: (id: number, data: any) => request('PUT', `/users/${id}`, data),

  // Agents
  listAgents: () => request('GET', '/agents'),
  getAgent: (id: number) => request('GET', `/agents/${id}`),

  // KYC
  listKYC: (status = '') => request('GET', `/kyc${status ? '?status=' + status : ''}`),
  reviewKYC: (id: number, status: string, reason = '') => request('PUT', `/kyc/${id}`, { status, reason }),

  // Transactions
  listTransactions: (params = '') => request('GET', `/transactions${params ? '?' + params : ''}`),

  // Cards
  listCards: () => request('GET', '/cards'),

  // Wallets
  listWallets: () => request('GET', '/wallets'),

  // Splits
  listSplits: () => request('GET', '/splits'),

  // Chat
  listChatThreads: () => request('GET', '/chat/threads'),
  getChatThread: (userId: number) => request('GET', `/chat/${userId}`),
  replyChat: (userId: number, message: string) => request('POST', `/chat/${userId}`, { message }),

  // Help Articles
  listHelpArticles: () => request('GET', '/help-articles'),
  createHelpArticle: (data: any) => request('POST', '/help-articles', data),
  updateHelpArticle: (id: number, data: any) => request('PUT', `/help-articles/${id}`, data),
  deleteHelpArticle: (id: number) => request('DELETE', `/help-articles/${id}`),

  // Admin Accounts
  listAdmins: () => request('GET', '/admins'),
  createAdmin: (data: any) => request('POST', '/admins', data),
  toggleAdmin: (id: number) => request('PUT', `/admins/${id}/toggle`),

  // Audit Logs
  listAuditLogs: (params = '') => request('GET', `/audit-logs${params ? '?' + params : ''}`),

  // Notifications
  listNotifications: () => request('GET', '/notifications'),

  // Crypto Holdings
  listCryptoHoldings: () => request('GET', '/crypto-holdings'),
};

export default api;
