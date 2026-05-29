import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, TrendingUp, Search } from 'lucide-react';
import api from '../services/api';

const Wallets: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.listWallets().then(res => { if (res.success) setData(res.data); });
  }, []);

  const wallets = (data?.wallets || []).filter((w: any) =>
    w.name.toLowerCase().includes(search.toLowerCase()) || String(w.user_id).includes(search)
  );

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700 }}>Wallet Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card label="Total Wallets" value={data?.total || 0} color="#1B3A5C" icon={<Wallet size={20} />} />
        <Card label="Fiat Wallets" value={data?.fiat || 0} color="#43A047" icon={<CreditCard size={20} />} />
        <Card label="Crypto Wallets" value={data?.crypto || 0} color="#FF9800" icon={<TrendingUp size={20} />} />
        <Card label="Total Balance" value={`${(data?.total_balance || 0).toLocaleString()} CDF`} color="#00B4D8" icon={<Wallet size={20} />} />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ position: 'relative', marginBottom: 16, maxWidth: 300 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#999' }} />
          <input placeholder="Search by name or user ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '2px solid #f0f0f0' }}>
            <th style={th}>ID</th><th style={th}>User ID</th><th style={th}>Name</th><th style={th}>Type</th><th style={th}>Currency</th><th style={th}>Balance</th><th style={th}>Status</th>
          </tr></thead>
          <tbody>
            {wallets.map((w: any) => (
              <tr key={w.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={td}>#{w.id}</td>
                <td style={td}>#{w.user_id}</td>
                <td style={{ ...td, fontWeight: 600 }}>{w.name}</td>
                <td style={td}><span style={{ background: w.type === 'fiat' ? '#E8F5E9' : '#F3E5F5', color: w.type === 'fiat' ? '#2E7D32' : '#7B1FA2', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{w.type}</span></td>
                <td style={td}>{w.currency}</td>
                <td style={{ ...td, fontWeight: 700 }}>{w.balance?.toLocaleString()}</td>
                <td style={td}><span style={{ background: w.is_active ? '#E8F5E9' : '#FFEBEE', color: w.is_active ? '#2E7D32' : '#C62828', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{w.is_active ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ label, value, color, icon }: any) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#666' }}>{label}</span>{icon && <span style={{ color }}>{icon}</span>}</div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
  </div>
);

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' };
const td: React.CSSProperties = { padding: '10px 12px', fontSize: 13 };

export default Wallets;
