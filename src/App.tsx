import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import ChatSupport from './pages/ChatSupport';
import HelpArticles from './pages/HelpArticles';
import Login from './pages/Login';
import { ToastProvider } from './components/Toast';

interface AuthContextType {
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({ logout: () => {} });
export const useAuth = () => useContext(AuthContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('moneyplus_auth') === 'true';
  });

  const handleLogin = (token?: string) => {
    localStorage.setItem('moneyplus_auth', 'true');
    if (token) localStorage.setItem('moneyplus_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('moneyplus_auth');
    localStorage.removeItem('moneyplus_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <BrowserRouter>
          <Login onLogin={handleLogin} />
        </BrowserRouter>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AuthContext.Provider value={{ logout: handleLogout }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<Users />} />
              <Route path="agents" element={<Agents />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="kyc" element={<KycReview />} />
              <Route path="wallets" element={<Wallets />} />
              <Route path="cards-admin" element={<CardsAdmin />} />
              <Route path="splits" element={<SplitsAdmin />} />
              <Route path="chat-support" element={<ChatSupport />} />
              <Route path="help-articles" element={<HelpArticles />} />
              <Route path="exchange-rates" element={<ExchangeRates />} />
              <Route path="fees" element={<FeesCharges />} />
              <Route path="countries" element={<Countries />} />
              <Route path="settings" element={<Settings />} />
              <Route path="crypto-settings" element={<CryptoSettings />} />
              <Route path="admin-accounts" element={<AdminAccounts />} />
              <Route path="audit-log" element={<AuditLog />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ToastProvider>
  );
}

export default App;
