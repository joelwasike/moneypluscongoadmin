import React, { createContext, useContext, useState } from 'react';
import { translations, Language } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('moneyplus_lang') as Language) || 'fr';
  });

  const setLang = (newLang: Language) => {
    localStorage.setItem('moneyplus_lang', newLang);
    setLangState(newLang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[lang];
    for (const k of keys) {
      if (current == null) return key;
      current = current[k];
    }
    return typeof current === 'string' ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
