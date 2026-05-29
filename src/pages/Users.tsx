import React, { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, UserCheck, UserX, Clock, Eye, ToggleLeft, ToggleRight, ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard, ShieldCheck, ArrowLeftRight } from 'lucide-react';
import { User } from '../data/mockData';
import api from '../services/api';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = "'Inter', sans-serif";

const kycBadgeColors: Record<User['kycStatus'], { bg: string; color: string }> = {
  verified: { bg: '#E8F5E9', color: '#2E7D32' },
  pending: { bg: '#FFF3E0', color: '#E65100' },
  rejected: { bg: '#FFEBEE', color: '#C62828' },
  not_submitted: { bg: '#ECEFF1', color: '#546E7A' },
};

const statusBadgeColors: Record<User['status'], { bg: string; color: string }> = {
  active: { bg: '#E8F5E9', color: '#2E7D32' },
  suspended: { bg: '#FFEBEE', color: '#C62828' },
  pending: { bg: '#FFF3E0', color: '#E65100' },
};

const kycLabel: Record<User['kycStatus'], string> = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Rejected',
  not_submitted: 'Not Submitted',
};

const statusLabel: Record<User['status'], string> = {
  active: 'Active',
  suspended: 'Suspended',
  pending: 'Pending',
};

const txStatusColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: '#E8F5E9', color: '#2E7D32' },
  pending: { bg: '#FFF3E0', color: '#E65100' },
  failed: { bg: '#FFEBEE', color: '#C62828' },
  cancelled: { bg: '#ECEFF1', color: '#546E7A' },
};

const txTypeColors: Record<string, { bg: string; color: string }> = {
  send: { bg: '#E3F2FD', color: '#1565C0' },
  receive: { bg: '#E8F5E9', color: '#2E7D32' },
  exchange: { bg: '#EDE7F6', color: '#5E35B1' },
  topup: { bg: '#FFF3E0', color: '#E65100' },
  withdrawal: { bg: '#FCE4EC', color: '#AD1457' },
};

function asNumericId(id: User['id']): number | null {
  if (typeof id === 'number' && Number.isFinite(id)) return id;
  if (typeof id === 'string' && /^\d+$/.test(id)) return Number(id);
  return null;
}

function deriveStatus(u: any): User['status'] {
  if (typeof u?.is_active === 'boolean') return u.is_active ? 'active' : 'suspended';
  return 'active';
}

function deriveKyc(u: any): User['kycStatus'] {
  if (typeof u?.kyc_verified === 'boolean') return u.kyc_verified ? 'verified' : 'not_submitted';
  return 'not_submitted';
}

function sumWalletBalance(wallets: any): { balance: number; currency: string } {
  if (!Array.isArray(wallets) || wallets.length === 0) return { balance: 0, currency: 'CDF' };
  const currency = wallets[0]?.currency || 'CDF';
  const balance = wallets.reduce((s, w) => s + (Number(w?.balance) || 0), 0);
  return { balance, currency };
}

// ─── User Detail View ───
const UserDetail: React.FC<{ user: User; onBack: () => void; onUserUpdated: (u: User) => void }> = ({ user, onBack, onUserUpdated }) => {
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const role = user.role || 'user';
  const numericId = asNumericId(user.id);

  const canPersistRole = numericId != null;

  useEffect(() => {
    let canceled = false;
    (async () => {
      if (!numericId) return;
      setDetailLoading(true);
      setDetailError(null);
      const res = await api.getUser(numericId);
      if (canceled) return;
      setDetailLoading(false);
      if (!res?.success) {
        setDetailError(res?.message || 'Failed to load user detail');
        return;
      }
      setDetail(res.data);
    })();
    return () => {
      canceled = true;
    };
  }, [numericId]);

  const userTransactions = (detail?.transactions || []) as any[];
  const userKyc = detail?.kyc?.data;
  const totalSent = Number(detail?.total_sent) || 0;
  const totalReceived = Number(detail?.total_received) || 0;
  const totalFees = Number(detail?.total_fees) || 0;

  const handleToggleAgent = async () => {
    const newRole: 'user' | 'agent' = role === 'agent' ? 'user' : 'agent';
    if (!window.confirm(`Set ${user.name} to role: ${newRole}?`)) return;

    // Update UI optimistically
    onUserUpdated({ ...user, role: newRole });

    if (!canPersistRole) {
      window.alert('This user ID is not numeric (mock data). Role changed in UI only.');
      return;
    }

    const res = await api.updateUser(numericId!, { role: newRole });
    if (!res?.success) {
      window.alert(res?.message || 'Failed to update user role');
      // Revert UI if API fails
      onUserUpdated({ ...user, role });
      return;
    }
  };

  return (
    <div style={{ fontFamily: FONT, backgroundColor: BG, minHeight: '100vh', padding: 32 }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
          border: 'none', borderRadius: 8, backgroundColor: '#fff', color: NAVY,
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} /> Back to Users
      </button>

      {/* Header Card */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 28, marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, backgroundColor: NAVY,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 24, fontWeight: 700,
            }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: NAVY }}>{user.name}</h2>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{user.id}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13,
              fontWeight: 600, backgroundColor: statusBadgeColors[user.status].bg,
              color: statusBadgeColors[user.status].color,
            }}>{statusLabel[user.status]}</span>
            <span style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13,
              fontWeight: 600, backgroundColor: kycBadgeColors[user.kycStatus].bg,
              color: kycBadgeColors[user.kycStatus].color,
            }}>KYC: {kycLabel[user.kycStatus]}</span>
            <span style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13,
              fontWeight: 600, backgroundColor: role === 'agent' ? '#FFF3E0' : '#ECEFF1',
              color: role === 'agent' ? '#E65100' : '#546E7A',
              textTransform: 'capitalize',
            }}>Role: {role}</span>
            <button
              onClick={handleToggleAgent}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                backgroundColor: '#fff',
                color: NAVY,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title={canPersistRole ? '' : 'Mock user: API update disabled'}
            >
              {role === 'agent' ? <ToggleRight size={16} color={GREEN} /> : <ToggleLeft size={16} color="#9CA3AF" />}
              {role === 'agent' ? 'Agent' : 'User'}
            </button>
          </div>
        </div>
      </div>

      {detailLoading && (
        <div style={{ marginBottom: 20, color: '#6B7280' }}>Loading user details…</div>
      )}
      {detailError && (
        <div style={{ marginBottom: 20, color: '#C62828', fontWeight: 600 }}>{detailError}</div>
      )}

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        {[
          { icon: <Mail size={16} color={GREEN} />, label: 'Email', value: user.email },
          { icon: <Phone size={16} color={GREEN} />, label: 'Phone', value: user.phone },
          { icon: <MapPin size={16} color={GREEN} />, label: 'Country', value: user.countryFlag ? `${user.countryFlag} ${user.country}` : user.country },
          { icon: <CreditCard size={16} color={GREEN} />, label: 'Balance', value: `${user.balance.toLocaleString()} ${user.currency}` },
          { icon: <Calendar size={16} color={GREEN} />, label: 'Joined', value: user.createdAt },
          { icon: <Calendar size={16} color={GREEN} />, label: 'Last Login', value: user.lastLogin },
        ].map((item) => (
          <div key={item.label} style={{
            backgroundColor: '#fff', borderRadius: 12, padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {item.icon}
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {[
          { label: 'Transactions', value: userTransactions.length, bg: NAVY },
          { label: 'Total Sent', value: `${totalSent.toLocaleString()}`, bg: '#1565C0' },
          { label: 'Total Received', value: `${totalReceived.toLocaleString()}`, bg: GREEN },
          { label: 'Total Fees Paid', value: `${totalFees.toLocaleString()}`, bg: '#E65100' },
        ].map(card => (
          <div key={card.label} style={{
            backgroundColor: '#fff', borderRadius: 12, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, backgroundColor: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ArrowLeftRight size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* KYC Info */}
      {userKyc && (
        <div style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 24, marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={18} color={GREEN} /> KYC Submissions
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['ID', 'Document Type', 'Submitted', 'Status', 'Notes'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280',
                      fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: NAVY }}>{userKyc.id}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{userKyc.id_type}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{String(userKyc.submitted_at || userKyc.created_at || '').slice(0, 16)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12,
                      fontWeight: 600, textTransform: 'capitalize',
                      backgroundColor: userKyc.status === 'approved' ? '#E8F5E9' : userKyc.status === 'rejected' ? '#FFEBEE' : '#FFF3E0',
                      color: userKyc.status === 'approved' ? '#2E7D32' : userKyc.status === 'rejected' ? '#C62828' : '#E65100',
                    }}>{userKyc.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: 13 }}>{userKyc.rejection_reason || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ArrowLeftRight size={18} color={GREEN} /> Transaction History
        </h3>
        {userTransactions.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No transactions found for this user.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['ID', 'Type', 'Method', 'Amount', 'Fee', 'Recipient', 'Status', 'Date'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280',
                      fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userTransactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: NAVY, whiteSpace: 'nowrap' }}>{tx.id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12,
                        fontWeight: 600, textTransform: 'capitalize',
                        backgroundColor: txTypeColors[tx.type]?.bg || '#ECEFF1',
                        color: txTypeColors[tx.type]?.color || '#546E7A',
                      }}>{tx.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>
                      {tx.method.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap' }}>
                      {tx.amount.toLocaleString()} {tx.currency}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                      {tx.fee} {tx.currency}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                      {tx.recipientName !== '-' ? tx.recipientName : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12,
                        fontWeight: 600, textTransform: 'capitalize',
                        backgroundColor: txStatusColors[tx.status]?.bg || '#ECEFF1',
                        color: txStatusColors[tx.status]?.color || '#546E7A',
                      }}>{tx.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151', fontSize: 13, whiteSpace: 'nowrap' }}>{tx.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Users List ───
const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(false);

  useEffect(() => {
    let canceled = false;
    (async () => {
      setLoadingRemote(true);
      const res = await api.listUsers();
      if (canceled) return;
      setLoadingRemote(false);
      if (!res?.success) return;

      const rows = (res.data?.users || res.data?.data?.users || res.data?.result?.users || res.data?.users) as any[];
      if (!Array.isArray(rows) || rows.length === 0) return;

      const mapped: User[] = rows.map((u: any) => {
        const { balance, currency } = sumWalletBalance(u.wallets);
        return {
          id: u.id,
          name: u.name || '-',
          email: u.email || '-',
          phone: u.phone || '-',
          country: u.country || u.country_code || '-',
          countryFlag: '',
          status: deriveStatus(u),
          kycStatus: deriveKyc(u),
          balance,
          currency,
          createdAt: u.created_at ? String(u.created_at).slice(0, 10) : '-',
          lastLogin: '-',
          role: u.role === 'agent' ? 'agent' : 'user',
          isActive: u.is_active,
          kycVerified: u.kyc_verified,
        };
      });
      setUserList(mapped);
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const filteredUsers = userList.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUsers = userList.length;
  const activeUsers = userList.filter((u) => u.status === 'active').length;
  const suspendedUsers = userList.filter((u) => u.status === 'suspended').length;
  const pendingKyc = userList.filter((u) => u.kycStatus === 'pending' || u.kycStatus === 'not_submitted').length;

  const handleToggleStatus = (user: User) => {
    const newStatus: User['status'] = user.status === 'active' ? 'suspended' : 'active';
    setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
  };

  if (selectedUser) {
    return (
      <UserDetail
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onUserUpdated={(u) => {
          setSelectedUser(u);
          setUserList((prev) => prev.map((x) => (String(x.id) === String(u.id) ? u : x)));
        }}
      />
    );
  }

  const statCards = [
    { label: 'Total Users', value: totalUsers, icon: <UsersIcon size={22} color="#fff" />, bg: NAVY },
    { label: 'Active', value: activeUsers, icon: <UserCheck size={22} color="#fff" />, bg: GREEN },
    { label: 'Suspended', value: suspendedUsers, icon: <UserX size={22} color="#fff" />, bg: '#C62828' },
    { label: 'Pending KYC', value: pendingKyc, icon: <Clock size={22} color="#fff" />, bg: '#E65100' },
  ];

  return (
    <div style={{ fontFamily: FONT, backgroundColor: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>Users</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
          Manage all registered users{loadingRemote ? ' (loading server data...)' : ''}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder="Search by name, email, ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: FONT,
              outline: 'none',
              color: '#1F2937',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | User['status'])}
          style={{
            padding: '10px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: FONT,
            color: '#1F2937',
            backgroundColor: '#fff',
            cursor: 'pointer',
            outline: 'none',
            minWidth: 160,
          }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['ID', 'User', 'Country', 'Phone', 'Balance', 'KYC Status', 'Account Status', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: 600,
                        color: '#6B7280',
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', color: NAVY, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {user.id}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#1F2937' }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ marginRight: 6, fontSize: 16 }}>{user.countryFlag}</span>
                    <span style={{ color: '#374151' }}>{user.country}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{user.phone}</td>
                  <td style={{ padding: '14px 16px', color: '#1F2937', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {user.balance.toLocaleString()} {user.currency}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: kycBadgeColors[user.kycStatus].bg,
                        color: kycBadgeColors[user.kycStatus].color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {kycLabel[user.kycStatus]}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: statusBadgeColors[user.status].bg,
                        color: statusBadgeColors[user.status].color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {statusLabel[user.status]}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setSelectedUser(user)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '6px 12px',
                          border: `1px solid ${NAVY}`,
                          borderRadius: 6,
                          backgroundColor: 'transparent',
                          color: NAVY,
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: FONT,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 'suspended' ? 'Activate user' : 'Suspend user'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '6px 8px',
                          border: 'none',
                          borderRadius: 6,
                          backgroundColor: user.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                          color: user.status === 'active' ? '#2E7D32' : '#C62828',
                          cursor: 'pointer',
                        }}
                      >
                        {user.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
