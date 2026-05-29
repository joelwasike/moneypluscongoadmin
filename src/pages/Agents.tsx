import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, ArrowDownUp, Eye, Search } from 'lucide-react';
import api from '../services/api';

interface AgentInfo {
  user: any;
  float: any;
  total_commission: number;
  today_txn_count: number;
}

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadAgents(); }, []);

  const loadAgents = async () => {
    const res = await api.listAgents();
    if (res.success) setAgents(res.data || []);
  };

  const viewAgent = async (id: number) => {
    const res = await api.getAgent(id);
    if (res.success) setSelectedAgent(res.data);
  };

  const filtered = agents.filter(a =>
    a.user.name.toLowerCase().includes(search.toLowerCase()) ||
    a.user.phone.includes(search)
  );

  if (selectedAgent) {
    const a = selectedAgent;
    return (
      <div>
        <button onClick={() => setSelectedAgent(null)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to Agents
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FF9800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700 }}>
            {a.agent?.name?.[0] || 'A'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{a.agent?.name}</h2>
            <span style={{ color: '#666' }}>{a.agent?.phone} · {a.agent?.email}</span>
          </div>
          <span style={{ marginLeft: 'auto', background: '#E8F5E9', color: '#2E7D32', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Agent</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Cash Float" value={`${(a.float?.cash_balance || 0).toLocaleString()} CDF`} color="#1B3A5C" />
          <StatCard label="E-Money Float" value={`${(a.float?.emoney_balance || 0).toLocaleString()} CDF`} color="#00B4D8" />
          <StatCard label="Total Commission" value={`${(a.total_commission || 0).toLocaleString()} CDF`} color="#43A047" />
          <StatCard label="Total Transactions" value={`${a.transactions?.length || 0}`} color="#FF9800" />
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Recent Agent Transactions</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              <th style={th}>Type</th><th style={th}>Amount</th><th style={th}>Currency</th><th style={th}>Fee</th><th style={th}>Status</th><th style={th}>Date</th>
            </tr></thead>
            <tbody>
              {(a.transactions || []).slice(0, 20).map((t: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={td}><span style={{ background: t.type === 'cash_in' ? '#E8F5E9' : '#FFF3E0', color: t.type === 'cash_in' ? '#2E7D32' : '#E65100', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{t.type}</span></td>
                  <td style={td}>{t.amount?.toLocaleString()}</td>
                  <td style={td}>{t.currency}</td>
                  <td style={td}>{t.fee?.toLocaleString()}</td>
                  <td style={td}><span style={{ background: t.status === 'completed' ? '#E8F5E9' : '#FFF3E0', color: t.status === 'completed' ? '#2E7D32' : '#E65100', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{t.status}</span></td>
                  <td style={td}>{t.created_at?.slice(0, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginTop: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Commission History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              <th style={th}>Type</th><th style={th}>Amount</th><th style={th}>Transaction ID</th><th style={th}>Date</th>
            </tr></thead>
            <tbody>
              {(a.commissions || []).slice(0, 20).map((cm: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={td}>{cm.type}</td>
                  <td style={{ ...td, fontWeight: 600, color: '#43A047' }}>{cm.amount?.toLocaleString()} CDF</td>
                  <td style={td}>#{cm.transaction_id}</td>
                  <td style={td}>{cm.created_at?.slice(0, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Agent Management</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Agents" value={`${agents.length}`} color="#FF9800" icon={<Users size={20} />} />
        <StatCard label="Total Commissions" value={`${agents.reduce((s, a) => s + a.total_commission, 0).toLocaleString()} CDF`} color="#43A047" icon={<DollarSign size={20} />} />
        <StatCard label="Today's Transactions" value={`${agents.reduce((s, a) => s + a.today_txn_count, 0)}`} color="#1B3A5C" icon={<TrendingUp size={20} />} />
        <StatCard label="Active Float" value={`${agents.reduce((s, a) => s + (a.float?.cash_balance || 0) + (a.float?.emoney_balance || 0), 0).toLocaleString()} CDF`} color="#00B4D8" icon={<ArrowDownUp size={20} />} />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#999' }} />
            <input placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '2px solid #f0f0f0' }}>
            <th style={th}>Agent</th><th style={th}>Phone</th><th style={th}>Country</th><th style={th}>Cash Float</th><th style={th}>E-Money Float</th><th style={th}>Commission</th><th style={th}>Today Txns</th><th style={th}>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF9800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>{a.user.name?.[0]}</div>
                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>{a.user.name}</div><div style={{ fontSize: 11, color: '#999' }}>{a.user.email}</div></div>
                  </div>
                </td>
                <td style={td}>{a.user.phone}</td>
                <td style={td}>{a.user.country}</td>
                <td style={{ ...td, fontWeight: 600 }}>{(a.float?.cash_balance || 0).toLocaleString()}</td>
                <td style={{ ...td, fontWeight: 600 }}>{(a.float?.emoney_balance || 0).toLocaleString()}</td>
                <td style={{ ...td, fontWeight: 600, color: '#43A047' }}>{a.total_commission.toLocaleString()}</td>
                <td style={td}>{a.today_txn_count}</td>
                <td style={td}>
                  <button onClick={() => viewAgent(a.user.id)} style={{ background: '#f0f7ff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#1B3A5C' }}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No agents found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: { label: string; value: string; color: string; icon?: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
      {icon && <span style={{ color }}>{icon}</span>}
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color }}>{value}</div>
  </div>
);

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' };
const td: React.CSSProperties = { padding: '10px 12px', fontSize: 13 };

export default Agents;
