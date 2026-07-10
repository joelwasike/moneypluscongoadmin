import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import KycReview from './pages/KycReview';
import ExchangeRates from './pages/ExchangeRates';
import FeesCharges from './pages/FeesCharges';
import Countries from './pages/Countries';
import Settings from './pages/Settings';
import CryptoSettings from './pages/CryptoSettings';
import AdminAccounts from './pages/AdminAccounts';
import AuditLog from './pages/AuditLog';
import Profile from './pages/Profile';
import Agents from './pages/Agents';
import Wallets from './pages/Wallets';
import CardsAdmin from './pages/CardsAdmin';
import SplitsAdmin from './pages/SplitsAdmin';
import Corridors from './pages/Corridors';
import ChatSupport from './pages/ChatSupport';
import HelpArticles from './pages/HelpArticles';
import Login from './pages/Login';
import Agencies from './pages/Agencies';
import Compliance from './pages/Compliance';
import { ToastProvider } from './components/Toast';
import {
  AdminRole,
  ROLE_HOME,
  canAccessPath,
  normalizeAdminRole,
} from './auth/adminAccess';

interface AuthContextType {
  logout: () => void;
  role: AdminRole;
  setRole: (role: AdminRole) => void;
  homePath: string;
}

export const AuthContext = createContext<AuthContextType>({
  logout: () => {},
  role: 'super_admin',
  setRole: () => {},
  homePath: ROLE_HOME.super_admin,
});
export const useAuth = () => useContext(AuthContext);

const RoleGuard: React.FC<{ path: string; children: React.ReactNode }> = ({ path, children }) => {
  const { role, homePath } = useAuth();
  if (!canAccessPath(role, path)) {
    return <Navigate to={homePath} replace />;
  }
  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('moneyplus_auth') === 'true';
  });
  const [role, setRoleState] = useState<AdminRole>(() => normalizeAdminRole(localStorage.getItem('moneyplus_role')));

  const handleLogin = (token?: string, nextRole?: AdminRole) => {
    localStorage.setItem('moneyplus_auth', 'true');
    if (token) localStorage.setItem('moneyplus_token', token);
    const normalizedRole = normalizeAdminRole(nextRole);
    localStorage.setItem('moneyplus_role', normalizedRole);
    setRoleState(normalizedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('moneyplus_auth');
    localStorage.removeItem('moneyplus_token');
    localStorage.removeItem('moneyplus_role');
    setRoleState('super_admin');
    setIsAuthenticated(false);
  };

  const setRole = (nextRole: AdminRole) => {
    const normalizedRole = normalizeAdminRole(nextRole);
    localStorage.setItem('moneyplus_role', normalizedRole);
    setRoleState(normalizedRole);
  };

  const homePath = ROLE_HOME[role];

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <Login onLogin={handleLogin} />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ToastProvider>
      <AuthContext.Provider value={{ logout: handleLogout, role, setRole, homePath }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Navigate to={homePath} replace />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to={homePath} replace />} />
              <Route path="dashboard" element={<RoleGuard path="/dashboard"><Dashboard /></RoleGuard>} />
              <Route path="dashboard/finance" element={<RoleGuard path="/dashboard/finance"><Dashboard /></RoleGuard>} />
              <Route path="dashboard/compliance" element={<RoleGuard path="/dashboard/compliance"><Dashboard /></RoleGuard>} />
              <Route path="dashboard/support" element={<RoleGuard path="/dashboard/support"><Dashboard /></RoleGuard>} />
              <Route path="analytics" element={<RoleGuard path="/analytics"><Analytics /></RoleGuard>} />
              <Route path="users" element={<RoleGuard path="/users"><Users /></RoleGuard>} />
              <Route path="users/:id" element={<RoleGuard path="/users"><Users /></RoleGuard>} />
              <Route path="agents" element={<RoleGuard path="/agents"><Agents /></RoleGuard>} />
              <Route path="agencies" element={<RoleGuard path="/agencies"><Agencies /></RoleGuard>} />
              <Route path="transactions" element={<RoleGuard path="/transactions"><Transactions /></RoleGuard>} />
              <Route path="compliance" element={<RoleGuard path="/compliance"><Compliance /></RoleGuard>} />
              <Route path="kyc" element={<RoleGuard path="/kyc"><KycReview /></RoleGuard>} />
              <Route path="wallets" element={<RoleGuard path="/wallets"><Wallets /></RoleGuard>} />
              <Route path="cards" element={<RoleGuard path="/cards"><CardsAdmin /></RoleGuard>} />
              <Route path="splits" element={<RoleGuard path="/splits"><SplitsAdmin /></RoleGuard>} />
              <Route path="corridors" element={<RoleGuard path="/corridors"><Corridors /></RoleGuard>} />
              <Route path="chat-support" element={<RoleGuard path="/chat-support"><ChatSupport /></RoleGuard>} />
              <Route path="help-articles" element={<RoleGuard path="/help-articles"><HelpArticles /></RoleGuard>} />
              <Route path="exchange-rates" element={<RoleGuard path="/exchange-rates"><ExchangeRates /></RoleGuard>} />
              <Route path="fees" element={<RoleGuard path="/fees"><FeesCharges /></RoleGuard>} />
              <Route path="countries" element={<RoleGuard path="/countries"><Countries /></RoleGuard>} />
              <Route path="settings" element={<RoleGuard path="/settings"><Settings /></RoleGuard>} />
              <Route path="crypto-settings" element={<RoleGuard path="/crypto-settings"><CryptoSettings /></RoleGuard>} />
              <Route path="admin-accounts" element={<RoleGuard path="/admin-accounts"><AdminAccounts /></RoleGuard>} />
              <Route path="audit-log" element={<RoleGuard path="/audit-log"><AuditLog /></RoleGuard>} />
              <Route path="profile" element={<RoleGuard path="/profile"><Profile /></RoleGuard>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
