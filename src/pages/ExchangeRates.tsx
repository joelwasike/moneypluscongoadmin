import React, { useState } from 'react';
import { RefreshCw, DollarSign, Info, Edit2, Save } from 'lucide-react';
import { exchangeRates as initialRates, ExchangeRate } from '../data/mockData';

const ExchangeRates: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>(
    initialRates.map((r) => ({ ...r }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<number>(0);
  const [tempSpread, setTempSpread] = useState<number>(0);

  const handleEdit = (row: ExchangeRate) => {
    setEditingId(row.id);
    setTempRate(row.rate);
    setTempSpread(row.spread);
  };

  const handleSave = (id: string) => {
    setRates((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              rate: tempRate,
              spread: tempSpread,
              lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : r
      )
    );
    setEditingId(null);
  };

  const handleToggleAuto = (id: string) => {
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, autoUpdate: !r.autoUpdate } : r))
    );
  };

  const handleRefreshAll = () => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setRates((prev) => prev.map((r) => ({ ...r, lastUpdated: now })));
  };

  const styles: Record<string, React.CSSProperties> = {
    page: {
      padding: 32,
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
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
    },
    refreshBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 20px',
      borderRadius: 8,
      border: 'none',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#1B3A5C',
      color: '#FFFFFF',
    },
    infoBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#E3F2FD',
      borderRadius: 10,
      padding: '14px 20px',
      marginBottom: 24,
      border: '1px solid #90CAF9',
    },
    infoBannerText: {
      fontSize: 14,
      color: '#1565C0',
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
    input: {
      width: 100,
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#374151',
      outline: 'none',
    },
    inputDisabled: {
      width: 100,
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #E5E7EB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#6B7280',
      backgroundColor: '#F9FAFB',
      outline: 'none',
    },
    btnEdit: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#FFFFFF',
      color: '#1B3A5C',
    },
    btnSave: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 6,
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#43A047',
      color: '#FFFFFF',
    },
    toggle: {
      position: 'relative' as const,
      width: 44,
      height: 24,
      borderRadius: 12,
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      outline: 'none',
      transition: 'background-color 0.2s',
    },
    toggleKnob: {
      position: 'absolute' as const,
      top: 2,
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: '#FFFFFF',
      transition: 'left 0.2s',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
    currencyTag: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 13,
      fontWeight: 600,
      backgroundColor: '#F3F4F6',
      color: '#1B3A5C',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Exchange Rates</h1>
          <p style={styles.subtitle}>Manage currency conversion rates</p>
        </div>
        <button style={styles.refreshBtn} onClick={handleRefreshAll}>
          <RefreshCw size={16} />
          Refresh All Rates
        </button>
      </div>

      <div style={styles.infoBanner}>
        <Info size={20} color="#1565C0" />
        <span style={styles.infoBannerText}>
          Rates are updated automatically from external feeds. Manual overrides are possible.
        </span>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <DollarSign size={18} color="#1B3A5C" />
          <span style={styles.cardTitle}>Currency Rates</span>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Rate</th>
              <th style={styles.th}>Spread %</th>
              <th style={styles.th}>Last Updated</th>
              <th style={styles.th}>Auto-Update</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => {
              const isEditing = editingId === r.id;
              return (
                <tr key={r.id}>
                  <td style={styles.td}>
                    <span style={styles.currencyTag}>{r.fromCurrency}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.currencyTag}>{r.toCurrency}</span>
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <input
                        style={styles.input}
                        type="number"
                        step="0.01"
                        value={tempRate}
                        onChange={(e) => setTempRate(parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <input
                        style={styles.inputDisabled}
                        type="text"
                        value={r.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        readOnly
                      />
                    )}
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <input
                        style={{ ...styles.input, width: 70 }}
                        type="number"
                        step="0.1"
                        value={tempSpread}
                        onChange={(e) => setTempSpread(parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <input
                        style={{ ...styles.inputDisabled, width: 70 }}
                        type="text"
                        value={`${r.spread}%`}
                        readOnly
                      />
                    )}
                  </td>
                  <td style={styles.td}>{r.lastUpdated}</td>
                  <td style={styles.td}>
                    <button
                      style={{
                        ...styles.toggle,
                        backgroundColor: r.autoUpdate ? '#43A047' : '#D1D5DB',
                      }}
                      onClick={() => handleToggleAuto(r.id)}
                    >
                      <div
                        style={{
                          ...styles.toggleKnob,
                          left: r.autoUpdate ? 22 : 2,
                        }}
                      />
                    </button>
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <button style={styles.btnSave} onClick={() => handleSave(r.id)}>
                        <Save size={14} />
                        Save
                      </button>
                    ) : (
                      <button style={styles.btnEdit} onClick={() => handleEdit(r)}>
                        <Edit2 size={14} />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExchangeRates;
