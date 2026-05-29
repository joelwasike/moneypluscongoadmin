import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../components/Toast';

const NAVY = '#1B3A5C';
const GREEN = '#43A047';
const FONT = "'Inter', sans-serif";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#fff',
      fontFamily: FONT,
    }}>
      <div style={{
        width: 420, backgroundColor: '#fff', borderRadius: 20,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '36px 40px 28px', textAlign: 'center',
          background: 'linear-gradient(135deg, #1B3A5C 0%, #254d73 100%)',
        }}>
          <img
            src="/logo.png"
            alt="Money Plus"
            style={{
              height: 44, objectFit: 'contain',
              backgroundColor: '#fff', borderRadius: 10, padding: '6px 14px',
            }}
          />
          <h1 style={{ margin: '16px 0 0', fontSize: 22, fontWeight: 700, color: '#fff' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            Sign in to manage your platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px 40px 40px' }}>
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, backgroundColor: '#FFEBEE',
              color: '#C62828', fontSize: 13, fontWeight: 500, marginBottom: 20,
              border: '1px solid #FFCDD2',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8,
              display: 'block',
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: 12 }} />
              <input
                type="email"
                placeholder="admin@moneyplus.cd"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 44px',
                  border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14,
                  fontFamily: FONT, outline: 'none', color: '#1F2937',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = NAVY)}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              Password
              <span style={{
                fontSize: 12, color: GREEN, fontWeight: 500, cursor: 'pointer',
              }}
                onClick={() => showToast('Password reset link sent to your email.', 'info')}
              >
                Forgot password?
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: 12 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px 44px 12px 44px',
                  border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14,
                  fontFamily: FONT, outline: 'none', color: '#1F2937',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = NAVY)}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: 10, background: 'none',
                  border: 'none', cursor: 'pointer', padding: 2, color: '#9CA3AF',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
              backgroundColor: NAVY, color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: FONT,
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{
            marginTop: 24, textAlign: 'center', fontSize: 12, color: '#9CA3AF',
          }}>
            Money+ Congo Admin Panel v1.0
          </div>
        </form>
      </div>
    </div>
  );
}
