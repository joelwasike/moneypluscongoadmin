import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, Globe, Wifi } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const CardsAdmin: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.listCards().then(res => { if (res.success) setData(res.data); });
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700 }}>{t('cards.title')}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label={t('cards.totalCards')} value={data?.total || 0} color="#1B3A5C" icon={<CreditCard size={20} />} />
        <StatCard label={t('cards.virtualCards')} value={data?.virtual || 0} color="#43A047" icon={<Globe size={20} />} />
        <StatCard label={t('cards.physicalCards')} value={data?.physical || 0} color="#FF9800" icon={<CreditCard size={20} />} />
        <StatCard label={t('cards.frozenCards')} value={data?.frozen || 0} color="#C62828" icon={<Lock size={20} />} />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '2px solid #f0f0f0' }}>
            <th style={th}>{t('cards.columns.id')}</th><th style={th}>{t('cards.columns.userId')}</th><th style={th}>{t('cards.columns.cardHolder')}</th><th style={th}>{t('cards.columns.number')}</th><th style={th}>{t('cards.columns.type')}</th><th style={th}>{t('cards.columns.brand')}</th><th style={th}>{t('cards.columns.balance')}</th><th style={th}>{t('cards.columns.frozen')}</th><th style={th}>{t('cards.columns.online')}</th><th style={th}>{t('cards.columns.contactless')}</th>
          </tr></thead>
          <tbody>
            {(data?.cards || []).map((c: any) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={td}>#{c.id}</td>
                <td style={td}>#{c.user_id}</td>
                <td style={{ ...td, fontWeight: 600 }}>{c.card_holder}</td>
                <td style={td}>**** {c.card_number?.slice(-4)}</td>
                <td style={td}><span style={{ background: c.type === 'virtual' ? '#E3F2FD' : '#FFF3E0', color: c.type === 'virtual' ? '#1565C0' : '#E65100', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{c.type}</span></td>
                <td style={td}>{c.brand?.toUpperCase()}</td>
                <td style={{ ...td, fontWeight: 600 }}>{c.balance?.toLocaleString()} {c.currency}</td>
                <td style={td}>{c.is_frozen ? <Lock size={14} color="#C62828" /> : <span style={{ color: '#43A047' }}>{t('common.no')}</span>}</td>
                <td style={td}>{c.online_payments ? <Globe size={14} color="#43A047" /> : <span style={{ color: '#999' }}>{t('common.off')}</span>}</td>
                <td style={td}>{c.contactless ? <Wifi size={14} color="#43A047" /> : <span style={{ color: '#999' }}>{t('common.off')}</span>}</td>
              </tr>
            ))}
            {(!data?.cards || data.cards.length === 0) && <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#999' }}>{t('cards.noCards')}</td></tr>}
          </tbody>
        </table>
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

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' };
const td: React.CSSProperties = { padding: '10px 12px', fontSize: 13 };

export default CardsAdmin;
