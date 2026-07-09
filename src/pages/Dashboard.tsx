import React, { useEffect, useMemo, useState } from 'react';
import { Users, Activity, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../App';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = 'Poppins, sans-serif';

const PIE_COLORS = [GREEN, NAVY, '#66BB6A', '#7C8D9E', '#AAB8C6', '#FF9800'];

const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: '#E8F5E9', text: GREEN },
  pending: { bg: '#FFF3E0', text: '#F57C00' },
  failed: { bg: '#FFEBEE', text: '#E53935' },
  cancelled: { bg: '#F5F5F5', text: '#9E9E9E' },
};

const formatCurrency = (value: number): string => value.toLocaleString('en-US');

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 8px rgba(27,58,92,0.08)',
        fontFamily: FONT,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: '#7C8D9E', fontWeight: 500 }}>{title}</p>
          <h2 style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: NAVY }}>{value}</h2>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${NAVY}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    style={{
      background: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 2px 8px rgba(27,58,92,0.08)',
      fontFamily: FONT,
    }}
  >
    <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: NAVY }}>{title}</h3>
    {children}
  </div>
);

export default function Dashboard() {
  const { t } = useLanguage();
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res =
      role === 'finance'
        ? await api.dashboardFinance()
        : role === 'compliance'
          ? await api.dashboardCompliance()
          : role === 'customer_service'
            ? await api.dashboardSupport()
            : await api.dashboard();
    setLoading(false);
    if (!res?.success) {
      setError(res?.message || t('dashboard.failedToLoad'));
      setData(null);
      return;
    }
    setData(res.data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
  }, [role]);

  const daily = useMemo(() => (data?.daily || []).map((d: any) => ({
    date: d.date,
    volume: Number(d.volume) || 0,
    count: Number(d.count) || 0,
  })), [data]);

  const byType = useMemo(() => (data?.by_type || []).map((t: any) => ({
    name: t.type,
    value: Number(t.count) || 0,
  })), [data]);

  const topCountries = useMemo(() => (data?.top_countries || []).map((c: any) => ({
    country: c.country,
    users: Number(c.count) || 0,
  })), [data]);

  const recentTx = useMemo(() => (data?.recent_transactions || []) as any[], [data]);
  const financeDaily = useMemo(() => (data?.daily_revenue || []).map((d: any) => ({
    date: d.date,
    volume: Number(d.volume) || 0,
    fees: Number(d.fees) || 0,
  })), [data]);
  const financeByType = useMemo(() => (data?.profit_by_type || []).map((row: any) => ({
    name: row.type,
    value: Number(row.total_fee) || 0,
  })), [data]);
  const financeMonthly = useMemo(() => (data?.monthly_revenue || []).map((d: any) => ({
    month: d.month,
    fees: Number(d.fees) || 0,
  })), [data]);
  const complianceQueue = useMemo(() => (data?.pending_kyc_queue || []) as any[], [data]);
  const supportThreads = useMemo(() => (data?.open_threads || []) as any[], [data]);

  if (role === 'finance') {
    return (
      <div style={{ background: BG, minHeight: '100vh', padding: 32, fontFamily: FONT }}>
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: NAVY }}>{t('dashboard.title')}</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#7C8D9E' }}>{'Finance team overview'}</p>
          </div>
          <button onClick={load} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 700, color: NAVY }}>{t('common.refresh')}</button>
        </div>
        {(loading || error) && <div style={{ marginBottom: 16, color: error ? '#C62828' : '#6B7280', fontWeight: 700 }}>{error ? error : t('common.loading')}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginBottom: 28 }}>
          <StatCard title="Transaction Volume" value={`${formatCurrency(Number(data?.total_volume || 0))} XAF`} icon={<BarChart3 size={24} color={NAVY} />} />
          <StatCard title="Total Revenue" value={`${formatCurrency(Number(data?.total_revenue || 0))} XAF`} icon={<DollarSign size={24} color={NAVY} />} />
          <StatCard title="Today Revenue" value={`${formatCurrency(Number(data?.today_revenue || 0))} XAF`} icon={<TrendingUp size={24} color={NAVY} />} />
          <StatCard title="Net Profit" value={`${formatCurrency(Number(data?.net_profit || 0))} XAF`} icon={<Activity size={24} color={NAVY} />} />
          <StatCard title="Transactions" value={String(data?.total_transactions ?? '—')} icon={<Users size={24} color={NAVY} />} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
          <Card title="Daily Revenue & Volume">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={financeDaily}>
                <defs>
                  <linearGradient id="financeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="volumeGradientFinance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NAVY} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={NAVY} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip />
                <Area yAxisId="right" type="monotone" dataKey="volume" name="Volume" stroke={NAVY} fill="url(#volumeGradientFinance)" strokeWidth={2} />
                <Area yAxisId="left" type="monotone" dataKey="fees" name="Fees" stroke={GREEN} fill="url(#financeGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Profit by Type">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={financeByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                  {financeByType.map((_: any, index: number) => (
                    <Cell key={`finance-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Card title="Monthly Revenue">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={financeMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} />
                <YAxis tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} />
                <Tooltip />
                <Bar dataKey="fees" fill={NAVY} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Recent Activity">
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>Pending</span><span>{Number(data?.pending_transactions || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>Failed</span><span>{Number(data?.failed_transactions || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>Total commissions</span><span>{`${formatCurrency(Number(data?.total_commissions || 0))} XAF`}</span></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (role === 'compliance') {
    return (
      <div style={{ background: BG, minHeight: '100vh', padding: 32, fontFamily: FONT }}>
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: NAVY }}>{t('dashboard.title')}</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#7C8D9E' }}>{'Compliance team overview'}</p>
          </div>
          <button onClick={load} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 700, color: NAVY }}>{t('common.refresh')}</button>
        </div>
        {(loading || error) && <div style={{ marginBottom: 16, color: error ? '#C62828' : '#6B7280', fontWeight: 700 }}>{error ? error : t('common.loading')}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 28 }}>
          <StatCard title="KYC Pending" value={String(data?.kyc?.pending ?? 0)} icon={<Users size={24} color={NAVY} />} />
          <StatCard title="KYC Needs Info" value={String(data?.kyc?.needs_more_info ?? 0)} icon={<Activity size={24} color={NAVY} />} />
          <StatCard title="Suspended Users" value={String(data?.suspended_users ?? 0)} icon={<DollarSign size={24} color={NAVY} />} />
          <StatCard title="Failed Txns" value={String(data?.failed_transactions ?? 0)} icon={<TrendingUp size={24} color={NAVY} />} />
        </div>
        <Card title="Pending KYC Queue">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['ID', 'Name', 'Level', 'Submitted'].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#6B7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complianceQueue.map((row: any) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: NAVY }}>{row.id}</td>
                    <td style={{ padding: '10px 12px' }}>{row.full_name || row.user_name || '-'}</td>
                    <td style={{ padding: '10px 12px' }}>{row.kyc_level || '-'}</td>
                    <td style={{ padding: '10px 12px' }}>{String(row.created_at || row.submitted_at || '').slice(0, 16)}</td>
                  </tr>
                ))}
                {!loading && complianceQueue.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 18, textAlign: 'center', color: '#9CA3AF' }}>No pending KYC rows.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  if (role === 'customer_service') {
    return (
      <div style={{ background: BG, minHeight: '100vh', padding: 32, fontFamily: FONT }}>
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: NAVY }}>{t('dashboard.title')}</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#7C8D9E' }}>{'Customer service overview'}</p>
          </div>
          <button onClick={load} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 700, color: NAVY }}>{t('common.refresh')}</button>
        </div>
        {(loading || error) && <div style={{ marginBottom: 16, color: error ? '#C62828' : '#6B7280', fontWeight: 700 }}>{error ? error : t('common.loading')}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 28 }}>
          <StatCard title="Total Users" value={String(data?.total_users ?? 0)} icon={<Users size={24} color={NAVY} />} />
          <StatCard title="Active Users" value={String(data?.active_users ?? 0)} icon={<Activity size={24} color={NAVY} />} />
          <StatCard title="KYC Pending" value={String(data?.pending_kyc ?? 0)} icon={<DollarSign size={24} color={NAVY} />} />
          <StatCard title="Open Threads" value={String(data?.chat_threads ?? 0)} icon={<TrendingUp size={24} color={NAVY} />} />
        </div>
        <Card title="Open Support Threads">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['User', 'Email', 'Messages', 'Last Message'].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#6B7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {supportThreads.map((row: any) => (
                  <tr key={row.user_id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: NAVY }}>{row.user_name}</td>
                    <td style={{ padding: '10px 12px' }}>{row.user_email}</td>
                    <td style={{ padding: '10px 12px' }}>{row.message_count}</td>
                    <td style={{ padding: '10px 12px' }}>{row.last_message}</td>
                  </tr>
                ))}
                {!loading && supportThreads.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 18, textAlign: 'center', color: '#9CA3AF' }}>No open threads.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: 32, fontFamily: FONT }}>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: NAVY }}>{t('dashboard.title')}</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#7C8D9E' }}>{t('dashboard.subtitle')}</p>
        </div>
        <button
          onClick={load}
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 700,
            color: NAVY,
          }}
        >
          {t('common.refresh')}
        </button>
      </div>

      {(loading || error) && (
        <div style={{ marginBottom: 16, color: error ? '#C62828' : '#6B7280', fontWeight: 700 }}>
          {error ? error : t('common.loading')}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 28 }}>
        <StatCard title={t('dashboard.totalUsers')} value={String(data?.total_users ?? '—')} icon={<Users size={24} color={NAVY} />} />
        <StatCard title={t('dashboard.totalTransactions')} value={String(data?.total_transactions ?? '—')} icon={<Activity size={24} color={NAVY} />} />
        <StatCard title={t('dashboard.transactionVolume')} value={`${formatCurrency(Number(data?.total_volume || 0))} XAF`} icon={<DollarSign size={24} color={NAVY} />} />
        <StatCard title={t('dashboard.revenue')} value={`${formatCurrency(Number(data?.total_fees || 0))} XAF`} icon={<TrendingUp size={24} color={NAVY} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <Card title={t('dashboard.dailyVolume')}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} />
              <YAxis tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} />
              <Tooltip />
              <Area type="monotone" dataKey="volume" stroke={GREEN} fill="url(#volumeGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title={t('dashboard.byType')}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                {byType.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card title={t('dashboard.topCountries')}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topCountries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
              <XAxis dataKey="country" tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} />
              <YAxis tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }} />
              <Tooltip />
              <Bar dataKey="users" fill={NAVY} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title={t('dashboard.recentTransactions')}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {[t('common.id'), t('common.type'), t('common.amount'), t('common.currency'), t('common.status'), t('common.date')].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#6B7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTx.map((t: any) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: NAVY, whiteSpace: 'nowrap' }}>#{t.id}</td>
                    <td style={{ padding: '10px 12px', color: '#374151', whiteSpace: 'nowrap' }}>{t.type}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap' }}>{Number(t.amount || 0).toLocaleString('en-US')}</td>
                    <td style={{ padding: '10px 12px', color: '#6B7280', whiteSpace: 'nowrap' }}>{t.currency}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'capitalize',
                        backgroundColor: statusColors[t.status]?.bg || '#ECEFF1',
                        color: statusColors[t.status]?.text || '#546E7A',
                        whiteSpace: 'nowrap',
                      }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#6B7280', whiteSpace: 'nowrap' }}>{String(t.created_at || '').slice(0, 16)}</td>
                  </tr>
                ))}
                {!loading && !error && recentTx.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 18, textAlign: 'center', color: '#9CA3AF' }}>{t('dashboard.noRecentTx')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
