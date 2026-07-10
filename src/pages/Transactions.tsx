import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, CheckCircle, Clock, XCircle, X, Users, ExternalLink, ReceiptText, Copy } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = "'Poppins', sans-serif";

type AdminTxn = {
  id: number;
  reference?: string;
  type?: string;
  status?: string;
  currency?: string;
  amount?: number;
  fee?: number;
  description?: string;
  created_at?: string;
  sender_id?: number;
  receiver_id?: number;
  sender_wallet_id?: number;
  receiver_wallet_id?: number;
  sender_name?: string;
  receiver_name?: string;
  counterparty_name?: string;
  display_type?: string;
  display_title?: string;
  external_ref?: string;
};

const statusBadgeColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: '#E8F5E9', color: '#2E7D32' },
  pending: { bg: '#FFF3E0', color: '#E65100' },
  failed: { bg: '#FFEBEE', color: '#C62828' },
  cancelled: { bg: '#ECEFF1', color: '#546E7A' },
};

const TransactionsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminTxn[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0 });
  const [selectedTxn, setSelectedTxn] = useState<AdminTxn | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    params.set('limit', '50');
    const res = await api.listTransactions(params.toString());
    setLoading(false);
    if (!res?.success) {
      setError(res?.message || t('transactions.failedToLoad'));
      setRows([]);
      setStats({ total: 0, completed: 0, pending: 0, failed: 0 });
      return;
    }
    const data = res.data || {};
    setRows((data.transactions || []) as AdminTxn[]);
    setStats({
      total: Number(data.total) || 0,
      completed: Number(data.completed) || 0,
      pending: Number(data.pending) || 0,
      failed: Number(data.failed) || 0,
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter]);

  const statCards = [
    { label: t('transactions.totalTx'), value: stats.total, icon: <ArrowUpDown size={22} color="#fff" />, bg: NAVY },
    { label: t('transactions.completed'), value: stats.completed, icon: <CheckCircle size={22} color="#fff" />, bg: GREEN },
    { label: t('transactions.pending'), value: stats.pending, icon: <Clock size={22} color="#fff" />, bg: '#E65100' },
    { label: t('transactions.failed'), value: stats.failed, icon: <XCircle size={22} color="#fff" />, bg: '#C62828' },
  ];

  const selectStyle: React.CSSProperties = {
    padding: '10px 16px',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: FONT,
    color: '#1F2937',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
    minWidth: 150,
  };

  const humanizeTransaction = (txn: AdminTxn) => {
    if (txn.display_title?.trim()) return txn.display_title;
    const amount = `${Number(txn.amount || 0).toLocaleString()} ${txn.currency || ''}`.trim();
    const sender = txn.sender_name?.trim();
    const receiver = txn.receiver_name?.trim();
    const counterparty = txn.counterparty_name?.trim();

    switch ((txn.display_type || txn.type || '').toLowerCase()) {
      case 'send':
        if (sender && receiver) return `${sender} sent ${amount} to ${receiver}`;
        if (counterparty) return `Sent ${amount} to ${counterparty}`;
        return `Money sent: ${amount}`;
      case 'receive':
        if (sender && receiver) return `${receiver} received ${amount} from ${sender}`;
        if (counterparty) return `Received ${amount} from ${counterparty}`;
        return `Money received: ${amount}`;
      case 'exchange':
        return `Currency exchange of ${amount}`;
      case 'topup':
        return `Airtime top-up of ${amount}`;
      case 'withdraw':
      case 'withdrawal':
        return `Wallet withdrawal of ${amount}`;
      case 'bill_payment':
        return `Bill payment of ${amount}`;
      case 'crypto_buy':
        return `Crypto purchase of ${amount}`;
      case 'crypto_sell':
        return `Crypto sale of ${amount}`;
      case 'deposit':
        return `Wallet deposit of ${amount}`;
      default:
        return txn.description?.trim() || txn.type || '-';
    }
  };

  const openUser = (id?: number) => {
    if (!id) return;
    setSelectedTxn(null);
    navigate(`/users/${id}`);
  };

  const copyReference = async (value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // No-op: clipboard access can fail on insecure contexts or older browsers.
    }
  };

  return (
    <div style={{ fontFamily: FONT, backgroundColor: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>{t('transactions.title')}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>{t('analytics.subtitle')}</p>
      </div>

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

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder={t('transactions.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') load();
            }}
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
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="all">{t('transactions.filterType')}</option>
          <option value="send">Send</option>
          <option value="receive">Receive</option>
          <option value="exchange">Exchange</option>
          <option value="topup">Top-up</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="cash_in">Cash In</option>
          <option value="cash_out">Cash Out</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">{t('transactions.filterStatus')}</option>
          <option value="completed">{t('common.completed')}</option>
          <option value="pending">{t('common.pending')}</option>
          <option value="failed">{t('common.failed')}</option>
          <option value="cancelled">{t('common.cancelled')}</option>
        </select>
        <button
          onClick={load}
          style={{
            padding: '10px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontFamily: FONT,
            fontWeight: 700,
            color: NAVY,
          }}
        >
          {t('common.refresh')}
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {(loading || error) && (
          <div style={{ padding: 14, color: error ? '#C62828' : '#6B7280', fontWeight: 600 }}>
            {error ? error : t('common.loading')}
          </div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {[t('common.id'), t('common.type'), t('common.amount'), t('transactions.columns.fee'), t('common.currency'), t('common.status'), t('transactions.columns.reference'), t('transactions.columns.description'), t('common.date')].map((h) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((txn) => (
                <tr
                  key={txn.id}
                  style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onClick={() => setSelectedTxn(txn)}
                  role="button"
                >
                  <td style={{ padding: '14px 16px', color: NAVY, fontWeight: 600, whiteSpace: 'nowrap' }}>#{txn.id}</td>
                  <td style={{ padding: '14px 16px', color: '#374151', maxWidth: 280 }}>
                    <div style={{ fontWeight: 700, color: '#1F2937' }}>{humanizeTransaction(txn)}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4, whiteSpace: 'nowrap' }}>
                      {txn.sender_name || txn.receiver_name || txn.counterparty_name || txn.type || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#1F2937', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {(txn.amount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {(txn.fee || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{txn.currency || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        backgroundColor: statusBadgeColors[txn.status || '']?.bg || '#ECEFF1',
                        color: statusBadgeColors[txn.status || '']?.color || '#546E7A',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {txn.status || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{txn.reference || '-'}</td>
                  <td style={{ padding: '14px 16px', color: '#6B7280' }}>{txn.description || '-'}</td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {String(txn.created_at || '').slice(0, 16)}
                  </td>
                </tr>
              ))}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
                    {t('transactions.noResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTxn && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.42)',
            zIndex: 1200,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedTxn(null)}
        >
          <div
            style={{
              width: 'min(520px, calc(100vw - 24px))',
              height: '100%',
              background: '#fff',
              boxShadow: '-24px 0 80px rgba(15, 23, 42, 0.22)',
              padding: 24,
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Transaction details</div>
                <h2 style={{ margin: '4px 0 0', color: NAVY, fontSize: 24, fontWeight: 800 }}>{selectedTxn.reference || `#${selectedTxn.id}`}</h2>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{ border: 'none', background: '#F3F4F6', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: 18, padding: 18, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <ReceiptText size={18} color={NAVY} />
                <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>{humanizeTransaction(selectedTxn)}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoPill label="Type" value={selectedTxn.display_type || selectedTxn.type || '-'} />
                <InfoPill label="Status" value={selectedTxn.status || '-'} />
                <InfoPill label="Amount" value={`${Number(selectedTxn.amount || 0).toLocaleString()} ${selectedTxn.currency || ''}`.trim()} />
                <InfoPill label="Fee" value={`${Number(selectedTxn.fee || 0).toLocaleString()} ${selectedTxn.currency || ''}`.trim()} />
                <InfoPill label="Sender wallet" value={selectedTxn.sender_wallet_id ? `#${selectedTxn.sender_wallet_id}` : '-'} />
                <InfoPill label="Receiver wallet" value={selectedTxn.receiver_wallet_id ? `#${selectedTxn.receiver_wallet_id}` : '-'} />
              </div>
              <div style={{ marginTop: 12 }}>
                <InfoActionPill
                  label="Reference"
                  value={selectedTxn.reference || '-'}
                  actionLabel="Copy"
                  actionIcon={<Copy size={14} />}
                  onAction={() => copyReference(selectedTxn.reference)}
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <InfoPill label="Description" value={selectedTxn.description || selectedTxn.display_title || humanizeTransaction(selectedTxn)} fullWidth />
              </div>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoPill label="Source" value={selectedTxn.display_type || selectedTxn.type || '-'} />
                <InfoPill label="External ref" value={selectedTxn.external_ref || '-'} />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: NAVY, fontWeight: 800 }}>
                <Users size={18} /> People
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <PersonCard label="Sender" name={selectedTxn.sender_name} id={selectedTxn.sender_id} onOpen={openUser} />
                <PersonCard label="Receiver" name={selectedTxn.receiver_name} id={selectedTxn.receiver_id} onOpen={openUser} />
                {selectedTxn.counterparty_name && (
                  <PersonCard label="Counterparty" name={selectedTxn.counterparty_name} id={selectedTxn.sender_id || selectedTxn.receiver_id} onOpen={openUser} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoPill: React.FC<{ label: string; value: string; fullWidth?: boolean }> = ({ label, value, fullWidth }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : undefined, padding: '12px 14px', borderRadius: 14, background: '#fff', border: '1px solid #E5E7EB' }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
    <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: '#111827' }}>{value}</div>
  </div>
);

const InfoActionPill: React.FC<{
  label: string;
  value: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction: () => void;
}> = ({ label, value, actionLabel, actionIcon, onAction }) => (
  <div style={{ padding: '12px 14px', borderRadius: 14, background: '#fff', border: '1px solid #E5E7EB' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
        <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: '#111827', wordBreak: 'break-word' }}>{value}</div>
      </div>
      <button
        onClick={onAction}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid #E5E7EB',
          background: '#F8FAFC',
          color: NAVY,
          cursor: 'pointer',
          fontFamily: FONT,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {actionIcon}
        {actionLabel}
      </button>
    </div>
  </div>
);

const PersonCard: React.FC<{
  label: string;
  name?: string;
  id?: number;
  onOpen: (id?: number) => void;
}> = ({ label, name, id, onOpen }) => (
  <button
    onClick={() => onOpen(id)}
    disabled={!id}
    style={{
      width: '100%',
      textAlign: 'left',
      padding: '14px 16px',
      borderRadius: 14,
      border: '1px solid #E5E7EB',
      background: id ? '#fff' : '#F9FAFB',
      cursor: id ? 'pointer' : 'default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      fontFamily: FONT,
    }}
  >
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: '#111827' }}>{name || 'Unknown'}</div>
    </div>
    {id ? <ExternalLink size={16} color={NAVY} /> : null}
  </button>
);

export default TransactionsPage;
