import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Globe, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../App';
import { AdminRole } from '../auth/adminAccess';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = 'Poppins, sans-serif';

const COLORS = [NAVY, GREEN, '#66BB6A', '#7C8D9E', '#AAB8C6', '#FF9800'];

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, marginBottom: 18 }}>{title}</div>
    {children}
  </div>
);

export default function Analytics() {
  const { t } = useLanguage();
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const endpointByRole: Record<AdminRole, () => Promise<any>> = {
      super_admin: api.dashboard,
      finance: api.dashboardFinance,
      compliance: api.dashboardCompliance,
      customer_service: api.dashboardSupport,
    };
    const res = await endpointByRole[role]();
    setLoading(false);
    if (!res?.success) {
      setError(res?.message || t('analytics.failedToLoad'));
      setData(null);
      return;
    }
    setData(res.data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
  }, [role]);

  const byType = useMemo(() => (data?.by_type || []).map((tx: any) => ({ name: tx.type, value: Number(tx.count) || 0 })), [data]);
  const topCountries = useMemo(() => (data?.top_countries || []).map((c: any) => ({ country: c.country, users: Number(c.count) || 0 })), [data]);
  const daily = useMemo(() => (data?.daily || []).map((d: any) => ({ date: d.date, count: Number(d.count) || 0, volume: Number(d.volume) || 0 })), [data]);

  return (
    <div style={{ padding: 32, fontFamily: FONT, backgroundColor: BG, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: NAVY, margin: 0 }}>{t('analytics.title')}</h1>
          <p style={{ fontSize: 14, color: '#7C8D9E', marginTop: 4, marginBottom: 0 }}>{t('analytics.subtitle')}</p>
        </div>
        <button
          onClick={load}
          style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 800, color: NAVY }}
        >
          {t('common.refresh')}
        </button>
      </div>

      {(loading || error) && (
        <div style={{ marginBottom: 16, color: error ? '#C62828' : '#6B7280', fontWeight: 800 }}>
          {error ? error : t('common.loading')}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={22} color={GREEN} /></div>
          <div><div style={{ fontSize: 12, color: '#7C8D9E' }}>{t('analytics.totalVolume')}</div><div style={{ fontSize: 22, fontWeight: 900, color: NAVY }}>{Number(data?.total_volume || 0).toLocaleString('fr-CD')}</div></div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={22} color={NAVY} /></div>
          <div><div style={{ fontSize: 12, color: '#7C8D9E' }}>{t('analytics.activeUsers')}</div><div style={{ fontSize: 22, fontWeight: 900, color: NAVY }}>{data?.active_users ?? '—'}</div></div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={22} color="#F57F17" /></div>
          <div><div style={{ fontSize: 12, color: '#7C8D9E' }}>{t('analytics.totalTransactions')}</div><div style={{ fontSize: 22, fontWeight: 900, color: NAVY }}>{data?.total_transactions ?? '—'}</div></div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={22} color="#7B1FA2" /></div>
          <div><div style={{ fontSize: 12, color: '#7C8D9E' }}>{t('analytics.topCountries')}</div><div style={{ fontSize: 22, fontWeight: 900, color: NAVY }}>{topCountries.length}</div></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <Card title={t('analytics.byType')}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byType} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                {byType.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title={t('analytics.topCountries')}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCountries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
              <XAxis dataKey="country" tick={{ fontSize: 12, fill: '#7C8D9E' }} />
              <YAxis tick={{ fontSize: 12, fill: '#7C8D9E' }} />
              <Tooltip />
              <Bar dataKey="users" fill={NAVY} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title={t('analytics.dailyCount')}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#7C8D9E' }} />
            <YAxis tick={{ fontSize: 12, fill: '#7C8D9E' }} />
            <Tooltip />
            <Bar dataKey="count" fill={GREEN} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
