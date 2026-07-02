import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ArrowLeftRight,
  ShieldCheck,
  DollarSign,
  Receipt,
  Globe,
  Bitcoin,
  Settings,
  UserCog,
  FileText,
  UserCheck,
  Wallet,
  CreditCard,
  Split,
  MessageSquare,
  BookOpen,
  Store,
  Route,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SIDEBAR_WIDTH = 260;

const COLORS = {
  primary: '#1B3A5C',
  accent: '#43A047',
  textMuted: 'rgba(255,255,255,0.5)',
  textLight: 'rgba(255,255,255,0.85)',
  activeBackground: 'rgba(255,255,255,0.1)',
};

const ICON_SIZE = 18;

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: COLORS.primary,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    fontFamily: 'Inter, sans-serif',
    zIndex: 100,
  },
  logoContainer: {
    padding: '24px 20px 16px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  logo: {
    height: 36,
    objectFit: 'contain' as const,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '4px 10px',
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    padding: '16px 20px 6px',
    textTransform: 'uppercase' as const,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 20px',
    color: COLORS.textLight,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    borderLeft: '3px solid transparent',
    transition: 'background 0.15s, border-color 0.15s',
  },
  navLinkActive: {
    backgroundColor: COLORS.activeBackground,
    borderLeftColor: COLORS.accent,
    color: '#FFFFFF',
  },
};

const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: t('sidebar.main'),
      items: [
        { label: t('sidebar.dashboard'), path: '/dashboard', icon: <LayoutDashboard size={ICON_SIZE} /> },
        { label: t('sidebar.analytics'), path: '/analytics', icon: <BarChart3 size={ICON_SIZE} /> },
      ],
    },
    {
      title: t('sidebar.management'),
      items: [
        { label: t('sidebar.users'), path: '/users', icon: <Users size={ICON_SIZE} /> },
        { label: t('sidebar.agents'), path: '/agents', icon: <UserCheck size={ICON_SIZE} /> },
        { label: t('sidebar.agencies'), path: '/agencies', icon: <Store size={ICON_SIZE} /> },
        { label: t('sidebar.transactions'), path: '/transactions', icon: <ArrowLeftRight size={ICON_SIZE} /> },
        { label: t('sidebar.compliance'), path: '/compliance', icon: <AlertTriangle size={ICON_SIZE} /> },
        { label: t('sidebar.kycReview'), path: '/kyc', icon: <ShieldCheck size={ICON_SIZE} /> },
        { label: t('sidebar.wallets'), path: '/wallets', icon: <Wallet size={ICON_SIZE} /> },
        { label: t('sidebar.cards'), path: '/cards-admin', icon: <CreditCard size={ICON_SIZE} /> },
        { label: t('sidebar.splitPayments'), path: '/splits', icon: <Split size={ICON_SIZE} /> },
      ],
    },
    {
      title: t('sidebar.configuration'),
      items: [
        { label: t('sidebar.corridors'), path: '/corridors', icon: <Route size={ICON_SIZE} /> },
        { label: t('sidebar.exchangeRates'), path: '/exchange-rates', icon: <DollarSign size={ICON_SIZE} /> },
        { label: t('sidebar.feesCharges'), path: '/fees', icon: <Receipt size={ICON_SIZE} /> },
        { label: t('sidebar.countries'), path: '/countries', icon: <Globe size={ICON_SIZE} /> },
        { label: t('sidebar.cryptoSettings'), path: '/crypto-settings', icon: <Bitcoin size={ICON_SIZE} /> },
      ],
    },
    {
      title: t('sidebar.support'),
      items: [
        { label: t('sidebar.chatSupport'), path: '/chat-support', icon: <MessageSquare size={ICON_SIZE} /> },
        { label: t('sidebar.helpArticles'), path: '/help-articles', icon: <BookOpen size={ICON_SIZE} /> },
      ],
    },
    {
      title: t('sidebar.system'),
      items: [
        { label: t('sidebar.settings'), path: '/settings', icon: <Settings size={ICON_SIZE} /> },
        { label: t('sidebar.adminAccounts'), path: '/admin-accounts', icon: <UserCog size={ICON_SIZE} /> },
        { label: t('sidebar.auditLog'), path: '/audit-log', icon: <FileText size={ICON_SIZE} /> },
      ],
    },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="Money Plus" style={styles.logo} />
      </div>

      <nav>
        {sections.map((section) => (
          <div key={section.title}>
            <div style={styles.sectionTitle}>{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export { SIDEBAR_WIDTH };
export default Sidebar;
