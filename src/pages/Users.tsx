import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Search,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Clock,
  Eye,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  ArrowLeftRight,
  Plus,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { User } from '../data/mockData';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../App';
import { canAccessRole } from '../auth/adminAccess';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = "'Poppins', sans-serif";
const DOC_BASE = 'https://moneyplusapi.theliberec.com';

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

function formatTxMethod(method: unknown): string {
  if (typeof method !== 'string' || method.trim() === '') return '-';
  return method
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

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

function docSrc(url?: string): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${DOC_BASE}${url}`;
}

const DocImage: React.FC<{ url?: string; label: string }> = ({ url, label }) => {
  const [errored, setErrored] = useState(false);
  const src = docSrc(url);
  if (!src) {
    return (
      <div style={{
        minHeight: 160, borderRadius: 12, border: '1px dashed #D1D5DB', background: '#F9FAFB',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13,
      }}>
        No {label.toLowerCase()} uploaded
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #E5E7EB', fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      {!errored ? (
        <a href={src} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
          <img
            src={src}
            alt={label}
            onError={() => setErrored(true)}
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', background: '#F9FAFB' }}
          />
        </a>
      ) : (
        <a href={src} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180, color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>
          View document
        </a>
      )}
    </div>
  );
};

type CreateUserForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  country_code: string;
  avatar_url: string;
};

const CreateUserModal: React.FC<{
  onClose: () => void;
  onCreate: (user: CreateUserForm) => void;
}> = ({ onClose, onCreate }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    country: 'DR Congo',
    country_code: '+243',
    avatar_url: '',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E5E7EB',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: FONT,
    outline: 'none',
    color: '#1F2937',
    boxSizing: 'border-box',
  };

  const canSubmit = form.name.trim() && form.email.trim() && form.phone.trim() && form.password.trim() && form.country.trim();

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ width: 560, maxWidth: 'calc(100vw - 24px)', background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: NAVY }}>{t('users.addUser')}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>{t('users.addUserDesc')}</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <ArrowLeft size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>{t('users.detail.fullName')}</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>{t('users.detail.email')}</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>{t('users.detail.phone')}</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>{t('users.detail.country')}</label>
            <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>{t('users.countryCode')}</label>
            <input value={form.country_code} onChange={e => setForm({ ...form, country_code: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>{t('users.password')}</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>{t('users.avatarUrl')}</label>
            <input value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} style={inputStyle} placeholder="https://..." />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 22 }}>
          <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 14, fontWeight: 700, fontFamily: FONT, cursor: 'pointer' }}>
            {t('common.cancel')}
          </button>
          <button
            onClick={() => canSubmit && onCreate(form)}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              background: NAVY,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> {t('users.addUser')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── User Detail View ───
const UserDetail: React.FC<{ user: User; onBack: () => void; onUserUpdated: (u: User) => void; onDelete: (id: User['id']) => void }> = ({ user, onBack, onUserUpdated, onDelete }) => {
  const { t } = useLanguage();
  const { role: adminRole } = useAuth();
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const kycLabel: Record<User['kycStatus'], string> = {
    verified: t('users.kycStatus.verified'),
    pending: t('users.kycStatus.pending'),
    rejected: t('users.kycStatus.rejected'),
    not_submitted: t('users.kycStatus.not_submitted'),
  };

  const statusLabel: Record<User['status'], string> = {
    active: t('users.userStatus.active'),
    suspended: t('users.userStatus.suspended'),
    pending: t('users.userStatus.pending'),
  };

  const userRole = user.role || 'user';
  const canDeleteUser = canAccessRole(adminRole, 'delete_user');
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
    const newRole: 'user' | 'agent' = userRole === 'agent' ? 'user' : 'agent';
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
      onUserUpdated({ ...user, role: userRole });
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
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      {/* Header Card */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 28, marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                style={{ width: 72, height: 72, borderRadius: 20, objectFit: 'cover', border: '1px solid #E5E7EB' }}
              />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: 20, backgroundColor: NAVY,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 24, fontWeight: 700,
              }}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
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
              fontWeight: 600, backgroundColor: userRole === 'agent' ? '#FFF3E0' : '#ECEFF1',
              color: userRole === 'agent' ? '#E65100' : '#546E7A',
              textTransform: 'capitalize',
            }}>Role: {userRole}</span>
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
              {userRole === 'agent' ? <ToggleRight size={16} color={GREEN} /> : <ToggleLeft size={16} color="#9CA3AF" />}
              {userRole === 'agent' ? t('common.agent') : 'User'}
            </button>
            {canDeleteUser && (
              <button
                onClick={() => {
                  if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
                  onDelete(user.id);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #FECACA',
                  backgroundColor: '#FFF5F5',
                  color: '#C62828',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={16} /> {t('common.delete')}
              </button>
            )}
          </div>
        </div>
      </div>

      {detailLoading && (
        <div style={{ marginBottom: 20, color: '#6B7280' }}>{t('common.loading')}</div>
      )}
      {detailError && (
        <div style={{ marginBottom: 20, color: '#C62828', fontWeight: 600 }}>{detailError}</div>
      )}

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        {[
          { icon: <Mail size={16} color={GREEN} />, label: t('users.detail.email') || 'Email', value: user.email },
          { icon: <Phone size={16} color={GREEN} />, label: t('users.detail.phone') || 'Phone', value: user.phone },
          { icon: <MapPin size={16} color={GREEN} />, label: t('users.detail.country') || 'Country', value: user.countryFlag ? `${user.countryFlag} ${user.country}` : user.country },
          { icon: <CreditCard size={16} color={GREEN} />, label: t('users.detail.walletBalance') || 'Balance', value: `${user.balance.toLocaleString()} ${user.currency}` },
          { icon: <Calendar size={16} color={GREEN} />, label: t('users.detail.joined') || 'Joined', value: user.createdAt },
          { icon: <Calendar size={16} color={GREEN} />, label: t('users.detail.kycStatus') || 'Last Login', value: user.lastLogin },
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
          { label: t('users.detail.transactions'), value: userTransactions.length, bg: NAVY },
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
            <ShieldCheck size={18} color={GREEN} /> {t('users.detail.kycDetails')}
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
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, color: NAVY, fontWeight: 800 }}>
              <ImageIcon size={18} color={GREEN} /> {t('users.kycPhotos')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
              <DocImage url={userKyc.selfie_url} label={t('kyc.detail.selfie')} />
              <DocImage url={userKyc.id_document_front_url || userKyc.id_document_url} label={t('kyc.detail.idDocument')} />
              <DocImage url={userKyc.id_document_back_url} label={t('users.kycBack')} />
              <DocImage url={userKyc.proof_of_address_url} label={t('kyc.detail.proofOfAddress')} />
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ArrowLeftRight size={18} color={GREEN} /> {t('users.detail.transactions')}
        </h3>
        {userTransactions.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>{t('users.detail.noTransactions')}</div>
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
                      {formatTxMethod(tx.method)}
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
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id: userIdParam } = useParams();
  const { role: adminRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const kycLabel: Record<User['kycStatus'], string> = {
    verified: t('users.kycStatus.verified'),
    pending: t('users.kycStatus.pending'),
    rejected: t('users.kycStatus.rejected'),
    not_submitted: t('users.kycStatus.not_submitted'),
  };

  const statusLabel: Record<User['status'], string> = {
    active: t('users.userStatus.active'),
    suspended: t('users.userStatus.suspended'),
    pending: t('users.userStatus.pending'),
  };
  const canManageUsers = canAccessRole(adminRole, 'create_user');

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

      const mapped: User[] = rows.map((u: any) => mapUser(u));
      setUserList(mapped);
    })();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    const loadUserById = async () => {
      if (!userIdParam) {
        setSelectedUser(null);
        return;
      }
      const numericId = Number(userIdParam);
      if (!Number.isFinite(numericId)) return;
      const found = userList.find((u) => String(u.id) === userIdParam);
      if (found) {
        setSelectedUser(found);
      }
      const res = await api.getUser(numericId);
      if (canceled) return;
      if (!res?.success) return;
      const raw = res.data?.user || res.data || {};
      setSelectedUser(mapUser(raw));
    };
    loadUserById();
    return () => {
      canceled = true;
    };
  }, [userIdParam, userList]);

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

  const mapUser = (u: any): User => {
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
      avatar_url: u.avatar_url,
    } as User;
  };

  const handleCreateUser = async (form: CreateUserForm) => {
    const res = await api.createUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      country: form.country,
      country_code: form.country_code,
      avatar_url: form.avatar_url,
    });
    if (!res?.success) {
      window.alert(res?.message || 'Failed to create user');
      return;
    }

    const created = mapUser(res.data?.user || res.data || {});
    setUserList(prev => [created, ...prev]);
    setShowCreateModal(false);
  };

  const handleDeleteUser = async (id: User['id']) => {
    const numericId = typeof id === 'number' ? id : Number(id);
    if (!Number.isFinite(numericId)) {
      window.alert('This user ID cannot be deleted from the API.');
      return;
    }
    const res = await api.deleteUser(numericId);
    if (!res?.success) {
      window.alert(res?.message || 'Failed to delete user');
      return;
    }
    setUserList(prev => prev.filter(u => String(u.id) !== String(id)));
    setSelectedUser(prev => (prev && String(prev.id) === String(id) ? null : prev));
  };

  if (selectedUser) {
    return (
      <UserDetail
        user={selectedUser}
        onBack={() => navigate('/users')}
        onUserUpdated={(u) => {
          setSelectedUser(u);
          setUserList((prev) => prev.map((x) => (String(x.id) === String(u.id) ? u : x)));
        }}
        onDelete={handleDeleteUser}
      />
    );
  }

  const statCards = [
    { label: t('users.totalUsers'), value: totalUsers, icon: <UsersIcon size={22} color="#fff" />, bg: NAVY },
    { label: t('users.activeUsers'), value: activeUsers, icon: <UserCheck size={22} color="#fff" />, bg: GREEN },
    { label: t('users.suspended'), value: suspendedUsers, icon: <UserX size={22} color="#fff" />, bg: '#C62828' },
    { label: t('users.pendingKyc'), value: pendingKyc, icon: <Clock size={22} color="#fff" />, bg: '#E65100' },
  ];

  return (
    <div style={{ fontFamily: FONT, backgroundColor: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>{t('users.title')}</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
            Manage all registered users{loadingRemote ? ` (${t('common.loading')})` : ''}
          </p>
        </div>
        {canManageUsers && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: NAVY,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> {t('users.addUser')}
          </button>
        )}
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
            placeholder={t('users.searchPlaceholder')}
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
          <option value="active">{t('users.userStatus.active')}</option>
          <option value="suspended">{t('users.userStatus.suspended')}</option>
          <option value="pending">{t('users.userStatus.pending')}</option>
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
                {[
                  'ID',
                  t('users.columns.user'),
                  t('users.columns.country'),
                  t('users.columns.phone'),
                  t('users.columns.walletBalance'),
                  t('users.columns.kyc'),
                  t('users.columns.status'),
                  t('users.columns.actions'),
                ].map(
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
                  onClick={() => navigate(`/users/${user.id}`)}
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
                        onClick={() => navigate(`/users/${user.id}`)}
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
                        {t('common.view')}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 'suspended' ? t('users.detail.activate') : t('users.detail.suspend')}
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
                    {t('users.noUsers')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateUser}
        />
      )}
    </div>
  );
};

export default UsersPage;
