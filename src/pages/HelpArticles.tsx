import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import api from '../services/api';

const HelpArticles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: '', question: '', answer: '', order_num: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await api.listHelpArticles();
    if (res.success) setArticles(res.data || []);
  };

  const addArticle = async () => {
    await api.createHelpArticle(form);
    setForm({ category: '', question: '', answer: '', order_num: 0 });
    setShowAdd(false);
    load();
  };

  const saveEdit = async (id: number) => {
    const article = articles.find(a => a.id === id);
    if (article) await api.updateHelpArticle(id, article);
    setEditingId(null);
    load();
  };

  const deleteArticle = async (id: number) => {
    if (window.confirm('Delete this article?')) {
      await api.deleteHelpArticle(id);
      load();
    }
  };

  const categories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Help Articles & FAQs</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: '#1B3A5C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <Plus size={16} /> Add Article
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Articles" value={articles.length} color="#1B3A5C" icon={<BookOpen size={20} />} />
        <StatCard label="Categories" value={categories.length} color="#43A047" />
        <StatCard label="Most Articles" value={categories.sort((a, b) => articles.filter(x => x.category === b).length - articles.filter(x => x.category === a).length)[0] || '-'} color="#FF9800" />
      </div>

      {showAdd && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>New Article</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={input} />
            <input placeholder="Order" type="number" value={form.order_num} onChange={e => setForm({ ...form, order_num: Number(e.target.value) })} style={input} />
          </div>
          <input placeholder="Question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} style={{ ...input, marginTop: 12, width: '100%' }} />
          <textarea placeholder="Answer" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} rows={3} style={{ ...input, marginTop: 12, width: '100%', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={addArticle} style={{ background: '#43A047', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Save size={14} /> Save</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#f5f5f5', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      {categories.map(cat => (
        <div key={cat} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1B3A5C' }}>{cat} <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '2px 8px', borderRadius: 10, fontSize: 12, marginLeft: 8 }}>{articles.filter(a => a.category === cat).length}</span></h3>
          {articles.filter(a => a.category === cat).map(article => (
            <div key={article.id} style={{ padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
              {editingId === article.id ? (
                <div>
                  <input value={article.question} onChange={e => setArticles(articles.map(a => a.id === article.id ? { ...a, question: e.target.value } : a))} style={{ ...input, width: '100%', marginBottom: 8 }} />
                  <textarea value={article.answer} onChange={e => setArticles(articles.map(a => a.id === article.id ? { ...a, answer: e.target.value } : a))} rows={2} style={{ ...input, width: '100%', resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => saveEdit(article.id)} style={{ background: '#43A047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ background: '#f5f5f5', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{article.question}</div>
                    <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{article.answer}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
                    <button onClick={() => setEditingId(article.id)} style={iconBtn}><Pencil size={14} /></button>
                    <button onClick={() => deleteArticle(article.id)} style={{ ...iconBtn, color: '#C62828' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      {articles.length === 0 && <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#999' }}>No help articles yet. Click "Add Article" to create one.</div>}
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: any) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#666' }}>{label}</span>{icon && <span style={{ color }}>{icon}</span>}</div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color }}>{value}</div>
  </div>
);

const input: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 };
const iconBtn: React.CSSProperties = { background: 'none', border: '1px solid #e0e0e0', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#666' };

export default HelpArticles;
