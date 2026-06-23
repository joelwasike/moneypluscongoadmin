import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../services/api';

type Tab = 'flagged' | 'callbacks';

const STATUS_COLORS: Record<string, [string, string]> = {
  completed: ['#E8F5E9', '#2E7D32'],
  failed_balance: ['#FFEBEE', '#C62828'],
  failed_compliance: ['#FFF3E0', '#E65100'],
  failed_corridor: ['#FFF9C4', '#827717'],
  reversed: ['#F3E5F5', '#6A1B9A'],
  processing: ['#E3F2FD', '#1565C0'],
  collection_pending: ['#E8EAF6', '#283593'],
  rejected: ['#FFEBEE', '#C62828'],
  pending: ['#F5F5F5', '#555'],
};

function statusBadge(status: string) {
  const [bg, color] = STATUS_COLORS[status] || ['#eee', '#444'];
  return <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{status}</span>;
}

const Compliance: React.FC = () => {
  const [tab, setTab] = useState<Tab>('flagged');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [provider, setProvider] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'flagged') loadFlagged();
    else loadCallbacks();
  }, [tab, provider]);

  const loadFlagged = async () => {
    setLoading(true);
    // Filter for compliance-failed and reversed transactions
    const res = await api.listComplianceTransactions('status=failed_compliance&limit=100');
    setLoading(false);
    if (res.success) setTransactions(res.data?.transactions || res.data || []);
  };

  const loadCallbacks = async () => {
    setLoading(true);
    const params = provider ? `provider=${provider}&limit=100` : 'limit=100';
    const res = await api.listCallbacks(params);
    setLoading(false);
    if (res.success) setCallbacks(res.data || []);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={22} color="#E65100" /> Compliance & AML
          </h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
            Flagged transactions, mobile money callback logs, and AML review queue.
          </p>
        </div>
        <button onClick={() => tab === 'flagged' ? loadFlagged() : loadCallbacks()} style={btnStyle('#1B3A5C')}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid #f0f0f0' }}>
        {([['flagged', 'Flagged Transactions'], ['callbacks', 'Callback Log']] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
              color: tab === t ? '#1B3A5C' : '#999',
              borderBottom: tab === t ? '2px solid #1B3A5C' : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>Loading…</p>}

      {!loading && tab === 'flagged' && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} color="#E65100" />
            <strong style={{ fontSize: 14 }}>Compliance-Failed Remittances</strong>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#999' }}>{transactions.length} records</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                <th style={th}>ID</th>
                <th style={th}>Sender</th>
                <th style={th}>Amount (XAF)</th>
                <th style={th}>Destination</th>
                <th style={th}>Channel</th>
                <th style={th}>Status</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={td}>#{t.id}</td>
                  <td style={td}>{t.sender_phone || t.created_by_user_id}</td>
                  <td style={td}>{t.amount?.toLocaleString()}</td>
                  <td style={td}>{t.destination_country || '—'}</td>
                  <td style={td}>{t.funding_source_type}</td>
                  <td style={td}>{statusBadge(t.status)}</td>
                  <td style={td}>{t.created_at?.slice(0, 16)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                  <CheckCircle size={24} color="#43A047" style={{ display: 'block', margin: '0 auto 8px' }} />
                  No compliance-flagged transactions.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'callbacks' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {(['', 'mtn', 'airtel'] as const).map(p => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                style={{
                  padding: '6px 14px', borderRadius: 6, border: '1px solid #ddd',
                  background: provider === p ? '#1B3A5C' : '#fff',
                  color: provider === p ? '#fff' : '#444',
                  fontWeight: 600, fontSize: 12, cursor: 'pointer',
                }}
              >
                {p === '' ? 'All' : p.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                  <th style={th}>ID</th>
                  <th style={th}>Provider</th>
                  <th style={th}>External Ref</th>
                  <th style={th}>Remittance #</th>
                  <th style={th}>Status</th>
                  <th style={th}>Signature</th>
                  <th style={th}>Processed At</th>
                </tr>
              </thead>
              <tbody>
                {callbacks.map((cb: any) => (
                  <tr key={cb.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={td}>#{cb.id}</td>
                    <td style={td}>
                      <span style={{ background: cb.provider === 'mtn' ? '#FFF9C4' : '#FFF3E0', color: '#5D4037', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {cb.provider?.toUpperCase()}
                      </span>
                    </td>
                    <td style={td}><code style={{ fontSize: 11 }}>{cb.external_ref}</code></td>
                    <td style={td}>{cb.remittance_id ? `#${cb.remittance_id}` : '—'}</td>
                    <td style={td}>{statusBadge(cb.status?.toLowerCase() || 'pending')}</td>
                    <td style={td}>
                      {cb.signature_valid
                        ? <CheckCircle size={14} color="#43A047" />
                        : <XCircle size={14} color="#C62828" />}
                    </td>
                    <td style={td}>{cb.processed_at?.slice(0, 16) || <Clock size={13} color="#999" />}</td>
                  </tr>
                ))}
                {callbacks.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#999' }}>No callbacks received yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = (bg: string): React.CSSProperties => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px',
  cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
});

const th: React.CSSProperties = { textAlign: 'left', padding: '11px 14px', fontSize: 12, fontWeight: 600, color: '#666' };
const td: React.CSSProperties = { padding: '11px 14px', fontSize: 13 };

export default Compliance;
