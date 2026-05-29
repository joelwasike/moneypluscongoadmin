import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const SplitsAdmin: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.listSplits().then(res => { if (res.success) setData(res.data); });
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700 }}>Split Payments</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Splits" value={data?.total || 0} color="#1B3A5C" icon={<Users size={20} />} />
        <StatCard label="Active" value={data?.active || 0} color="#FF9800" icon={<Clock size={20} />} />
        <StatCard label="Settled" value={data?.settled || 0} color="#43A047" icon={<CheckCircle size={20} />} />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '2px solid #f0f0f0' }}>
            <th style={th}>ID</th><th style={th}>Title</th><th style={th}>Creator</th><th style={th}>Category</th><th style={th}>Total</th><th style={th}>Members</th><th style={th}>Paid</th><th style={th}>Status</th><th style={th}>Created</th>
          </tr></thead>
          <tbody>
            {(data?.splits || []).map((s: any) => {
              const paidCount = (s.members || []).filter((m: any) => m.is_paid).length;
              const totalMembers = (s.members || []).length;
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={td}>#{s.id}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{s.title}</td>
                  <td style={td}>#{s.creator_id}</td>
                  <td style={td}><span style={{ background: '#F3E5F5', color: '#7B1FA2', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{s.category}</span></td>
                  <td style={{ ...td, fontWeight: 700 }}>{s.total_amount?.toLocaleString()} {s.currency}</td>
                  <td style={td}>{totalMembers}</td>
                  <td style={td}><span style={{ color: paidCount === totalMembers ? '#43A047' : '#FF9800', fontWeight: 600 }}>{paidCount}/{totalMembers}</span></td>
                  <td style={td}><span style={{ background: s.status === 'settled' ? '#E8F5E9' : '#FFF3E0', color: s.status === 'settled' ? '#2E7D32' : '#E65100', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{s.status}</span></td>
                  <td style={td}>{s.created_at?.slice(0, 10)}</td>
                </tr>
              );
            })}
            {(!data?.splits || data.splits.length === 0) && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No split payments</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: any) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#666' }}>{label}</span>{icon && <span style={{ color }}>{icon}</span>}</div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color }}>{value}</div>
  </div>
);

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' };
const td: React.CSSProperties = { padding: '10px 12px', fontSize: 13 };

export default SplitsAdmin;
