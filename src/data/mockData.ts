export interface User {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  country: string;
  countryFlag: string;
  status: 'active' | 'suspended' | 'pending';
  kycStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted';
  balance: number;
  currency: string;
  createdAt: string;
  lastLogin: string;
  role?: 'user' | 'agent';
  isActive?: boolean;
  kycVerified?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'send' | 'receive' | 'exchange' | 'topup' | 'withdrawal';
  method: 'mobile_money' | 'bank' | 'card' | 'crypto';
  amount: number;
  fee: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  recipientName: string;
  recipientCountry: string;
  createdAt: string;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  spread: number;
  lastUpdated: string;
  autoUpdate: boolean;
}

export interface FeeConfig {
  id: string;
  service: string;
  type: 'percentage' | 'flat' | 'tiered';
  value: number;
  minFee: number;
  maxFee: number;
  currency: string;
  enabled: boolean;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  dial: string;
  status: 'active' | 'disabled';
  mobileMoneyProviders: string[];
  registrationAllowed: boolean;
  sendAllowed: boolean;
}

export interface KycSubmission {
  id: string;
  userId: string;
  userName: string;
  country: string;
  documentType: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
}

// ── DUMMY DATA ──

export const users: User[] = [
  { id: 'USR001', name: 'Jean-Pierre Kabila', email: 'jp.kabila@email.com', phone: '+243 812 345 678', country: 'DR Congo', countryFlag: '🇨🇩', status: 'active', kycStatus: 'verified', balance: 25534, currency: 'CDF', createdAt: '2025-11-15', lastLogin: '2026-04-10' },
  { id: 'USR002', name: 'Amina Mwangi', email: 'amina.m@email.com', phone: '+254 722 456 789', country: 'Kenya', countryFlag: '🇰🇪', status: 'active', kycStatus: 'verified', balance: 48200, currency: 'KES', createdAt: '2025-12-03', lastLogin: '2026-04-09' },
  { id: 'USR003', name: 'Youssef Diallo', email: 'y.diallo@email.com', phone: '+221 77 234 5678', country: 'Senegal', countryFlag: '🇸🇳', status: 'active', kycStatus: 'verified', balance: 125000, currency: 'XOF', createdAt: '2026-01-10', lastLogin: '2026-04-10' },
  { id: 'USR004', name: 'Grace Okafor', email: 'grace.o@email.com', phone: '+234 803 456 7890', country: 'Nigeria', countryFlag: '🇳🇬', status: 'suspended', kycStatus: 'verified', balance: 0, currency: 'NGN', createdAt: '2025-10-22', lastLogin: '2026-03-15' },
  { id: 'USR005', name: 'Patrick Nkurunziza', email: 'pat.nk@email.com', phone: '+257 79 123 456', country: 'Burundi', countryFlag: '🇧🇮', status: 'active', kycStatus: 'pending', balance: 8500, currency: 'BIF', createdAt: '2026-03-20', lastLogin: '2026-04-08' },
  { id: 'USR006', name: 'Fatima Benali', email: 'fatima.b@email.com', phone: '+212 661 234 567', country: 'Morocco', countryFlag: '🇲🇦', status: 'active', kycStatus: 'verified', balance: 3200, currency: 'MAD', createdAt: '2026-02-14', lastLogin: '2026-04-10' },
  { id: 'USR007', name: 'Samuel Mensah', email: 'sam.mensah@email.com', phone: '+233 24 567 8901', country: 'Ghana', countryFlag: '🇬🇭', status: 'pending', kycStatus: 'not_submitted', balance: 0, currency: 'GHS', createdAt: '2026-04-09', lastLogin: '2026-04-09' },
  { id: 'USR008', name: 'Marie Uwimana', email: 'marie.u@email.com', phone: '+250 788 123 456', country: 'Rwanda', countryFlag: '🇷🇼', status: 'active', kycStatus: 'verified', balance: 45000, currency: 'RWF', createdAt: '2025-09-05', lastLogin: '2026-04-10' },
  { id: 'USR009', name: 'Ibrahim Toure', email: 'ib.toure@email.com', phone: '+225 07 89 01 2345', country: "Cote d'Ivoire", countryFlag: '🇨🇮', status: 'active', kycStatus: 'rejected', balance: 15000, currency: 'XOF', createdAt: '2026-01-28', lastLogin: '2026-04-07' },
  { id: 'USR010', name: 'Aisha Mohammed', email: 'aisha.m@email.com', phone: '+255 754 321 098', country: 'Tanzania', countryFlag: '🇹🇿', status: 'active', kycStatus: 'verified', balance: 92000, currency: 'TZS', createdAt: '2025-08-19', lastLogin: '2026-04-10' },
  { id: 'USR011', name: 'David Mulenga', email: 'd.mulenga@email.com', phone: '+260 97 654 3210', country: 'Zambia', countryFlag: '🇿🇲', status: 'active', kycStatus: 'verified', balance: 5400, currency: 'ZMW', createdAt: '2026-02-01', lastLogin: '2026-04-09' },
  { id: 'USR012', name: 'Esperance Niyonzima', email: 'esperance.n@email.com', phone: '+243 997 654 321', country: 'DR Congo', countryFlag: '🇨🇩', status: 'active', kycStatus: 'verified', balance: 180000, currency: 'CDF', createdAt: '2025-07-12', lastLogin: '2026-04-10' },
];

export const transactions: Transaction[] = [
  { id: 'TXN001', userId: 'USR001', userName: 'Jean-Pierre Kabila', type: 'send', method: 'mobile_money', amount: 5000, fee: 50, currency: 'CDF', status: 'completed', recipientName: 'Marie Lukusa', recipientCountry: 'DR Congo', createdAt: '2026-04-10 14:32' },
  { id: 'TXN002', userId: 'USR002', userName: 'Amina Mwangi', type: 'send', method: 'mobile_money', amount: 2500, fee: 25, currency: 'KES', status: 'completed', recipientName: 'John Ochieng', recipientCountry: 'Kenya', createdAt: '2026-04-10 13:15' },
  { id: 'TXN003', userId: 'USR003', userName: 'Youssef Diallo', type: 'exchange', method: 'card', amount: 50000, fee: 750, currency: 'XOF', status: 'completed', recipientName: '-', recipientCountry: '-', createdAt: '2026-04-10 12:45' },
  { id: 'TXN004', userId: 'USR001', userName: 'Jean-Pierre Kabila', type: 'send', method: 'crypto', amount: 150, fee: 0.01, currency: 'USDC', status: 'pending', recipientName: 'External Wallet', recipientCountry: '-', createdAt: '2026-04-10 11:20' },
  { id: 'TXN005', userId: 'USR010', userName: 'Aisha Mohammed', type: 'receive', method: 'bank', amount: 35000, fee: 500, currency: 'TZS', status: 'completed', recipientName: 'Aisha Mohammed', recipientCountry: 'Tanzania', createdAt: '2026-04-10 10:05' },
  { id: 'TXN006', userId: 'USR004', userName: 'Grace Okafor', type: 'send', method: 'mobile_money', amount: 25000, fee: 250, currency: 'NGN', status: 'failed', recipientName: 'Chidi Eze', recipientCountry: 'Nigeria', createdAt: '2026-04-10 09:30' },
  { id: 'TXN007', userId: 'USR008', userName: 'Marie Uwimana', type: 'topup', method: 'mobile_money', amount: 10000, fee: 0, currency: 'RWF', status: 'completed', recipientName: '-', recipientCountry: '-', createdAt: '2026-04-09 22:10' },
  { id: 'TXN008', userId: 'USR012', userName: 'Esperance Niyonzima', type: 'send', method: 'bank', amount: 75000, fee: 500, currency: 'CDF', status: 'completed', recipientName: 'Rawbank Account', recipientCountry: 'DR Congo', createdAt: '2026-04-09 18:45' },
  { id: 'TXN009', userId: 'USR006', userName: 'Fatima Benali', type: 'exchange', method: 'card', amount: 1500, fee: 22.5, currency: 'MAD', status: 'completed', recipientName: '-', recipientCountry: '-', createdAt: '2026-04-09 16:20' },
  { id: 'TXN010', userId: 'USR011', userName: 'David Mulenga', type: 'send', method: 'mobile_money', amount: 800, fee: 8, currency: 'ZMW', status: 'pending', recipientName: 'Grace Banda', recipientCountry: 'Zambia', createdAt: '2026-04-09 15:00' },
  { id: 'TXN011', userId: 'USR002', userName: 'Amina Mwangi', type: 'withdrawal', method: 'bank', amount: 15000, fee: 200, currency: 'KES', status: 'completed', recipientName: 'Equity Bank', recipientCountry: 'Kenya', createdAt: '2026-04-09 14:10' },
  { id: 'TXN012', userId: 'USR001', userName: 'Jean-Pierre Kabila', type: 'topup', method: 'mobile_money', amount: 20000, fee: 0, currency: 'CDF', status: 'completed', recipientName: '-', recipientCountry: '-', createdAt: '2026-04-09 11:30' },
  { id: 'TXN013', userId: 'USR009', userName: 'Ibrahim Toure', type: 'send', method: 'mobile_money', amount: 30000, fee: 300, currency: 'XOF', status: 'cancelled', recipientName: 'Moussa Keita', recipientCountry: 'Mali', createdAt: '2026-04-08 20:15' },
  { id: 'TXN014', userId: 'USR005', userName: 'Patrick Nkurunziza', type: 'receive', method: 'mobile_money', amount: 5000, fee: 0, currency: 'BIF', status: 'completed', recipientName: 'Patrick Nkurunziza', recipientCountry: 'Burundi', createdAt: '2026-04-08 17:40' },
  { id: 'TXN015', userId: 'USR012', userName: 'Esperance Niyonzima', type: 'send', method: 'crypto', amount: 500, fee: 0.005, currency: 'USDT', status: 'completed', recipientName: 'External Wallet', recipientCountry: '-', createdAt: '2026-04-08 14:55' },
];

export const exchangeRates: ExchangeRate[] = [
  { id: 'EXR001', fromCurrency: 'USD', toCurrency: 'CDF', rate: 2750.00, spread: 1.5, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR002', fromCurrency: 'EUR', toCurrency: 'CDF', rate: 3025.00, spread: 1.5, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR003', fromCurrency: 'GBP', toCurrency: 'CDF', rate: 3520.00, spread: 1.8, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR004', fromCurrency: 'USD', toCurrency: 'XAF', rate: 610.50, spread: 1.2, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR005', fromCurrency: 'USD', toCurrency: 'XOF', rate: 610.50, spread: 1.2, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR006', fromCurrency: 'USD', toCurrency: 'KES', rate: 129.50, spread: 1.0, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR007', fromCurrency: 'USD', toCurrency: 'NGN', rate: 1550.00, spread: 2.0, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR008', fromCurrency: 'USD', toCurrency: 'ZAR', rate: 18.35, spread: 1.0, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR009', fromCurrency: 'USD', toCurrency: 'GHS', rate: 15.80, spread: 1.5, lastUpdated: '2026-04-10 14:00', autoUpdate: false },
  { id: 'EXR010', fromCurrency: 'USD', toCurrency: 'TZS', rate: 2640.00, spread: 1.3, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR011', fromCurrency: 'USD', toCurrency: 'RWF', rate: 1380.00, spread: 1.2, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
  { id: 'EXR012', fromCurrency: 'USD', toCurrency: 'CNY', rate: 7.24, spread: 0.8, lastUpdated: '2026-04-10 14:00', autoUpdate: true },
];

export const feeConfigs: FeeConfig[] = [
  { id: 'FEE001', service: 'Mobile Money Transfer', type: 'percentage', value: 1.0, minFee: 50, maxFee: 5000, currency: 'CDF', enabled: true },
  { id: 'FEE002', service: 'Card Transfer', type: 'percentage', value: 1.5, minFee: 100, maxFee: 10000, currency: 'CDF', enabled: true },
  { id: 'FEE003', service: 'Bank Transfer', type: 'flat', value: 500, minFee: 500, maxFee: 500, currency: 'CDF', enabled: true },
  { id: 'FEE004', service: 'Currency Exchange', type: 'percentage', value: 1.5, minFee: 100, maxFee: 25000, currency: 'CDF', enabled: true },
  { id: 'FEE005', service: 'Crypto Transfer (SOL)', type: 'flat', value: 0.000005, minFee: 0, maxFee: 0.01, currency: 'SOL', enabled: true },
  { id: 'FEE006', service: 'Crypto Transfer (USDC)', type: 'percentage', value: 0.5, minFee: 0.01, maxFee: 50, currency: 'USDC', enabled: true },
  { id: 'FEE007', service: 'Mobile Top-up', type: 'percentage', value: 2.0, minFee: 50, maxFee: 2000, currency: 'CDF', enabled: true },
  { id: 'FEE008', service: 'International Transfer', type: 'percentage', value: 3.0, minFee: 500, maxFee: 50000, currency: 'CDF', enabled: true },
  { id: 'FEE009', service: 'ATM Withdrawal', type: 'flat', value: 1000, minFee: 1000, maxFee: 1000, currency: 'CDF', enabled: false },
  { id: 'FEE010', service: 'Virtual Card Issuance', type: 'flat', value: 2500, minFee: 2500, maxFee: 2500, currency: 'CDF', enabled: true },
];

export const countries: Country[] = [
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩', dial: '+243', status: 'active', mobileMoneyProviders: ['M-Pesa', 'Airtel Money', 'Orange Money', 'Africell Money'], registrationAllowed: true, sendAllowed: true },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dial: '+254', status: 'active', mobileMoneyProviders: ['M-Pesa', 'Airtel Money'], registrationAllowed: true, sendAllowed: true },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dial: '+255', status: 'active', mobileMoneyProviders: ['M-Pesa', 'Tigo Pesa', 'Airtel Money'], registrationAllowed: true, sendAllowed: true },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dial: '+256', status: 'active', mobileMoneyProviders: ['MTN Mobile Money', 'Airtel Money'], registrationAllowed: true, sendAllowed: true },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dial: '+250', status: 'active', mobileMoneyProviders: ['MTN Mobile Money', 'Airtel Money'], registrationAllowed: true, sendAllowed: true },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dial: '+234', status: 'active', mobileMoneyProviders: ['OPay', 'PalmPay', 'Paga'], registrationAllowed: true, sendAllowed: true },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dial: '+233', status: 'active', mobileMoneyProviders: ['MTN Mobile Money', 'Vodafone Cash'], registrationAllowed: true, sendAllowed: true },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dial: '+27', status: 'active', mobileMoneyProviders: ['Vodapay', 'FNB eWallet'], registrationAllowed: true, sendAllowed: true },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dial: '+237', status: 'active', mobileMoneyProviders: ['MTN Mobile Money', 'Orange Money'], registrationAllowed: true, sendAllowed: true },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dial: '+221', status: 'active', mobileMoneyProviders: ['Orange Money', 'Wave'], registrationAllowed: true, sendAllowed: true },
  { code: 'CI', name: "Cote d'Ivoire", flag: '🇨🇮', dial: '+225', status: 'active', mobileMoneyProviders: ['MTN Mobile Money', 'Orange Money', 'Wave'], registrationAllowed: true, sendAllowed: true },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dial: '+251', status: 'active', mobileMoneyProviders: ['Telebirr', 'M-Birr'], registrationAllowed: true, sendAllowed: true },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dial: '+20', status: 'active', mobileMoneyProviders: ['Vodafone Cash', 'Fawry'], registrationAllowed: true, sendAllowed: true },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dial: '+212', status: 'active', mobileMoneyProviders: ['Inwi Money', 'Orange Money'], registrationAllowed: true, sendAllowed: true },
  { code: 'CN', name: 'China', flag: '🇨🇳', dial: '+86', status: 'active', mobileMoneyProviders: ['Alipay', 'WeChat Pay'], registrationAllowed: false, sendAllowed: true },
  { code: 'IN', name: 'India', flag: '🇮🇳', dial: '+91', status: 'active', mobileMoneyProviders: ['UPI', 'Paytm', 'PhonePe'], registrationAllowed: false, sendAllowed: true },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dial: '+55', status: 'disabled', mobileMoneyProviders: ['Pix', 'PicPay'], registrationAllowed: false, sendAllowed: false },
];

export const kycSubmissions: KycSubmission[] = [
  { id: 'KYC001', userId: 'USR005', userName: 'Patrick Nkurunziza', country: 'Burundi', documentType: 'National ID', submittedAt: '2026-04-08 10:30', status: 'pending', notes: '' },
  { id: 'KYC002', userId: 'USR007', userName: 'Samuel Mensah', country: 'Ghana', documentType: 'Passport', submittedAt: '2026-04-09 09:15', status: 'pending', notes: '' },
  { id: 'KYC003', userId: 'USR009', userName: 'Ibrahim Toure', country: "Cote d'Ivoire", documentType: 'National ID', submittedAt: '2026-03-25 14:00', status: 'rejected', notes: 'Document expired. Please resubmit with valid ID.' },
  { id: 'KYC004', userId: 'USR001', userName: 'Jean-Pierre Kabila', country: 'DR Congo', documentType: 'Passport', submittedAt: '2025-11-16 11:00', status: 'approved', notes: 'All documents valid.' },
  { id: 'KYC005', userId: 'USR002', userName: 'Amina Mwangi', country: 'Kenya', documentType: "Driver's License", submittedAt: '2025-12-04 08:45', status: 'approved', notes: 'Verified successfully.' },
];

export const adminNotifications: AdminNotification[] = [
  { id: 'NOT001', title: 'High-value transaction flagged', message: 'Transaction TXN008 of 75,000 CDF requires manual review.', type: 'warning', createdAt: '2026-04-10 14:35', read: false },
  { id: 'NOT002', title: 'New KYC submission', message: 'Samuel Mensah (USR007) submitted KYC documents for review.', type: 'info', createdAt: '2026-04-09 09:15', read: false },
  { id: 'NOT003', title: 'Failed transaction spike', message: '3 failed transactions in the last hour from Nigeria region.', type: 'error', createdAt: '2026-04-10 09:45', read: true },
  { id: 'NOT004', title: 'Exchange rate updated', message: 'USD/CDF rate updated to 2,750.00 from external feed.', type: 'success', createdAt: '2026-04-10 14:00', read: true },
  { id: 'NOT005', title: 'User account suspended', message: 'Grace Okafor (USR004) suspended due to suspicious activity.', type: 'warning', createdAt: '2026-03-15 16:20', read: true },
];

export const dashboardStats = {
  totalUsers: 12,
  activeUsers: 9,
  totalTransactions: 15,
  totalVolume: 2845000,
  totalFees: 12850,
  pendingKyc: 2,
  monthlyGrowth: 18.5,
  dailyTransactions: [
    { date: 'Apr 4', count: 42, volume: 180000 },
    { date: 'Apr 5', count: 38, volume: 165000 },
    { date: 'Apr 6', count: 55, volume: 230000 },
    { date: 'Apr 7', count: 48, volume: 195000 },
    { date: 'Apr 8', count: 62, volume: 280000 },
    { date: 'Apr 9', count: 71, volume: 320000 },
    { date: 'Apr 10', count: 58, volume: 275000 },
  ],
  transactionsByMethod: [
    { name: 'Mobile Money', value: 45 },
    { name: 'Bank', value: 25 },
    { name: 'Card', value: 18 },
    { name: 'Crypto', value: 12 },
  ],
  transactionsByCountry: [
    { country: 'DR Congo', flag: '🇨🇩', volume: 850000, count: 156 },
    { country: 'Kenya', flag: '🇰🇪', volume: 620000, count: 134 },
    { country: 'Nigeria', flag: '🇳🇬', volume: 480000, count: 98 },
    { country: 'Tanzania', flag: '🇹🇿', volume: 350000, count: 87 },
    { country: 'Senegal', flag: '🇸🇳', volume: 290000, count: 72 },
  ],
  revenueByMonth: [
    { month: 'Nov', revenue: 45000 },
    { month: 'Dec', revenue: 62000 },
    { month: 'Jan', revenue: 78000 },
    { month: 'Feb', revenue: 85000 },
    { month: 'Mar', revenue: 110000 },
    { month: 'Apr', revenue: 125000 },
  ],
};
