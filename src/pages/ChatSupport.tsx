import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ChatSupport: React.FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');

  useEffect(() => { loadThreads(); }, []);

  const loadThreads = async () => {
    const res = await api.listChatThreads();
    if (res.success) setThreads(res.data || []);
  };

  const openThread = async (userId: number, thread: any) => {
    setSelectedThread(thread);
    const res = await api.getChatThread(userId);
    if (res.success) setMessages(res.data || []);
  };

  const sendReply = async () => {
    if (!reply.trim() || !selectedThread) return;
    await api.replyChat(selectedThread.user_id, reply);
    setReply('');
    const res = await api.getChatThread(selectedThread.user_id);
    if (res.success) setMessages(res.data || []);
  };

  if (selectedThread) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => setSelectedThread(null)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1B3A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>{selectedThread.user_name?.[0]}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{selectedThread.user_name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{selectedThread.user_email}</div>
          </div>
        </div>

        <div style={{ flex: 1, background: '#f5f5f5', borderRadius: 12, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.is_from_user ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '65%', padding: '10px 14px', borderRadius: 12,
                background: m.is_from_user ? '#fff' : '#1B3A5C',
                color: m.is_from_user ? '#333' : '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}>
                <div style={{ fontSize: 13 }}>{m.message}</div>
                <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: 'right' }}>{m.created_at?.slice(11, 16)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()} placeholder="Type a reply..." style={{ flex: 1, padding: '10px 16px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
          <button onClick={sendReply} style={{ background: '#1B3A5C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700 }}>Customer Support Chat</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Open Conversations" value={threads.length} color="#1B3A5C" icon={<MessageSquare size={20} />} />
        <StatCard label="Total Messages" value={threads.reduce((s, t) => s + t.message_count, 0)} color="#43A047" icon={<MessageSquare size={20} />} />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {threads.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>No chat conversations yet</div>}
        {threads.map((t, i) => (
          <div key={i} onClick={() => openThread(t.user_id, t)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fb')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#1B3A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>{t.user_name?.[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{t.user_name}</span>
                <span style={{ fontSize: 11, color: '#999' }}>{t.last_at}</span>
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>{t.last_message}</div>
            </div>
            <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{t.message_count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: any) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#666' }}>{label}</span>{icon && <span style={{ color }}>{icon}</span>}</div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color }}>{value}</div>
  </div>
);

export default ChatSupport;
