import React, { useState } from 'react';
import { Bitcoin, Shield, Wallet, RefreshCw, AlertTriangle, CheckCircle, XCircle, Save } from 'lucide-react';
import { useToast } from '../components/Toast';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const FONT = "'Inter', sans-serif";

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <div
    onClick={onToggle}
    style={{
      width: 44, height: 24, borderRadius: 12,
      background: on ? GREEN : '#E0E6ED',
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    }} />
  </div>
);

const supportedTokens = [
  { symbol: 'SOL', name: 'Solana', enabled: true, minWithdraw: 0.01, maxWithdraw: 100, fee: 0.000005 },
  { symbol: 'USDC', name: 'USD Coin', enabled: true, minWithdraw: 1, maxWithdraw: 10000, fee: 0.5 },
  { symbol: 'USDT', name: 'Tether', enabled: true, minWithdraw: 1, maxWithdraw: 10000, fee: 0.5 },
  { symbol: 'BONK', name: 'Bonk', enabled: false, minWithdraw: 1000, maxWithdraw: 10000000, fee: 1.0 },
];

const walletStats = [
  { label: 'Total Wallets', value: '847', icon: <Wallet size={22} color="#fff" />, bg: NAVY },
  { label: 'Active Wallets', value: '623', icon: <CheckCircle size={22} color="#fff" />, bg: GREEN },
  { label: 'Flagged', value: '12', icon: <AlertTriangle size={22} color="#fff" />, bg: '#E65100' },
  { label: 'Frozen', value: '3', icon: <XCircle size={22} color="#fff" />, bg: '#C62828' },
];

export default function CryptoSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    cryptoEnabled: true,
    autoApproveWithdrawals: false,
    requireKycForCrypto: true,
    maxDailyWithdrawUsd: '50000',
    confirmationsRequired: '12',
    hotWalletThreshold: '10000',
    coldWalletAddress: '7xKX...9Fba',
    rpcEndpoint: 'https://api.mainnet-beta.solana.com',
    webhookUrl: '',
    antifraudEnabled: true,
    withdrawalCooldown: '60',
  });
  const [tokens, setTokens] = useState(supportedTokens);

  const update = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }));

  const toggleToken = (idx: number) => {
    setTokens(prev => prev.map((t, i) => i === idx ? { ...t, enabled: !t.enabled } : t));
  };

  const inputStyle: React.CSSProperties = {
    border: '1px solid #E0E6ED', borderRadius: 10, padding: '8px 14px',
    fontSize: 14, fontFamily: FONT, width: 160, textAlign: 'right', outline: 'none',
  };
  const rowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid #F0F2F5',
  };

  return (
    <div style={{ fontFamily: FONT, padding: 32, minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>Crypto Settings</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>Manage Solana blockchain and crypto wallet configuration</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        {walletStats.map((card) => (
          <div key={card.label} style={{
            backgroundColor: '#fff', borderRadius: 12, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, backgroundColor: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* General */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bitcoin size={18} color={GREEN} /> General
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Crypto Module Enabled</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Master toggle for all crypto features</div>
            </div>
            <Toggle on={settings.cryptoEnabled} onToggle={() => update('cryptoEnabled', !settings.cryptoEnabled)} />
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Auto-Approve Withdrawals</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Skip manual review for small amounts</div>
            </div>
            <Toggle on={settings.autoApproveWithdrawals} onToggle={() => update('autoApproveWithdrawals', !settings.autoApproveWithdrawals)} />
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>KYC Required for Crypto</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Require verified KYC before crypto use</div>
            </div>
            <Toggle on={settings.requireKycForCrypto} onToggle={() => update('requireKycForCrypto', !settings.requireKycForCrypto)} />
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Max Daily Withdrawal (USD)</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Per-user daily withdrawal limit</div>
            </div>
            <input style={inputStyle} value={settings.maxDailyWithdrawUsd} onChange={e => update('maxDailyWithdrawUsd', e.target.value)} />
          </div>
        </div>

        {/* Security */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={18} color={GREEN} /> Security
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Confirmations Required</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Solana block confirmations before crediting</div>
            </div>
            <input style={inputStyle} value={settings.confirmationsRequired} onChange={e => update('confirmationsRequired', e.target.value)} />
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Anti-Fraud Detection</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Flag suspicious wallet activity</div>
            </div>
            <Toggle on={settings.antifraudEnabled} onToggle={() => update('antifraudEnabled', !settings.antifraudEnabled)} />
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Withdrawal Cooldown (min)</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Minimum wait between withdrawals</div>
            </div>
            <input style={inputStyle} value={settings.withdrawalCooldown} onChange={e => update('withdrawalCooldown', e.target.value)} />
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Hot Wallet Threshold (USD)</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Auto-sweep to cold wallet above this</div>
            </div>
            <input style={inputStyle} value={settings.hotWalletThreshold} onChange={e => update('hotWalletThreshold', e.target.value)} />
          </div>
        </div>

        {/* Supported Tokens */}
        <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <RefreshCw size={18} color={GREEN} /> Supported Tokens
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Token', 'Name', 'Min Withdraw', 'Max Withdraw', 'Fee (%)', 'Enabled'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280',
                      fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, idx) => (
                  <tr key={token.symbol} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: NAVY }}>{token.symbol}</td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>{token.name}</td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>{token.minWithdraw}</td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>{token.maxWithdraw.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: '#374151' }}>{token.fee}%</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Toggle on={token.enabled} onToggle={() => toggleToken(idx)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
        <button onClick={() => showToast('Crypto settings saved successfully!')} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px',
          borderRadius: 12, border: 'none', background: NAVY, color: '#fff',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
        }}>
          <Save size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
}
