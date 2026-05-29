import React, { useState } from 'react';
import { UserCog, Shield, Eye, ToggleLeft, ToggleRight, Plus, Search, X, ArrowLeft, Mail, Calendar, Clock } from 'lucide-react';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const FONT = "'Inter', sans-serif";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'support' | 'viewer';
  status: 'active' | 'disabled';
  twoFactor: boolean;
  lastLogin: string;
  createdAt: string;
}

const initialAdmins: Admin[] = [
  { id: 'ADM001', name: 'Joel Wasike', email: 'joel@moneyplus.cd', role: 'super_admin', status: 'active', twoFactor: true, lastLogin: '2026-04-11 08:30', createdAt: '2025-06-01' },
  { id: 'ADM002', name: 'Sarah Mutombo', email: 'sarah@moneyplus.cd', role: 'admin', status: 'active', twoFactor: true, lastLogin: '2026-04-10 17:45', createdAt: '2025-08-15' },
  { id: 'ADM003', name: 'Pierre Lubamba', email: 'pierre@moneyplus.cd', role: 'admin', status: 'active', twoFactor: true, lastLogin: '2026-04-10 14:20', createdAt: '2025-09-10' },
  { id: 'ADM004', name: 'Amani Kazadi', email: 'amani@moneyplus.cd', role: 'support', status: 'active', twoFactor: false, lastLogin: '2026-04-09 11:00', createdAt: '2026-01-20' },
  { id: 'ADM005', name: 'Fiston Kalala', email: 'fiston@moneyplus.cd', role: 'support', status: 'disabled', twoFactor: false, lastLogin: '2026-03-01 09:15', createdAt: '2025-11-05' },
  { id: 'ADM006', name: 'Gracia Ilunga', email: 'gracia@moneyplus.cd', role: 'viewer', status: 'active', twoFactor: false, lastLogin: '2026-04-11 07:00', createdAt: '2026-02-28' },
];

const roleBadge: Record<Admin['role'], { bg: string; color: string; label: string }> = {
  super_admin: { bg: '#EDE7F6', color: '#5E35B1', label: 'Super Admin' },
  admin: { bg: '#E3F2FD', color: '#1565C0', label: 'Admin' },
  support: { bg: '#FFF3E0', color: '#E65100', label: 'Support' },
  viewer: { bg: '#ECEFF1', color: '#546E7A', label: 'Viewer' },
};

const statusBadge: Record<Admin['status'], { bg: string; color: string }> = {
  active: { bg: '#E8F5E9', color: '#2E7D32' },
  disabled: { bg: '#FFEBEE', color: '#C62828' },
};

// ─── Admin Detail View ───
const AdminDetail: React.FC<{ admin: Admin; onBack: () => void; onToggleStatus: (id: string) => void }> = ({ admin, onBack, onToggleStatus }) => {
  return (
    <div style={{ fontFamily: FONT, padding: 32, minHeight: '100vh' }}>
      <button onClick={onBack} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
        border: 'none', borderRadius: 8, backgroundColor: '#fff', color: NAVY,
        fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24,
      }}>
        <ArrowLeft size={16} /> Back to Admin Accounts
      </button>

      {/* Header Card */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 28, marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, backgroundColor: NAVY,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 24, fontWeight: 700,
            }}>
              {admin.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: NAVY }}>{admin.name}</h2>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{admin.id}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13,
              fontWeight: 600, backgroundColor: roleBadge[admin.role].bg, color: roleBadge[admin.role].color,
            }}>{roleBadge[admin.role].label}</span>
            <span style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13,
              fontWeight: 600, backgroundColor: statusBadge[admin.status].bg, color: statusBadge[admin.status].color,
            }}>{admin.status === 'active' ? 'Active' : 'Disabled'}</span>
            <button onClick={() => onToggleStatus(admin.id)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: FONT,
              backgroundColor: admin.status === 'active' ? '#FFEBEE' : '#E8F5E9',
              color: admin.status === 'active' ? '#C62828' : '#2E7D32',
            }}>
              {admin.status === 'active' ? 'Disable Account' : 'Enable Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        {[
          { icon: <Mail size={16} color={GREEN} />, label: 'Email', value: admin.email },
          { icon: <Shield size={16} color={GREEN} />, label: 'Role', value: roleBadge[admin.role].label },
          { icon: <Shield size={16} color={GREEN} />, label: '2FA Status', value: admin.twoFactor ? 'Enabled' : 'Disabled' },
          { icon: <Calendar size={16} color={GREEN} />, label: 'Created', value: admin.createdAt },
          { icon: <Clock size={16} color={GREEN} />, label: 'Last Login', value: admin.lastLogin },
          { icon: <UserCog size={16} color={GREEN} />, label: 'Account Status', value: admin.status === 'active' ? 'Active' : 'Disabled' },
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: '#fff', borderRadius: 12, padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {item.icon}
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Permissions Card */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={18} color={GREEN} /> Permissions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { perm: 'View Dashboard', has: true },
            { perm: 'Manage Users', has: admin.role === 'super_admin' || admin.role === 'admin' },
            { perm: 'Manage Transactions', has: admin.role === 'super_admin' || admin.role === 'admin' },
            { perm: 'Approve KYC', has: admin.role === 'super_admin' || admin.role === 'admin' },
            { perm: 'Manage Settings', has: admin.role === 'super_admin' },
            { perm: 'Manage Admins', has: admin.role === 'super_admin' },
            { perm: 'View Audit Log', has: admin.role !== 'viewer' },
            { perm: 'Manage Exchange Rates', has: admin.role === 'super_admin' || admin.role === 'admin' },
          ].map(p => (
            <div key={p.perm} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 8, backgroundColor: p.has ? '#F0FFF4' : '#FFF5F5',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: p.has ? GREEN : '#C62828',
              }} />
              <span style={{ fontSize: 14, color: p.has ? '#2E7D32' : '#C62828', fontWeight: 500 }}>{p.perm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Add Admin Modal ───
const AddAdminModal: React.FC<{ onClose: () => void; onAdd: (admin: Admin) => void; nextId: string }> = ({ onClose, onAdd, nextId }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'admin' as Admin['role'] });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onAdd({
      id: nextId,
      name: form.name,
      email: form.email,
      role: form.role,
      status: 'active',
      twoFactor: false,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().slice(0, 10),
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB',
    borderRadius: 8, fontSize: 14, fontFamily: FONT, outline: 'none',
    color: '#1F2937', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 28, width: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: NAVY }}>Add New Admin</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4,
          }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Full Name</label>
            <input style={inputStyle} placeholder="Enter full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Email</label>
            <input style={inputStyle} type="email" placeholder="admin@moneyplus.cd" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Role</label>
            <select style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }} value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as Admin['role'] })}>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', borderRadius: 8, border: '1px solid #E5E7EB',
            backgroundColor: '#fff', color: '#374151', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONT,
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            backgroundColor: NAVY, color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONT,
            opacity: form.name.trim() && form.email.trim() ? 1 : 0.5,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={16} /> Add Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminAccounts() {
  const [adminList, setAdminList] = useState<Admin[]>(initialAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Admin['role']>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const filtered = adminList.filter(a => {
    const matchSearch = searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggleStatus = (id: string) => {
    setAdminList(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'active' ? 'disabled' as const : 'active' as const } : a
    ));
    if (selectedAdmin && selectedAdmin.id === id) {
      setSelectedAdmin(prev => prev ? { ...prev, status: prev.status === 'active' ? 'disabled' as const : 'active' as const } : null);
    }
  };

  const handleAddAdmin = (admin: Admin) => {
    setAdminList(prev => [admin, ...prev]);
    setShowAddModal(false);
  };

  const nextId = `ADM${String(adminList.length + 1).padStart(3, '0')}`;

  if (selectedAdmin) {
    const liveAdmin = adminList.find(a => a.id === selectedAdmin.id) || selectedAdmin;
    return <AdminDetail admin={liveAdmin} onBack={() => setSelectedAdmin(null)} onToggleStatus={handleToggleStatus} />;
  }

  const stats = [
    { label: 'Total Admins', value: adminList.length, icon: <UserCog size={22} color="#fff" />, bg: NAVY },
    { label: 'Active', value: adminList.filter(a => a.status === 'active').length, icon: <Shield size={22} color="#fff" />, bg: GREEN },
    { label: 'With 2FA', value: adminList.filter(a => a.twoFactor).length, icon: <Shield size={22} color="#fff" />, bg: '#1565C0' },
    { label: 'Disabled', value: adminList.filter(a => a.status === 'disabled').length, icon: <ToggleLeft size={22} color="#fff" />, bg: '#C62828' },
  ];

  return (
    <div style={{ fontFamily: FONT, padding: 32, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: NAVY }}>Admin Accounts</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>Manage administrator access and permissions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10,
          border: 'none', background: NAVY, color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: FONT,
        }}>
          <Plus size={16} /> Add Admin
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        {stats.map(card => (
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

      {/* Filters */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text" placeholder="Search by name or email..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E5E7EB',
              borderRadius: 8, fontSize: 14, fontFamily: FONT, outline: 'none', color: '#1F2937',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}
          style={{
            padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14,
            fontFamily: FONT, color: '#1F2937', backgroundColor: '#fff', cursor: 'pointer',
            outline: 'none', minWidth: 160,
          }}
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="support">Support</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['ID', 'Admin', 'Role', '2FA', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280',
                    fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(admin => (
                <tr key={admin.id} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}
                  onClick={() => setSelectedAdmin(admin)}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', color: NAVY, fontWeight: 600 }}>{admin.id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#1F2937' }}>{admin.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{admin.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12,
                      fontWeight: 600, backgroundColor: roleBadge[admin.role].bg, color: roleBadge[admin.role].color,
                    }}>{roleBadge[admin.role].label}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: admin.twoFactor ? '#E8F5E9' : '#FFF3E0',
                      color: admin.twoFactor ? '#2E7D32' : '#E65100',
                    }}>{admin.twoFactor ? 'Enabled' : 'Disabled'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12,
                      fontWeight: 600, backgroundColor: statusBadge[admin.status].bg,
                      color: statusBadge[admin.status].color,
                    }}>{admin.status === 'active' ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151', fontSize: 13 }}>{admin.lastLogin}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelectedAdmin(admin)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px',
                        border: `1px solid ${NAVY}`, borderRadius: 6, backgroundColor: 'transparent',
                        color: NAVY, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: 'pointer',
                      }}><Eye size={14} /> View</button>
                      <button onClick={() => handleToggleStatus(admin.id)}
                        title={admin.status === 'active' ? 'Disable' : 'Enable'} style={{
                        display: 'inline-flex', alignItems: 'center', padding: '6px 8px', border: 'none',
                        borderRadius: 6,
                        backgroundColor: admin.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                        color: admin.status === 'active' ? '#2E7D32' : '#C62828', cursor: 'pointer',
                      }}>
                        {admin.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
                    No admins found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddAdminModal onClose={() => setShowAddModal(false)} onAdd={handleAddAdmin} nextId={nextId} />}
    </div>
  );
}
