import React, { useState } from 'react';
import { FileText, Search, Filter, Shield, UserCog, Settings, ArrowLeftRight, Eye } from 'lucide-react';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const FONT = "'Inter', sans-serif";

interface AuditEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action: string;
  category: 'auth' | 'user' | 'transaction' | 'settings' | 'kyc' | 'system';
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

const auditLogs: AuditEntry[] = [
  { id: 'AUD001', timestamp: '2026-04-11 08:30:12', adminId: 'ADM001', adminName: 'Joel Wasike', action: 'Admin Login', category: 'auth', details: 'Successful login with 2FA', ipAddress: '197.243.12.45', severity: 'info' },
  { id: 'AUD002', timestamp: '2026-04-11 08:15:00', adminId: 'ADM002', adminName: 'Sarah Mutombo', action: 'User Suspended', category: 'user', details: 'Suspended USR004 (Grace Okafor) - suspicious activity', ipAddress: '41.215.67.89', severity: 'warning' },
  { id: 'AUD003', timestamp: '2026-04-10 17:45:30', adminId: 'ADM002', adminName: 'Sarah Mutombo', action: 'KYC Approved', category: 'kyc', details: 'Approved KYC for USR001 (Jean-Pierre Kabila)', ipAddress: '41.215.67.89', severity: 'info' },
  { id: 'AUD004', timestamp: '2026-04-10 16:20:10', adminId: 'ADM001', adminName: 'Joel Wasike', action: 'Exchange Rate Updated', category: 'settings', details: 'Updated USD/CDF rate from 2,700 to 2,750', ipAddress: '197.243.12.45', severity: 'info' },
  { id: 'AUD005', timestamp: '2026-04-10 14:30:00', adminId: 'ADM003', adminName: 'Pierre Lubamba', action: 'Transaction Reversed', category: 'transaction', details: 'Reversed TXN006 (25,000 NGN) - duplicate transaction', ipAddress: '105.178.23.12', severity: 'warning' },
  { id: 'AUD006', timestamp: '2026-04-10 12:00:00', adminId: 'ADM001', adminName: 'Joel Wasike', action: 'Settings Changed', category: 'settings', details: 'Updated high-value threshold from 300,000 to 500,000 CDF', ipAddress: '197.243.12.45', severity: 'info' },
  { id: 'AUD007', timestamp: '2026-04-10 09:45:00', adminId: 'SYSTEM', adminName: 'System', action: 'Failed Login Attempt', category: 'auth', details: '5 failed login attempts for admin@moneyplus.cd', ipAddress: '89.234.56.78', severity: 'critical' },
  { id: 'AUD008', timestamp: '2026-04-09 22:10:00', adminId: 'ADM004', adminName: 'Amani Kazadi', action: 'User Balance Adjusted', category: 'user', details: 'Credited 10,000 RWF to USR008 (Marie Uwimana) - support ticket #1247', ipAddress: '41.174.88.90', severity: 'warning' },
  { id: 'AUD009', timestamp: '2026-04-09 18:00:00', adminId: 'ADM001', adminName: 'Joel Wasike', action: 'Admin Account Created', category: 'system', details: 'Created admin account for Gracia Ilunga (viewer role)', ipAddress: '197.243.12.45', severity: 'info' },
  { id: 'AUD010', timestamp: '2026-04-09 15:30:00', adminId: 'ADM003', adminName: 'Pierre Lubamba', action: 'Fee Config Updated', category: 'settings', details: 'Changed Mobile Money Transfer fee from 1.5% to 1.0%', ipAddress: '105.178.23.12', severity: 'info' },
  { id: 'AUD011', timestamp: '2026-04-09 11:00:00', adminId: 'SYSTEM', adminName: 'System', action: 'Cold Wallet Sweep', category: 'system', details: 'Auto-swept 5,000 USDC from hot wallet to cold wallet', ipAddress: '-', severity: 'info' },
  { id: 'AUD012', timestamp: '2026-04-08 20:15:00', adminId: 'ADM002', adminName: 'Sarah Mutombo', action: 'KYC Rejected', category: 'kyc', details: 'Rejected KYC for USR009 (Ibrahim Toure) - expired document', ipAddress: '41.215.67.89', severity: 'info' },
];

const categoryIcons: Record<AuditEntry['category'], React.ReactNode> = {
  auth: <Shield size={14} />,
  user: <UserCog size={14} />,
  transaction: <ArrowLeftRight size={14} />,
  settings: <Settings size={14} />,
  kyc: <Eye size={14} />,
  system: <FileText size={14} />,
};

const categoryColors: Record<AuditEntry['category'], { bg: string; color: string }> = {
  auth: { bg: '#EDE7F6', color: '#5E35B1' },
  user: { bg: '#E3F2FD', color: '#1565C0' },
  transaction: { bg: '#E0F2F1', color: '#00695C' },
  settings: { bg: '#FFF3E0', color: '#E65100' },
  kyc: { bg: '#FCE4EC', color: '#AD1457' },
  system: { bg: '#ECEFF1', color: '#546E7A' },
};

const severityColors: Record<AuditEntry['severity'], { bg: string; color: string }> = {
  info: { bg: '#E3F2FD', color: '#1565C0' },
  warning: { bg: '#FFF3E0', color: '#E65100' },
  critical: { bg: '#FFEBEE', color: '#C62828' },
};

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AuditEntry['category']>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | AuditEntry['severity']>('all');

  const filtered = auditLogs.filter(log => {
    const matchSearch = searchQuery === '' ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchSearch && matchCategory && matchSeverity;
  });

  const stats = [
    { label: 'Total Entries', value: auditLogs.length, icon: <FileText size={22} color="#fff" />, bg: NAVY },
    { label: 'Today', value: auditLogs.filter(l => l.timestamp.startsWith('2026-04-11')).length, icon: <Filter size={22} color="#fff" />, bg: GREEN },
    { label: 'Warnings', value: auditLogs.filter(l => l.severity === 'warning').length, icon: <Shield size={22} color="#fff" />, bg: '#E65100' },
    { label: 'Critical', value: auditLogs.filter(l => l.severity === 'critical').length, icon: <Shield size={22} color="#fff" />, bg: '#C62828' },
  ];

  return (
    <div style={{ fontFamily: FONT, padding: 32, minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>Audit Log</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>Track all administrative actions and system events</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        {stats.map(card => (
          <div key={card.label} style={{
            backgroundColor: '#fff', borderRadius: 12, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, backgroundColor: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text" placeholder="Search actions, admins, details..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E5E7EB',
              borderRadius: 8, fontSize: 14, fontFamily: FONT, outline: 'none', color: '#1F2937',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)}
          style={{
            padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14,
            fontFamily: FONT, color: '#1F2937', backgroundColor: '#fff', cursor: 'pointer',
            outline: 'none', minWidth: 150,
          }}>
          <option value="all">All Categories</option>
          <option value="auth">Auth</option>
          <option value="user">User</option>
          <option value="transaction">Transaction</option>
          <option value="settings">Settings</option>
          <option value="kyc">KYC</option>
          <option value="system">System</option>
        </select>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as any)}
          style={{
            padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14,
            fontFamily: FONT, color: '#1F2937', backgroundColor: '#fff', cursor: 'pointer',
            outline: 'none', minWidth: 150,
          }}>
          <option value="all">All Severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Timestamp', 'Admin', 'Action', 'Category', 'Details', 'IP Address', 'Severity'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280',
                    fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', color: '#374151', fontSize: 13, whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap' }}>{log.adminName}</td>
                  <td style={{ padding: '14px 16px', color: NAVY, fontWeight: 600, whiteSpace: 'nowrap' }}>{log.action}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                      borderRadius: 20, fontSize: 12, fontWeight: 600,
                      backgroundColor: categoryColors[log.category].bg,
                      color: categoryColors[log.category].color,
                    }}>
                      {categoryIcons[log.category]}
                      {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151', fontSize: 13, maxWidth: 300 }}>{log.details}</td>
                  <td style={{ padding: '14px 16px', color: '#9CA3AF', fontSize: 13, fontFamily: 'monospace' }}>{log.ipAddress}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12,
                      fontWeight: 600, backgroundColor: severityColors[log.severity].bg,
                      color: severityColors[log.severity].color, textTransform: 'capitalize',
                    }}>{log.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
