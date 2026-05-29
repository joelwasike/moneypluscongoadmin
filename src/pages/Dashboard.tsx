import React, { useState } from 'react';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { dashboardStats, transactions } from '../data/mockData';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const BG = '#F5F7FA';
const FONT = 'Inter, sans-serif';

const PIE_COLORS = [GREEN, NAVY, '#66BB6A', '#7C8D9E'];

const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: '#E8F5E9', text: GREEN },
  pending: { bg: '#FFF3E0', text: '#F57C00' },
  failed: { bg: '#FFEBEE', text: '#E53935' },
  cancelled: { bg: '#F5F5F5', text: '#9E9E9E' },
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString('fr-CD');
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  growth?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, growth }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: hovered
          ? '0 8px 24px rgba(27,58,92,0.15)'
          : '0 2px 8px rgba(27,58,92,0.08)',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.2s ease',
        fontFamily: FONT,
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: '#7C8D9E', fontWeight: 500 }}>{title}</p>
          <h2 style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 700, color: NAVY }}>{value}</h2>
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
      {growth && (
        <div
          style={{
            marginTop: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: '#E8F5E9',
            color: GREEN,
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 20,
          }}
        >
          <TrendingUp size={14} />
          {growth}
        </div>
      )}
    </div>
  );
};

const CardWrapper: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: hovered
          ? '0 8px 24px rgba(27,58,92,0.15)'
          : '0 2px 8px rgba(27,58,92,0.08)',
        transform: hovered ? 'scale(1.01)' : 'scale(1)',
        transition: 'all 0.2s ease',
        fontFamily: FONT,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: 32, fontFamily: FONT }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>Dashboard</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#7C8D9E' }}>
          Overview of Money+ Congo
        </p>
      </div>

      {/* Stat Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          marginBottom: 32,
        }}
      >
        <StatCard
          title="Total Users"
          value={dashboardStats.totalUsers.toString()}
          icon={<Users size={24} color={NAVY} />}
          growth={`+${dashboardStats.monthlyGrowth}%`}
        />
        <StatCard
          title="Total Transactions"
          value={dashboardStats.totalTransactions.toString()}
          icon={<Activity size={24} color={NAVY} />}
        />
        <StatCard
          title="Transaction Volume"
          value={`${formatCurrency(dashboardStats.totalVolume)} CDF`}
          icon={<DollarSign size={24} color={NAVY} />}
        />
        <StatCard
          title="Revenue from Fees"
          value={`${formatCurrency(dashboardStats.totalFees)} CDF`}
          icon={<TrendingUp size={24} color={NAVY} />}
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Area Chart - Transaction Volume */}
        <CardWrapper>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: NAVY }}>
            Transaction Volume
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dashboardStats.dailyTransactions}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }}
                axisLine={{ stroke: '#E0E6ED' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontFamily: FONT,
                  fontSize: 13,
                }}
                formatter={(value: any) => [`${formatCurrency(Number(value))} CDF`, 'Volume']}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke={GREEN}
                strokeWidth={2.5}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardWrapper>

        {/* Pie Chart - Transactions by Method */}
        <CardWrapper>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: NAVY }}>
            Transactions by Method
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dashboardStats.transactionsByMethod}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
              >
                {dashboardStats.transactionsByMethod.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontFamily: FONT,
                  fontSize: 13,
                }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              marginTop: 8,
              flexWrap: 'wrap',
            }}
          >
            {dashboardStats.transactionsByMethod.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: PIE_COLORS[index],
                  }}
                />
                <span style={{ fontSize: 12, color: '#7C8D9E' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Bar Chart - Revenue Trend */}
        <CardWrapper>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: NAVY }}>
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dashboardStats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }}
                axisLine={{ stroke: '#E0E6ED' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#7C8D9E', fontFamily: FONT }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontFamily: FONT,
                  fontSize: 13,
                }}
                formatter={(value: any) => [`${formatCurrency(Number(value))} CDF`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill={NAVY} radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </CardWrapper>

        {/* Top Countries by Volume */}
        <CardWrapper>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: NAVY }}>
            Top Countries by Volume
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                padding: '10px 12px',
                borderBottom: '2px solid #E0E6ED',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7C8D9E', textTransform: 'uppercase' }}>
                Country
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7C8D9E', textTransform: 'uppercase', textAlign: 'right' }}>
                Volume
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7C8D9E', textTransform: 'uppercase', textAlign: 'right' }}>
                Txns
              </span>
            </div>
            {dashboardStats.transactionsByCountry.map((entry) => (
              <div
                key={entry.country}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  padding: '14px 12px',
                  borderBottom: '1px solid #F0F2F5',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{entry.flag}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: NAVY }}>{entry.country}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: NAVY, textAlign: 'right' }}>
                  {formatCurrency(entry.volume)} CDF
                </span>
                <span style={{ fontSize: 14, color: '#7C8D9E', textAlign: 'right' }}>
                  {entry.count}
                </span>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Recent Transactions Table */}
      <CardWrapper>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: NAVY }}>
          Recent Transactions
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: FONT,
            }}
          >
            <thead>
              <tr>
                {['ID', 'User', 'Type', 'Method', 'Amount', 'Status', 'Date'].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#7C8D9E',
                      textTransform: 'uppercase',
                      borderBottom: '2px solid #E0E6ED',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => {
                const statusStyle = statusColors[txn.status] || statusColors.cancelled;
                return (
                  <tr key={txn.id}>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        color: NAVY,
                        borderBottom: '1px solid #F0F2F5',
                      }}
                    >
                      {txn.id}
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        color: NAVY,
                        borderBottom: '1px solid #F0F2F5',
                      }}
                    >
                      {txn.userName}
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        color: '#7C8D9E',
                        borderBottom: '1px solid #F0F2F5',
                        textTransform: 'capitalize',
                      }}
                    >
                      {txn.type}
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        color: '#7C8D9E',
                        borderBottom: '1px solid #F0F2F5',
                      }}
                    >
                      {txn.method.replace('_', ' ')}
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        color: NAVY,
                        borderBottom: '1px solid #F0F2F5',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatCurrency(txn.amount)} {txn.currency}
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #F0F2F5',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          textTransform: 'capitalize',
                        }}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        color: '#7C8D9E',
                        borderBottom: '1px solid #F0F2F5',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {txn.createdAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardWrapper>
    </div>
  );
};

export default Dashboard;
