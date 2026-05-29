import React, { useEffect, useState } from 'react';
import { Search, ArrowUpDown, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../services/api';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = "'Inter', sans-serif";

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
};

const statusBadgeColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: '#E8F5E9', color: '#2E7D32' },
  pending: { bg: '#FFF3E0', color: '#E65100' },
  failed: { bg: '#FFEBEE', color: '#C62828' },
  cancelled: { bg: '#ECEFF1', color: '#546E7A' },
};

const TransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminTxn[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0 });

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
      setError(res?.message || 'Failed to load transactions');
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
    { label: 'Total Transactions', value: stats.total, icon: <ArrowUpDown size={22} color="#fff" />, bg: NAVY },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle size={22} color="#fff" />, bg: GREEN },
    { label: 'Pending', value: stats.pending, icon: <Clock size={22} color="#fff" />, bg: '#E65100' },
    { label: 'Failed', value: stats.failed, icon: <XCircle size={22} color="#fff" />, bg: '#C62828' },
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

  return (
    <div style={{ fontFamily: FONT, backgroundColor: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>Transactions</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>Monitor all financial activity</p>
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
            placeholder="Search by reference or description..."
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
          <option value="all">All Types</option>
          <option value="send">Send</option>
          <option value="receive">Receive</option>
          <option value="exchange">Exchange</option>
          <option value="topup">Top-up</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="cash_in">Cash In</option>
          <option value="cash_out">Cash Out</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
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
          Apply
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
            {error ? error : 'Loading…'}
          </div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['ID', 'Type', 'Amount', 'Fee', 'Currency', 'Status', 'Reference', 'Description', 'Date'].map((h) => (
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
                >
                  <td style={{ padding: '14px 16px', color: NAVY, fontWeight: 600, whiteSpace: 'nowrap' }}>#{txn.id}</td>
                  <td style={{ padding: '14px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{txn.type || '-'}</td>
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
                    No transactions found.
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

export default TransactionsPage;

