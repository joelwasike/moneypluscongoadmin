import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { kycSubmissions as initialKycSubmissions, KycSubmission } from '../data/mockData';

const KycReview: React.FC = () => {
  const [submissions, setSubmissions] = useState<KycSubmission[]>(
    initialKycSubmissions.map((s) => ({ ...s }))
  );
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(initialKycSubmissions.map((s) => [s.id, s.notes]))
  );

  const total = submissions.length;
  const pending = submissions.filter((s) => s.status === 'pending').length;
  const approved = submissions.filter((s) => s.status === 'approved').length;
  const rejected = submissions.filter((s) => s.status === 'rejected').length;

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'approved' as const, notes: notes[id] || s.notes } : s
      )
    );
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'rejected' as const, notes: notes[id] || s.notes } : s
      )
    );
  };

  const handleNotesChange = (id: string, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
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
      marginBottom: 28,
    },
    statCard: {
      flex: 1,
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
      gap: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#1B3A5C',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      textAlign: 'left' as const,
      padding: '12px 16px',
      fontSize: 12,
      fontWeight: 600,
      color: '#6B7280',
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      borderBottom: '1px solid #E5E7EB',
      backgroundColor: '#F9FAFB',
    },
    td: {
      padding: '12px 16px',
      fontSize: 14,
      color: '#374151',
      borderBottom: '1px solid #F3F4F6',
      verticalAlign: 'middle' as const,
    },
    badgePending: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: '#FFF3E0',
      color: '#E65100',
    },
    badgeApproved: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: '#E8F5E9',
      color: '#2E7D32',
    },
    badgeRejected: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: '#FFEBEE',
      color: '#C62828',
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
    notesInput: {
      width: '100%',
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#374151',
      outline: 'none',
      minWidth: 160,
    },
    statusText: {
      fontSize: 13,
      fontWeight: 600,
      fontStyle: 'italic',
    },
  };

  const badgeStyle = (status: string): React.CSSProperties => {
    if (status === 'pending') return styles.badgePending;
    if (status === 'approved') return styles.badgeApproved;
    return styles.badgeRejected;
  };

  const statCards = [
    { label: 'Total Submissions', value: total, color: '#1B3A5C', icon: <FileText size={22} color="#FFFFFF" /> },
    { label: 'Pending', value: pending, color: '#E65100', icon: <Clock size={22} color="#FFFFFF" /> },
    { label: 'Approved', value: approved, color: '#43A047', icon: <CheckCircle size={22} color="#FFFFFF" /> },
    { label: 'Rejected', value: rejected, color: '#E53935', icon: <XCircle size={22} color="#FFFFFF" /> },
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>KYC Review</h1>
      <p style={styles.subtitle}>Review and manage identity verification</p>

      <div style={styles.statsRow}>
        {statCards.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statIconWrap, backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Search size={18} color="#1B3A5C" />
          <span style={styles.cardTitle}>KYC Submissions</span>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Country</th>
              <th style={styles.th}>Document Type</th>
              <th style={styles.th}>Submitted Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td style={styles.td}>{s.id}</td>
                <td style={{ ...styles.td, fontWeight: 500 }}>{s.userName}</td>
                <td style={styles.td}>{s.country}</td>
                <td style={styles.td}>{s.documentType}</td>
                <td style={styles.td}>{s.submittedAt}</td>
                <td style={styles.td}>
                  <span style={badgeStyle(s.status)}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
                <td style={styles.td}>
                  <input
                    style={styles.notesInput}
                    type="text"
                    value={notes[s.id] ?? ''}
                    onChange={(e) => handleNotesChange(s.id, e.target.value)}
                    placeholder="Add notes..."
                  />
                </td>
                <td style={styles.td}>
                  {s.status === 'pending' ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button style={styles.btnApprove} onClick={() => handleApprove(s.id)}>
                        Approve
                      </button>
                      <button style={styles.btnReject} onClick={() => handleReject(s.id)}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      style={{
                        ...styles.statusText,
                        color: s.status === 'approved' ? '#43A047' : '#E53935',
                      }}
                    >
                      {s.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KycReview;
