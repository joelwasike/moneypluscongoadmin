import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Shield, Bell, Smartphone, CreditCard } from 'lucide-react';
import { useToast } from '../components/Toast';

const s = {
  page: { padding: 32, fontFamily: 'Inter, sans-serif' } as React.CSSProperties,
  title: { fontSize: 26, fontWeight: 800, color: '#1B3A5C', margin: 0 } as React.CSSProperties,
  subtitle: { fontSize: 14, color: '#7C8D9E', marginTop: 4, marginBottom: 28 } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 } as React.CSSProperties,
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } as React.CSSProperties,
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1B3A5C', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 } as React.CSSProperties,
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F0F2F5' } as React.CSSProperties,
  rowLabel: { fontSize: 14, color: '#1B3A5C', fontWeight: 500 } as React.CSSProperties,
  rowDesc: { fontSize: 12, color: '#7C8D9E', marginTop: 2 } as React.CSSProperties,
  toggle: (on: boolean): React.CSSProperties => ({
    width: 44, height: 24, borderRadius: 12, background: on ? '#43A047' : '#E0E6ED',
    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
  }),
  toggleDot: (on: boolean): React.CSSProperties => ({
    width: 18, height: 18, borderRadius: '50%', background: '#fff',
    position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  }),
  input: { border: '1px solid #E0E6ED', borderRadius: 10, padding: '8px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif', width: 120, textAlign: 'right' as const, outline: 'none' } as React.CSSProperties,
  select: { border: '1px solid #E0E6ED', borderRadius: 10, padding: '8px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' } as React.CSSProperties,
  saveBtn: { marginTop: 28, display: 'flex', justifyContent: 'flex-end' } as React.CSSProperties,
  btn: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 12, border: 'none', background: '#1B3A5C', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' } as React.CSSProperties,
  fullCard: { gridColumn: '1 / -1', background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } as React.CSSProperties,
};

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <div style={s.toggle(on)} onClick={onToggle}><div style={s.toggleDot(on)} /></div>
);

export default function Settings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    emailVerification: true,
    smsVerification: true,
    twoFactorAdmin: true,
    autoSuspectFlag: true,
    pushNotifications: true,
    emailNotifications: true,
    maxDailyTransfer: '5000000',
    maxSingleTransfer: '1000000',
    minTransfer: '100',
    sessionTimeout: '30',
    defaultCurrency: 'CDF',
    kycRequired: true,
    cryptoEnabled: true,
    cardPayments: true,
    bankTransfers: true,
    mobileMoneyEnabled: true,
    autoRateUpdate: true,
    rateUpdateInterval: '15',
    highValueThreshold: '500000',
  });

  const update = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div style={s.page}>
      <h1 style={s.title}>Settings</h1>
      <p style={s.subtitle}>Configure application-wide settings and preferences</p>

      <div style={s.grid}>
        {/* General */}
        <div style={s.card}>
          <div style={s.cardTitle}><SettingsIcon size={18} color="#43A047" /> General</div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Maintenance Mode</div><div style={s.rowDesc}>Disable app access for all users</div></div>
            <Toggle on={settings.maintenanceMode} onToggle={() => update('maintenanceMode', !settings.maintenanceMode)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>New Registrations</div><div style={s.rowDesc}>Allow new users to register</div></div>
            <Toggle on={settings.newRegistrations} onToggle={() => update('newRegistrations', !settings.newRegistrations)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Default Currency</div><div style={s.rowDesc}>Default currency for new accounts</div></div>
            <select style={s.select} value={settings.defaultCurrency} onChange={e => update('defaultCurrency', e.target.value)}>
              <option>CDF</option><option>USD</option><option>EUR</option><option>XAF</option><option>XOF</option>
            </select>
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Session Timeout (min)</div><div style={s.rowDesc}>Auto-logout after inactivity</div></div>
            <input style={s.input} value={settings.sessionTimeout} onChange={e => update('sessionTimeout', e.target.value)} />
          </div>
        </div>

        {/* Security */}
        <div style={s.card}>
          <div style={s.cardTitle}><Shield size={18} color="#43A047" /> Security</div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Email Verification</div><div style={s.rowDesc}>Require email OTP on login</div></div>
            <Toggle on={settings.emailVerification} onToggle={() => update('emailVerification', !settings.emailVerification)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>SMS Verification</div><div style={s.rowDesc}>Require SMS code for transactions</div></div>
            <Toggle on={settings.smsVerification} onToggle={() => update('smsVerification', !settings.smsVerification)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>2FA for Admins</div><div style={s.rowDesc}>Require two-factor for admin login</div></div>
            <Toggle on={settings.twoFactorAdmin} onToggle={() => update('twoFactorAdmin', !settings.twoFactorAdmin)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Auto Suspect Flagging</div><div style={s.rowDesc}>Flag suspicious transactions automatically</div></div>
            <Toggle on={settings.autoSuspectFlag} onToggle={() => update('autoSuspectFlag', !settings.autoSuspectFlag)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>High Value Threshold (CDF)</div><div style={s.rowDesc}>Flag transactions above this amount</div></div>
            <input style={s.input} value={settings.highValueThreshold} onChange={e => update('highValueThreshold', e.target.value)} />
          </div>
        </div>

        {/* Transfer Limits */}
        <div style={s.card}>
          <div style={s.cardTitle}><CreditCard size={18} color="#43A047" /> Transfer Limits</div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Max Daily Transfer (CDF)</div><div style={s.rowDesc}>Maximum total per day per user</div></div>
            <input style={s.input} value={settings.maxDailyTransfer} onChange={e => update('maxDailyTransfer', e.target.value)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Max Single Transfer (CDF)</div><div style={s.rowDesc}>Maximum per transaction</div></div>
            <input style={s.input} value={settings.maxSingleTransfer} onChange={e => update('maxSingleTransfer', e.target.value)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Minimum Transfer (CDF)</div><div style={s.rowDesc}>Minimum amount per transaction</div></div>
            <input style={s.input} value={settings.minTransfer} onChange={e => update('minTransfer', e.target.value)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>KYC Required</div><div style={s.rowDesc}>Require KYC before transactions</div></div>
            <Toggle on={settings.kycRequired} onToggle={() => update('kycRequired', !settings.kycRequired)} />
          </div>
        </div>

        {/* Services */}
        <div style={s.card}>
          <div style={s.cardTitle}><Smartphone size={18} color="#43A047" /> Services</div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Mobile Money</div><div style={s.rowDesc}>Enable mobile money transfers</div></div>
            <Toggle on={settings.mobileMoneyEnabled} onToggle={() => update('mobileMoneyEnabled', !settings.mobileMoneyEnabled)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Bank Transfers</div><div style={s.rowDesc}>Enable bank-to-bank transfers</div></div>
            <Toggle on={settings.bankTransfers} onToggle={() => update('bankTransfers', !settings.bankTransfers)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Card Payments</div><div style={s.rowDesc}>Enable card-based payments</div></div>
            <Toggle on={settings.cardPayments} onToggle={() => update('cardPayments', !settings.cardPayments)} />
          </div>
          <div style={s.row}>
            <div><div style={s.rowLabel}>Crypto Wallet</div><div style={s.rowDesc}>Enable Solana crypto features</div></div>
            <Toggle on={settings.cryptoEnabled} onToggle={() => update('cryptoEnabled', !settings.cryptoEnabled)} />
          </div>
        </div>

        {/* Notifications & Rates */}
        <div style={s.fullCard}>
          <div style={s.cardTitle}><Bell size={18} color="#43A047" /> Notifications & Exchange Rates</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={s.row}>
                <div><div style={s.rowLabel}>Push Notifications</div><div style={s.rowDesc}>Send push alerts to users</div></div>
                <Toggle on={settings.pushNotifications} onToggle={() => update('pushNotifications', !settings.pushNotifications)} />
              </div>
              <div style={s.row}>
                <div><div style={s.rowLabel}>Email Notifications</div><div style={s.rowDesc}>Send email alerts to users</div></div>
                <Toggle on={settings.emailNotifications} onToggle={() => update('emailNotifications', !settings.emailNotifications)} />
              </div>
            </div>
            <div>
              <div style={s.row}>
                <div><div style={s.rowLabel}>Auto Rate Updates</div><div style={s.rowDesc}>Pull rates from external feeds</div></div>
                <Toggle on={settings.autoRateUpdate} onToggle={() => update('autoRateUpdate', !settings.autoRateUpdate)} />
              </div>
              <div style={s.row}>
                <div><div style={s.rowLabel}>Update Interval (min)</div><div style={s.rowDesc}>How often to refresh rates</div></div>
                <input style={s.input} value={settings.rateUpdateInterval} onChange={e => update('rateUpdateInterval', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.saveBtn}>
        <button style={s.btn} onClick={() => showToast('Settings saved successfully!')}><Save size={16} /> Save All Settings</button>
      </div>
    </div>
  );
}
