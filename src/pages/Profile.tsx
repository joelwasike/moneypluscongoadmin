import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Clock, Key, Save, Camera } from 'lucide-react';
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

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #E0E6ED',
  borderRadius: 10, fontSize: 14, fontFamily: FONT, outline: 'none',
  color: '#1F2937', boxSizing: 'border-box',
};

const rowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 0', borderBottom: '1px solid #F0F2F5',
};

export default function Profile() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState({
    name: 'Joel Wasike',
    email: 'joel@moneyplus.cd',
    phone: '+243 812 000 001',
    role: 'Super Admin',
    createdAt: '2025-06-01',
    lastLogin: '2026-04-11 08:30',
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    emailAlerts: true,
    loginAlerts: true,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  const handleSaveProfile = () => {
    setProfile({ ...editForm });
    setEditing(false);
    showToast('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.newPassword || !passwords.confirm) {
      showToast('Please fill in all password fields.', 'warning');
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (passwords.newPassword.length < 8) {
      showToast('Password must be at least 8 characters.', 'warning');
      return;
    }
    showToast('Password changed successfully!');
    setPasswords({ current: '', newPassword: '', confirm: '' });
  };

  return (
    <div style={{ fontFamily: FONT, padding: 32, minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>My Profile</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>Manage your account details and security preferences</p>
      </div>

      {/* Profile Header Card */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 28, marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20, backgroundColor: NAVY,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 32, fontWeight: 700,
            }}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button style={{
              position: 'absolute', bottom: -4, right: -4, width: 28, height: 28,
              borderRadius: '50%', backgroundColor: GREEN, border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Camera size={12} color="#fff" />
            </button>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: NAVY }}>{profile.name}</h2>
            <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{profile.email}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12,
                fontWeight: 600, backgroundColor: '#EDE7F6', color: '#5E35B1',
              }}>{profile.role}</span>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12,
                fontWeight: 600, backgroundColor: '#E8F5E9', color: '#2E7D32',
              }}>Active</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Personal Information */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={18} color={GREEN} /> Personal Information
            </div>
            {!editing ? (
              <button onClick={() => { setEditing(true); setEditForm({ ...profile }); }} style={{
                padding: '6px 14px', borderRadius: 8, border: `1px solid ${NAVY}`,
                backgroundColor: 'transparent', color: NAVY, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: FONT,
              }}>Edit</button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setEditing(false)} style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid #E5E7EB',
                  backgroundColor: '#fff', color: '#6B7280', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: FONT,
                }}>Cancel</button>
                <button onClick={handleSaveProfile} style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none',
                  backgroundColor: GREEN, color: '#fff', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: FONT,
                }}>Save</button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</label>
              {editing ? (
                <input style={inputStyle} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              ) : (
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', padding: '10px 0' }}>{profile.name}</div>
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
              {editing ? (
                <input style={inputStyle} type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              ) : (
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={14} color="#6B7280" /> {profile.email}
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone</label>
              {editing ? (
                <input style={inputStyle} value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              ) : (
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', padding: '10px 0' }}>{profile.phone}</div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <Calendar size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Account Created
                </label>
                <div style={{ fontSize: 14, color: '#374151', padding: '10px 0' }}>{profile.createdAt}</div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Last Login
                </label>
                <div style={{ fontSize: 14, color: '#374151', padding: '10px 0' }}>{profile.lastLogin}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={18} color={GREEN} /> Security
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Two-Factor Authentication</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Extra security on login</div>
            </div>
            <Toggle on={security.twoFactor} onToggle={() => setSecurity(p => ({ ...p, twoFactor: !p.twoFactor }))} />
          </div>
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Email Alerts</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Get notified about important actions</div>
            </div>
            <Toggle on={security.emailAlerts} onToggle={() => setSecurity(p => ({ ...p, emailAlerts: !p.emailAlerts }))} />
          </div>
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <div>
              <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>Login Alerts</div>
              <div style={{ fontSize: 12, color: '#7C8D9E', marginTop: 2 }}>Get alerted on new device logins</div>
            </div>
            <Toggle on={security.loginAlerts} onToggle={() => setSecurity(p => ({ ...p, loginAlerts: !p.loginAlerts }))} />
          </div>
        </div>

        {/* Change Password */}
        <div style={{
          gridColumn: '1 / -1',
          backgroundColor: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Key size={18} color={GREEN} /> Change Password
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Current Password</label>
              <input style={inputStyle} type="password" placeholder="Enter current password"
                value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>New Password</label>
              <input style={inputStyle} type="password" placeholder="Enter new password"
                value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirm Password</label>
              <input style={inputStyle} type="password" placeholder="Confirm new password"
                value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button onClick={handleChangePassword} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px',
              borderRadius: 10, border: 'none', background: NAVY, color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
            }}>
              <Save size={16} /> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
