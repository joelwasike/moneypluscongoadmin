import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Activity, Globe } from 'lucide-react';
import { dashboardStats, users } from '../data/mockData';

const COLORS = ['#1B3A5C', '#43A047', '#66BB6A', '#7C8D9E', '#AAB8C6'];

const s = {
  page: { padding: 32, fontFamily: 'Inter, sans-serif' } as React.CSSProperties,
  title: { fontSize: 26, fontWeight: 800, color: '#1B3A5C', margin: 0 } as React.CSSProperties,
  subtitle: { fontSize: 14, color: '#7C8D9E', marginTop: 4, marginBottom: 28 } as React.CSSProperties,
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 } as React.CSSProperties,
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 24 } as React.CSSProperties,
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } as React.CSSProperties,
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#1B3A5C', marginBottom: 20 } as React.CSSProperties,
  statCard: { background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 } as React.CSSProperties,
  statIcon: (bg: string): React.CSSProperties => ({ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
  statLabel: { fontSize: 12, color: '#7C8D9E' } as React.CSSProperties,
  statValue: { fontSize: 22, fontWeight: 700, color: '#1B3A5C' } as React.CSSProperties,
};

const usersByCountry = users.reduce((acc, u) => {
  acc[u.country] = (acc[u.country] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
const countryData = Object.entries(usersByCountry).map(([name, value]) => ({ name, value }));

const statusData = [
  { name: 'Active', value: users.filter(u => u.status === 'active').length },
  { name: 'Suspended', value: users.filter(u => u.status === 'suspended').length },
  { name: 'Pending', value: users.filter(u => u.status === 'pending').length },
];

const kycData = [
  { name: 'Verified', value: users.filter(u => u.kycStatus === 'verified').length },
  { name: 'Pending', value: users.filter(u => u.kycStatus === 'pending').length },
  { name: 'Rejected', value: users.filter(u => u.kycStatus === 'rejected').length },
  { name: 'Not Submitted', value: users.filter(u => u.kycStatus === 'not_submitted').length },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  transactions: Math.floor(Math.random() * 15) + 2,
}));

export default function Analytics() {
  return (
    <div style={s.page}>
      <h1 style={s.title}>Analytics</h1>
      <p style={s.subtitle}>Detailed insights and performance metrics</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div style={s.statCard}>
          <div style={s.statIcon('#E8F5E9')}><TrendingUp size={22} color="#43A047" /></div>
          <div><div style={s.statLabel}>Monthly Growth</div><div style={s.statValue}>+{dashboardStats.monthlyGrowth}%</div></div>
        </div>
        <div style={s.statCard}>
          <div style={s.statIcon('#E3F2FD')}><Users size={22} color="#1B3A5C" /></div>
          <div><div style={s.statLabel}>Active Users</div><div style={s.statValue}>{dashboardStats.activeUsers}</div></div>
        </div>
        <div style={s.statCard}>
          <div style={s.statIcon('#FFF3E0')}><Activity size={22} color="#F57F17" /></div>
          <div><div style={s.statLabel}>Avg Daily Txns</div><div style={s.statValue}>{Math.round(dashboardStats.dailyTransactions.reduce((a, d) => a + d.count, 0) / 7)}</div></div>
        </div>
        <div style={s.statCard}>
          <div style={s.statIcon('#F3E5F5')}><Globe size={22} color="#7B1FA2" /></div>
          <div><div style={s.statLabel}>Countries Active</div><div style={s.statValue}>{dashboardStats.transactionsByCountry.length}</div></div>
        </div>
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.cardTitle}>Revenue Trend (CDF)</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dashboardStats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C8D9E' }} />
              <YAxis tick={{ fontSize: 12, fill: '#7C8D9E' }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#43A047" fill="#43A047" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Transaction Volume (7 Days)</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboardStats.dailyTransactions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#7C8D9E' }} />
              <YAxis tick={{ fontSize: 12, fill: '#7C8D9E' }} />
              <Tooltip />
              <Bar dataKey="volume" fill="#1B3A5C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={s.grid3}>
        <div style={s.card}>
          <div style={s.cardTitle}>Users by Country</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={countryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {countryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Account Status</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#43A047" /><Cell fill="#D32F2F" /><Cell fill="#F57F17" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>KYC Status Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={kycData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#43A047" /><Cell fill="#F57F17" /><Cell fill="#D32F2F" /><Cell fill="#AAB8C6" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Hourly Transaction Distribution (Today)</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#7C8D9E' }} interval={3} />
            <YAxis tick={{ fontSize: 12, fill: '#7C8D9E' }} />
            <Tooltip />
            <Line type="monotone" dataKey="transactions" stroke="#1B3A5C" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
