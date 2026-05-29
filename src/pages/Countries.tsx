import React, { useState } from 'react';
import { Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { countries as initialCountries, Country } from '../data/mockData';

const s = {
  page: { padding: 32, fontFamily: 'Inter, sans-serif' } as React.CSSProperties,
  header: { marginBottom: 28 } as React.CSSProperties,
  title: { fontSize: 26, fontWeight: 800, color: '#1B3A5C', margin: 0 } as React.CSSProperties,
  subtitle: { fontSize: 14, color: '#7C8D9E', marginTop: 4 } as React.CSSProperties,
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 } as React.CSSProperties,
  statCard: { background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } as React.CSSProperties,
  statLabel: { fontSize: 12, color: '#7C8D9E', marginBottom: 4 } as React.CSSProperties,
  statValue: { fontSize: 24, fontWeight: 700, color: '#1B3A5C' } as React.CSSProperties,
  toolbar: { display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' } as React.CSSProperties,
  searchBox: { flex: 1, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, padding: '10px 16px', border: '1px solid #E0E6ED' } as React.CSSProperties,
  searchInput: { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'Inter, sans-serif', marginLeft: 8 } as React.CSSProperties,
  table: { width: '100%', borderCollapse: 'collapse' as const, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  th: { textAlign: 'left' as const, padding: '14px 16px', fontSize: 12, fontWeight: 600, color: '#7C8D9E', borderBottom: '1px solid #E0E6ED', background: '#F8FAFB' },
  td: { padding: '14px 16px', fontSize: 14, color: '#1B3A5C', borderBottom: '1px solid #F0F2F5' },
  badge: (color: string, bg: string) => ({ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color, background: bg }),
  toggle: (active: boolean) => ({ cursor: 'pointer', color: active ? '#43A047' : '#AAB8C6', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }),
  providerTag: { display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, background: '#EDF1F5', color: '#1B3A5C', marginRight: 4, marginBottom: 4 } as React.CSSProperties,
};

export default function Countries() {
  const [countryList, setCountryList] = useState<Country[]>(initialCountries);
  const [search, setSearch] = useState('');

  const filtered = countryList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const active = countryList.filter(c => c.status === 'active').length;
  const regAllowed = countryList.filter(c => c.registrationAllowed).length;
  const sendAllowed = countryList.filter(c => c.sendAllowed).length;

  const toggleField = (code: string, field: 'status' | 'registrationAllowed' | 'sendAllowed') => {
    setCountryList(prev => prev.map(c => {
      if (c.code !== code) return c;
      if (field === 'status') return { ...c, status: c.status === 'active' ? 'disabled' : 'active' };
      return { ...c, [field]: !c[field] };
    }));
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Countries</h1>
        <p style={s.subtitle}>Manage supported countries and mobile money providers</p>
      </div>

      <div style={s.statsRow}>
        <div style={s.statCard}><div style={s.statLabel}>Total Countries</div><div style={s.statValue}>{countryList.length}</div></div>
        <div style={s.statCard}><div style={s.statLabel}>Active</div><div style={s.statValue}>{active}</div></div>
        <div style={s.statCard}><div style={s.statLabel}>Registration Allowed</div><div style={s.statValue}>{regAllowed}</div></div>
        <div style={s.statCard}><div style={s.statLabel}>Send Allowed</div><div style={s.statValue}>{sendAllowed}</div></div>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchBox}>
          <Search size={16} color="#7C8D9E" />
          <input style={s.searchInput} placeholder="Search country..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Country</th>
            <th style={s.th}>Dial Code</th>
            <th style={s.th}>Mobile Money Providers</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Registration</th>
            <th style={s.th}>Send Money</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.code} style={{ transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFB')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
              <td style={s.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{c.flag}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#7C8D9E' }}>{c.code}</div>
                  </div>
                </div>
              </td>
              <td style={s.td}>{c.dial}</td>
              <td style={s.td}>
                <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 280 }}>
                  {c.mobileMoneyProviders.map(p => <span key={p} style={s.providerTag}>{p}</span>)}
                </div>
              </td>
              <td style={s.td}>
                <div style={s.toggle(c.status === 'active')} onClick={() => toggleField(c.code, 'status')}>
                  {c.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {c.status === 'active' ? 'Active' : 'Disabled'}
                </div>
              </td>
              <td style={s.td}>
                <div style={s.toggle(c.registrationAllowed)} onClick={() => toggleField(c.code, 'registrationAllowed')}>
                  {c.registrationAllowed ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {c.registrationAllowed ? 'Allowed' : 'Blocked'}
                </div>
              </td>
              <td style={s.td}>
                <div style={s.toggle(c.sendAllowed)} onClick={() => toggleField(c.code, 'sendAllowed')}>
                  {c.sendAllowed ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {c.sendAllowed ? 'Allowed' : 'Blocked'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
