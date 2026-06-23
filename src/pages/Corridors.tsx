import React, { useState, useEffect } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, Trash2, Route } from 'lucide-react';
import api from '../services/api';

interface Corridor {
  id: number;
  country_code: string;
  country_name: string;
  country_flag: string;
  dest_currency: string;
  partner_name: string;
  outbound_rail: string;
  fee_percent: number;
  fee_min: number;
  fee_max: number;
  fx_spread: number;
  settlement_time: string;
  region: string;
  is_active: boolean;
}

const emptyForm = (): Partial<Corridor> => ({
  country_code: '',
  country_name: '',
  country_flag: '',
  dest_currency: '',
  partner_name: '',
  outbound_rail: '',
  fee_percent: 1.5,
  fee_min: 500,
  fee_max: 50000,
  fx_spread: 0.015,
  settlement_time: 'T+1',
  region: '',
  is_active: true,
});

const Corridors: React.FC = () => {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Corridor | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await api.listCorridors();
    if (res.success) setCorridors(res.data || []);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setError('');
    setShowForm(true);
  };

  const openEdit = (c: Corridor) => {
    setEditing(c);
    setForm({ ...c });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.country_code || !form.country_name || !form.dest_currency) {
      setError('Country code, name, and destination currency are required.');
      return;
    }
    setSaving(true);
    setError('');
    const res = editing
      ? await api.updateCorridor(editing.id, form)
      : await api.createCorridor(form);
    setSaving(false);
    if (res.success) {
      setShowForm(false);
      load();
    } else {
      setError(res.message || 'Failed to save');
    }
  };

  const handleToggle = async (c: Corridor) => {
    await api.toggleCorridor(c.id);
    load();
  };

  const handleDelete = async (c: Corridor) => {
    if (!window.confirm(`Delete corridor for ${c.country_name}? This cannot be undone.`)) return;
    await api.deleteCorridor(c.id);
    load();
  };

  const f = (v: any) => form[v as keyof typeof form];
  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Route size={22} /> Remittance Corridors
          </h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
            Configure fee structures and FX spreads for each destination corridor.
          </p>
        </div>
        <button onClick={openCreate} style={btn('#1B3A5C')}>
          <Plus size={16} /> Add Corridor
        </button>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>
              {editing ? 'Edit Corridor' : 'New Corridor'}
            </h3>

            <div style={grid2}>
              <Field label="Country Code (ISO 2)" value={f('country_code') as string} onChange={v => set('country_code', v.toUpperCase())} placeholder="FR" disabled={!!editing} />
              <Field label="Country Name" value={f('country_name') as string} onChange={v => set('country_name', v)} placeholder="France" />
              <Field label="Flag Emoji" value={f('country_flag') as string} onChange={v => set('country_flag', v)} placeholder="🇫🇷" />
              <Field label="Dest Currency" value={f('dest_currency') as string} onChange={v => set('dest_currency', v.toUpperCase())} placeholder="EUR" />
              <Field label="Partner Name" value={f('partner_name') as string} onChange={v => set('partner_name', v)} placeholder="WorldRemit" />
              <Field label="Outbound Rail" value={f('outbound_rail') as string} onChange={v => set('outbound_rail', v)} placeholder="SWIFT / MoMo" />
              <Field label="Fee %" value={f('fee_percent') as number} onChange={v => set('fee_percent', parseFloat(v) || 0)} type="number" />
              <Field label="Fee Min (XAF)" value={f('fee_min') as number} onChange={v => set('fee_min', parseFloat(v) || 0)} type="number" />
              <Field label="Fee Max (XAF)" value={f('fee_max') as number} onChange={v => set('fee_max', parseFloat(v) || 0)} type="number" />
              <Field label="FX Spread (0.015 = 1.5%)" value={f('fx_spread') as number} onChange={v => set('fx_spread', parseFloat(v) || 0)} type="number" />
              <Field label="Settlement Time" value={f('settlement_time') as string} onChange={v => set('settlement_time', v)} placeholder="T+1" />
              <Field label="Region" value={f('region') as string} onChange={v => set('region', v)} placeholder="EU / Africa / Asia" />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0', fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!f('is_active')} onChange={e => set('is_active', e.target.checked)} />
              Active (visible to users)
            </label>

            {error && <p style={{ color: '#c62828', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={btn('#888')}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={btn('#43A047')}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', background: '#fafafa' }}>
              <th style={th}>Country</th>
              <th style={th}>Currency</th>
              <th style={th}>Partner</th>
              <th style={th}>Fee</th>
              <th style={th}>FX Spread</th>
              <th style={th}>Settlement</th>
              <th style={th}>Region</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {corridors.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={td}>
                  <span style={{ marginRight: 6 }}>{c.country_flag}</span>
                  <strong>{c.country_name}</strong>
                  <span style={{ color: '#999', fontSize: 11, marginLeft: 6 }}>{c.country_code}</span>
                </td>
                <td style={td}>{c.dest_currency}</td>
                <td style={td}>{c.partner_name}</td>
                <td style={td}>
                  {c.fee_percent}%
                  <span style={{ color: '#999', fontSize: 11 }}> ({(c.fee_min / 1000).toFixed(0)}k–{(c.fee_max / 1000).toFixed(0)}k)</span>
                </td>
                <td style={td}>{(c.fx_spread * 100).toFixed(2)}%</td>
                <td style={td}>{c.settlement_time}</td>
                <td style={td}><span style={badge('#E3F2FD', '#1565C0')}>{c.region}</span></td>
                <td style={td}>
                  <span style={c.is_active ? badge('#E8F5E9', '#2E7D32') : badge('#FFEBEE', '#C62828')}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <IconBtn title="Edit" onClick={() => openEdit(c)}><Edit2 size={14} /></IconBtn>
                    <IconBtn title={c.is_active ? 'Deactivate' : 'Activate'} onClick={() => handleToggle(c)}>
                      {c.is_active ? <ToggleRight size={14} color="#43A047" /> : <ToggleLeft size={14} color="#999" />}
                    </IconBtn>
                    <IconBtn title="Delete" onClick={() => handleDelete(c)}><Trash2 size={14} color="#c62828" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
            {corridors.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#999' }}>No corridors configured yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder = '', type = 'text', disabled = false }: {
  label: string; value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) => (
  <div>
    <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', background: disabled ? '#f5f5f5' : '#fff' }}
    />
  </div>
);

const IconBtn = ({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) => (
  <button onClick={onClick} title={title} style={{ background: 'none', border: '1px solid #eee', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
    {children}
  </button>
);

const btn = (bg: string): React.CSSProperties => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px',
  cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
});

const badge = (bg: string, color: string): React.CSSProperties => ({
  background: bg, color, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
});

const th: React.CSSProperties = { textAlign: 'left', padding: '11px 14px', fontSize: 12, fontWeight: 600, color: '#666' };
const td: React.CSSProperties = { padding: '11px 14px', fontSize: 13 };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modal: React.CSSProperties = { background: '#fff', borderRadius: 14, padding: 28, width: 640, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' };

export default Corridors;
