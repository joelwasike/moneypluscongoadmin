import React, { useState } from 'react';
import { DollarSign, Edit2, Save, Plus, X } from 'lucide-react';
import { feeConfigs as initialFees, FeeConfig } from '../data/mockData';

const emptyFee: Omit<FeeConfig, 'id'> = {
  service: '',
  type: 'percentage',
  value: 0,
  minFee: 0,
  maxFee: 0,
  currency: 'CDF',
  enabled: true,
};

const FeesCharges: React.FC = () => {
  const [fees, setFees] = useState<FeeConfig[]>(initialFees.map((f) => ({ ...f })));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [tempMin, setTempMin] = useState<number>(0);
  const [tempMax, setTempMax] = useState<number>(0);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFee, setNewFee] = useState<Omit<FeeConfig, 'id'>>({ ...emptyFee });

  const handleEdit = (row: FeeConfig) => {
    setEditingId(row.id);
    setTempValue(row.value);
    setTempMin(row.minFee);
    setTempMax(row.maxFee);
  };

  const handleSave = (id: string) => {
    setFees((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, value: tempValue, minFee: tempMin, maxFee: tempMax } : f
      )
    );
    setEditingId(null);
  };

  const handleToggleEnabled = (id: string) => {
    setFees((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleAddFee = () => {
    if (!newFee.service.trim()) return;
    const nextId = `FEE${String(fees.length + 1).padStart(3, '0')}`;
    setFees((prev) => [{ ...newFee, id: nextId }, ...prev]);
    setNewFee({ ...emptyFee });
    setShowNewForm(false);
  };

  const activeCount = fees.filter((f) => f.enabled).length;

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
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 20px',
      borderRadius: 8,
      border: 'none',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#43A047',
      color: '#FFFFFF',
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
      width: 90,
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#374151',
      outline: 'none',
    },
    inputDisabled: {
      width: 90,
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #E5E7EB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#6B7280',
      backgroundColor: '#F9FAFB',
      outline: 'none',
    },
    inputWide: {
      width: 200,
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#374151',
      outline: 'none',
    },
    select: {
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      color: '#374151',
      outline: 'none',
      backgroundColor: '#FFFFFF',
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
    btnCancel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid #D1D5DB',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#FFFFFF',
      color: '#6B7280',
      marginLeft: 6,
    },
    btnConfirmAdd: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 6,
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: '#1B3A5C',
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
    typeBadge: {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
    },
    summary: {
      marginTop: 24,
      padding: '14px 24px',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      fontSize: 14,
      color: '#374151',
    },
    newFormRow: {
      backgroundColor: '#F0FFF4',
    },
  };

  const typeBadgeColor = (type: string): React.CSSProperties => {
    if (type === 'percentage') return { ...styles.typeBadge, backgroundColor: '#E8F5E9', color: '#2E7D32' };
    if (type === 'flat') return { ...styles.typeBadge, backgroundColor: '#E3F2FD', color: '#1565C0' };
    return { ...styles.typeBadge, backgroundColor: '#FFF3E0', color: '#E65100' };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Fees & Charges</h1>
          <p style={styles.subtitle}>Configure service fees and pricing</p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => {
            setShowNewForm(true);
            setNewFee({ ...emptyFee });
          }}
        >
          <Plus size={16} />
          Add New Fee
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <DollarSign size={18} color="#1B3A5C" />
          <span style={styles.cardTitle}>Fee Configurations</span>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Min Fee</th>
              <th style={styles.th}>Max Fee</th>
              <th style={styles.th}>Currency</th>
              <th style={styles.th}>Enabled</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showNewForm && (
              <tr style={styles.newFormRow}>
                <td style={styles.td}>
                  <input
                    style={styles.inputWide}
                    type="text"
                    placeholder="Service name"
                    value={newFee.service}
                    onChange={(e) => setNewFee({ ...newFee, service: e.target.value })}
                  />
                </td>
                <td style={styles.td}>
                  <select
                    style={styles.select}
                    value={newFee.type}
                    onChange={(e) =>
                      setNewFee({ ...newFee, type: e.target.value as FeeConfig['type'] })
                    }
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                    <option value="tiered">Tiered</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    value={newFee.value}
                    onChange={(e) => setNewFee({ ...newFee, value: parseFloat(e.target.value) || 0 })}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    value={newFee.minFee}
                    onChange={(e) => setNewFee({ ...newFee, minFee: parseFloat(e.target.value) || 0 })}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    value={newFee.maxFee}
                    onChange={(e) => setNewFee({ ...newFee, maxFee: parseFloat(e.target.value) || 0 })}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    style={{ ...styles.input, width: 60 }}
                    type="text"
                    value={newFee.currency}
                    onChange={(e) => setNewFee({ ...newFee, currency: e.target.value })}
                  />
                </td>
                <td style={styles.td}>
                  <button
                    style={{
                      ...styles.toggle,
                      backgroundColor: newFee.enabled ? '#43A047' : '#D1D5DB',
                    }}
                    onClick={() => setNewFee({ ...newFee, enabled: !newFee.enabled })}
                  >
                    <div
                      style={{
                        ...styles.toggleKnob,
                        left: newFee.enabled ? 22 : 2,
                      }}
                    />
                  </button>
                </td>
                <td style={styles.td}>
                  <button style={styles.btnConfirmAdd} onClick={handleAddFee}>
                    <Plus size={14} />
                    Add
                  </button>
                  <button style={styles.btnCancel} onClick={() => setShowNewForm(false)}>
                    <X size={14} />
                    Cancel
                  </button>
                </td>
              </tr>
            )}
            {fees.map((f) => {
              const isEditing = editingId === f.id;
              return (
                <tr key={f.id}>
                  <td style={{ ...styles.td, fontWeight: 500 }}>{f.service}</td>
                  <td style={styles.td}>
                    <span style={typeBadgeColor(f.type)}>
                      {f.type.charAt(0).toUpperCase() + f.type.slice(1)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <input
                        style={styles.input}
                        type="number"
                        step="0.01"
                        value={tempValue}
                        onChange={(e) => setTempValue(parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <input
                        style={styles.inputDisabled}
                        type="text"
                        value={f.type === 'percentage' ? `${f.value}%` : f.value.toString()}
                        readOnly
                      />
                    )}
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <input
                        style={styles.input}
                        type="number"
                        step="0.01"
                        value={tempMin}
                        onChange={(e) => setTempMin(parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <input style={styles.inputDisabled} type="text" value={f.minFee.toString()} readOnly />
                    )}
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <input
                        style={styles.input}
                        type="number"
                        step="0.01"
                        value={tempMax}
                        onChange={(e) => setTempMax(parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <input style={styles.inputDisabled} type="text" value={f.maxFee.toString()} readOnly />
                    )}
                  </td>
                  <td style={styles.td}>{f.currency}</td>
                  <td style={styles.td}>
                    <button
                      style={{
                        ...styles.toggle,
                        backgroundColor: f.enabled ? '#43A047' : '#D1D5DB',
                      }}
                      onClick={() => handleToggleEnabled(f.id)}
                    >
                      <div
                        style={{
                          ...styles.toggleKnob,
                          left: f.enabled ? 22 : 2,
                        }}
                      />
                    </button>
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <button style={styles.btnSave} onClick={() => handleSave(f.id)}>
                        <Save size={14} />
                        Save
                      </button>
                    ) : (
                      <button style={styles.btnEdit} onClick={() => handleEdit(f)}>
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

      <div style={styles.summary}>
        <strong>Total active fee configurations:</strong> {activeCount}
      </div>
    </div>
  );
};

export default FeesCharges;
