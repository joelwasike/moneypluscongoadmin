import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import { adminNotifications } from '../data/mockData';
import { useAuth } from '../App';

const COLORS = {
  background: '#F5F7FA',
  accent: '#43A047',
  primary: '#1B3A5C',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  white: '#FFFFFF',
  red: '#EF4444',
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
  },
  main: {
    marginLeft: SIDEBAR_WIDTH,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.background,
    minHeight: '100vh',
  },
  header: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    padding: '0 28px',
    backgroundColor: COLORS.white,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  searchContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: 12,
    color: COLORS.textSecondary,
    pointerEvents: 'none' as const,
  },
  searchInput: {
    width: 320,
    height: 40,
    paddingLeft: 40,
    paddingRight: 16,
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    color: COLORS.textPrimary,
    backgroundColor: '#F8FAFC',
    outline: 'none',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  notificationButton: {
    position: 'relative' as const,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textSecondary,
  },
  badge: {
    position: 'absolute' as const,
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: COLORS.red,
    border: `2px solid ${COLORS.white}`,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  content: {
    flex: 1,
    padding: 28,
  },
};

const typeColors: Record<string, { bg: string; color: string }> = {
  info: { bg: '#E3F2FD', color: '#1565C0' },
  warning: { bg: '#FFF3E0', color: '#E65100' },
  error: { bg: '#FFEBEE', color: '#C62828' },
  success: { bg: '#E8F5E9', color: '#2E7D32' },
};

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(adminNotifications.map(n => ({ ...n })));
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <header style={styles.header}>
          <div style={styles.searchContainer}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.headerRight}>
            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                style={styles.notificationButton}
                aria-label="Notifications"
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span style={styles.badge} />}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  width: 380, backgroundColor: '#fff', borderRadius: 12,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.12)', overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                }}>
                  <div style={{
                    padding: '14px 16px', borderBottom: '1px solid #E5E7EB',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.primary }}>
                      Notifications {unreadCount > 0 && <span style={{
                        fontSize: 12, backgroundColor: COLORS.red, color: '#fff',
                        padding: '2px 8px', borderRadius: 10, marginLeft: 6,
                      }}>{unreadCount}</span>}
                    </span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{
                        background: 'none', border: 'none', color: '#1565C0',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>Mark all read</button>
                    )}
                  </div>
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markAsRead(n.id)} style={{
                        padding: '12px 16px', borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer', backgroundColor: n.read ? '#fff' : '#F8FAFC',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = n.read ? '#fff' : '#F8FAFC')}
                      >
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{
                            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: n.read ? 'transparent' : COLORS.red,
                            marginTop: 6, flexShrink: 0,
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary }}>{n.title}</span>
                              <span style={{
                                display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 10,
                                fontWeight: 600, backgroundColor: typeColors[n.type]?.bg || '#ECEFF1',
                                color: typeColors[n.type]?.color || '#546E7A', textTransform: 'capitalize',
                              }}>{n.type}</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{n.message}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{n.createdAt}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div
                style={styles.avatar}
                title="Admin"
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              >
                A
              </div>

              {showProfile && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  width: 220, backgroundColor: '#fff', borderRadius: 12,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.12)', overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ fontWeight: 600, color: COLORS.primary, fontSize: 14 }}>Joel Wasike</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Super Admin</div>
                  </div>
                  <div>
                    <button onClick={() => { navigate('/profile'); setShowProfile(false); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                      color: COLORS.textPrimary, fontSize: 13, fontWeight: 500, width: '100%',
                      background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User size={16} color="#6B7280" /> My Profile
                    </button>
                    <button onClick={() => { navigate('/settings'); setShowProfile(false); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                      color: COLORS.textPrimary, fontSize: 13, fontWeight: 500, width: '100%',
                      background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Settings size={16} color="#6B7280" /> Settings
                    </button>
                    <div style={{ borderTop: '1px solid #F3F4F6' }}>
                      <button style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                        color: '#C62828', fontSize: 13, fontWeight: 500, background: 'none',
                        border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'Inter, sans-serif',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => { setShowProfile(false); logout(); }}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
