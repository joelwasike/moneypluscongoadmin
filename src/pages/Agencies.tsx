import React, { useState, useEffect } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, Trash2, Store, Search } from 'lucide-react';
import api from '../services/api';

interface Agency {
  id: number;
  code: string;
  type: string;
  name: string;
  city: string;
  address: string;
  gps_lat: number;
  gps_lng: number;
  manager_name: string;
  manager_phone: string;
  cash_limit: number;
  opening_hours: string;
  status: string;
  agent_user_id: number;
}

const emptyForm = (): Partial<Agency> => ({
  type: 'agency',
  name: '',
  city: '',
  address: '',
  manager_name: '',
  manager_phone: '',
  cash_limit: 500000,
  opening_hours: '08:00-18:00',
});

const Agencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Agency | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async (city = '') => {
    const params = city ? `city=${encodeURIComponent(city)}` : '';
    const res = await api.listAgencies(params);
    if (res.success) setAgencies(res.data || []);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setError('');
    setShowForm(true);
  };

  const openEdit = (a: Agency) => {
    setEditing(a);
    setForm({ ...a });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.city) {
      setError('Name and city are required.');
      return;
    }
    setSaving(true);
    setError('');
    const res = editing
      ? await api.updateAgency(editing.id, form)
      : await api.createAgency(form);
    setSaving(false);
    if (res.success) {
      setShowForm(false);
      load();
    } else {
      setError(res.message || 'Failed to save');
    }
  };

  const handleToggle = async (a: Agency) => {
    await api.toggleAgency(a.id);
    load();
  };

  const handleDelete = async (a: Agency) => {
    if (!window.confirm(`Delete agency ${a.name}?`)) return;
    await api.deleteAgency(a.id);
    load();
  };

  const f = (v: any) => form[v as keyof typeof form];
  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const filtered = agencies.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.code?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = agencies.filter(a => a.status === 'active').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Store size={22} /> Agency Network
          </h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
            {agencies.length} total · {activeCount} active cash-in/cash-out points
          </p>
        </div>
        <button onClick={openCreate} style={btnStyle('#1B3A5C')}>
          <Plus size={16} /> Add Agency
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city or code…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalStyle}>
            <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>
              {editing ? `Edit – ${editing.name}` : 'New Agency'}
            </h3>

            <div style={grid2}>
              <div>
                <label style={labelStyle}>Type</label>
                <select value={f('type') as string} onChange={e => set('type', e.target.value)} style={inputStyle}>
                  <option value="agency">Agency</option>
                  <option value="partner_branch">Partner Branch</option>
                  <option value="mobile_agent">Mobile Agent</option>
                </select>
              </div>
              <Field label="Name" value={f('name') as string} onChange={v => set('name', v)} placeholder="MoneyPlus Brazzaville Nord" />
              <Field label="City" value={f('city') as string} onChange={v => set('city', v)} placeholder="Brazzaville" />
              <Field label="Address" value={f('address') as string} onChange={v => set('address', v)} placeholder="Av. de l'Indépendance" />
              <Field label="Manager Name" value={f('manager_name') as string} onChange={v => set('manager_name', v)} placeholder="Jean Mbemba" />
              <Field label="Manager Phone" value={f('manager_phone') as string} onChange={v => set('manager_phone', v)} placeholder="+242 06 123 4567" />
              <Field label="Cash Limit (XAF)" value={f('cash_limit') as number} onChange={v => set('cash_limit', parseFloat(v) || 0)} type="number" />
              <Field label="Opening Hours" value={f('opening_hours') as string} onChange={v => set('opening_hours', v)} placeholder="08:00-18:00" />
              <Field label="GPS Lat" value={f('gps_lat') as number} onChange={v => set('gps_lat', parseFloat(v) || 0)} type="number" placeholder="-4.2634" />
              <Field label="GPS Lng" value={f('gps_lng') as number} onChange={v => set('gps_lng', parseFloat(v) || 0)} type="number" placeholder="15.2429" />
              <Field label="Agent User ID (optional)" value={f('agent_user_id') as number} onChange={v => set('agent_user_id', parseInt(v) || 0)} type="number" />
            </div>

            {error && <p style={{ color: '#c62828', fontSize: 13, margin: '12px 0 0' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowForm(false)} style={btnStyle('#888')}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={btnStyle('#43A047')}>
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
              <th style={th}>Code</th>
              <th style={th}>Name</th>
              <th style={th}>City</th>
              <th style={th}>Type</th>
              <th style={th}>Manager</th>
              <th style={th}>Cash Limit</th>
              <th style={th}>Hours</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={td}><code style={{ fontSize: 11 }}>{a.code}</code></td>
                <td style={td}><strong>{a.name}</strong></td>
                <td style={td}>{a.city}</td>
                <td style={td}><span style={badge('#EDE7F6', '#4527A0')}>{a.type}</span></td>
                <td style={td}>
                  <div style={{ fontSize: 12 }}>{a.manager_name}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{a.manager_phone}</div>
                </td>
                <td style={td}>{(a.cash_limit / 1000).toFixed(0)}k XAF</td>
                <td style={td}>{a.opening_hours}</td>
                <td style={td}>
                  <span style={a.status === 'active' ? badge('#E8F5E9', '#2E7D32') : badge('#FFEBEE', '#C62828')}>
                    {a.status}
                  </span>
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <IconBtn title="Edit" onClick={() => openEdit(a)}><Edit2 size={14} /></IconBtn>
                    <IconBtn title={a.status === 'active' ? 'Suspend' : 'Activate'} onClick={() => handleToggle(a)}>
                      {a.status === 'active' ? <ToggleRight size={14} color="#43A047" /> : <ToggleLeft size={14} color="#999" />}
                    </IconBtn>
                    <IconBtn title="Delete" onClick={() => handleDelete(a)}><Trash2 size={14} color="#c62828" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#999' }}>No agencies found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder = '', type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
  </div>
);

const IconBtn = ({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) => (
  <button onClick={onClick} title={title} style={{ background: 'none', border: '1px solid #eee', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
    {children}
  </button>
);

const btnStyle = (bg: string): React.CSSProperties => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px',
  cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
});

const badge = (bg: string, color: string): React.CSSProperties => ({
  background: bg, color, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
});

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' };
const th: React.CSSProperties = { textAlign: 'left', padding: '11px 14px', fontSize: 12, fontWeight: 600, color: '#666' };
const td: React.CSSProperties = { padding: '11px 14px', fontSize: 13 };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalStyle: React.CSSProperties = { background: '#fff', borderRadius: 14, padding: 28, width: 640, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' };

export default Agencies;
