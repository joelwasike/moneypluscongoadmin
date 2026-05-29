import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

let toastId = 0;

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const colors: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: '#F0FFF4', border: '#C6F6D5', text: '#22543D', icon: '#38A169' },
  error: { bg: '#FFF5F5', border: '#FED7D7', text: '#742A2A', icon: '#E53E3E' },
  warning: { bg: '#FFFAF0', border: '#FEEBC8', text: '#744210', icon: '#DD6B20' },
  info: { bg: '#EBF8FF', border: '#BEE3F8', text: '#2A4365', icon: '#3182CE' },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const c = colors[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        minWidth: 320,
        maxWidth: 420,
        fontFamily: "'Inter', sans-serif",
        animation: exiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease forwards',
      }}
    >
      <span style={{ color: c.icon, flexShrink: 0, display: 'flex' }}>{icons[toast.type]}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: c.text, lineHeight: 1.4 }}>
        {toast.message}
      </span>
      <button
        onClick={handleDismiss}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: c.text,
          opacity: 0.5,
          padding: 2,
          display: 'flex',
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast CSS animations */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(40px); }
        }
      `}</style>

      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
