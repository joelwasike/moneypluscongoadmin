import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import api from '../services/api';

type AdminKyc = {
  id: number;
  user_id: number;
  full_name?: string;
  id_type?: string;
  id_number?: string;
  status?: string;
  rejection_reason?: string;
  submitted_at?: string;
  created_at?: string;
};

const KycReview: React.FC = () => {
  const [submissions, setSubmissions] = useState<AdminKyc[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const load = async () => {
    setLoading(true);
    setError(null);
    const qs = statusFilter === 'all' ? '' : `status=${statusFilter}`;
    const res = await api.listKYC(qs);
    setLoading(false);
    if (!res?.success) {
      setError(res?.message || 'Failed to load KYC submissions');
      setSubmissions([]);
      return;
    }
    const data = res.data || {};
    const rows = (data.submissions || []) as AdminKyc[];
    setSubmissions(rows);
    setStats({
      total: Number(data.total) || rows.length,
      pending: Number(data.pending) || 0,
      approved: Number(data.approved) || 0,
      rejected: Number(data.rejected) || 0,
    });
    setNotes((prev) => {
      const next = { ...prev };
      for (const s of rows) {
        if (next[s.id] == null) next[s.id] = s.rejection_reason || '';
      }
      return next;
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter((s) =>
      String(s.id).includes(q) ||
      String(s.user_id).includes(q) ||
      (s.full_name || '').toLowerCase().includes(q) ||
      (s.id_type || '').toLowerCase().includes(q) ||
      (s.id_number || '').toLowerCase().includes(q)
    );
  }, [submissions, searchQuery]);

  const handleApprove = async (id: number) => {
    if (!window.confirm(`Approve KYC #${id}?`)) return;
    const res = await api.reviewKYC(id, 'approved');
    if (!res?.success) {
      window.alert(res?.message || 'Failed to approve KYC');
      return;
    }
    load();
  };

  const handleReject = async (id: number) => {
    if (!window.confirm(`Reject KYC #${id}?`)) return;
    const res = await api.reviewKYC(id, 'rejected', notes[id] || '');
    if (!res?.success) {
      window.alert(res?.message || 'Failed to reject KYC');
      return;
    }
    load();
  };

  const styles: Record<string, React.CSSProperties> = {
    page: {
      padding: 32,
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
    },
    title: {
      fontSize: 28,
      fontWeight: 700,
      color: '#1B3A5C',
      margin: 0,
    },
    subtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 4,
      marginBottom: 24,
    },
    statsRow: {
      display: 'flex',
      gap: 20,
      marginBottom: 18,
      flexWrap: 'wrap',
    },
    statCard: {
      flex: 1,
      minWidth: 220,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    },
    statIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statLabel: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 2,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 700,
      color: '#1B3A5C',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '16px 24px',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: '#1B3A5C',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      marginRight: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      fontSize: 12,
      fontWeight: 600,
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottom: '1px solid #E5E7EB',
      backgroundColor: '#F9FAFB',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '12px 16px',
      fontSize: 14,
      color: '#374151',
      borderBottom: '1px solid #F3F4F6',
      verticalAlign: 'middle',
    },
    notesInput: {
      width: '100%',
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#374151',
      outline: 'none',
      minWidth: 200,
    },
    btnApprove: {
      padding: '6px 14px',
      borderRadius: 6,
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#43A047',
      color: '#FFFFFF',
      marginRight: 6,
    },
    btnReject: {
      padding: '6px 14px',
      borderRadius: 6,
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#E53935',
      color: '#FFFFFF',
    },
  };

  const badgeStyle = (status: string): React.CSSProperties => {
    if (status === 'pending') return { backgroundColor: '#FFF3E0', color: '#E65100' };
    if (status === 'approved') return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
    if (status === 'rejected') return { backgroundColor: '#FFEBEE', color: '#C62828' };
    return { backgroundColor: '#ECEFF1', color: '#546E7A' };
  };

  const statCards = [
    { label: 'Total', value: stats.total, color: '#1B3A5C', icon: <FileText size={22} color="#FFFFFF" /> },
    { label: 'Pending', value: stats.pending, color: '#E65100', icon: <Clock size={22} color="#FFFFFF" /> },
    { label: 'Approved', value: stats.approved, color: '#43A047', icon: <CheckCircle size={22} color="#FFFFFF" /> },
    { label: 'Rejected', value: stats.rejected, color: '#E53935', icon: <XCircle size={22} color="#FFFFFF" /> },
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>KYC Review</h1>
      <p style={styles.subtitle}>Review and manage identity verification</p>

      <div style={styles.statsRow}>
        {statCards.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statIconWrap, backgroundColor: stat.color }}>{stat.icon}</div>
            <div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: '10px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 11 }} />
          <input
            type="text"
            placeholder="Search by KYC ID, user ID, name, document…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          onClick={load}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontWeight: 700,
            color: '#1B3A5C',
          }}
        >
          Refresh
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}><Search size={18} color="#1B3A5C" /> KYC Submissions</span>
          {loading && <span style={{ color: '#6B7280', fontWeight: 600 }}>Loading…</span>}
          {error && <span style={{ color: '#C62828', fontWeight: 700 }}>{error}</span>}
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Document</th>
              <th style={styles.th}>Submitted</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Rejection Reason</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td style={{ ...styles.td, fontWeight: 700, color: '#1B3A5C' }}>#{s.id}</td>
                <td style={styles.td}>#{s.user_id}</td>
                <td style={styles.td}>{s.full_name || '-'}</td>
                <td style={styles.td}>{[s.id_type, s.id_number].filter(Boolean).join(' • ') || '-'}</td>
                <td style={styles.td}>{String(s.submitted_at || s.created_at || '').slice(0, 16)}</td>
                <td style={styles.td}>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, ...badgeStyle(s.status || '') }}>
                    {s.status || '-'}
                  </span>
                </td>
                <td style={styles.td}>
                  <input
                    value={notes[s.id] || ''}
                    onChange={(e) => setNotes((p) => ({ ...p, [s.id]: e.target.value }))}
                    placeholder="Reason (if rejecting)"
                    style={styles.notesInput}
                    disabled={s.status === 'approved'}
                  />
                </td>
                <td style={styles.td}>
                  {s.status === 'pending' ? (
                    <>
                      <button style={styles.btnApprove} onClick={() => handleApprove(s.id)}>Approve</button>
                      <button style={styles.btnReject} onClick={() => handleReject(s.id)}>Reject</button>
                    </>
                  ) : (
                    <span style={{ color: '#6B7280', fontWeight: 700 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
                  No KYC submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KycReview;

