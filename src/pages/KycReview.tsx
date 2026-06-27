import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Search, Building2, User, ExternalLink } from 'lucide-react';
import api from '../services/api';

type KycRow = {
  id: number;
  user_id: number;
  full_name?: string;
  id_type?: string;
  id_number?: string;
  status?: string;
  rejection_reason?: string;
  submitted_at?: string;
  created_at?: string;
  // personal extras
  kyc_level?: string;
  id_document_url?: string;
  selfie_url?: string;
  proof_of_address_url?: string;
  proof_of_income_url?: string;
};

type KybRow = {
  id: number;
  user_id: number;
  company_name?: string;
  rccm_number?: string;
  niu?: string;
  office_address?: string;
  city?: string;
  sector?: string;
  rep_name?: string;
  rep_title?: string;
  status?: string;
  rejection_reason?: string;
  submitted_at?: string;
  created_at?: string;
  // document urls
  rccm_url?: string;
  bylaws_url?: string;
  niu_cert_url?: string;
  proof_office_url?: string;
  rep_id_url?: string;
  bank_statement_url?: string;
  poa_url?: string;
  selfie_url?: string;
  ubo1?: string;
  ubo2?: string;
};

type Tab = 'kyc' | 'kyb';
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const KycReview: React.FC = () => {
  const [tab, setTab] = useState<Tab>('kyc');
  const [kycRows, setKycRows] = useState<KycRow[]>([]);
  const [kybRows, setKybRows] = useState<KybRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const qs = statusFilter === 'all' ? '' : `status=${statusFilter}`;
    if (tab === 'kyc') {
      const res = await api.listKYC(qs);
      setLoading(false);
      if (!res?.success) { setError(res?.message || 'Failed to load'); setKycRows([]); return; }
      const data = res.data || {};
      const rows = (data.submissions || []) as KycRow[];
      setKycRows(rows);
      setStats({ total: Number(data.total) || rows.length, pending: Number(data.pending) || 0, approved: Number(data.approved) || 0, rejected: Number(data.rejected) || 0 });
      setNotes(prev => { const n = { ...prev }; rows.forEach(r => { if (n[`kyc-${r.id}`] == null) n[`kyc-${r.id}`] = r.rejection_reason || ''; }); return n; });
    } else {
      const res = await api.listKYB(qs);
      setLoading(false);
      if (!res?.success) { setError(res?.message || 'Failed to load'); setKybRows([]); return; }
      const data = res.data || {};
      const rows = (data.submissions || []) as KybRow[];
      setKybRows(rows);
      setStats({ total: Number(data.total) || rows.length, pending: Number(data.pending) || 0, approved: Number(data.approved) || 0, rejected: Number(data.rejected) || 0 });
      setNotes(prev => { const n = { ...prev }; rows.forEach(r => { if (n[`kyb-${r.id}`] == null) n[`kyb-${r.id}`] = r.rejection_reason || ''; }); return n; });
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab, statusFilter]);

  const filteredKyc = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return kycRows;
    return kycRows.filter(s =>
      String(s.id).includes(q) || String(s.user_id).includes(q) ||
      (s.full_name || '').toLowerCase().includes(q) ||
      (s.id_type || '').toLowerCase().includes(q) ||
      (s.id_number || '').toLowerCase().includes(q)
    );
  }, [kycRows, searchQuery]);

  const filteredKyb = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return kybRows;
    return kybRows.filter(s =>
      String(s.id).includes(q) || String(s.user_id).includes(q) ||
      (s.company_name || '').toLowerCase().includes(q) ||
      (s.rccm_number || '').toLowerCase().includes(q) ||
      (s.rep_name || '').toLowerCase().includes(q) ||
      (s.niu || '').toLowerCase().includes(q)
    );
  }, [kybRows, searchQuery]);

  const handleApprove = async (id: number) => {
    if (!window.confirm(`Approve ${tab.toUpperCase()} #${id}?`)) return;
    const res = tab === 'kyc' ? await api.reviewKYC(id, 'approved') : await api.reviewKYB(id, 'approved');
    if (!res?.success) { window.alert(res?.message || 'Failed'); return; }
    load();
  };

  const handleReject = async (id: number) => {
    if (!window.confirm(`Reject ${tab.toUpperCase()} #${id}?`)) return;
    const key = `${tab}-${id}`;
    const res = tab === 'kyc' ? await api.reviewKYC(id, 'rejected', notes[key] || '') : await api.reviewKYB(id, 'rejected', notes[key] || '');
    if (!res?.success) { window.alert(res?.message || 'Failed'); return; }
    load();
  };

  const badgeStyle = (status: string): React.CSSProperties => {
    if (status === 'pending')  return { backgroundColor: '#FFF3E0', color: '#E65100' };
    if (status === 'approved') return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
    if (status === 'rejected') return { backgroundColor: '#FFEBEE', color: '#C62828' };
    return { backgroundColor: '#ECEFF1', color: '#546E7A' };
  };

  const levelBadge = (level = ''): React.CSSProperties => {
    if (level === 'level_3') return { backgroundColor: '#EDE9FE', color: '#5B21B6' };
    if (level === 'level_2') return { backgroundColor: '#DBEAFE', color: '#1D4ED8' };
    return { backgroundColor: '#F0FDF4', color: '#15803D' };
  };

  const DocLink: React.FC<{ url?: string; label: string }> = ({ url, label }) => {
    if (!url) return <span style={{ color: '#9CA3AF', fontSize: 12 }}>—</span>;
    return (
      <a href={url} target="_blank" rel="noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#1D4ED8', textDecoration: 'none', fontWeight: 600 }}>
        {label} <ExternalLink size={11} />
      </a>
    );
  };

  const s: Record<string, React.CSSProperties> = {
    page:       { padding: 32, backgroundColor: '#F5F7FA', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    title:      { fontSize: 28, fontWeight: 700, color: '#1B3A5C', margin: 0 },
    subtitle:   { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 24 },
    tabs:       { display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid #E5E7EB', paddingBottom: 0 },
    statsRow:   { display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' as const },
    statCard:   { flex: 1, minWidth: 180, backgroundColor: '#FFFFFF', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 14 },
    statIconW:  { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    card:       { backgroundColor: '#FFFFFF', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
    cardHeader: { padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const },
    table:      { width: '100%', borderCollapse: 'collapse' as const },
    th:         { textAlign: 'left' as const, padding: '10px 14px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: 0.5, borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', whiteSpace: 'nowrap' as const },
    td:         { padding: '11px 14px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6', verticalAlign: 'top' as const },
    badge:      { display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
    btnApprove: { padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', backgroundColor: '#43A047', color: '#FFFFFF', marginRight: 6 },
    btnReject:  { padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', backgroundColor: '#E53935', color: '#FFFFFF' },
    notesInput: { width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#374151', outline: 'none', minWidth: 160, boxSizing: 'border-box' as const },
  };

  const tabBtn = (t: Tab, label: string, icon: React.ReactNode): React.CSSProperties => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: tab === t ? '2px solid #1B3A5C' : '2px solid transparent',
    backgroundColor: 'transparent',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    fontWeight: tab === t ? 700 : 500,
    color: tab === t ? '#1B3A5C' : '#6B7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: -2,
  });

  const statCards = [
    { label: 'Total', value: stats.total, color: '#1B3A5C', icon: <FileText size={20} color="#fff" /> },
    { label: 'Pending', value: stats.pending, color: '#E65100', icon: <Clock size={20} color="#fff" /> },
    { label: 'Approved', value: stats.approved, color: '#43A047', icon: <CheckCircle size={20} color="#fff" /> },
    { label: 'Rejected', value: stats.rejected, color: '#E53935', icon: <XCircle size={20} color="#fff" /> },
  ];

  return (
    <div style={s.page}>
      <h1 style={s.title}>KYC / KYB Review</h1>
      <p style={s.subtitle}>Review and manage identity and business verification submissions</p>

      {/* Tabs */}
      <div style={s.tabs}>
        <button style={tabBtn('kyc', 'Personal KYC', null)} onClick={() => setTab('kyc')}>
          <User size={15} /> Personal KYC
        </button>
        <button style={tabBtn('kyb', 'Business KYB', null)} onClick={() => setTab('kyb')}>
          <Building2 size={15} /> Business KYB
        </button>
      </div>

      {/* Stat cards */}
      <div style={s.statsRow}>
        {statCards.map(c => (
          <div key={c.label} style={s.statCard}>
            <div style={{ ...s.statIconW, backgroundColor: c.color }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A5C' }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          style={{ padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, backgroundColor: '#fff', cursor: 'pointer' }}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 11, top: 10 }} />
          <input type="text" placeholder={tab === 'kyc' ? 'Search by name, document, user ID…' : 'Search by company, RCCM, NIU, rep…'}
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={load}
          style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 700, color: '#1B3A5C', fontSize: 13 }}>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1B3A5C', marginRight: 'auto' }}>
            {tab === 'kyc' ? 'Personal KYC Submissions' : 'Business KYB Submissions'}
          </span>
          {loading && <span style={{ color: '#6B7280', fontWeight: 600 }}>Loading…</span>}
          {error && <span style={{ color: '#C62828', fontWeight: 700 }}>{error}</span>}
        </div>

        {tab === 'kyc' ? (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>User</th>
                <th style={s.th}>Full Name</th>
                <th style={s.th}>Level</th>
                <th style={s.th}>Document</th>
                <th style={s.th}>Files</th>
                <th style={s.th}>Submitted</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Rejection Reason</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKyc.map(row => (
                <tr key={row.id}>
                  <td style={{ ...s.td, fontWeight: 700, color: '#1B3A5C' }}>#{row.id}</td>
                  <td style={s.td}>#{row.user_id}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{row.full_name || '—'}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...levelBadge(row.kyc_level) }}>{row.kyc_level || 'L1'}</span>
                  </td>
                  <td style={s.td}>{[row.id_type, row.id_number].filter(Boolean).join(' • ') || '—'}</td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <DocLink url={row.id_document_url} label="ID Doc" />
                      <DocLink url={row.selfie_url} label="Selfie" />
                      <DocLink url={row.proof_of_address_url} label="Proof of Address" />
                      <DocLink url={row.proof_of_income_url} label="Proof of Income" />
                    </div>
                  </td>
                  <td style={s.td}>{String(row.submitted_at || row.created_at || '').slice(0, 16)}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...badgeStyle(row.status || '') }}>{row.status || '—'}</span>
                  </td>
                  <td style={s.td}>
                    <input value={notes[`kyc-${row.id}`] || ''} onChange={e => setNotes(p => ({ ...p, [`kyc-${row.id}`]: e.target.value }))}
                      placeholder="Rejection reason…" style={s.notesInput} disabled={row.status === 'approved'} />
                  </td>
                  <td style={s.td}>
                    {row.status === 'pending' ? (
                      <>
                        <button style={s.btnApprove} onClick={() => handleApprove(row.id)}>Approve</button>
                        <button style={s.btnReject} onClick={() => handleReject(row.id)}>Reject</button>
                      </>
                    ) : <span style={{ color: '#9CA3AF' }}>—</span>}
                  </td>
                </tr>
              ))}
              {!loading && !error && filteredKyc.length === 0 && (
                <tr><td colSpan={10} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No personal KYC submissions found.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>User</th>
                <th style={s.th}>Company</th>
                <th style={s.th}>RCCM / NIU</th>
                <th style={s.th}>Legal Rep</th>
                <th style={s.th}>UBOs</th>
                <th style={s.th}>Documents</th>
                <th style={s.th}>Submitted</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Rejection Reason</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKyb.map(row => (
                <tr key={row.id}>
                  <td style={{ ...s.td, fontWeight: 700, color: '#1B3A5C' }}>#{row.id}</td>
                  <td style={s.td}>#{row.user_id}</td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600, color: '#1B3A5C' }}>{row.company_name || '—'}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{row.sector || ''}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{[row.city, row.office_address].filter(Boolean).join(', ')}</div>
                  </td>
                  <td style={s.td}>
                    <div style={{ fontSize: 12 }}><b>RCCM:</b> {row.rccm_number || '—'}</div>
                    <div style={{ fontSize: 12 }}><b>NIU:</b> {row.niu || '—'}</div>
                  </td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600 }}>{row.rep_name || '—'}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{row.rep_title || ''}</div>
                  </td>
                  <td style={s.td}>
                    {row.ubo1 && <div style={{ fontSize: 12 }}>• {row.ubo1}</div>}
                    {row.ubo2 && <div style={{ fontSize: 12 }}>• {row.ubo2}</div>}
                    {!row.ubo1 && !row.ubo2 && <span style={{ color: '#9CA3AF', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <DocLink url={row.rccm_url} label="RCCM Extract" />
                      <DocLink url={row.bylaws_url} label="Bylaws" />
                      <DocLink url={row.niu_cert_url} label="NIU Cert" />
                      <DocLink url={row.proof_office_url} label="Proof of Office" />
                      <DocLink url={row.rep_id_url} label="Rep ID" />
                      <DocLink url={row.bank_statement_url} label="Bank Statement" />
                      <DocLink url={row.poa_url} label="Power of Attorney" />
                      <DocLink url={row.selfie_url} label="Selfie" />
                    </div>
                  </td>
                  <td style={s.td}>{String(row.submitted_at || row.created_at || '').slice(0, 16)}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...badgeStyle(row.status || '') }}>{row.status || '—'}</span>
                  </td>
                  <td style={s.td}>
                    <input value={notes[`kyb-${row.id}`] || ''} onChange={e => setNotes(p => ({ ...p, [`kyb-${row.id}`]: e.target.value }))}
                      placeholder="Rejection reason…" style={s.notesInput} disabled={row.status === 'approved'} />
                  </td>
                  <td style={s.td}>
                    {row.status === 'pending' ? (
                      <>
                        <button style={s.btnApprove} onClick={() => handleApprove(row.id)}>Approve</button>
                        <button style={s.btnReject} onClick={() => handleReject(row.id)}>Reject</button>
                      </>
                    ) : <span style={{ color: '#9CA3AF' }}>—</span>}
                  </td>
                </tr>
              ))}
              {!loading && !error && filteredKyb.length === 0 && (
                <tr><td colSpan={11} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No business KYB submissions found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KycReview;
