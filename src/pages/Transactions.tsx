import React, { useState } from 'react';
import { Search, ArrowUpDown, CheckCircle, Clock, XCircle } from 'lucide-react';
import { transactions, Transaction } from '../data/mockData';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = "'Inter', sans-serif";

const typeBadgeColors: Record<Transaction['type'], { bg: string; color: string }> = {
  send: { bg: '#E3F2FD', color: '#1565C0' },
  receive: { bg: '#E8F5E9', color: '#2E7D32' },
  exchange: { bg: '#F3E5F5', color: '#7B1FA2' },
  topup: { bg: '#E0F2F1', color: '#00796B' },
  withdrawal: { bg: '#FFF3E0', color: '#E65100' },
};

const typeLabel: Record<Transaction['type'], string> = {
  send: 'Send',
  receive: 'Receive',
  exchange: 'Exchange',
  topup: 'Top-up',
  withdrawal: 'Withdrawal',
};

const statusBadgeColors: Record<Transaction['status'], { bg: string; color: string }> = {
  completed: { bg: '#E8F5E9', color: '#2E7D32' },
  pending: { bg: '#FFF3E0', color: '#E65100' },
  failed: { bg: '#FFEBEE', color: '#C62828' },
  cancelled: { bg: '#ECEFF1', color: '#546E7A' },
};

const statusLabel: Record<Transaction['status'], string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

const methodLabel: Record<Transaction['method'], string> = {
  mobile_money: 'Mobile Money',
  bank: 'Bank',
  card: 'Card',
  crypto: 'Crypto',
};

const TransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Transaction['type']>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | Transaction['method']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Transaction['status']>('all');

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      searchQuery === '' ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    const matchesMethod = methodFilter === 'all' || txn.method === methodFilter;
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    return matchesSearch && matchesType && matchesMethod && matchesStatus;
  });

  const totalTxns = transactions.length;
  const completedTxns = transactions.filter((t) => t.status === 'completed').length;
  const pendingTxns = transactions.filter((t) => t.status === 'pending').length;
  const failedTxns = transactions.filter((t) => t.status === 'failed').length;

  const statCards = [
    { label: 'Total Transactions', value: totalTxns, icon: <ArrowUpDown size={22} color="#fff" />, bg: NAVY },
    { label: 'Completed', value: completedTxns, icon: <CheckCircle size={22} color="#fff" />, bg: GREEN },
    { label: 'Pending', value: pendingTxns, icon: <Clock size={22} color="#fff" />, bg: '#E65100' },
    { label: 'Failed', value: failedTxns, icon: <XCircle size={22} color="#fff" />, bg: '#C62828' },
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
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>Transactions</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>Monitor all financial activity</p>
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
          gap: 12,
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder="Search by ID, user or recipient..."
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'all' | Transaction['type'])}
          style={selectStyle}
        >
          <option value="all">All Types</option>
          <option value="send">Send</option>
          <option value="receive">Receive</option>
          <option value="exchange">Exchange</option>
          <option value="topup">Top-up</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value as 'all' | Transaction['method'])}
          style={selectStyle}
        >
          <option value="all">All Methods</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="bank">Bank</option>
          <option value="card">Card</option>
          <option value="crypto">Crypto</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | Transaction['status'])}
          style={selectStyle}
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
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
                {['ID', 'User', 'Type', 'Method', 'Amount', 'Fee', 'Status', 'Recipient', 'Date'].map((h) => (
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
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', color: NAVY, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {txn.id}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#1F2937', fontWeight: 500 }}>{txn.userName}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: typeBadgeColors[txn.type].bg,
                        color: typeBadgeColors[txn.type].color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {typeLabel[txn.type]}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151', whiteSpace: 'nowrap' }}>
                    {methodLabel[txn.method]}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#1F2937', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {txn.amount.toLocaleString()} {txn.currency}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {txn.fee.toLocaleString()} {txn.currency}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: statusBadgeColors[txn.status].bg,
                        color: statusBadgeColors[txn.status].color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {statusLabel[txn.status]}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151', whiteSpace: 'nowrap' }}>
                    {txn.recipientName}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', whiteSpace: 'nowrap' }}>{txn.createdAt}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
                    No transactions found matching your filters.
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
