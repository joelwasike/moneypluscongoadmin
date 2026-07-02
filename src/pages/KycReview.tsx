import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText, Clock, CheckCircle, XCircle, Search,
  Building2, User, X, ChevronRight, Info, AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const DOC_BASE = 'https://moneyplusapi.theliberec.com';
const docSrc = (url?: string): string | null =>
  url ? (url.startsWith('http') ? url : `${DOC_BASE}${url}`) : null;

type KycRow = {
  id: number;
  user_id: number;
  full_name?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  occupation?: string;
  monthly_income?: string;
  purpose_of_use?: string;
  source_of_funds?: string;
  id_type?: string;
  id_number?: string;
  kyc_level?: string;
  id_document_url?: string;
  id_document_front_url?: string;
  id_document_back_url?: string;
  selfie_url?: string;
  proof_of_address_url?: string;
  proof_of_income_url?: string;
  status?: string;
  rejection_reason?: string;
  review_notes?: string;
  submitted_at?: string;
  created_at?: string;
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
  review_notes?: string;
  submitted_at?: string;
  created_at?: string;
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
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'needs_more_info';

const normaliseStatus = (s?: string): string => {
  if (!s) return '';
  if (s === 'pending_review') return 'pending';
  return s;
};

const badgeStyle = (raw?: string): React.CSSProperties => {
  const s = normaliseStatus(raw);
  if (s === 'pending')         return { background: '#FFF3E0', color: '#E65100' };
  if (s === 'approved')        return { background: '#E8F5E9', color: '#2E7D32' };
  if (s === 'rejected')        return { background: '#FFEBEE', color: '#C62828' };
  if (s === 'needs_more_info') return { background: '#EDE9FE', color: '#6D28D9' };
  return { background: '#ECEFF1', color: '#546E7A' };
};

const badgeLabel = (raw?: string): string => {
  const s = normaliseStatus(raw);
  if (s === 'needs_more_info') return 'More Info';
  return s || '—';
};

const levelBadge = (level = ''): React.CSSProperties => {
  if (level === 'level_3') return { background: '#EDE9FE', color: '#5B21B6' };
  if (level === 'level_2') return { background: '#DBEAFE', color: '#1D4ED8' };
  return { background: '#F0FDF4', color: '#15803D' };
};

const fmtDate = (s?: string) => s ? String(s).slice(0, 16).replace('T', ' ') : '—';

// ─── Inline document image with fallback link ─────────────────────────────
const DocImage: React.FC<{ url?: string; label: string }> = ({ url, label }) => {
  const [errored, setErrored] = useState(false);
  const src = docSrc(url);
  if (!src) return (
    <div style={{ padding: '10px 0', color: '#9CA3AF', fontSize: 12 }}>No {label} uploaded</div>
  );
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      {!errored ? (
        <a href={src} target="_blank" rel="noreferrer">
          <img
            src={src}
            alt={label}
            onError={() => setErrored(true)}
            style={{ width: '100%', maxWidth: 340, borderRadius: 8, border: '1px solid #E5E7EB', display: 'block', cursor: 'pointer', objectFit: 'contain', maxHeight: 220 }}
          />
        </a>
      ) : (
        <a href={src} target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#1D4ED8', fontWeight: 600 }}>
          View {label} ↗
        </a>
      )}
    </div>
  );
};

// ─── Info row inside the modal ────────────────────────────────────────────
const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 13 }}>
    <span style={{ minWidth: 140, color: '#6B7280', fontWeight: 500 }}>{label}</span>
    <span style={{ color: '#111827', fontWeight: 600 }}>{value || '—'}</span>
  </div>
);

// ─── Detail modal ─────────────────────────────────────────────────────────
const DetailModal: React.FC<{
  tab: Tab;
  row: KycRow | KybRow;
  onClose: () => void;
  onRefresh: () => void;
}> = ({ tab, row, onClose, onRefresh }) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState((row as any).rejection_reason || (row as any).review_notes || '');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const status = normaliseStatus(row.status);
  const isPending = status === 'pending' || status === 'needs_more_info' || status === '';

  const act = async (newStatus: string) => {
    if (newStatus === 'rejected' && !notes.trim()) {
      setActionError('Please enter a rejection reason.'); return;
    }
    if (newStatus === 'needs_more_info' && !notes.trim()) {
      setActionError('Please describe what information is needed.'); return;
    }
    if (!window.confirm(`${newStatus === 'approved' ? 'Approve' : newStatus === 'rejected' ? 'Reject' : 'Request more info for'} this ${tab.toUpperCase()} submission?`)) return;
    setBusy(true); setActionError(null);
    const res = tab === 'kyc'
      ? await api.reviewKYC(row.id, newStatus, notes)
      : await api.reviewKYB(row.id, newStatus, notes);
    setBusy(false);
    if (!res?.success) { setActionError(res?.message || 'Action failed'); return; }
    onRefresh();
    onClose();
  };

  const kyc = tab === 'kyc' ? (row as KycRow) : null;
  const kyb = tab === 'kyb' ? (row as KybRow) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: '100%', maxWidth: 780, height: '100vh', background: '#fff',
        display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, background: '#fff', zIndex: 10,
        }}>
          <button onClick={onClose}
            style={{ border: 'none', background: '#F3F4F6', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex' }}>
            <X size={18} color="#374151" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1B3A5C' }}>
              {tab === 'kyc' ? `KYC #${row.id} — ${kyc?.full_name || 'Unknown'}` : `KYB #${row.id} — ${kyb?.company_name || 'Unknown'}`}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              User #{row.user_id} · Submitted {fmtDate(row.submitted_at || row.created_at)}
            </div>
          </div>
          <span style={{ ...BADGE, ...badgeStyle(row.status), fontSize: 13, padding: '4px 14px' }}>
            {badgeLabel(row.status).toUpperCase()}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

            {/* ── Left: applicant info ── */}
            <div>
              <SectionTitle>{tab === 'kyc' ? t('kyc.detail.personalInfo') : 'Business Information'}</SectionTitle>
              {kyc && <>
                <InfoRow label={t('kyc.detail.fullName')}     value={kyc.full_name} />
                <InfoRow label={t('kyc.detail.dob')} value={kyc.date_of_birth} />
                <InfoRow label={t('kyc.detail.address')}       value={[kyc.address, kyc.city, kyc.postal_code].filter(Boolean).join(', ')} />
                <InfoRow label={t('kyc.detail.occupation')}    value={kyc.occupation} />
                <InfoRow label={t('kyc.detail.monthlyIncome')} value={kyc.monthly_income} />
                <InfoRow label={t('kyc.detail.purposeOfUse')} value={kyc.purpose_of_use} />
                <InfoRow label={t('kyc.detail.sourceOfFunds')} value={kyc.source_of_funds} />
                <div style={{ marginTop: 16 }}>
                  <SectionTitle>{t('kyc.detail.idDocument')}</SectionTitle>
                  <InfoRow label="ID Type"   value={kyc.id_type} />
                  <InfoRow label="ID Number" value={kyc.id_number} />
                  {kyc.kyc_level && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ ...BADGE, ...levelBadge(kyc.kyc_level) }}>{kyc.kyc_level}</span>
                    </div>
                  )}
                </div>
                {(row.rejection_reason || (row as KycRow).review_notes) && (
                  <div style={{ marginTop: 20, padding: 12, background: '#FFF3E0', borderRadius: 8, borderLeft: '3px solid #F97316' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9A3412', marginBottom: 4 }}>PREVIOUS NOTES</div>
                    <div style={{ fontSize: 13, color: '#7C2D12' }}>{row.rejection_reason || (row as KycRow).review_notes}</div>
                  </div>
                )}
              </>}
              {kyb && <>
                <InfoRow label={t('kyc.detail.companyName')}  value={kyb.company_name} />
                <InfoRow label={t('kyc.detail.sector')}        value={kyb.sector} />
                <InfoRow label={t('kyc.detail.rccm')}   value={kyb.rccm_number} />
                <InfoRow label={t('kyc.detail.niu')}           value={kyb.niu} />
                <InfoRow label={t('kyc.detail.officeAddress')} value={[kyb.office_address, kyb.city].filter(Boolean).join(', ')} />
                <div style={{ marginTop: 16 }}>
                  <SectionTitle>Legal Representative</SectionTitle>
                  <InfoRow label={t('kyc.detail.repName')}  value={kyb.rep_name} />
                  <InfoRow label={t('kyc.detail.repTitle')} value={kyb.rep_title} />
                </div>
                {(kyb.ubo1 || kyb.ubo2) && (
                  <div style={{ marginTop: 16 }}>
                    <SectionTitle>{t('kyc.detail.ubo')}</SectionTitle>
                    {kyb.ubo1 && <InfoRow label="UBO 1" value={kyb.ubo1} />}
                    {kyb.ubo2 && <InfoRow label="UBO 2" value={kyb.ubo2} />}
                  </div>
                )}
                {(row.rejection_reason || kyb.review_notes) && (
                  <div style={{ marginTop: 20, padding: 12, background: '#FFF3E0', borderRadius: 8, borderLeft: '3px solid #F97316' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9A3412', marginBottom: 4 }}>PREVIOUS NOTES</div>
                    <div style={{ fontSize: 13, color: '#7C2D12' }}>{row.rejection_reason || kyb.review_notes}</div>
                  </div>
                )}
              </>}
            </div>

            {/* ── Right: documents ── */}
            <div>
              <SectionTitle>{t('kyc.detail.documents')}</SectionTitle>
              {kyc && <>
                {kyc.id_type === 'national_id' ? <>
                  <DocImage url={kyc.id_document_front_url} label="ID — Front" />
                  <DocImage url={kyc.id_document_back_url}  label="ID — Back" />
                </> : (
                  <DocImage url={kyc.id_document_url} label="ID Document" />
                )}
                <DocImage url={kyc.selfie_url}            label={t('kyc.detail.selfie')} />
                <DocImage url={kyc.proof_of_address_url}  label={t('kyc.detail.proofOfAddress')} />
                <DocImage url={kyc.proof_of_income_url}   label={t('kyc.detail.proofOfIncome')} />
              </>}
              {kyb && <>
                <DocImage url={kyb.rep_id_url}          label="Representative ID" />
                <DocImage url={kyb.selfie_url}          label={t('kyc.detail.selfie')} />
                <DocImage url={kyb.rccm_url}            label="RCCM Extract" />
                <DocImage url={kyb.bylaws_url}          label="Company Bylaws" />
                <DocImage url={kyb.niu_cert_url}        label="NIU Certificate" />
                <DocImage url={kyb.proof_office_url}    label="Proof of Office" />
                <DocImage url={kyb.bank_statement_url}  label="Bank Statement" />
                <DocImage url={kyb.poa_url}             label="Power of Attorney" />
              </>}
            </div>
          </div>
        </div>

        {/* Review panel — sticky at bottom */}
        <div style={{
          padding: '20px 28px', borderTop: '1px solid #E5E7EB',
          background: '#F9FAFB', position: 'sticky', bottom: 0,
        }}>
          {isPending ? <>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
              {t('kyc.detail.reviewNotes')} <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(required for Reject or Request Info)</span>
            </div>
            <textarea
              value={notes}
              onChange={e => { setNotes(e.target.value); setActionError(null); }}
              placeholder="Enter rejection reason or information request message…"
              style={{
                width: '100%', minHeight: 72, padding: '10px 12px',
                border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13,
                fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none',
                boxSizing: 'border-box', marginBottom: 12,
              }}
            />
            {actionError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C62828', fontSize: 13, marginBottom: 12 }}>
                <AlertCircle size={15} /> {actionError}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button disabled={busy} onClick={() => act('approved')} style={APPROVE_BTN}>
                <CheckCircle size={15} /> {t('kyc.detail.approve')}
              </button>
              <button disabled={busy} onClick={() => act('needs_more_info')} style={INFO_BTN}>
                <Info size={15} /> {t('kyc.detail.needsMoreInfo')}
              </button>
              <button disabled={busy} onClick={() => act('rejected')} style={REJECT_BTN}>
                <XCircle size={15} /> {t('kyc.detail.reject')}
              </button>
              {busy && <span style={{ color: '#6B7280', fontSize: 13, alignSelf: 'center' }}>{t('kyc.detail.submitting')}</span>}
            </div>
          </> : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 13 }}>
              <CheckCircle size={16} />
              This submission has already been reviewed (<strong>{badgeLabel(row.status)}</strong>).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Small helpers ────────────────────────────────────────────────────────
const BADGE: React.CSSProperties = {
  display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
};
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginTop: 4 }}>
    {children}
  </div>
);
const BTN_BASE: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '9px 18px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700,
  cursor: 'pointer',
};
const APPROVE_BTN: React.CSSProperties = { ...BTN_BASE, background: '#16A34A', color: '#fff' };
const INFO_BTN:    React.CSSProperties = { ...BTN_BASE, background: '#7C3AED', color: '#fff' };
const REJECT_BTN:  React.CSSProperties = { ...BTN_BASE, background: '#DC2626', color: '#fff' };

// ─── Main page ────────────────────────────────────────────────────────────
const KycReview: React.FC = () => {
  const { t } = useLanguage();
  const [tab, setTab]               = useState<Tab>('kyc');
  const [kycRows, setKycRows]       = useState<KycRow[]>([]);
  const [kybRows, setKybRows]       = useState<KybRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [stats, setStats]           = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [selected, setSelected]     = useState<KycRow | KybRow | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    const statusParam = statusFilter === 'all' ? '' : statusFilter;
    if (tab === 'kyc') {
      const res = await api.listKYC(statusParam);
      setLoading(false);
      if (!res?.success) { setError(res?.message || t('kyc.failedToLoad')); setKycRows([]); return; }
      const data = res.data || {};
      const rows = (data.submissions || []) as KycRow[];
      setKycRows(rows);
      setStats({ total: Number(data.total) || rows.length, pending: Number(data.pending) || 0, approved: Number(data.approved) || 0, rejected: Number(data.rejected) || 0 });
    } else {
      const res = await api.listKYB(statusParam);
      setLoading(false);
      if (!res?.success) { setError(res?.message || t('kyc.failedToLoad')); setKybRows([]); return; }
      const data = res.data || {};
      const rows = (data.submissions || []) as KybRow[];
      setKybRows(rows);
      setStats({ total: Number(data.total) || rows.length, pending: Number(data.pending) || 0, approved: Number(data.approved) || 0, rejected: Number(data.rejected) || 0 });
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab, statusFilter]);

  const filteredKyc = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return kycRows;
    return kycRows.filter(s =>
      String(s.id).includes(q) || String(s.user_id).includes(q) ||
      (s.full_name || '').toLowerCase().includes(q) ||
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
      (s.rep_name || '').toLowerCase().includes(q)
    );
  }, [kybRows, searchQuery]);

  const statCards = [
    { label: 'Total',    value: stats.total,    color: '#1B3A5C', icon: <FileText     size={20} color="#fff" /> },
    { label: t('kyc.pendingReview'),  value: stats.pending,  color: '#E65100', icon: <Clock        size={20} color="#fff" /> },
    { label: t('kyc.approved'), value: stats.approved, color: '#16A34A', icon: <CheckCircle  size={20} color="#fff" /> },
    { label: t('kyc.rejected'), value: stats.rejected, color: '#DC2626', icon: <XCircle      size={20} color="#fff" /> },
  ];

  const ROW_HOVER: React.CSSProperties = { cursor: 'pointer' };

  return (
    <div style={{ padding: 32, background: '#F5F7FA', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B3A5C', margin: 0 }}>{t('kyc.title')}</h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 24 }}>
        Review and manage identity and business verification submissions
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid #E5E7EB' }}>
        {(['kyc', 'kyb'] as Tab[]).map(tabKey => (
          <button key={tabKey} onClick={() => setTab(tabKey)} style={{
            padding: '10px 20px', border: 'none', background: 'transparent', fontFamily: 'Inter, sans-serif',
            fontSize: 14, fontWeight: tab === tabKey ? 700 : 500, color: tab === tabKey ? '#1B3A5C' : '#6B7280',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            borderBottom: tab === tabKey ? '2px solid #1B3A5C' : '2px solid transparent', marginBottom: -2,
          }}>
            {tabKey === 'kyc' ? <User size={15} /> : <Building2 size={15} />}
            {tabKey === 'kyc' ? t('kyc.kycTab') : t('kyc.kybTab')}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {statCards.map(c => (
          <div key={c.label} style={{ flex: 1, minWidth: 180, background: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
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
          style={{ padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, background: '#fff', cursor: 'pointer' }}>
          <option value="pending">{t('kyc.pendingReview')}</option>
          <option value="needs_more_info">{t('kyc.needsMoreInfo')}</option>
          <option value="approved">{t('kyc.approved')}</option>
          <option value="rejected">{t('kyc.rejected')}</option>
          <option value="all">All statuses</option>
        </select>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 11, top: 10 }} />
          <input type="text"
            placeholder={t('kyc.searchPlaceholder')}
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={load}
          style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 700, color: '#1B3A5C', fontSize: 13 }}>
          {t('common.refresh')}
        </button>
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1B3A5C', marginRight: 'auto' }}>
            {tab === 'kyc' ? t('kyc.kycTab') : t('kyc.kybTab')}
          </span>
          {loading && <span style={{ color: '#6B7280', fontWeight: 600, fontSize: 13 }}>{t('common.loading')}</span>}
          {error   && <span style={{ color: '#C62828', fontWeight: 700, fontSize: 13 }}>{error}</span>}
        </div>

        {tab === 'kyc' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', t('kyc.columns.userId'), t('kyc.columns.name'), t('kyc.columns.level'), t('kyc.columns.idType'), t('kyc.columns.status'), t('kyc.columns.submitted'), ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredKyc.map(row => (
                <tr key={row.id} onClick={() => setSelected(row)} style={ROW_HOVER}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1B3A5C', borderBottom: '1px solid #F3F4F6' }}>#{row.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>#{row.user_id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#111827', borderBottom: '1px solid #F3F4F6' }}>{row.full_name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ ...BADGE, ...levelBadge(row.kyc_level) }}>{row.kyc_level || 'L1'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ fontWeight: 500 }}>{row.id_type || '—'}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{row.id_number || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ ...BADGE, ...badgeStyle(row.status) }}>{badgeLabel(row.status)}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' }}>{fmtDate(row.submitted_at || row.created_at)}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#1B3A5C' }}>
                      {t('common.view')} <ChevronRight size={14} />
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !error && filteredKyc.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>{t('kyc.noRecords')}</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', t('kyc.columns.userId'), t('kyc.columns.company'), t('kyc.columns.rccm'), t('kyc.columns.rep'), t('kyc.columns.status'), t('kyc.columns.submitted'), ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredKyb.map(row => (
                <tr key={row.id} onClick={() => setSelected(row)} style={ROW_HOVER}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1B3A5C', borderBottom: '1px solid #F3F4F6' }}>#{row.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>#{row.user_id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ fontWeight: 700, color: '#1B3A5C' }}>{row.company_name || '—'}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{row.sector || ''}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{row.city || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, borderBottom: '1px solid #F3F4F6' }}>
                    <div><b>RCCM:</b> {row.rccm_number || '—'}</div>
                    <div><b>NIU:</b> {row.niu || '—'}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ fontWeight: 600 }}>{row.rep_name || '—'}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{row.rep_title || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ ...BADGE, ...badgeStyle(row.status) }}>{badgeLabel(row.status)}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' }}>{fmtDate(row.submitted_at || row.created_at)}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#1B3A5C' }}>
                      {t('common.view')} <ChevronRight size={14} />
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !error && filteredKyb.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>{t('kyc.noRecords')}</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailModal
          tab={tab}
          row={selected}
          onClose={() => setSelected(null)}
          onRefresh={load}
        />
      )}
    </div>
  );
};

export default KycReview;
